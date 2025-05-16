// 📁 backend/server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import poolPromise from './utils/db.js';

// Load environment variables
dotenv.config();

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/auth', authRoutes);

// Server start
app.listen(3000, async () => {
  console.log('✅ Server running on port 3000');
  try {
    await poolPromise;
    console.log('✅ Connected to SQL Server');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
});
