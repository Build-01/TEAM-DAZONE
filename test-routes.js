const express = require('express');
const authRoutes = require('./src/routes/auth');
const app = express();
app.use('/api/auth', authRoutes);

console.log('Routes in /api/auth:');
authRoutes.stack.forEach(layer => {
  if (layer.route) {
    console.log(`${Object.keys(layer.route.methods).join(', ').toUpperCase()} ${layer.route.path}`);
  }
});
