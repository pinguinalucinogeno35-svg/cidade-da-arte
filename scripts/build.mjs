// Monta o site estático: injeta os parciais (header/footer/ícones) em cada página de src/pages
// e copia os assets para dist/.
import { readFileSync, writeFileSync, mkdirSync, cpSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
cpSync(join(src, 'robots.txt'), join(dist, 'robots.txt'));
cpSync(join(src, '_headers'), join(dist, '_headers'));

for (const arquivo of readdirSync(join(src, 'pages')).filter((f) => f.endsWith('.html'))) {
  let html = readFileSync(join(src, 'pages', arquivo), 'utf8');
  for (const [nome, conteudo] of Object.entries(parciais)) {
    html = html.replaceAll(`<!--@${nome}-->`, conteudo);
  }
  writeFileSync(join(dist, arquivo), html);
  console.log(`dist/${arquivo}`);
}
