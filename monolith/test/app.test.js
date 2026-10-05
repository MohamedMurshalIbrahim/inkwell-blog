const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), os = require('os'), path = require('path');
process.env.ADMIN_USER = process.env.ADMIN_USER || 'admin';
process.env.ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-'));   // temp folder, keeps tests clean
const { createServer } = require('../server');
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
const FORM = { 'Content-Type': 'application/x-www-form-urlencoded' };

test('blog lifecycle', async () => {
  const s = createServer().listen(0), b = `http://localhost:${s.address().port}`;
  try {
    assert.match(await (await fetch(b + '/blog')).text(), /No articles/i);                      // starts empty
    assert.strictEqual((await fetch(b + '/admin', { redirect: 'manual' })).status, 302);       // protected
    assert.strictEqual((await fetch(b + '/api/articles', { method: 'POST', body: '{}' })).status, 401);
    const login = await fetch(b + '/admin/login', { method: 'POST', headers: FORM, body: 'username=admin&password=admin123', redirect: 'manual' });
    const cookieHeader = login.headers.get('set-cookie');
    const H = { 'Content-Type': 'application/json', cookie: cookieHeader ? cookieHeader.split(';')[0] : '' };
    const c = await fetch(b + '/api/articles', { method: 'POST', headers: H, body: JSON.stringify({ title: 'Hello', content: 'World', thumbnail: PNG }) });
    assert.strictEqual(c.status, 201); const art = await c.json();
    assert.match(await (await fetch(b + '/blog')).text(), /Hello/);                            // published
    assert.strictEqual((await fetch(b + '/api/articles/' + art.id, { method: 'PUT', headers: H, body: JSON.stringify({ title: 'Edited', content: 'World' }) })).status, 200);
    assert.strictEqual((await fetch(b + '/api/articles/' + art.id, { method: 'DELETE', headers: H })).status, 200);
    assert.match(await (await fetch(b + '/blog')).text(), /No articles/i);                      // deleted
  } finally { s.close(); }
});