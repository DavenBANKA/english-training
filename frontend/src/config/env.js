// Configuration des URLs selon l'environnement

export const API_URL = 'http://212.227.79.78:3000';

const getApiUrl = () => {
  // Si variable d'environnement définie, l'utiliser
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // En production, utiliser l'URL du backend défini
  if (import.meta.env.PROD) {
    return `${API_URL}/api`;
  }
  
  // En développement, utiliser l'URL locale
  return 'http://localhost:3000/api';
};

export const API_BASE_URL = getApiUrl();
