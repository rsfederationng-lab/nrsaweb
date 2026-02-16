import express from 'express';
import cors from 'cors';
import { registerAllRoutes } from './dist/index.js';
import { registerAuthRoutes } from './dist/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['https://nrsa.com.ng', 'https://www.nrsa.com.ng', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Register routes
registerAllRoutes(app);
registerAuthRoutes(app);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend running', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});