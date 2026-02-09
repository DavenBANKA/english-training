// Configuration des URLs selon l'environnement
const getApiUrl = () => {
  // Si variable d'environnement définie, l'utiliser
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // En production, utiliser l'URL relative (même domaine)
  if (import.meta.env.PROD) {
    return '/api';
  }
  
  // En développement, utiliser l'URL locale
  return 'http://localhost:3000/api';
};

export const API_BASE_URL = getApiUrl();
