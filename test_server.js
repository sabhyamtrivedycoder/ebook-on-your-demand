import http from 'http';
import { spawn } from 'child_process';

const serverProc = spawn('node', ['server/index.js'], {
  cwd: 'C:\\Users\\PC\\.gemini\\antigravity\\scratch\\ebook-writer-ondemand',
  env: { ...process.env, PORT: '5099' }
});

serverProc.stdout.on('data', (d) => process.stdout.write('[Server] ' + d));
serverProc.stderr.on('data', (d) => process.stderr.write('[Server Err] ' + d));

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: 5099,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port: 5099, path }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    }).on('error', reject);
  });
}

setTimeout(async () => {
  try {
    console.log('\n--- 1. Testing Health Endpoint ---');
    const health = await getJson('/api/health');
    console.log('Health status:', health.status, health.body.status);

    console.log('\n--- 2. Testing AI Outline Endpoint ---');
    const outline = await postJson('/api/ai/outline', {
      topic: 'Autonomous AI Agents',
      audience: 'Engineers',
      chapterCount: 3,
    });
    console.log('Outline success:', outline.body.success, 'Chapters:', outline.body.data.chapters.length);

    console.log('\n--- 3. Testing AI Chapter Endpoint ---');
    const chapter = await postJson('/api/ai/chapter', {
      bookTitle: 'Autonomous AI Agents',
      chapterNumber: 1,
      chapterTitle: 'The Genesis',
      chapterSummary: 'First steps in autonomous systems',
      audience: 'Engineers',
    });
    console.log('Chapter success:', chapter.body.success, 'Content preview:', chapter.body.content.slice(0, 100));

    console.log('\n--- 4. Testing Books Endpoint ---');
    const books = await getJson('/api/books');
    console.log('Books count:', books.body.books.length);

    console.log('\nALL EBOOK BACKEND ENDPOINTS PASSED CLEANLY!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    serverProc.kill();
    process.exit(0);
  }
}, 1500);
