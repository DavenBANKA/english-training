// Point d'entrée pour Vercel Serverless
import app from '../src/app.js';

// Wrapper pour gérer les erreurs et retourner toujours du JSON
export default async (req, res) => {
  try {
    // Laisser Express gérer la requête
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    
    // S'assurer de toujours retourner du JSON
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};
