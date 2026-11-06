# Transição História → Interação

## Objetivo

Criar uma passagem suave, controlada pela rolagem, entre o fundo azul da seção `#historia` e o fundo azul-marinho (`#010A34`) de `#Interacao`.

## Escopo confirmado

- Ritmo intermediário: a transição acontece nos últimos 35% de `#historia` e termina no início de `#Interacao`.
- GSAP e ScrollTrigger animam variáveis CSS já associadas a `#historia`.
- O gradiente azul, a malha branca e os halos reduzem de intensidade até a passagem para o azul-marinho.
- A animação é reversível ao rolar para cima.
- Não haverá novo HTML, `pin`, mudança de altura ou animação dos cards de História.
- Em telas pequenas e sob `prefers-reduced-motion`, o estado é estático e nenhum ScrollTrigger adicional é criado.

## Arquitetura

1. Declarar em `#historia` variáveis CSS para a cor do gradiente e as opacidades da malha e dos halos.
2. Carregar `assets/sismom.js` após GSAP e ScrollTrigger.
3. Criar um `ScrollTrigger` exclusivo para a passagem entre as duas seções, com `scrub` intermediário.
4. Manter `assets/dobra2.1.js` responsável somente pela animação interna de `#Interacao`.

## Requisitos não funcionais

- Sem novas dependências e com custo de renderização restrito às propriedades visuais da seção.
- Sem dados, rede adicional ou impacto de privacidade.
- Falha segura: se GSAP, ScrollTrigger ou uma das seções não existir, a página preserva seus estilos estáticos.
- Manutenção centralizada em `assets/sismom.css` e `assets/sismom.js`.

## Registro de decisão

| Decisão | Alternativas consideradas | Motivo |
| --- | --- | --- |
| Variáveis CSS animadas | Véu sobreposto; fundo global | Mantém a transição refinada sem encobrir cards ou interferir no mapa. |
| Ritmo intermediário | Cinematográfico; direto | Passagem perceptível sem prolongar a rolagem. |
| Fallback estático | Animação em todos os contextos | Respeita movimento reduzido e limitações de telas pequenas. |
