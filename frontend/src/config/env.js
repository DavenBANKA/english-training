// Configuration des URLs selon l'environnement
const getApiUrl = () => {
  // 1. Priorité à la variable d'environnement (configurée sur Render)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. Fallbacks de production
  if (import.meta.env.PROD) {
    // Dans un déploiement monolithique, l'API est sur le même domaine
    return '/api';
  }

  // 3. Développement local
  return 'http://localhost:3000/api';
};

export const API_BASE_URL = getApiUrl();
export const API_URL = API_BASE_URL; // Alias pour compatibilité
