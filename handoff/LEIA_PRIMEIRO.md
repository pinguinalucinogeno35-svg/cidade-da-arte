# ONE × Cidade da Arte — Handoff de Desenvolvimento (conceitual v1.0)

## 1. Objetivo do projeto
Transformar a experiência digital da loja de quadros e espelhos da Cidade da Arte em uma vitrine editorial responsiva, com descoberta por coleções/ambientes, informações claras e CTA para solicitar orçamento. NÃO lançar e-commerce ou checkout sem aprovação de escopo.

## 2. Identidade (preservar)
- Marca: cidade da arte.
- Usar exclusivamente a logo original enviada (`marca/logo_original_recebida.jpeg`) até receber o arquivo vetorial/PNG oficial. Não redesenhar o símbolo por IA.
- Paleta exploratória: carvão #191919, marfim #F5F2EC, areia #BCA997, branco #FFFFFF. Requer aprovação da marca.
- Headings editoriais; corpo sans-serif legível; imagens generosas, alinhamentos e alto contraste.

## 3. Arquitetura de informação sugerida
- Header com marca, navegação: Quadros, Espelhos, Coleções, Sob medida, Sobre, Contato. Busca só após base real de produtos.
- Hero institucional: 'Leve arte para sua vida!' (frase real do perfil). CTAs: Explorar coleções, Sob medida.
- Blocos: categorias; descubra por ambiente (Sala, Quarto, Hall); curadoria de coleções (dados reais); processo 'Seu projeto, suas medidas'; localização e contato; rodapé.
- Modelo de produto opcional: título, categoria, imagem validada, medidas disponíveis, material, acabamento, código, status de disponibilidade (se integração real existir), orientação de orçamento. Não criar preço ou disponibilidade falsos.

## 4. Interações e fluxo
1. Usuário chega pelo Instagram, Google ou acesso direto.
2. Navega por categorias/ambientes; acessa item ou solução sob medida.
3. Seleciona preferências e informa medidas desejadas em formulário simples (não solicitar dados sensíveis desnecessários).
4. Envia consulta para atendimento confirmado da loja. WhatsApp SOMENTE com link fornecido e testado. Se não confirmado, apresentar botão sem URL pública até validação.
5. Equipe da loja retorna com disponibilidade, preço, entrega, instalação e prazo, se aplicável.

## 5. Responsividade
- Desktop 1440px: até 12 colunas; hero assimétrico imagem/texto; grid de 3 ou 4 cards; largura máxima de conteúdo ~1280px.
- Tablet 768–1023px: 2 colunas; menu adaptado.
- Mobile 360–767px: 1 coluna, menu acessível, CTAs visíveis, imagens com `object-fit:cover` e cuidado para não cortar a obra.
- Estados: loading, vazio, erro de conexão, sucesso no envio, imagem ausente; acessibilidade teclado/foco.

## 6. Requisitos de qualidade
- HTML semântico, landmarks, heading hierarchy, alt text informativo nas obras.
- WCAG 2.2 AA como meta; contraste ≥4.5:1 para corpo normal; navegação teclado e foco visível.
- Core Web Vitals; imagens AVIF/WebP responsivas, lazy loading abaixo da dobra; evitar carregar fotos enormes.
- SEO local básico: title, description, dados estruturados `LocalBusiness` só com informações verificadas, canonical, sitemap, OG e idioma pt-BR.
- LGPD: formulário com aviso de tratamento de dados; evitar analytics antes de definir consentimento quando aplicável.
- Instrumentação: clique WhatsApp, pesquisa de catálogo, clique em coleção, formulário iniciado/enviado, origem UTM; documentar nomes de eventos.

## 7. Dados conhecidos (do briefing do cliente; verificar antes de publicar)
- Instagram: @cidadedaarte.ios.
- Negócio divulgado: loja de fábrica de quadros e espelhos, pronta entrega e sob medida.
- Endereço coletado: Av. Vereador Ruy Carvalho, 196 — São Francisco, Ilhéus/BA, 45655-098.
- Telefone coletado: (73) 98208-2439.
- A captura exibe URL wa.me/557382082439, incompatível com telefone informado; confirmar link correto com responsável.
- Horário completo, entrega/instalação, estoque, catálogo, preços e condições: NÃO DISPONIBILIZADOS.
- Perfil no Google informado: nota 5,0 com apenas 1 avaliação, NÃO usar como prova social até validação.

## 8. Avisos sobre mockup
Imagens geradas por IA são CONCEITUAIS; não representam instalações reais, fachada real ou catálogo validado. A captura de feed e a logo vieram do briefing da loja. NÃO replicar fielmente obras geradas por IA como se fossem itens em estoque. Substituir por fotos reais autorizadas. Não criar contadores inventados nem usar domínio visual do mockup como endereço oficial.

## 9. Critérios de aceite para o programador
- Layout corresponde à hierarquia aprovada, preserva logotipo original e não usa fachada fictícia.
- Mobile 360px sem rolagem horizontal; navegação acessível.
- Nenhum produto/preço fictício em ambiente público.
- Fluxo de solicitação de orçamento testado ponta a ponta com canal confirmado.
- SEO local e metas de performance auditadas.
- Revisão editorial de textos, fotos, permissões e condições comerciais com a loja antes da publicação.

## 10. Gates de aprovação
A. Cliente valida identidade, conteúdo e escopo.
B. ONE valida design e UX.
C. Desenvolvedor implementa responsividade e fluxo, entrega ambiente de homologação.
D. ONE e cliente validam dados, comportamento e testes para publicação.
