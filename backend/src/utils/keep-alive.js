import logger from '../config/logger.js';

/**
 * Script pour empêcher le serveur Render de s'endormir
 * Effectue un ping sur l'API et le Frontend toutes les 8 minutes
 * Utilise le fetch natif de Node.js (v18+)
 */
const keepAlive = () => {
    const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
    const FRONTEND_URL = process.env.FRONTEND_URL;

    const INTERVAL = 8 * 60 * 1000; // 8 minutes

    console.log(`📡 Keep-Alive activé : pings programmés toutes les 8 minutes.`);

    setInterval(async () => {
        try {
            // 1. Ping du Backend
            const backendResponse = await fetch(`${BACKEND_URL}/health`);
            if (backendResponse.ok) {
                console.log(`⏱️ [Keep-Alive] Backend pingé avec succès à ${new Date().toLocaleTimeString()}`);
            }

            // 2. Ping du Frontend (si configuré)
            if (FRONTEND_URL) {
                const frontendResponse = await fetch(FRONTEND_URL);
                if (frontendResponse.ok) {
                    console.log(`⏱️ [Keep-Alive] Frontend pingé avec succès à ${new Date().toLocaleTimeString()}`);
                }
            }
        } catch (error) {
            console.error('❌ [Keep-Alive] Erreur lors du ping:', error.message);
        }
    }, INTERVAL);
};

export default keepAlive;
