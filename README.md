# Cidade da Arte · site catálogo v1

Site catálogo de quadros e espelhos da Cidade da Arte (Ilhéus, BA). O site **não vende diretamente**: não tem conta, checkout nem pagamento. O cliente monta o pedido no carrinho e ele é enviado formatado para o WhatsApp da loja, que confirma valor, disponibilidade e prazo.

Identidade visual: handoff ONE em [`handoff/`](handoff/LEIA_PRIMEIRO.md). Pesquisa de mercado que orientou a estrutura: [`reports/`](reports/).

## Como rodar

Requer Node 18+ e nenhuma dependência.

```bash
npm run dev     # gera dist/ e abre a pré-visualização em http://localhost:4173
npm run build   # só gera dist/
npm run check   # build + busca de emojis/glifos usados como ícone e de assets ausentes
```

Para publicar (Netlify, Vercel, Cloudflare Pages), use `npm run build` como comando de build e `dist` como pasta de saída.

## Estrutura

```
src/
  pages/        index, catalogo, produto, sob-medida, sobre
  partials/     head, header, footer (com carrinho), ícones SVG, scripts
  assets/
    css/styles.css       tokens da marca + layout responsivo
    js/config.js         WhatsApp, endereço, modo homologação  <- editar aqui
    js/produtos.js       catálogo (produtos, categorias, ambientes, coleções)
    js/app.js            carrinho, mensagem de WhatsApp, menu, eventos
    js/home.js | catalogo.js | produto.js | sob-medida.js
    img/                 imagens provisórias (recortes do handoff)
    marca/               logo original sem fundo (escura e clara)
scripts/        build.mjs, serve.mjs, check.mjs
```

O build só injeta os parciais (`<!--@header-->`, `<!--@footer-->` etc.) em cada página. O resto é HTML, CSS e JS puros.

## Fluxo de pedido

1. Na página da peça, o cliente escolhe tamanho, acabamento, quantidade e observação e clica em **Adicionar ao carrinho**. O carrinho fica salvo no navegador (`localStorage`).
2. No carrinho, clica em **Continuar pedido** e informa nome (obrigatório), cidade/bairro, forma de recebimento e observações.
3. **Enviar pedido pelo WhatsApp** abre `wa.me/<número>?text=...` com a mensagem pronta e um código `CA-XXXX` para a loja identificar o pedido.

Também há atalhos que abrem o WhatsApp direto: **Pedir só esta peça**, **Ver na minha parede** (o cliente envia foto do ambiente), formulário **Sob medida**, programa para **arquitetos** e botão flutuante.

Exemplo de mensagem gerada:

```
Olá, Cidade da Arte! Vim pelo site e gostaria de um orçamento.

*Pedido CA-8YPB*

1. *Díptico Limões Sicilianos* (CA-Q103)
   Tamanho: 2 peças 50 x 70 cm
   Acabamento: Moldura dourada
   Quantidade: 2
   Obs.: Parede de 2,40 m

*Meus dados*
Nome: Maria
Cidade/bairro: Ilhéus, Pontal
Recebimento: Entrega

Pode me informar valores, disponibilidade e prazo? Obrigado!
```

## App (PWA) e "Ver na minha parede"

O site também é um app instalável. No Android/Chrome aparece o botão **Instalar o app** (home e rodapé); no iPhone, Safari > Compartilhar > **Adicionar à Tela de Início**. Instalado, abre em tela cheia direto no catálogo, com barra inferior (Início, Catálogo, Na parede, Carrinho, WhatsApp) e funciona offline com as páginas e peças já vistas.

- `src/manifest.webmanifest`: nome, cores, ícones e atalhos do app.
- `src/sw.js`: service worker. O build injeta a versão (hash dos arquivos) e a lista do shell; cada publicação atualiza o app sozinho.
- `src/pages/offline.html`: aviso exibido quando não há internet e a página não está no cache.
- `src/assets/icones-app/`: ícones gerados do símbolo original da logo.

**Ver na minha parede** (`parede.html`, `src/assets/js/parede.js`):

1. O cliente abre a câmera traseira (ou envia uma foto da parede, se não puder usar a câmera).
2. A peça escolhida aparece sobre a imagem: arrasta com o dedo, ajusta o tamanho com dois dedos (ou roda do mouse) e a luz para combinar com o ambiente.
3. Informando a largura da parede que aparece na tela, o app mostra a medida aproximada da peça em cm.
4. Tira a foto da simulação e compartilha (WhatsApp, Instagram), salva, pede orçamento ou adiciona ao carrinho com a medida.
5. **Minha arte**: o cliente envia a foto de uma arte própria, escolhe moldura (preta, branca, madeira, dourada) e passe-partout, e testa na parede. Vira um pedido "Emoldurar minha arte".

A câmera exige HTTPS (o Netlify já serve assim). Nenhuma imagem sai do aparelho do cliente.

As artes sobrepostas na câmera são recortes das fotos do catálogo, sem o ambiente: `src/assets/img/arte/`, gerados por `python3 scripts/recortar-artes.py` (Pillow e NumPy). Ao incluir uma peça nova, adicione as coordenadas dos painéis nesse script ou, melhor, peça à cliente a imagem só da arte.

## Mensuração

Os eventos vão para `window.dataLayer` e estão prontos para GTM/GA4. Nenhum script de analytics é carregado ainda, porque isso depende da definição de consentimento (LGPD).

| Evento | Quando |
|---|---|
| `view_item` | abre página de produto |
| `add_to_cart` / `remove_from_cart` | adiciona ou remove do carrinho |
| `view_cart` | abre o carrinho |
| `begin_checkout` | clica em "Continuar pedido" |
| `whatsapp_click` | qualquer abertura do WhatsApp (`origem` indica o botão) |
| `generate_lead` | pedido enviado (carrinho, produto ou sob medida) |
| `filter_catalog` | muda filtro no catálogo |
| `wall_preview_start` / `wall_preview_select` | abre a simulação na parede / troca de peça |
| `wall_preview_capture` / `wall_preview_share` | tira e compartilha a foto da simulação |
| `app_install_prompt` / `app_installed` | pedido e instalação do app |

## Pendências antes de publicar

- [x] **WhatsApp oficial** `(73) 3223-2082` configurado em `src/assets/js/config.js`. Como é um número fixo, confirmar que ele está ativo no WhatsApp Business: abrir https://wa.me/557332232082 deve iniciar a conversa com a loja.
- [x] **Catálogo 2026/27** em `src/assets/js/produtos.js`: 29 quadros (NOV 18 a NOV 53) com as imagens enviadas pela cliente.
- [ ] **Validar com a cliente** os nomes descritivos (sugeridos pela ONE, o catálogo só tem códigos), coleções e ambientes de cada peça.
- [ ] **Tamanhos e molduras** de cada peça: hoje o cliente escolhe "Tamanho do catálogo" ou "Sob medida", e "Moldura como na foto" ou "Outra moldura".
- [ ] **Códigos repetidos**: NOV 30 e NOV 31 aparecem em imagens diferentes nas páginas 6 e 7 do catálogo. Confirmar os códigos corretos.
- [ ] **Imagens sem o código escrito** (NOV 21, 30, 31, 32, 33, 34, 35, 36, 42, 43 trazem o texto "NOV" sobre a foto).
- [ ] **Espelhos**: o catálogo não tem espelhos. A categoria mostra "catálogo de espelhos em preparação" até chegarem as fotos.
- [ ] **Imagens conceituais restantes** (`cat-espelhos`, `amb-quarto`, `loja-textura`): trocar por fotos reais.
- [ ] Horário de funcionamento, política de entrega/instalação e condições para profissionais.
- [ ] Logo vetorial oficial (hoje é a imagem original recebida, apenas sem o fundo; os ícones do app foram ampliados dela).
- [ ] **Imagens só da arte** (sem ambiente) de cada peça, para a simulação na parede ficar mais nítida e com medidas reais.
- [ ] Desligar `homologacao` em `config.js`; trocar `noindex` em `src/partials/head.html` e `src/robots.txt`; adicionar domínio, `canonical` e `sitemap.xml`.
- [ ] Ligar GTM/GA4 com banner de consentimento.
