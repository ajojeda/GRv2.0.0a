import express from 'express';
import { getUserAssignments, createUserAssignment, deleteUserAssignment } from '../controllers/userAssignmentController.js';

const router = express.Router();

router.get('/', getUserAssignments);
router.post('/', createUserAssignment);
router.delete('/:id', deleteUserAssignment);

export default router;
