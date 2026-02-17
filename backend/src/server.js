import app from './app.js';
import keepAlive from './utils/keep-alive.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Activer le ping automatique en production
  if (process.env.NODE_ENV === 'production') {
    keepAlive();
  }
});

