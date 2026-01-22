# Fix RLS Policies - Instructions Finales

## Problème

Les politiques RLS (Row Level Security) de Supabase bloquent les insertions dans:
- `user_answers`
- `speaking_submissions`
- `writing_submissions`
- `results`

## Solution

Exécuter le script SQL qui crée des politiques séparées pour chaque opération (SELECT, INSERT, UPDATE, DELETE).

## Étapes

### 1. Ouvrir Supabase

1. Allez sur votre projet Supabase
2. Cliquez sur **SQL Editor** dans le menu gauche

### 2. Exécuter le Script

1. Copiez **TOUT** le contenu du fichier `fix_all_rls_policies.sql`
2. Collez dans SQL Editor
3. Cliquez sur **Run**

### 3. Vérifier

Vous devriez voir un tableau avec toutes les politiques créées:

```
tablename              | policyname                    | cmd
-----------------------|-------------------------------|--------
user_answers           | user_answers_select_policy    | SELECT
user_answers           | user_answers_insert_policy    | INSERT
user_answers           | user_answers_update_policy    | UPDATE
user_answers           | user_answers_delete_policy    | DELETE
speaking_submissions   | speaking_select_policy        | SELECT
speaking_submissions   | speaking_insert_policy        | INSERT
speaking_submissions   | speaking_update_policy        | UPDATE
speaking_submissions   | speaking_delete_policy        | DELETE
writing_submissions    | writing_select_policy         | SELECT
writing_submissions    | writing_insert_policy         | INSERT
writing_submissions    | writing_update_policy         | UPDATE
writing_submissions    | writing_delete_policy         | DELETE
results                | results_select_policy         | SELECT
results                | results_insert_policy         | INSERT
results                | results_update_policy         | UPDATE
results                | results_delete_policy         | DELETE
```

## Ce que fait le script

1. **Supprime** les anciennes politiques (trop restrictives)
2. **Crée** 4 politiques par table:
   - `SELECT` - Lire ses propres données
   - `INSERT` - Créer ses propres données
   - `UPDATE` - Modifier ses propres données
   - `DELETE` - Supprimer ses propres données

3. Chaque politique vérifie: `auth.uid() = user_id`

## Après l'exécution

Vous pourrez:
- ✅ Soumettre les réponses Reading/Listening
- ✅ Enregistrer et analyser Speaking
- ✅ Soumettre et analyser Writing
- ✅ Calculer et afficher les résultats

## Test

1. Complétez un test complet
2. Vérifiez qu'il n'y a plus d'erreur RLS
3. Vérifiez que les résultats s'affichent

## En cas de problème

Si l'erreur persiste, vérifiez dans Supabase:

1. **Authentication** → **Policies**
2. Sélectionnez chaque table
3. Vérifiez que les 4 politiques existent
4. Vérifiez que RLS est activé (`ENABLE ROW LEVEL SECURITY`)

## Alternative (si le script ne fonctionne pas)

Désactiver temporairement RLS pour le développement:

```sql
ALTER TABLE user_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE writing_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
```

⚠️ **Attention**: Ne pas faire en production!

## Réactiver RLS

```sql
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE speaking_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE writing_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
```
