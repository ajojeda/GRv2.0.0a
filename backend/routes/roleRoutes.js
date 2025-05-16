// 📁 backend/routes/roleRoutes.js
import express from 'express';
import { getAllRoles } from '../controllers/roleController.js';

const router = express.Router();

// GET /api/roles
router.get('/', getAllRoles);

export default router;
