# 🚀 Déploiement Monolithique sur Render

## 📋 Architecture

Le backend Express sert le frontend React buildé. Tout passe par un seul service Render.

```
Render Service (Port 3000)
├── Backend API (/api/*)
└── Frontend SPA (/* → index.html)
```

## 🔧 Configuration Render

### 1. Créer un Web Service

1. Aller sur [render.com](https://render.com)
2. Cliquer sur "New +" → "Web Service"
3. Connecter ton repo GitHub

### 2. Configuration du Service

```yaml
Name: english-training
Region: Frankfurt (EU Central)
Branch: main
Root Directory: (laisser vide)
Runtime: Node
Build Command: npm run build:all
Start Command: cd backend && npm start
```

### 3. Variables d'environnement

Ajouter dans l'onglet "Environment" :

```
NODE_ENV=production
PORT=3000
SUPABASE_URL=ton_url_supabase
SUPABASE_ANON_KEY=ta_clé_anon
SUPABASE_SERVICE_ROLE_KEY=ta_clé_service
GEMINI_API_KEYS=clé1,clé2,clé3,clé4
```

## 📦 Scripts de Build

### 1. Ajouter le script de build dans package.json racine

```json
{
  "name": "english-training",
  "version": "1.0.0",
  "scripts": {
    "build:all": "cd frontend && npm ci && npm run build && cd ../backend && npm ci",
    "start": "cd backend && npm start"
  }
}
```

### 2. Le backend sert déjà le frontend

Le fichier `backend/src/app.js` contient déjà :

```javascript
// Servir les fichiers statiques du frontend
const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));

// Toutes les routes non-API redirigent vers index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'));
});
```

## ✅ Checklist de Déploiement

- [ ] Script `build:all` ajouté dans package.json racine
- [ ] Variables d'environnement configurées sur Render
- [ ] Build Command: `npm run build:all`
- [ ] Start Command: `cd backend && npm start`
- [ ] Frontend utilise `/api` (relatif) pour les appels API
- [ ] CORS configuré pour accepter les requêtes du même domaine

## 🔍 Vérification

Après le déploiement :

1. **Health Check** : `https://ton-app.onrender.com/health`
2. **Frontend** : `https://ton-app.onrender.com/`
3. **API** : `https://ton-app.onrender.com/api/questions?skill=reading`

## 🐛 Troubleshooting

### Erreur "Failed to fetch"
- Vérifier que le frontend est bien buildé dans `frontend/dist`
- Vérifier que le backend sert bien les fichiers statiques
- Vérifier que l'API utilise `/api` (relatif)

### Erreur 404 sur les routes React
- Vérifier que le wildcard `app.get('*')` est bien configuré
- Vérifier que `index.html` est bien dans `frontend/dist`

### Variables d'environnement non chargées
- Vérifier qu'elles sont bien configurées dans Render
- Redémarrer le service après modification

## 📊 Logs

Pour voir les logs :
```bash
# Dans le dashboard Render
Onglet "Logs" → Voir les logs en temps réel
```

## 💰 Coûts

Plan gratuit Render :
- 750 heures/mois
- 512 MB RAM
- Service s'endort après 15 min d'inactivité
- Réveil automatique à la première requête (~30s)

## 🎉 Avantages du Monolithe

✅ Un seul service à gérer
✅ Pas de problème CORS
✅ Déploiement simplifié
✅ Moins cher (1 service au lieu de 2)
✅ Pas de configuration d'URL d'API
