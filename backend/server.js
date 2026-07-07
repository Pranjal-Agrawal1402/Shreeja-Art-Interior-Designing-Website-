/**
 * Luminae Interiors — Node.js/Express Backend
 * ──────────────────────────────────────────────
 * Run:  node server.js
 * Port: 3000 (or process.env.PORT)
 *
 * Endpoints:
 *   POST /api/enquiries     — Save contact form submission
 *   GET  /api/enquiries     — List all enquiries (admin)
 *   DELETE /api/enquiries/:id — Remove enquiry
 *   POST /api/subscribers   — Save newsletter subscription
 *   GET  /api/subscribers   — List all subscribers (admin)
 *   DELETE /api/subscribers/:id — Remove subscriber
 *   POST /api/auth/login    — Admin login
 *   GET  /api/health        — Health check
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;
const DB   = path.join(__dirname, 'db.json'); // flat-file JSON store

// ── Middleware ─────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ── Flat-file DB helpers ───────────────────────────────────────
function readDB() {
  if (!fs.existsSync(DB)) return { enquiries: [], subscribers: [] };
  try { return JSON.parse(fs.readFileSync(DB, 'utf8')); }
  catch { return { enquiries: [], subscribers: [] }; }
}
function writeDB(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}
function nextId(arr) {
  return arr.length ? Math.max(...arr.map(i => i.id)) + 1 : 1;
}

// ── Health ─────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// ── Auth ───────────────────────────────────────────────────────
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'luminae2025';

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required.' });
  if (username === ADMIN_USER && password === ADMIN_PASS)
    return res.json({ success: true, token: 'demo-token-' + Date.now() });
  return res.status(401).json({ error: 'Invalid credentials.' });
});

// ── Enquiries ──────────────────────────────────────────────────
app.post('/api/enquiries', (req, res) => {
  const { fname, lname, email, phone, service, budget, message } = req.body || {};
  if (!fname || !lname || !email || !message)
    return res.status(400).json({ error: 'fname, lname, email, and message are required.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Invalid email address.' });

  const db = readDB();
  const entry = { id: nextId(db.enquiries), fname, lname, email, phone: phone || '', service: service || '', budget: budget || '', message, date: new Date().toISOString() };
  db.enquiries.push(entry);
  writeDB(db);
  console.log(`[enquiry] New from ${fname} ${lname} <${email}>`);
  res.status(201).json({ success: true, data: entry });
});

app.get('/api/enquiries', (req, res) => {
  const db = readDB();
  const { search } = req.query;
  let results = db.enquiries;
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(e => JSON.stringify(e).toLowerCase().includes(q));
  }
  res.json({ success: true, count: results.length, data: results.reverse() });
});

app.delete('/api/enquiries/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const before = db.enquiries.length;
  db.enquiries = db.enquiries.filter(e => e.id !== id);
  if (db.enquiries.length === before)
    return res.status(404).json({ error: 'Enquiry not found.' });
  writeDB(db);
  res.json({ success: true, message: `Enquiry ${id} deleted.` });
});

// ── Subscribers ────────────────────────────────────────────────
app.post('/api/subscribers', (req, res) => {
  const { email } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'Valid email required.' });

  const db = readDB();
  if (db.subscribers.find(s => s.email === email))
    return res.status(409).json({ error: 'Already subscribed.' });

  const entry = { id: nextId(db.subscribers), email, date: new Date().toISOString() };
  db.subscribers.push(entry);
  writeDB(db);
  console.log(`[subscriber] New: ${email}`);
  res.status(201).json({ success: true, data: entry });
});

app.get('/api/subscribers', (req, res) => {
  const db = readDB();
  res.json({ success: true, count: db.subscribers.length, data: db.subscribers.reverse() });
});

app.delete('/api/subscribers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const db = readDB();
  const before = db.subscribers.length;
  db.subscribers = db.subscribers.filter(s => s.id !== id);
  if (db.subscribers.length === before)
    return res.status(404).json({ error: 'Subscriber not found.' });
  writeDB(db);
  res.json({ success: true, message: `Subscriber ${id} deleted.` });
});

// ── Catch-all: serve frontend SPA ─────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏠 Luminae Interiors Server`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/health\n`);
});

module.exports = app; // for testing
