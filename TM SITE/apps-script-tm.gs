/**
 * TM Sempre Tecnologia — Apps Script
 * Tem DUAS funções:
 *   onFormSubmit → dispara quando alguém preenche o Google Forms
 *   doPost       → dispara quando o site envia via fetch (web app)
 *
 * COMO CONFIGURAR (única vez):
 * 1. Cole TODO este código no Apps Script da planilha
 * 2. Salve (Ctrl+S)
 * 3. Implantar → Nova implantação → Tipo: Web App
 *    - Executar como: Eu
 *    - Acesso: Qualquer pessoa
 * 4. Copie a URL /exec gerada
 * 5. No HTML do site, substitua SCRIPT_URL_PLACEHOLDER pela URL copiada
 *
 * O gatilho onFormSubmit já deve estar configurado — não mexer.
 */

var EMAIL_DESTINO = 'thiagonascimento.barbosapro@gmail.com';
var NOME_EMPRESA  = 'TM Sempre Tecnologia';
var COR           = '#E86010';

/* ─── Chamado pelo SITE (fetch POST) ─────────────────────── */
function doPost(e) {
  try {
    var dados = JSON.parse(e.postData.contents);
    salvarESendEmail(dados.nome, dados.whatsapp, dados.email, 'Site');
    return json({ status: 'ok' });
  } catch (err) {
    Logger.log('doPost erro: ' + err.message);
    return json({ status: 'error', message: err.message });
  }
}

/* ─── Chamado pelo GOOGLE FORMS (trigger) ────────────────── */
function onFormSubmit(e) {
  try {
    var r         = e.namedValues;
    var nome      = (r['Seu nome']  || r['Nome']      || [''])[0];
    var whatsapp  = (r['WhatsApp']  || r['Whatsapp']  || [''])[0];
    var email     = (r['E-mail']    || r['Email']     || [''])[0];
    salvarESendEmail(nome, whatsapp, email, 'Google Forms');
  } catch (err) {
    Logger.log('onFormSubmit erro: ' + err.message);
  }
}

/* ─── Lógica compartilhada ───────────────────────────────── */
function salvarESendEmail(nome, whatsapp, email, origem) {
  var timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  // Salva na aba ativa da planilha
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Data/Hora', 'Nome', 'WhatsApp', 'E-mail', 'Origem']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  sheet.appendRow([timestamp, nome, whatsapp, email, origem]);

  // Dispara e-mail
  var waLink = 'https://wa.me/55' + (whatsapp || '').replace(/\D/g, '');
  MailApp.sendEmail({
    to:       EMAIL_DESTINO,
    subject:  '[' + origem + '] Aviso de lancamento — ' + (nome || 'sem nome'),
    htmlBody: buildEmail(nome, whatsapp, email, timestamp, origem, waLink)
  });
}

/* ─── Helpers ────────────────────────────────────────────── */
function doOptions() {
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function row(label, value) {
  return '<tr style="border-bottom:1px solid #252220">'
    + '<td style="padding:11px 0;font-size:13px;color:#4E4B46;width:30%">' + label + '</td>'
    + '<td style="padding:11px 0;font-size:14px;color:#F0EDE8;font-weight:600">' + value + '</td>'
    + '</tr>';
}

function buildEmail(nome, whatsapp, email, timestamp, origem, waLink) {
  return '<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;'
    + 'background:#0b0a09;border:1px solid #252220;border-radius:8px;overflow:hidden">'

    + '<div style="background:' + COR + ';padding:20px 28px">'
    + '<h2 style="color:#fff;margin:0;font-size:17px">Aviso de Lancamento</h2>'
    + '<p style="color:rgba(255,255,255,.75);margin:4px 0 0;font-size:12px">'
    + NOME_EMPRESA + ' &nbsp;·&nbsp; via ' + origem + '</p>'
    + '</div>'

    + '<div style="padding:28px;background:#131210">'
    + '<p style="color:#4E4B46;font-size:11px;margin:0 0 20px;'
    + 'text-transform:uppercase;letter-spacing:.05em">Recebido: ' + timestamp + '</p>'
    + '<table style="width:100%;border-collapse:collapse">'
    + row('Nome',     nome     || '—')
    + row('WhatsApp', '<a href="' + waLink + '" style="color:' + COR + '">' + (whatsapp || '—') + '</a>')
    + row('E-mail',   email ? '<a href="mailto:' + email + '" style="color:' + COR + '">' + email + '</a>' : '—')
    + '</table>'

    + '<div style="margin-top:24px;padding-top:20px;border-top:1px solid #252220;display:flex;gap:10px;flex-wrap:wrap">'
    + '<a href="' + waLink + '" style="display:inline-block;background:' + COR
    + ';color:#fff;padding:10px 18px;border-radius:5px;text-decoration:none;font-size:13px;font-weight:700">Abrir WhatsApp</a>'
    + (email ? '<a href="mailto:' + email + '" style="display:inline-block;background:transparent;color:' + COR
    + ';padding:10px 18px;border-radius:5px;text-decoration:none;font-size:13px;font-weight:600;'
    + 'border:1px solid #252220">Responder e-mail</a>' : '')
    + '</div>'
    + '</div>'

    + '<div style="padding:14px 28px;background:#0b0a09;border-top:1px solid #252220">'
    + '<p style="color:#4E4B46;font-size:10px;margin:0;text-transform:uppercase;letter-spacing:.05em">'
    + 'thiagonascimentobarbosapro.com</p>'
    + '</div>'
    + '</div>';
}
