# 🔧 Fix Déploiement Render - Connexion Frontend/Backend

## 🚨 Problème

Le frontend essaie de se connecter à `localhost:3000/api` au lieu de l'URL du backend sur Render.

**Erreur** : `Failed to load resource: net::ERR_CONNECTION_REFUSED`

## ✅ Solution

### Option 1 : Configurer la variable d'environnement (Recommandé)

1. **Va sur le dashboard Render de ton service FRONTEND**
2. **Clique sur "Environment"**
3. **Ajoute une nouvelle variable d'environnement** :
   - Key: `VITE_API_URL`
   - Value: `https://TON-BACKEND-URL.onrender.com/api`
   
   Remplace `TON-BACKEND-URL` par l'URL réelle de ton backend Render

4. **Sauvegarde et redéploie le frontend**

### Option 2 : Déploiement Monolithique (Plus Simple)

Au lieu de déployer frontend et backend séparément, déploie-les ensemble :

1. **Supprime le service frontend sur Render**
2. **Garde uniquement le service backend**
3. **Le backend sert déjà le frontend** (configuré dans `backend/src/app.js`)

#### Configuration Render pour déploiement monolithique :

**Build Command:**
```bash
cd frontend && npm install && npm run build && cd ../backend && npm install
```

**Start Command:**
```bash
cd backend && npm start
```

**Environment Variables (Backend uniquement):**
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEYS=key1,key2,key3
NODE_ENV=production
PORT=3000
```

## 🎯 Quelle option choisir ?

### Déploiement Monolithique (Option 2) - RECOMMANDÉ
✅ Plus simple à configurer
✅ Pas de problème CORS
✅ Une seule URL à gérer
✅ Moins cher (1 seul service)
✅ Déjà configuré dans le code

### Déploiement Séparé (Option 1)
✅ Meilleure scalabilité
✅ Frontend et backend indépendants
❌ Configuration CORS nécessaire
❌ 2 services à gérer
❌ Plus complexe

## 📝 Instructions Détaillées - Déploiement Monolithique

### 1. Sur Render Dashboard

1. **Crée un nouveau Web Service** (ou modifie l'existant)
2. **Connecte ton repo GitHub**
3. **Configure** :
   - Name: `english-training`
   - Environment: `Node`
   - Region: `Frankfurt` (ou le plus proche)
   - Branch: `main`
   - Root Directory: `.` (racine)
   
4. **Build Command** :
   ```bash
   cd frontend && npm install && npm run build && cd ../backend && npm install
   ```

5. **Start Command** :
   ```bash
   cd backend && npm start
   ```

6. **Environment Variables** :
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   GEMINI_API_KEYS=AIzaSyC...,AIzaSyD...,AIzaSyE...
   NODE_ENV=production
   PORT=3000
   ```

### 2. Vérification

Une fois déployé, ton application sera accessible sur :
- **Frontend** : `https://english-training.onrender.com`
- **API** : `https://english-training.onrender.com/api`
- **Health Check** : `https://english-training.onrender.com/health`

### 3. Test

```bash
# Test API
curl https://english-training.onrender.com/health

# Devrait retourner :
{
  "success": true,
  "message": "API EFSET opérationnelle (Mode Simplifié)",
  "timestamp": "2024-..."
}
```

## 🔍 Vérifier que ça fonctionne

1. **Ouvre ton site** : `https://english-training.onrender.com`
2. **Ouvre la console du navigateur** (F12)
3. **Essaie de créer un compte**
4. **Tu ne devrais plus voir** : `ERR_CONNECTION_REFUSED`
5. **Tu devrais voir** : Les requêtes vers `/api/auth/register`

## 🐛 Troubleshooting

### Le build échoue
- Vérifie que `frontend/package.json` et `backend/package.json` existent
- Vérifie que les dépendances sont correctes

### Le frontend ne s'affiche pas
- Vérifie que `frontend/dist` est créé pendant le build
- Vérifie que `backend/src/app.js` sert bien les fichiers statiques

### Les requêtes API échouent
- Vérifie les variables d'environnement
- Vérifie les logs Render : Dashboard > Logs
- Vérifie que Supabase est accessible

### CORS errors
- Avec le déploiement monolithique, il ne devrait pas y avoir d'erreurs CORS
- Si tu as des erreurs, vérifie `backend/src/app.js` ligne CORS

## 📚 Ressources

- [Documentation Render](https://render.com/docs)
- [Déploiement Node.js sur Render](https://render.com/docs/deploy-node-express-app)
- [Variables d'environnement Render](https://render.com/docs/environment-variables)

## ✅ Checklist

- [ ] Service Render créé
- [ ] Repo GitHub connecté
- [ ] Build command configuré
- [ ] Start command configuré
- [ ] Variables d'environnement ajoutées
- [ ] Déploiement réussi
- [ ] Health check fonctionne
- [ ] Frontend accessible
- [ ] Création de compte fonctionne
- [ ] Pas d'erreur dans la console

---

**Note** : Le déploiement monolithique est déjà configuré dans ton code. Tu n'as qu'à suivre les instructions ci-dessus !
