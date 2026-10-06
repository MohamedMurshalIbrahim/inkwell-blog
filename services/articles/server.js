const http = require('http'), store = require('./store'), requireApiKey = require('./middleware/apiKey');
const send = (res, c, o) => { res.writeHead(c, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
const body = (req) => new Promise((ok, no) => { let d = ''; req.on('data', c => { d += c; if (d.length > 8e6) { no(new Error('Request too large')); req.destroy(); } }); req.on('end', () => ok(d)); });
const createServer = () => http.createServer(async (req, res) => {
  try {
    const p = new URL(req.url, 'http://x').pathname, m = req.method; let r;
    if (p === '/health') return send(res, 200, { status: 'ok', service: 'articles' });
    if (m === 'GET' && p === '/articles') return send(res, 200, await store.list());
    if (m === 'GET' && (r = /^\/articles\/([\w-]+)$/.exec(p))) { const a = await store.get(r[1]); return a ? send(res, 200, a) : send(res, 404, { error: 'Not found' }); }
    if (m === 'GET' && (r = /^\/uploads\/([\w.-]+)$/.exec(p))) {
      const i = await store.image(r[1]); if (!i) return send(res, 404, { error: 'Not found' });
      res.writeHead(200, { 'Content-Type': i.type }); return res.end(i.data);
    }
    // everything below changes data, so require the shared secret key using API key middleware
    let apiKeyAuthorized = false;
    requireApiKey(req, res, () => { apiKeyAuthorized = true; });
    if (!apiKeyAuthorized) return;
    try {
      if (m === 'POST' && p === '/articles') return send(res, 201, await store.create(JSON.parse(await body(req))));
      if ((r = /^\/articles\/([\w-]+)$/.exec(p))) {
        if (m === 'PUT') { const a = await store.update(r[1], JSON.parse(await body(req))); return a ? send(res, 200, a) : send(res, 404, { error: 'Not found' }); }
        if (m === 'DELETE') return (await store.remove(r[1])) ? send(res, 200, { ok: true }) : send(res, 404, { error: 'Not found' });
      }
    } catch (e) { return send(res, 400, { error: e.message }); }
    send(res, 404, { error: 'Not found' });
  } catch { send(res, 500, { error: 'Server error' }); }
});
if (require.main === module) createServer().listen(process.env.PORT || 4000, () => console.log('articles up on :' + (process.env.PORT || 4000)));
module.exports = { createServer };