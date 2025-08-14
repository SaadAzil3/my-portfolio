(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // Mobile nav
  const navToggle = $('.nav-toggle');
  const nav = $('#site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    $$('#site-nav a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Smooth scroll "Back to top"
  $$('[data-scroll-to]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = $('body');
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Sticky header accent on scroll
  const header = $('#site-header');
  const onScrollHeader = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  // Reveal on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  $$('.section, .card, .list-item').forEach(el => {
    el.style.transform = 'translateY(10px)';
    el.style.opacity = '0';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });

  // Animated counters
  const counters = $$('.stat-number');
  const onView = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const tick = () => {
          current += step;
          if (current >= target) { current = target; }
          el.textContent = String(current);
          if (current < target) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        onView.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => onView.observe(c));

  // Project filtering and search
  const chips = $$('.chip');
  const projSearch = $('#proj-search');
  const projectCards = $$('#project-grid .project');
  let activeFilter = 'all';
  const applyFilters = () => {
    const q = (projSearch?.value || '').trim().toLowerCase();
    projectCards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const title = ($('h3', card)?.textContent || '').toLowerCase();
      const matchesTag = activeFilter === 'all' || tags.includes(activeFilter);
      const matchesText = !q || title.includes(q) || tags.includes(q);
      card.classList.toggle('hidden', !(matchesTag && matchesText));
    });
  };
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    activeFilter = chip.getAttribute('data-filter') || 'all';
    applyFilters();
  }));
  projSearch?.addEventListener('input', applyFilters);

  // Write-up search
  const writeSearch = $('#writeup-search');
  const writeItems = $$('#writeups .list-item');
  writeSearch?.addEventListener('input', () => {
    const q = writeSearch.value.trim().toLowerCase();
    writeItems.forEach(item => {
      const title = (item.getAttribute('data-title') || '').toLowerCase();
      const tags = (item.getAttribute('data-tags') || '').toLowerCase();
      item.classList.toggle('hidden', !(title.includes(q) || tags.includes(q)));
    });
  });

  // Modals
  const openModal = (m) => { m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
  const closeModal = (m) => { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
  $$('[data-modal-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = btn.getAttribute('data-modal-target');
      const modal = $(sel);
      if (modal) openModal(modal);
    });
  });
  $$('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
    $$('.modal-close', modal).forEach(cl => cl.addEventListener('click', () => closeModal(modal)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(modal);
    });
  });

  // Copy email
  const copyBtn = $('#copy-email');
  copyBtn?.addEventListener('click', async () => {
    const text = copyBtn.getAttribute('data-copy') || '';
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1200);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
    }
  });

  // Contact: compose mailto with body
  window.composeMailto = (e) => {
    e.preventDefault();
    const name = $('#name')?.value?.trim() || '';
    const email = $('#email')?.value?.trim() || '';
    const message = $('#message')?.value?.trim() || '';
    const to = $('#email-link')?.textContent?.trim() || 'alex.security@example.com';
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    return false;
  };

  // Footer year
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Code rain
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = $('#code-rain');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d', { alpha: true });
    const glyphs = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%*+-/<>=';
    let width, height, fontSize, columns, drops;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      fontSize = Math.max(12, Math.floor(width / 70));
      ctx.font = `${fontSize}px monospace`;
      columns = Math.floor(width / fontSize);
      drops = new Array(columns).fill(1);
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(5,8,7,0.1)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < columns; i++) {
        const char = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillStyle = i % 12 === 0 ? '#b3ffd9' : '#22ff88';
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
  }

  // Scrollspy: highlight current section in nav (updated to include experience & education)
  const sections = ['about','skills','projects','writeups','experience','education','contact']
    .map(id => ({ id, el: document.getElementById(id) }))
    .filter(s => !!s.el);

  const navLinks = new Map();
  $$('#site-nav a[data-nav]').forEach(a => navLinks.set(a.getAttribute('data-nav'), a));

  const setActive = (id) => {
    navLinks.forEach((a) => { a.classList.remove('active'); a.removeAttribute('aria-current'); });
    const target = navLinks.get(id);
    if (target) { target.classList.add('active'); target.setAttribute('aria-current', 'page'); }
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const headerOffset = (header?.offsetHeight || 64) + 6;
      let current = sections[0]?.id;
      for (const s of sections) {
        const rect = s.el.getBoundingClientRect();
        if (rect.top - headerOffset <= 0) current = s.id;
      }
      if (current) setActive(current);
      ticking = false;
    });
  };
  onScroll(); // init
  window.addEventListener('scroll', onScroll, { passive: true });

})();