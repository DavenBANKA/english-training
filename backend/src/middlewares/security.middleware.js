import { logSecurityEvent } from '../config/logger.js';

/**
 * Middleware pour détecter et bloquer les tentatives d'injection SQL
 */
export const detectSQLInjection = (req, res, next) => {
  // Skip SQL injection check for authenticated API routes with legitimate content
  const skipPaths = [
    '/api/answers/submit',
    '/api/writing/analyze',
    '/api/speaking/analyze'
  ];
  
  const currentPath = req.originalUrl || req.path || req.url;
  if (skipPaths.some(path => currentPath.includes(path))) {
    return next();
  }
  
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(--|;|\/\*|\*\/|xp_|sp_)/gi,
    /('|(\\')|(;)|(\-\-)|(\/\*))/gi
  ];
  
  const checkValue = (value) => {
    if (typeof value === 'string') {
      return sqlPatterns.some(pattern => pattern.test(value));
    }
    return false;
  };
  
  const checkObject = (obj) => {
    for (const key in obj) {
      if (checkValue(obj[key]) || (typeof obj[key] === 'object' && checkObject(obj[key]))) {
        return true;
      }
    }
    return false;
  };
  
  if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
    logSecurityEvent('SQL_INJECTION_ATTEMPT', {
      ip: req.ip,
      url: req.originalUrl,
      body: req.body
    });
    
    return res.status(403).json({
      success: false,
      error: 'Requête suspecte détectée'
    });
  }
  
  next();
};

/**
 * Middleware pour détecter les tentatives XSS
 */
export const detectXSS = (req, res, next) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ];
  
  const checkValue = (value) => {
    if (typeof value === 'string') {
      return xssPatterns.some(pattern => pattern.test(value));
    }
    return false;
  };
  
  const checkObject = (obj) => {
    for (const key in obj) {
      if (checkValue(obj[key]) || (typeof obj[key] === 'object' && checkObject(obj[key]))) {
        return true;
      }
    }
    return false;
  };
  
  if (checkObject(req.body) || checkObject(req.query)) {
    logSecurityEvent('XSS_ATTEMPT', {
      ip: req.ip,
      url: req.originalUrl,
      body: req.body
    });
    
    return res.status(403).json({
      success: false,
      error: 'Contenu malveillant détecté'
    });
  }
  
  next();
};

/**
 * Middleware pour limiter la taille des requêtes
 */
export const limitRequestSize = (req, res, next) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > maxSize) {
    logSecurityEvent('REQUEST_TOO_LARGE', {
      ip: req.ip,
      size: req.headers['content-length']
    });
    
    return res.status(413).json({
      success: false,
      error: 'Requête trop volumineuse'
    });
  }
  
  next();
};

/**
 * Middleware pour vérifier l'origine de la requête
 */
export const checkOrigin = (req, res, next) => {
  const origin = req.get('origin');
  const referer = req.get('referer');
  
  // En production, vérifier l'origine
  if (process.env.NODE_ENV === 'production') {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://yourdomain.com'
    ].filter(Boolean);
    
    if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      logSecurityEvent('INVALID_ORIGIN', {
        ip: req.ip,
        origin,
        referer
      });
      
      return res.status(403).json({
        success: false,
        error: 'Origine non autorisée'
      });
    }
  }
  
  next();
};

/**
 * Middleware pour détecter les bots malveillants
 */
export const detectMaliciousBots = (req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  
  const maliciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i
  ];
  
  // Whitelist des bots légitimes
  const legitimateBots = [
    /googlebot/i,
    /bingbot/i,
    /slackbot/i
  ];
  
  const isMalicious = maliciousPatterns.some(pattern => pattern.test(userAgent)) &&
                      !legitimateBots.some(pattern => pattern.test(userAgent));
  
  if (isMalicious && process.env.NODE_ENV === 'production') {
    logSecurityEvent('MALICIOUS_BOT_DETECTED', {
      ip: req.ip,
      userAgent
    });
    
    return res.status(403).json({
      success: false,
      error: 'Accès refusé'
    });
  }
  
  next();
};

/**
 * Middleware pour ajouter des headers de sécurité supplémentaires
 */
export const addSecurityHeaders = (req, res, next) => {
  // Empêcher le clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Empêcher le MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Activer le filtre XSS du navigateur
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Politique de référent stricte
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};
