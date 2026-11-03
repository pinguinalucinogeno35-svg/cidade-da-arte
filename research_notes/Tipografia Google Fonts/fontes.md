# Tipografia (Google Fonts) para a Cidade da Arte

Pesquisa feita em 22/10/2026. Contexto: catálogo de quadros decorativos e espelhos de alto padrão em Ilhéus/BA, tom editorial. Paleta: carvão #191919, marfim #F5F2EC, areia #BCA997. Hoje o site usa Newsreader nos títulos e Inter no texto (`src/partials/head.html`, `src/assets/css/styles.css`).

## Como os dados foram levantados (e limites)

- **Metadados oficiais do Google Fonts**: o acesso a `fonts.google.com` (inclusive `/metadata/fonts`) e a `developers.google.com` foi bloqueado pelo proxy deste ambiente. Por isso usei a mesma fonte de dados que alimenta o catálogo, o repositório oficial `github.com/google/fonts` (arquivos `METADATA.pb` e `DESCRIPTION.en_us.html` de cada família, ex.: https://github.com/google/fonts/blob/main/ofl/newsreader/METADATA.pb), e a API pública `https://fonts.googleapis.com/css2`, que funcionou.
- **Peso de download**: medi os arquivos .woff2 que a API css2 realmente entrega, com user-agent de Chrome 126. O peso considerado é o do subset `latin`. É o único que um texto em português baixa: o `unicode-range` desse subset é `U+0000-00FF, …`, que já inclui À–ÿ (ç, ã, õ, é, ê, ô etc.). O `latin-ext` só é baixado se a página usar caracteres fora dessa faixa. Os valores mudam conforme navegador e versão da fonte.
- **Acentos do português**: verifiquei glifo por glifo (ç Ç ã Ã õ Õ é É ê Ê á Á à â Â í ó ô Ô ú ü) no cmap dos arquivos .ttf oficiais com fontTools. **Nenhuma das 20 famílias avaliadas tem lacunas.**
- **Altura-x** (xh/em): valor lido da tabela OS/2 de cada .ttf. Em Italiana e Marcellus os valores (0,500/0,700) parecem os padrões da ferramenta de produção, e não medidas reais. Trate-os como não confirmados.
- **Typewolf e Fonts In Use**: lidos via ferramenta de extração (TinyFish), porque o acesso direto estava bloqueado.
- **Fontes das marcas de referência**: identificadas pelos arquivos de fonte pré-carregados no `<head>` das home pages, também via TinyFish. Uma fonte carregada não prova em qual elemento ela é usada.

---

## 1. A logo e a home aprovada (o que a tipografia precisa conversar)

**Logo** (`handoff/marca/logo_original_recebida.jpeg`):
- **Lettering**: sans-serif neo-grotesca em caixa baixa ("cidade / da arte"), em duas linhas alinhadas à esquerda. Peso médio a semibold, entreletra e entrelinha apertadas, altura-x grande. Tem "a" de dois andares e terminais horizontais em c/e. O "t" tem o topo cortado em diagonal. O desenho lembra a família Helvetica/Inter. **Não confirmei qual fonte foi usada na logo.**
- **Símbolo**: quadrados concêntricos rotacionados, em traço monolinear (um losango que lembra um labirinto ou uma moldura dentro de moldura).
- **Consequência**: a fonte de texto deve ser uma grotesca neutra com "a" de dois andares e altura-x alta, para continuar a logo. Geométricas puras, com "a" de um andar (estilo Futura, como a Jost), contrastam com ela.

**Home aprovada** (`handoff/referencias/site_homepage_aprovado.png`):
- Títulos em serifa de contraste moderado, peso regular, caixa alta e baixa ("Leve arte para sua vida.", "Escolha pelo ambiente") e entrelinha curta. Os números de etapa (01–04) também estão em serifa.
- Textos de interface e descrições em sans pequena (cerca de 13–15 px).
- O desenho dos títulos é compatível com Newsreader no tamanho óptico de display. **Não confirmei qual fonte o mock usou.**

---

## 2. O que as marcas de referência usam (verificado no `<head>` em 22/10/2026)

| Marca | Fontes carregadas | Leitura |
|---|---|---|
| **Framebridge** (molduras, EUA) | `Apercu-Regular-Pro.woff2` + `Cheltenham-BT-Bold.woff2`. Fonte: https://www.framebridge.com/ | Serifa editorial de jornal + grotesca/geométrica limpa |
| **LUMAS** (galeria de arte fotográfica) | `archivo.woff2` + `utile-display-regular.woff2`. Fonte: https://www.lumas.com/ | Tudo em sans (Archivo está no Google Fonts) |
| **BOEMI** (arte decorativa, BR) | `custom-fonts.css` com **Canela** e **Brandon Grotesque**. Kit Adobe `msp8qhw` com brandon-grotesque, halcom e meno-banner. Fontes: https://boemi.com.br/ e https://use.typekit.net/msp8qhw.css | Serifa display "com personalidade" + geométrica |
| **Democrart** (galeria online, BR) | `montserrat_n4` / `montserrat_n6` (Shopify CDN). Fonte: https://www.democrart.com.br/ | Tudo em sans geométrica |

O padrão nas marcas de arte e decoração que trabalham o tom editorial (Framebridge, BOEMI) é uma serifa de display com caráter nos títulos e uma sans limpa no texto. Isso coincide com o pedido do handoff.

Sobre a Canela (usada pela BOEMI), o Typewolf diz: "neither purely a sans-serif nor a serif", com "flared stroke endings … inscriptional quality". A combinação sugerida pelo site é "Canela + Caslon". Fonte: https://www.typewolf.com/canela. O Typewolf não mostra publicamente a alternativa gratuita no Google Fonts; ela fica num PDF pago, que não consultei.

---

## 3. Serifas de título avaliadas (12)

Os metadados (pesos, eixos e subsets) vêm de `github.com/google/fonts/ofl/<família>/METADATA.pb`. O peso é o do subset latin, 1 estilo regular 400, servido pela css2.

| Família | latin-ext / PT | Pesos e eixos (Google Fonts) | Itálico | Peso latin (400) | Altura-x/em | Personalidade e uso |
|---|---|---|---|---|---|---|
| **Newsreader** | sim / ok | variável `wght` 200–800 + `opsz` 6–72 | sim | 21,2 KB (opsz 72 estático); **55,9 KB** (variável com opsz); 128,9 KB (opsz + 2 pesos) | 0,426 | Editorial, jornalístico refinado. O eixo `opsz` ajusta o contraste ao tamanho, então funciona tanto em 80 px quanto em 18 px |
| **Cormorant Garamond** | sim / ok | variável `wght` 300–700 | sim | 22,8 KB | 0,386 (a menor) | Garamond de display: luxo clássico, moda, joalheria. Fica frágil abaixo de ~28 px |
| **Playfair Display** | sim / ok | variável `wght` 400–900 | sim | 21,3 KB | 0,514 | Transicional de alto contraste: "luxo" clássico, muito difundida |
| **Fraunces** | sim / ok | variável `wght` 100–900, `opsz` 9–144, `SOFT` 0–100, `WONK` 0–1 | sim | 34,1 KB | 0,482 | Old Style "quirky" dos anos 1900, simpática e artesanal. Pode soar descontraída demais para galeria |
| **Libre Caslon Display** | sim / ok | estático, só 400 | não | 23,7 KB | 0,424 | Caslon de publicidade dos anos 1950, clássica e editorial. Otimizada para títulos web |
| **Libre Caslon Text** | sim / ok | variável `wght` 400–700 | sim | 24,4 KB | 0,524 | Versão de texto da anterior (16 px). Útil para subtítulos e citações |
| **Gloock** | sim / ok | estático, só 400 | não | 25,7 KB | 0,508 | Alto contraste de manchete de jornal, contemporânea e dramática |
| **Bodoni Moda** | sim / ok | variável `wght` 400–900 + `opsz` 6–96 | sim | 26,1 KB | 0,460 | Didone de moda (estética Vogue/Harper's), luxo frio |
| **DM Serif Display** | sim / ok | estático, só 400 | sim | 24,2 KB | 0,481 | Transicional de alto contraste para "super-sized poster settings" |
| **Instrument Serif** | sim / ok | estático, só 400 | sim | 20,5 KB | 0,510 | Condensada, contemporânea, ar de "galeria e estúdio" atual. Parente da Editorial New e da ITC Garamond |
| **Marcellus** | sim / ok | estático, só 400 | não | 14,2 KB | não confirmado | Serifa "flared" inspirada em inscrições romanas (família visual próxima de Trajan e Canela) |
| **Italiana** | **só latin**, mas cobre todos os acentos PT (verificado) | estático, só 400 | não | 9,9 KB | não confirmado | Display fina, caligráfica e muito "fashion". **Está classificada como SANS_SERIF** no METADATA. Um peso só, sem itálico |
| **EB Garamond** | sim / ok | variável `wght` 400–800 | sim | 23,3 KB | 0,400 | Revival de Garamond, livresca e acadêmica. Melhor em texto do que como título com personalidade |

### Notas por família (com fontes)

- **Newsreader**: "primarily intended for continuous on-screen reading in content-rich environments". Tem eixos de tamanho óptico e peso, em romano e itálico, e foi desenhada por Hugues Gentile / Production Type. Fontes: https://fontsinuse.com/typefaces/152858/newsreader e https://github.com/google/fonts/blob/main/ofl/newsreader/DESCRIPTION.en_us.html.
  - **Usos registrados**: site da revista *L'Obs* (2022), *Daylit Studio website* e *Smith & Lewarne portfolio website*, todos no Fonts In Use. Nenhum uso por marca de arte ou decoração foi confirmado.
  - O Typewolf a lista entre "newer releases that are really great" sem exemplos em uso. Fonte: https://www.typewolf.com/google-fonts.
- **Cormorant / Cormorant Garamond**: "inspired by the sixteenth century types of Claude Garamond, however … Cormorant was designed as a display face". A Cormorant Garamond "features larger counters which makes it more suitable as a text face". É a 8ª no top 40 do Typewolf. Fontes: https://www.typewolf.com/cormorant e https://www.typewolf.com/google-fonts.
  - **Usos ligados a arte** (Fonts In Use): *DRIFT – Shylights exhibition, Hessisches Landesmuseum Darmstadt* (2025), o catálogo *Josef Albers. Colors in Play* e *Ceramicah* (staff pick). Fonte: https://fontsinuse.com/typefaces/45804/cormorant.
- **Playfair Display**: o Typewolf diz que "makes an excellent font for titles and headlines (especially the beautiful italic), however, for long stretches of body copy the delicate, high-contrast strokes might hinder readability, especially when used at smaller sizes". Fonte: https://www.typewolf.com/playfair-display.
  - Não encontrei uso confirmado em marcas de arte ou decoração. É muito usada em templates genéricos de "luxo", o que reduz a diferenciação (opinião, não dado).
- **Fraunces**: "inspired by quirky 'Old Style' serifs of the early twentieth century", com eixos de peso, softness, wonk e tamanho óptico. Fonte: https://www.typewolf.com/fraunces.
  - **Uso ligado a arte**: *Arts Broadcasting Studio at Anteism* (staff pick). Fonte: https://fontsinuse.com/search?terms=fraunces.
- **Libre Caslon Display/Text**: "based on hand lettering artist Caslon interpretations typical of 1950s advertising". A Display é "optimized for web headlines" e a Text "for web body text (typically set at 16px)". Fontes: https://github.com/google/fonts/blob/main/ofl/librecaslondisplay/DESCRIPTION.en_us.html e https://github.com/google/fonts/blob/main/ofl/librecaslontext/DESCRIPTION.en_us.html.
  - **Estilo parecido em uso**: a Framebridge usa Cheltenham, outra serifa editorial de jornal (verificado no `<head>`), e o Typewolf sugere "Canela + Caslon".
- **Gloock**: "contemporary high-contrast serif … inspiration from newspaper's headlines". Fonte: https://github.com/google/fonts/blob/main/ofl/gloock/DESCRIPTION.en_us.html. O Fonts In Use tem um único uso, sem ligação com arte (https://fontsinuse.com/search?terms=gloock).
- **Bodoni Moda**: "a no-compromises Bodoni family, built for the digital age", com pesos, itálicos e tamanhos ópticos. Fonte: https://github.com/google/fonts/blob/main/ofl/bodonimoda/DESCRIPTION.en_us.html. Não confirmei usos em arte ou decoração.
- **DM Serif Display**: "high-contrast transitional face … shaped for use in super-sized poster settings". Fonte: https://github.com/google/fonts/blob/main/ofl/dmserifdisplay/DESCRIPTION.en_us.html. Não confirmei usos em arte ou decoração.
- **Instrument Serif**: "condensed display font designed for the Instrument brand … intended for use at large sizes". Fonte: https://github.com/google/fonts/blob/main/ofl/instrumentserif/DESCRIPTION.en_us.html. As fontes relacionadas no Fonts In Use são Editorial New e ITC Garamond.
  - **Usos**: *Buci Hôtel Paris branding* (staff pick), *Panaille restaurant* e o pôster *Sommerfest 25 Künstler:innenhäuser Worpswede*, de casas de artistas. Fonte: https://fontsinuse.com/typefaces/219915/instrument-serif.
- **Marcellus**: "flared serif … inspired by classic Roman inscription letterforms". Fonte: https://github.com/google/fonts/blob/main/ofl/marcellus/DESCRIPTION.en_us.html. É o estilo "flared/inscricional" que o Typewolf descreve na Canela (BOEMI). A semelhança é de categoria, não de desenho, e é uma avaliação minha.
- **Italiana**: "designed for use in the headlines … inspired by the calligraphy of the Italian masters … elegance and sophistication". Fonte: https://github.com/google/fonts/blob/main/ofl/italiana/DESCRIPTION.en_us.html.
- **EB Garamond**: "a Garamond revival designed by Georg Duffner in 2011". Fonte: https://www.typewolf.com/eb-garamond.

---

## 4. Sans de texto avaliadas (7)

| Família | latin-ext / PT | Pesos e eixos | Itálico | Peso latin (400) | Altura-x/em | "a" | Recursos OpenType úteis* | Leitura em tamanho pequeno |
|---|---|---|---|---|---|---|---|---|
| **Inter** | sim / ok | variável `wght` 100–900 + `opsz` 14–32 | sim | 23,1 KB (estático); **47,1 KB** (variável 400/500/600) | **0,546** | dois andares | `tnum`, `case`, `ss01`/`ss02`, `cv01`, `zero`, `frac` | Excelente: feita para interface, altura-x grande |
| **Manrope** | sim / ok | variável `wght` 200–800 | **não** | 13,8 KB | 0,540 | dois andares | `tnum`, `case`, `frac` | Muito boa. Sem itálico |
| **DM Sans** | sim / ok | variável `wght` 100–1000 + `opsz` 9–40 | sim | 22,6 KB | 0,526 | dois andares | `case`, `ss01`/`ss02` (sem `tnum`) | Muito boa, mais geométrica e arredondada |
| **Work Sans** | sim / ok | variável `wght` 100–900 | sim | 19,4 KB | 0,500 | dois andares | `tnum`, `case`, `smcp`, `onum`/`lnum` | Boa, com ar de grotesca antiga |
| **Figtree** | sim / ok | variável `wght` 300–900 | sim | 11,1 KB | 0,500 | um andar | `tnum`, `case` | Boa, porém "friendly" de app |
| **Outfit** | sim / ok | variável `wght` 100–900 | **não** | 13,7 KB | 0,460 | um andar | `tnum` | Média: geométrica, altura-x menor |
| **Jost** | sim / ok | variável `wght` 100–900 | sim | 9,2 KB | 0,460 | um andar (estilo Futura) | `tnum` | Média: Futura-like, conflita com a logo |

\* Recursos lidos da tabela GSUB dos .ttf oficiais. O "a" de um ou dois andares foi conferido visualmente nos espécimes conhecidos dessas famílias, não por medição.

### Notas por família (com fontes)

- **Inter**: "designed to work well on screens as a UI font and features a large x-height", em 9 pesos com itálicos e versão variável. É a 2ª no top 40 do Typewolf e está marcada como "body text friendly". O Typewolf lista Maison Neue e San Francisco como fontes similares. Fontes: https://www.typewolf.com/inter e https://www.typewolf.com/google-fonts.
  - **Combinações reais com serifa editorial**: Fabric e Everyday Finds (Reckless + Inter), AFAR (Ayer, Cambon + Inter), Ellement (Louize + Inter). Fonte: https://www.typewolf.com/inter.
- **Manrope**: "open-source sans-serif … Mikhail Sharanda", em 7 pesos sem itálico. O Typewolf lista **Inter** e Fakt como fontes similares. Fonte: https://www.typewolf.com/manrope.
  - **Usos ligados a arte**: *Album Art Galerie website*, *Barbara Koch in der Sammlung der Kunst Aus(leihe) Dortmund* e *Witness exhibition guide*. Fonte: https://fontsinuse.com/search?terms=manrope.
- **DM Sans**: "geometric sans-serif … derived from Poppins". É a 1ª no top 40 do Typewolf. Fontes: https://www.typewolf.com/dm-sans e https://www.typewolf.com/google-fonts.
- **Work Sans**: "influenced by early grotesques". É a 5ª no top 40 do Typewolf, e aparece com Canela em sites listados (Aavia, Luke Fenech). Fonte: https://www.typewolf.com/work-sans.
- **Figtree**: "clean yet friendly geometric sans serif font for usage in web and mobile apps". Fonte: https://github.com/google/fonts/blob/main/ofl/figtree/article/ARTICLE.en_us.html.
- **Outfit**: "official typeface for brand automation company outfit.io". Fonte: https://github.com/google/fonts/blob/main/ofl/outfit/DESCRIPTION.en_us.html.
- **Jost**: "inspired by 1920s German sans-serifs" (linhagem Futura). Fonte: https://github.com/google/fonts/blob/main/ofl/jost/DESCRIPTION.en_us.html.

---

## 5. Recomendação

### Principal: **Newsreader (títulos) + Inter (texto)**, mantida e otimizada

1. **Logo**: a Inter tem o mesmo DNA do lettering (grotesca neutra, "a" de dois andares, altura-x grande). Logo e interface vão parecer uma mesma voz. O próprio Typewolf aponta Inter e Manrope como similares entre si, e ambas como da família Maison Neue / San Francisco.
2. **Home aprovada**: os títulos do mock são uma serifa regular de contraste moderado, compatível com a Newsreader display. Trocar a serifa agora quebraria o que já foi aprovado.
3. **Nicho**: segue o padrão verificado em Framebridge (Cheltenham + Apercu) e BOEMI (Canela + Brandon Grotesque), com serifa editorial nos títulos e sans limpa no texto. A Newsreader tem raiz editorial (*L'Obs*) e passa "curadoria e revista de decoração" mais do que "luxo de template", que é o caso de Playfair e Bodoni (avaliação minha).
4. **Funcional**: o eixo `opsz` mantém a mesma família nos títulos de 80 px e nos nomes de produto e preço de 18–22 px, sem perder legibilidade. Newsreader e Inter têm `tnum` (algarismos tabulares) para medidas e preços (verificado).
5. **Ponto fraco**: a Newsreader é a mais pesada da lista quando servida variável (55,9 KB no latin). Mesmo assim é aceitável, e a seção 6 mostra a economia em relação ao link atual.

### Alternativa 1: **Instrument Serif (títulos) + Inter (texto)**, galeria contemporânea

- Serifa condensada atual, com ar de estúdio, galeria e hotel-boutique (*Buci Hôtel Paris*, *Künstler:innenhäuser Worpswede* no Fonts In Use). Tem personalidade forte já no 400, e o itálico é ótimo para palavras de destaque ("arte").
- É a opção mais leve com itálico (romano + itálico + Inter = 89,3 KB no latin).
- **Riscos**: só existe o peso 400. Foi feita para "large sizes", então os nomes de produto pequenos (18 px) devem ficar na Inter 500. Difere mais do mock aprovado (é mais estreita).

### Alternativa 2: **Cormorant Garamond (títulos) + Manrope (texto)**, luxo clássico

- Garamond de display com cara de joalheria, moda e galeria tradicional. Tem usos em exposições de museu e catálogo de arte (DRIFT/Landesmuseum Darmstadt, Josef Albers). A Manrope é a grotesca "irmã" da Inter, mais redonda e leve (13,8 KB), e conversa com a logo.
- É o par mais leve (84,4 KB no latin, com 500/600 + itálico 500).
- **Riscos**: é a menor altura-x da lista (0,386). Use no mínimo 28 px e peso 500–600, e não use em preço e nome de produto. A Manrope não tem itálico.

**Menção honrosa**: Libre Caslon Display + Inter (70,8 KB). É o caminho Caslon/Cheltenham da Framebridge, sugerido pelo Typewolf ("Canela + Caslon"). Tem só um peso e é fraca abaixo de ~24 px.

**Descartadas para o caso**:
- **Jost, Outfit e Figtree**: geométricas de "a" de um andar que brigam com a logo.
- **Italiana**: um só peso, muito fina, sem itálico.
- **Bodoni Moda e DM Serif Display**: alto contraste de moda/pôster, distante do mock aprovado.
- **Fraunces**: caráter "quirky" demais para alto padrão.
- **EB Garamond**: livresca.
- **Playfair Display**: genérica no "luxo".
- **Gloock e Marcellus**: só um peso, sem itálico.

Todas essas descartadas cobrem os acentos do português.

---

## 6. `<link>` recomendado (par principal)

O CSS atual só usa a Newsreader em 400 (`h1, h2, h3`, `.cartao-colecao__nome`, `.passo__numero`, `.produto__preco strong`, `.item__nome` e outros) e a Inter em 400/500/600. O link atual pede `Newsreader:opsz,wght@6..72,400;6..72,500`. Com a faixa de `opsz`, isso faz o Google servir um arquivo variável de 128,9 KB (latin) por causa do 500, que não é usado. Tirando o 500, o arquivo cai para 55,9 KB.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400&display=swap" rel="stylesheet">
```

- **Peso (subset latin)**: Inter 47,1 KB + Newsreader 55,9 KB = **103,1 KB**, contra 176,0 KB do link atual. A API respondeu 200 em 22/10/2026.
- **Com itálico editorial** (para destacar palavras nos títulos): use `family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400`. O total no latin vai para 164,9 KB.
- **Alternativa 1**: `https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap` (89,3 KB).
- **Alternativa 2**: `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600&display=swap` (84,4 KB).

---

## 7. Ajustes de uso sugeridos (par principal)

Os valores partem do CSS atual e do mock aprovado. São recomendações de projeto, não dados medidos.

| Elemento | Fonte / peso | Tamanho | Entrelinha | Letter-spacing | Observações |
|---|---|---|---|---|---|
| **h1 hero** | Newsreader 400 | `clamp(2.75rem, 6.2vw, 5rem)` (44–80 px) | 1.02–1.05 | **-0.02em** | `font-optical-sizing: auto` (padrão) ativa o opsz de display; `text-wrap: balance` |
| **h1 de páginas internas / produto** | Newsreader 400 | `clamp(2.25rem, 5vw, 4rem)` | 1.05–1.1 | -0.015em | |
| **h2 de seção** | Newsreader 400 | `clamp(2rem, 4vw, 3rem)` (32–48 px) | 1.1 | -0.01em | Como no mock ("Escolha pelo ambiente") |
| **h3 / nomes de cartão e produto** | Newsreader 400 | 1.25–1.5rem (20–24 px) | 1.2 | 0 | O opsz se ajusta sozinho para o tamanho de texto |
| **Preço / medidas** | Newsreader 400 (preço) ou Inter 500 | 1.375rem / 0.875rem | 1.2 | 0 | `font-variant-numeric: tabular-nums` (ambas têm `tnum`) |
| **Sobretítulo em caixa alta** | Inter 500 (600 se for sobre foto) | 0.75rem (12 px), nunca menos | 1.3 | **0.12–0.14em** (atual: .14em, ok) | `text-transform: uppercase; font-feature-settings: "case"` (ajusta pontuação e traços às maiúsculas). Cor areia-texto escura no marfim, para garantir contraste |
| **Corpo** | Inter 400 | 1rem (16 px); 1.0625rem em descrições longas | 1.6 | 0 | Largura máxima de 60–68ch. Texto secundário em `--texto-2` com contraste AA no marfim |
| **Meta e legendas pequenas** | Inter 400 | 0.8125rem (13 px) | 1.45 | +0.01em | Não usar 300. A Inter tem altura-x grande e segura bem nos 13 px |
| **Botões / menu** | Inter 500 | 0.875–0.9375rem | 1.2 | +0.01em | Caixa alta e baixa como no mock. Se usar caixa alta, aplicar 0.08em |
| **Números de etapa (01–04)** | Newsreader 400 | 2rem | 1 | 0 | Já no CSS (`.passo__numero`) |

Outras regras:
- Não aplicar `font-weight` acima de 400 na Newsreader. Se algum dia precisar de 500, ele terá de entrar no link, e o arquivo sobe para cerca de 129 KB.
- Manter os fallbacks atuais (`Georgia` e `system-ui`) por causa do `display=swap`.

---

## 8. Itens não confirmados

- Qual fonte foi usada na logo e qual foi usada no mock da home (só comparei visualmente).
- Alternativa gratuita "oficial" do Typewolf para Canela e Cheltenham (está no PDF pago).
- Uso de Newsreader, Bodoni Moda, DM Serif Display, Gloock, Marcellus ou Italiana por marcas de arte ou decoração (não encontrei registro).
- Em quais elementos exatos Framebridge, LUMAS, BOEMI e Democrart aplicam cada fonte (só confirmei que são carregadas).
- Métricas OS/2 de altura-x de Italiana e Marcellus.

## Fontes consultadas

- Repositório oficial do Google Fonts (METADATA.pb, DESCRIPTION, ARTICLE): https://github.com/google/fonts (pastas `ofl/newsreader`, `ofl/cormorantgaramond`, `ofl/playfairdisplay`, `ofl/fraunces`, `ofl/librecaslondisplay`, `ofl/librecaslontext`, `ofl/gloock`, `ofl/bodonimoda`, `ofl/dmserifdisplay`, `ofl/instrumentserif`, `ofl/marcellus`, `ofl/italiana`, `ofl/ebgaramond`, `ofl/inter`, `ofl/manrope`, `ofl/jost`, `ofl/dmsans`, `ofl/outfit`, `ofl/figtree`, `ofl/worksans`)
- Google Fonts CSS API v2 (medições de subset e peso): https://fonts.googleapis.com/css2
- Typewolf: https://www.typewolf.com/google-fonts, /cormorant, /canela, /fraunces, /playfair-display, /inter, /dm-sans, /manrope, /work-sans, /eb-garamond
- Fonts In Use: https://fontsinuse.com/typefaces/152858/newsreader, https://fontsinuse.com/typefaces/219915/instrument-serif, https://fontsinuse.com/typefaces/45804/cormorant, https://fontsinuse.com/search?terms=fraunces, https://fontsinuse.com/search?terms=gloock, https://fontsinuse.com/search?terms=manrope
- Sites de referência (`<head>`): https://www.framebridge.com/, https://www.lumas.com/, https://boemi.com.br/ (+ https://use.typekit.net/msp8qhw.css e `custom-fonts.css`), https://www.democrart.com.br/

## Decisão final (22/10/2026)

A pedido da agência ("fontes mais atrativas"), as 10 combinações foram renderizadas lado a lado no título real do site ("Leve arte para sua vida."), com acentos do português. Escolha: **Cormorant Garamond 500/600 + itálico 500 (títulos) + Manrope 400/500/600 (texto)**.

- Cormorant Garamond: serifa de alto contraste com cara de galeria e itálico expressivo, usado em destaques como "vida.". Por ter altura-x pequena, os títulos foram aumentados de 10% a 20% e o peso passou para 500.
- Manrope: o "a" de dois andares conversa com a logo, e o desenho é mais refinado que o da Inter.
- Descartadas na comparação visual: Playfair Display (comum demais), Bodoni Moda e Italiana (traços finos frágeis em tamanhos menores) e Gloock (pesada para o tom do site).
