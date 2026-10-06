const store = require('./store');

const ARTICLES_URL = (process.env.ARTICLES_URL || process.env.ARTICLES_SERVICE_URL || 'http://127.0.0.1:4000').replace(/\/$/, '');
const API_KEY = process.env.ARTICLES_API_KEY || process.env.INTERNAL_KEY || 'dev-key';

const fetchJSON = async (url, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 404) return null;
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error ${res.status}`);
  }
  return res.json();
};

module.exports = {
  async list() {
    try {
      const data = await fetchJSON(`${ARTICLES_URL}/articles`);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('[Web Repo] Error fetching articles list:', e.message);
      return [];
    }
  },

  async get(id) {
    try {
      return await fetchJSON(`${ARTICLES_URL}/articles/${encodeURIComponent(id)}`);
    } catch (e) {
      console.error(`[Web Repo] Error fetching article ${id}:`, e.message);
      return null;
    }
  },

  async create(b) {
    return fetchJSON(`${ARTICLES_URL}/articles`, {
      method: 'POST',
      headers: { 'x-api-key': API_KEY },
      body: JSON.stringify(b)
    });
  },

  async update(id, b) {
    return fetchJSON(`${ARTICLES_URL}/articles/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'x-api-key': API_KEY },
      body: JSON.stringify(b)
    });
  },

  async remove(id) {
    try {
      const res = await fetch(`${ARTICLES_URL}/articles/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'x-api-key': API_KEY }
      });
      return res.ok;
    } catch (e) {
      console.error(`[Web Repo] Error deleting article ${id}:`, e.message);
      return false;
    }
  },

  async image(name) {
    try {
      const res = await fetch(`${ARTICLES_URL}/uploads/${encodeURIComponent(name)}`);
      if (!res.ok) return null;
      const arrayBuffer = await res.arrayBuffer();
      const contentType = res.headers.get('content-type') || 'image/png';
      return { type: contentType, data: Buffer.from(arrayBuffer) };
    } catch (e) {
      console.error(`[Web Repo] Error fetching image ${name}:`, e.message);
      return null;
    }
  },

  async addSubscriber(email) {
    return store.addSubscriber(email);
  },

  async listSubscribers() {
    return store.listSubscribers();
  }
};
