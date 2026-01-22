# 🚀 Guide d'Installation Complet - Backend EFSET

## ✅ Ce qui est Déjà Fait

- ✅ Code backend complet
- ✅ Configuration Gemini (4 clés avec rotation)
- ✅ Configuration Supabase (credentials dans .env)
- ✅ Toutes les routes et contrôleurs
- ✅ Services (Gemini, Speaking, Writing, Scoring)
- ✅ Middlewares (Auth, Errors, Anti-translation)
- ✅ Scripts SQL pour les questions (131 questions)
- ✅ Dépendances installées

## 📋 Étapes Restantes

### 1. Configuration Supabase Dashboard

#### A. Activer l'Authentification Email/Password

1. Ouvrir [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet: `tjvvwjxysbhaylmqukjh`
3. Aller dans **Authentication** → **Providers**
4. Vérifier que **Email** est activé
5. Aller dans **Authentication** → **Settings**
6. **Pour les tests:** Désactiver "Confirm email" (Enable email confirmations = OFF)
7. Sauvegarder

#### B. Créer les Tables (Exécuter les Scripts SQL)

1. Aller dans **SQL Editor** dans Supabase
2. Créer une nouvelle query
3. Copier-coller le contenu de `database.sql`
4. Cliquer sur **Run**
5. Répéter pour:
   - `seed_questions.sql` (90 questions Reading)
   - `seed_listening.sql` (26 questions Listening)
   - `seed_speaking_writing.sql` (10 Speaking + 5 Writing)

**Ordre d'exécution:**
```
1. database.sql          ← Tables + Skills
2. seed_questions.sql    ← Questions Reading
3. seed_listening.sql    ← Questions Listening
4. seed_speaking_writing.sql ← Questions Speaking/Writing
```

#### C. Créer le Bucket Storage

1. Aller dans **Storage**
2. Cliquer sur **New bucket**
3. Nom: `audio-submissions`
4. Public: **Non** (privé)
5. Créer

### 2. Démarrer le Serveur

```bash
cd backend
npm run dev
```

**Résultat attendu:**
```
✅ 4 clés Gemini API chargées
🚀 Serveur démarré sur le port 3000
📍 Health check: http://localhost:3000/health
🔐 Environment: development
```

### 3. Tester l'API

#### Test 1: Health Check
```bash
curl http://localhost:3000/health
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "API EFSET opérationnelle",
  "timestamp": "2026-01-21T..."
}
```

#### Test 2: Inscription
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","full_name":"Test User"}'
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": {...},
    "session": {...}
  }
}
```

#### Test 3: Connexion
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

**Réponse attendue:**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "access_token": "eyJhbGc..."
  }
}
```

#### Test 4: Questions (avec token)
```bash
# Remplacer <TOKEN> par le access_token obtenu
curl http://localhost:3000/api/questions?skill=reading&limit=5 \
  -H "Authorization: Bearer <TOKEN>"
```

**Réponse attendue:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question_text": "How old are you? I ________",
      "options": ["a) have 30", "b) have 30 years", ...],
      "correct_answer": "d",
      "difficulty_level": "A1"
    },
    ...
  ]
}
```

## 🔧 Troubleshooting

### Erreur: "Email address is invalid"

**Cause:** Email confirmation activée dans Supabase

**Solution:**
1. Supabase Dashboard → Authentication → Settings
2. Désactiver "Enable email confirmations"
3. Sauvegarder et réessayer

### Erreur: "Missing GEMINI_API_KEYS"

**Cause:** Fichier .env non chargé

**Solution:**
1. Vérifier que `.env` existe dans `/backend`
2. Vérifier que `GEMINI_API_KEYS` est défini
3. Redémarrer le serveur

### Erreur: "relation 'skills' does not exist"

**Cause:** Scripts SQL non exécutés

**Solution:**
1. Exécuter `database.sql` dans Supabase SQL Editor
2. Vérifier que les tables sont créées
3. Exécuter les autres scripts

### Erreur: Port 3000 déjà utilisé

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou changer le port dans .env
PORT=3001
```

## 📊 Vérification Finale

### Checklist Complète

- [ ] Supabase Auth activé (Email/Password)
- [ ] Email confirmation désactivé (pour tests)
- [ ] Script `database.sql` exécuté
- [ ] Script `seed_questions.sql` exécuté
- [ ] Script `seed_listening.sql` exécuté
- [ ] Script `seed_speaking_writing.sql` exécuté
- [ ] Bucket `audio-submissions` créé
- [ ] Serveur démarre sans erreur
- [ ] Health check fonctionne
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Questions récupérées avec succès

### Vérifier les Données

```sql
-- Dans Supabase SQL Editor

-- Vérifier les skills
SELECT * FROM skills;
-- Attendu: 4 lignes (reading, listening, speaking, writing)

-- Compter les questions
SELECT s.name, COUNT(q.id) as total
FROM skills s
LEFT JOIN questions q ON q.skill_id = s.id
GROUP BY s.name;
-- Attendu:
-- reading: 90
-- listening: 26
-- speaking: 10
-- writing: 5
```

## 🎯 Prochaines Étapes

Une fois tous les tests passés:

1. **Tester tous les endpoints** avec Postman/Insomnia
2. **Créer des utilisateurs de test**
3. **Tester le flux complet** (inscription → test → résultats)
4. **Développer le Frontend**
5. **Intégrer Frontend ↔ Backend**
6. **Déployer en production**

## 📞 Support

Si vous rencontrez des problèmes:

1. Vérifier les logs du serveur (console)
2. Vérifier les logs Supabase (Dashboard → Logs)
3. Consulter `TEST_RESULTS.md` pour les erreurs connues
4. Consulter `API_DOCUMENTATION.md` pour les endpoints

## 🎉 Félicitations !

Si tous les tests passent, votre backend EFSET est **100% opérationnel** ! 🚀

Vous avez maintenant:
- ✅ API REST complète
- ✅ Authentification Supabase
- ✅ 131 questions (Reading, Listening, Speaking, Writing)
- ✅ Intégration Gemini AI avec rotation de clés
- ✅ Système de scoring et niveaux CECRL
- ✅ Protection anti-traduction
- ✅ Gestion de sessions de test

**Prêt pour le développement du Frontend !**
