import express from 'express';
import questionController from '../controllers/question.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { validateQuestionQuery, validateUUID } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Routes protégées
router.get('/', authenticate, validateQuestionQuery, questionController.getQuestions);
router.get('/:id', authenticate, validateUUID('id'), questionController.getQuestionById);

// Routes admin
router.post('/', authenticate, requireAdmin, questionController.createQuestion);

export default router;
