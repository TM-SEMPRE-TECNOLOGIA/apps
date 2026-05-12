"use client";

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MousePointer2, Type, Circle, ArrowLeftRight, ArrowRight, Square, PenLine, Paintbrush, ZoomIn, ZoomOut, Save, Search, Check, ChevronDown, ChevronUp, Plus, MapPin } from 'lucide-react';
import { ITENS_MAFFENG, CATEGORIAS, type MaffengItem } from '../data/itens-maffeng';
import AmbienteSelector from './AmbienteSelector';
import type { CustomAmbienteItems } from '../data/ambientes-constants';

// Helpers
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/** Converte um path local para URL do endpoint de imagem original */
function toImageUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${API}/api/image?path=${encodeURIComponent(path)}`;
}

// ── Tipos de saída ──────────────────────────────────────────────────────────
export interface ServiceItem {
  id: string;
  desc: string;
  un: string;
  cat: string;
}

export interface ServiceSelection {
  item: MaffengItem;
  qty: number;
  largura?: number;
  altura?: number;
  desconto?: number;
  repeticoes?: number;
  totalFinal: number;
  totalLabel: string;
  context: string;
}

type Tool = 'select' | 'arrow-double' | 'arrow-single' | 'circle' | 'box-red' | 'box-purple' | 'polyline' | 'text';

// ── Componente Principal ────────────────────────────────────────────────────
export default function ImageEditorModal({
  imageUrl,
  onClose,
  onSave,
  ambientePath = [],
  onAmbienteChange,
  customAmbienteItems = [[], [], [], []],
  onAddCustomAmbiente,
}: {
  imageUrl: string;
  onClose: () => void;
  onSave: (editedImageUrl: string, services: ServiceSelection[]) => void;
  ambientePath?: string[];
  onAmbienteChange?: (path: string[]) => void;
  customAmbienteItems?: CustomAmbienteItems;
  onAddCustomAmbiente?: (levelIdx: number, item: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const [fabricCanvas, setFabricCanvas] = useState<any>(null);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('#FF0000');

  // Paleta de cores — alinhada com o Word (vermelho, roxo, âmbar, preto, branco)
  const colors = ['#FF0000', '#EE0000', '#7030A0', '#f59e0b', '#000000', '#ffffff'];

  // Refs para polilinha (precisam persistir entre eventos sem re-render)
  const polylinePointsRef = useRef<{ x: number; y: number }[]>([]);
  const polylineTempRef = useRef<any>(null);
  const polylinePreviewRef = useRef<any>(null);

  // Aba ativa do painel direito
  const [rightTab, setRightTab] = useState<'localizacao' | 'servicos'>('servicos');

  // ── Inicialização do Fabric.js ─────────────────────────────────────────
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    if (fabricCanvasRef.current) return;

    let isCancelled = false;

    const initFabric = async () => {
      setIsImageLoading(true);
      const fabricModule = await import('fabric');
      if (isCancelled) return;
      // @ts-ignore
      window.__fabricLib = fabricModule;

      const width = containerRef.current?.offsetWidth || 800;
      const height = containerRef.current?.offsetHeight || 600;

      try {
        // @ts-ignore
        if (canvasRef.current?.fabInstance) {
          // @ts-ignore
          canvasRef.current.fabInstance.dispose();
        }

        const canvasInstance = new fabricModule.Canvas(canvasRef.current, {
          width,
          height,
          selection: true,
          backgroundColor: '#111827',
          enableRetinaScaling: true,
          imageSmoothingEnabled: true,
        });

        // @ts-ignore
        canvasRef.current.fabInstance = canvasInstance;
        fabricCanvasRef.current = canvasInstance;
        if (isCancelled) { canvasInstance.dispose(); return; }
        setFabricCanvas(canvasInstance);

        // Carrega imagem preservando resolução original
        fabricModule.FabricImage.fromURL(toImageUrl(imageUrl), { crossOrigin: 'anonymous' })
          .then((img: any) => {
            if (isCancelled) return;
            const scale = Math.min((width - 20) / img.width!, (height - 20) / img.height!);
            img.set({
              left: width / 2,
              top: height / 2,
              originX: 'center',
              originY: 'center',
              scaleX: scale,
              scaleY: scale,
              selectable: false,
              evented: false,
              hoverCursor: 'default',
            });
            canvasInstance.add(img);
            canvasInstance.sendObjectToBack(img);
            canvasInstance.renderAll();
            setIsImageLoading(false);
          })
          .catch(() => { if (!isCancelled) setIsImageLoading(false); });

      } catch (err) {
        console.warn('Fabric init:', err);
      }
    };

    initFabric();

    return () => {
      isCancelled = true;
      if (fabricCanvasRef.current) {
        try { fabricCanvasRef.current.dispose(); } catch (e) { }
        fabricCanvasRef.current = null;
        // @ts-ignore
        if (canvasRef.current) delete canvasRef.current.fabInstance;
      }
      setFabricCanvas(null);
    };
  }, [imageUrl]);

  // ── Delete + Escape por teclado ────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && fabricCanvas) {
        const obj = fabricCanvas.getActiveObject();
        if (obj && obj.type !== 'image') {
          fabricCanvas.remove(obj);
          fabricCanvas.renderAll();
        }
      }
      // Escape cancela polilinha em andamento
      if (e.key === 'Escape') {
        if (polylineTempRef.current && fabricCanvas) {
          fabricCanvas.remove(polylineTempRef.current);
          polylineTempRef.current = null;
        }
        if (polylinePreviewRef.current && fabricCanvas) {
          fabricCanvas.remove(polylinePreviewRef.current);
          polylinePreviewRef.current = null;
        }
        if (polylinePointsRef.current.length > 0) {
          polylinePointsRef.current = [];
          if (fabricCanvas) fabricCanvas.renderAll();
          setActiveTool('select');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fabricCanvas]);

  // ── Cria caixa de texto colorida (box-red / box-purple) ───────────────
  const createTextBox = (bgColor: string, hasShadow: boolean) => {
    const fLib = (window as any).__fabricLib;
    if (!fLib || !fabricCanvas) return;

    const shadow = hasShadow
      ? new fLib.Shadow({ color: 'rgba(0,0,0,0.35)', blur: 10, offsetX: 2, offsetY: 4 })
      : undefined;

    const box = new fLib.Textbox('TEXTO AQUI', {
      left: 80, top: 80,
      width: 200,
      fontSize: 13, fontFamily: 'Arial', fontWeight: 'bold',
      fill: '#ffffff',
      backgroundColor: bgColor,
      padding: 10,
      stroke: '#000000',
      strokeWidth: 0.5,
      shadow,
      selectable: true, evented: true, hasControls: true, editable: true,
    });
    fabricCanvas.add(box);
    fabricCanvas.setActiveObject(box);
    box.enterEditing();
    fabricCanvas.renderAll();
    setActiveTool('select');
  };

  // ── Lógica de ferramentas de desenho ───────────────────────────────────
  useEffect(() => {
    if (!fabricCanvas) return;

    // Caixas de texto: criam ao clicar o botão, não usam drag
    if (activeTool === 'box-red') { createTextBox('#EE0000', true); return; }
    if (activeTool === 'box-purple') { createTextBox('#7030A0', false); return; }

    let isDrawing = false;
    let currentShape: any = null;
    let startX = 0, startY = 0;

    const getLib = () => (window as any).__fabricLib;

    const handleMouseDown = (opt: any) => {
      const fLib = getLib();
      if (!fLib) return;
      if (activeTool === 'select') return;

      const pointer = fabricCanvas.getScenePoint(opt.e);

      // ── Polilinha: acumula pontos a cada clique ──
      if (activeTool === 'polyline') {
        // Ignora o clique extra disparado pelo dblclick
        if ((opt.e as MouseEvent).detail >= 2) return;

        polylinePointsRef.current = [...polylinePointsRef.current, { x: pointer.x, y: pointer.y }];

        const pts = polylinePointsRef.current;
        if (pts.length >= 2) {
          if (polylineTempRef.current) fabricCanvas.remove(polylineTempRef.current);
          const poly = new fLib.Polyline(pts.map((p: any) => ({ x: p.x, y: p.y })), {
            stroke: selectedColor, strokeWidth: 2, fill: '', selectable: false, evented: false,
          });
          polylineTempRef.current = poly;
          fabricCanvas.add(poly);
          fabricCanvas.renderAll();
        }
        return;
      }

      isDrawing = true;
      startX = pointer.x;
      startY = pointer.y;
      fabricCanvas.selection = false;

      if (activeTool === 'circle') {
        currentShape = new fLib.Circle({
          left: startX, top: startY,
          radius: 1,
          stroke: selectedColor, strokeWidth: 3,
          fill: 'transparent',
          selectable: false, evented: false,
          originX: 'center', originY: 'center',
        });
        fabricCanvas.add(currentShape);
      }

      if (activeTool === 'arrow-double' || activeTool === 'arrow-single') {
        currentShape = null; // recriado no move
      }

      if (activeTool === 'text') {
        const text = new fLib.IText('', {
          left: startX, top: startY,
          fontSize: 20,
          fill: selectedColor,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold',
          selectable: true, evented: true,
        });
        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        text.enterEditing();
        isDrawing = false;
        setActiveTool('select');
      }
    };

    const handleMouseMove = (opt: any) => {
      const fLib = getLib();
      if (!fLib) return;
      const pointer = fabricCanvas.getScenePoint(opt.e);

      // Preview do próximo segmento da polilinha
      if (activeTool === 'polyline' && polylinePointsRef.current.length >= 1) {
        if (polylinePreviewRef.current) fabricCanvas.remove(polylinePreviewRef.current);
        const last = polylinePointsRef.current[polylinePointsRef.current.length - 1];
        const preview = new fLib.Polyline(
          [{ x: last.x, y: last.y }, { x: pointer.x, y: pointer.y }],
          { stroke: selectedColor, strokeWidth: 1, fill: '', strokeDashArray: [6, 4], selectable: false, evented: false }
        );
        polylinePreviewRef.current = preview;
        fabricCanvas.add(preview);
        fabricCanvas.renderAll();
        return;
      }

      if (!isDrawing) return;

      if (activeTool === 'circle' && currentShape) {
        const radius = Math.hypot(pointer.x - startX, pointer.y - startY) / 2;
        const cx = (startX + pointer.x) / 2;
        const cy = (startY + pointer.y) / 2;
        currentShape.set({ left: cx, top: cy, radius });
      }

      if ((activeTool === 'arrow-double' || activeTool === 'arrow-single') && fLib) {
        if (currentShape) fabricCanvas.remove(currentShape);

        const dx = pointer.x - startX;
        const dy = pointer.y - startY;
        const angle = Math.atan2(dy, dx);
        const len = Math.hypot(dx, dy);
        if (len < 5) return;

        const strokeW = 2;
        const H = 13;
        const W = 8;

        const angleLeft = angle - Math.PI / 2;
        const angleRight = angle + Math.PI / 2;

        // Triângulo DESTINO
        const destBase = { x: pointer.x - H * Math.cos(angle), y: pointer.y - H * Math.sin(angle) };
        const b1x = destBase.x + W * Math.cos(angleLeft);
        const b1y = destBase.y + W * Math.sin(angleLeft);
        const b2x = destBase.x + W * Math.cos(angleRight);
        const b2y = destBase.y + W * Math.sin(angleRight);

        let pathData: string;

        if (activeTool === 'arrow-double') {
          // Triângulo ORIGEM
          const origBase = { x: startX + H * Math.cos(angle), y: startY + H * Math.sin(angle) };
          const a1x = origBase.x + W * Math.cos(angleLeft);
          const a1y = origBase.y + W * Math.sin(angleLeft);
          const a2x = origBase.x + W * Math.cos(angleRight);
          const a2y = origBase.y + W * Math.sin(angleRight);

          pathData = [
            `M ${origBase.x} ${origBase.y} L ${destBase.x} ${destBase.y}`,
            `M ${pointer.x} ${pointer.y} L ${b1x} ${b1y} L ${b2x} ${b2y} Z`,
            `M ${startX} ${startY} L ${a1x} ${a1y} L ${a2x} ${a2y} Z`,
          ].join(' ');
        } else {
          // arrow-single: sem ponta na origem
          pathData = [
            `M ${startX} ${startY} L ${destBase.x} ${destBase.y}`,
            `M ${pointer.x} ${pointer.y} L ${b1x} ${b1y} L ${b2x} ${b2y} Z`,
          ].join(' ');
        }

        currentShape = new fLib.Path(pathData, {
          stroke: selectedColor, strokeWidth: strokeW,
          fill: selectedColor,
          selectable: false, evented: false,
          strokeLineJoin: 'miter',
        });
        fabricCanvas.add(currentShape);
      }

      fabricCanvas.renderAll();
    };

    const handleMouseUp = () => {
      if (activeTool === 'polyline') return; // polilinha usa dblclick
      isDrawing = false;
      if (currentShape) {
        currentShape.setCoords();
        currentShape.set({ selectable: true, evented: true });
      }
      currentShape = null;
      fabricCanvas.selection = activeTool === 'select';
    };

    // Duplo-clique finaliza polilinha
    const handleDblClick = () => {
      if (activeTool !== 'polyline') return;
      const fLib = getLib();
      if (!fLib) return;

      // Remove o ponto duplicado que o dblclick gerou via mousedown
      const pts = [...polylinePointsRef.current];
      if (pts.length > 1) pts.pop(); // descarta o clique extra

      if (pts.length < 2) {
        // Pontos insuficientes — cancela
        if (polylineTempRef.current) fabricCanvas.remove(polylineTempRef.current);
        if (polylinePreviewRef.current) fabricCanvas.remove(polylinePreviewRef.current);
        polylinePointsRef.current = [];
        fabricCanvas.renderAll();
        setActiveTool('select');
        return;
      }

      // Remove temporários
      if (polylineTempRef.current) fabricCanvas.remove(polylineTempRef.current);
      if (polylinePreviewRef.current) fabricCanvas.remove(polylinePreviewRef.current);
      polylineTempRef.current = null;
      polylinePreviewRef.current = null;

      // Monta path SVG: linha + seta no início + seta no fim
      const H = 13, W = 8;

      // Segmentos da polilinha como path
      let linePath = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        linePath += ` L ${pts[i].x} ${pts[i].y}`;
      }

      // Seta no INÍCIO (aponta para trás — direção inversa do segundo ponto)
      const angStart = Math.atan2(pts[0].y - pts[1].y, pts[0].x - pts[1].x);
      const startBase = { x: pts[0].x - H * Math.cos(angStart), y: pts[0].y - H * Math.sin(angStart) };
      const sa1x = startBase.x + W * Math.cos(angStart - Math.PI / 2);
      const sa1y = startBase.y + W * Math.sin(angStart - Math.PI / 2);
      const sa2x = startBase.x + W * Math.cos(angStart + Math.PI / 2);
      const sa2y = startBase.y + W * Math.sin(angStart + Math.PI / 2);
      const arrowStartPath = `M ${pts[0].x} ${pts[0].y} L ${sa1x} ${sa1y} L ${sa2x} ${sa2y} Z`;

      // Seta no FIM (aponta para frente — direção do último segmento)
      const n = pts.length - 1;
      const angEnd = Math.atan2(pts[n].y - pts[n - 1].y, pts[n].x - pts[n - 1].x);
      const endBase = { x: pts[n].x - H * Math.cos(angEnd), y: pts[n].y - H * Math.sin(angEnd) };
      const ea1x = endBase.x + W * Math.cos(angEnd - Math.PI / 2);
      const ea1y = endBase.y + W * Math.sin(angEnd - Math.PI / 2);
      const ea2x = endBase.x + W * Math.cos(angEnd + Math.PI / 2);
      const ea2y = endBase.y + W * Math.sin(angEnd + Math.PI / 2);
      const arrowEndPath = `M ${pts[n].x} ${pts[n].y} L ${ea1x} ${ea1y} L ${ea2x} ${ea2y} Z`;

      const fullPath = [linePath, arrowStartPath, arrowEndPath].join(' ');

      const finalShape = new fLib.Path(fullPath, {
        stroke: selectedColor, strokeWidth: 2,
        fill: selectedColor,
        selectable: true, evented: true, hasControls: true,
        strokeLineJoin: 'miter',
      });
      fabricCanvas.add(finalShape);
      fabricCanvas.renderAll();

      // Reset
      polylinePointsRef.current = [];
      setActiveTool('select');
    };

    // Selectabilidade dos objetos existentes conforme ferramenta ativa
    fabricCanvas.getObjects().forEach((obj: any) => {
      if (obj.type !== 'image') {
        obj.set('selectable', activeTool === 'select');
        obj.set('evented', activeTool === 'select');
      }
    });
    fabricCanvas.defaultCursor = activeTool === 'select' ? 'default' : 'crosshair';
    fabricCanvas.renderAll();

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('mouse:move', handleMouseMove);
    fabricCanvas.on('mouse:up', handleMouseUp);
    fabricCanvas.on('mouse:dblclick', handleDblClick);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('mouse:move', handleMouseMove);
      fabricCanvas.off('mouse:up', handleMouseUp);
      fabricCanvas.off('mouse:dblclick', handleDblClick);
    };
  }, [fabricCanvas, activeTool, selectedColor]);

  // ── Zoom ───────────────────────────────────────────────────────────────
  const handleZoom = (dir: 'in' | 'out') => {
    if (!fabricCanvas) return;
    const zoom = fabricCanvas.getZoom();
    fabricCanvas.setZoom(dir === 'in' ? Math.min(zoom * 1.2, 5) : Math.max(zoom / 1.2, 0.3));
  };

  // ── Salvar ──────────────────────────────────────────────────────────────
  const saveAndClose = () => {
    if (!fabricCanvas) return;
    const dataUrl = fabricCanvas.toDataURL({ format: 'png', quality: 1.0, multiplier: 2 });
    onSave(dataUrl, selectedServices);
  };

  /** Cria um stamp de texto colorido e arrastável no canvas */
  const addStampToCanvas = (
    text: string,
    bgColor: string,
    textColor = '#ffffff'
  ) => {
    if (!fabricCanvas) return;
    const fLib = (window as any).__fabricLib;
    if (!fLib) return;

    const rect = new fLib.Rect({
      width: 0, height: 0,
      rx: 4, ry: 4,
      fill: bgColor,
    });
    const label = new fLib.Text(text, {
      fontSize: 15,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fill: textColor,
      left: 6,
      top: 4,
    });
    rect.set({ width: label.width! + 12, height: label.height! + 8 });

    const group = new fLib.Group([rect, label], {
      left: 40,
      top: 40,
      selectable: true,
      evented: true,
      hasControls: true,
      hasBorders: true,
    });
    fabricCanvas.add(group);
    fabricCanvas.setActiveObject(group);
    fabricCanvas.bringObjectToFront(group);
    fabricCanvas.renderAll();
  };

  // ── Estado do painel de itens ──────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [catOpen, setCatOpen] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceSelection[]>([]);
  const [observation, setObservation] = useState('');

  const isAreaUnit = (un: string) => ['m²', 'm2', 'm'].includes(un.toLowerCase());

  function calcQty(item: MaffengItem, s: Partial<ServiceSelection>): number {
    if (isAreaUnit(item.un)) {
      const l = s.largura || 0;
      const h = s.altura || 0;
      const d = s.desconto || 0;
      return Math.max(0, l * h - d);
    }
    return s.qty || 0;
  }

  function calcTotal(item: MaffengItem, qty: number, repeticoes: number): { total: number; label: string } {
    const reps = repeticoes || 1;
    let total = qty * reps;
    let label = 'Total';
    if (item.modificador) {
      if (item.modificador.tipo === 'div') {
        total = total / item.modificador.valor;
        label = `Total (${item.modificador.label})`;
      } else if (item.modificador.tipo === 'mult') {
        total = total * item.modificador.valor;
        label = `Total (×${item.modificador.valor})`;
      }
    } else if (reps > 1) {
      label = `Total (×${reps})`;
    }
    return { total: Math.round(total * 100) / 100, label };
  }

  function recompute(s: ServiceSelection, patch: Partial<ServiceSelection>): ServiceSelection {
    const next = { ...s, ...patch };
    const qty = calcQty(next.item, next);
    const { total, label } = calcTotal(next.item, qty, next.repeticoes || 1);
    return { ...next, qty, totalFinal: total, totalLabel: label };
  }

  const filteredItems = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return ITENS_MAFFENG;
    return ITENS_MAFFENG.filter(i =>
      i.id.toLowerCase().includes(q) ||
      i.desc.toLowerCase().includes(q) ||
      i.cat.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const grouped = useMemo(() => {
    const map: Record<string, MaffengItem[]> = {};
    for (const item of filteredItems) {
      if (!map[item.cat]) map[item.cat] = [];
      map[item.cat].push(item);
    }
    return map;
  }, [filteredItems]);

  const toggleItem = (item: MaffengItem) => {
    const exists = selectedServices.find(s => s.item.id === item.id);
    if (exists) {
      setSelectedServices(prev => prev.filter(s => s.item.id !== item.id));
    } else {
      const base: ServiceSelection = {
        item, qty: 0, largura: 0, altura: 0, desconto: 0,
        repeticoes: 1, totalFinal: 0, totalLabel: 'Total', context: ''
      };
      setSelectedServices(prev => [...prev, recompute(base, {})]);
    }
  };

  const updateField = (id: string, patch: Partial<ServiceSelection>) => {
    setSelectedServices(prev => prev.map(s =>
      s.item.id === id ? recompute(s, patch) : s
    ));
  };

  const toolHint = () => {
    switch (activeTool) {
      case 'arrow-double': return '← arraste para seta dupla →';
      case 'arrow-single': return '→ arraste para seta simples';
      case 'polyline': return 'clique para pontos · duplo-clique para finalizar · Esc cancela';
      case 'circle': return 'arraste para desenhar círculo';
      case 'box-red': return 'caixa vermelha — clique criou automaticamente';
      case 'box-purple': return 'caixa roxa — clique criou automaticamente';
      case 'text': return 'clique para inserir texto';
      case 'select': return 'clicar + Delete para remover marcação';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="relative flex flex-col w-full max-w-[1440px] h-full max-h-[940px] bg-[#0f172a] rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
        >
          {/* ── HEADER ── */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/30 shrink-0">
            <div className="flex items-center gap-3">
              <Paintbrush className="text-brand-accent" size={18} />
              <h2 className="text-white font-bold text-base">Editor Modal Plus+</h2>
              <span className="text-white/30 text-xs font-mono">|</span>
              <span className="text-white/40 text-xs">{selectedServices.length} itens vinculados</span>
            </div>
            <button onClick={onClose} className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">

            {/* ── CENTRO: TOOLBAR + CANVAS ── */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#090e1a]">

              {/* Toolbar Horizontal */}
              <div className="h-12 bg-black/50 border-b border-white/10 flex items-center px-4 gap-3 shrink-0">
                <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded-lg border border-white/5">
                  <ToolBtn active={activeTool === 'select'} icon={<MousePointer2 size={16} />} onClick={() => setActiveTool('select')} title="Selecionar / Delete" />
                  <ToolBtn active={activeTool === 'arrow-double'} icon={<ArrowLeftRight size={16} />} onClick={() => setActiveTool('arrow-double')} title="Seta dupla ←→" />
                  <ToolBtn active={activeTool === 'arrow-single'} icon={<ArrowRight size={16} />} onClick={() => setActiveTool('arrow-single')} title="Seta simples →" />
                  <ToolBtn active={activeTool === 'circle'} icon={<Circle size={16} />} onClick={() => setActiveTool('circle')} title="Círculo de marcação" />
                  <ToolBtn
                    active={activeTool === 'box-red'}
                    icon={<Square size={16} style={{ color: '#EE0000' }} />}
                    onClick={() => setActiveTool('box-red')}
                    title="Caixa vermelha (texto)"
                  />
                  <ToolBtn
                    active={activeTool === 'box-purple'}
                    icon={<Square size={16} style={{ color: '#7030A0' }} />}
                    onClick={() => setActiveTool('box-purple')}
                    title="Caixa roxa (texto)"
                  />
                  <ToolBtn active={activeTool === 'polyline'} icon={<PenLine size={16} />} onClick={() => setActiveTool('polyline')} title="Forma livre: cliques ilimitados, duplo-clique finaliza" />
                  <ToolBtn active={activeTool === 'text'} icon={<Type size={16} />} onClick={() => setActiveTool('text')} title="Texto livre" />
                </div>

                <div className="w-px h-6 bg-white/10" />

                {/* Cores */}
                <div className="flex gap-2 items-center">
                  {colors.map(hex => (
                    <button
                      key={hex}
                      onClick={() => setSelectedColor(hex)}
                      style={{ backgroundColor: hex }}
                      className={`w-5 h-5 rounded-full transition-all border ${selectedColor === hex ? 'ring-2 ring-white scale-125 shadow-lg border-white/50' : 'border-white/20 opacity-60 hover:opacity-100'}`}
                    />
                  ))}
                </div>

                <div className="w-px h-6 bg-white/10" />

                {/* Zoom */}
                <div className="flex gap-1">
                  <button onClick={() => handleZoom('in')} className="p-1.5 text-white/40 hover:text-white bg-white/5 rounded-md hover:bg-white/10 transition-colors"><ZoomIn size={14} /></button>
                  <button onClick={() => handleZoom('out')} className="p-1.5 text-white/40 hover:text-white bg-white/5 rounded-md hover:bg-white/10 transition-colors"><ZoomOut size={14} /></button>
                </div>

                <div className="ml-auto text-[10px] font-mono text-white/20 uppercase tracking-widest">
                  {toolHint()}
                </div>
              </div>

              {/* Canvas Area */}
              <div ref={containerRef} className="flex-1 relative flex items-center justify-center overflow-hidden">
                <canvas ref={canvasRef} className="absolute touch-none" />

                {/* Scanner Loading */}
                <AnimatePresence>
                  {isImageLoading && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center bg-[#090e1a] z-50"
                    >
                      <div className="relative w-80 h-48 bg-white/5 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
                          <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest animate-pulse">Carregando imagem...</span>
                        </div>
                        <motion.div
                          animate={{ top: ['-5%', '105%'], opacity: [0.2, 0.9, 0.2] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                          className="absolute left-0 right-0 h-0.5 bg-brand-accent shadow-[0_0_16px_#8a5100] z-10"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── PAINEL DIREITO ── */}
            <div className="w-[380px] bg-[#0c1322] border-l border-white/5 flex flex-col overflow-hidden shrink-0">

              {/* Tabs: Localização | Serviços */}
              <div className="flex border-b border-white/5 shrink-0">
                <button
                  onClick={() => setRightTab('localizacao')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    rightTab === 'localizacao'
                      ? 'text-blue-400 border-blue-400'
                      : 'text-white/30 hover:text-white/50 border-transparent'
                  }`}
                >
                  <MapPin size={10} />
                  Localização
                  {ambientePath.length > 0 && (
                    <span className="ml-1 w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </button>
                <button
                  onClick={() => setRightTab('servicos')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    rightTab === 'servicos'
                      ? 'text-brand-accent border-brand-accent'
                      : 'text-white/30 hover:text-white/50 border-transparent'
                  }`}
                >
                  Serviços
                  {selectedServices.length > 0 && (
                    <span className="ml-1 bg-brand-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                      {selectedServices.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Aba Localização */}
              {rightTab === 'localizacao' && (
                <AmbienteSelector
                  value={ambientePath}
                  onChange={onAmbienteChange ?? (() => {})}
                  customItems={customAmbienteItems}
                  onAddCustom={onAddCustomAmbiente ?? (() => {})}
                />
              )}

              {/* Aba Serviços */}
              {rightTab === 'servicos' && (
                <>
                  {/* Busca */}
                  <div className="p-3 border-b border-white/5 bg-black/20 shrink-0">
                    <div className="relative">
                      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                      <input
                        type="text"
                        placeholder="Buscar item ou código..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-xs text-white outline-none focus:border-brand-accent transition-colors placeholder:text-white/25"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Lista agrupada por categoria */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                {Object.entries(grouped).map(([cat, items]) => (
                  <div key={cat}>
                    <button
                      onClick={() => setCatOpen(catOpen === cat ? null : cat)}
                      className="w-full flex items-center justify-between px-4 py-2 bg-[#0a1020] border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{cat}</span>
                      <div className="flex items-center gap-2">
                        {items.filter(i => selectedServices.some(s => s.item.id === i.id)).length > 0 && (
                          <span className="text-[8px] font-black bg-brand-primary/50 text-white px-1.5 py-0.5 rounded">
                            {items.filter(i => selectedServices.some(s => s.item.id === i.id)).length}
                          </span>
                        )}
                        {catOpen === cat ? <ChevronDown size={12} className="text-white/30" /> : <ChevronDown size={12} className="text-white/30" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {(catOpen === cat || searchTerm.trim() !== '') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          {items.map(item => {
                            const sel = selectedServices.find(s => s.item.id === item.id);
                            const isSelected = !!sel;
                            return (
                              <div key={item.id} className={`border-b border-white/[0.03] transition-colors ${isSelected ? 'bg-brand-primary/10' : 'hover:bg-white/[0.03]'}`}>
                                <button
                                  onClick={() => toggleItem(item)}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                                >
                                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all ${isSelected ? 'bg-brand-primary border-brand-primary' : 'border-white/20 bg-white/5'}`}>
                                    {isSelected && <Check size={10} className="text-white" />}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${isSelected ? 'bg-brand-primary text-white' : 'bg-white/10 text-white/40'}`}>
                                        {item.id}
                                      </span>
                                      <span className="text-[9px] text-white/30 font-mono">{item.un}</span>
                                      {item.modificador && (
                                        <span className="text-[8px] font-black px-1 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                                          {item.modificador.label}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[11px] text-white/70 font-medium leading-tight block truncate">{item.desc}</span>
                                  </div>
                                </button>

                                <AnimatePresence>
                                  {isSelected && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="px-4 pb-2.5 overflow-hidden"
                                    >
                                      <div className="flex flex-col gap-1.5 bg-black/40 rounded-lg px-3 py-2.5 border border-brand-primary/30">

                                        {isAreaUnit(item.un) ? (
                                          <>
                                            <div className="flex items-center gap-2">
                                              <span className="text-[9px] text-white/40 font-bold w-16">Largura</span>
                                              <input type="number" min={0} step={0.01}
                                                value={sel?.largura ?? 0}
                                                onChange={e => updateField(item.id, { largura: parseFloat(e.target.value) || 0 })}
                                                onClick={e => e.stopPropagation()}
                                                className="flex-1 bg-white/5 text-white text-xs font-bold text-center outline-none rounded px-2 py-1 border border-white/10 focus:border-red-400"
                                              />
                                              <span className="text-[9px] text-white/30">m</span>
                                              <button
                                                onClick={e => { e.stopPropagation(); addStampToCanvas(`${(sel?.largura ?? 0).toFixed(2)} m`, '#c0392b'); }}
                                                className="text-[9px] bg-red-600/30 hover:bg-red-600/60 text-red-300 px-1.5 py-1 rounded border border-red-500/30 transition-colors flex items-center gap-1"
                                              ><Plus size={8}/> canvas</button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-[9px] text-white/40 font-bold w-16">Altura</span>
                                              <input type="number" min={0} step={0.01}
                                                value={sel?.altura ?? 0}
                                                onChange={e => updateField(item.id, { altura: parseFloat(e.target.value) || 0 })}
                                                onClick={e => e.stopPropagation()}
                                                className="flex-1 bg-white/5 text-white text-xs font-bold text-center outline-none rounded px-2 py-1 border border-white/10 focus:border-red-400"
                                              />
                                              <span className="text-[9px] text-white/30">m</span>
                                              <button
                                                onClick={e => { e.stopPropagation(); addStampToCanvas(`${(sel?.altura ?? 0).toFixed(2)} m`, '#c0392b'); }}
                                                className="text-[9px] bg-red-600/30 hover:bg-red-600/60 text-red-300 px-1.5 py-1 rounded border border-red-500/30 transition-colors flex items-center gap-1"
                                              ><Plus size={8}/> canvas</button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-[9px] text-white/40 font-bold w-16">Desconto</span>
                                              <input type="number" min={0} step={0.01}
                                                value={sel?.desconto ?? 0}
                                                onChange={e => updateField(item.id, { desconto: parseFloat(e.target.value) || 0 })}
                                                onClick={e => e.stopPropagation()}
                                                className="flex-1 bg-white/5 text-white text-xs font-bold text-center outline-none rounded px-2 py-1 border border-white/10 focus:border-purple-400"
                                              />
                                              <span className="text-[9px] text-white/30">m²</span>
                                              <button
                                                onClick={e => { e.stopPropagation(); addStampToCanvas(`Desc: ${(sel?.desconto ?? 0).toFixed(2)} m²`, '#6c3483'); }}
                                                className="text-[9px] bg-purple-600/30 hover:bg-purple-600/60 text-purple-300 px-1.5 py-1 rounded border border-purple-500/30 transition-colors flex items-center gap-1"
                                              ><Plus size={8}/> canvas</button>
                                            </div>
                                          </>
                                        ) : (
                                          <div className="flex items-center gap-2">
                                            <span className="text-[9px] text-white/40 font-bold w-16">Qtde</span>
                                            <input type="number" min={0} step={1}
                                              value={sel?.qty ?? 0}
                                              onChange={e => updateField(item.id, { qty: parseFloat(e.target.value) || 0 })}
                                              onClick={e => e.stopPropagation()}
                                              className="flex-1 bg-white/5 text-white text-sm font-bold text-center outline-none rounded px-2 py-1 border border-white/10 focus:border-brand-accent"
                                            />
                                            <span className="text-[10px] font-black text-brand-accent">{item.un}</span>
                                            <button
                                              onClick={e => { e.stopPropagation(); addStampToCanvas(`Rem. ${item.desc.split(' ').slice(0,2).join(' ')}: ${sel?.qty ?? 0} ${item.un}`, '#c0392b'); }}
                                              className="text-[9px] bg-red-600/30 hover:bg-red-600/60 text-red-300 px-1.5 py-1 rounded border border-red-500/30 transition-colors flex items-center gap-1"
                                            ><Plus size={8}/> canvas</button>
                                          </div>
                                        )}

                                        <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                                          <span className="text-[9px] text-white/30 font-bold w-16">× Reps</span>
                                          <input type="number" min={1} step={1}
                                            value={sel?.repeticoes ?? 1}
                                            onChange={e => updateField(item.id, { repeticoes: parseInt(e.target.value) || 1 })}
                                            onClick={e => e.stopPropagation()}
                                            className="flex-1 bg-white/5 text-white text-xs font-bold text-center outline-none rounded px-2 py-1 border border-white/10 focus:border-orange-400"
                                          />
                                          {(sel?.repeticoes ?? 1) > 1 && (
                                            <span className="text-[9px] font-black text-orange-400">×{sel?.repeticoes}</span>
                                          )}
                                        </div>

                                        <div className="flex items-center justify-between pt-1 border-t border-white/10">
                                          <span className="text-[9px] text-white/30">{sel?.totalLabel}</span>
                                          <span className="text-[12px] font-black text-brand-accent">
                                            {sel?.totalFinal?.toFixed(2)} {item.un}
                                          </span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {selectedServices.length > 0 && (
                <div className="border-t border-white/10 bg-black/40 shrink-0">
                  <div className="p-3 flex flex-col gap-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                    {selectedServices.map(({ item, totalFinal, totalLabel }) => (
                      <div key={item.id} className="flex items-center justify-between bg-brand-primary/20 border border-brand-primary/30 rounded-lg px-3 py-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black bg-brand-primary text-white px-1.5 py-0.5 rounded">{item.id}</span>
                          <span className="text-[10px] text-white/70 truncate max-w-[120px]">{item.desc}</span>
                          {item.modificador && (
                            <span className="text-[8px] font-black px-1 py-0.5 rounded bg-red-500/20 text-red-400">{item.modificador.label}</span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[11px] font-black text-brand-accent">{totalFinal?.toFixed(2)} {item.un}</div>
                          <div className="text-[8px] text-white/25">{totalLabel}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-3 pb-3">
                    <textarea
                      className="w-full h-16 bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white/80 placeholder:text-white/25 resize-none focus:border-brand-accent focus:outline-none transition-all"
                      placeholder="Observação técnica (contexto para a I.A.)..."
                      value={observation}
                      onChange={e => {
                        setObservation(e.target.value);
                        setSelectedServices(prev => prev.map(s => ({ ...s, context: e.target.value })));
                      }}
                    />
                  </div>
                </div>
              )}
                </>
              )}
            </div>
          </div>

          {/* ── RODAPÉ ── */}
          <div className="px-5 py-3 border-t border-white/10 bg-black/20 flex justify-between items-center shrink-0">
            <span className="text-[10px] font-mono text-white/20">Delete/Backspace para remover · Esc cancela polilinha</span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveAndClose}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-brand-accent text-white hover:brightness-110 shadow-lg shadow-brand-accent/20 transition-all"
              >
                <Save size={15} />
                Salvar Marcações
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Botão de Ferramenta ─────────────────────────────────────────────────────
function ToolBtn({ active, icon, onClick, title }: { active: boolean; icon: React.ReactNode; onClick: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all ${active ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/30 scale-105' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
    >
      {icon}
    </button>
  );
}
