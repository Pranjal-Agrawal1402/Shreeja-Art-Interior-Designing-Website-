// ── LUMINA INTERIORS — Frontend App ──────────────────────────────

(function () {
  'use strict';

  // ── NAV SCROLL EFFECT ────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── MOBILE MENU ──────────────────────────────────────────
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // ── PORTFOLIO GRID ───────────────────────────────────────
  const portfolioGrid = document.getElementById('portfolioGrid');
  const loadMoreBtn   = document.getElementById('loadMore');
  let shownCount = 0;
  const BATCH = 6;

  function renderPortfolioCard(item) {
    const card = document.createElement('div');
    card.className = 'portfolio-card reveal';
    card.dataset.id = item.id;

    // Generate a beautiful CSS gradient instead of relying on external images
    const gradient = `linear-gradient(135deg, ${item.palette[0]} 0%, ${item.palette[1]} 40%, ${item.palette[2]} 100%)`;

    card.innerHTML = `
      <div class="portfolio-card__bg" style="background:${gradient}; position:relative;">
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0.15;">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="60" height="60" stroke="white" stroke-width="1" fill="none"/>
            <rect x="20" y="20" width="40" height="40" stroke="white" stroke-width="0.5" fill="none"/>
            <line x1="10" y1="40" x2="70" y2="40" stroke="white" stroke-width="0.5"/>
            <line x1="40" y1="10" x2="40" y2="70" stroke="white" stroke-width="0.5"/>
          </svg>
        </div>
        <div style="position:absolute;bottom:16px;right:16px;font-family:monospace;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.1em;">${item.year}</div>
      </div>
      <div class="portfolio-card__overlay">
        <h3>${item.title}</h3>
        <p>${item.category}</p>
      </div>
    `;

    card.addEventListener('click', () => openProjectLightbox(item));
    return card;
  }

  function loadPortfolioBatch() {
    if (!portfolioGrid) return;
    const items = LuminaData.portfolio.slice(shownCount, shownCount + BATCH);
    items.forEach(item => {
      portfolioGrid.appendChild(renderPortfolioCard(item));
    });
    shownCount += items.length;
    if (shownCount >= LuminaData.portfolio.length && loadMoreBtn) {
      loadMoreBtn.style.display = 'none';
    }
    observeRevealElements();
  }

  if (portfolioGrid) loadPortfolioBatch();
  if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadPortfolioBatch);

  // ── PROJECT LIGHTBOX ─────────────────────────────────────
  const lightbox  = document.getElementById('lightbox');
  const lbContent = document.getElementById('lbContent');
  const lbClose   = document.getElementById('lbClose');

  function openProjectLightbox(item) {
    if (!lightbox || !lbContent) return;
    const gradient = `linear-gradient(135deg, ${item.palette[0]} 0%, ${item.palette[1]} 40%, ${item.palette[2]} 100%)`;
    lbContent.innerHTML = `
      <div style="max-width:800px; background:var(--c-cream); border-radius:8px; overflow:hidden; display:grid; grid-template-columns:1fr 1fr;">
        <div style="background:${gradient}; min-height:400px; display:flex; align-items:center; justify-content:center; padding:40px;">
          <div style="text-align:center; color:rgba(255,255,255,0.6); font-family:monospace; font-size:12px; letter-spacing:0.15em; text-transform:uppercase;">${item.location}</div>
        </div>
        <div style="padding:48px;">
          <p style="font-family:monospace; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:var(--c-brass); margin-bottom:12px;">${item.category}</p>
          <h2 style="font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:300; margin-bottom:16px; line-height:1.2;">${item.title}</h2>
          <p style="color:var(--c-mid); font-size:0.9rem; line-height:1.7; margin-bottom:24px;">${item.description}</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:28px;">
            ${item.tags.map(t => `<span style="padding:4px 12px; border:1px solid var(--c-rule); border-radius:2px; font-size:0.72rem; font-family:monospace; letter-spacing:0.08em; color:var(--c-mid); text-transform:uppercase;">${t}</span>`).join('')}
          </div>
          <a href="contact.html" style="display:inline-flex; align-items:center; gap:8px; padding:12px 24px; background:var(--c-brass); color:white; border-radius:4px; font-size:0.8rem; font-weight:500; letter-spacing:0.06em; text-transform:uppercase; text-decoration:none;">Inquire About This Project</a>
        </div>
      </div>
    `;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  function closeLightbox() {
    if (lightbox) lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── TESTIMONIALS SLIDER ──────────────────────────────────
  const testimonials = document.querySelectorAll('.testimonial');
  const dotBtns      = document.querySelectorAll('.dot-btn');
  let currentSlide   = 0;
  let autoSlide;

  function goToSlide(idx) {
    testimonials.forEach((t, i) => t.classList.toggle('active', i === idx));
    dotBtns.forEach((d, i) => d.classList.toggle('active', i === idx));
    currentSlide = idx;
  }

  dotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(autoSlide);
      goToSlide(parseInt(btn.dataset.idx, 10));
      autoSlide = setInterval(() => goToSlide((currentSlide + 1) % testimonials.length), 5000);
    });
  });

  if (testimonials.length) {
    autoSlide = setInterval(() => goToSlide((currentSlide + 1) % testimonials.length), 5000);
  }

  // ── BLOG GRID ────────────────────────────────────────────
  const blogGrid = document.getElementById('blogGrid');
  if (blogGrid) {
    LuminaData.blog.forEach(post => {
      const card = document.createElement('article');
      card.className = 'blog-card reveal';

      // Generate a simple geometric thumbnail
      const colors = [
        ['#C4A882','#8B7355'], ['#1A1814','#B8923A'], ['#2E2B27','#D4AB5A']
      ];
      const c = colors[(post.id - 1) % colors.length];
      const gradient = `linear-gradient(160deg, ${c[0]} 0%, ${c[1]} 100%)`;

      card.innerHTML = `
        <div class="blog-card__thumb" style="background:${gradient}; display:flex; align-items:center; justify-content:center;">
          <span style="font-family:'Cormorant Garamond',serif; font-size:3rem; color:rgba(255,255,255,0.2); font-weight:300; font-style:italic;">${post.id < 10 ? '0'+post.id : post.id}</span>
        </div>
        <div class="blog-card__meta">${post.category} · ${post.date} · ${post.readTime} read</div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
      `;

      blogGrid.appendChild(card);
    });
    observeRevealElements();
  }

  // ── INTERSECTION OBSERVER (reveal on scroll) ─────────────
  function observeRevealElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal:not(.visible), .step:not(.visible)').forEach(el => {
      observer.observe(el);
    });
  }

  observeRevealElements();

  // ── HERO PARALLAX ────────────────────────────────────────
  const heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroContent.style.transform = `translateY(${y * 0.25}px)`;
      heroContent.style.opacity = 1 - (y / 500);
    }, { passive: true });
  }

})();
