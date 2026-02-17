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

// 1. Logging et compression
app.use(requestLogger);
app.use(compression());

// 2. CORS (Autorise TOUT pour simplifier)
app.use(cors(corsOptions));

// 3. Servir les fichiers statiques du frontend
const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));

// 4. Parsing des requêtes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API EFSET opérationnelle (Mode Simplifié)',
    timestamp: new Date().toISOString()
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

// Utilisation du routeur avec le préfixe /api (SANS middlewares de sécurité complexes)
app.use('/api', apiRouter);

// Toutes les autres requêtes redirigent vers l'index.html du frontend (pour le SPA routing)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
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
