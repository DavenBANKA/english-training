# 📋 Prochaines Étapes - Déploiement Fly.io

## ✅ Ce qui a été fait

1. ✅ Configuration Docker pour backend et frontend
2. ✅ Fichiers `fly.toml` pour les deux applications
3. ✅ Configuration CORS mise à jour pour Fly.io
4. ✅ Configuration d'environnement pour l'API URL
5. ✅ Script PowerShell de déploiement automatique
6. ✅ Documentation complète
7. ✅ Code poussé sur GitHub

## 🚀 Pour déployer maintenant

### 1. Installer Fly CLI

```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

Redémarre ton terminal après l'installation.

### 2. Se connecter à Fly.io

```powershell
fly auth login
```

Cela ouvrira ton navigateur pour te connecter (ou créer un compte gratuit).

### 3. Préparer les secrets

Tu auras besoin de ces informations de ton fichier `backend/.env`:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEYS`

### 4. Déployer avec le script

```powershell
.\deploy.ps1 all
```

Le script va:
1. Créer les applications sur Fly.io
2. Te demander de configurer les secrets
3. Déployer le backend
4. Déployer le frontend

### 5. Configurer les secrets manuellement

Quand le script te le demande, exécute:

```powershell
fly secrets set SUPABASE_URL="ton_url" -a english-training-api
fly secrets set SUPABASE_ANON_KEY="ta_clé" -a english-training-api
fly secrets set SUPABASE_SERVICE_ROLE_KEY="ta_clé" -a english-training-api
fly secrets set GEMINI_API_KEYS="clé1,clé2,clé3" -a english-training-api
```

Remplace les valeurs par celles de ton fichier `.env`.

## 🌐 URLs après déploiement

- **Site web**: https://english-training-web.fly.dev
- **API**: https://english-training-api.fly.dev
- **Health check**: https://english-training-api.fly.dev/health

## 📊 Vérifier le déploiement

```powershell
# Voir les logs du backend
fly logs -a english-training-api

# Voir les logs du frontend
fly logs -a english-training-web

# Statut des applications
fly status -a english-training-api
fly status -a english-training-web

# Ouvrir le site dans le navigateur
fly open -a english-training-web
```

## 🔧 Redéployer après modifications

```powershell
# Tout redéployer
.\deploy.ps1 all

# Ou manuellement
cd backend
fly deploy

cd ../frontend
fly deploy
```

## 💰 Coûts

Le plan gratuit Fly.io inclut:
- 3 machines partagées (suffisant pour ton projet)
- 256MB RAM par machine
- 3GB de stockage
- 160GB de transfert/mois

Avec `auto_stop_machines = true`, les apps s'arrêtent quand elles ne sont pas utilisées, donc tu restes dans le plan gratuit.

## 📚 Documentation

- **Guide rapide**: [DEPLOY_QUICK_START.md](./DEPLOY_QUICK_START.md)
- **Guide complet**: [DEPLOYMENT_FLYIO.md](./DEPLOYMENT_FLYIO.md)
- **Docs Fly.io**: https://fly.io/docs/

## ⚠️ Important

1. **Ne commit jamais** tes secrets dans Git
2. Les secrets sont configurés via `fly secrets set`
3. Le fichier `.env` reste local et n'est pas déployé
4. CORS est déjà configuré pour `https://english-training-web.fly.dev`

## 🆘 Besoin d'aide?

Si tu rencontres un problème:

1. Vérifie les logs: `fly logs -a english-training-api`
2. Vérifie les secrets: `fly secrets list -a english-training-api`
3. Redémarre l'app: `fly apps restart english-training-api`
4. Consulte la doc: [DEPLOYMENT_FLYIO.md](./DEPLOYMENT_FLYIO.md)

## 🎯 Checklist de déploiement

- [ ] Fly CLI installé
- [ ] Connecté à Fly.io (`fly auth login`)
- [ ] Secrets préparés (depuis `.env`)
- [ ] Script exécuté (`.\deploy.ps1 all`)
- [ ] Secrets configurés
- [ ] Backend déployé
- [ ] Frontend déployé
- [ ] Health check OK (`https://english-training-api.fly.dev/health`)
- [ ] Site accessible (`https://english-training-web.fly.dev`)

Bonne chance! 🚀
