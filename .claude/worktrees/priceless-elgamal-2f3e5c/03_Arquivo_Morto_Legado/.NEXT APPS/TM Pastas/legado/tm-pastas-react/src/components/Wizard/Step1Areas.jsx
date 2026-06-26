import { useState } from 'react';
import useFolderStore from '../../stores/useFolderStore';
import { AREAS_SUGERIDAS } from '../../data/constants';
import StepAccordion from './StepAccordion';

export default function Step1Areas() {
    const [filtro, setFiltro] = useState('');
    const { areasSelecionadas, toggleArea } = useFolderStore();

    const filtroLower = filtro.toLowerCase().trim();
    const visiveis = AREAS_SUGERIDAS.filter(
        a => !filtroLower || a.toLowerCase().includes(filtroLower)
    );

    return (
        <StepAccordion numero={1} titulo="SELECIONE A ÁREA">
            <input
                className="input input-sm"
                placeholder="🔍 Filtrar áreas..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
            />
            <div className="checkbox-grid" style={{ marginTop: 'var(--space-sm)' }}>
                {visiveis.map((area) => (
                    <label key={area} className="checkbox-wrapper">
                        <input
                            type="checkbox"
                            checked={areasSelecionadas.includes(area)}
                            onChange={() => toggleArea(area)}
                        />
                        <span>{area}</span>
                    </label>
                ))}
            </div>
        </StepAccordion>
    );
}
