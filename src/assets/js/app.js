/*
 * Núcleo do site: carrinho de orçamento, mensagem de WhatsApp, menu, eventos de mensuração.
 * Sem dependências. Exposto em window.CDA para os scripts de cada página.
 */
(function () {
  'use strict';

  var CONFIG = window.CDA_CONFIG;
  var CHAVE_CARRINHO = 'cda:carrinho:v2';
  var CAMINHO_IMG = 'assets/img/';

  /* ---------- Utilidades ---------- */

  function $(seletor, raiz) { return (raiz || document).querySelector(seletor); }
  function $$(seletor, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(seletor)); }

  function escapar(texto) {
    return String(texto == null ? '' : texto)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function icone(nome, classe) {
    return '<svg class="icone ' + (classe || '') + '" aria-hidden="true"><use href="#i-' + nome + '"/></svg>';
  }

  function produtoPorId(id) {
    return (window.CDA_PRODUTOS || []).filter(function (p) { return p.id === id; })[0];
  }

  function codigoPedido() {
    var letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var codigo = '';
    for (var i = 0; i < 4; i++) codigo += letras.charAt(Math.floor(Math.random() * letras.length));
    return 'CA-' + codigo;
  }

  /* ---------- Mensuração ----------
   * Eventos vão para window.dataLayer (GTM/GA4). Nenhum script de analytics é carregado aqui:
   * isso fica para depois da definição de consentimento (LGPD).
   */
  function rastrear(evento, parametros) {
    window.dataLayer = window.dataLayer || [];
    var dados = { event: evento };
    for (var k in parametros) if (Object.prototype.hasOwnProperty.call(parametros, k)) dados[k] = parametros[k];
    window.dataLayer.push(dados);
  }

  /* ---------- Armazenamento (com fallback em memória) ---------- */

  var memoria = null;
  function lerCarrinho() {
    try {
      var bruto = window.localStorage.getItem(CHAVE_CARRINHO);
      var itens = bruto ? JSON.parse(bruto) : [];
      return Array.isArray(itens) ? itens : [];
    } catch (e) {
      return memoria || [];
    }
  }
  function salvarCarrinho(itens) {
    memoria = itens;
    try { window.localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens)); } catch (e) { /* modo privado */ }
    atualizarContador();
    renderizarCarrinho();
  }

  /* ---------- Carrinho ---------- */

  // Item: { chave, id, codigo, nome, imagem, categoria, tamanho, acabamento, qtd, obs }
  function adicionarAoCarrinho(item) {
    var itens = lerCarrinho();
    var chave = [item.id, item.tamanho, item.acabamento, item.obs || ''].join('|');
    var existente = itens.filter(function (i) { return i.chave === chave; })[0];
    if (existente) {
      existente.qtd = Math.min(99, existente.qtd + (item.qtd || 1));
    } else {
      item.chave = chave;
      item.qtd = item.qtd || 1;
      itens.push(item);
    }
    salvarCarrinho(itens);
    rastrear('add_to_cart', { item_id: item.codigo, item_name: item.nome, item_category: item.categoria, variant: item.tamanho + ' / ' + item.acabamento, quantity: item.qtd });
    toast('"' + item.nome + '" foi adicionado ao carrinho.', { rotulo: 'Ver carrinho', acao: abrirCarrinho });
  }

  function alterarQuantidade(chave, delta) {
    var itens = lerCarrinho();
    itens.forEach(function (i) { if (i.chave === chave) i.qtd = Math.max(1, Math.min(99, i.qtd + delta)); });
    salvarCarrinho(itens);
  }

  function removerDoCarrinho(chave) {
    var itens = lerCarrinho();
    var removido = itens.filter(function (i) { return i.chave === chave; })[0];
    salvarCarrinho(itens.filter(function (i) { return i.chave !== chave; }));
    if (removido) rastrear('remove_from_cart', { item_id: removido.codigo, item_name: removido.nome });
  }

  function totalItens() {
    return lerCarrinho().reduce(function (soma, i) { return soma + i.qtd; }, 0);
  }

  function atualizarContador() {
    var total = totalItens();
    $$('[data-contador-carrinho]').forEach(function (el) {
      el.textContent = total;
      el.classList.toggle('is-visivel', total > 0);
    });
  }

  /* ---------- WhatsApp ---------- */

  function linkWhatsApp(mensagem) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(mensagem);
  }

  function abrirWhatsApp(mensagem, origem, extras) {
    var url = linkWhatsApp(mensagem);
    var params = { origem: origem };
    for (var k in extras) if (Object.prototype.hasOwnProperty.call(extras, k)) params[k] = extras[k];
    rastrear('whatsapp_click', params);
    window.open(url, '_blank', 'noopener');
    return url;
  }

  function descreverItem(item, indice) {
    var linhas = [
      indice + '. *' + item.nome + '*' + (item.codigo ? ' (' + item.codigo + ')' : ''),
      '   Tamanho: ' + item.tamanho,
      '   Acabamento: ' + item.acabamento,
      '   Quantidade: ' + item.qtd,
    ];
    if (item.obs) linhas.push('   Obs.: ' + item.obs);
    return linhas.join('\n');
  }

  function mensagemPedido(itens, dados, codigo) {
    var partes = [
      'Olá, Cidade da Arte! Vim pelo site e gostaria de um orçamento.',
      '',
      '*Pedido ' + codigo + '*',
      '',
      itens.map(function (item, i) { return descreverItem(item, i + 1); }).join('\n\n'),
      '',
      '*Meus dados*',
      'Nome: ' + dados.nome,
    ];
    if (dados.cidade) partes.push('Cidade/bairro: ' + dados.cidade);
    partes.push('Recebimento: ' + dados.recebimento);
    if (dados.observacoes) partes.push('Observações: ' + dados.observacoes);
    partes.push('', 'Pode me informar valores, disponibilidade e prazo? Obrigado!');
    return partes.join('\n');
  }

  function mensagemProdutoUnico(item) {
    return [
      'Olá, Cidade da Arte! Tenho interesse nesta peça que vi no site:',
      '',
      descreverItem(item, 1),
      '',
      'Pode me informar valor, disponibilidade e prazo?',
    ].join('\n');
  }

  function mensagemGeral(origem) {
    if (origem === 'profissionais') {
      return 'Olá, Cidade da Arte! Sou arquiteto(a)/decorador(a) e gostaria de conhecer as condições para profissionais.\n\nEscritório: \nCidade: \nProjeto: ';
    }
    return 'Olá, Cidade da Arte! Vim pelo site e gostaria de ajuda para escolher uma peça.';
  }

  /* ---------- Gaveta do carrinho ---------- */

  var gaveta, fundo, ultimoFoco, codigoAtual, urlAtual;

  function mostrarEtapa(nome) {
    $$('[data-etapa]', gaveta).forEach(function (el) { el.hidden = el.getAttribute('data-etapa') !== nome; });
  }

  function renderizarCarrinho() {
    if (!gaveta) return;
    var itens = lerCarrinho();
    var lista = $('[data-lista-carrinho]', gaveta);
    var vazio = itens.length === 0;
    $('[data-carrinho-vazio]', gaveta).hidden = !vazio;
    $('[data-carrinho-acoes]', gaveta).hidden = vazio;
    var total = totalItens();
    $('[data-carrinho-sub]', gaveta).textContent = vazio
      ? 'Monte seu pedido e envie para orçamento'
      : total + (total === 1 ? ' peça' : ' peças') + ' no pedido';

    lista.innerHTML = itens.map(function (item) {
      var chave = escapar(item.chave);
      var imagem = item.imagem
        ? '<img src="' + CAMINHO_IMG + escapar(item.imagem) + '" alt="" width="72" height="90" loading="lazy">'
        : '<span class="item__sem-imagem">' + icone('regua') + '</span>';
      return '<li class="item">' +
        '<div class="item__imagem">' + imagem + '</div>' +
        '<div class="item__info">' +
          '<p class="item__nome">' + escapar(item.nome) + '</p>' +
          '<p class="item__detalhe">' + escapar(item.tamanho) + ' · ' + escapar(item.acabamento) + '</p>' +
          (item.obs ? '<p class="item__detalhe">Obs.: ' + escapar(item.obs) + '</p>' : '') +
          '<div class="item__acoes">' +
            '<div class="quantidade" role="group" aria-label="Quantidade de ' + escapar(item.nome) + '">' +
              '<button type="button" data-qtd="-1" data-chave="' + chave + '" aria-label="Diminuir quantidade"' + (item.qtd <= 1 ? ' disabled' : '') + '>' + icone('menos') + '</button>' +
              '<span aria-live="polite">' + item.qtd + '</span>' +
              '<button type="button" data-qtd="1" data-chave="' + chave + '" aria-label="Aumentar quantidade">' + icone('mais') + '</button>' +
            '</div>' +
            '<button type="button" class="botao-icone botao-icone--pequeno" data-remover="' + chave + '">' + icone('remover') +
              '<span class="visualmente-oculto">Remover ' + escapar(item.nome) + '</span></button>' +
          '</div>' +
        '</div>' +
      '</li>';
    }).join('');
  }

  function abrirCarrinho() {
    if (!gaveta) return;
    ultimoFoco = document.activeElement;
    renderizarCarrinho();
    mostrarEtapa('itens');
    gaveta.hidden = false;
    fundo.hidden = false;
    document.documentElement.classList.add('sem-rolagem');
    requestAnimationFrame(function () { gaveta.classList.add('is-aberto'); fundo.classList.add('is-aberto'); });
    $$('[data-abrir-carrinho]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    $('[data-fechar-carrinho].botao-icone', gaveta).focus();
    rastrear('view_cart', { itens: totalItens() });
  }

  function fecharCarrinho() {
    if (!gaveta || gaveta.hidden) return;
    gaveta.classList.remove('is-aberto');
    fundo.classList.remove('is-aberto');
    document.documentElement.classList.remove('sem-rolagem');
    $$('[data-abrir-carrinho]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    setTimeout(function () { gaveta.hidden = true; fundo.hidden = true; }, 250);
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  function prenderFoco(evento) {
    if (evento.key !== 'Tab' || gaveta.hidden) return;
    var focaveis = $$('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])', gaveta)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!focaveis.length) return;
    var primeiro = focaveis[0], ultimo = focaveis[focaveis.length - 1];
    if (evento.shiftKey && document.activeElement === primeiro) { evento.preventDefault(); ultimo.focus(); }
    else if (!evento.shiftKey && document.activeElement === ultimo) { evento.preventDefault(); primeiro.focus(); }
  }

  function iniciarGaveta() {
    gaveta = $('[data-carrinho]');
    fundo = $('.carrinho-fundo');
    if (!gaveta) return;

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-abrir-carrinho]')) { e.preventDefault(); abrirCarrinho(); }
      else if (e.target.closest('[data-fechar-carrinho]')) fecharCarrinho();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fecharCarrinho();
      prenderFoco(e);
    });

    gaveta.addEventListener('click', function (e) {
      var qtd = e.target.closest('[data-qtd]');
      var remover = e.target.closest('[data-remover]');
      if (qtd) alterarQuantidade(qtd.getAttribute('data-chave'), Number(qtd.getAttribute('data-qtd')));
      if (remover) removerDoCarrinho(remover.getAttribute('data-remover'));
      if (e.target.closest('[data-ir-dados]')) {
        var total = totalItens();
        $('[data-resumo-pedido]', gaveta).textContent = total + (total === 1 ? ' peça' : ' peças') + ' no pedido. Falta só seu nome para enviarmos.';
        mostrarEtapa('dados');
        $('#pedido-nome').focus();
        rastrear('begin_checkout', { itens: total });
      }
      if (e.target.closest('[data-voltar-itens]')) mostrarEtapa('itens');
      if (e.target.closest('[data-limpar-carrinho]')) {
        salvarCarrinho([]);
        $('[data-form-pedido]', gaveta).reset();
        fecharCarrinho();
      }
    });

    $('[data-form-pedido]', gaveta).addEventListener('submit', function (e) {
      e.preventDefault();
      var form = e.currentTarget;
      var nome = form.nome.value.trim();
      var erro = $('[data-erro-para="nome"]', form);
      erro.hidden = !!nome;
      form.nome.setAttribute('aria-invalid', nome ? 'false' : 'true');
      if (!nome) { form.nome.focus(); return; }

      codigoAtual = codigoPedido();
      var itens = lerCarrinho();
      var mensagem = mensagemPedido(itens, {
        nome: nome,
        cidade: form.cidade.value.trim(),
        recebimento: form.recebimento.value,
        observacoes: form.observacoes.value.trim(),
      }, codigoAtual);
      urlAtual = abrirWhatsApp(mensagem, 'carrinho', { pedido: codigoAtual, itens: totalItens() });
      rastrear('generate_lead', { pedido: codigoAtual, itens: totalItens(), origem: 'carrinho' });

      $('[data-codigo-pedido]', gaveta).textContent = codigoAtual;
      $('[data-reabrir-whatsapp]', gaveta).href = urlAtual;
      mostrarEtapa('enviado');
      $('[data-etapa="enviado"]', gaveta).focus();
    });

    renderizarCarrinho();
  }

  /* ---------- Toast ---------- */

  var temporizadorToast;
  function toast(texto, opcoes) {
    var el = $('[data-toast]');
    if (!el) return;
    clearTimeout(temporizadorToast);
    el.innerHTML = '<span>' + escapar(texto) + '</span>';
    if (opcoes && opcoes.rotulo) {
      var botao = document.createElement('button');
      botao.type = 'button';
      botao.textContent = opcoes.rotulo;
      botao.addEventListener('click', function () { el.hidden = true; opcoes.acao(); });
      el.appendChild(botao);
    }
    el.hidden = false;
    temporizadorToast = setTimeout(function () { el.hidden = true; }, 5000);
  }

  /* ---------- Cabeçalho, menu e navegação ativa ---------- */

  function iniciarCabecalho() {
    var botaoMenu = $('[data-menu]');
    var nav = $('[data-nav]');
    if (botaoMenu && nav) {
      botaoMenu.addEventListener('click', function () {
        var aberto = nav.classList.toggle('is-aberto');
        botaoMenu.setAttribute('aria-expanded', String(aberto));
        document.documentElement.classList.toggle('sem-rolagem', aberto);
      });
      nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          nav.classList.remove('is-aberto');
          botaoMenu.setAttribute('aria-expanded', 'false');
          document.documentElement.classList.remove('sem-rolagem');
        }
      });
    }

    var pagina = document.body.getAttribute('data-pagina');
    var categoria = new URLSearchParams(location.search).get('categoria');
    var ativo = pagina === 'catalogo' ? (categoria === 'quadros' || categoria === 'espelhos' ? categoria : 'catalogo') : pagina;
    $$('[data-nav-item]').forEach(function (a) {
      if (a.getAttribute('data-nav-item') === ativo) a.setAttribute('aria-current', 'page');
    });

    var topo = $('[data-topo]');
    if (topo) {
      var aoRolar = function () { topo.classList.toggle('is-rolado', window.scrollY > 8); };
      window.addEventListener('scroll', aoRolar, { passive: true });
      aoRolar();
    }

    var aviso = $('[data-homologacao]');
    if (aviso && CONFIG.homologacao) aviso.hidden = false;

    $$('[data-ano]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
    $$('[data-telefone-texto]').forEach(function (el) {
      el.textContent = 'WhatsApp ' + CONFIG.whatsappExibicao + (CONFIG.whatsappProvisorio ? ' (provisório)' : '');
    });
  }

  /* ---------- Links de WhatsApp genéricos ---------- */

  function iniciarWhatsAppGeral() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-whatsapp]');
      if (!el) return;
      e.preventDefault();
      var origem = el.getAttribute('data-whatsapp');
      var mensagem = el.getAttribute('data-mensagem') || mensagemGeral(origem);
      abrirWhatsApp(mensagem, origem);
    });
  }

  /* ---------- Cartões de produto (usados em várias páginas) ---------- */

  function formatoPecas(p) {
    if (p.pecas === 2) return 'Díptico · 2 peças';
    if (p.pecas === 3) return 'Trio · 3 peças';
    return 'Peça única';
  }

  function cartaoProduto(p) {
    var categoria = (window.CDA_CATEGORIAS || {})[p.categoria] || '';
    var colecao = ((window.CDA_COLECOES || {})[p.colecao] || {}).nome || '';
    return '<li class="cartao-produto">' +
      '<a href="produto.html?id=' + encodeURIComponent(p.id) + '" class="cartao-produto__link">' +
        '<div class="cartao-produto__imagem">' +
          '<img src="' + CAMINHO_IMG + escapar(p.imagens[0]) + '" alt="' + escapar(p.nome) + ', ' + escapar(categoria.toLowerCase()) + '" loading="lazy" width="400" height="500">' +
        '</div>' +
        '<div class="cartao-produto__info">' +
          '<p class="sobretitulo">' + escapar(colecao || categoria) + '</p>' +
          '<h3 class="cartao-produto__nome">' + escapar(p.nome) + '</h3>' +
          '<p class="cartao-produto__meta">' + escapar(p.codigo) + ' · ' + formatoPecas(p) + '</p>' +
          '<span class="link-seta">Ver detalhes ' + icone('seta') + '</span>' +
        '</div>' +
      '</a>' +
    '</li>';
  }

  /* ---------- Inicialização ---------- */

  window.CDA = {
    $: $, $$: $$, escapar: escapar, icone: icone, rastrear: rastrear, toast: toast,
    produtoPorId: produtoPorId, cartaoProduto: cartaoProduto, formatoPecas: formatoPecas,
    adicionarAoCarrinho: adicionarAoCarrinho, abrirCarrinho: abrirCarrinho,
    abrirWhatsApp: abrirWhatsApp, mensagemProdutoUnico: mensagemProdutoUnico,
    CAMINHO_IMG: CAMINHO_IMG,
  };

  function iniciar() {
    iniciarCabecalho();
    iniciarGaveta();
    iniciarWhatsAppGeral();
    atualizarContador();
    // Mantém o contador em sincronia entre abas.
    window.addEventListener('storage', function (e) { if (e.key === CHAVE_CARRINHO) { atualizarContador(); renderizarCarrinho(); } });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
