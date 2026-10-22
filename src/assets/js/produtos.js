/*
 * Catálogo Cidade da Arte 2026/27 (arquivo "Produtos_Catalogo_26-27" enviado pela cliente).
 * O código NOV é a referência oficial e vai na mensagem do WhatsApp.
 * Os NOMES são descritivos e foram sugeridos pela ONE: o catálogo original não traz nomes.
 * Tamanhos e molduras não constam no catálogo: o cliente escolhe "padrão do catálogo" ou
 * "sob medida", e a loja confirma medidas, moldura e valor no atendimento.
 */
(function () {
  var TAMANHOS = ['Tamanho do catálogo', 'Sob medida'];
  var ACABAMENTOS = ['Moldura como na foto', 'Outra moldura (combinar)'];

  window.CDA_CATEGORIAS = {
    quadros: 'Quadros',
    espelhos: 'Espelhos',
  };

  window.CDA_AMBIENTES = {
    sala: 'Sala',
    quarto: 'Quarto',
    hall: 'Hall de entrada',
    cozinha: 'Cozinha e jantar',
    escritorio: 'Escritório',
  };

  window.CDA_COLECOES = {
    dourados: { nome: 'Dourado e relevo', descricao: 'Folhas, ramos e árvores em dourado que iluminam a parede.' },
    mediterraneo: { nome: 'Mediterrâneo', descricao: 'Vielas, janelas azuis e vilas ensolaradas à beira-mar.' },
    'mar-paisagens': { nome: 'Mar e paisagens', descricao: 'Praias, mar e montanhas para trazer horizonte ao ambiente.' },
    botanicos: { nome: 'Folhagens e botânicos', descricao: 'Folhagens, leques de palmeira e flores em composições atemporais.' },
    abstratos: { nome: 'Abstratos e texturas', descricao: 'Formas orgânicas, ondas e texturas em tons de terra e azul.' },
    'flores-secas': { nome: 'Flores secas e natureza-morta', descricao: 'Buquês secos, hortênsias e limões em tons quentes.' },
  };

  function q(codigo, img, nome, pecas, colecao, ambientes, cores, descricao, extra) {
    var p = {
      id: img.replace(/\.webp$/, ''), codigo: codigo, nome: nome, pecas: pecas, categoria: 'quadros', colecao: colecao,
      ambientes: ambientes, cores: cores, imagens: [img], descricao: descricao,
      tamanhos: TAMANHOS, acabamentos: ACABAMENTOS,
    };
    for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) p[k] = extra[k];
    return p;
  }

  window.CDA_PRODUTOS = [
    q('NOV 18', 'nov-18.webp', 'Dente-de-leão em Close', 1, 'botanicos', ['escritorio', 'sala'], ['branco', 'verde'],
      'Dente-de-leão fotografado de baixo, em branco e verde suave. Peça quadrada e luminosa para escritórios e salas claras.'),
    q('NOV 19, 20', 'nov-19-20.webp', 'Trio Montanhas em Tons de Terra', 3, 'mar-paisagens', ['sala', 'quarto'], ['terroso', 'bege'],
      'Paisagem de montanhas em camadas de areia, caramelo e marrom, dividida em três telas. Pensada para a parede do sofá.',
      { destaque: true }),
    q('NOV 21', 'nov-21.webp', 'Díptico Ondas Grafite e Cobre', 2, 'abstratos', ['escritorio', 'sala'], ['preto', 'dourado'],
      'Dois abstratos com movimentos circulares em grafite, prata e cobre. Sóbrio e elegante para escritórios e home office.'),
    q('NOV 22', 'nov-22.webp', 'Folhagem Abstrata Verde-Água', 1, 'botanicos', ['cozinha', 'sala'], ['verde', 'terroso'],
      'Tela panorâmica com folhagens pintadas em verde-água, terracota e branco. Valoriza salas de jantar e aparadores.'),
    q('NOV 23, 24', 'nov-23-24.webp', 'Díptico Folhas e Formas', 2, 'abstratos', ['hall', 'sala'], ['azul', 'bege'],
      'Composição de folhagens e formas geométricas em azul-petróleo, areia e cinza. Moderno e equilibrado.'),
    q('NOV 25, 26', 'nov-25-26.webp', 'Díptico Leques de Palmeira Terracota', 2, 'botanicos', ['sala', 'quarto'], ['terroso', 'laranja'],
      'Leques de palmeira em terracota, rosé e areia. Traz calor e textura para salas e quartos.',
      { destaque: true }),
    q('NOV 27, 28', 'nov-27-28.webp', 'Díptico Leques Azul e Palha', 2, 'abstratos', ['cozinha', 'sala'], ['azul', 'bege'],
      'Leques trançados em azul-marinho e palha natural, com efeito de textura. Combina com mesas de jantar e ambientes rústicos.'),
    q('NOV 29', 'nov-29.webp', 'Árvore da Vida Dourada', 1, 'dourados', ['sala', 'hall'], ['dourado', 'bege'],
      'Árvore com copa de folhas douradas sobre fundo claro. Peça de impacto para a parede principal da sala ou do hall.',
      { destaque: true }),
    q('NOV 30', 'nov-30-p7.webp', 'Díptico Barcos Coloridos', 2, 'mar-paisagens', ['sala'], ['verde', 'colorido'],
      'Barcos coloridos vistos do alto sobre água verde-esmeralda. Alegre e vibrante.',
      { paginaCatalogo: 7 }),
    q('NOV 30, 31', 'nov-30-31-p6.webp', 'Díptico Ramos Dourados', 2, 'dourados', ['quarto', 'sala', 'hall'], ['dourado', 'branco'],
      'Ramos de folhas douradas e peroladas com efeito de textura. Delicado para cabeceiras e halls.',
      { paginaCatalogo: 6 }),
    q('NOV 31', 'nov-31-p7.webp', 'Trio Praias Tropicais', 3, 'mar-paisagens', ['sala'], ['azul', 'verde'],
      'Três telas de praias com coqueiros, pedras e mar azul-turquesa. O litoral para a parede da sala.',
      { paginaCatalogo: 7 }),
    q('NOV 32', 'nov-32.webp', 'Folhagem Tropical Pintada', 1, 'botanicos', ['cozinha', 'hall'], ['verde', 'bege'],
      'Folhagens tropicais pintadas em verde, azul e areia, em formato vertical. Ideal para cantos de jantar e paredes estreitas.'),
    q('NOV 33', 'nov-33.webp', 'Ondas de Folhas Outonais', 1, 'abstratos', ['sala', 'escritorio'], ['laranja', 'verde'],
      'Abstrato em ondas de folhas laranja, verde e creme. Cheio de movimento e cor.'),
    q('NOV 34', 'nov-34.webp', 'Espiral de Pétalas em Terra', 1, 'abstratos', ['sala', 'quarto'], ['terroso', 'branco'],
      'Pétalas em espiral nos tons de café, caramelo e marfim. Abstrato orgânico e acolhedor.'),
    q('NOV 35', 'nov-35.webp', 'Passarela para o Mar', 1, 'mar-paisagens', ['sala', 'quarto', 'hall'], ['bege', 'azul'],
      'Deck de madeira entre capins dourados levando ao mar. Sensação de férias o ano todo.'),
    q('NOV 36', 'nov-36.webp', 'Gaivotas à Beira-Mar', 1, 'mar-paisagens', ['quarto', 'sala'], ['azul', 'branco'],
      'Duas gaivotas sobre um guarda-corpo de madeira com o mar ao fundo. Leve, sereno e minimalista.'),
    q('NOV 37, 38', 'nov-37-38.webp', 'Díptico Folhas de Palha e Contas', 2, 'botanicos', ['sala', 'quarto'], ['terroso', 'preto'],
      'Folhas de palha natural com detalhes em preto e contas. Estilo boho com textura artesanal.'),
    q('NOV 39, 40', 'nov-39-40.webp', 'Díptico Folhas Douradas em Relevo', 2, 'dourados', ['sala', 'quarto'], ['dourado', 'bege'],
      'Ramos de folhas em dourado e champanhe com efeito de relevo. Sofisticado e neutro.',
      { destaque: true }),
    q('NOV 41', 'nov-41.webp', 'Trio Folhagens Verde e Ouro', 3, 'botanicos', ['sala'], ['verde', 'dourado'],
      'Três telas de folhagens em verde profundo e dourado. Para salas amplas com sofá grande.'),
    q('NOV 42', 'nov-42.webp', 'Díptico Limões Sicilianos', 2, 'flores-secas', ['cozinha', 'sala'], ['amarelo', 'verde', 'terroso'],
      'Par de naturezas-mortas com limões e vasos de cerâmica. Combina com cozinhas, salas de jantar e espaços gourmet.'),
    q('NOV 43', 'nov-43.webp', 'Díptico Vilas Mediterrâneas', 2, 'mediterraneo', ['cozinha', 'sala'], ['verde', 'terroso'],
      'Vielas floridas e banca de limões em uma vila ensolarada. Clima de viagem para a sala de jantar.'),
    q('NOV 44', 'nov-44.webp', 'Dente-de-leão Turquesa', 1, 'botanicos', ['sala', 'quarto'], ['azul', 'bege'],
      'Dente-de-leão em close sobre fundo turquesa, em formato panorâmico. Feito para a parede do sofá.'),
    q('NOV 45', 'nov-45.webp', 'Trio Praia Vista do Alto', 3, 'mar-paisagens', ['sala'], ['azul', 'verde'],
      'Praia de águas cristalinas vista do alto, em três telas verticais. Mata, areia e mar em sequência.'),
    q('NOV 46, 47', 'nov-46-47.webp', 'Díptico Vielas Gregas', 2, 'mediterraneo', ['hall', 'sala'], ['azul', 'branco'],
      'Escadarias e vielas brancas com flores e mar azul ao fundo. Luminoso e cheio de cor.',
      { destaque: true }),
    q('NOV 48, 49', 'nov-48-49.webp', 'Díptico Janelas Azuis', 2, 'mediterraneo', ['sala', 'quarto'], ['azul', 'branco'],
      'Fachadas brancas com janelas azuis e trepadeiras. Fresco e elegante para ambientes claros.'),
    q('NOV 50', 'nov-50.webp', 'Leques Azuis e Dourados', 1, 'botanicos', ['sala', 'escritorio'], ['azul', 'dourado'],
      'Leques de palmeira em azul e dourado com plumas de capim. Contraste marcante para paredes neutras.'),
    q('NOV 51', 'nov-51.webp', 'Flores Secas em Tons Terrosos', 1, 'flores-secas', ['sala', 'quarto'], ['terroso'],
      'Buquê de trigo, palha e hortênsias secas em tons de terra e vinho. Formato vertical.'),
    q('NOV 52', 'nov-52.webp', 'Vaso com Flores Secas', 1, 'flores-secas', ['hall', 'quarto'], ['terroso', 'branco'],
      'Vaso de cerâmica com hortênsias e capins secos sobre fundo claro. Delicado e minimalista.'),
    q('NOV 53', 'nov-53.webp', 'Buquê de Hortênsias Secas', 1, 'flores-secas', ['sala', 'quarto'], ['terroso'],
      'Hortênsias secas em vinho e creme com leques de palmeira. Formato vertical e acolhedor.'),
  ];
})();
