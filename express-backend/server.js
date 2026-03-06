const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the Vue app's dist directory
app.use(express.static(path.join(__dirname, '../vue-frontend/dist')));

// Proxy SWAPI requests
app.use('/api', createProxyMiddleware({
  target: 'https://swapi.py4e.com/api/', // Target the API base path directly
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove '/api' prefix from the request path
  },
  logLevel: 'debug',
  onProxyReq: function(proxyReq, req, res) {
    console.log('Proxy Request:', req.method, req.url);
  },
  onProxyRes: function(proxyRes, req, res) {
    console.log('Proxy Response:', proxyRes.statusCode, proxyRes.statusMessage, req.method, req.url);
  }
}));

// All other requests go to the Vue app (handle SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../vue-frontend/dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
