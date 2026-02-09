# Déploiement sur Vercel

## Avantages de Vercel
- ✅ Gratuit sans carte bancaire
- ✅ Déploiement automatique depuis GitHub
- ✅ HTTPS automatique
- ✅ CDN global
- ✅ Prévisualisation des pull requests

## Prérequis
1. Compte GitHub (déjà fait ✅)
2. Compte Vercel gratuit: https://vercel.com/signup

## Méthode 1: Déploiement via Interface Web (Recommandé)

### Étape 1: Créer un compte Vercel
1. Va sur https://vercel.com/signup
2. Clique sur "Continue with GitHub"
3. Autorise Vercel à accéder à tes repos

### Étape 2: Déployer le Backend

1. Sur le dashboard Vercel, clique sur "Add New" → "Project"
2. Sélectionne le repo `english-training`
3. Configure le projet:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: (laisser vide)
   - **Install Command**: `npm install`

4. Ajoute les variables d'environnement:
   - Clique sur "Environment Variables"
   - Ajoute:
     ```
     NODE_ENV=production
     SUPABASE_URL=ton_url_supabase
     SUPABASE_ANON_KEY=ta_clé
     SUPABASE_SERVICE_ROLE_KEY=ta_clé
     GEMINI_API_KEYS=clé1,clé2,clé3
     ```

5. Clique sur "Deploy"

6. Note l'URL du backend (ex: `https://english-training-api.vercel.app`)

### Étape 3: Déployer le Frontend

1. Sur le dashboard Vercel, clique sur "Add New" → "Project"
2. Sélectionne à nouveau le repo `english-training`
3. Configure le projet:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Ajoute la variable d'environnement:
   ```
   VITE_API_URL=https://english-training-api.vercel.app/api
   ```
   (Remplace par l'URL de ton backend de l'étape 2)

5. Clique sur "Deploy"

6. Ton site sera disponible sur une URL comme: `https://english-training.vercel.app`

## Méthode 2: Déploiement via CLI

### Installation
```powershell
npm install -g vercel
```

### Connexion
```powershell
vercel login
```

### Déployer le Backend
```powershell
cd backend
vercel

# Suivre les instructions:
# - Set up and deploy? Yes
# - Which scope? (ton compte)
# - Link to existing project? No
# - Project name? english-training-api
# - Directory? ./
# - Override settings? No
```

Ajouter les variables d'environnement:
```powershell
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GEMINI_API_KEYS
```

Redéployer:
```powershell
vercel --prod
```

### Déployer le Frontend
```powershell
cd ../frontend
vercel

# Suivre les instructions similaires
```

Ajouter la variable d'environnement:
```powershell
vercel env add VITE_API_URL
# Entrer: https://english-training-api.vercel.app/api
```

Redéployer:
```powershell
vercel --prod
```

## Configuration du Domaine Personnalisé (Optionnel)

1. Va dans les paramètres du projet sur Vercel
2. Clique sur "Domains"
3. Ajoute ton domaine personnalisé
4. Configure les DNS selon les instructions

## Déploiement Automatique

Une fois configuré, chaque push sur GitHub déclenchera automatiquement:
- Un déploiement de prévisualisation pour les branches
- Un déploiement en production pour la branche `main`

## Limites du Plan Gratuit

- 100 GB de bande passante/mois
- Builds illimités
- Domaines personnalisés illimités
- HTTPS automatique
- Pas de limite de temps d'exécution pour les fonctions serverless (mais timeout de 10s par requête)

## Vérification

### Backend
Teste l'API: `https://ton-backend.vercel.app/health`

### Frontend
Ouvre: `https://ton-frontend.vercel.app`

## Mise à Jour

Pour mettre à jour après des modifications:
1. Commit et push sur GitHub
2. Vercel déploie automatiquement

Ou via CLI:
```powershell
cd backend
vercel --prod

cd ../frontend
vercel --prod
```

## Troubleshooting

### Erreur de build
- Vérifie les logs dans le dashboard Vercel
- Assure-toi que toutes les dépendances sont dans `package.json`

### Erreur CORS
- Vérifie que l'URL du frontend est autorisée dans `backend/src/config/security.js`
- Les domaines `.vercel.app` sont déjà autorisés

### Variables d'environnement manquantes
- Va dans Settings → Environment Variables
- Ajoute les variables manquantes
- Redéploie le projet

### Timeout des fonctions
- Les fonctions Vercel ont un timeout de 10s sur le plan gratuit
- Si une requête prend plus de temps, optimise le code ou passe au plan Pro

## Support

- Documentation Vercel: https://vercel.com/docs
- Support: https://vercel.com/support
