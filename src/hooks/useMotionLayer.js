import { useEffect } from 'react';
import { animate, stagger, utils, createTimeline, spring } from 'animejs';

export function useMotionLayer({ lang, experienceOpen, modalOpen }) {
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  // Runs once per language mount: hero entrance, typing text, reveal-on-scroll, counters, magnetic buttons, badge hover, scramble.
  useEffect(() => {
    if (reduceMotion) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
      return;
    }

    const cleanups = [];

    // Hero title: split into chars, animate in with a springy cascade
    const titleEl = document.getElementById('typing');
    if (titleEl) {
      titleEl.textContent = 'pixter';
      if (animate.splitText || (window.anime && window.anime.splitText)) {
        try {
          const split = utils.splitText ? utils.splitText(titleEl, { chars: true }) : null;
        } catch (e) { /* splitText may not be present in this build */ }
      }
      animate(titleEl, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 700,
        ease: spring({ stiffness: 180, damping: 14 })
      });
    }

    // Hero entrance sequence: fluid staggered reveal
    const tl = createTimeline({ defaults: { ease: spring({ stiffness: 190, damping: 16 }) } })
      .add('.kicker, .profile-row', { opacity: [0, 1], translateY: [22, 0], delay: stagger(110) })
      .add('.hero-text, .actions, .socials, .badges', { opacity: [0, 1], translateY: [20, 0], delay: stagger(90) }, '-=550');

    // Ambient drifting particles inside the hero
    const hero = document.querySelector('.hero');
    const particles = [];
    if (hero) {
      for (let p = 0; p < 10; p++) {
        const dot = document.createElement('span');
        dot.style.cssText = `position:absolute;width:3px;height:3px;border-radius:1px;background:rgba(255,255,255,.5);pointer-events:none;top:${utils.random(5, 95)}%;left:${utils.random(5, 95)}%;`;
        hero.appendChild(dot);
        particles.push(dot);
        animate(dot, {
          translateY: [0, utils.random(-40, -90)],
          translateX: [0, utils.random(-30, 30)],
          opacity: [0, 0.7, 0],
          duration: () => utils.random(4000, 8000),
          loop: true,
          delay: () => utils.random(0, 4000),
          ease: 'inOutSine'
        });
      }
    }

    // Scroll-triggered reveal for sections/cards — uses a native IntersectionObserver
    // instead of anime's onScroll, since onScroll captures element position once at
    // mount time and goes stale when the experience menu opens/closes and shifts
    // everything below it (that was causing #projects to break).
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target, {
            opacity: [0, 1],
            translateY: [30, 0],
            scale: [0.97, 1],
            duration: 800,
            ease: spring({ stiffness: 170, damping: 15 })
          });
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    revealEls.forEach((el) => {
      el.style.opacity = '0';
      revealObserver.observe(el);
    });
    cleanups.push(() => revealObserver.disconnect());

    // Grid-staggered badge reveal for the "Developer Work" tech stack (also observer-based)
    const devTitle = document.getElementById('developer-title');
    if (devTitle) {
      const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate('#developer-title ~ .badges .badge, #discord-title ~ .list .item, .grid .badges .badge', {
              opacity: [0, 1],
              translateY: [14, 0],
              duration: 500,
              delay: stagger(18, { grid: [10, 6], from: 'center' }),
              ease: spring({ stiffness: 190, damping: 14 })
            });
            badgeObserver.disconnect();
          }
        });
      }, { rootMargin: '0px 0px -15% 0px', threshold: 0.05 });
      badgeObserver.observe(devTitle);
      cleanups.push(() => badgeObserver.disconnect());
    }

    // Animated stat counters (observer-based, fires once)
    const counterEls = document.querySelectorAll('.big-number');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const raw = el.textContent.trim();
        const num = parseInt(raw.replace(/[^\d]/g, ''), 10);
        const suffix = raw.replace(/[\d,]/g, '');
        if (!isNaN(num)) {
          const counter = { val: 0 };
          animate(counter, {
            val: num,
            duration: 1500,
            ease: 'outExpo',
            modifier: utils.round(0),
            onUpdate: () => { el.textContent = counter.val + suffix; }
          });
        }
        counterObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    counterEls.forEach((el) => counterObserver.observe(el));
    cleanups.push(() => counterObserver.disconnect());

    // Magnetic buttons
    const magneticEls = document.querySelectorAll('.button, .socials a, .discord-copy');
    magneticEls.forEach((btn) => {
      const onMove = (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.28;
        const y = (e.clientY - r.top - r.height / 2) * 0.45;
        animate(btn, { translateX: x, translateY: y, duration: 400, ease: 'outQuad' });
      };
      const onLeave = () => {
        animate(btn, { translateX: 0, translateY: 0, duration: 700, ease: spring({ stiffness: 130, damping: 11 }) });
      };
      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        btn.removeEventListener('mousemove', onMove);
        btn.removeEventListener('mouseleave', onLeave);
      });
    });

    // Badges: gentle floaty rotation on hover
    const badgeEls = document.querySelectorAll('.badge');
    badgeEls.forEach((b) => {
      const onEnter = () => animate(b, { scale: [1, 1.06], rotate: [0, utils.random(-3, 3)], duration: 350, ease: spring({ stiffness: 320, damping: 14 }) });
      const onLeave = () => animate(b, { scale: 1, rotate: 0, duration: 450, ease: spring({ stiffness: 220, damping: 13 }) });
      b.addEventListener('mouseenter', onEnter);
      b.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        b.removeEventListener('mouseenter', onEnter);
        b.removeEventListener('mouseleave', onLeave);
      });
    });

    // Scramble-reveal on Undergrove mentions (the accent moment)
    if (window.anime && window.anime.scrambleText) {
      ['undergroveLink', 'undergroveItem'].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const valueEl = el.classList.contains('project-trigger') ? el.querySelector('.value') : el;
        const original = valueEl.textContent;
        let running = false;
        const onEnter = () => {
          if (running) return;
          running = true;
          window.anime.scrambleText(valueEl, {
            text: original,
            chars: '01<>#/{}',
            duration: 650,
            onComplete: () => { running = false; }
          });
        };
        el.addEventListener('mouseenter', onEnter);
        cleanups.push(() => el.removeEventListener('mouseenter', onEnter));
      });
    }

    return () => {
      particles.forEach((p) => p.remove());
      cleanups.forEach((fn) => fn());
    };
  }, [lang]);

  // Cursor pixel trail (desktop only)
  useEffect(() => {
    if (reduceMotion || !hasHover) return;
    let lastTrail = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - lastTrail < 45) return;
      lastTrail = now;
      const dot = document.createElement('span');
      dot.className = 'pixel-trail';
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
      document.body.appendChild(dot);
      animate(dot, {
        opacity: [0.55, 0],
        scale: [1, 0.2],
        duration: 550,
        ease: 'outQuad',
        onComplete: () => dot.remove()
      });
    };
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  // Spotlight glow on cards, follows cursor
  useEffect(() => {
    const cards = document.querySelectorAll('.card');
    const onMove = (e, card) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    const handlers = [];
    cards.forEach((card) => {
      const handler = (e) => onMove(e, card);
      card.addEventListener('mousemove', handler);
      handlers.push([card, handler]);
    });
    return () => handlers.forEach(([card, handler]) => card.removeEventListener('mousemove', handler));
  }, [experienceOpen]);

  // Animate the menu's content in when the experience menu opens
  useEffect(() => {
    if (!experienceOpen || reduceMotion) return;
    animate('#experienceMenu .item, #experienceMenu .stat-box', {
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 500,
      delay: stagger(60),
      ease: spring({ stiffness: 190, damping: 16 })
    });
    animate('#experienceMenu .badge', {
      opacity: [0, 1],
      translateY: [16, 0],
      scale: [0.9, 1],
      duration: 550,
      delay: stagger(22, { grid: [8, 5], from: 'first' }),
      ease: spring({ stiffness: 180, damping: 14 })
    });
  }, [experienceOpen]);
}
