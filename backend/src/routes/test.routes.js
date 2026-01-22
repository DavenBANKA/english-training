import express from 'express';
import testController from '../controllers/test.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Toutes les routes sont protégées
router.post('/start', authenticate, testController.startTest);
router.get('/next-question/:sessionId', authenticate, testController.getNextQuestion);
router.post('/next/:sessionId', authenticate, testController.moveToNext);
router.post('/skip/:sessionId', authenticate, testController.skipQuestion);
router.get('/status/:sessionId', authenticate, testController.getStatus);

export default router;
