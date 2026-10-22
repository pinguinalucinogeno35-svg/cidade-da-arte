/* Página inicial: vitrine de destaques e coleções. */
(function () {
  'use strict';
  var C = window.CDA;
  var vitrine = C.$('[data-destaques]');
  if (vitrine) {
    vitrine.innerHTML = window.CDA_PRODUTOS.filter(function (p) { return p.destaque; }).slice(0, 4).map(C.cartaoProduto).join('');
  }

  var colecoes = C.$('[data-colecoes]');
  if (colecoes) {
    var capas = { dourados: 'nov-29.webp', mediterraneo: 'nov-46-47.webp', 'mar-paisagens': 'nov-35.webp', 'flores-secas': 'nov-52.webp' };
    colecoes.innerHTML = Object.keys(capas).map(function (id) {
      var col = window.CDA_COLECOES[id];
      return '<li><a class="cartao-colecao" href="catalogo.html?colecao=' + id + '">' +
        '<img src="' + C.CAMINHO_IMG + capas[id] + '" alt="" loading="lazy" width="320" height="400">' +
        '<span class="cartao-colecao__texto"><span class="cartao-colecao__nome">' + C.escapar(col.nome) + '</span>' +
        '<span class="cartao-colecao__desc">' + C.escapar(col.descricao) + '</span></span></a></li>';
    }).join('');
  }
})();
