// 📁 backend/routes/authRoutes.js
import express from 'express';
import { login, refreshSession, logout } from '../controllers/authController.js';

const router = express.Router();

// Login route
router.post('/login', login);

// Refresh session route
router.post('/refresh', refreshSession);

// Logout route
router.post('/logout', logout);

export default router;
