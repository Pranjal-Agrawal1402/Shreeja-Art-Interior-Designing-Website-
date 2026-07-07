/**
 * Luminae Interiors — Backend API Test Suite
 * Run with: node api_tests.js  (requires server running on localhost:3000)
 * Or use as reference for manual/Postman testing.
 */

const BASE = 'http://localhost:3000/api';

async function request(method, path, body) {
  const res = await fetch(BASE + path, {
    method, headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  return { status: res.status, data };
}

let pass = 0, fail = 0;
function assert(label, condition, detail = '') {
  if (condition) { console.log(`  ✓ PASS  ${label}`); pass++; }
  else           { console.error(`  ✗ FAIL  ${label}${detail ? ' — ' + detail : ''}`); fail++; }
}

async function run() {
  console.log('\n══════════════════════════════════════════');
  console.log('  Luminae Interiors — API Test Suite');
  console.log('══════════════════════════════════════════\n');

  // ── Health ──────────────────────────────────────────────────
  console.log('[1] Health Check');
  const h = await request('GET', '/health');
  assert('GET /health returns 200', h.status === 200);
  assert('health body has status ok', h.data.status === 'ok');
  assert('health body has timestamp', !!h.data.timestamp);

  // ── Auth ────────────────────────────────────────────────────
  console.log('\n[2] Authentication');
  const login = await request('POST', '/auth/login', { username: 'admin', password: 'luminae2025' });
  assert('POST /auth/login with correct creds returns 200', login.status === 200);
  assert('login response has success:true', login.data.success === true);

  const badLogin = await request('POST', '/auth/login', { username: 'admin', password: 'wrong' });
  assert('wrong password returns 401', badLogin.status === 401);
  assert('error message returned', !!badLogin.data.error);

  const noBody = await request('POST', '/auth/login', {});
  assert('empty body returns 400', noBody.status === 400);

  // ── Enquiries ───────────────────────────────────────────────
  console.log('\n[3] Enquiries');
  const enq = await request('POST', '/enquiries', {
    fname: 'Test', lname: 'User', email: 'test@example.com',
    service: 'Full Interior Design', message: 'Test enquiry from automated test.'
  });
  assert('POST /enquiries returns 201', enq.status === 201);
  assert('enquiry has id', typeof enq.data.data?.id === 'number');
  assert('enquiry has date', !!enq.data.data?.date);
  const enqId = enq.data.data?.id;

  const badEnq = await request('POST', '/enquiries', { fname: 'No', email: 'bademail' });
  assert('missing fields returns 400', badEnq.status === 400);

  const badEmail = await request('POST', '/enquiries', { fname:'A', lname:'B', email:'notanemail', message:'x' });
  assert('invalid email returns 400', badEmail.status === 400);

  const list = await request('GET', '/enquiries');
  assert('GET /enquiries returns 200', list.status === 200);
  assert('enquiries list has count', typeof list.data.count === 'number');
  assert('test enquiry appears in list', list.data.data?.some(e => e.id === enqId));

  const search = await request('GET', '/enquiries?search=Test+User');
  assert('search filter works', search.data.data?.some(e => e.fname === 'Test'));

  if (enqId) {
    const del = await request('DELETE', `/enquiries/${enqId}`);
    assert('DELETE /enquiries/:id returns 200', del.status === 200);
    const delAgain = await request('DELETE', `/enquiries/${enqId}`);
    assert('deleting non-existent returns 404', delAgain.status === 404);
  }

  // ── Subscribers ─────────────────────────────────────────────
  console.log('\n[4] Subscribers');
  const sub = await request('POST', '/subscribers', { email: 'newsletter@example.com' });
  assert('POST /subscribers returns 201', sub.status === 201);
  assert('subscriber has id', typeof sub.data.data?.id === 'number');
  const subId = sub.data.data?.id;

  const dupSub = await request('POST', '/subscribers', { email: 'newsletter@example.com' });
  assert('duplicate subscription returns 409', dupSub.status === 409);

  const badSub = await request('POST', '/subscribers', { email: 'notvalid' });
  assert('invalid email returns 400', badSub.status === 400);

  const subs = await request('GET', '/subscribers');
  assert('GET /subscribers returns 200', subs.status === 200);
  assert('test subscriber in list', subs.data.data?.some(s => s.id === subId));

  if (subId) {
    const delSub = await request('DELETE', `/subscribers/${subId}`);
    assert('DELETE /subscribers/:id returns 200', delSub.status === 200);
  }

  // ── Summary ─────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════');
  console.log(`  Results: ${pass} passed, ${fail} failed`);
  console.log('══════════════════════════════════════════\n');
  if (fail > 0) process.exit(1);
}

run().catch(e => { console.error('Runner error:', e.message); process.exit(1); });
