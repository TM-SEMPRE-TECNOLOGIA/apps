"use client";

import { useState } from 'react';
import { ChevronRight, Plus, Check, MapPin } from 'lucide-react';
import {
  ALL_SUGGESTIONS,
  LEVEL_LABELS,
  LEVEL_COLORS,
  type CustomAmbienteItems,
} from '../data/ambientes-constants';

interface AmbienteSelectorProps {
  value: string[];
  onChange: (path: string[]) => void;
  customItems: CustomAmbienteItems;
  onAddCustom: (levelIdx: number, item: string) => void;
}

export default function AmbienteSelector({
  value,
  onChange,
  customItems,
  onAddCustom,
}: AmbienteSelectorProps) {
  const [activeLevel, setActiveLevel] = useState(() => Math.min(value.length, 3));
  const [addingAt, setAddingAt] = useState<number | null>(null);
  const [newItemText, setNewItemText] = useState('');

  const allItems = ALL_SUGGESTIONS.map(
    (suggestions, i) => [...suggestions, ...(customItems[i] || [])]
  );
  const currentItems = allItems[activeLevel];

  const selectItem = (item: string) => {
    const newPath = [...value.slice(0, activeLevel), item];
    onChange(newPath);
    if (activeLevel < 3) setActiveLevel(activeLevel + 1);
  };

  const goToLevel = (levelIdx: number) => {
    setActiveLevel(levelIdx);
    if (levelIdx < value.length) onChange(value.slice(0, levelIdx));
  };

  const handleAddItem = () => {
    if (!newItemText.trim() || addingAt === null) { setAddingAt(null); return; }
    onAddCustom(addingAt, newItemText.trim());
    selectItem(newItemText.trim());
    setNewItemText('');
    setAddingAt(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Breadcrumb do caminho selecionado */}
      <div className="px-3 py-2.5 border-b border-white/5 bg-black/20 shrink-0 min-h-[44px]">
        {value.length === 0 ? (
          <span className="text-[10px] text-white/25 italic">Clique para atribuir um grupo...</span>
        ) : (
          <div className="flex items-start gap-1 flex-wrap">
            <MapPin size={9} className="text-blue-400 shrink-0 mt-0.5" />
            {value.map((part, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={9} className="text-white/20" />}
                <button
                  onClick={() => goToLevel(i)}
                  className="text-[10px] font-semibold hover:underline transition-colors"
                  style={{ color: LEVEL_COLORS[i] }}
                >
                  {part}
                </button>
              </span>
            ))}
          </div>
        )}
        {value.length > 0 && (
          <button
            onClick={() => { onChange([]); setActiveLevel(0); }}
            className="text-[9px] text-white/20 hover:text-white/50 mt-0.5"
          >
            ✕ limpar
          </button>
        )}
      </div>

      {/* Navegação por nível (tabs internas) */}
      <div className="flex border-b border-white/5 shrink-0">
        {LEVEL_LABELS.map((label, i) => {
          const canAccess = i === 0 || value.length >= i;
          return (
            <button
              key={i}
              disabled={!canAccess}
              onClick={() => canAccess && goToLevel(i)}
              className={`flex-1 py-1.5 transition-colors border-b-2 ${
                activeLevel === i
                  ? 'text-white'
                  : canAccess
                    ? 'text-white/25 hover:text-white/50 border-transparent'
                    : 'text-white/10 cursor-not-allowed border-transparent'
              }`}
              style={{ borderColor: activeLevel === i ? LEVEL_COLORS[i] : undefined }}
            >
              <div className="text-[8px] font-black uppercase tracking-wide">{label}</div>
              {value[i] && (
                <div
                  className="text-[7px] truncate px-1 normal-case font-normal mt-0.5 leading-tight"
                  style={{ color: LEVEL_COLORS[i] }}
                >
                  {value[i].split(' ').slice(0, 2).join(' ')}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Lista de itens do nível ativo */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-2 flex flex-col gap-0.5">
          {currentItems.map(item => {
            const isSelected = value[activeLevel] === item;
            return (
              <button
                key={item}
                onClick={() => selectItem(item)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[11px] transition-all w-full"
                style={isSelected ? {
                  backgroundColor: `${LEVEL_COLORS[activeLevel]}18`,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: `${LEVEL_COLORS[activeLevel]}40`,
                  color: 'white',
                  fontWeight: 600,
                } : { color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: isSelected ? LEVEL_COLORS[activeLevel] : 'rgba(255,255,255,0.2)',
                    backgroundColor: isSelected ? LEVEL_COLORS[activeLevel] : 'transparent',
                  }}
                >
                  {isSelected && <Check size={7} className="text-white" />}
                </div>
                <span className="flex-1 leading-tight">{item}</span>
                {isSelected && activeLevel < 3 && (
                  <ChevronRight size={10} style={{ color: LEVEL_COLORS[activeLevel], opacity: 0.6 }} />
                )}
              </button>
            );
          })}

          {/* Adicionar item personalizado */}
          {addingAt === activeLevel ? (
            <div className="flex gap-1 mt-2 px-1">
              <input
                autoFocus
                value={newItemText}
                onChange={e => setNewItemText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddItem();
                  if (e.key === 'Escape') { setAddingAt(null); setNewItemText(''); }
                }}
                placeholder={`Nome da ${LEVEL_LABELS[activeLevel].toLowerCase()}...`}
                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none placeholder:text-white/20"
                style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                onFocus={e => (e.target.style.borderColor = LEVEL_COLORS[activeLevel])}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
              />
              <button
                onClick={handleAddItem}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[11px] text-white/70 font-bold transition-colors"
              >
                OK
              </button>
              <button
                onClick={() => { setAddingAt(null); setNewItemText(''); }}
                className="px-2 py-1.5 text-white/30 hover:text-white/60 transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingAt(activeLevel)}
              className="flex items-center gap-1.5 px-3 py-2 text-[10px] text-white/25 hover:text-white/50 transition-colors w-full mt-1"
            >
              <Plus size={10} />
              Adicionar {LEVEL_LABELS[activeLevel].toLowerCase()} personalizado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
