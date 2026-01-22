import express from 'express';
import answersController from '../controllers/answers.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateAnswers } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Routes protégées
router.post('/submit', authenticate, validateAnswers, answersController.submit);

export default router;
