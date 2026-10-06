const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'articles-test-'));
process.env.ARTICLES_API_KEY = 'dev-key';

const { createServer } = require('../server');

test("POST /articles requires an API key", async () => {
  const server = createServer().listen(0);
  const port = server.address().port;
  try {
    const response = await fetch(`http://localhost:${port}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Test",
        content: "Hello"
      })
    });

    assert.strictEqual(response.status, 401);
  } finally {
    server.close();
  }
});

test("POST /articles accepts the internal API key", async () => {
  const server = createServer().listen(0);
  const port = server.address().port;
  try {
    const response = await fetch(`http://localhost:${port}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "dev-key"
      },
      body: JSON.stringify({
        title: "Test",
        content: "Hello"
      })
    });

    assert.notEqual(response.status, 401);
  } finally {
    server.close();
  }
});

test("GET /articles is allowed without an API key", async () => {
  const server = createServer().listen(0);
  const port = server.address().port;
  try {
    const response = await fetch(`http://localhost:${port}/articles`);
    assert.strictEqual(response.status, 200);
  } finally {
    server.close();
  }
});
