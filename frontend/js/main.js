// ── Nav scroll behaviour ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('nav--scrolled', window.scrollY > 60);
});

// ── Hamburger ─────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav__links');
hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// ── Hero particle canvas ───────────────────────────────────────
(function heroParticles() {
  const container = document.getElementById('heroCanvas');
  if (!container) return;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() { W = canvas.width = container.offsetWidth; H = canvas.height = container.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196,168,130,${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Projects grid ─────────────────────────────────────────────
const grid = document.getElementById('projectsGrid');
if (grid) {
  const featured = LuminaeData.projects.slice(0, 6);
  grid.innerHTML = featured.map((p, i) => `
    <article class="project-card ${i === 0 ? 'project-card--wide' : ''}" data-id="${p.id}">
      <div class="project-card__img" style="background-color:${p.color};">
        <div class="project-card__overlay"></div>
        <div class="project-card__tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
      </div>
      <div class="project-card__body">
        <p class="project-card__cat">${p.category} · ${p.location}</p>
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.desc}</p>
        <a href="portfolio.html#${p.id}" class="project-card__link">View Project →</a>
      </div>
    </article>
  `).join('');
}

// ── Testimonials slider ───────────────────────────────────────
const slider = document.getElementById('testimonialSlider');
const dotsEl = document.getElementById('testimonialDots');
let current = 0;
if (slider && dotsEl) {
  function renderTestimonials() {
    slider.innerHTML = LuminaeData.testimonials.map((t, i) => `
      <div class="testimonial ${i === current ? 'active' : ''}">
        <blockquote>"${t.quote}"</blockquote>
        <cite>— ${t.name}, <span>${t.role}</span></cite>
      </div>
    `).join('');
    dotsEl.innerHTML = LuminaeData.testimonials.map((_, i) => `
      <button class="dot ${i === current ? 'active' : ''}" data-idx="${i}" aria-label="Testimonial ${i+1}"></button>
    `).join('');
    dotsEl.querySelectorAll('.dot').forEach(d => d.addEventListener('click', e => {
      current = +e.target.dataset.idx; renderTestimonials();
    }));
  }
  renderTestimonials();
  setInterval(() => { current = (current + 1) % LuminaeData.testimonials.length; renderTestimonials(); }, 5000);
}

// ── Counter animation ─────────────────────────────────────────
const counters = document.querySelectorAll('.stats__num');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    let cur = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur + (target >= 100 ? '+' : '');
      if (cur >= target) clearInterval(timer);
    }, 25);
    observer.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => observer.observe(c));

// ── Scroll reveal ─────────────────────────────────────────────
const revealEls = document.querySelectorAll('.process__step, .project-card, .stats__item');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObs.observe(el));

// ── Newsletter form ───────────────────────────────────────────
const newsletterForm = document.getElementById('newsletterForm');
const newsletterConfirm = document.getElementById('newsletterConfirm');
newsletterForm?.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('newsletterEmail').value.trim();
  if (!email) return;
  Storage.push('subscribers', { email });
  newsletterConfirm.textContent = '✓ You\'re on the list. Welcome to the studio.';
  newsletterConfirm.style.color = '#C4A882';
  newsletterForm.reset();
});
