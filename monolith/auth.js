const crypto = require('crypto');

const sign = (v) => 
    crypto
        .createHmac(
            'sha256',
            process.env.SESSION_SECRET || 'default-secret-key-inkwell'
        )
        .update(String(v))
        .digest('hex');

exports.check = (u, p) =>
    Boolean(process.env.ADMIN_USER && process.env.ADMIN_PASS && u === process.env.ADMIN_USER && p === process.env.ADMIN_PASS);

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