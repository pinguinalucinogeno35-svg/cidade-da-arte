/* Página de produto: galeria, configurador (tamanho, acabamento, quantidade) e CTAs. */
(function () {
  'use strict';
  var C = window.CDA;
  var id = new URLSearchParams(location.search).get('id');
  var p = C.produtoPorId(id);
  var raiz = C.$('[data-produto]');
  var naoEncontrado = C.$('[data-nao-encontrado]');

  if (!p) { raiz.hidden = true; naoEncontrado.hidden = false; return; }

  var categoria = window.CDA_CATEGORIAS[p.categoria];
  var colecao = window.CDA_COLECOES[p.colecao];
  document.title = p.nome + ' · ' + categoria + ' · Cidade da Arte';
  var meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute('content', p.descricao);

  // Migalhas e textos
  C.$('[data-migalha-categoria]').textContent = categoria;
  C.$('[data-migalha-categoria]').href = 'catalogo.html?categoria=' + p.categoria;
  C.$('[data-migalha-nome]').textContent = p.nome;
  C.$('[data-colecao]').textContent = colecao ? colecao.nome : categoria;
  C.$('[data-nome]').textContent = p.nome;
  C.$('[data-codigo]').textContent = 'Cód. ' + p.codigo;
  C.$('[data-descricao]').textContent = p.descricao;
  C.$('[data-formato]').textContent = C.formatoPecas(p);
  C.$('[data-ambientes]').textContent = p.ambientes.map(function (a) { return window.CDA_AMBIENTES[a]; }).join(', ');

  // Galeria
  var principal = C.$('[data-imagem-principal]');
  var miniaturas = C.$('[data-miniaturas]');
  function trocarImagem(indice) {
    principal.src = C.CAMINHO_IMG + p.imagens[indice];
    principal.alt = p.nome + ', imagem ' + (indice + 1) + ' de ' + p.imagens.length;
    C.$$('button', miniaturas).forEach(function (b, i) { b.setAttribute('aria-pressed', String(i === indice)); });
  }
  if (p.imagens.length > 1) {
    miniaturas.innerHTML = p.imagens.map(function (img, i) {
      return '<button type="button" aria-pressed="false" aria-label="Ver imagem ' + (i + 1) + '"><img src="' + C.CAMINHO_IMG + img + '" alt="" width="80" height="100"></button>';
    }).join('');
    miniaturas.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) trocarImagem(C.$$('button', miniaturas).indexOf(b));
    });
  } else {
    miniaturas.hidden = true;
  }
  trocarImagem(0);

  // Configurador
  function grupoOpcoes(container, nome, valores) {
    container.innerHTML = valores.map(function (v, i) {
      return '<label class="chip"><input type="radio" name="' + nome + '" value="' + C.escapar(v) + '"' + (i === 0 ? ' checked' : '') + '><span>' + C.escapar(v) + '</span></label>';
    }).join('');
  }
  var form = C.$('[data-configurador]');
  grupoOpcoes(C.$('[data-opcoes-tamanho]'), 'tamanho', p.tamanhos);
  grupoOpcoes(C.$('[data-opcoes-acabamento]'), 'acabamento', p.acabamentos);

  var qtdEl = C.$('[data-qtd-valor]');
  var qtd = 1;
  function definirQtd(n) {
    qtd = Math.max(1, Math.min(99, n));
    qtdEl.textContent = qtd;
    C.$('[data-qtd-menos]').disabled = qtd <= 1;
  }
  C.$('[data-qtd-menos]').addEventListener('click', function () { definirQtd(qtd - 1); });
  C.$('[data-qtd-mais]').addEventListener('click', function () { definirQtd(qtd + 1); });
  definirQtd(1);

  var dicaSobMedida = C.$('[data-dica-sob-medida]');
  form.addEventListener('change', function () {
    dicaSobMedida.hidden = form.tamanho.value !== 'Sob medida';
  });

  function itemAtual() {
    var obs = form.obs.value.trim();
    return {
      id: p.id, codigo: p.codigo, nome: p.nome, imagem: p.imagens[0], categoria: p.categoria,
      tamanho: form.tamanho.value, acabamento: form.acabamento.value, qtd: qtd, obs: obs,
    };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    C.adicionarAoCarrinho(itemAtual());
  });

  C.$('[data-pedir-agora]').addEventListener('click', function () {
    var item = itemAtual();
    C.abrirWhatsApp(C.mensagemProdutoUnico(item), 'produto', { item_id: p.codigo });
    C.rastrear('generate_lead', { origem: 'produto', item_id: p.codigo });
  });

  C.$('[data-ver-na-parede]').addEventListener('click', function () {
    var mensagem = 'Olá, Cidade da Arte! Gostaria de ver como a peça "' + p.nome + '" (' + p.codigo + ') fica na minha parede. ' +
      'Vou enviar uma foto do ambiente e a largura da parede.';
    C.abrirWhatsApp(mensagem, 'ver-na-parede', { item_id: p.codigo });
  });

  // Relacionados: mesma coleção primeiro, depois mesma categoria
  var relacionados = window.CDA_PRODUTOS.filter(function (o) { return o.id !== p.id && o.colecao === p.colecao; })
    .concat(window.CDA_PRODUTOS.filter(function (o) { return o.id !== p.id && o.colecao !== p.colecao && o.categoria === p.categoria; }))
    .slice(0, 4);
  C.$('[data-relacionados]').innerHTML = relacionados.map(C.cartaoProduto).join('');

  C.rastrear('view_item', { item_id: p.codigo, item_name: p.nome, item_category: p.categoria });
})();
