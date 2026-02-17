# Déploiement sur Render 🚀

Ce projet est configuré pour être déployé facilement sur [Render](https://render.com) via un fichier `render.yaml` (Blueprint).

## Structure du déploiement
1. **Backend** : Un "Web Service" Node.js qui exécute l'API Express.
2. **Frontend** : Un "Static Site" qui sert les fichiers compilés de Vite.

## Étapes pour déployer

### 1. Préparer votre dépôt Git
Assurez-vous que tous vos changements sont poussés sur GitHub ou GitLab.

### 2. Connecter le Blueprint sur Render
1. Connectez-vous à votre tableau de bord [Render](https://dashboard.render.com).
2. Cliquez sur **"New +"** puis **"Blueprint"**.
3. Connectez votre dépôt Git.
4. Render détectera automatiquement le fichier `render.yaml`.
5. Cliquez sur **"Apply"**.

### 3. Configurer les Variables d'Environnement
Pendant ou après la création, vous devrez remplir les variables suivantes dans le tableau de bord Render :

#### Pour le Backend (`efset-backend`) :
- `SUPABASE_URL` : Votre URL Supabase.
- `SUPABASE_ANON_KEY` : Votre clé anonyme Supabase.
- `SUPABASE_SERVICE_ROLE_KEY` : Votre clé service role Supabase.
- `GEMINI_API_KEYS` : Vos clés API Gemini (séparées par des virgules).
- `FRONTEND_URL` : L'URL finale de votre frontend (ex: `https://efset-frontend.onrender.com`).
- `BACKEND_URL` : L'URL finale de votre backend (ex: `https://efset-backend.onrender.com`). Nécessaire pour le système "Anti-Sommeil".

#### Pour le Frontend (`efset-frontend`) :
- `VITE_API_URL` : L'URL de votre API backend (ex: `https://efset-backend.onrender.com`). **Note : ne pas mettre de '/' à la fin**.

## Notes Importantes
- **CORS** : Le backend utilise la variable `FRONTEND_URL` pour autoriser les requêtes provenant de votre frontend. Assurez-vous qu'elle correspond exactement à l'URL fournie par Render pour le site statique.
- **Port** : Le backend écoute sur le port défini par Render (variable `PORT` automatique).
- **Build** : Le frontend est construit avec `npm run build` dans le dossier `frontend` et servi depuis le dossier `dist`.
