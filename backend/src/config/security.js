import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

/**
 * Configuration Helmet pour sécuriser les headers HTTP
 */
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://tjvvwjxysbhaylmqukjh.supabase.co', 'https://*.supabase.co'],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
  hidePoweredBy: true
});

/**
 * Rate Limiter Global - Protection contre les attaques par force brute
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par IP
  message: {
    success: false,
    error: 'Trop de requêtes. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip pour les health checks
    return req.path === '/health';
  }
});

/**
 * Rate Limiter Strict pour l'authentification
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max
  message: {
    success: false,
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  },
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate Limiter pour les endpoints IA (Gemini)
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requêtes par minute
  message: {
    success: false,
    error: 'Limite d\'utilisation de l\'IA atteinte. Veuillez patienter.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate Limiter pour les uploads
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 uploads par minute
  message: {
    success: false,
    error: 'Trop d\'uploads. Veuillez patienter.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Configuration CORS sécurisée
 */
export const corsOptions = {
  origin: (origin, callback) => {
    // En développement ou si l'origine est absente (requêtes de base), autoriser
    if (process.env.NODE_ENV === 'development' || !origin) {
      return callback(null, true);
    }

    // Nettoyer l'origine (enlever slash de fin)
    const normalizedOrigin = origin.replace(/\/$/, '');

    // Liste blanche des origines autorisées
    const whitelist = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'http://localhost:4200',
      process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null,
      process.env.BACKEND_URL ? process.env.BACKEND_URL.replace(/\/$/, '') : null
    ].filter(Boolean);

    const isAllowed = whitelist.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(normalizedOrigin);
      return allowed === normalizedOrigin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked] Origin: ${origin} not in whitelist:`, whitelist);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // 24 heures
};
