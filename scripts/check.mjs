// Verificações rápidas antes de publicar:
// 1) nenhum emoji ou glifo-símbolo fazendo papel de ícone (regra de identidade ONE);
// 2) todos os assets locais referenciados existem em dist/.
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const arquivos = (dir) => readdirSync(dir).flatMap((f) => {
  const caminho = join(dir, f);
  return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho];
});

const PROIBIDOS = /[←-⇿⌀-⏿■-➿⬀-⯿\u{1F000}-\u{1FAFF}]/u;
let falhas = 0;

for (const arquivo of arquivos(dist).filter((f) => ['.html', '.css', '.js'].includes(extname(f)))) {
  const linhas = readFileSync(arquivo, 'utf8').split('\n');
  linhas.forEach((linha, i) => {
    if (PROIBIDOS.test(linha)) { console.error(`Glifo/emoji proibido: ${arquivo}:${i + 1}`); falhas++; }
  });
  if (extname(arquivo) === '.html') {
    for (const [, ref] of linhas.join('\n').matchAll(/(?:src|href)="(assets\/[^"#?]+)"/g)) {
      if (!existsSync(join(dist, ref))) { console.error(`Asset ausente: ${ref} em ${arquivo}`); falhas++; }
    }
  }
}

// Imagens referenciadas pelo catálogo
const catalogo = readFileSync(join(dist, 'assets/js/produtos.js'), 'utf8');
for (const [, img] of catalogo.matchAll(/'([\w-]+\.webp)'/g)) {
  if (!existsSync(join(dist, 'assets/img', img))) { console.error(`Imagem do catálogo ausente: ${img}`); falhas++; }
}

if (falhas) { console.error(`${falhas} problema(s) encontrado(s).`); process.exit(1); }
console.log('Verificação concluída: sem glifos proibidos e sem assets ausentes.');
