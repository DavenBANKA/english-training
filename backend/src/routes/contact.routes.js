import express from 'express';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middlewares/validation.middleware.js';
import logger from '../config/logger.js';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

/**
 * POST /api/contact/course-signup
 * Enregistre une inscription aux cours
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

      // Enregistrer dans la base de données
      const { error } = await supabaseAdmin
        .from('course_signups')
        .insert([{
          first_name: firstName,
          last_name: lastName,
          email: email,
          country: country
        }]);

      if (error) {
        throw error;
      }

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
