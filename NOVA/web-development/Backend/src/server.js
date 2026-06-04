import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import predictRoutes from './routes/predictRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test koneksi database saat server start
pool.query('SELECT NOW()')
  .then((result) => {
    console.log('Database connected:', result.rows[0]);
  })
  .catch((error) => {
    console.error('Database connection error:', error.message);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', predictRoutes);

// Health check route untuk test deploy
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'NOVA API is running',
  });
});

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    status: 'failed',
    message: 'Resource tidak ditemukan',
  });
});

// Global error handler
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`NOVA API berjalan di port ${port}`);
});