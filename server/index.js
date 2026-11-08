import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { CONFIG } from './config.js';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';
import paymentRoutes from './routes/payments.js';
import bookRoutes from './routes/books.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Ebook On Your Demand Backend API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    aiEngines: ['Antigravity (AGY-v2)', 'Claude 3.5 Sonnet', 'OpenAI Codex / GPT-4o'],
    integrations: ['UPI (SBI)', 'Whop Global Store', 'Firebase Multi-Auth'],
    support: CONFIG.UPI.supportEmail
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/books', bookRoutes);

// In production, serve static built files from dist
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback for SPA routing in Express 5
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Ebook On Your Demand Backend Running. Frontend build pending.');
    }
  });
});

// Start Server
app.listen(CONFIG.PORT, () => {
  console.log(`=======================================================`);
  console.log(`Ebook On Your Demand Backend API running on port ${CONFIG.PORT}`);
  console.log(`Local URL: http://localhost:${CONFIG.PORT}`);
  console.log(`Health Check: http://localhost:${CONFIG.PORT}/api/health`);
  console.log(`Support Email: ${CONFIG.UPI.supportEmail}`);
  console.log(`UPI VPA: ${CONFIG.UPI.vpa}`);
  console.log(`Whop Webhook: http://localhost:${CONFIG.PORT}/api/payments/whop-webhook`);
  console.log(`=======================================================`);
});
