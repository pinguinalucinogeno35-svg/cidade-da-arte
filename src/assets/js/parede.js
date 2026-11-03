/*
 * "Ver na minha parede": câmera (ou foto da parede) com a peça do catálogo sobreposta.
 * O cliente arrasta, ajusta tamanho e luz, informa a largura da parede para ver a medida
 * aproximada e tira uma foto da simulação. Também aceita a arte do próprio cliente com moldura.
 * Nada sai do aparelho: câmera e fotos são processadas só no navegador.
 */
(function () {
  'use strict';
  var C = window.CDA;
  var $ = C.$, $$ = C.$$;

  var raiz = $('[data-parede]');
  var palco = $('[data-palco]');
  var video = $('[data-video]');
  var fotoParede = $('[data-foto-parede]');
  var peca = $('[data-peca]');
  var pecaImg = $('[data-peca-img]');
  var painel = $('[data-painel]');
  var inicio = $('[data-inicio]');
  var erroCamera = $('[data-erro-camera]');
  var faixaTamanho = $('[data-tamanho]');
  var faixaLuz = $('[data-luz]');
  var campoLargura = $('[data-largura-parede]');
  var medida = $('[data-medida]');

  var estado = {
    produto: null,       // item do catálogo em simulação
    minhaArte: null,     // { url, moldura, passePartout } quando é a arte do cliente
    fonte: null,         // 'camera' | 'foto'
    stream: null,
    proporcao: 1,        // altura / largura da peça
    x: 0, y: 0, w: 0,    // centro e largura da peça em px do palco
    luz: 1,
    foto: null,          // { blob, url, arquivo } da última captura
  };

  /* ---------- Peça em simulação ---------- */

  function nomeAtual() {
    if (estado.minhaArte) return 'Minha arte · ' + estado.minhaArte.moldura.toLowerCase();
    return estado.produto ? estado.produto.nome : '';
  }

  function codigoAtual() {
    if (estado.minhaArte) return estado.minhaArte.passePartout ? 'Com passe-partout' : 'Sem passe-partout';
    return estado.produto ? estado.produto.codigo + ' · ' + C.formatoPecas(estado.produto) : '';
  }

  function aplicarPeca(src, alt) {
    return new Promise(function (resolver) {
      pecaImg.onload = function () {
        estado.proporcao = pecaImg.naturalHeight / pecaImg.naturalWidth;
        if (!peca.hidden) {
          var l = limites();
          estado.w = Math.min(estado.w, (l.h * 0.8) / estado.proporcao);
        }
        desenhar();
        resolver();
      };
      pecaImg.src = src;
      pecaImg.alt = alt;
      $('[data-peca-nome]').textContent = nomeAtual();
      $('[data-atual-nome]').textContent = nomeAtual();
      $('[data-atual-codigo]').textContent = codigoAtual();
      $('[data-miniatura]').src = src;
    });
  }

  function escolherProduto(p) {
    estado.produto = p;
    estado.minhaArte = null;
    $('[data-voltar]').href = 'produto.html?id=' + encodeURIComponent(p.id);
    var url = new URL(location.href);
    url.searchParams.set('id', p.id);
    history.replaceState(null, '', url);
    C.rastrear('wall_preview_select', { item_id: p.codigo });
    return aplicarPeca(C.CAMINHO_IMG + p.arte, p.nome + ', ' + C.formatoPecas(p).toLowerCase());
  }

  /* ---------- Posição, tamanho e luz ---------- */

  function limites() {
    return { w: palco.clientWidth, h: palco.clientHeight };
  }

  // Tamanho inicial: 55% da largura do palco, sem passar de metade da altura
  function posicaoInicial() {
    var l = limites();
    estado.w = Math.min(l.w * 0.55, (l.h * 0.5) / estado.proporcao);
    estado.x = l.w / 2;
    estado.y = l.h * 0.42;
  }

  function desenhar() {
    if (peca.hidden) return;
    var l = limites();
    estado.w = Math.max(l.w * 0.08, Math.min(estado.w, l.w * 1.6));
    var h = estado.w * estado.proporcao;
    estado.x = Math.max(0, Math.min(estado.x, l.w));
    estado.y = Math.max(0, Math.min(estado.y, l.h));
    peca.style.width = estado.w + 'px';
    peca.style.height = h + 'px';
    peca.style.transform = 'translate(' + (estado.x - estado.w / 2) + 'px,' + (estado.y - h / 2) + 'px)';
    pecaImg.style.filter = 'brightness(' + estado.luz + ')';
    faixaTamanho.value = Math.round(estado.w / l.w * 100);
    atualizarMedida();
  }

  function medidaAproximada() {
    var largura = parseFloat(String(campoLargura.value).replace(',', '.'));
    if (!(largura > 0)) return null;
    var cmL = Math.round(estado.w / limites().w * largura * 100 / 5) * 5;
    var cmA = Math.round(cmL * estado.proporcao / 5) * 5;
    return { largura: cmL, altura: cmA, parede: largura };
  }

  function textoMedida(m) {
    return 'aprox. ' + m.largura + ' x ' + m.altura + ' cm';
  }

  function atualizarMedida() {
    var m = medidaAproximada();
    medida.textContent = m
      ? 'Medida da peça na simulação: ' + textoMedida(m) + '.'
      : 'Informe a largura da parede para ver a medida aproximada.';
  }

  faixaTamanho.addEventListener('input', function () {
    estado.w = limites().w * Number(faixaTamanho.value) / 100;
    desenhar();
  });
  faixaLuz.addEventListener('input', function () {
    estado.luz = Number(faixaLuz.value) / 100;
    desenhar();
  });
  campoLargura.addEventListener('input', atualizarMedida);

  /* ---------- Gestos: arrastar e pinçar ---------- */

  var ponteiros = new Map();
  var gesto = null;

  function distancia(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  palco.addEventListener('pointerdown', function (e) {
    if (peca.hidden || e.target.closest('.parede__inicio')) return;
    palco.setPointerCapture(e.pointerId);
    ponteiros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    var pts = Array.from(ponteiros.values());
    if (pts.length === 1) {
      gesto = { tipo: 'arrastar', inicio: pts[0], x: estado.x, y: estado.y };
    } else if (pts.length === 2) {
      gesto = { tipo: 'pincar', d: distancia(pts[0], pts[1]), w: estado.w };
    }
    $('[data-dica]').hidden = true;
  });

  palco.addEventListener('pointermove', function (e) {
    if (!ponteiros.has(e.pointerId) || !gesto) return;
    ponteiros.set(e.pointerId, { x: e.clientX, y: e.clientY });
    var pts = Array.from(ponteiros.values());
    if (gesto.tipo === 'arrastar' && pts.length === 1) {
      estado.x = gesto.x + (pts[0].x - gesto.inicio.x);
      estado.y = gesto.y + (pts[0].y - gesto.inicio.y);
    } else if (gesto.tipo === 'pincar' && pts.length === 2) {
      estado.w = gesto.w * distancia(pts[0], pts[1]) / gesto.d;
    }
    desenhar();
  });

  function soltar(e) {
    ponteiros.delete(e.pointerId);
    var pts = Array.from(ponteiros.values());
    gesto = pts.length === 1 ? { tipo: 'arrastar', inicio: pts[0], x: estado.x, y: estado.y } : null;
  }
  palco.addEventListener('pointerup', soltar);
  palco.addEventListener('pointercancel', soltar);

  palco.addEventListener('wheel', function (e) {
    if (peca.hidden) return;
    e.preventDefault();
    estado.w *= e.deltaY < 0 ? 1.05 : 0.95;
    desenhar();
  }, { passive: false });

  // Teclado: setas movem, + e - ajustam o tamanho
  palco.tabIndex = 0;
  palco.setAttribute('aria-label', 'Simulação: use as setas para mover a peça e + ou - para o tamanho');
  palco.addEventListener('keydown', function (e) {
    if (peca.hidden) return;
    var passo = e.shiftKey ? 30 : 8;
    var acoes = {
      ArrowLeft: function () { estado.x -= passo; }, ArrowRight: function () { estado.x += passo; },
      ArrowUp: function () { estado.y -= passo; }, ArrowDown: function () { estado.y += passo; },
      '+': function () { estado.w *= 1.05; }, '=': function () { estado.w *= 1.05; }, '-': function () { estado.w *= 0.95; },
    };
    if (acoes[e.key]) { e.preventDefault(); acoes[e.key](); desenhar(); }
  });

  /* ---------- Fundo: câmera ou foto ---------- */

  function mostrarSimulacao() {
    inicio.hidden = true;
    painel.hidden = false;
    peca.hidden = false;
    raiz.classList.add('is-ativo');
    requestAnimationFrame(function () {
      posicaoInicial();
      desenhar();
    });
    var dica = $('[data-dica]');
    dica.textContent = window.matchMedia('(pointer: coarse)').matches
      ? 'Arraste para posicionar. Use dois dedos para ajustar o tamanho.'
      : 'Arraste para posicionar. Use a roda do mouse ou o controle Tamanho.';
    dica.hidden = false;
    setTimeout(function () { dica.hidden = true; }, 6000);
    $('[data-trocar-fundo-texto]').textContent = estado.fonte === 'camera' ? 'Usar foto' : 'Câmera';
  }

  function pararCamera() {
    if (estado.stream) estado.stream.getTracks().forEach(function (t) { t.stop(); });
    estado.stream = null;
  }

  function mensagemErroCamera(erro) {
    if (!window.isSecureContext) return 'A câmera só funciona em endereço seguro (https). Use uma foto da parede.';
    if (!erro) return 'Este navegador não permite usar a câmera. Use uma foto da parede.';
    if (erro.name === 'NotAllowedError' || erro.name === 'SecurityError') {
      return 'Sem permissão para a câmera. Libere o acesso nas configurações do navegador ou use uma foto da parede.';
    }
    if (erro.name === 'NotFoundError' || erro.name === 'OverconstrainedError') return 'Nenhuma câmera encontrada. Use uma foto da parede.';
    if (erro.name === 'NotReadableError') return 'A câmera está em uso por outro aplicativo. Feche-o e tente de novo.';
    return 'Não foi possível abrir a câmera. Use uma foto da parede.';
  }

  function abrirCamera() {
    erroCamera.hidden = true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      erroCamera.textContent = mensagemErroCamera(null);
      erroCamera.hidden = false;
      return Promise.resolve(false);
    }
    return navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
    }).then(function (stream) {
      pararCamera();
      estado.stream = stream;
      estado.fonte = 'camera';
      video.srcObject = stream;
      video.hidden = false;
      fotoParede.hidden = true;
      return video.play().catch(function () {}).then(function () {
        mostrarSimulacao();
        C.rastrear('wall_preview_start', { fonte: 'camera', item_id: estado.produto && estado.produto.codigo });
        return true;
      });
    }).catch(function (erro) {
      erroCamera.textContent = mensagemErroCamera(erro);
      erroCamera.hidden = false;
      inicio.hidden = false;
      painel.hidden = true;
      return false;
    });
  }

  function usarFoto(arquivo) {
    if (!arquivo || !/^image\//.test(arquivo.type)) return;
    pararCamera();
    if (fotoParede.dataset.url) URL.revokeObjectURL(fotoParede.dataset.url);
    var url = URL.createObjectURL(arquivo);
    fotoParede.dataset.url = url;
    fotoParede.onload = function () {
      estado.fonte = 'foto';
      video.hidden = true;
      fotoParede.hidden = false;
      mostrarSimulacao();
      C.rastrear('wall_preview_start', { fonte: 'foto', item_id: estado.produto && estado.produto.codigo });
    };
    fotoParede.src = url;
  }

  // Input de arquivo reutilizável para "Usar foto" a partir do painel
  var entradaFoto = document.createElement('input');
  entradaFoto.type = 'file';
  entradaFoto.accept = 'image/*';
  entradaFoto.addEventListener('change', function () { usarFoto(entradaFoto.files[0]); entradaFoto.value = ''; });

  $('[data-abrir-camera]').addEventListener('click', abrirCamera);
  $('[data-arquivo-parede]').addEventListener('change', function (e) { usarFoto(e.target.files[0]); e.target.value = ''; });
  $('[data-trocar-fundo]').addEventListener('click', function () {
    if (estado.fonte === 'camera') entradaFoto.click();
    else abrirCamera();
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pararCamera();
    else if (estado.fonte === 'camera' && !estado.stream) abrirCamera();
  });
  window.addEventListener('pagehide', pararCamera);
  window.addEventListener('resize', function () { if (!peca.hidden) desenhar(); });

  /* ---------- Folhas (seletor e resultado) ---------- */

  var fundoFolha = $('[data-fechar-folha].folha-fundo');
  var folhaAberta = null;

  function abrirFolha(folha) {
    fecharFolha();
    folhaAberta = folha;
    folha.hidden = false;
    fundoFolha.hidden = false;
    var foco = $('.folha__topo .botao-icone', folha);
    if (foco) foco.focus();
  }

  function fecharFolha() {
    if (!folhaAberta) return;
    folhaAberta.hidden = true;
    fundoFolha.hidden = true;
    folhaAberta = null;
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-fechar-folha]')) fecharFolha();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharFolha(); });

  // Seletor de peças do catálogo
  var grade = $('[data-seletor-grade]');
  grade.innerHTML = window.CDA_PRODUTOS.map(function (p) {
    return '<li><button type="button" class="seletor-item" data-escolher="' + C.escapar(p.id) + '">' +
      '<img src="' + C.CAMINHO_IMG + C.escapar(p.arte) + '" alt="" loading="lazy" width="160" height="120">' +
      '<span class="seletor-item__nome">' + C.escapar(p.nome) + '</span>' +
      '<span class="seletor-item__codigo">' + C.escapar(p.codigo) + '</span></button></li>';
  }).join('');
  grade.addEventListener('click', function (e) {
    var b = e.target.closest('[data-escolher]');
    if (!b) return;
    var p = C.produtoPorId(b.getAttribute('data-escolher'));
    escolherProduto(p).then(function () { if (!peca.hidden) desenhar(); });
    fecharFolha();
  });

  $('[data-abrir-seletor]').addEventListener('click', function () { abrirFolha($('[data-seletor]')); });

  $$('[data-aba]').forEach(function (aba) {
    aba.addEventListener('click', function () {
      var nome = aba.getAttribute('data-aba');
      $$('[data-aba]').forEach(function (a) { a.setAttribute('aria-selected', String(a === aba)); });
      $$('[data-painel-aba]').forEach(function (p) { p.hidden = p.getAttribute('data-painel-aba') !== nome; });
    });
  });

  /* ---------- Minha arte: moldura desenhada no canvas ---------- */

  var arteCliente = null; // HTMLImageElement
  var previa = $('[data-previa-arte]');

  var MOLDURAS = {
    'Sem moldura': null,
    'Moldura preta': ['#2a2826', '#141312', '#2a2826'],
    'Moldura branca': ['#fbfaf7', '#e6e2da', '#fbfaf7'],
    'Moldura madeira natural': ['#b98a5a', '#8a5f37', '#c49a6c'],
    'Moldura dourada': ['#a77d27', '#e8cf86', '#9a7220'],
  };

  function emoldurar(img, moldura, comPasse) {
    var max = 1400;
    var esc = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    var w = Math.round(img.naturalWidth * esc);
    var h = Math.round(img.naturalHeight * esc);
    var base = Math.max(w, h);
    var cores = MOLDURAS[moldura];
    var borda = cores ? Math.round(base * 0.045) : 0;
    var passe = comPasse ? Math.round(base * 0.08) : 0;
    var canvas = document.createElement('canvas');
    canvas.width = w + 2 * (borda + passe);
    canvas.height = h + 2 * (borda + passe);
    var ctx = canvas.getContext('2d');

    if (cores) {
      var g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      g.addColorStop(0, cores[0]); g.addColorStop(0.5, cores[1]); g.addColorStop(1, cores[2]);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (moldura === 'Moldura madeira natural') {
        // veios discretos da madeira
        ctx.globalAlpha = 0.12;
        for (var i = 0; i < 60; i++) {
          ctx.strokeStyle = i % 2 ? '#5a3c22' : '#e0b98c';
          ctx.lineWidth = 1 + (i % 3);
          var y = (i / 60) * canvas.height;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.bezierCurveTo(canvas.width * 0.3, y + 6, canvas.width * 0.7, y - 6, canvas.width, y + 3);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      // chanfro interno
      ctx.strokeStyle = 'rgba(0,0,0,.25)';
      ctx.lineWidth = Math.max(1, borda * 0.08);
      ctx.strokeRect(borda - ctx.lineWidth / 2, borda - ctx.lineWidth / 2, canvas.width - 2 * borda + ctx.lineWidth, canvas.height - 2 * borda + ctx.lineWidth);
    }
    if (passe) {
      ctx.fillStyle = '#f7f4ee';
      ctx.fillRect(borda, borda, canvas.width - 2 * borda, canvas.height - 2 * borda);
      ctx.strokeStyle = 'rgba(0,0,0,.12)';
      ctx.lineWidth = Math.max(1, base * 0.002);
      ctx.strokeRect(borda + passe, borda + passe, w, h);
    }
    ctx.drawImage(img, borda + passe, borda + passe, w, h);
    return canvas;
  }

  function opcoesMinhaArte() {
    var marcada = $('input[name="moldura"]:checked');
    return { moldura: marcada ? marcada.value : 'Moldura preta', passePartout: $('[data-passe-partout]').checked };
  }

  function atualizarPrevia() {
    if (!arteCliente) return;
    var o = opcoesMinhaArte();
    var canvas = emoldurar(arteCliente, o.moldura, o.passePartout);
    previa.width = canvas.width;
    previa.height = canvas.height;
    previa.getContext('2d').drawImage(canvas, 0, 0);
  }

  $('[data-arquivo-arte]').addEventListener('change', function (e) {
    var arquivo = e.target.files[0];
    e.target.value = '';
    if (!arquivo || !/^image\//.test(arquivo.type)) return;
    var img = new Image();
    img.onload = function () {
      arteCliente = img;
      $('[data-minha-arte]').hidden = false;
      atualizarPrevia();
    };
    img.src = URL.createObjectURL(arquivo);
  });
  $$('input[name="moldura"], [data-passe-partout]').forEach(function (el) { el.addEventListener('change', atualizarPrevia); });

  $('[data-usar-minha-arte]').addEventListener('click', function () {
    if (!arteCliente) return;
    var o = opcoesMinhaArte();
    emoldurar(arteCliente, o.moldura, o.passePartout).toBlob(function (blob) {
      if (estado.minhaArte && estado.minhaArte.url) URL.revokeObjectURL(estado.minhaArte.url);
      estado.minhaArte = { url: URL.createObjectURL(blob), moldura: o.moldura, passePartout: o.passePartout };
      estado.produto = null;
      $('[data-voltar]').href = 'sob-medida.html';
      aplicarPeca(estado.minhaArte.url, 'Sua arte com ' + o.moldura.toLowerCase());
      fecharFolha();
      C.rastrear('wall_preview_select', { item_id: 'minha-arte', moldura: o.moldura });
      if (peca.hidden) inicio.hidden = false;
    }, 'image/png');
  });

  /* ---------- Captura da foto da simulação ---------- */

  function capturar() {
    var fonte = estado.fonte === 'camera' ? video : fotoParede;
    var sw = estado.fonte === 'camera' ? video.videoWidth : fotoParede.naturalWidth;
    var sh = estado.fonte === 'camera' ? video.videoHeight : fotoParede.naturalHeight;
    if (!sw || !sh) return;
    var l = limites();
    // O fundo é exibido com object-fit: cover; recorta a mesma área visível
    var escala = Math.max(l.w / sw, l.h / sh);
    var visW = l.w / escala, visH = l.h / escala;
    var sx = (sw - visW) / 2, sy = (sh - visH) / 2;
    var saidaW = Math.min(1600, Math.round(visW));
    var k = saidaW / l.w;
    var canvas = document.createElement('canvas');
    canvas.width = saidaW;
    canvas.height = Math.round(l.h * k);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(fonte, sx, sy, visW, visH, 0, 0, canvas.width, canvas.height);

    var h = estado.w * estado.proporcao;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.35)';
    ctx.shadowBlur = 18 * k;
    ctx.shadowOffsetY = 8 * k;
    if ('filter' in ctx) ctx.filter = 'brightness(' + estado.luz + ')';
    ctx.drawImage(pecaImg, (estado.x - estado.w / 2) * k, (estado.y - h / 2) * k, estado.w * k, h * k);
    ctx.restore();

    // Assinatura discreta
    var tam = Math.max(12, Math.round(canvas.width * 0.022));
    var texto = 'cidade da arte · simulação' + (estado.produto ? ' · ' + estado.produto.codigo : '');
    ctx.font = '500 ' + tam + 'px Manrope, system-ui, sans-serif';
    var largura = ctx.measureText(texto).width;
    ctx.fillStyle = 'rgba(25,25,25,.55)';
    ctx.fillRect(tam * 0.8, canvas.height - tam * 2.6, largura + tam * 1.2, tam * 1.8);
    ctx.fillStyle = '#f5f2ec';
    ctx.fillText(texto, tam * 1.4, canvas.height - tam * 1.25);

    canvas.toBlob(function (blob) {
      if (estado.foto) URL.revokeObjectURL(estado.foto.url);
      var nome = 'cidade-da-arte-' + (estado.produto ? estado.produto.id : 'minha-arte') + '.jpg';
      estado.foto = { blob: blob, url: URL.createObjectURL(blob), arquivo: new File([blob], nome, { type: 'image/jpeg' }) };
      $('[data-foto-resultado]').src = estado.foto.url;
      var baixar = $('[data-baixar]');
      baixar.href = estado.foto.url;
      baixar.setAttribute('download', nome);
      var m = medidaAproximada();
      $('[data-resultado-medida]').textContent = (estado.produto ? estado.produto.nome + ' (' + estado.produto.codigo + ')' : nomeAtual()) +
        (m ? ' · ' + textoMedida(m) : '');
      $('[data-compartilhar]').hidden = !(navigator.canShare && navigator.canShare({ files: [estado.foto.arquivo] }));
      abrirFolha($('[data-resultado]'));
      C.rastrear('wall_preview_capture', { item_id: estado.produto ? estado.produto.codigo : 'minha-arte', fonte: estado.fonte });
    }, 'image/jpeg', 0.9);
  }

  $('[data-capturar]').addEventListener('click', capturar);

  $('[data-compartilhar]').addEventListener('click', function () {
    if (!estado.foto) return;
    navigator.share({
      files: [estado.foto.arquivo],
      title: 'Simulação Cidade da Arte',
      text: mensagemWhatsApp(),
    }).then(function () {
      C.rastrear('wall_preview_share', { item_id: estado.produto ? estado.produto.codigo : 'minha-arte' });
    }).catch(function () { /* compartilhamento cancelado */ });
  });

  /* ---------- Pedido: WhatsApp e carrinho ---------- */

  function mensagemWhatsApp() {
    var m = medidaAproximada();
    var linhas = [];
    if (estado.produto) {
      linhas.push('Olá, Cidade da Arte! Fiz uma simulação no app com a peça "' + estado.produto.nome + '" (' + estado.produto.codigo + ').');
    } else {
      linhas.push('Olá, Cidade da Arte! Quero emoldurar uma arte minha: ' + nomeAtual().replace('Minha arte · ', '') +
        (estado.minhaArte && estado.minhaArte.passePartout ? ', com passe-partout' : '') + '.');
    }
    if (m) linhas.push('Tamanho na simulação: ' + textoMedida(m) + ' (parede de ' + String(m.parede).replace('.', ',') + ' m).');
    linhas.push('Vou enviar a foto da simulação aqui. Pode me passar valor e prazo?');
    return linhas.join('\n');
  }

  $('[data-whats-resultado]').addEventListener('click', function () {
    C.abrirWhatsApp(mensagemWhatsApp(), 'parede', { item_id: estado.produto ? estado.produto.codigo : 'minha-arte' });
    C.rastrear('generate_lead', { origem: 'parede' });
  });

  function adicionar() {
    var m = medidaAproximada();
    if (estado.produto) {
      C.adicionarAoCarrinho({
        id: estado.produto.id, codigo: estado.produto.codigo, nome: estado.produto.nome,
        imagem: estado.produto.imagens[0], categoria: estado.produto.categoria,
        tamanho: m ? 'Sob medida (' + textoMedida(m) + ')' : 'Tamanho do catálogo',
        acabamento: 'Moldura como na foto', qtd: 1, obs: 'Simulado na parede pelo app',
      });
    } else if (estado.minhaArte) {
      C.adicionarAoCarrinho({
        id: 'minha-arte', codigo: '', nome: 'Emoldurar minha arte', imagem: '', categoria: 'sob-medida',
        tamanho: m ? textoMedida(m) : 'A definir', qtd: 1,
        acabamento: estado.minhaArte.moldura + (estado.minhaArte.passePartout ? ' com passe-partout' : ''),
        obs: 'Arte do cliente simulada no app; enviar foto da arte',
      });
    }
  }
  $$('[data-adicionar]').forEach(function (b) { b.addEventListener('click', function () { fecharFolha(); adicionar(); }); });

  /* ---------- Início ---------- */

  var params = new URLSearchParams(location.search);
  var inicial = C.produtoPorId(params.get('id')) ||
    window.CDA_PRODUTOS.filter(function (p) { return p.destaque; })[0] || window.CDA_PRODUTOS[0];
  escolherProduto(inicial);
  if (params.get('aba') === 'minha-arte') {
    abrirFolha($('[data-seletor]'));
    $('[data-aba="minha-arte"]').click();
  }
})();
