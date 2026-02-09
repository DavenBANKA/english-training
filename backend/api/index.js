// Point d'entrée pour Vercel Serverless
// Les variables d'environnement sont déjà chargées par Vercel
let app;
let appError;

// Charger l'app de manière asynchrone pour capturer les erreurs
async function loadApp() {
  try {
    const appModule = await import('../src/app.js');
    app = appModule.default;
    console.log('App loaded successfully');
  } catch (error) {
    console.error('Failed to load app:', error);
    appError = error;
  }
}

// Charger l'app au démarrage
await loadApp();

// Handler Vercel
export default async (req, res) => {
  // Définir le Content-Type par défaut
  res.setHeader('Content-Type', 'application/json');

  // Si l'app n'a pas pu être chargée
  if (appError) {
    console.error('App initialization error:', appError);
    return res.status(500).json({
      success: false,
      error: 'Failed to initialize application',
      message: appError.message,
      stack: appError.stack
    });
  }

  // Si l'app n'est pas encore chargée
  if (!app) {
    return res.status(503).json({
      success: false,
      error: 'Application is loading, please try again'
    });
  }

  try {
    // Laisser Express gérer la requête
    return app(req, res);
  } catch (error) {
    console.error('Request handling error:', error);
    
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      });
    }
  }
};
