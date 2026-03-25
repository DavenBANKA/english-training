import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Erreur: SUPABASE_URL ou SUPABASE_ANON_KEY manquant dans le .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function pingSupabase() {
    console.log(`\n🛡️ [Keep-Alive] Tentative de ping Supabase à ${new Date().toLocaleString()}...`);
    
    try {
        // Requête simple sur la table skills (ou n'importe quelle table existante)
        const { data, error } = await supabase.from('skills').select('id').limit(1);
        
        if (error) {
            console.error('❌ Erreur lors du ping:', error.message);
        } else {
            console.log('✅ Ping réussi ! Supabase est active.');
        }
    } catch (err) {
        console.error('❌ Erreur inattendue:', err.message);
    }
}

// Exécuter immédiatement
pingSupabase();

// Si l'utilisateur lance ce script en arrière-plan, il tournera toutes les 24h
// Mais c'est mieux de l'appeler via une tâche CRON ou GitHub Action
const INTERVAL = 24 * 60 * 60 * 1000; // 24 heures (suffisant pour Supabase)

setInterval(pingSupabase, INTERVAL);

console.log('📡 Script Keep-Alive Supabase démarré (24h interval)...');
