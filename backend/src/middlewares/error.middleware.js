/**
 * Middleware de gestion centralisée des erreurs
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur interne';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Middleware pour les routes non trouvées
 */
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée'
  });
};
