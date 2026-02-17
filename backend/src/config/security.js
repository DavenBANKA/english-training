import cors from 'cors';

/**
 * Configuration CORS ultra-simplifiée pour éviter tout blocage
 */
export const corsOptions = {
  origin: true, // Autorise toutes les origines
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// On garde des exports vides pour ne pas casser les imports ailleurs si nécessaire
export const helmetConfig = (req, res, next) => next();
export const globalLimiter = (req, res, next) => next();
export const authLimiter = (req, res, next) => next();
export const aiLimiter = (req, res, next) => next();
export const uploadLimiter = (req, res, next) => next();
