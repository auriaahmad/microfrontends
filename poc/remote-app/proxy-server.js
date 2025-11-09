// Simple Express proxy server for remote app
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3003;

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  credentials: true
}));

// Proxy /api requests to backend
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url} -> http://localhost:3002${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[Proxy] Response: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('[Proxy] Error:', err);
    res.status(500).json({ error: 'Proxy error' });
  }
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔄 Proxy server running on http://0.0.0.0:${PORT}`);
  console.log(`   Proxying /api -> http://localhost:3002/api`);
});
