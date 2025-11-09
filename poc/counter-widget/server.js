const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3004;

// Enable CORS for all origins (widget needs to be embeddable anywhere)
app.use(cors({
  origin: true,
  credentials: false
}));

// Serve static files from dist directory (built widget)
app.use('/dist', express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    // Set CORS headers for JavaScript files
    if (filePath.endsWith('.js')) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/javascript');
      // Disable caching for development - always serve fresh files
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Serve the configuration page
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Counter Widget Server',
    version: '1.0.0'
  });
});

// Serve configuration page at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🚀 Counter Widget Server Running');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📍 Configuration Page: http://localhost:${PORT}`);
  console.log(`📦 Widget Script: http://localhost:${PORT}/dist/counter-widget.js`);
  console.log(`🌐 Listening on: 0.0.0.0:${PORT} (accessible externally)`);
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('💡 Usage:');
  console.log('  1. Build the widget: npm run build');
  console.log('  2. Visit http://localhost:' + PORT + ' to configure');
  console.log('  3. Copy the generated code snippet');
  console.log('  4. Embed in any website!');
  console.log('');
});
