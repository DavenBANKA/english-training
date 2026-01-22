import express from 'express';
import resultsController from '../controllers/results.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes protégées
router.get('/me', authenticate, resultsController.getMyResults);
router.post('/calculate', authenticate, resultsController.calculateResult);

export default router;
