"""
routes.py - Endpoints FastAPI para sistema de placeholders dinâmicos

Endpoints:
- GET /api/template-placeholders - Retorna metadados dos templates
- POST /api/generate-report-with-fields - Gera relatório preenchido
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime
from pathlib import Path
import logging
import os

from word_utils import (
    extract_placeholders,
    substitute_placeholders,
    get_template_metadata,
    validate_substitutions,
    EXPECTED_PLACEHOLDERS
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["placeholders"])

# Configurações
TEMPLATES_DIR = Path(__file__).parent / "templates"
OUTPUTS_DIR = Path(__file__).parent / "outputs"
OUTPUTS_DIR.mkdir(exist_ok=True)


# ============================================================================
# MODELOS PYDANTIC (Validação de dados)
# ============================================================================

class TemplateField(BaseModel):
    """Descrição de um campo no template"""
    label: str
    type: str
    required: bool
    example: str
    category: str
    auto_fill: Optional[bool] = False


class TemplateMetadata(BaseModel):
    """Metadados de um template"""
    name: str
    code: str
    agency: str
    placeholders: List[str]
    dynamic_fields: List[str]
    fixed_fields: List[str]
    fields: Dict[str, TemplateField]


class ReportGenerationRequest(BaseModel):
    """Requisição para gerar relatório com campos preenchidos"""
    template_name: str  # Ex: "MODELO - 3575 - TANGARA DA SERRA.docx"
    nr_os: str
    data_atendimento: str
    agencia_codigo: Optional[str] = None
    agencia_nome: Optional[str] = None
    endereco: Optional[str] = None
    responsavel_dependencia: Optional[str] = None
    data_elaboracao: Optional[str] = None  # Auto-preenchido se não fornecido


class ReportGenerationResponse(BaseModel):
    """Resposta da geração de relatório"""
    success: bool
    message: str
    document_url: Optional[str] = None
    substitutions_made: Optional[int] = None
    errors: Optional[List[str]] = None
    warnings: Optional[List[str]] = None


class ValidationResult(BaseModel):
    """Resultado da validação"""
    valid: bool
    errors: List[str]
    warnings: List[str]
    missing: List[str]


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.get("/templates")
def list_templates() -> List[str]:
    """
    Lista todos os templates disponíveis.

    Returns:
        Lista de nomes de templates (.docx)
    """
    try:
        if not TEMPLATES_DIR.exists():
            return []

        templates = [f.name for f in TEMPLATES_DIR.glob("*.docx")]
        return sorted(templates)

    except Exception as e:
        logger.error(f"Erro ao listar templates: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/template-placeholders/{template_name}")
def get_template_placeholders(template_name: str) -> TemplateMetadata:
    """
    Retorna metadados e placeholders de um template específico.

    Args:
        template_name: Nome do template (ex: "MODELO - 3575 - TANGARA DA SERRA.docx")

    Returns:
        TemplateMetadata com informações do template e campos esperados
    """
    try:
        # 1. Validar se template existe
        template_path = TEMPLATES_DIR / template_name
        if not template_path.exists():
            raise HTTPException(status_code=404, detail=f"Template não encontrado: {template_name}")

        # 2. Extrair placeholders
        extracted = extract_placeholders(str(template_path))

        # 3. Obter metadados
        metadata = get_template_metadata(template_name)

        # 4. Verificar integridade
        if extracted['missing']:
            logger.warning(
                f"Template {template_name} tem placeholders faltando: {extracted['missing']}"
            )

        # 5. Montar resposta
        response = TemplateMetadata(
            name=metadata['name'],
            code=metadata['code'],
            agency=metadata['agency'],
            placeholders=list(metadata['placeholders']),
            dynamic_fields=metadata['dynamic_fields'],
            fixed_fields=metadata['fixed_fields'],
            fields={
                field_name: TemplateField(
                    label=field_config['label'],
                    type=field_config['type'],
                    required=field_config['required'],
                    example=field_config['example'],
                    category=field_config['category'],
                    auto_fill=field_config.get('auto_fill', False)
                )
                for field_name, field_config in metadata['fields'].items()
            }
        )

        logger.info(f"✓ Retornados placeholders de {template_name}")
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao obter placeholders: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/validate-fields")
def validate_fields(
    template_name: str,
    data: Dict[str, str]
) -> ValidationResult:
    """
    Valida se os campos fornecidos são válidos para um template.

    Args:
        template_name: Nome do template
        data: Dict com campos e valores a validar

    Returns:
        ValidationResult com detalhes de validação
    """
    try:
        validation = validate_substitutions(template_name, data)

        return ValidationResult(
            valid=validation['valid'],
            errors=validation['errors'],
            warnings=validation['warnings'],
            missing=list(validation['missing'])
        )

    except Exception as e:
        logger.error(f"Erro ao validar campos: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-report-with-fields")
def generate_report_with_fields(request: ReportGenerationRequest) -> ReportGenerationResponse:
    """
    Gera um relatório Word preenchido com os campos fornecidos.

    Args:
        request: ReportGenerationRequest com template e campos

    Returns:
        ReportGenerationResponse com URL do documento gerado
    """
    try:
        # 1. Validar se template existe
        template_path = TEMPLATES_DIR / request.template_name
        if not template_path.exists():
            return ReportGenerationResponse(
                success=False,
                message=f"Template não encontrado: {request.template_name}",
                errors=[f"Template não encontrado: {request.template_name}"]
            )

        # 2. Preparar dados de substituição
        # Auto-preencher data_elaboracao se não fornecida
        data_elaboracao = request.data_elaboracao or datetime.now().strftime('%Y-%m-%d')

        substitutions = {
            'nr_os': request.nr_os,
            'data_elaboracao': data_elaboracao,
            'data_atendimento': request.data_atendimento,
            'agencia_codigo': request.agencia_codigo or "",
            'agencia_nome': request.agencia_nome or "",
            'endereco': request.endereco or "",
            'responsavel_dependencia': request.responsavel_dependencia or ""
        }

        # 3. Validar dados
        validation = validate_substitutions(request.template_name, substitutions)
        if not validation['valid']:
            return ReportGenerationResponse(
                success=False,
                message="Validação falhou",
                errors=validation['errors'],
                warnings=validation['warnings']
            )

        # 4. Gerar nome do arquivo de saída
        output_filename = f"RELATORIO_{request.nr_os}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx"
        output_path = OUTPUTS_DIR / output_filename

        # 5. Substituir placeholders
        result = substitute_placeholders(
            template_path=str(template_path),
            output_path=str(output_path),
            substitutions=substitutions,
            validate=True
        )

        # 6. Montar resposta
        return ReportGenerationResponse(
            success=result['success'],
            message=f"Relatório gerado com sucesso: {output_filename}",
            document_url=f"/api/download/{output_filename}",
            substitutions_made=result['substitutions_made'],
            warnings=validation['warnings']
        )

    except Exception as e:
        logger.error(f"Erro ao gerar relatório: {str(e)}")
        return ReportGenerationResponse(
            success=False,
            message=f"Erro ao gerar relatório: {str(e)}",
            errors=[str(e)]
        )


@router.get("/download/{filename}")
def download_report(filename: str) -> FileResponse:
    """
    Faz download de um relatório gerado.

    Args:
        filename: Nome do arquivo (.docx)

    Returns:
        Arquivo para download
    """
    try:
        file_path = OUTPUTS_DIR / filename

        if not file_path.exists():
            raise HTTPException(status_code=404, detail=f"Arquivo não encontrado: {filename}")

        # Validar que o arquivo está em OUTPUTS_DIR (prevenir path traversal)
        if not str(file_path.resolve()).startswith(str(OUTPUTS_DIR.resolve())):
            raise HTTPException(status_code=403, detail="Acesso negado")

        logger.info(f"✓ Download iniciado: {filename}")

        return FileResponse(
            path=file_path,
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao fazer download: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
def health_check() -> Dict:
    """
    Verifica saúde do serviço.

    Returns:
        Status do serviço
    """
    templates_count = len(list(TEMPLATES_DIR.glob("*.docx"))) if TEMPLATES_DIR.exists() else 0

    return {
        "status": "healthy",
        "version": "3.2",
        "templates_available": templates_count,
        "templates_dir": str(TEMPLATES_DIR),
        "outputs_dir": str(OUTPUTS_DIR)
    }


# ============================================================================
# ROTAS AUXILIARES (Administração)
# ============================================================================

@router.get("/templates-info")
def templates_info() -> Dict:
    """
    Retorna informações detalhadas sobre todos os templates.

    Returns:
        Dict com metadados de todos os templates
    """
    try:
        templates = list(TEMPLATES_DIR.glob("*.docx")) if TEMPLATES_DIR.exists() else []

        templates_data = {}

        for template_file in templates:
            template_name = template_file.name
            try:
                extracted = extract_placeholders(str(template_file))
                metadata = get_template_metadata(template_name)

                templates_data[template_name] = {
                    'code': metadata['code'],
                    'agency': metadata['agency'],
                    'placeholders_found': extracted['total_found'],
                    'placeholders_expected': extracted['total_expected'],
                    'status': '✅' if extracted['total_found'] == extracted['total_expected'] else '⚠️',
                    'missing': list(extracted['missing']) if extracted['missing'] else [],
                    'file_size_kb': template_file.stat().st_size / 1024
                }
            except Exception as e:
                templates_data[template_name] = {'error': str(e)}

        return {
            'total_templates': len(templates),
            'templates': templates_data
        }

    except Exception as e:
        logger.error(f"Erro ao obter informações: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

