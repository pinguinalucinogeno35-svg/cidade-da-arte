/* Catálogo: filtros por categoria, ambiente, coleção e cor, sincronizados com a URL. */
(function () {
  'use strict';
  var C = window.CDA;
  var form = C.$('[data-filtros]');
  var grade = C.$('[data-grade]');
  var contador = C.$('[data-contagem]');
  var vazio = C.$('[data-vazio]');
  var titulo = C.$('[data-titulo-catalogo]');
  var intro = C.$('[data-intro-catalogo]');
  var CAMPOS = ['categoria', 'ambiente', 'colecao', 'cor'];
  var NOMES_COR = { terroso: 'Terrosos', preto: 'Preto', branco: 'Branco', dourado: 'Dourado', azul: 'Azul', verde: 'Verde', amarelo: 'Amarelo', laranja: 'Laranja', madeira: 'Madeira', bege: 'Bege e areia', colorido: 'Colorido' };

  function opcoes(select, mapa) {
    Object.keys(mapa).forEach(function (valor) {
      var o = document.createElement('option');
      o.value = valor;
      o.textContent = typeof mapa[valor] === 'string' ? mapa[valor] : mapa[valor].nome;
      select.appendChild(o);
    });
  }

  var cores = {};
  window.CDA_PRODUTOS.forEach(function (p) { p.cores.forEach(function (c) { cores[c] = NOMES_COR[c] || c; }); });
  opcoes(form.categoria, window.CDA_CATEGORIAS);
  opcoes(form.ambiente, window.CDA_AMBIENTES);
  opcoes(form.colecao, window.CDA_COLECOES);
  opcoes(form.cor, cores);

  function lerUrl() {
    var params = new URLSearchParams(location.search);
    CAMPOS.forEach(function (campo) {
      var valor = params.get(campo) || '';
      if (form[campo].querySelector('option[value="' + CSS.escape(valor) + '"]')) form[campo].value = valor;
    });
  }

  function filtrosAtuais() {
    var f = {};
    CAMPOS.forEach(function (campo) { if (form[campo].value) f[campo] = form[campo].value; });
    return f;
  }

  function aplicar(registrarHistorico) {
    var f = filtrosAtuais();
    var lista = window.CDA_PRODUTOS.filter(function (p) {
      return (!f.categoria || p.categoria === f.categoria) &&
        (!f.ambiente || p.ambientes.indexOf(f.ambiente) > -1) &&
        (!f.colecao || p.colecao === f.colecao) &&
        (!f.cor || p.cores.indexOf(f.cor) > -1);
    });

    grade.innerHTML = lista.map(C.cartaoProduto).join('');
    vazio.hidden = lista.length > 0;
    var espelhosSemFotos = f.categoria === 'espelhos' && lista.length === 0;
    C.$('[data-vazio-titulo]').textContent = espelhosSemFotos ? 'Catálogo de espelhos em preparação' : 'Nenhuma peça com esses filtros';
    C.$('[data-vazio-texto]').textContent = espelhosSemFotos
      ? 'Os espelhos estão sendo fotografados. Fale com a equipe para ver os modelos disponíveis ou peça um espelho sob medida.'
      : 'Tente outra combinação ou peça uma peça sob medida.';
    contador.textContent = lista.length + (lista.length === 1 ? ' peça' : ' peças');

    var colecao = f.colecao && window.CDA_COLECOES[f.colecao];
    if (colecao) { titulo.textContent = colecao.nome; intro.textContent = colecao.descricao; }
    else if (f.categoria) {
      titulo.textContent = window.CDA_CATEGORIAS[f.categoria];
      intro.textContent = f.categoria === 'espelhos'
        ? 'Espelhos de design, a pronta entrega e sob medida.'
        : 'Escolha a peça, defina tamanho e acabamento e envie para orçamento.';
    }
    else if (f.ambiente) { titulo.textContent = 'Para ' + window.CDA_AMBIENTES[f.ambiente].toLowerCase(); intro.textContent = 'Peças que funcionam bem neste ambiente.'; }
    else { titulo.textContent = 'Coleções'; intro.textContent = 'Catálogo 2026/27. Pronta entrega ou sob medida, com valores confirmados no atendimento.'; }
    document.title = titulo.textContent + ' · Cidade da Arte';

    if (registrarHistorico) {
      var params = new URLSearchParams(f).toString();
      history.replaceState(null, '', params ? '?' + params : location.pathname);
      C.rastrear('filter_catalog', f);
    }
  }

  form.addEventListener('change', function () { aplicar(true); });
  form.addEventListener('reset', function () { setTimeout(function () { aplicar(true); }, 0); });
  C.$('[data-limpar-filtros]').addEventListener('click', function () { form.reset(); });

  lerUrl();
  aplicar(false);
})();
