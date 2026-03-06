// Configuration des URLs selon l'environnement
const getApiUrl = () => {
  // En production, utiliser l'URL relative (monolithe)
  // Le backend sert le frontend et l'API sur le même domaine
  if (import.meta.env.PROD) {
    return '/api';
  }

  // En développement local
  return 'http://localhost:3000/api';
};

export const API_BASE_URL = getApiUrl();
export const API_URL = API_BASE_URL; // Alias pour compatibilité
