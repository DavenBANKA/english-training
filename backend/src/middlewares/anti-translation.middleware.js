/**
 * Middlewares anti-traduction désactivés pour simplification
 */
export const preventTranslation = (req, res, next) => next();
export const addTranslationWarning = (req, res, next) => next();
