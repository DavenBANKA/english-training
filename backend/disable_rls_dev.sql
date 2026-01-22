-- Script pour désactiver RLS en développement
-- Exécuter dans SQL Editor de Supabase

-- ⚠️ ATTENTION: Pour développement uniquement!
-- Ne pas utiliser en production

-- Désactiver RLS sur les tables problématiques
ALTER TABLE speaking_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE writing_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;

-- Vérifier que RLS est désactivé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('speaking_submissions', 'writing_submissions', 'results');

-- rowsecurity devrait être 'false' pour ces 3 tables
