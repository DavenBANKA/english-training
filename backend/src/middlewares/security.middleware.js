/**
 * Middlewares de sécurité désactivés pour simplification
 */
export const detectSQLInjection = (req, res, next) => next();
export const detectXSS = (req, res, next) => next();
export const limitRequestSize = (req, res, next) => next();
export const checkOrigin = (req, res, next) => next();
export const detectMaliciousBots = (req, res, next) => next();
export const addSecurityHeaders = (req, res, next) => next();
