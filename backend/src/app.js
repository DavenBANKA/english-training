import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import path from 'path';
import { fileURLToPath } from 'url';

// URL/Path helper
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
import { helmetConfig, globalLimiter, corsOptions } from './config/security.js';
import logger, { requestLogger } from './config/logger.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import questionRoutes from './routes/question.routes.js';
import speakingRoutes from './routes/speaking.routes.js';
import writingRoutes from './routes/writing.routes.js';
import answersRoutes from './routes/answers.routes.js';
import resultsRoutes from './routes/results.routes.js';
import adminRoutes from './routes/admin.routes.js';
import testRoutes from './routes/test.routes.js';

// Middlewares
import { errorHandler, notFound } from './middlewares/error.middleware.js';
import { preventTranslation, addTranslationWarning } from './middlewares/anti-translation.middleware.js';
import { sanitizeInput } from './middlewares/validation.middleware.js';
import {
  detectSQLInjection,
  detectXSS,
  limitRequestSize,
  checkOrigin,
  detectMaliciousBots,
  addSecurityHeaders
} from './middlewares/security.middleware.js';

const app = express();

// 1. Headers de base et compression
app.use(helmetConfig);
app.use(compression());

// 2. Logging des requêtes
app.use(requestLogger);

// 3. Servir les fichiers statiques (AVANT les middlewares de sécurité API)
// Cela évite que CORS ou checkOrigin ne bloquent les images/CSS du site
const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));

// 4. Middlewares de parsing (AVANT le rate limiting ou la validation)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Middlewares de sécurité pour l'API
// On ne les applique qu'aux routes commençant par /api
const apiSecurity = [
  cors(corsOptions),
  globalLimiter,
  detectMaliciousBots,
  checkOrigin,
  limitRequestSize,
  detectSQLInjection,
  detectXSS,
  mongoSanitize(),
  hpp(),
  sanitizeInput,
  addSecurityHeaders,
  preventTranslation,
  addTranslationWarning
];

// Health check (Simple, sans sécurité lourde)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API EFSET opérationnelle',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Création du routeur API
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/test', testRoutes);
apiRouter.use('/questions', questionRoutes);
apiRouter.use('/speaking', speakingRoutes);
apiRouter.use('/writing', writingRoutes);
apiRouter.use('/answers', answersRoutes);
apiRouter.use('/results', resultsRoutes);
apiRouter.use('/admin', adminRoutes);

// Application de la sécurité et des routes API
app.use('/api', apiSecurity, apiRouter);

// Toutes les autres requêtes redirigent vers l'index.html du frontend (pour le SPA routing)
// On ne le fait qu'en production et si ce n'est pas une requête API
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }

  // Servir index.html pour le routing React
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      // Si le fichier n'existe pas, on passe à l'erreur 404
      next();
    }
  });
});

app.use(notFound);
app.use(errorHandler);

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

export default app;
