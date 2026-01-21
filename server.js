const express = require('express');
const cors = require('cors'); // Add CORS for frontend integration
const path = require('path');
const routes = require('./routes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow frontend to connect (e.g., from HTML file)
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files if needed (e.g., upload your HTML here)

// Routes
app.use('/api', routes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the frontend HTML if placed in /public (optional)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Assuming your HTML is renamed to index.html in public/
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Unity Coin Backend running on http://localhost:${PORT}`);
  console.log(`API endpoints available at /api/dashboard, /api/transactions, etc.`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully');
  process.exit(0);
});
