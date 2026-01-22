# 🤖 Activer l'Analyse IA (Speaking & Writing)

## ⚠️ Problème Actuel

Les analyses IA pour Speaking et Writing échouent avec l'erreur:
```
Error: new row violates row-level security policy for table "speaking_submissions"
Error: new row violates row-level security policy for table "writing_submissions"
```

## ✅ Solution: Désactiver RLS en Développement

### Étape 1: Ouvrir Supabase SQL Editor

1. Aller sur [https://supabase.com](https://supabase.com)
2. Sélectionner votre projet
3. Cliquer sur **SQL Editor** dans le menu de gauche
4. Cliquer sur **New Query**

### Étape 2: Exécuter le Script SQL

Copier-coller ce script dans l'éditeur SQL:

```sql
-- Désactiver RLS sur les tables d'analyse IA
ALTER TABLE speaking_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE writing_submissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;

-- Vérifier que RLS est désactivé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('speaking_submissions', 'writing_submissions', 'results');
```

### Étape 3: Cliquer sur "Run"

Le résultat devrait afficher:
```
tablename                | rowsecurity
-------------------------|------------
speaking_submissions     | false
writing_submissions      | false
results                  | false
```

## 🎯 Vérification

Après avoir exécuté le script:

### Test Speaking:
1. Aller sur la page Speaking du test
2. Écouter l'audio
3. Enregistrer votre voix
4. Passer à la question suivante
5. ✅ L'analyse devrait se faire en arrière-plan sans erreur

### Test Writing:
1. Aller sur la page Writing du test
2. Écrire un texte (minimum 10 caractères)
3. Cliquer sur "Soumettre"
4. ✅ Vous devriez être redirigé vers la page de résultats

## 🔍 Comment Ça Marche

### Speaking Analysis Flow:
```
1. Frontend enregistre l'audio (WAV format)
2. Audio envoyé au backend via FormData
3. Backend transcrit l'audio avec Gemini (Speech-to-Text)
4. Backend analyse le texte transcrit avec Gemini
5. Résultats sauvegardés dans speaking_submissions
6. Utilisateur peut continuer immédiatement (analyse en arrière-plan)
```

### Writing Analysis Flow:
```
1. Frontend envoie le texte écrit
2. Backend récupère la question/prompt
3. Backend analyse le texte avec Gemini
4. Résultats sauvegardés dans writing_submissions
5. Redirection vers la page de résultats
```

## 📊 Scores Calculés

### Speaking:
- **Fluency Score** (0-100): Fluidité et naturel
- **Grammar Score** (0-100): Correction grammaticale
- **Vocabulary Score** (0-100): Richesse du vocabulaire
- **Pronunciation Score** (0-100): Qualité de la prononciation
- **Overall Score** (0-100): Score global
- **CEFR Level**: A1, A2, B1, B2, C1, C2

### Writing:
- **Coherence Score** (0-100): Cohérence et organisation
- **Grammar Score** (0-100): Correction grammaticale
- **Vocabulary Score** (0-100): Richesse du vocabulaire
- **Task Achievement Score** (0-100): Réponse au sujet
- **Overall Score** (0-100): Score global
- **CEFR Level**: A1, A2, B1, B2, C1, C2

## 🔧 Configuration Technique

### Gemini API:
- 4 clés API configurées avec rotation automatique
- Transcription audio: `audio/wav` → texte
- Analyse: Prompts EFSET/IELTS experts
- Format de réponse: JSON structuré

### Multer (Upload Audio):
- Formats acceptés: MP3, WAV, OGG, WebM
- Taille max: 10MB
- Stockage: Memory (pas de fichier sur disque)
- Audio envoyé directement à Gemini

### Validation:
- Speaking: question_id (UUID) requis
- Writing: question_id (UUID) + text (10-5000 chars)

## ⚠️ Notes Importantes

1. **RLS désactivé = développement uniquement**
   - En production, il faudra créer des policies RLS appropriées
   
2. **Audio non sauvegardé**
   - L'audio est transcrit puis supprimé (pas de stockage permanent)
   - Seule la transcription est sauvegardée
   
3. **Analyse asynchrone (Speaking)**
   - L'utilisateur peut continuer immédiatement
   - L'analyse se fait en arrière-plan
   
4. **Gemini Rotation**
   - 4 clés API tournent automatiquement
   - Si une clé échoue, passe à la suivante

## 🐛 Dépannage

### Erreur: "Token invalide ou expiré"
- Se déconnecter et se reconnecter

### Erreur: "Format audio non supporté"
- Vérifier que le navigateur enregistre en WAV/WebM
- Tester avec un autre navigateur

### Erreur: "Erreur lors de l'analyse"
- Vérifier les logs backend: `backend/logs/error.log`
- Vérifier que les clés Gemini sont valides dans `.env`

### Analyse ne se lance pas
- Vérifier que RLS est bien désactivé (voir Étape 2)
- Redémarrer le backend: `node src/server.js`

## 📝 Fichiers Modifiés

- ✅ `backend/src/services/speaking.service.js` - Analyse audio sans upload
- ✅ `backend/src/services/writing.service.js` - Validation relaxée (10 chars min)
- ✅ `backend/src/services/gemini.service.js` - Transcription + analyse
- ✅ `backend/src/controllers/speaking.controller.js` - Endpoint analyze
- ✅ `backend/src/controllers/writing.controller.js` - Endpoint analyze
- ✅ `backend/src/routes/speaking.routes.js` - Multer configuré
- ✅ `backend/src/middlewares/validation.middleware.js` - Validations
- ✅ `frontend/src/pages/TestSpeaking.jsx` - Enregistrement + envoi
- ✅ `frontend/src/pages/TestWriting.jsx` - Soumission texte

## 🎉 Résultat Final

Une fois RLS désactivé:
- ✅ Speaking: Enregistrement → Transcription → Analyse → Scores
- ✅ Writing: Texte → Analyse → Scores → Page résultats
- ✅ Résultats: Affichage des 4 scores + niveau CEFR + nom complet
