import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware pour gérer les erreurs de validation
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.warn('Validation Errors:', errors.array().map(err => ({
      path: err.path,
      msg: err.msg,
      value: err.value
    })));

    return res.status(400).json({
      success: false,
      error: 'Erreur de validation',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};

/**
 * Validation pour l'inscription
 */
export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'),
  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .withMessage('Le nom contient des caractères invalides'),
  handleValidationErrors
];

/**
 * Validation pour la connexion
 */
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis'),
  handleValidationErrors
];

/**
 * Validation pour les soumissions Writing
 */
export const validateWriting = [
  body('question_id')
    .isUUID()
    .withMessage('ID de question invalide'),
  body('text')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Le texte doit contenir entre 10 et 5000 caractères'),
  handleValidationErrors
];

/**
 * Validation pour les soumissions Speaking
 */
export const validateSpeaking = [
  body('question_id')
    .isUUID()
    .withMessage('ID de question invalide'),
  body('transcript')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La transcription est trop longue'),
  handleValidationErrors
];

/**
 * Validation pour les réponses QCM
 */
export const validateAnswers = [
  body('test_id')
    .notEmpty()
    .withMessage('ID de test requis'),
  body('answers')
    .isArray({ min: 1, max: 100 })
    .withMessage('Le tableau de réponses doit contenir entre 1 et 100 éléments'),
  body('answers.*.question_id')
    .notEmpty()
    .withMessage('ID de question requis'),
  body('answers.*.answer')
    .notEmpty()
    .withMessage('Réponse requise'),
  handleValidationErrors
];

/**
 * Validation pour les paramètres de requête
 */
export const validateQuestionQuery = [
  query('skill')
    .isIn(['reading', 'listening', 'speaking', 'writing'])
    .withMessage('Skill invalide'),
  query('level')
    .optional()
    .isIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    .withMessage('Niveau CECRL invalide'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite invalide (1-100)'),
  handleValidationErrors
];

/**
 * Validation pour les UUID dans les paramètres
 */
export const validateUUID = (paramName) => [
  param(paramName)
    .isUUID()
    .withMessage(`${paramName} invalide`),
  handleValidationErrors
];

/**
 * Sanitization des entrées utilisateur
 */
export const sanitizeInput = (req, res, next) => {
  // Supprimer les propriétés dangereuses
  const dangerousProps = ['__proto__', 'constructor', 'prototype'];

  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    for (const key of Object.keys(obj)) {
      if (dangerousProps.includes(key)) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }

    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);

  next();
};
