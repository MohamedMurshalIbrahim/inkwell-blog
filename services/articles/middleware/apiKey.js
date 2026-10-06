function requireApiKey(req, res, next) {
  const expectedKey = process.env.ARTICLES_API_KEY || process.env.INTERNAL_KEY || 'dev-key';

  if (!expectedKey) {
    if (res.status && typeof res.status === 'function') {
      return res.status(500).json({ error: "API key is not configured" });
    }
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "API key is not configured" }));
  }

  const providedKey = typeof req.get === 'function' ? req.get("x-api-key") : (req.headers ? req.headers["x-api-key"] : null);

  if (providedKey !== expectedKey) {
    if (res.status && typeof res.status === 'function') {
      return res.status(401).json({ error: "Invalid or missing API key" });
    }
    res.writeHead(401, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "Invalid or missing API key" }));
  }

  if (typeof next === 'function') {
    next();
  }
}

module.exports = requireApiKey;
