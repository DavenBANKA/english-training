import logger from '../config/logger.js';
import { supabase } from '../config/supabase.js';

/**
 * Script pour empêcher Render et Supabase de s'endormir
 * 1. Ping Render (API) toutes les 8 minutes
 * 2. Ping Supabase (DB) toutes les heures
 */
const keepAlive = () => {
    // 📡 PING RENDER (API)
    const pingUrl = process.env.RENDER_EXTERNAL_URL 
        ? `${process.env.RENDER_EXTERNAL_URL}/health`
        : 'https://nbbc.training/health';
    
    const API_INTERVAL = 8 * 60 * 1000; // 8 minutes

    console.log(`📡 Render Keep-Alive activé sur : ${pingUrl}`);

    setInterval(async () => {
        try {
            const response = await fetch(pingUrl);
            if (response.ok) {
                console.log(`⏱️ [Render-Keep-Alive] Ping réussi à ${new Date().toLocaleTimeString()}`);
            } else {
                console.warn(`⚠️ [Render-Keep-Alive] Status ${response.status}`);
            }
        } catch (error) {
            console.error('❌ [Render-Keep-Alive] Erreur lors du ping:', error.message);
        }
    }, API_INTERVAL);

    // 🛡️ PING SUPABASE (BASE DE DONNÉES)
    // Supabase suspend les projets inactifs après une période prolongée.
    const DB_INTERVAL = 60 * 60 * 1000; // 1 heure

    console.log(`🛡️ Supabase Keep-Alive activé ! (Ping toutes les heures)`);

    setInterval(async () => {
        try {
            // Requête légère sur une table persistante pour maintenir l'activité
            const { data, error } = await supabase.from('skills').select('id').limit(1);
            
            if (error) {
                console.error('❌ [Supabase-Keep-Alive] Erreur lors du ping:', error.message);
            } else {
                console.log(`✅ [Supabase-Keep-Alive] Ping réussi (DB active) à ${new Date().toLocaleTimeString()}`);
            }
        } catch (error) {
            console.error('❌ [Supabase-Keep-Alive] Erreur lors du ping:', error.message);
        }
    }, DB_INTERVAL);
};

export default keepAlive;
