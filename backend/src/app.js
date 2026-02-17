import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

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

dotenv.config();

const app = express();

// ============================================
// SÉCURITÉ - Middlewares de base
// ============================================

// Helmet - Sécurisation des headers HTTP
app.use(helmetConfig);

// Compression des réponses
app.use(compression());

// CORS sécurisé
app.use(cors(corsOptions));

// Limite de taille des requêtes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitization contre les injections NoSQL
app.use(mongoSanitize());

// Protection contre HTTP Parameter Pollution
app.use(hpp());

// ============================================
// SÉCURITÉ - Middlewares personnalisés
// ============================================

// Logging des requêtes
app.use(requestLogger);

// Rate limiting global
app.use('/api/', globalLimiter);

// Détection des bots malveillants
app.use(detectMaliciousBots);

// Vérification de l'origine
app.use(checkOrigin);

// Limite de taille des requêtes
app.use(limitRequestSize);

// Détection SQL Injection
app.use(detectSQLInjection);

// Détection XSS
app.use(detectXSS);

// Sanitization des entrées
app.use(sanitizeInput);

// Headers de sécurité supplémentaires
app.use(addSecurityHeaders);

// Empêcher la traduction automatique
app.use(preventTranslation);
app.use(addTranslationWarning);

// ============================================
// ROUTES
// ============================================

// Health check (sans rate limiting)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API EFSET opérationnelle',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Création d'un routeur pour l'API
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/test', testRoutes);
apiRouter.use('/questions', questionRoutes);
apiRouter.use('/speaking', speakingRoutes);
apiRouter.use('/writing', writingRoutes);
apiRouter.use('/answers', answersRoutes);
apiRouter.use('/results', resultsRoutes);
apiRouter.use('/admin', adminRoutes);

// Utilisation du routeur avec le préfixe /api
app.use('/api', apiRouter);


// ============================================
// GESTION DES ERREURS
// ============================================

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
