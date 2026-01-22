# Guide de Déploiement - API EFSET

## 📋 Prérequis

- Node.js 18+ installé
- Compte Supabase actif
- Clé API Gemini (Google AI Studio)
- Serveur de production (VPS, Cloud, etc.)

## 🔧 Configuration Supabase

### 1. Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter les credentials:
   - Project URL
   - Anon/Public Key
   - Service Role Key

### 2. Exécuter le script SQL

Dans l'éditeur SQL de Supabase, exécuter le fichier `database.sql` pour créer toutes les tables.

### 3. Configurer le Storage

1. Créer un bucket `audio-submissions`
2. Configurer les permissions:
   - Public: Non
   - Allowed MIME types: `audio/*`
   - Max file size: 10MB

### 4. Configurer l'authentification

Dans Authentication > Settings:
- Activer Email/Password
- Configurer les URLs de redirection
- Optionnel: Activer OAuth (Google, etc.)

## 🤖 Configuration Gemini AI

1. Aller sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créer une clé API
3. Noter la clé pour le fichier `.env`

## 🚀 Déploiement

### Option 1: VPS (Ubuntu/Debian)

```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cloner le projet
git clone <votre-repo>
cd backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
nano .env  # Éditer avec vos credentials

# Installer PM2 pour la gestion des processus
sudo npm install -g pm2

# Démarrer l'application
pm2 start src/server.js --name efset-api

# Configurer le démarrage automatique
pm2 startup
pm2 save
```

### Option 2: Heroku

```bash
# Installer Heroku CLI
# Puis:
heroku login
heroku create efset-api

# Configurer les variables d'environnement
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key
heroku config:set GEMINI_API_KEY=your_key

# Déployer
git push heroku main
```

### Option 3: Railway

1. Connecter votre repo GitHub
2. Ajouter les variables d'environnement
3. Railway déploie automatiquement

### Option 4: Render

1. Créer un nouveau Web Service
2. Connecter le repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Ajouter les variables d'environnement

## 🔐 Variables d'Environnement Production

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
GEMINI_API_KEY=AIzaSy...
PORT=3000
NODE_ENV=production
```

## 🛡️ Sécurité Production

### 1. Rate Limiting

Installer express-rate-limit:

```bash
npm install express-rate-limit
```

Ajouter dans `app.js`:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite par IP
});

app.use('/api/', limiter);
```

### 2. Helmet (Sécurité headers)

```bash
npm install helmet
```

```javascript
import helmet from 'helmet';
app.use(helmet());
```

### 3. CORS Production

Modifier dans `app.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://votre-frontend.com',
  credentials: true
}));
```

## 📊 Monitoring

### Logs avec PM2

```bash
pm2 logs efset-api
pm2 monit
```

### Monitoring avancé

- Utiliser Sentry pour le tracking d'erreurs
- Configurer des alertes Supabase
- Monitorer l'usage de Gemini API

## 🔄 Mise à jour

```bash
git pull origin main
npm install
pm2 restart efset-api
```

## 🧪 Tests de Production

```bash
# Health check
curl https://votre-api.com/health

# Test authentification
curl -X POST https://votre-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

## 📈 Optimisations

1. **Caching**: Implémenter Redis pour les questions fréquentes
2. **CDN**: Utiliser Cloudflare pour les assets statiques
3. **Database**: Créer des index sur les colonnes fréquemment requêtées
4. **Compression**: Activer gzip dans Express

## 🆘 Troubleshooting

### Erreur de connexion Supabase
- Vérifier les credentials dans `.env`
- Vérifier les politiques RLS

### Erreur Gemini API
- Vérifier la clé API
- Vérifier les quotas/limites

### Performance lente
- Vérifier les logs PM2
- Optimiser les requêtes SQL
- Augmenter les ressources serveur

## 📞 Support

Pour toute question, consulter:
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Gemini](https://ai.google.dev/docs)
- [Documentation Express](https://expressjs.com)
