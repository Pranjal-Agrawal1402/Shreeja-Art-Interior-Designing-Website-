// ── LUMINA ADMIN PANEL ─────────────────────────────────────────
// Works with the backend API or in DEMO MODE (local mock data)

(function () {
  'use strict';

  // ── CONFIG ──────────────────────────────────────────────────
  const API_BASE = 'http://localhost:3001/api';
  let SESSION_TOKEN = sessionStorage.getItem('lumina_admin_token') || '';
  let DEMO_MODE = false; // Set true if backend isn't running

  // ── MOCK DATA for Demo Mode ──────────────────────────────────
  const MOCK = {
    token: 'demo-token-abc123',
    stats: {
      inquiries: { total: 24, new: 5, contacted: 12, converted: 6, thisMonth: 8 },
      portfolio: { total: 6 },
      blog: { total: 3 },
      projectTypes: { residential: 10, 'single-room': 5, hospitality: 4, commercial: 3, consultation: 2 }
    },
    inquiries: [
      { id:'a1', firstName:'Priya', lastName:'Mehta', email:'priya@example.com', phone:'+91 98765 43210', projectType:'residential', budget:'15l-50l', message:'We want to redesign our 3BHK in Bandra. We love the coastal contemporary aesthetic and want something that feels open and breezy.', status:'new', createdAt: new Date(Date.now()-86400000).toISOString() },
      { id:'a2', firstName:'Rahul', lastName:'Verma', email:'rahul@example.com', phone:'+91 98765 11111', projectType:'single-room', budget:'under-5l', message:'Looking to redesign my home office. Need something functional but beautiful.', status:'contacted', createdAt: new Date(Date.now()-2*86400000).toISOString() },
      { id:'a3', firstName:'Nisha', lastName:'Kapoor', email:'nisha@hotel.com', phone:'+91 11 2222 3333', projectType:'hospitality', budget:'1cr+', message:'We are planning a second property in Jaipur. Would love to collaborate again.', status:'converted', createdAt: new Date(Date.now()-5*86400000).toISOString() },
      { id:'a4', firstName:'Arun', lastName:'Singh', email:'arun@tech.io', phone:'+91 98888 77777', projectType:'commercial', budget:'50l-1cr', message:'New office in Bengaluru, 8,000 sq.ft. We want a design that encourages collaboration.', status:'new', createdAt: new Date(Date.now()-7*86400000).toISOString() },
      { id:'a5', firstName:'Divya', lastName:'Nair', email:'divya@gmail.com', phone:'', projectType:'consultation', budget:'under-5l', message:'Just want a 2hr consultation for my living room. Not sure where to start.', status:'closed', createdAt: new Date(Date.now()-10*86400000).toISOString() }
    ],
    portfolio: [
      { id:1, title:'The Verandah House', category:'Residential', location:'Alibaug, Maharashtra', year:2024, palette:['#C4A882','#8B7355','#F5EDE0','#3D3530'], featured:true },
      { id:2, title:'Studio Loft 12B', category:'Residential', location:'Bandra West, Mumbai', year:2024, palette:['#2C2C2C','#E8D5B0','#8B4513'], featured:false },
      { id:3, title:'The Saffron House', category:'Hospitality', location:'Jaisalmer, Rajasthan', year:2023, palette:['#D4790A','#2D1B00','#F5DEB3'], featured:true },
      { id:4, title:'Morph Office', category:'Commercial', location:'Bengaluru', year:2023, palette:['#1A1A2E','#16213E','#0F3460'], featured:false },
      { id:5, title:'Kohl Restaurant', category:'Hospitality', location:'Hauz Khas, Delhi', year:2023, palette:['#0D0D0D','#C9A85C','#6B3F1A'], featured:true },
      { id:6, title:'The Quiet House', category:'Residential', location:'Lonavala', year:2022, palette:['#E8E0D5','#9B8B7A','#4A3F35'], featured:false }
    ],
    blog: [
      { id:1, title:'Why every room needs one unfinished thing', category:'Design Theory', date:'May 2025', published:true },
      { id:2, title:'The material mood board: choosing stone vs tile', category:'Materials', date:'April 2025', published:true },
      { id:3, title:'Lighting layers: how we light a room in three passes', category:'Lighting Design', date:'March 2025', published:false }
    ]
  };

  // ── API HELPER ───────────────────────────────────────────────
  async function api(path, opts = {}) {
    if (DEMO_MODE) return demoApi(path, opts);

    try {
      const res = await fetch(`${API_BASE}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-session-token': SESSION_TOKEN
        },
        ...opts
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      return data;
    } catch (err) {
      console.warn('API failed, switching to demo mode:', err.message);
      DEMO_MODE = true;
      return demoApi(path, opts);
    }
  }

  function demoApi(path, opts = {}) {
    const method = opts.method || 'GET';
    const body   = opts.body ? JSON.parse(opts.body) : null;

    // Simulate network delay
    return new Promise(resolve => setTimeout(() => {
      if (path === '/auth/login') {
        if (body.username === 'admin' && body.password === 'lumina2026') {
          resolve({ success: true, token: MOCK.token });
        } else {
          throw new Error('Invalid credentials');
        }
      }
      else if (path === '/stats')      resolve(MOCK.stats);
      else if (path === '/portfolio')  resolve(MOCK.portfolio);
      else if (path === '/blog')       resolve(MOCK.blog);
      else if (path.startsWith('/inquiries')) {
        if (method === 'GET' && path === '/inquiries') {
          resolve({ data: MOCK.inquiries, total: MOCK.inquiries.length });
        } else if (method === 'PATCH') {
          const id = path.split('/')[2];
          const item = MOCK.inquiries.find(i => i.id === id);
          if (item && body.status) item.status = body.status;
          resolve(item);
        } else if (method === 'DELETE') {
          const id = path.split('/')[2];
          const idx = MOCK.inquiries.findIndex(i => i.id === id);
          if (idx > -1) MOCK.inquiries.splice(idx, 1);
          resolve({ success: true });
        } else {
          resolve(MOCK.inquiries);
        }
      }
    }, 250));
  }

  // ── DOM ──────────────────────────────────────────────────────
  const loginScreen = document.getElementById('loginScreen');
  const adminApp    = document.getElementById('adminApp');
  const loginForm   = document.getElementById('loginForm');
  const loginError  = document.getElementById('loginError');
  const loginBtn    = document.getElementById('loginBtn');
  const logoutBtn   = document.getElementById('logoutBtn');

  // ── AUTH ─────────────────────────────────────────────────────
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    loginBtn.querySelector('.btn-text').hidden = true;
    loginBtn.querySelector('.btn-loading').hidden = false;
    loginBtn.disabled = true;

    try {
      const res = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      SESSION_TOKEN = res.token;
      sessionStorage.setItem('lumina_admin_token', res.token);
      showApp();
    } catch (err) {
      loginError.textContent = err.message || 'Invalid credentials';
    } finally {
      loginBtn.querySelector('.btn-text').hidden = false;
      loginBtn.querySelector('.btn-loading').hidden = true;
      loginBtn.disabled = false;
    }
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('lumina_admin_token');
    SESSION_TOKEN = '';
    adminApp.hidden = true;
    loginScreen.style.display = 'flex';
    toast('Signed out successfully', 'info');
  });

  function showApp() {
    loginScreen.style.display = 'none';
    adminApp.hidden = false;
    loadDashboard();
  }

  // Auto-restore session
  if (SESSION_TOKEN) showApp();

  // ── NAVIGATION ───────────────────────────────────────────────
  document.querySelectorAll('.nav-item, .panel__link').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      if (!view) return;
      switchView(view);
    });
  });

  function switchView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`view-${viewName}`)?.classList.add('active');
    document.querySelector(`.nav-item[data-view="${viewName}"]`)?.classList.add('active');

    if (viewName === 'inquiries') loadInquiries();
    if (viewName === 'portfolio') loadPortfolioAdmin();
    if (viewName === 'blog')      loadBlog();
  }

  // ── DASHBOARD ────────────────────────────────────────────────
  async function loadDashboard() {
    document.getElementById('dashDate').textContent = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

    try {
      const stats = await api('/stats');
      renderStats(stats);
      renderTypeChart(stats.projectTypes);
    } catch (e) { console.error(e); }

    try {
      const { data } = await api('/inquiries?limit=5');
      renderRecentInquiries(data || []);
      const badge = document.getElementById('newBadge');
      const newCount = (data||[]).filter(i => i.status === 'new').length;
      badge.textContent = newCount;
      if (!newCount) badge.style.display = 'none';
    } catch (e) {}
  }

  function renderStats(s) {
    document.getElementById('statsGrid').innerHTML = `
      <div class="stat-card">
        <div class="stat-card__label">Total Inquiries</div>
        <div class="stat-card__value">${s.inquiries.total}</div>
        <div class="stat-card__sub">${s.inquiries.thisMonth} this month</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">New / Unread</div>
        <div class="stat-card__value stat-card__accent">${s.inquiries.new}</div>
        <div class="stat-card__sub">Awaiting response</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">Portfolio Projects</div>
        <div class="stat-card__value">${s.portfolio.total}</div>
        <div class="stat-card__sub">Published live</div>
      </div>
      <div class="stat-card">
        <div class="stat-card__label">Conversion Rate</div>
        <div class="stat-card__value">${s.inquiries.total ? Math.round((s.inquiries.converted / s.inquiries.total) * 100) : 0}%</div>
        <div class="stat-card__sub">${s.inquiries.converted} converted</div>
      </div>
    `;
  }

  function renderRecentInquiries(items) {
    const el = document.getElementById('recentInquiries');
    if (!items.length) { el.innerHTML = '<p style="color:var(--c-muted);font-size:0.85rem;">No inquiries yet.</p>'; return; }
    el.innerHTML = items.slice(0, 5).map(i => `
      <div class="recent-row">
        <div>
          <div class="recent-name">${i.firstName} ${i.lastName}</div>
          <div class="recent-type">${i.projectType}</div>
        </div>
        <span class="status status--${i.status}">${i.status}</span>
      </div>
    `).join('');
  }

  function renderTypeChart(types) {
    const el = document.getElementById('typeChart');
    if (!types || !Object.keys(types).length) { el.innerHTML = '<p style="color:var(--c-muted);font-size:0.82rem;">No data yet.</p>'; return; }
    const max = Math.max(...Object.values(types));
    el.innerHTML = Object.entries(types).sort((a,b) => b[1]-a[1]).map(([k,v]) => `
      <div class="chart-bar-row">
        <span class="chart-bar-label" title="${k}">${k}</span>
        <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(v/max)*100}%"></div></div>
        <span class="chart-bar-count">${v}</span>
      </div>
    `).join('');
  }

  // ── INQUIRIES ────────────────────────────────────────────────
  let allInquiries = [];

  async function loadInquiries() {
    const body = document.getElementById('inquiryBody');
    body.innerHTML = '<tr><td colspan="6" class="loading-cell">Loading…</td></tr>';
    try {
      const res = await api('/inquiries?limit=100');
      allInquiries = res.data || res || [];
      renderInquiryTable(allInquiries);
    } catch (e) {
      body.innerHTML = '<tr><td colspan="6" class="loading-cell">Failed to load inquiries.</td></tr>';
    }
  }

  document.getElementById('inquirySearch')?.addEventListener('input', filterInquiries);
  document.getElementById('statusFilter')?.addEventListener('change', filterInquiries);

  function filterInquiries() {
    const q      = document.getElementById('inquirySearch').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const filtered = allInquiries.filter(i => {
      const matchQ = !q || `${i.firstName} ${i.lastName} ${i.email} ${i.projectType}`.toLowerCase().includes(q);
      const matchS = status === 'all' || i.status === status;
      return matchQ && matchS;
    });
    renderInquiryTable(filtered);
  }

  function renderInquiryTable(items) {
    const body = document.getElementById('inquiryBody');
    if (!items.length) {
      body.innerHTML = '<tr><td colspan="6" class="loading-cell">No inquiries found.</td></tr>';
      return;
    }
    body.innerHTML = items.map(i => `
      <tr>
        <td><strong>${i.firstName} ${i.lastName}</strong></td>
        <td>${i.email}</td>
        <td>${i.projectType}</td>
        <td>${new Date(i.createdAt).toLocaleDateString('en-IN')}</td>
        <td>
          <select class="filter-select" style="padding:4px 8px; font-size:0.75rem;" onchange="window._updateStatus('${i.id}', this.value)">
            ${['new','contacted','converted','closed'].map(s => `<option value="${s}" ${i.status===s?'selected':''}>${s}</option>`).join('')}
          </select>
        </td>
        <td style="display:flex;gap:6px;">
          <button class="btn-secondary" onclick="window._viewInquiry('${i.id}')">View</button>
          <button class="btn-danger" onclick="window._deleteInquiry('${i.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  window._updateStatus = async (id, status) => {
    try {
      await api(`/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
      const item = allInquiries.find(i => i.id === id);
      if (item) item.status = status;
      toast('Status updated', 'success');
    } catch (e) { toast('Failed to update status', 'error'); }
  };

  window._viewInquiry = (id) => {
    const i = allInquiries.find(x => x.id === id);
    if (!i) return;
    openModal(`
      <h2>Inquiry from ${i.firstName} ${i.lastName}</h2>
      <div class="inquiry-detail">
        <div class="detail-row"><span class="label">Name</span><span class="value">${i.firstName} ${i.lastName}</span></div>
        <div class="detail-row"><span class="label">Email</span><span class="value"><a href="mailto:${i.email}">${i.email}</a></span></div>
        <div class="detail-row"><span class="label">Phone</span><span class="value">${i.phone || '—'}</span></div>
        <hr class="detail-divider"/>
        <div class="detail-row"><span class="label">Project</span><span class="value">${i.projectType}</span></div>
        <div class="detail-row"><span class="label">Budget</span><span class="value">${i.budget || 'Not specified'}</span></div>
        <div class="detail-row"><span class="label">Status</span><span class="value"><span class="status status--${i.status}">${i.status}</span></span></div>
        <div class="detail-row"><span class="label">Received</span><span class="value">${new Date(i.createdAt).toLocaleString('en-IN')}</span></div>
        <hr class="detail-divider"/>
        <div class="detail-row"><span class="label">Message</span><span class="value">${i.message}</span></div>
      </div>
    `);
  };

  window._deleteInquiry = async (id) => {
    if (!confirm('Delete this inquiry? This cannot be undone.')) return;
    try {
      await api(`/inquiries/${id}`, { method: 'DELETE' });
      allInquiries = allInquiries.filter(i => i.id !== id);
      renderInquiryTable(allInquiries);
      toast('Inquiry deleted', 'success');
    } catch (e) { toast('Failed to delete', 'error'); }
  };

  // ── PORTFOLIO ADMIN ───────────────────────────────────────────
  let portfolioItems = [];

  async function loadPortfolioAdmin() {
    const el = document.getElementById('portfolioAdmin');
    el.innerHTML = '<div class="loading-cell">Loading…</div>';
    try {
      portfolioItems = await api('/portfolio');
      renderPortfolioAdmin(portfolioItems);
    } catch (e) { el.innerHTML = '<div class="loading-cell">Failed to load.</div>'; }
  }

  function renderPortfolioAdmin(items) {
    const el = document.getElementById('portfolioAdmin');
    el.innerHTML = items.map(item => {
      const gradient = `linear-gradient(135deg, ${(item.palette||['#C4A882','#8B7355'])[0]} 0%, ${(item.palette||['#C4A882','#8B7355'])[1]} 100%)`;
      return `
        <div class="admin-card">
          <div class="admin-card__thumb" style="background:${gradient}; display:flex;align-items:center;justify-content:center;">
            <span style="font-size:1.8rem;opacity:0.2;color:white;">${item.year||''}</span>
          </div>
          <div class="admin-card__body">
            <div class="admin-card__title">${item.title}</div>
            <div class="admin-card__meta">${item.category||''} · ${item.location||''}</div>
            <div class="admin-card__actions">
              <button class="btn-secondary" onclick="window._editPortfolio(${item.id})">Edit</button>
              <button class="btn-danger" onclick="window._deletePortfolio(${item.id})">Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  document.getElementById('addPortfolioBtn')?.addEventListener('click', () => {
    openModal(`
      <h2>Add Portfolio Project</h2>
      <form class="modal-form" id="portfolioForm">
        <div><label>Title</label><input name="title" required placeholder="Project Name"/></div>
        <div><label>Category</label><input name="category" placeholder="Residential"/></div>
        <div><label>Location</label><input name="location" placeholder="Mumbai, Maharashtra"/></div>
        <div><label>Year</label><input name="year" type="number" placeholder="2025"/></div>
        <div><label>Description</label><textarea name="description" rows="3" placeholder="Brief description…"></textarea></div>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" onclick="window._closeModal()">Cancel</button>
          <button type="submit" class="btn-primary">Add Project</button>
        </div>
      </form>
    `);
    document.getElementById('portfolioForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      try {
        await api('/portfolio', { method: 'POST', body: JSON.stringify(data) });
        closeModal();
        loadPortfolioAdmin();
        toast('Project added!', 'success');
      } catch (err) { toast('Failed to add project', 'error'); }
    });
  });

  window._editPortfolio = (id) => {
    const item = portfolioItems.find(p => p.id == id);
    if (!item) return;
    openModal(`
      <h2>Edit Project</h2>
      <form class="modal-form" id="editPortfolioForm">
        <div><label>Title</label><input name="title" value="${item.title||''}"/></div>
        <div><label>Category</label><input name="category" value="${item.category||''}"/></div>
        <div><label>Location</label><input name="location" value="${item.location||''}"/></div>
        <div><label>Year</label><input name="year" type="number" value="${item.year||''}"/></div>
        <div><label>Description</label><textarea name="description" rows="3">${item.description||''}</textarea></div>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" onclick="window._closeModal()">Cancel</button>
          <button type="submit" class="btn-primary">Save Changes</button>
        </div>
      </form>
    `);
    document.getElementById('editPortfolioForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      try {
        await api(`/portfolio/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        closeModal(); loadPortfolioAdmin(); toast('Project updated', 'success');
      } catch (err) { toast('Failed to update', 'error'); }
    });
  };

  window._deletePortfolio = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api(`/portfolio/${id}`, { method: 'DELETE' });
      portfolioItems = portfolioItems.filter(p => p.id != id);
      renderPortfolioAdmin(portfolioItems);
      toast('Project deleted', 'success');
    } catch (e) { toast('Failed to delete', 'error'); }
  };

  // ── BLOG ADMIN ────────────────────────────────────────────────
  let blogPosts = [];

  async function loadBlog() {
    const body = document.getElementById('blogBody');
    body.innerHTML = '<tr><td colspan="5" class="loading-cell">Loading…</td></tr>';
    try {
      blogPosts = await api('/blog');
      renderBlogTable(blogPosts);
    } catch (e) { body.innerHTML = '<tr><td colspan="5" class="loading-cell">Failed to load.</td></tr>'; }
  }

  function renderBlogTable(posts) {
    const body = document.getElementById('blogBody');
    if (!posts.length) { body.innerHTML = '<tr><td colspan="5" class="loading-cell">No blog posts yet.</td></tr>'; return; }
    body.innerHTML = posts.map(p => `
      <tr>
        <td><strong>${p.title}</strong></td>
        <td>${p.category}</td>
        <td>${p.date}</td>
        <td><span class="status status--${p.published ? 'published' : 'draft'}">${p.published ? 'Published' : 'Draft'}</span></td>
        <td style="display:flex;gap:6px;">
          <button class="btn-secondary" onclick="window._editBlog(${p.id})">Edit</button>
          <button class="btn-danger" onclick="window._deleteBlog(${p.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  document.getElementById('addBlogBtn')?.addEventListener('click', () => {
    openModal(`
      <h2>New Blog Post</h2>
      <form class="modal-form" id="blogForm">
        <div><label>Title</label><input name="title" required placeholder="Post title…"/></div>
        <div><label>Category</label><input name="category" placeholder="Design Theory"/></div>
        <div><label>Excerpt</label><textarea name="excerpt" rows="3" placeholder="Brief summary…"></textarea></div>
        <div><label>Read Time</label><input name="readTime" placeholder="5 min"/></div>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" onclick="window._closeModal()">Cancel</button>
          <button type="submit" class="btn-primary">Create Post</button>
        </div>
      </form>
    `);
    document.getElementById('blogForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = { ...Object.fromEntries(fd.entries()), published: false, date: new Date().toLocaleDateString('en-US', { month:'long', year:'numeric' }) };
      try {
        await api('/blog', { method: 'POST', body: JSON.stringify(data) });
        closeModal(); loadBlog(); toast('Post created!', 'success');
      } catch (err) { toast('Failed to create post', 'error'); }
    });
  });

  window._editBlog = (id) => {
    const post = blogPosts.find(p => p.id == id);
    if (!post) return;
    openModal(`
      <h2>Edit Post</h2>
      <form class="modal-form" id="editBlogForm">
        <div><label>Title</label><input name="title" value="${post.title||''}"/></div>
        <div><label>Category</label><input name="category" value="${post.category||''}"/></div>
        <div><label>Excerpt</label><textarea name="excerpt" rows="3">${post.excerpt||''}</textarea></div>
        <div><label>Status</label>
          <select name="published">
            <option value="false" ${!post.published?'selected':''}>Draft</option>
            <option value="true" ${post.published?'selected':''}>Published</option>
          </select>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-secondary" onclick="window._closeModal()">Cancel</button>
          <button type="submit" class="btn-primary">Save Changes</button>
        </div>
      </form>
    `);
    document.getElementById('editBlogForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      data.published = data.published === 'true';
      try {
        await api(`/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) });
        closeModal(); loadBlog(); toast('Post updated', 'success');
      } catch (err) { toast('Failed to update post', 'error'); }
    });
  };

  window._deleteBlog = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api(`/blog/${id}`, { method: 'DELETE' });
      blogPosts = blogPosts.filter(p => p.id != id);
      renderBlogTable(blogPosts);
      toast('Post deleted', 'success');
    } catch (e) { toast('Failed to delete', 'error'); }
  };

  // ── MODAL ─────────────────────────────────────────────────────
  const overlay   = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');

  function openModal(html) {
    modalBody.innerHTML = html;
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }
  window._closeModal = closeModal;

  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ── TOAST ─────────────────────────────────────────────────────
  function toast(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.textContent = message;
    document.getElementById('toastContainer').appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

})();
