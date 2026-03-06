import logger from '../config/logger.js';

/**
 * Script pour empêcher le serveur Render de s'endormir
 * Effectue un ping sur l'API toutes les 8 minutes
 * Utilise le fetch natif de Node.js (v18+)
 */
const keepAlive = () => {
    // Utiliser l'URL fournie par Render ou fallback vers l'URL configurée
    const pingUrl = process.env.RENDER_EXTERNAL_URL 
        ? `${process.env.RENDER_EXTERNAL_URL}/health`
        : 'https://conseiluxlanguage.org/health';
    
    const INTERVAL = 8 * 60 * 1000; // 8 minutes

    console.log(`📡 Keep-Alive activé sur : ${pingUrl}`);

    setInterval(async () => {
        try {
            const response = await fetch(pingUrl);
            if (response.ok) {
                console.log(`⏱️ [Keep-Alive] Ping réussi à ${new Date().toLocaleTimeString()}`);
            } else {
                console.warn(`⚠️ [Keep-Alive] Status ${response.status}`);
            }
        } catch (error) {
            console.error('❌ [Keep-Alive] Erreur lors du ping:', error.message);
        }
    }, INTERVAL);
};

export default keepAlive;
