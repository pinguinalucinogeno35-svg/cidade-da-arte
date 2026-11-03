/* Sob medida: briefing de peça personalizada, enviado direto ou adicionado ao carrinho. */
(function () {
  'use strict';
  var C = window.CDA;
  var form = C.$('[data-form-sob-medida]');

  function validar() {
    var ok = true;
    ['largura', 'altura'].forEach(function (campo) {
      var valor = Number(form[campo].value);
      var valido = valor >= 10 && valor <= 400;
      form[campo].setAttribute('aria-invalid', String(!valido));
      C.$('[data-erro-para="' + campo + '"]', form).hidden = valido;
      if (!valido && ok) { form[campo].focus(); ok = false; }
    });
    return ok;
  }

  function item() {
    var tipo = form.tipo.value;
    var obs = [form.ambiente.value && 'Ambiente: ' + form.ambiente.value, form.referencia.value.trim()].filter(Boolean).join(' · ');
    return {
      id: 'sob-medida', codigo: '', nome: 'Sob medida: ' + tipo, imagem: '', categoria: 'sob-medida',
      tamanho: form.largura.value + ' x ' + form.altura.value + ' cm', acabamento: form.acabamento.value,
      qtd: Math.max(1, Math.min(99, Number(form.quantidade.value) || 1)), obs: obs,
    };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validar()) return;
    var acao = e.submitter && e.submitter.getAttribute('data-acao');
    var i = item();
    if (acao === 'carrinho') {
      C.adicionarAoCarrinho(i);
      return;
    }
    var mensagem = [
      'Olá, Cidade da Arte! Quero uma peça sob medida:',
      '',
      '*' + i.nome + '*',
      'Medidas: ' + i.tamanho,
      'Acabamento: ' + i.acabamento,
      'Quantidade: ' + i.qtd,
      i.obs ? 'Detalhes: ' + i.obs : '',
      '',
      'Posso enviar fotos do ambiente e de referências. Pode me passar valor e prazo?',
    ].filter(function (l, idx, arr) { return l !== '' || (arr[idx - 1] !== '' && idx > 0); }).join('\n');
    C.abrirWhatsApp(mensagem, 'sob-medida');
    C.rastrear('generate_lead', { origem: 'sob-medida' });
  });
})();
