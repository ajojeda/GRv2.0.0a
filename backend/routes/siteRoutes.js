import express from 'express';
import { getAllSites, createSite, updateSite, deleteSite } from '../controllers/siteController.js';

const router = express.Router();

router.get('/', getAllSites);
router.post('/', createSite);
router.put('/:id', updateSite);
router.delete('/:id', deleteSite);

export default router;
