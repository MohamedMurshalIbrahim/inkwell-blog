const crypto = require('crypto');

const sign = (v) => 
    crypto
        .createHmac(
            'sha256',
            process.env.SESSION_SECRET || 'default-secret-key-inkwell'
        )
        .update(String(v))
        .digest('hex');

const adminUser = process.env.ADMIN_USER || 'admin';
const adminPass = process.env.ADMIN_PASS || 'admin123';

exports.check = (u, p) =>
    Boolean(u && p && u === adminUser && p === adminPass);

exports.token = () => { 
    const e = String(Date.now() + 8 * 3600e3);
    return e + '.' + sign(e); 
};

exports.valid = (req) => {
  if (!req || !req.headers) return false;
  const m = /(?:^|; )session=([^;]+)/.exec(req.headers.cookie || '');
  if (!m) return false;
  const parts = m[1].split('.');
  if (parts.length !== 2) return false;
  const [e, s] = parts;
  
  return !!s && s === sign(e) && Date.now() < Number(e);
};