/*
 * Catálogo da v1. ITENS ILUSTRATIVOS: imagens conceituais e do feed, nomes provisórios.
 * Substituir por fotos e dados reais da loja antes da publicação. Não há preços de propósito:
 * valores e disponibilidade são sempre confirmados no atendimento.
 */
(function () {
  var TAMANHOS_QUADRO = ['40 x 60 cm', '60 x 90 cm', '80 x 120 cm', '100 x 150 cm', 'Sob medida'];
  var ACABAMENTOS_QUADRO = ['Moldura preta', 'Moldura madeira natural', 'Moldura dourada', 'Canvas sem moldura'];
  var TAMANHOS_ESPELHO = ['50 x 70 cm', '60 x 90 cm', '80 x 120 cm', '100 x 180 cm', 'Sob medida'];
  var ACABAMENTOS_ESPELHO = ['Moldura dourada', 'Moldura preta', 'Moldura madeira natural', 'Bisotê sem moldura'];

  window.CDA_CATEGORIAS = {
    quadros: 'Quadros',
    espelhos: 'Espelhos',
    religiosa: 'Arte religiosa',
  };

  window.CDA_AMBIENTES = {
    sala: 'Sala',
    quarto: 'Quarto',
    hall: 'Hall de entrada',
    cozinha: 'Cozinha e jantar',
    escritorio: 'Escritório',
  };

  window.CDA_COLECOES = {
    'colecao-2026': { nome: 'Coleção 2026', descricao: 'Tons terrosos, texturas e abstratos para ambientes acolhedores.' },
    'mar-natureza': { nome: 'Mar e natureza', descricao: 'Praias, pôr do sol e paisagens que trazem o litoral para dentro de casa.' },
    botanicos: { nome: 'Botânicos', descricao: 'Folhas, frutas e flores em composições atemporais.' },
    classicos: { nome: 'Clássicos', descricao: 'Releituras de grandes mestres com molduras trabalhadas.' },
    religiosa: { nome: 'Arte religiosa', descricao: 'Peças de fé com acabamento para salas, oratórios e presentes.' },
    espelhos: { nome: 'Espelhos de design', descricao: 'Formatos orgânicos, arcos e redondos para ampliar e iluminar.' },
  };

  window.CDA_PRODUTOS = [
    {
      id: 'abstrato-terra', codigo: 'CA-Q101', nome: 'Abstrato Terra', categoria: 'quadros', colecao: 'colecao-2026',
      ambientes: ['sala', 'escritorio'], cores: ['terroso', 'preto'], destaque: true,
      imagens: ['hero-sala.webp'],
      descricao: 'Composição abstrata em tons de terra, ocre e carvão. Pensada para paredes amplas de sala, sobre sofá ou aparador.',
      tamanhos: TAMANHOS_QUADRO, acabamentos: ACABAMENTOS_QUADRO,
    },
    {
      id: 'gruta-entardecer', codigo: 'CA-Q102', nome: 'Gruta ao Entardecer', categoria: 'quadros', colecao: 'mar-natureza',
      ambientes: ['sala', 'hall'], cores: ['terroso', 'azul'], destaque: true,
      imagens: ['cat-quadros.webp'],
      descricao: 'Paisagem vertical de gruta à beira-mar ao pôr do sol. Formato alongado que valoriza pé-direito e corredores.',
      tamanhos: TAMANHOS_QUADRO, acabamentos: ACABAMENTOS_QUADRO,
    },
    {
      id: 'diptico-limoes', codigo: 'CA-Q103', nome: 'Díptico Limões Sicilianos', categoria: 'quadros', colecao: 'botanicos',
      ambientes: ['cozinha', 'sala'], cores: ['amarelo', 'verde', 'terroso'], destaque: true,
      imagens: ['feed-limoes.webp', 'cat-sob-medida.webp'],
      descricao: 'Par de naturezas-mortas com limões e vasos de cerâmica. Combina com cozinhas, salas de jantar e gourmet.',
      tamanhos: ['2 peças 40 x 50 cm', '2 peças 50 x 70 cm', '2 peças 60 x 90 cm', 'Sob medida'], acabamentos: ACABAMENTOS_QUADRO,
    },
    {
      id: 'tempestade-galileia', codigo: 'CA-Q104', nome: 'Tempestade no Mar da Galileia', categoria: 'quadros', colecao: 'classicos',
      ambientes: ['sala', 'escritorio'], cores: ['dourado', 'azul'],
      imagens: ['feed-tempestade.webp'],
      descricao: 'Releitura da obra clássica de Rembrandt, apresentada com moldura dourada trabalhada.',
      tamanhos: ['50 x 60 cm', '70 x 90 cm', '90 x 110 cm', 'Sob medida'], acabamentos: ['Moldura dourada trabalhada', 'Moldura dourada lisa', 'Moldura madeira escura'],
    },
    {
      id: 'asas-relevo', codigo: 'CA-Q105', nome: 'Asas em Relevo', categoria: 'quadros', colecao: 'colecao-2026',
      ambientes: ['quarto', 'hall'], cores: ['branco', 'dourado'], destaque: true,
      imagens: ['feed-asas.webp'],
      descricao: 'Asas com efeito de textura e brilho dourado. Peça de impacto para cabeceiras e halls.',
      tamanhos: TAMANHOS_QUADRO, acabamentos: ACABAMENTOS_QUADRO,
    },
    {
      id: 'praia-tropical', codigo: 'CA-Q106', nome: 'Praia Tropical', categoria: 'quadros', colecao: 'mar-natureza',
      ambientes: ['sala', 'quarto'], cores: ['azul', 'verde'],
      imagens: ['feed-praia.webp'],
      descricao: 'Coqueiros, areia clara e mar azul-turquesa. O litoral baiano na sua parede.',
      tamanhos: TAMANHOS_QUADRO, acabamentos: ACABAMENTOS_QUADRO,
    },
    {
      id: 'painel-por-do-sol', codigo: 'CA-Q107', nome: 'Painel Pôr do Sol (5 peças)', categoria: 'quadros', colecao: 'mar-natureza',
      ambientes: ['sala'], cores: ['laranja', 'azul'],
      imagens: ['var-painel-mar.webp'],
      descricao: 'Painel segmentado em cinco telas com pôr do sol sobre o mar. Ideal para paredes largas.',
      tamanhos: ['Conjunto 120 x 60 cm', 'Conjunto 150 x 80 cm', 'Conjunto 200 x 100 cm', 'Sob medida'], acabamentos: ['Canvas sem moldura', 'Canvas com borda preta'],
    },
    {
      id: 'passaros-galho', codigo: 'CA-Q108', nome: 'Pássaros no Galho', categoria: 'quadros', colecao: 'botanicos',
      ambientes: ['quarto', 'cozinha'], cores: ['verde', 'branco'],
      imagens: ['feed-passaros.webp'],
      descricao: 'Pássaros entre folhas e frutos vermelhos, com traço delicado e fundo claro.',
      tamanhos: TAMANHOS_QUADRO, acabamentos: ACABAMENTOS_QUADRO,
    },
    {
      id: 'trio-botanico', codigo: 'CA-Q109', nome: 'Trio Botânico Preto e Ocre', categoria: 'quadros', colecao: 'botanicos',
      ambientes: ['sala', 'hall'], cores: ['preto', 'terroso'],
      imagens: ['var-botanicos.webp'],
      descricao: 'Conjunto de três folhagens em preto, branco e ocre, com passe-partout e moldura fina.',
      tamanhos: ['3 peças 30 x 40 cm', '3 peças 40 x 60 cm', '3 peças 50 x 70 cm', 'Sob medida'], acabamentos: ['Moldura preta', 'Moldura madeira natural'],
    },
    {
      id: 'trio-leao-abstrato-palmeira', codigo: 'CA-Q110', nome: 'Composição Leão, Abstrato e Palmeira', categoria: 'quadros', colecao: 'colecao-2026',
      ambientes: ['sala', 'escritorio'], cores: ['preto', 'terroso', 'azul'],
      imagens: ['var-trio.webp'],
      descricao: 'Três quadros que conversam entre si: retrato em preto e branco, abstrato em ocre e paisagem tropical.',
      tamanhos: ['3 peças 40 x 60 cm', '3 peças 60 x 90 cm', 'Sob medida'], acabamentos: ['Moldura preta', 'Moldura madeira natural'],
    },
    {
      id: 'formas-organicas', codigo: 'CA-Q111', nome: 'Formas Orgânicas (dupla)', categoria: 'quadros', colecao: 'colecao-2026',
      ambientes: ['quarto'], cores: ['terroso', 'branco'],
      imagens: ['amb-quarto.webp'],
      descricao: 'Dupla de formas orgânicas em tons neutros, pensada para cabeceiras e ambientes calmos.',
      tamanhos: ['2 peças 40 x 50 cm', '2 peças 50 x 70 cm', 'Sob medida'], acabamentos: ['Moldura madeira natural', 'Moldura preta'],
    },
    {
      id: 'rosto-de-cristo', codigo: 'CA-R201', nome: 'Rosto de Cristo', categoria: 'religiosa', colecao: 'religiosa',
      ambientes: ['sala', 'quarto'], cores: ['terroso', 'dourado'], destaque: true,
      imagens: ['var-religiosa.webp'],
      descricao: 'Retrato em tons sépia com coroa de espinhos. Acabamento clássico para salas e oratórios.',
      tamanhos: ['40 x 60 cm', '60 x 90 cm', '80 x 120 cm', 'Sob medida'], acabamentos: ['Moldura dourada', 'Moldura madeira escura'],
    },
    {
      id: 'espelho-organico', codigo: 'CA-E301', nome: 'Espelho Orgânico Dourado', categoria: 'espelhos', colecao: 'espelhos',
      ambientes: ['sala', 'hall', 'quarto'], cores: ['dourado'], destaque: true,
      imagens: ['cat-espelhos.webp'],
      descricao: 'Formato orgânico com moldura fina dourada. Amplia o ambiente e funciona como peça de arte.',
      tamanhos: TAMANHOS_ESPELHO, acabamentos: ACABAMENTOS_ESPELHO,
    },
    {
      id: 'espelho-redondo', codigo: 'CA-E302', nome: 'Espelho Redondo Bordas Finas', categoria: 'espelhos', colecao: 'espelhos',
      ambientes: ['hall', 'quarto'], cores: ['dourado'],
      imagens: ['var-espelho-redondo.webp'],
      descricao: 'Redondo com moldura metálica delgada. Clássico para lavabos, halls e penteadeiras.',
      tamanhos: ['Ø 50 cm', 'Ø 70 cm', 'Ø 90 cm', 'Sob medida'], acabamentos: ACABAMENTOS_ESPELHO,
    },
    {
      id: 'espelho-arco', codigo: 'CA-E303', nome: 'Espelho Arco para Hall', categoria: 'espelhos', colecao: 'espelhos',
      ambientes: ['hall'], cores: ['dourado', 'madeira'],
      imagens: ['amb-hall.webp'],
      descricao: 'Espelho em arco para aparadores e halls de entrada, com moldura fina.',
      tamanhos: TAMANHOS_ESPELHO, acabamentos: ACABAMENTOS_ESPELHO,
    },
  ];
})();
