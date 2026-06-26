"""
test_routes.py - Testes para endpoints FastAPI

Testes para:
- GET /api/templates
- GET /api/template-placeholders
- POST /api/validate-fields
- POST /api/generate-report-with-fields
- GET /api/download
- GET /api/health
"""

import pytest
import tempfile
from pathlib import Path
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch

# Importar a aplicação FastAPI
# NOTA: Adaptar conforme estrutura real do seu server.py
try:
    from server import app
    client = TestClient(app)
    APP_AVAILABLE = True
except ImportError:
    APP_AVAILABLE = False


# ============================================================================
# FIXTURES
# ============================================================================

@pytest.fixture
def valid_report_data():
    """Dados válidos para gerar relatório"""
    return {
        "template_name": "MODELO - 3575 - TANGARA DA SERRA.docx",
        "nr_os": "1753",
        "data_atendimento": "2026-05-01",
        "agencia_codigo": "3575",
        "agencia_nome": "TANGARA DA SERRA",
        "endereco": "Avenida Brasil, 1000 - Tangará da Serra, MT",
        "responsavel_dependencia": "123456 - João Silva"
    }


# ============================================================================
# TESTES: GET /api/templates
# ============================================================================

@pytest.mark.skipif(not APP_AVAILABLE, reason="FastAPI app não disponível")
class TestTemplatesEndpoint:
    """Testes para GET /api/templates"""

    def test_templates_returns_200(self):
        """Deve retornar status 200"""
        response = client.get("/api/templates")
        assert response.status_code == 200

    def test_templates_returns_list(self):
        """Deve retornar uma lista"""
        response = client.get("/api/templates")
        data = response.json()
        assert isinstance(data, list)

    def test_templates_list_contains_strings(self):
        """Lista deve conter strings (nomes de templates)"""
        response = client.get("/api/templates")
        data = response.json()
        
        if len(data) > 0:
            assert all(isinstance(item, str) for item in data)
            assert all(item.endswith('.docx') for item in data)

    def test_templates_list_not_empty(self):
        """Lista não deve estar vazia (assumindo templates existem)"""
        response = client.get("/api/templates")
        data = response.json()
        assert len(data) >= 9  # Pelo menos 9 templates esperados


# ============================================================================
# TESTES: GET /api/template-placeholders/{template_name}
# ============================================================================

@pytest.mark.skipif(not APP_AVAILABLE, reason="FastAPI app não disponível")
class TestTemplateMetadataEndpoint:
    """Testes para GET /api/template-placeholders/{template_name}"""

    def test_template_placeholders_returns_200(self):
        """Deve retornar status 200 para template válido"""
        response = client.get("/api/template-placeholders/MODELO%20-%203575%20-%20TANGARA%20DA%20SERRA.docx")
        assert response.status_code == 200

    def test_template_placeholders_returns_object(self):
        """Deve retornar um objeto JSON"""
        response = client.get("/api/template-placeholders/MODELO%20-%203575%20-%20TANGARA%20DA%20SERRA.docx")
        data = response.json()
        assert isinstance(data, dict)

    def test_template_placeholders_has_required_fields(self):
        """Resposta deve ter campos obrigatórios"""
        response = client.get("/api/template-placeholders/MODELO%20-%203575%20-%20TANGARA%20DA%20SERRA.docx")
        data = response.json()
        
        required_fields = ['name', 'code', 'agency', 'placeholders', 'fields', 
                          'dynamic_fields', 'fixed_fields']
        for field in required_fields:
            assert field in data, f"Campo '{field}' não encontrado"

    def test_template_placeholders_404_for_nonexistent(self):
        """Deve retornar 404 para template que não existe"""
        response = client.get("/api/template-placeholders/INEXISTENTE.docx")
        assert response.status_code == 404

    def test_template_placeholders_code_extracted(self):
        """Deve extrair código da agência"""
        response = client.get("/api/template-placeholders/MODELO%20-%203575%20-%20TANGARA%20DA%20SERRA.docx")
        data = response.json()
        assert data['code'] == '3575'

    def test_template_placeholders_agency_extracted(self):
        """Deve extrair nome da agência"""
        response = client.get("/api/template-placeholders/MODELO%20-%203575%20-%20TANGARA%20DA%20SERRA.docx")
        data = response.json()
        assert data['agency'] == 'TANGARA DA SERRA'

    def test_template_placeholders_has_7_fields(self):
        """Deve ter 7 placeholders"""
        response = client.get("/api/template-placeholders/MODELO%20-%203575%20-%20TANGARA%20DA%20SERRA.docx")
        data = response.json()
        assert len(data['placeholders']) == 7
        assert len(data['fields']) == 7


# ============================================================================
# TESTES: POST /api/validate-fields
# ============================================================================

@pytest.mark.skipif(not APP_AVAILABLE, reason="FastAPI app não disponível")
class TestValidateFieldsEndpoint:
    """Testes para POST /api/validate-fields"""

    def test_validate_fields_returns_200(self, valid_report_data):
        """Deve retornar status 200"""
        payload = {
            "template_name": valid_report_data["template_name"],
            "data": {k: v for k, v in valid_report_data.items() if k != "template_name"}
        }
        response = client.post("/api/validate-fields", json=payload)
        assert response.status_code == 200

    def test_validate_fields_valid_data(self, valid_report_data):
        """Dados válidos devem ter valid=True"""
        payload = {
            "template_name": valid_report_data["template_name"],
            "data": {k: v for k, v in valid_report_data.items() if k != "template_name"}
        }
        response = client.post("/api/validate-fields", json=payload)
        data = response.json()
        
        assert data['valid'] is True
        assert len(data['errors']) == 0

    def test_validate_fields_missing_field_error(self, valid_report_data):
        """Falta de campo deve resultar em erro"""
        payload = {
            "template_name": valid_report_data["template_name"],
            "data": {k: v for k, v in valid_report_data.items() 
                    if k not in ["template_name", "nr_os"]}
        }
        response = client.post("/api/validate-fields", json=payload)
        data = response.json()
        
        assert data['valid'] is False
        assert len(data['errors']) > 0

    def test_validate_fields_has_required_keys(self, valid_report_data):
        """Resposta deve ter chaves obrigatórias"""
        payload = {
            "template_name": valid_report_data["template_name"],
            "data": {k: v for k, v in valid_report_data.items() if k != "template_name"}
        }
        response = client.post("/api/validate-fields", json=payload)
        data = response.json()
        
        required_keys = ['valid', 'errors', 'warnings', 'missing']
        for key in required_keys:
            assert key in data


# ============================================================================
# TESTES: POST /api/generate-report-with-fields
# ============================================================================

@pytest.mark.skipif(not APP_AVAILABLE, reason="FastAPI app não disponível")
class TestGenerateReportEndpoint:
    """Testes para POST /api/generate-report-with-fields"""

    def test_generate_report_returns_200(self, valid_report_data):
        """Deve retornar status 200 para dados válidos"""
        response = client.post("/api/generate-report-with-fields", json=valid_report_data)
        assert response.status_code == 200

    def test_generate_report_returns_object(self, valid_report_data):
        """Deve retornar um objeto JSON"""
        response = client.post("/api/generate-report-with-fields", json=valid_report_data)
        data = response.json()
        assert isinstance(data, dict)

    def test_generate_report_success_field(self, valid_report_data):
        """Resposta deve ter campo 'success'"""
        response = client.post("/api/generate-report-with-fields", json=valid_report_data)
        data = response.json()
        assert 'success' in data
        assert isinstance(data['success'], bool)

    def test_generate_report_has_message(self, valid_report_data):
        """Resposta deve ter mensagem"""
        response = client.post("/api/generate-report-with-fields", json=valid_report_data)
        data = response.json()
        assert 'message' in data
        assert isinstance(data['message'], str)

    def test_generate_report_success_has_document_url(self, valid_report_data):
        """Se sucesso, deve ter document_url"""
        response = client.post("/api/generate-report-with-fields", json=valid_report_data)
        data = response.json()
        
        if data['success']:
            assert 'document_url' in data
            assert data['document_url'] is not None

    def test_generate_report_missing_field_error(self, valid_report_data):
        """Dados inválidos (falta campo) devem ter success=False"""
        invalid_data = valid_report_data.copy()
        del invalid_data['nr_os']
        
        response = client.post("/api/generate-report-with-fields", json=invalid_data)
        data = response.json()
        
        assert data['success'] is False

    def test_generate_report_auto_fills_date(self, valid_report_data):
        """Deve auto-preencher data_elaboracao se não fornecida"""
        data_without_date = valid_report_data.copy()
        if 'data_elaboracao' in data_without_date:
            del data_without_date['data_elaboracao']
        
        response = client.post("/api/generate-report-with-fields", json=data_without_date)
        # Mesmo sem data_elaboracao, deve funcionar pois é auto-preenchida
        assert response.status_code == 200


# ============================================================================
# TESTES: GET /api/download/{filename}
# ============================================================================

@pytest.mark.skipif(not APP_AVAILABLE, reason="FastAPI app não disponível")
class TestDownloadEndpoint:
    """Testes para GET /api/download/{filename}"""

    def test_download_404_for_nonexistent_file(self):
        """Deve retornar 404 para arquivo que não existe"""
        response = client.get("/api/download/INEXISTENTE_12345.docx")
        assert response.status_code == 404

    def test_download_403_for_path_traversal(self):
        """Deve retornar 403 para tentativa de path traversal"""
        # Tentar acessar arquivo fora de outputs_dir
        response = client.get("/api/download/../../../../etc/passwd")
        assert response.status_code == 403

    def test_download_content_type(self, valid_report_data):
        """Download deve retornar tipo MIME correto"""
        # Gerar um relatório primeiro
        gen_response = client.post("/api/generate-report-with-fields", json=valid_report_data)
        
        if gen_response.status_code == 200:
            data = gen_response.json()
            if data['success'] and data.get('document_url'):
                # Extrair nome do arquivo da URL
                filename = data['document_url'].split('/')[-1]
                
                # Fazer download
                response = client.get(f"/api/download/{filename}")
                
                # Verificar content-type
                if response.status_code == 200:
                    assert 'application/vnd.openxmlformats-officedocument' in response.headers.get('content-type', '')


# ============================================================================
# TESTES: GET /api/health
# ============================================================================

@pytest.mark.skipif(not APP_AVAILABLE, reason="FastAPI app não disponível")
class TestHealthEndpoint:
    """Testes para GET /api/health"""

    def test_health_returns_200(self):
        """Deve retornar status 200"""
        response = client.get("/api/health")
        assert response.status_code == 200

    def test_health_returns_object(self):
        """Deve retornar um objeto JSON"""
        response = client.get("/api/health")
        data = response.json()
        assert isinstance(data, dict)

    def test_health_has_status(self):
        """Resposta deve ter campo 'status'"""
        response = client.get("/api/health")
        data = response.json()
        assert 'status' in data
        assert data['status'] == 'healthy'

    def test_health_has_version(self):
        """Resposta deve ter versão"""
        response = client.get("/api/health")
        data = response.json()
        assert 'version' in data
        assert data['version'] == '3.2'

    def test_health_has_templates_available(self):
        """Resposta deve ter contagem de templates"""
        response = client.get("/api/health")
        data = response.json()
        assert 'templates_available' in data
        assert isinstance(data['templates_available'], int)


# ============================================================================
# TESTES: GET /api/templates-info
# ============================================================================

@pytest.mark.skipif(not APP_AVAILABLE, reason="FastAPI app não disponível")
class TestTemplatesInfoEndpoint:
    """Testes para GET /api/templates-info"""

    def test_templates_info_returns_200(self):
        """Deve retornar status 200"""
        response = client.get("/api/templates-info")
        assert response.status_code == 200

    def test_templates_info_has_required_fields(self):
        """Resposta deve ter campos obrigatórios"""
        response = client.get("/api/templates-info")
        data = response.json()
        
        assert 'total_templates' in data
        assert 'templates' in data

    def test_templates_info_total_count_matches(self):
        """total_templates deve corresponder à contagem"""
        response = client.get("/api/templates-info")
        data = response.json()
        
        assert len(data['templates']) == data['total_templates']


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    pytest.main([__file__, '-v', '--tb=short', '-k', 'not skipif'])
