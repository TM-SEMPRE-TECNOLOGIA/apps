/**
 * TM·Zap Inspeção — Exportação para AutoRelatório
 * Converte o histórico de chat em estrutura de pastas
 * compatível com o scanner do AutoRelatório V4 (Modo APP)
 *
 * Formato gerado:
 *   [CONTRATO] - [CIDADE]/
 *   ├── - Fachada Externa/
 *   │   ├── 16,00 x 7,00 - Desconto 16,00 x 2,50.jpg
 *   │   └── - Detalhes/
 *   │       └── IMG_002.jpg
 *   └── - Auto Atendimento/
 *       └── 2,90 x 3,30.jpg
 */

/* ── Importa JSZip via CDN (carregado no index.html) ─ */
/* window.JSZip é injetado pelo script tag */

/* ════════════════════════════════════════════════════
   PARSER: converte mensagens do chat em estrutura
   ════════════════════════════════════════════════════ */
export function parsearMensagens(mensagens) {
  /**
   * Retorna array de "grupos" (um por ambiente):
   * [
   *   {
   *     ambiente: "Fachada Externa",
   *     itens: [
   *       {
   *         fotos: [{ fotoId, objectUrl, blob }],  // [0]=principal, [1..]=detalhes
   *         texto: "16.00/7.00\nDescontar janelas 16.00/2.50",
   *         nomePrincipal: "16,00 x 7,00 - Desconto 16,00 x 2,50",
   *       }
   *     ]
   *   }
   * ]
   */

  const grupos = [];
  let ambienteAtual = 'Levantamento';
  let itemAtual = null; // { fotos, texto }

  function novoGrupo(nome) {
    const g = { ambiente: nome, itens: [] };
    grupos.push(g);
    return g;
  }

  function grupoAtual() {
    if (!grupos.length) return novoGrupo(ambienteAtual);
    return grupos[grupos.length - 1];
  }

  function fecharItemAtual() {
    if (!itemAtual) return;
    if (itemAtual.fotos.length > 0) {
      grupoAtual().itens.push(itemAtual);
    }
    itemAtual = null;
  }

  for (const msg of mensagens) {
    if (msg.apagada) continue; // mensagens apagadas ignoradas

    if (msg.tipo === 'foto') {
      if (!itemAtual) {
        // Nova foto sem item anterior → novo item
        itemAtual = { fotos: [msg], texto: '', nomePrincipal: '' };
      } else if (itemAtual.texto) {
        // Já tem texto → nova foto é um novo item
        fecharItemAtual();
        itemAtual = { fotos: [msg], texto: '', nomePrincipal: '' };
      } else {
        // Sem texto ainda → é foto de detalhe do item atual
        itemAtual.fotos.push(msg);
      }

    } else if (msg.tipo === 'texto') {
      const txt = (msg.texto || '').trim();
      if (!txt) continue;

      // Detecta separador de ambiente: texto puro SEM padrão de medição
      if (_ehSeparadorAmbiente(txt)) {
        fecharItemAtual();
        ambienteAtual = _normalizarAmbiente(txt);
        novoGrupo(ambienteAtual);
        itemAtual = null;
      } else {
        // É medição/observação → associa ao item atual ou ao último item
        if (itemAtual) {
          itemAtual.texto = txt;
          itemAtual.nomePrincipal = _textoParaNomeFoto(txt);
        } else {
          // Texto sem foto anterior → pode ser medição de lote de fotos
          // Associa ao último item do grupo atual
          const g = grupoAtual();
          if (g.itens.length) {
            const ultimo = g.itens[g.itens.length - 1];
            if (!ultimo.texto) {
              ultimo.texto = txt;
              ultimo.nomePrincipal = _textoParaNomeFoto(txt);
            }
          }
        }
      }
    }
  }

  fecharItemAtual();
  return grupos;
}

/* ── Detectar separador de ambiente ──────────────── */
function _ehSeparadorAmbiente(txt) {
  // É separador se:
  // - Não contém padrão de medição (números com / ou x)
  // - Não começa com "Descontar"
  // - É texto em maiúsculas ou título (ex: "ATENDIMENTO", "Auto ATENDIMENTO", "Corredor")
  const temMedicao = /\d+[,.]?\d*\s*[\/x]/.test(txt);
  const temDesconto = /descontar|desconto/i.test(txt);
  const temUnidade = /\d+\s*(und|unid|un\b)/i.test(txt);
  const ehOk = /^(telhado|piso|spda|estrutura|calha|forro|cobertura)[\s\w]*ok/i.test(txt);

  // Texto todo maiúsculo ou misturado maiúsculo (ex: "Auto ATENDIMENTO")
  const semNumeros = txt.replace(/\d/g, '').trim();
  const temMaisculo = semNumeros.length > 3 && semNumeros === semNumeros.toUpperCase();

  if (temMedicao || temDesconto || temUnidade) return false;
  if (ehOk) return false;

  // Heurística: palavras conhecidas de ambiente
  const palavrasAmbiente = ['atendimento', 'autoatendimento', 'corredor', 'banheiro',
    'copa', 'cozinha', 'sala', 'cofre', 'fachada', 'cobertura', 'telhado',
    'almoxarifado', 'recepção', 'recepçao', 'entrada', 'garagem', 'subsolo',
    'pavimento', 'andar', 'escada', 'externo', 'interno', 'quintal'];

  const txtLow = txt.toLowerCase();
  const temPalavraAmbiente = palavrasAmbiente.some(p => txtLow.includes(p));

  return temMaisculo || temPalavraAmbiente;
}

/* ── Normalizar nome de ambiente ─────────────────── */
function _normalizarAmbiente(txt) {
  // "Auto ATENDIMENTO" → "Auto Atendimento"
  return txt.trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/\bSaa\b/g, 'SAA');
}

/* ── Texto → nome de arquivo ─────────────────────── */
function _textoParaNomeFoto(txt) {
  if (!txt) return null;

  // Substitui . por , nas medidas (padrão do AutoRelatório)
  let nome = txt.trim()
    .replace(/(\d)\.(\d)/g, '$1,$2')   // 16.00 → 16,00
    .replace(/\n/g, ' - ')              // quebras de linha viram " - "
    .replace(/Descontar /gi, 'Desconto ') // Descontar → Desconto
    .replace(/[\\/:*?"<>|]/g, '_')      // chars inválidos em nome de arquivo
    .trim();

  // Limita tamanho
  if (nome.length > 120) nome = nome.substring(0, 120);

  return nome || null;
}

/* ── Gerar nome de arquivo para foto de detalhe ──── */
function _nomeDetalhe(idx) {
  return `IMG_${String(idx).padStart(3, '0')}`;
}

/* ════════════════════════════════════════════════════
   GERADOR DE ZIP
   ════════════════════════════════════════════════════ */
export async function gerarZip(grupos, nomeOS, onProgress) {
  if (!window.JSZip) {
    throw new Error('JSZip não carregado. Verifique o index.html.');
  }

  const zip = new window.JSZip();
  const pastaRaiz = zip.folder(nomeOS);

  let totalFotos = 0;
  let fotosDone  = 0;

  // Conta total de fotos para o progresso
  for (const g of grupos)
    for (const item of g.itens)
      totalFotos += item.fotos.length;

  for (const grupo of grupos) {
    const nomeAmbiente = `- ${grupo.ambiente}`;
    const pastaAmbiente = pastaRaiz.folder(nomeAmbiente);

    let contadorDetalhe = 1;

    for (const item of grupo.itens) {
      const [fotoPrincipal, ...fotosDetalhe] = item.fotos;

      // Nome da foto principal
      const nomePrinc = item.nomePrincipal || _nomeDetalhe(contadorDetalhe++);
      const ext = '.jpg';

      // Blob da foto principal
      const blobPrinc = await _resolverBlob(fotoPrincipal);
      if (blobPrinc) {
        pastaAmbiente.file(`${nomePrinc}${ext}`, blobPrinc);
      }

      fotosDone++;
      if (onProgress) onProgress(Math.round(fotosDone / totalFotos * 100));

      // Fotos de detalhe → subpasta "- Detalhes"
      if (fotosDetalhe.length > 0) {
        const pastaDetalhes = pastaAmbiente.folder('- Detalhes');
        for (const fd of fotosDetalhe) {
          const blobDet = await _resolverBlob(fd);
          if (blobDet) {
            pastaDetalhes.file(`${_nomeDetalhe(contadorDetalhe++)}${ext}`, blobDet);
          }
          fotosDone++;
          if (onProgress) onProgress(Math.round(fotosDone / totalFotos * 100));
        }
      }
    }
  }

  return await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
}

/* ── Resolver blob da foto ───────────────────────── */
async function _resolverBlob(msg) {
  if (msg.blob instanceof Blob) return msg.blob;
  if (msg.objectUrl) {
    try {
      const res = await fetch(msg.objectUrl);
      return await res.blob();
    } catch { return null; }
  }
  // Tenta IndexedDB
  if (msg.fotoId) {
    const { lerFotoBlob } = await import('../data/sessao.js');
    return await lerFotoBlob(msg.fotoId);
  }
  return null;
}

/* ── Download do ZIP ─────────────────────────────── */
export function baixarZip(blob, nomeOS) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${nomeOS}.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/* ── Enviar para AutoRelatório (mesma rede) ──────── */
export async function enviarParaAutorelatorio(grupos, nomeOS, apiUrl = 'http://localhost:5000') {
  try {
    const zipBlob = await gerarZip(grupos, nomeOS);
    const form = new FormData();
    form.append('zip', zipBlob, `${nomeOS}.zip`);
    form.append('nome_os', nomeOS);

    const res = await fetch(`${apiUrl}/api/importar-zap`, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json(); // { pasta_destino, n_fotos }
  } catch (e) {
    console.error('[Export] Erro ao enviar para AutoRelatório:', e);
    throw e;
  }
}

/* ── Preview da estrutura (texto) ────────────────── */
export function previewEstrutura(grupos) {
  const linhas = [];
  for (const g of grupos) {
    linhas.push(`📁 - ${g.ambiente}/`);
    for (const item of g.itens) {
      const nome = item.nomePrincipal || '(sem medição)';
      linhas.push(`   📷 ${nome}.jpg`);
      if (item.fotos.length > 1) {
        linhas.push(`   📁 - Detalhes/`);
        item.fotos.slice(1).forEach((_, i) => {
          linhas.push(`      📷 IMG_${String(i + 1).padStart(3, '0')}.jpg`);
        });
      }
    }
  }
  return linhas.join('\n');
}
