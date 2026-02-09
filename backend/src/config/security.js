import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

/**
 * Configuration Helmet pour sécuriser les headers HTTP
 */
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://tjvvwjxysbhaylmqukjh.supabase.co'],
      fontSrc: ["'self'"],
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
    // Liste blanche des origines autorisées
    const whitelist = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173', // Vite
      'http://localhost:4200', // Angular
      'https://english-training-web.fly.dev', // Frontend Fly.io
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // En développement, autoriser toutes les origines
    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
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
