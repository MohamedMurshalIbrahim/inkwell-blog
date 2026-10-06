const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { createServer } = require('../server');

let server;
let baseUrl;

const request = (method, pathStr, options = {}) => new Promise((resolve, reject) => {
  const url = new URL(pathStr, baseUrl);
  const req = http.request(url, { method, headers: options.headers || {} }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      let json = null;
      if (res.headers['content-type']?.includes('application/json')) {
        try { json = JSON.parse(data); } catch {}
      }
      resolve({ status: res.statusCode, headers: res.headers, text: data, json });
    });
  });
  req.on('error', reject);
  if (options.body) {
    req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
  }
  req.end();
});

describe('InkWell Flux Integration Tests', () => {
  before(async () => {
    process.env.ADMIN_USER = 'admin';
    process.env.ADMIN_PASS = 'admin123';
    process.env.SESSION_SECRET = 'test-secret';
    process.env.DATA_DIR = path.join(__dirname, 'test_data');

    server = createServer();
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    try {
      fs.rmSync(path.join(__dirname, 'test_data'), { recursive: true, force: true });
    } catch {}
  });

  test('GET /health returns 200 ok', async () => {
    const res = await request('GET', '/health');
    assert.strictEqual(res.status, 200);
    assert.deepStrictEqual(res.json, { status: 'ok' });
  });

  test('GET / returns Flux Landing Page', async () => {
    const res = await request('GET', '/');
    assert.strictEqual(res.status, 200);
    assert.match(res.text, /STOP BLOGGING/);
    assert.match(res.text, /JOIN WAITLIST/);
  });

  test('POST /api/waitlist creates subscriber and GET /waitlist-confirm renders page', async () => {
    const subRes = await request('POST', '/api/waitlist', {
      headers: { 'Content-Type': 'application/json' },
      body: { email: 'creator@example.com' }
    });
    assert.strictEqual(subRes.status, 200);
    assert.strictEqual(subRes.json.ok, true);
    assert.ok(subRes.json.position);

    const pageRes = await request('GET', `/waitlist-confirm?email=${encodeURIComponent('creator@example.com')}&pos=${subRes.json.position}`);
    assert.strictEqual(pageRes.status, 200);
    assert.match(pageRes.text, /YOU'RE ON THE LIST/);
    assert.match(pageRes.text, /creator@example.com/);
  });

  test('GET /library renders Content Library page', async () => {
    const res = await request('GET', '/library');
    assert.strictEqual(res.status, 200);
    assert.match(res.text, /CONTENT[\s\S]*LIBRARY/i);
  });

  test('GET /settings without auth redirects to /admin/login', async () => {
    const res = await request('GET', '/settings');
    assert.strictEqual(res.status, 302);
    assert.strictEqual(res.headers.location, '/admin/login');
  });

  test('GET /editor without auth redirects to /admin/login', async () => {
    const res = await request('GET', '/editor');
    assert.strictEqual(res.status, 302);
    assert.strictEqual(res.headers.location, '/admin/login');
  });

  test('GET /editor with auth renders Pro Article Editor page', async () => {
    const loginRes = await request('POST', '/admin/login', {
      body: 'username=admin&password=admin123',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    assert.strictEqual(loginRes.status, 302);
    const cookie = loginRes.headers['set-cookie'][0];

    const editorRes = await request('GET', '/editor', { headers: { cookie } });
    assert.strictEqual(editorRes.status, 200);
    assert.match(editorRes.text, /PRO ARTICLE EDITOR/);
  });

  test('POST /admin/login & GET /admin renders Dashboard', async () => {
    const loginRes = await request('POST', '/admin/login', {
      body: 'username=admin&password=admin123',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    assert.strictEqual(loginRes.status, 302);
    const cookie = loginRes.headers['set-cookie'][0];

    const adminRes = await request('GET', '/admin', { headers: { cookie } });
    assert.strictEqual(adminRes.status, 200);
    assert.match(adminRes.text, /CREATOR DASHBOARD/);
  });
});
