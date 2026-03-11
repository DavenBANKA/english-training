import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("❌ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquants.");
    process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
});

const admins = [
    { email: 'contact@conseiluxtraining.com', password: '@conseilux228', full_name: 'Admin Conseilux' },
    { email: 'lionesspretty7@gmail.com', password: 'malikapretty7', full_name: 'Admin Lioness' }
];

async function setupAdmins() {
    console.log("🛡️ Configuration des comptes administrateurs...");

    // Récupérer la liste des utilisateurs pour vérifier s'ils existent
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
        console.error("Erreur, impossible de lister les utilisateurs:", usersError);
        return;
    }

    const existingUsers = usersData.users;

    for (const admin of admins) {
        const existingUser = existingUsers.find(u => u.email === admin.email);

        if (existingUser) {
            console.log(`\n🔄 L'utilisateur ${admin.email} existe déjà. Mise à jour du mot de passe...`);
            const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
                existingUser.id,
                { password: admin.password, user_metadata: { full_name: admin.full_name } }
            );

            if (error) {
                console.error(`❌ Échec de la mise à jour pour ${admin.email}:`, error.message);
            } else {
                console.log(`✅ Mot de passe mis à jour pour ${admin.email}`);
            }
        } else {
            console.log(`\n🆕 Création du compte administrateur ${admin.email}...`);
            const { data, error } = await supabaseAdmin.auth.admin.createUser({
                email: admin.email,
                password: admin.password,
                email_confirm: true,
                user_metadata: { full_name: admin.full_name }
            });

            if (error) {
                console.error(`❌ Échec de la création pour ${admin.email}:`, error.message);
            } else {
                console.log(`✅ Compte créé avec succès pour ${admin.email}`);
            }
        }
    }
}

setupAdmins();
