# Onda de partículas — História

## Objetivo

Adicionar uma camada abstrata de partículas em movimento ao fundo de `#historia`, inspirada no vídeo de referência, sem modificar o gradiente azul, a malha ou os halos existentes.

## Escopo confirmado

- Camada WebGL decorativa inserida como primeiro filho de `#historia`.
- Nuvem 3D de partículas deformada por shader com ondas senoidais e fluxo diagonal.
- Paleta limitada a branco translúcido e `#4CC0FC`.
- Conteúdo de História permanece acima da camada e totalmente interativo.
- A onda reduz a opacidade no fim de História para acompanhar a passagem para `#Interacao`.
- Sem vídeo, WebGL, nova biblioteca ou recurso externo.

## Arquitetura

1. O HTML contém um contêiner `<div aria-hidden="true">` exclusivo para a onda.
2. `assets/sismom.css` posiciona a cena abaixo do conteúdo e acima dos planos de fundo existentes.
3. `assets/historia-wave-three.js` usa `three.js r180` — a mesma biblioteca identificada no bundle Auralis — para renderizar a nuvem por WebGL, com `requestAnimationFrame` e `ResizeObserver`.
4. `IntersectionObserver` pausa o loop enquanto a seção estiver fora da viewport.
5. A transição GSAP existente também controla a opacidade do canvas ao final da seção.

## Requisitos não funcionais

- Densidade ajustada à largura da tela e escala de pixel limitada para preservar desempenho.
- Sem dados coletados, solicitações de rede ou dependências externas.
- Falha segura: se Canvas 2D não estiver disponível, o fundo atual permanece sem alteração.
- Em `prefers-reduced-motion`, exibir um único quadro estático; em telas pequenas, reduzir a densidade.

## Registro de decisão

| Decisão | Alternativas consideradas | Motivo |
| --- | --- | --- |
| Malha senoidal dupla | Linhas fluidas; campo livre | Produz uma onda legível e estável com custo baixo. |
| Three.js WebGL | Canvas 2D; vídeo | Reproduz uma malha de partículas com profundidade e movimento fluido, sem carregar o bundle React completo do Auralis. |
| Pausa fora da viewport | Loop contínuo | Reduz custo de renderização sem impacto visual. |
