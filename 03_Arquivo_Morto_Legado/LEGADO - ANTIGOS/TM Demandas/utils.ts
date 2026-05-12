
import { PricingRule } from './types';

export function fmtBRL(n: number | null | undefined): string {
  if (n == null || isNaN(Number(n))) return 'R$ 0,00';
  return Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function toInt(x: any): number | null {
  if (x == null || x === '') return null;
  const s = String(x).replace(/[^0-9]/g, '');
  if (!s) return null;
  return parseInt(s, 10);
}

export function norm(s: string | null | undefined): string {
  return (s ?? '').toString().trim().toLowerCase();
}

export function uid(): string {
  return 'd_' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

export function calcValueByPhotos(qtd: number | null, pricing: PricingRule[]): number | null {
  if (qtd == null) return null;
  const row = pricing.find(r => qtd >= r.min && qtd <= r.max);
  return row ? row.value : null;
}

export function getDueBadge(vencISO: string): { label: string; type: 'good' | 'warn' | 'bad' | 'neutral' } {
  if (!vencISO) return { label: 'Sem vencimento', type: 'neutral' };
  
  const d = new Date(vencISO + 'T12:00:00');
  const t = new Date();
  t.setHours(12, 0, 0, 0);
  
  const diffDays = Math.round((d.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return { label: `Atrasado (${Math.abs(diffDays)}d)`, type: 'bad' };
  if (diffDays === 0) return { label: 'Vence hoje', type: 'warn' };
  if (diffDays <= 2) return { label: `Vence em ${diffDays}d`, type: 'warn' };
  return { label: `Em dia (${diffDays}d)`, type: 'good' };
}
