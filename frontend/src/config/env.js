// Configuration des URLs selon l'environnement
const getApiUrl = () => {
  // En production (Fly.io), utiliser l'URL du backend déployé
  if (import.meta.env.PROD) {
    return 'https://english-training-api.fly.dev/api';
  }
  
  // En développement, utiliser l'URL locale
  return 'http://localhost:3000/api';
};

export const API_BASE_URL = getApiUrl();
