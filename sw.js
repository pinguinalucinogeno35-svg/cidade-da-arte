/*
 * Service worker do app Cidade da Arte.
 * - Páginas: rede primeiro (catálogo sempre atualizado), cache como reserva e offline.html sem conexão.
 * - CSS, JS, ícones e fontes: cache primeiro, atualizado em segundo plano.
 * - Imagens: cache primeiro; o catálogo visto fica disponível offline.
 * VERSAO e ARQUIVOS são preenchidos pelo build (scripts/build.mjs).
 */
const VERSAO = '86a52602ff';
const ARQUIVOS = [
  "catalogo.html",
  "index.html",
  "offline.html",
  "parede.html",
  "produto.html",
  "sob-medida.html",
  "sobre.html",
  "manifest.webmanifest",
  "assets/css/styles.css",
  "assets/js/app.js",
  "assets/js/catalogo.js",
  "assets/js/config.js",
  "assets/js/home.js",
  "assets/js/parede.js",
  "assets/js/produto.js",
  "assets/js/produtos.js",
  "assets/js/sob-medida.js",
  "assets/marca/logo-cidade-da-arte-claro.png",
  "assets/marca/logo-cidade-da-arte.png",
  "assets/icones-app/apple-touch-icon.png",
  "assets/icones-app/favicon-48.png",
  "assets/icones-app/icone-192.png",
  "assets/icones-app/icone-512.png",
  "assets/icones-app/icone-maskable-512.png"
];
const CACHE_APP = `cda-app-${VERSAO}`;
const CACHE_IMAGENS = 'cda-imagens-v1';
const CACHE_FONTES = 'cda-fontes-v1';
const LIMITE_IMAGENS = 120;

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(CACHE_APP).then((cache) => cache.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n.startsWith('cda-app-') && n !== CACHE_APP).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

async function limitarCache(nome, maximo) {
  const cache = await caches.open(nome);
  const chaves = await cache.keys();
  for (let i = 0; i < chaves.length - maximo; i++) await cache.delete(chaves[i]);
}

async function redePrimeiro(req) {
  const cache = await caches.open(CACHE_APP);
  try {
    const resposta = await fetch(req);
    if (resposta.ok) cache.put(req, resposta.clone());
    return resposta;
  } catch {
    return (await cache.match(req, { ignoreSearch: true })) || (await cache.match('offline.html'));
  }
}

async function cachePrimeiro(req, nomeCache, limite) {
  const cache = await caches.open(nomeCache);
  const salvo = await cache.match(req, { ignoreSearch: nomeCache === CACHE_APP });
  const buscar = fetch(req).then((resposta) => {
    if (resposta.ok || resposta.type === 'opaque') {
      cache.put(req, resposta.clone());
      if (limite) limitarCache(nomeCache, limite);
    }
    return resposta;
  }).catch(() => salvo);
  return salvo || buscar;
}

self.addEventListener('fetch', (evento) => {
  const req = evento.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    evento.respondWith(cachePrimeiro(req, CACHE_FONTES));
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') evento.respondWith(redePrimeiro(req));
  else if (req.destination === 'image') evento.respondWith(cachePrimeiro(req, CACHE_IMAGENS, LIMITE_IMAGENS));
  else evento.respondWith(cachePrimeiro(req, CACHE_APP));
});
