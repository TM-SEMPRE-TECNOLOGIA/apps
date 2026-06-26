// Base de Itens Maffeng — gerado a partir de Itens Reorganizado.md
// Colunas: id (código), desc (descrição), un (unidade de medida), cat (categoria)

export interface Modificador {
  tipo: 'div' | 'mult';
  valor: number;
  label: string; // ex: '÷10', '×3'
}

export interface MaffengItem {
  id: string;
  desc: string;
  un: string;
  cat: string;
  modificador?: Modificador; // undefined = total normal
}

export const ITENS_MAFFENG: MaffengItem[] = [
  // 1 — SERVIÇOS GERAIS
  { id: '1.1', desc: 'Chamado', un: 'un', cat: 'SERVIÇOS GERAIS' },
  { id: '1.2', desc: 'Deslocamento', un: 'un', cat: 'SERVIÇOS GERAIS' },

  // 2 — SERVIÇOS PRELIMINARES
  { id: '2.1', desc: 'Limpeza de obras', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.2', desc: 'Demolição/remoção alvenaria', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.3', desc: 'Demolição revestimento piso', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.4', desc: 'Demolição/remoção concreto', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.5', desc: 'Remoção porta madeira', un: 'un', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.6', desc: 'Remoção porta vidro', un: 'un', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.7', desc: 'Remoção janela', un: 'un', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.8', desc: 'Desmontagem equipamentos sanitários', un: 'un', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.9', desc: 'Remoção forro com estrutura', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.10', desc: 'Remoção revestimento cerâmico', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.11', desc: 'Remoção soleira/peitoril', un: 'm', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.12', desc: 'Retirada piso cerâmico', un: 'm²', cat: 'SERVIÇOS PRELIMINARES', modificador: { tipo: 'div', valor: 10, label: '÷10' } },
  { id: '2.13', desc: 'Remoção forro gesso sem estrutura', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.14', desc: 'Remoção rodapé', un: 'm', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.15', desc: 'Remoção manta asfáltica', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.16', desc: 'Remoção impermeabilização', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.17', desc: 'Remoção telhas', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.18', desc: 'Remoção entulho com caçamba', un: 'un', cat: 'SERVIÇOS PRELIMINARES', modificador: { tipo: 'div', valor: 10, label: '÷10' } },
  { id: '2.19', desc: 'Transporte interno entulho', un: 'un', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.20', desc: 'Remoção vidro', un: 'un', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.21', desc: 'Andaime metálico tubular', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.22', desc: 'Balancim elétrico', un: 'h', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.23', desc: 'Escada extensível', un: 'h', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.24', desc: 'Locação andaime/equipamentos', un: 'un', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.25', desc: 'Remoção piso vinílico', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.26', desc: 'Remoção carpete', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.27', desc: 'Remoção luminária', un: 'un', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.28', desc: 'Fixação objetos diversos', un: 'un', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.29', desc: 'Remoção/reinstalação telhas cobertura', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.30', desc: 'Remoção Tapume/Chapas metálicas/madeira', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.31', desc: 'Anotação Responsabilidade Técnica (ART)', un: 'un', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.32', desc: 'Remoção forro sem estrutura', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.33', desc: 'Demolição revestimento parede - Manual', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.34', desc: 'Demolição revestimento parede - Mecanizado', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.35', desc: 'Remoção poste/mastro bandeira', un: 'un', cat: 'SERVIÇOS PRELIMINARES' },
  { id: '2.36', desc: 'Tela para Andaime', un: 'm²', cat: 'SERVIÇOS PRELIMINARES' },

  // 5 — ESTRUTURA
  { id: '5.1', desc: 'Base concreto fixação TAA/TTE', un: 'm²', cat: 'ESTRUTURA' },
  { id: '5.2', desc: 'Montagem/Desmontagem escoramento madeira', un: 'm²', cat: 'ESTRUTURA' },
  { id: '5.3', desc: 'Montagem/Desmontagem escoramento metálico', un: 'm²', cat: 'ESTRUTURA' },

  // 6 — ALVENARIAS E OUTRAS VEDAÇÕES
  { id: '6.1', desc: 'Alvenaria tijolo cerâmico furado', un: 'm²', cat: 'ALVENARIA' },
  { id: '6.2', desc: 'Parede gesso acartonado dry wall', un: 'm²', cat: 'ALVENARIA' },
  { id: '6.3', desc: 'Rasgo/fechamento alvenaria piso', un: 'm', cat: 'ALVENARIA' },

  // 7 — COBERTURA
  { id: '7.1', desc: 'Cobertura telha alumínio', un: 'm²', cat: 'COBERTURA' },
  { id: '7.2', desc: 'Cobertura telha isolamento poliuretano', un: 'm²', cat: 'COBERTURA' },
  { id: '7.3', desc: 'Cumeeira chapa metálica', un: 'm', cat: 'COBERTURA' },
  { id: '7.4', desc: 'Cobertura telha cerâmica', un: 'm²', cat: 'COBERTURA' },
  { id: '7.5', desc: 'Cumeeira telha cerâmica', un: 'm', cat: 'COBERTURA' },
  { id: '7.6', desc: 'Cumeeira fibrocimento e=6mm', un: 'm', cat: 'COBERTURA' },
  { id: '7.7', desc: 'Cobertura telha fibrocimento e=6mm', un: 'm²', cat: 'COBERTURA' },
  { id: '7.8', desc: 'Calha chapa galvanizada', un: 'm', cat: 'COBERTURA' },
  { id: '7.9', desc: 'Rufo chapa aço galvanizado', un: 'm', cat: 'COBERTURA' },
  { id: '7.10', desc: 'Chapim chapa aço galvanizado', un: 'm', cat: 'COBERTURA' },
  { id: '7.11', desc: 'Cobertura telha fibrocimento estrutural', un: 'm²', cat: 'COBERTURA' },
  { id: '7.12', desc: 'Estrutura madeira para telha', un: 'm²', cat: 'COBERTURA' },
  { id: '7.13', desc: 'Fixação telha', un: 'm²', cat: 'COBERTURA' },
  { id: '7.14', desc: 'Calha chapa galvanizada (larga)', un: 'm²', cat: 'COBERTURA' },
  { id: '7.15', desc: 'Reparo emergencial telhado/calhas', un: 'un', cat: 'COBERTURA' },

  // 8 — IMPERMEABILIZAÇÃO
  { id: '8.1', desc: 'Proteção mecânica superfície', un: 'm²', cat: 'IMPERMEABILIZAÇÃO' },
  { id: '8.2', desc: 'Impermeabilização manta asfáltica', un: 'm²', cat: 'IMPERMEABILIZAÇÃO' },
  { id: '8.3', desc: 'Impermeabilização manta asfáltica polimérica', un: 'm²', cat: 'IMPERMEABILIZAÇÃO' },
  { id: '8.4', desc: 'Impermeabilização calha/lajes', un: 'm²', cat: 'IMPERMEABILIZAÇÃO' },
  { id: '8.5', desc: 'Impermeabilização flexível acrílica', un: 'm²', cat: 'IMPERMEABILIZAÇÃO' },
  { id: '8.6', desc: 'Impermeabilização argamassa polimérica', un: 'm²', cat: 'IMPERMEABILIZAÇÃO' },
  { id: '8.7', desc: 'Impermeabilização membrana poliuretano', un: 'm²', cat: 'IMPERMEABILIZAÇÃO' },

  // 10 — PAVIMENTAÇÃO
  { id: '10.1', desc: 'Regularização base/contrapiso', un: 'm²', cat: 'PAVIMENTAÇÃO' },
  { id: '10.2', desc: 'Regularização piso vinílico/tátil', un: 'm²', cat: 'PAVIMENTAÇÃO' },
  { id: '10.3', desc: 'Granito revestimento Cinza Andorinha', un: 'm²', cat: 'PAVIMENTAÇÃO' },
  { id: '10.4', desc: 'Rodapé granito Cinza Andorinha', un: 'm', cat: 'PAVIMENTAÇÃO' },
  { id: '10.5', desc: 'Peitoril/soleira granito', un: 'm', cat: 'PAVIMENTAÇÃO' },
  { id: '10.8', desc: 'Bloco concreto intertravado', un: 'm²', cat: 'PAVIMENTAÇÃO' },
  { id: '10.11', desc: 'Piso ladrilho hidráulico', un: 'm²', cat: 'PAVIMENTAÇÃO' },
  { id: '10.12', desc: 'Piso cimentado', un: 'm²', cat: 'PAVIMENTAÇÃO' },
  { id: '10.13', desc: 'Piso cerâmico', un: 'm²', cat: 'PAVIMENTAÇÃO' },
  { id: '10.14', desc: 'Piso Porcelanato', un: 'm²', cat: 'PAVIMENTAÇÃO' },
  { id: '10.15', desc: 'Rejuntamento revestimento', un: 'm²', cat: 'PAVIMENTAÇÃO' },
  { id: '10.16', desc: 'Piso vinílico manta', un: 'm²', cat: 'PAVIMENTAÇÃO' },
  { id: '10.17', desc: 'Piso vinílico placas', un: 'm²', cat: 'PAVIMENTAÇÃO' },
  { id: '10.19', desc: 'Rodapé madeira', un: 'm', cat: 'PAVIMENTAÇÃO' },
  { id: '10.20', desc: 'Capacho - instalação', un: 'm²', cat: 'PAVIMENTAÇÃO' },

  // 11 — REVESTIMENTOS
  { id: '11.1', desc: 'Painéis alumínio - ACM', un: 'm²', cat: 'REVESTIMENTO' },
  { id: '11.2', desc: 'Chapisco parede', un: 'm²', cat: 'REVESTIMENTO' },
  { id: '11.3', desc: 'Emboço/reboco', un: 'm²', cat: 'REVESTIMENTO' },
  { id: '11.4', desc: 'Revestimento cerâmico', un: 'm²', cat: 'REVESTIMENTO' },

  // 12 — DIVISÓRIAS, FORROS E PISOS FALSOS
  { id: '12.1', desc: 'Divisória texturizada cega', un: 'm²', cat: 'FORRO/DIVISÓRIA' },
  { id: '12.2', desc: 'Divisória texturizada vidro', un: 'm²', cat: 'FORRO/DIVISÓRIA' },
  { id: '12.3', desc: 'Porta divisória', un: 'un', cat: 'FORRO/DIVISÓRIA' },
  { id: '12.4', desc: 'Forro fibra mineral com estrutura', un: 'm²', cat: 'FORRO/DIVISÓRIA' },
  { id: '12.5', desc: 'Forro gesso acartonado', un: 'm²', cat: 'FORRO/DIVISÓRIA' },
  { id: '12.6', desc: 'Forro placa gesso pré-moldada', un: 'm²', cat: 'FORRO/DIVISÓRIA' },
  { id: '12.7', desc: 'Junta dilatação forro gesso', un: 'm', cat: 'FORRO/DIVISÓRIA' },
  { id: '12.9', desc: 'Forro gesso sem estrutura', un: 'm²', cat: 'FORRO/DIVISÓRIA' },
  { id: '12.10', desc: 'Forro fibra mineral sem estrutura', un: 'm²', cat: 'FORRO/DIVISÓRIA' },
  { id: '12.11', desc: 'Piso elevado sem estrutura', un: 'm²', cat: 'FORRO/DIVISÓRIA' },
  { id: '12.12', desc: 'Ajuste forro fibra mineral', un: 'm²', cat: 'FORRO/DIVISÓRIA' },
  { id: '12.13', desc: 'Forro PVC sem estrutura', un: 'm²', cat: 'FORRO/DIVISÓRIA' },
  { id: '12.14', desc: 'Forro gesso RU sem estrutura', un: 'm²', cat: 'FORRO/DIVISÓRIA' },

  // 13 — CARPINTARIA / MARCENARIA
  { id: '13.1', desc: 'Batente/guarnição porta madeira', un: 'un', cat: 'CARPINTARIA' },
  { id: '13.2', desc: 'Porta madeira 0,80x2,10m', un: 'un', cat: 'CARPINTARIA' },
  { id: '13.3', desc: 'Porta madeira 0,90x2,10m', un: 'un', cat: 'CARPINTARIA' },
  { id: '13.4', desc: 'Desmontagem divisórias', un: 'm²', cat: 'CARPINTARIA' },
  { id: '13.5', desc: 'Desmontagem estação trabalho/mesa', un: 'un', cat: 'CARPINTARIA' },
  { id: '13.7', desc: 'Ajuste divisórias', un: 'm²', cat: 'CARPINTARIA' },
  { id: '13.9', desc: 'Montagem estação trabalho/mesa', un: 'un', cat: 'CARPINTARIA' },
  { id: '13.10', desc: 'Montagem divisórias', un: 'm²', cat: 'CARPINTARIA' },
  { id: '13.11', desc: 'Montagem guichê/mesa', un: 'un', cat: 'CARPINTARIA' },
  { id: '13.12', desc: 'Deslocamento mobiliário', un: 'un', cat: 'CARPINTARIA' },
  { id: '13.13', desc: 'Divisória Padrão Guichê/Biombo', un: 'm²', cat: 'CARPINTARIA' },
  { id: '13.18', desc: 'Divisória fechamento/tampão', un: 'm²', cat: 'CARPINTARIA' },
  { id: '13.20', desc: 'Ajuste/manutenção portas', un: 'un', cat: 'CARPINTARIA' },
  { id: '13.21', desc: 'Manutenção dobradiça/fechadura', un: 'un', cat: 'CARPINTARIA' },
  { id: '13.22', desc: 'Desmontagem carenagens', un: 'un', cat: 'CARPINTARIA' },

  // 14 — SERRALHERIA
  { id: '14.1', desc: 'Janela aço basculante', un: 'm²', cat: 'SERRALHERIA' },
  { id: '14.2', desc: 'Janela aço correr', un: 'm²', cat: 'SERRALHERIA' },
  { id: '14.3', desc: 'Refixação corrimão/guarda corpo', un: 'm', cat: 'SERRALHERIA' },
  { id: '14.4', desc: 'Corrimão tubular aço', un: 'm', cat: 'SERRALHERIA' },
  { id: '14.6', desc: 'Recuperação grades/corrimões', un: 'm²', cat: 'SERRALHERIA' },
  { id: '14.7', desc: 'Recuperação estruturas metálicas', un: 'm²', cat: 'SERRALHERIA' },
  { id: '14.8', desc: 'Grade proteção ferro', un: 'm²', cat: 'SERRALHERIA' },
  { id: '14.9', desc: 'Chapa metálica inox', un: 'un', cat: 'SERRALHERIA' },
  { id: '14.13', desc: 'Manutenção porta enrolar automática', un: 'un', cat: 'SERRALHERIA' },
  { id: '14.17', desc: 'Substituição Lâminas até 5m²', un: 'm²', cat: 'SERRALHERIA' },
  { id: '14.18', desc: 'Substituição Lâminas 5-15m²', un: 'm²', cat: 'SERRALHERIA' },
  { id: '14.19', desc: 'Substituição Lâminas acima 15m²', un: 'm²', cat: 'SERRALHERIA' },
  { id: '14.20', desc: 'Substituição guia telescópica', un: 'm', cat: 'SERRALHERIA' },

  // 15 — FERRAGENS
  { id: '15.1', desc: 'Ferragem aço inox porta vidro', un: 'cj', cat: 'FERRAGENS' },
  { id: '15.2', desc: 'Ferragem porta madeira (3 dobradiças)', un: 'cj', cat: 'FERRAGENS' },
  { id: '15.3', desc: 'Ferragem porta madeira (fechadura)', un: 'cj', cat: 'FERRAGENS' },
  { id: '15.4', desc: 'Trinco piso c/espelho', un: 'un', cat: 'FERRAGENS' },
  { id: '15.5', desc: 'Mola aérea hidráulica', un: 'un', cat: 'FERRAGENS' },
  { id: '15.6', desc: 'Mola Piso hidráulica', un: 'un', cat: 'FERRAGENS' },
  { id: '15.7', desc: 'Mola hidráulica - Manutenção', un: 'un', cat: 'FERRAGENS' },
  { id: '15.10', desc: 'Trilho/roldana Porta retrátil', un: 'm', cat: 'FERRAGENS' },
  { id: '15.11', desc: 'Puxador tipo bola', un: 'un', cat: 'FERRAGENS' },
  { id: '15.16', desc: 'Reparo/ajuste fechaduras', un: 'un', cat: 'FERRAGENS' },

  // 16 — VIDRAÇARIA
  { id: '16.1', desc: 'Vidro cristal liso 4mm', un: 'm²', cat: 'VIDRAÇARIA' },
  { id: '16.2', desc: 'Vidro cristal liso 6mm', un: 'm²', cat: 'VIDRAÇARIA' },
  { id: '16.5', desc: 'Vidro temperado incolor 10mm', un: 'm²', cat: 'VIDRAÇARIA' },
  { id: '16.8', desc: 'Vidro jateado 6mm', un: 'm²', cat: 'VIDRAÇARIA' },
  { id: '16.9', desc: 'Porta vidro temperado 10mm', un: 'm²', cat: 'VIDRAÇARIA' },
  { id: '16.12', desc: 'Aplicação adesivo jateado', un: 'm²', cat: 'VIDRAÇARIA' },
  { id: '16.13', desc: 'Película vinil auto-adesivo', un: 'm²', cat: 'VIDRAÇARIA' },
  { id: '16.14', desc: 'Espelho lapidado/bizetado', un: 'm²', cat: 'VIDRAÇARIA' },
  { id: '16.16', desc: 'Persiana vertical tecido', un: 'm²', cat: 'VIDRAÇARIA' },
  { id: '16.17', desc: 'Persiana rolô blackout', un: 'm²', cat: 'VIDRAÇARIA' },
  { id: '16.18', desc: 'Manutenção persianas', un: 'un', cat: 'VIDRAÇARIA' },

  // 17 — PINTURA
  { id: '17.1', desc: 'Pintura esmalte sintético estrutura', un: 'm²', cat: 'PINTURA' },
  { id: '17.2', desc: 'Emassamento parede/teto', un: 'm²', cat: 'PINTURA' },
  { id: '17.3', desc: 'Pintura texturizada', un: 'm²', cat: 'PINTURA' },
  { id: '17.4', desc: 'Pintura látex acrílica standard', un: 'm²', cat: 'PINTURA' },
  { id: '17.5', desc: 'Emassamento massa acrílica', un: 'm²', cat: 'PINTURA' },
  { id: '17.6', desc: 'Pintura látex acrílica premium', un: 'm²', cat: 'PINTURA' },
  { id: '17.7', desc: 'Pintura esmalte madeira', un: 'm²', cat: 'PINTURA' },
  { id: '17.8', desc: 'Pintura piso resina acrílica', un: 'm²', cat: 'PINTURA' },
  { id: '17.9', desc: 'Pintura Automotiva', un: 'm²', cat: 'PINTURA' },
  { id: '17.10', desc: 'Pintura látex acrílica econômica', un: 'm²', cat: 'PINTURA' },
  { id: '17.11', desc: 'Pintura látex acrílica premium acetinada', un: 'm²', cat: 'PINTURA' },

  // 19 — INSTALAÇÕES ELÉTRICAS / TI
  { id: '19.1', desc: 'Ponto elétrico duplo', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.2', desc: 'Infraestrutura até 1"', un: 'm', cat: 'ELÉTRICA/TI' },
  { id: '19.3', desc: 'Ponto elétrico simples', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.4', desc: 'Infraestrutura 1,25" até 2"', un: 'm', cat: 'ELÉTRICA/TI' },
  { id: '19.5', desc: 'Infraestrutura eletrocalhas', un: 'm', cat: 'ELÉTRICA/TI' },
  { id: '19.6', desc: 'Espelhos/Placas/Tampas', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.9', desc: 'Desinstalação/Instalação luminária', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.10', desc: 'Ponto lógico/alarme', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.15', desc: 'Ponto câmera CFTV', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.16', desc: 'Desinstalação/Instalação WIFI/Access', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.17', desc: 'Luminária LED Direcional', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.20', desc: 'Refletor/projetor uso externo', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.25', desc: 'Lâmpada fluorescente 14W T5', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.26', desc: 'Lâmpada fluorescente compacta 25W', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.28', desc: 'Lâmpada fluorescente 32W', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.34', desc: 'Lâmpada LED Bulbo/PAR20', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.35', desc: 'Fita LED', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.36', desc: 'Lâmpada LED tubular 9/10W', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.37', desc: 'Lâmpada LED tubular 18/20W', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.42', desc: 'Luminária LED Quadrada', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.43', desc: 'Luminária LED autônoma', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.47', desc: 'Luminária circular completa', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.48', desc: 'Refletor alumínio 60 Leds', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.50', desc: 'Sensor presença teto/parede', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.53', desc: 'Quadros elétricos - Manutenção', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.59', desc: 'Disjuntor monopolar até 50A', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.72', desc: 'Cabo cobre 10-16mm²', un: 'm', cat: 'ELÉTRICA/TI' },
  { id: '19.77', desc: 'Timer digital - Programação', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.78', desc: 'Timer digital - Interruptor horário', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.83', desc: 'Bloco autônomo emergência 1200 lúmens', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.84', desc: 'Bloco autônomo emergência 2200 lúmens', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.89', desc: 'Driver corrente lâmpadas/fitas', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.96', desc: 'Manutenção Sistema Controle Acesso', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.104', desc: 'Fechadura Eletromagnética 150kgf', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.124', desc: 'Relé Fotoelétrico', un: 'un', cat: 'ELÉTRICA/TI' },
  { id: '19.129', desc: 'Ponto lógico - troca cabo UTP', un: 'm', cat: 'ELÉTRICA/TI' },
  { id: '19.130', desc: 'Ponto elétrico - troca cabo', un: 'm', cat: 'ELÉTRICA/TI' },

  // 20 — INSTALAÇÕES DE ÁGUA
  { id: '20.14', desc: 'Correção vazamentos', un: 'un', cat: 'HIDRÁULICA' },
  { id: '20.15', desc: 'Desentupimento água pluvial', un: 'un', cat: 'HIDRÁULICA' },
  { id: '20.16', desc: 'Desentupimento Esgoto', un: 'un', cat: 'HIDRÁULICA' },
  { id: '20.18', desc: 'Válvula descarga metálica', un: 'un', cat: 'HIDRÁULICA' },
  { id: '20.23', desc: 'Correção vazamentos tubulação', un: 'un', cat: 'HIDRÁULICA' },

  // 21 — INSTALAÇÕES CONTRA INCÊNDIO
  { id: '21.1', desc: 'Mangueira tipo 2', un: 'm', cat: 'INCÊNDIO' },
  { id: '21.9', desc: 'Placa PPCI fotoluminescente', un: 'un', cat: 'INCÊNDIO' },

  // 22 — INSTALAÇÕES SANITÁRIAS
  { id: '22.1', desc: 'Manutenção caixas descarga', un: 'un', cat: 'SANITÁRIO' },
  { id: '22.2', desc: 'Manutenção caixa descarga Espelho', un: 'un', cat: 'SANITÁRIO' },
  { id: '22.3', desc: 'Manutenção válvula descarga', un: 'un', cat: 'SANITÁRIO' },
  { id: '22.4', desc: 'Manutenção Torneira', un: 'un', cat: 'SANITÁRIO' },
  { id: '22.5', desc: 'Manutenção bacia sanitária', un: 'un', cat: 'SANITÁRIO' },
  { id: '22.8', desc: 'Ralo Semiesférico', un: 'un', cat: 'SANITÁRIO' },
  { id: '22.10', desc: 'Ralo sifonado PVC', un: 'un', cat: 'SANITÁRIO' },

  // 28 — EQUIPAMENTOS SANITÁRIOS E COZINHA
  { id: '28.3', desc: 'BARRA apoio inox até 90cm', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.9', desc: 'Dosador sabão dispenser', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.11', desc: 'Ducha higiênica cromada', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.13', desc: 'Engate flexível água', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.18', desc: 'Dispenser papel higiênico', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.19', desc: 'Dispenser toalha papel', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.20', desc: 'Sifão flexível', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.22', desc: 'Válvula descarga mictório', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.25', desc: 'Assento Plástico', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.28', desc: 'Torneira mesa fechamento', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.30', desc: 'Bebedouro - Instalação', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.31', desc: 'Fixação equipamentos', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.32', desc: 'Torneira banheiro PNE', un: 'un', cat: 'EQUIPAMENTOS' },
  { id: '28.33', desc: 'Torneira copa/cozinha', un: 'un', cat: 'EQUIPAMENTOS' },

  // 29 — DIVERSOS
  { id: '29.1', desc: 'Sinalização acessibilidade', un: 'un', cat: 'DIVERSOS' },
  { id: '29.2', desc: 'Adesivos padrão BB', un: 'm', cat: 'DIVERSOS' },
  { id: '29.4', desc: 'Borda piso fotoluminescente', un: 'm', cat: 'DIVERSOS' },
  { id: '29.5', desc: 'Alarme emergência sanitário', un: 'cj', cat: 'DIVERSOS' },
  { id: '29.6', desc: 'Piso tátil borracha', un: 'un', cat: 'DIVERSOS' },
  { id: '29.7', desc: 'Faixa adesiva segurança', un: 'm', cat: 'DIVERSOS' },
  { id: '29.8', desc: 'Grafema vinil adesivo', un: 'un', cat: 'DIVERSOS' },
  { id: '29.11', desc: 'Fita adesiva piso', un: 'm', cat: 'DIVERSOS' },
  { id: '29.12', desc: 'Fita antiderrapante', un: 'm', cat: 'DIVERSOS' },
  { id: '29.22', desc: 'Ajuste biombo/divisórias', un: 'un', cat: 'DIVERSOS' },
  { id: '29.24', desc: 'Remoção adesivos/limpeza', un: 'm²', cat: 'DIVERSOS', modificador: { tipo: 'div', valor: 10, label: '÷10' } },
  { id: '29.25', desc: 'Reparo carenagens', un: 'un', cat: 'DIVERSOS' },
  { id: '29.26', desc: 'Recolagem piso tátil', un: 'un', cat: 'DIVERSOS' },
  { id: '29.30', desc: 'Piso tátil concreto', un: 'un', cat: 'DIVERSOS' },
  { id: '29.43', desc: 'Vedações em geral', un: 'un', cat: 'DIVERSOS' },
  { id: '29.44', desc: 'Piso tátil Inox', un: 'm', cat: 'DIVERSOS' },

  // 30 — LIMPEZA E VERIFICAÇÃO FINAL
  { id: '30.1', desc: 'Limpeza e verificação final', un: 'un', cat: 'LIMPEZA' },
];

export const CATEGORIAS = [...new Set(ITENS_MAFFENG.map(i => i.cat))];
