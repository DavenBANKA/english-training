import express from 'express';
import writingController from '../controllers/writing.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { aiLimiter } from '../config/security.js';
import { validateWriting } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Routes protégées avec rate limiting IA
router.post('/analyze', authenticate, aiLimiter, validateWriting, writingController.analyze);
router.get('/submissions', authenticate, writingController.getSubmissions);

export default router;
