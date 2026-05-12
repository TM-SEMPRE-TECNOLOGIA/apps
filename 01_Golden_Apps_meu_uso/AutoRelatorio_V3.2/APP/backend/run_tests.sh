#!/bin/bash

# run_tests.sh - Script para executar testes do AutoRelatorio v3.2

echo "=========================================="
echo "AutoRelatorio v3.2 - Suite de Testes"
echo "=========================================="

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se pytest está instalado
if ! command -v pytest &> /dev/null; then
    echo -e "${RED}✗ pytest não está instalado${NC}"
    echo "  Execute: pip install -r requirements-test.txt"
    exit 1
fi

echo -e "${YELLOW}1. Executando testes unitários (word_utils.py)${NC}"
pytest test_word_utils.py -v --tb=short

UNIT_RESULT=$?

echo -e "\n${YELLOW}2. Executando testes de integração (routes.py)${NC}"
pytest test_routes.py -v --tb=short -k "not skipif"

INTEGRATION_RESULT=$?

echo -e "\n${YELLOW}3. Gerando relatório de cobertura${NC}"
pytest test_word_utils.py test_routes.py --cov=word_utils --cov=routes --cov-report=html --cov-report=term-missing

COVERAGE_RESULT=$?

echo -e "\n=========================================="
echo "Resumo de Testes"
echo "=========================================="

if [ $UNIT_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Testes Unitários${NC}: PASSOU"
else
    echo -e "${RED}✗ Testes Unitários${NC}: FALHOU"
fi

if [ $INTEGRATION_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Testes de Integração${NC}: PASSOU"
else
    echo -e "${RED}✗ Testes de Integração${NC}: FALHOU"
fi

if [ $COVERAGE_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ Relatório de Cobertura${NC}: GERADO"
    echo "  Abra htmlcov/index.html para visualizar"
else
    echo -e "${RED}✗ Relatório de Cobertura${NC}: FALHOU"
fi

echo "=========================================="

# Retornar status de falha se algum teste falhou
if [ $UNIT_RESULT -ne 0 ] || [ $INTEGRATION_RESULT -ne 0 ]; then
    exit 1
fi

exit 0
