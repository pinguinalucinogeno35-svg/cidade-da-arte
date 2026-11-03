// Monta o site estático: injeta os parciais (header/footer/ícones) em cada página de src/pages,
// copia os assets para dist/ e gera o service worker do app (PWA) com a lista de arquivos do shell.
import { readFileSync, writeFileSync, mkdirSync, cpSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(raiz, 'src');
const dist = join(raiz, 'dist');

const parcial = (nome) => readFileSync(join(src, 'partials', `${nome}.html`), 'utf8');
const parciais = Object.fromEntries(
  readdirSync(join(src, 'partials')).filter((f) => f.endsWith('.html')).map((f) => [f.replace('.html', ''), parcial(f.replace('.html', ''))]),
);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(src, 'assets'), join(dist, 'assets'), { recursive: true });
for (const arquivo of ['robots.txt', '_headers', 'manifest.webmanifest']) cpSync(join(src, arquivo), join(dist, arquivo));

const paginas = readdirSync(join(src, 'pages')).filter((f) => f.endsWith('.html'));
for (const arquivo of paginas) {
  let html = readFileSync(join(src, 'pages', arquivo), 'utf8');
  // Repete para resolver parciais dentro de parciais (ex.: o carrinho dentro do footer).
  for (let passo = 0; passo < 3 && html.includes('<!--@'); passo++) {
    for (const [nome, conteudo] of Object.entries(parciais)) {
      html = html.replaceAll(`<!--@${nome}-->`, conteudo);
    }
  }
  writeFileSync(join(dist, arquivo), html);
  console.log(`dist/${arquivo}`);
}

// Shell do app: páginas, CSS, JS, marca e ícones. As fotos entram no cache sob demanda.
const listar = (dir) => readdirSync(dir).flatMap((f) => {
  const caminho = join(dir, f);
  return statSync(caminho).isDirectory() ? listar(caminho) : [caminho];
});
const shell = [
  ...paginas,
  'manifest.webmanifest',
  ...['assets/css', 'assets/js', 'assets/marca', 'assets/icones-app'].flatMap((d) => listar(join(dist, d)).map((f) => relative(dist, f))),
];
const hash = createHash('sha256');
for (const f of shell) hash.update(f).update(readFileSync(join(dist, f)));
const versao = hash.digest('hex').slice(0, 10);
writeFileSync(
  join(dist, 'sw.js'),
  readFileSync(join(src, 'sw.js'), 'utf8').replace('__VERSAO__', versao).replace('__ARQUIVOS__', JSON.stringify(shell, null, 2)),
);
console.log(`dist/sw.js (versão ${versao}, ${shell.length} arquivos no shell)`);
