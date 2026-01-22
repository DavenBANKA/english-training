import express from 'express';
import authController from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authLimiter } from '../config/security.js';
import { validateRegister, validateLogin } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Routes publiques sans rate limiting pour développement
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);

// Routes protégées
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);

export default router;
