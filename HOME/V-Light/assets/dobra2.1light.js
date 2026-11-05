(() => {
  const section = document.querySelector('#Interacao');
  const intro = document.querySelector('#intro');
  const diagram = document.querySelector('#diagram');
  const stage = document.querySelector('#stageName');
  const stageDot = document.querySelector('.stage-readout .dot');
  const progress = document.querySelector('#progressBar');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 780px)').matches;
  const particles = document.querySelector('#particles');

  if (!reduce && !mobile && particles) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('i');
      p.className = 'particle';
      p.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--x:${(Math.random() - .5) * 100}px;--y:${-35 - Math.random() * 110}px;--duration:${7 + Math.random() * 10}s;--delay:${-Math.random() * 12}s`;
      particles.append(p);
    }
  }

  document.querySelectorAll('.meta').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--glow-x', `${e.clientX - r.left}px`);
      card.style.setProperty('--glow-y', `${e.clientY - r.top}px`);
    });
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.02, zIndex: 60, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, zIndex: 1, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    });
  });

  const paths = [...document.querySelectorAll('.connection')];
  paths.forEach(path => {
    const n = path.getTotalLength();
    path.style.strokeDasharray = n;
    path.style.strokeDashoffset = n;
  });

  function revealGroup(name) {
    const group = document.querySelector(`[data-group="${name}"]`);
    if (group) group.classList.add('sweep');
    return group;
  }

  function setStage(label) {
    if (stage) stage.textContent = label;
    if (stageDot) stageDot.classList.add('active');
  }

  function pulse(pathId) {
    const path = document.querySelector(`[data-path="${pathId}"]`);
    const dot = document.querySelector(`[data-pulse="${pathId}"]`);
    if (!path || !dot) return;
    const length = path.getTotalLength();
    const a = path.getPointAtLength(0);
    const b = path.getPointAtLength(length);
    gsap.set(dot, { attr: { cx: a.x, cy: a.y }, opacity: 1 });
    gsap.to(dot, {
      duration: .75,
      attr: { cx: b.x, cy: b.y },
      ease: 'none',
      onComplete: () => gsap.set(dot, { opacity: 0 })
    });
  }

  function activate(cards) {
    cards.forEach(c => {
      const el = document.querySelector(`.meta-${c}`);
      if (el) el.classList.add('is-active');
    });
    setTimeout(() => {
      cards.forEach(c => {
        const el = document.querySelector(`.meta-${c}`);
        if (el) el.classList.remove('is-active');
      });
    }, 900);
  }

  if (!reduce && !mobile && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.15,
        onUpdate: self => {
          if (progress) progress.style.width = `${self.progress * 100}%`;
        }
      }
    });

    tl.to(intro, { autoAlpha: 0, y: -28, duration: .55 })
      .call(() => setStage('01 · Observar'))
      .to(['.meta-7', '.meta-8'], { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', stagger: .14, duration: .45 })
      .to('.group-observar', { autoAlpha: 1, duration: .3 }, '<.08')
      .to('.group-observar .group-label span', { y: 0, duration: .28 }, '<')
      .call(() => { revealGroup('observar'); activate([7, 8]); })

      .call(() => setStage('02 · Detectar'), null, '+=.35')
      .to(['.meta-1', '.meta-2'], { autoAlpha: 1, y: 0, scale: 1, stagger: .13, duration: .42 })
      .to('.group-detectar', { autoAlpha: 1, duration: .3 }, '<.08')
      .to('.group-detectar .group-label span', { y: 0, duration: .25 }, '<')
      .call(() => { revealGroup('detectar'); activate([1, 2]); })

      .call(() => setStage('03 · Prever'), null, '+=.35')
      .to(['.meta-3', '.meta-5'], { autoAlpha: 1, y: 0, scale: 1, stagger: .14, duration: .42 })
      .to('.group-prever', { autoAlpha: 1, duration: .3 }, '<.08')
      .to('.group-prever .group-label span', { y: 0, duration: .25 }, '<')
      .call(() => { revealGroup('prever'); activate([3, 5]); })

      .call(() => setStage('04 · Integrar e alertar'), null, '+=.35')
      .to('.meta-4', { autoAlpha: 1, y: 0, scale: 1, duration: .52 })
      .to('.group-integrar', { autoAlpha: 1, duration: .35 }, '<.08')
      .to('.group-integrar .group-label span', { y: 0, duration: .26 }, '<')
      .call(() => { revealGroup('integrar'); activate([4]); })

      .call(() => setStage('05 · Infraestrutura 24/7'), null, '+=.35')
      .to('.meta-6', { autoAlpha: 1, y: 0, scale: 1, duration: .48 })
      .call(() => { activate([6]); })

      .call(() => setStage('06 · Entregar'), null, '+=.35')
      .to('.meta-9', { autoAlpha: 1, y: 0, scale: 1, duration: .48 })
      .to('.group-entregar', { autoAlpha: 1, duration: .3 }, '<.05')
      .to('.group-entregar .group-label span', { y: 0, duration: .25 }, '<')
      .call(() => { revealGroup('entregar'); activate([9]); })

      .call(() => setStage('07 · Rede de interações'), null, '+=.35')
      .to('[data-path="p1"]', { strokeDashoffset: 0, opacity: 1, duration: .3 })
      .call(() => pulse('p1'))
      .to('[data-path="p2"]', { strokeDashoffset: 0, opacity: 1, duration: .3 }, '+=.1')
      .call(() => pulse('p2'))
      .to('[data-path="p3"]', { strokeDashoffset: 0, opacity: 1, duration: .3 }, '+=.1')
      .call(() => pulse('p3'))
      .to('[data-path="p4"]', { strokeDashoffset: 0, opacity: 1, duration: .38 }, '+=.1')
      .call(() => pulse('p4'))
      .to(['[data-path="p5"]', '[data-path="p6"]', '[data-path="p7"]'], { strokeDashoffset: 0, opacity: 1, duration: .35, stagger: .08 }, '+=.15')
      .call(() => ['p5', 'p6', 'p7'].forEach((p, i) => setTimeout(() => pulse(p), i * 110)))
      .to(['[data-path="p8"]', '[data-path="p9"]', '[data-path="p10"]'], { strokeDashoffset: 0, opacity: 1, duration: .35, stagger: .08 }, '+=.15')
      .call(() => ['p8', 'p9', 'p10'].forEach((p, i) => setTimeout(() => pulse(p), i * 110)))
      .to('[data-path="p11"]', { strokeDashoffset: 0, opacity: 1, duration: .3 }, '+=.15')
      .call(() => pulse('p11'))
      .to('.diagram-layer', { filter: 'drop-shadow(0 0 18px rgba(76,192,252,.18))', duration: .38 })
      .to('.diagram-layer', { filter: 'drop-shadow(0 0 0 rgba(76,192,252,0))', duration: .7 });
  } else {
    document.querySelectorAll('.group').forEach(g => g.style.opacity = 1);
    document.querySelectorAll('.meta').forEach(m => {
      m.style.opacity = 1;
      m.style.transform = 'none';
    });
  }
})();
