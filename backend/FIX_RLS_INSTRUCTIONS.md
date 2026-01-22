# Instructions pour corriger les politiques RLS Supabase

## Problème
Les politiques Row Level Security (RLS) empêchent l'insertion de données via le backend car elles utilisent `auth.uid()` qui n'est pas disponible lors des requêtes via JWT depuis le backend.

## Solution

### Étape 1: Accéder à Supabase
1. Aller sur https://supabase.com
2. Se connecter à votre projet
3. Aller dans **SQL Editor** (dans le menu de gauche)

### Étape 2: Exécuter le script SQL
1. Copier tout le contenu du fichier `fix_rls_policies.sql`
2. Coller dans l'éditeur SQL de Supabase
3. Cliquer sur **Run** (ou appuyer sur Ctrl+Enter)

### Étape 3: Vérifier
1. Aller dans **Table Editor**
2. Sélectionner la table `user_answers`
3. Cliquer sur l'icône de bouclier (RLS) pour voir les politiques
4. Vous devriez voir 4 politiques: select, insert, update, delete

## Ce que fait le script
- Supprime les anciennes politiques trop restrictives
- Crée des politiques séparées pour chaque opération (SELECT, INSERT, UPDATE, DELETE)
- Permet l'insertion via le backend (INSERT WITH CHECK true)
- Garde la sécurité pour la lecture/modification (les utilisateurs ne voient que leurs données)

## Alternative rapide (pour le développement uniquement)
Si vous voulez désactiver temporairement RLS pour tester:

```sql
ALTER TABLE user_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE writing_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
ALTER TABLE test_sessions DISABLE ROW LEVEL SECURITY;
```

⚠️ **ATTENTION**: Ne pas utiliser en production! Cela expose toutes les données.
