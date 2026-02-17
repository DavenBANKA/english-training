// Configuration des URLs selon l'environnement
export const API_URL = 'https://unincidentally-pseudopolitic-mandy.ngrok-free.dev';

const getApiUrl = () => {
  // 1. Priorité à la variable d'environnement (configurée sur Render/Vercel)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. Fallbacks de production
  if (import.meta.env.PROD) {
    // Si on est sur Render, l'URL sera injectée via VITE_API_URL
    // Sinon, on utilise l'URL par défaut de l'API
    return 'https://english-training-backend.vercel.app/api';
  }

  // 3. Développement local
  return 'http://localhost:3000/api';
};


export const API_BASE_URL = getApiUrl();
