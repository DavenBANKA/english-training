# 🚀 Déploiement Rapide sur Fly.io

## Installation Fly CLI

```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

## Connexion

```powershell
fly auth login
```

## Déploiement Automatique

### Option 1: Script PowerShell (Recommandé)

```powershell
# Déployer tout
.\deploy.ps1 all

# Déployer uniquement le backend
.\deploy.ps1 backend

# Déployer uniquement le frontend
.\deploy.ps1 frontend
```

### Option 2: Déploiement Manuel

#### Backend

```powershell
cd backend

# Créer l'app (première fois seulement)
fly apps create english-training-api

# Configurer les secrets
fly secrets set SUPABASE_URL="your_supabase_url" -a english-training-api
fly secrets set SUPABASE_ANON_KEY="your_key" -a english-training-api
fly secrets set SUPABASE_SERVICE_ROLE_KEY="your_key" -a english-training-api
fly secrets set GEMINI_API_KEYS="key1,key2,key3" -a english-training-api

# Déployer
fly deploy
```

#### Frontend

```powershell
cd frontend

# Créer l'app (première fois seulement)
fly apps create english-training-web

# Déployer
fly deploy
```

## URLs de Production

- **Frontend**: https://english-training-web.fly.dev
- **Backend**: https://english-training-api.fly.dev
- **API Health**: https://english-training-api.fly.dev/health

## Commandes Utiles

```powershell
# Voir les logs
fly logs -a english-training-api
fly logs -a english-training-web

# Statut des apps
fly status -a english-training-api
fly status -a english-training-web

# Ouvrir dans le navigateur
fly open -a english-training-web

# Redémarrer
fly apps restart english-training-api
fly apps restart english-training-web

# Lister les secrets
fly secrets list -a english-training-api
```

## Configuration Requise

### Variables d'environnement Backend

- `SUPABASE_URL`: URL de ton projet Supabase
- `SUPABASE_ANON_KEY`: Clé anonyme Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Clé service role Supabase
- `GEMINI_API_KEYS`: Clés API Gemini (séparées par des virgules)

### CORS

Le backend est déjà configuré pour accepter les requêtes depuis:
- `https://english-training-web.fly.dev`
- `http://localhost:5173` (développement)

## Coûts

Plan gratuit Fly.io inclut:
- 3 machines partagées
- 256MB RAM par machine
- 3GB stockage
- 160GB transfert/mois

Les machines s'arrêtent automatiquement quand elles ne sont pas utilisées (économie de ressources).

## Troubleshooting

### Erreur de build
```powershell
fly logs -a english-training-api
```

### Problème CORS
Vérifie que l'URL frontend est dans `backend/src/config/security.js`

### Secrets manquants
```powershell
fly secrets list -a english-training-api
```

### Redéployer après modifications
```powershell
cd backend
fly deploy

cd ../frontend
fly deploy
```

## Support

Documentation complète: [DEPLOYMENT_FLYIO.md](./DEPLOYMENT_FLYIO.md)
