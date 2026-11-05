(() => {
  'use strict';

  /* ─── Prefers Reduced Motion ─── */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Custom Cursor ─── */
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  let cursorX = 0, cursorY = 0;
  let ringX = 0, ringY = 0;

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
    });

    (function animateRing() {
      ringX += (cursorX - ringX) * 0.12;
      ringY += (cursorY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, [tabindex]').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
    });
  } else {
    cursor.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  /* ─── Nav scroll state ─── */
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ─── Hero Reveal Lens ─── */
  const heroVisual = document.getElementById('hero-visual');
  const heroReveal = document.getElementById('hero-reveal');
  const heroBase = document.getElementById('hero-base');
  const halo = document.getElementById('hero-halo');
  const hudState = document.getElementById('hud-state');
  const hudX = document.getElementById('hud-x');
  const hudY = document.getElementById('hud-y');
  const hint = document.getElementById('hero-hint');

  const LENS_RADIUS = 150; // px
  const hasPointer = window.matchMedia('(pointer: fine)').matches;

  if (hasPointer && !reduceMotion) {
    hint.style.display = 'flex';

    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = ((x / rect.width) * 100).toFixed(1);
      const yPct = ((y / rect.height) * 100).toFixed(1);

      // Reveal clip-path centered on cursor
      heroReveal.style.clipPath = `circle(${LENS_RADIUS}px at ${x}px ${y}px)`;

      // Move halo
      halo.style.left = x + 'px';
      halo.style.top = y + 'px';
      halo.classList.add('is-active');

      // Subtle parallax on base image (max ±12px)
      const pxOff = ((x / rect.width) - 0.5) * -24;
      const pyOff = ((y / rect.height) - 0.5) * -24;
      heroBase.style.transform = `translate(${pxOff}px, ${pyOff}px) scale(1.06)`;

      // HUD
      hudState.textContent = 'REVELADO';
      hudX.textContent = xPct;
      hudY.textContent = yPct;
    });

    heroVisual.addEventListener('mouseleave', () => {
      heroReveal.style.clipPath = 'circle(0px at 50% 50%)';
      halo.classList.remove('is-active');
      heroBase.style.transform = 'translate(0,0) scale(1)';
      hudState.textContent = 'LATENTE';
      hudX.textContent = '000.0';
      hudY.textContent = '000.0';
    });
  } else {
    /* Touch / mobile: show reveal layer fully */
    heroReveal.style.clipPath = 'circle(100% at 50% 50%)';
    heroReveal.style.opacity = '0.75';
    hint.style.display = 'none';
    if (halo) halo.style.display = 'none';

    /* Touch drag on mobile */
    heroVisual.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      const rect = heroVisual.getBoundingClientRect();
      const x = t.clientX - rect.left;
      const y = t.clientY - rect.top;
      heroReveal.style.clipPath = `circle(${LENS_RADIUS * 1.4}px at ${x}px ${y}px)`;
      e.preventDefault();
    }, { passive: false });

    heroVisual.addEventListener('touchend', () => {
      setTimeout(() => {
        heroReveal.style.clipPath = 'circle(100% at 50% 50%)';
      }, 1200);
    });
  }

  /* ─── Data Particles in Hero ─── */
  if (!reduceMotion) {
    const container = document.getElementById('hero-particles');
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.setProperty('--dur', (3 + Math.random() * 5) + 's');
      p.style.setProperty('--delay', (Math.random() * 6) + 's');
      // vary the signal color slightly
      if (Math.random() > 0.6) {
        p.style.background = '#0960E5';
        p.style.opacity = '0.5';
      }
      container.appendChild(p);
    }
  }

  /* ─── AI Particles ─── */
  if (!reduceMotion) {
    const aiContainer = document.getElementById('ai-particles');
    if (aiContainer) {
      for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.className = 'ai-particle';
        p.style.setProperty('--dur', (1.5 + Math.random() * 2) + 's');
        p.style.setProperty('--delay', (i * 0.3) + 's');
        p.style.top = (Math.random() * 100) + '%';
        aiContainer.appendChild(p);
      }
    }
  }

  /* ─── Scroll Reveal ─── */
  const revealEls = document.querySelectorAll('.reveal-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));

  /* ─── Meta Card Pulse ─── */
  document.querySelectorAll('.meta-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.meta-card__icon');
      if (!icon || reduceMotion) return;
      icon.animate([
        { transform: 'scale(1)', boxShadow: '0 0 0 rgba(76,192,252,0)' },
        { transform: 'scale(1.12)', boxShadow: '0 0 20px rgba(76,192,252,0.5)' },
        { transform: 'scale(1.06)', boxShadow: '0 0 16px rgba(76,192,252,0.3)' }
      ], { duration: 400, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
    });
  });

  /* ─── Hero parallax on scroll ─── */
  if (!reduceMotion) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const hero = document.querySelector('.hero');
      if (!hero) return;
      const heroH = hero.offsetHeight;
      if (scrolled > heroH) return;
      const pct = scrolled / heroH;
      heroBase.style.transform = `translateY(${pct * 12}%) scale(1.08)`;
    }, { passive: true });
  }
})();
