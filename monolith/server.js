const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const http = require('http'), qs = require('querystring');
const repo = require('./repo'), auth = require('./auth'), v = require('./views'), mailer = require('./mailer');

const body = (req) => new Promise((ok, no) => {
  let d = '';
  req.on('data', c => {
    d += c;
    if (d.length > 8e6) {
      no(new Error('Request too large'));
      req.destroy();
    }
  });
  req.on('end', () => ok(d));
  req.on('error', (err) => no(err));
});

const page = (res, code, html, h = {}) => { res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8', ...h }); res.end(html); };
const json = (res, code, o) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
const redirect = (res, to, h = {}) => { res.writeHead(302, { Location: to, ...h }); res.end(); };

const createServer = () => http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x'), p = url.pathname, m = req.method, admin = auth.valid(req);
    let r;

    if (p === '/health') return json(res, 200, { status: 'ok' });
    if (p === '/') return page(res, 200, v.landing());
    
    if (p === '/waitlist-confirm') {
      const email = url.searchParams.get('email') || '';
      const pos = url.searchParams.get('pos') || 1420;
      return page(res, 200, v.waitlistConfirm(email, pos));
    }

    if (p === '/blog') return page(res, 200, v.blog(await repo.list()));
    if ((r = /^\/blog\/([\w-]+)$/.exec(p))) {
      const a = await repo.get(r[1]);
      return a ? page(res, 200, v.article(a)) : page(res, 404, v.notFound());
    }

    if (p === '/library') {
      const statusFilter = url.searchParams.get('status') || 'all';
      let articles = await repo.list();
      if (statusFilter === 'published') articles = articles.filter(a => (a.status || 'published') === 'published');
      if (statusFilter === 'draft') articles = articles.filter(a => a.status === 'draft');
      return page(res, 200, v.library(articles, statusFilter));
    }

    if (p === '/settings') {
      if (!admin) return redirect(res, '/admin/login');
      return page(res, 200, v.settings());
    }
    if (p === '/editor') {
      if (!admin) return redirect(res, '/admin/login');
      const editId = url.searchParams.get('edit');
      return page(res, 200, v.editor(editId ? await repo.get(editId) : null));
    }

    if ((r = /^\/uploads\/([\w.-]+)$/.exec(p))) {
      const i = await repo.image(r[1]);
      if (!i) return page(res, 404, v.notFound());
      res.writeHead(200, { 'Content-Type': i.type });
      return res.end(i.data);
    }

    if (p === '/admin/login') {
      if (m === 'POST') {
        const f = qs.parse(await body(req));
        if (auth.check(f.username, f.password)) {
          return redirect(res, '/admin', { 'Set-Cookie': `session=${auth.token()}; HttpOnly; Path=/; SameSite=Strict; Max-Age=28800` });
        }
        return page(res, 401, v.login('Invalid username or password'));
      }
      return admin ? redirect(res, '/admin') : page(res, 200, v.login());
    }

    if (p === '/admin/logout') return redirect(res, '/admin/login', { 'Set-Cookie': 'session=; Path=/; Max-Age=0' });

    if (p === '/admin') {
      if (!admin) return redirect(res, '/admin/login');
      const editId = url.searchParams.get('edit');
      const articles = await repo.list();
      const subscribers = await repo.listSubscribers();
      const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);
      return page(res, 200, v.admin(articles, editId ? await repo.get(editId) : null, { subscribersCount: subscribers.length + 1420, totalViews }));
    }

    if (p.startsWith('/api/')) {
      if (m === 'POST' && p === '/api/waitlist') {
        try {
          const payload = JSON.parse(await body(req));
          const sub = await repo.addSubscriber(payload.email);
          mailer.sendWaitlistEmail(sub.email, sub.position).catch(err => console.error('[Mailer] Async send error:', err));
          return json(res, 200, { ok: true, position: sub.position, email: sub.email });
        } catch (e) {
          return json(res, 400, { error: e.message });
        }
      }

      if (m === 'GET' && p === '/api/articles') return json(res, 200, await repo.list());

      const articleIdMatch = /^\/api\/articles\/([\w-]+)$/.exec(p);
      const id = articleIdMatch ? articleIdMatch[1] : null;

      if (m === 'GET' && id) {
        const a = await repo.get(id);
        return a ? json(res, 200, a) : json(res, 404, { error: 'Not found' });
      }

      if (!admin) return json(res, 401, { error: 'Unauthorized' });

      try {
        if (m === 'POST' && p === '/api/articles') return json(res, 201, await repo.create(JSON.parse(await body(req))));
        if (m === 'PUT' && id) { const a = await repo.update(id, JSON.parse(await body(req))); return a ? json(res, 200, a) : json(res, 404, { error: 'Not found' }); }
        if (m === 'DELETE' && id) return (await repo.remove(id)) ? json(res, 200, { ok: true }) : json(res, 404, { error: 'Not found' });
      } catch (e) { return json(res, 400, { error: e.message }); }

      return json(res, 404, { error: 'Not found' });
    }

    page(res, 404, v.notFound());
  } catch (err) {
    json(res, 500, { error: 'Server error' });
  }
});

if (require.main === module) {
  const srv = createServer();
  let port = Number(process.env.PORT) || 8080;

  srv.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is in use. Trying port ${port + 1}...`);
      port++;
      srv.listen(port);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  srv.listen(port, () => console.log('blog up on :' + port));
}

module.exports = { createServer };