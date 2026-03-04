import express from 'express';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';
import logger from '../config/logger.js';

const router = express.Router();

/**
 * POST /api/contact/course-signup
 * Envoie un email pour une inscription aux cours
 */
router.post(
  '/course-signup',
  [
    body('firstName').trim().notEmpty().withMessage('Le prénom est requis'),
    body('lastName').trim().notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('country').trim().notEmpty().withMessage('Le pays est requis'),
    handleValidationErrors
  ],
  async (req, res) => {
    try {
      const { firstName, lastName, email, country } = req.body;

      // Log de la demande
      logger.info('Nouvelle demande d\'inscription aux cours', {
        firstName,
        lastName,
        email,
        country,
        timestamp: new Date().toISOString()
      });

      // En production, vous pouvez utiliser un service d'email comme:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - Nodemailer avec SMTP
      
      // Pour l'instant, on log juste les informations
      // Le frontend utilisera mailto: pour ouvrir le client email

      res.json({
        success: true,
        message: 'Demande enregistrée avec succès'
      });

    } catch (error) {
      logger.error('Erreur inscription cours:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'enregistrement de la demande'
      });
    }
  }
);

export default router;
