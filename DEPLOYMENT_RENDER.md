# Déploiement sur Render (MONOLITHE) 🚀

Le projet est maintenant configuré comme un **Monolithe**. Cela signifie qu'un seul service Render gère à la fois le Frontend et le Backend, ce qui est plus simple et gratuit (1 seul service au lieu de 2).

## Structure du déploiement
- **Service Unique** : Le backend sert les fichiers du frontend après la compilation.
- **Répertoire Racine** : Le déploiement se fait depuis la racine du projet.

## Étapes pour déployer (Nouveau Projet)

### 1. Préparer la Base de Données (INDISPENSABLE)
Si vous créez un nouveau projet Supabase, vous DEVEZ exécuter le script suivant dans votre **SQL Editor** Supabase :
👉 Utilisez le fichier : `backend/FINAL_DATABASE_SETUP.sql`
Ce fichier contient TOUT (Tables, RLS, et les 90 questions Reading/Listening/Speaking/Writing).

### 2. Connecter sur Render
1. Connectez-vous à [Render](https://dashboard.render.com).
2. Cliquez sur **"New +"** puis **"Blueprint"**.
3. Connectez votre dépôt Git.
4. Render détectera le fichier `render.yaml` et créera le service **efset-monolith**.
5. Cliquez sur **"Apply"**.

### 3. Configurer les Variables d'Environnement (SUR RENDER)
Dans le tableau de bord Render, allez dans **Environment** pour votre service et remplissez :

- `SUPABASE_URL` : Votre URL Supabase.
- `SUPABASE_ANON_KEY` : Votre clé Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service role.
- `GEMINI_API_KEYS` : Vos clés Gemini.
- `FRONTEND_URL` : `https://nbbc.training`
- `BACKEND_URL` : `https://nbbc.training` (C'est ce qui active le Ping / Anti-sommeil)
- `NODE_ENV` : Déjà réglé sur `production` par le système.

## Pourquoi vois-je "development" en local ?
Le fichier `.env` local est réglé sur `development` pour vous permettre de tester facilement sur votre ordinateur sans les restrictions de sécurité strictes d'Internet.
**Sur Render, le système force automatiquement `NODE_ENV=production`**, donc ne vous inquiétez pas pour votre fichier local !

## Notes Importantes
- **Keep-Alive** : Le système inclut un mécanisme pour éviter que Render ne mette le serveur en veille (toutes les 14 minutes).
- **Build** : Le build prend environ 2-3 minutes car il compile tout le React avant de lancer le serveur Node.
