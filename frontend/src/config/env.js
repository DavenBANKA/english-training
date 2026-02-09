// Configuration des URLs selon l'environnement
const getApiUrl = () => {
  // En production Vercel, utiliser l'URL relative (même domaine)
  if (import.meta.env.PROD) {
    // Si déployé sur Vercel avec backend séparé
    return import.meta.env.VITE_API_URL || 'https://english-training-api.vercel.app/api';
  }
  
  // En développement, utiliser l'URL locale
  return 'http://localhost:3000/api';
};

export const API_BASE_URL = getApiUrl();
