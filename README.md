# 🏠 Luminae Interiors — Website Package

A complete, production-ready interior design website with frontend, admin panel, and backend API.

---

## 📁 Folder Structure

```
luminae-interiors/
├── frontend/              ← Public-facing website
│   ├── index.html         ← Homepage
│   ├── portfolio.html     ← Filterable project gallery
│   ├── services.html      ← Services & pricing
│   ├── about.html         ← Team & studio story
│   ├── contact.html       ← Contact form with validation
│   ├── css/
│   │   ├── main.css       ← Core design system & homepage
│   │   └── pages.css      ← Inner page styles
│   └── js/
│       ├── data.js        ← All site data + localStorage helpers
│       └── main.js        ← Animations, sliders, counters, forms
│
├── admin/                 ← Password-protected admin panel
│   ├── login.html         ← Login screen
│   ├── dashboard.html     ← Stats overview
│   ├── enquiries.html     ← View/search/delete/export enquiries
│   ├── subscribers.html   ← Newsletter subscriber management
│   ├── projects.html      ← Add/remove portfolio projects
│   ├── settings.html      ← Studio info & password change
│   └── css/admin.css      ← Admin panel styles
│
├── backend/               ← Node.js/Express API (optional)
│   ├── server.js          ← REST API server
│   ├── package.json
│   └── db.json            ← Auto-generated flat-file database
│
└── tests/
    ├── test_suite.html    ← Browser-based test runner (50+ tests)
    └── api_tests.js       ← Node.js API test runner
```

---

## 🚀 Quick Start

### Option A — Static Site (No Server Needed)
Just open `frontend/index.html` in a browser. All data persists in `localStorage`.

### Option B — With Backend API
```bash
cd backend
npm install
npm start
# → http://localhost:3000
```

---

## 🔐 Admin Panel

Access: `admin/login.html`

| Credential | Value        |
|------------|--------------|
| Username   | `admin`      |
| Password   | `luminae2025` |

**Features:**
- Dashboard with live counts
- Enquiry management (search, delete, export CSV)
- Subscriber management
- Project CRUD (add/delete)
- Settings & password change

---

## 🧪 Running Tests

**Browser tests (50+ cases):**
Open `tests/test_suite.html` → click **Run All Tests**

**API tests (requires backend running):**
```bash
node tests/api_tests.js
```

---

## 🌐 Hosting Guide

### Netlify / Vercel (Recommended)
1. Upload the `frontend/` folder  
2. Set publish directory to `frontend`  
3. Done — works with no build step

### Traditional Host (cPanel / FTP)
1. Upload `frontend/` to `public_html/`
2. Upload `admin/` to `public_html/admin/`

### With Node.js Backend (VPS / Heroku)
```bash
cd backend && npm install && npm start
```
Set `PORT`, `ADMIN_USER`, `ADMIN_PASS` as environment variables.

---

## ✨ Features

- **Hero** with particle canvas animation  
- **Animated counters** on scroll  
- **Auto-advancing testimonial** slider  
- **Portfolio filter** by category  
- **Contact form** with client-side validation  
- **Newsletter** subscription  
- **Marquee** ticker  
- **Responsive** (mobile-first, 768px breakpoint)  
- **Admin panel** with full CRUD  
- **REST API** with validation and flat-file persistence  

---

© 2025 Luminae Interiors. Built with HTML, CSS, Vanilla JS, and Node.js/Express.
