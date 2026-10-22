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

## Pendências antes de publicar

- [ ] **WhatsApp real** em `src/assets/js/config.js`. Hoje está o número fictício `(73) 90000-0000`; depois de trocar, defina `whatsappProvisorio: false`.
- [x] **Catálogo 2026/27** em `src/assets/js/produtos.js`: 29 quadros (NOV 18 a NOV 53) com as imagens enviadas pela cliente.
- [ ] **Validar com a cliente** os nomes descritivos (sugeridos pela ONE, o catálogo só tem códigos), coleções e ambientes de cada peça.
- [ ] **Tamanhos e molduras** de cada peça: hoje o cliente escolhe "Tamanho do catálogo" ou "Sob medida", e "Moldura como na foto" ou "Outra moldura".
- [ ] **Códigos repetidos**: NOV 30 e NOV 31 aparecem em imagens diferentes nas páginas 6 e 7 do catálogo. Confirmar os códigos corretos.
- [ ] **Imagens sem o código escrito** (NOV 21, 30, 31, 32, 33, 34, 35, 36, 42, 43 trazem o texto "NOV" sobre a foto).
- [ ] **Espelhos**: o catálogo não tem espelhos. A categoria mostra "catálogo de espelhos em preparação" até chegarem as fotos.
- [ ] **Imagens conceituais restantes** (`cat-espelhos`, `amb-quarto`, `loja-textura`): trocar por fotos reais.
- [ ] Horário de funcionamento, política de entrega/instalação e condições para profissionais.
- [ ] Logo vetorial oficial (hoje é a imagem original recebida, apenas sem o fundo).
- [ ] Desligar `homologacao` em `config.js`; trocar `noindex` em `src/partials/head.html` e `src/robots.txt`; adicionar domínio, `canonical` e `sitemap.xml`.
- [ ] Ligar GTM/GA4 com banner de consentimento.
