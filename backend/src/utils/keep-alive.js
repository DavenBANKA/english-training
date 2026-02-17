import logger from '../config/logger.js';

/**
 * Script pour empêcher le serveur Render de s'endormir
 * Effectue un un ping sur l'API et le Frontend toutes les 8 minutes
 * Utilise le fetch natif de Node.js (v18+)
 */
const keepAlive = () => {
    // En mode monolithique, l'URL du backend est la même que le frontend
    const pingUrl = 'https://conseiluxlanguage.org/health';
    const INTERVAL = 8 * 60 * 1000; // 8 minutes

    console.log(`📡 Keep-Alive activé sur : ${pingUrl}`);

    setInterval(async () => {
        try {
            const response = await fetch(pingUrl);
            if (response.ok) {
                console.log(`⏱️ [Keep-Alive] Ping réussi à ${new Date().toLocaleTimeString()}`);
            }
        } catch (error) {
            console.error('❌ [Keep-Alive] Erreur lors du ping:', error.message);
        }
    }, INTERVAL);
};


export default keepAlive;
