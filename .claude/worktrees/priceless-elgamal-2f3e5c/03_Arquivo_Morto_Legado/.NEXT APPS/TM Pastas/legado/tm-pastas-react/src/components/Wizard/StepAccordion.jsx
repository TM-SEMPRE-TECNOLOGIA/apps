import { useState } from 'react';
import useFolderStore from '../../stores/useFolderStore';

export default function StepAccordion({ numero, titulo, children }) {
    const { etapaAtiva, setEtapaAtiva, areasSelecionadas, areaAtual
        , itensPorArea, itemAtual, subpastasPorItem, subitemAtual
        , detalhesPorSubitem } = useFolderStore();

    const isOpen = etapaAtiva === numero;

    // Resumo dinâmico
    let resumo = '';
    if (numero === 1) {
        const n = areasSelecionadas.length;
        if (n > 0) resumo = `${n} selecionada(s)`;
    } else if (numero === 2) {
        if (areaAtual) {
            const n = (itensPorArea[areaAtual] || []).length;
            if (n > 0) resumo = `${n} item(ns)`;
        } else {
            resumo = 'Aguardando Área';
        }
    } else if (numero === 3) {
        if (areaAtual && itemAtual) {
            const key = `${areaAtual}||${itemAtual}`;
            const n = (subpastasPorItem[key] || []).length;
            if (n > 0) resumo = `${n} item(ns)`;
        } else {
            resumo = 'Aguardando Item';
        }
    } else if (numero === 4) {
        if (areaAtual && itemAtual && subitemAtual) {
            const key = `${areaAtual}||${itemAtual}||${subitemAtual}`;
            const n = (detalhesPorSubitem[key] || []).length;
            if (n > 0) resumo = `${n} detalhe(s)`;
        }
    }

    // Verificar se está habilitado
    let disabled = false;
    if (numero > 1 && areasSelecionadas.length === 0) disabled = true;
    if (numero > 2 && !(areaAtual && (itensPorArea[areaAtual] || []).length > 0)) disabled = true;
    if (numero > 3 && !(areaAtual && itemAtual && (subpastasPorItem[`${areaAtual}||${itemAtual}`] || []).length > 0)) disabled = true;

    const handleClick = () => {
        if (disabled) return;
        setEtapaAtiva(numero);
    };

    return (
        <div className="step-container animate-fade-in">
            <div
                className={`step-header ${disabled ? 'disabled' : ''}`}
                onClick={handleClick}
            >
                <div className="step-number">{numero}</div>
                <span className="step-title">{titulo}</span>
                {!isOpen && resumo && (
                    <span className="step-summary">{resumo}</span>
                )}
            </div>
            <div className={`step-content ${isOpen ? 'step-content--open' : 'step-content--closed'}`}>
                {isOpen && children}
            </div>
        </div>
    );
}
