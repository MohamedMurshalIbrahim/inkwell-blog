const fs = require('fs'), path = require('path'), crypto = require('crypto');
const DIR = () => process.env.DATA_DIR || path.join(__dirname, 'data');
const FILE = () => path.join(DIR(), 'articles.json'), UP = () => path.join(DIR(), 'uploads');
const WAITLIST_FILE = () => path.join(DIR(), 'waitlist.json');

const read = () => { try { return JSON.parse(fs.readFileSync(FILE(), 'utf8')); } catch { return []; } };
const write = (a) => { fs.mkdirSync(UP(), { recursive: true }); fs.writeFileSync(FILE(), JSON.stringify(a, null, 1)); };

const readWaitlist = () => { try { return JSON.parse(fs.readFileSync(WAITLIST_FILE(), 'utf8')); } catch { return []; } };
const writeWaitlist = (w) => { fs.mkdirSync(DIR(), { recursive: true }); fs.writeFileSync(WAITLIST_FILE(), JSON.stringify(w, null, 1)); };

const MIME = { png: 'image/png', jpg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' };

function saveImage(dataUrl) {
  const m = /^data:image\/(png|jpe?g|gif|webp);base64,(.+)$/.exec(dataUrl || '');
  if (!m) throw new Error('Thumbnail must be a PNG, JPG, GIF or WEBP image');
  const name = crypto.randomUUID() + '.' + m[1].replace('jpeg', 'jpg');
  fs.mkdirSync(UP(), { recursive: true });
  fs.writeFileSync(path.join(UP(), name), Buffer.from(m[2], 'base64'));
  return name;
}

const rmImg = (n) => { if (n) try { fs.unlinkSync(path.join(UP(), n)); } catch {} };

const clean = (b) => {
  if (!b || typeof b !== 'object') throw new Error('Title and content are required');
  const title = (b.title || '').trim(), content = (b.content || '').trim();
  if (!title || !content) throw new Error('Title and content are required');
  const status = b.status === 'draft' ? 'draft' : 'published';
  const tags = Array.isArray(b.tags) ? b.tags : (b.tags || '').toString().split(',').map(t => t.trim()).filter(Boolean);
  return { title, summary: (b.summary || '').trim(), content, status, tags };
};

module.exports = {
  async list() { return read().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')); },
  async get(id) {
    const all = read();
    const article = all.find(a => a.id === id);
    if (article) {
      article.views = (article.views || 0) + 1;
      write(all);
    }
    return article || null;
  },
  async create(b) {
    const all = read(), now = new Date().toISOString();
    const x = { id: crypto.randomUUID(), ...clean(b), views: 0, thumbnail: b.thumbnail ? saveImage(b.thumbnail) : null, createdAt: now, updatedAt: now };
    all.push(x); write(all); return x;
  },
  async update(id, b) {
    const all = read(), i = all.findIndex(x => x.id === id); if (i < 0) return null;
    const old = all[i], fields = clean(b); let thumbnail = old.thumbnail;
    if (b.thumbnail) { thumbnail = saveImage(b.thumbnail); rmImg(old.thumbnail); }
    all[i] = { ...old, ...fields, thumbnail, updatedAt: new Date().toISOString() };
    write(all); return all[i];
  },
  async remove(id) {
    const all = read(), a = all.find(x => x.id === id); if (!a) return false;
    rmImg(a.thumbnail); write(all.filter(x => x.id !== id)); return true;
  },
  async image(name) {
    if (!name) return null;
    const ext = (/^[\w-]+\.(png|jpg|gif|webp)$/.exec(name) || [])[1]; if (!ext) return null;
    try { return { type: MIME[ext], data: fs.readFileSync(path.join(UP(), name)) }; } catch { return null; }
  },
  async addSubscriber(email) {
    const em = (email || '').trim().toLowerCase();
    if (!em || !em.includes('@')) throw new Error('Valid email address is required');
    const all = readWaitlist();
    let sub = all.find(s => s.email === em);
    if (!sub) {
      sub = { id: crypto.randomUUID(), email: em, position: all.length + 1420, joinedAt: new Date().toISOString() };
      all.push(sub);
      writeWaitlist(all);
    }
    return sub;
  },
  async listSubscribers() { return readWaitlist(); }
};