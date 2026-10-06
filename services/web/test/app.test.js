const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

process.env.ADMIN_USER = 'admin';
process.env.ADMIN_PASS = 'admin123';
process.env.SESSION_SECRET = 'test-secret';
process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'web-test-'));

const { createServer } = require('../server');

test('blog lifecycle via Web service -> Articles service integration', async () => {
  let articlesServer = null;
  let articlesUrl = process.env.ARTICLES_URL;

  if (!articlesUrl) {
    articlesServer = require('../../articles/server').createServer().listen(0);
    articlesUrl = `http://127.0.0.1:${articlesServer.address().port}`;
    process.env.ARTICLES_URL = articlesUrl;
  }
  if (!process.env.ARTICLES_API_KEY) {
    process.env.ARTICLES_API_KEY = 'dev-key';
  }

  const webServer = createServer().listen(0);
  const webPort = webServer.address().port;

  try {
    const blogRes = await fetch(`http://localhost:${webPort}/blog`);
    assert.strictEqual(blogRes.status, 200);

    const loginRes = await fetch(`http://localhost:${webPort}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'username=admin&password=admin123',
      redirect: 'manual'
    });
    const cookieHeader = loginRes.headers.get('set-cookie');
    assert.ok(cookieHeader);

    const H = { 'Content-Type': 'application/json', cookie: cookieHeader.split(';')[0] };

    const createRes = await fetch(`http://localhost:${webPort}/api/articles`, {
      method: 'POST',
      headers: H,
      body: JSON.stringify({ title: 'Microservice Article', content: 'Distributed System Test' })
    });
    assert.strictEqual(createRes.status, 201);
    const art = await createRes.json();
    assert.ok(art.id);

    const listRes = await fetch(`http://localhost:${webPort}/api/articles`);
    assert.strictEqual(listRes.status, 200);
    const list = await listRes.json();
    assert.ok(list.some(a => a.id === art.id));

    const delRes = await fetch(`http://localhost:${webPort}/api/articles/${art.id}`, {
      method: 'DELETE',
      headers: H
    });
    assert.strictEqual(delRes.status, 200);
  } finally {
    webServer.close();
    if (articlesServer) {
      articlesServer.close();
    }
  }
});
