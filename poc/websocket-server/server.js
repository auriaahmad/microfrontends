const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');

// Configuration
const HTTP_PORT = 3002; // Changed to avoid conflict with your remote app
const WS_PORT = 8080;
const JWT_SECRET = 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = 'your-refresh-secret-key';

// Create Express app for HTTP endpoints
const app = express();

// Middleware
app.use(cors({
  origin: '*', 
  credentials: true
}));
app.use(express.json());

// Mock user database
const users = [
  {
    id: 1,
    username: 'telecom_admin',
    email: 'admin@telecom.com',
    password: 'password123', // Plain text for demo (hash in production)
    role: 'admin'
  },
  {
    id: 2,
    username: 'network_engineer',
    email: 'engineer@telecom.com',
    password: 'password123', // Plain text for demo (hash in production)
    role: 'engineer'
  }
];

// Store refresh tokens (in production, use Redis or database)
const refreshTokens = new Set();

// Generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { 
      userId: user.id, 
      username: user.username,
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// ============ AUTH ROUTES ============

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username || u.email === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password (simple comparison for demo - use bcrypt in production)
    const validPassword = password === user.password;
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const { accessToken, refreshToken } = generateTokens(user);
    refreshTokens.add(refreshToken);
    

    
    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Token refresh endpoint
app.post('/api/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
  
  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) {
      refreshTokens.delete(refreshToken);
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    
    refreshTokens.delete(refreshToken);
    refreshTokens.add(newRefreshToken);
    
    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    refreshTokens.delete(refreshToken);
  }
  

  
  res.json({ message: 'Logged out successfully' });
});

// Token validation endpoint (for host apps to verify tokens)
app.post('/api/auth/validate', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        valid: false, 
        error: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' 
      });
    }
    
    res.json({
      valid: true,
      user: decoded
    });
  });
});

// ============ PROTECTED ROUTES ============

// Protected route - User profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({
    user: req.user,
    message: 'This is protected user data'
  });
});

// Protected route - Network data (simulating telecom data)
app.get('/api/network/stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'engineer') {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  
  res.json({
    networkStats: {
      totalCalls: 15420,
      activeConnections: 1250,
      avgLatency: '45ms',
      errorRate: '0.02%',
      timestamp: new Date().toISOString()
    },
    user: req.user
  });
});

// ============ WEBSOCKET SERVER (Your existing implementation) ============

const wss = new WebSocket.Server({ port: WS_PORT });

console.log(`WebSocket server running on port ${WS_PORT}`);

// Your original broadcast function - keeping it as is
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Your original WebSocket connection handler - keeping it exactly as is
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      
      // Broadcast to all other clients
      broadcast(data);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// ============ START HTTP SERVER ============

app.listen(HTTP_PORT, () => {
  console.log(`HTTP Authentication server running on http://localhost:${HTTP_PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/refresh');
  console.log('  POST /api/auth/logout');
  console.log('  POST /api/auth/validate');
  console.log('  GET  /api/user/profile (protected)');
  console.log('  GET  /api/network/stats (protected)');
  console.log('');
  console.log('Test credentials:');
  console.log('  Username: telecom_admin, Password: password123');
  console.log('  Username: network_engineer, Password: password123');
  console.log('');
  console.log('WebSocket counter functionality preserved on port 8080 - completely unchanged');
});