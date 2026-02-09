# Déploiement sur Fly.io

## Prérequis

1. Installer Fly CLI:
```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# Ou télécharger depuis: https://fly.io/docs/hands-on/install-flyctl/
```

2. Se connecter à Fly.io:
```bash
fly auth login
```

## Déploiement du Backend

1. Aller dans le dossier backend:
```bash
cd backend
```

2. Créer l'application Fly.io:
```bash
fly apps create english-training-api
```

3. Configurer les variables d'environnement (secrets):
```bash
fly secrets set SUPABASE_URL="your_supabase_url"
fly secrets set SUPABASE_ANON_KEY="your_supabase_anon_key"
fly secrets set SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
fly secrets set GEMINI_API_KEYS="key1,key2,key3,key4"
```

4. Déployer le backend:
```bash
fly deploy
```

5. Vérifier le déploiement:
```bash
fly status
fly logs
```

6. Obtenir l'URL du backend:
```bash
fly info
```
L'URL sera: `https://english-training-api.fly.dev`

## Déploiement du Frontend

1. Aller dans le dossier frontend:
```bash
cd ../frontend
```

2. Mettre à jour l'URL de l'API dans `src/services/api.js`:
```javascript
const API_URL = 'https://english-training-api.fly.dev/api';
```

3. Créer l'application Fly.io:
```bash
fly apps create english-training-web
```

4. Déployer le frontend:
```bash
fly deploy
```

5. Vérifier le déploiement:
```bash
fly status
fly logs
```

6. Obtenir l'URL du frontend:
```bash
fly info
```
L'URL sera: `https://english-training-web.fly.dev`

## Configuration CORS

Assure-toi que le backend autorise les requêtes depuis le domaine frontend.
Dans `backend/src/app.js`, vérifie la configuration CORS:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://english-training-web.fly.dev'
];
```

## Commandes utiles

### Voir les logs en temps réel:
```bash
fly logs -a english-training-api
fly logs -a english-training-web
```

### Redémarrer une application:
```bash
fly apps restart english-training-api
fly apps restart english-training-web
```

### Mettre à jour les secrets:
```bash
fly secrets set KEY=value -a english-training-api
```

### Lister les secrets:
```bash
fly secrets list -a english-training-api
```

### Scaler les ressources (si nécessaire):
```bash
fly scale vm shared-cpu-1x --memory 512 -a english-training-api
```

### Voir le statut:
```bash
fly status -a english-training-api
fly status -a english-training-web
```

### Ouvrir l'application dans le navigateur:
```bash
fly open -a english-training-web
```

## Domaine personnalisé (optionnel)

Pour utiliser ton propre domaine:

```bash
fly certs add yourdomain.com -a english-training-web
```

Puis configure les DNS selon les instructions affichées.

## Coûts

Fly.io offre un plan gratuit avec:
- 3 machines partagées (shared-cpu-1x)
- 256MB RAM par machine
- 3GB de stockage persistant
- 160GB de transfert sortant

Avec la configuration actuelle (auto_stop_machines), les applications s'arrêtent automatiquement quand elles ne sont pas utilisées, ce qui économise les ressources.

## Troubleshooting

### L'application ne démarre pas:
```bash
fly logs -a english-training-api
```

### Problème de connexion à Supabase:
Vérifie que les secrets sont bien configurés:
```bash
fly secrets list -a english-training-api
```

### Problème CORS:
Vérifie que l'URL du frontend est dans la liste des origines autorisées du backend.

### Redéployer après des modifications:
```bash
# Backend
cd backend
fly deploy

# Frontend
cd frontend
fly deploy
```
