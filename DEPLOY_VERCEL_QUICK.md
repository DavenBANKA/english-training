# Déploiement Rapide sur Vercel

## 1. Créer un compte Vercel
👉 https://vercel.com/signup
- Clique sur "Continue with GitHub"
- Autorise l'accès à tes repos

## 2. Déployer le Backend

1. Dashboard Vercel → "Add New" → "Project"
2. Sélectionne `english-training`
3. Configure:
   - Root Directory: `backend`
   - Framework: Other
   - Build Command: `npm install`
4. Variables d'environnement (copie depuis ton `.env`):
   ```
   NODE_ENV=production
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   GEMINI_API_KEYS=...
   ```
5. Deploy!
6. **Note l'URL** (ex: `https://english-training-xyz.vercel.app`)

## 3. Déployer le Frontend

1. Dashboard Vercel → "Add New" → "Project"
2. Sélectionne `english-training` à nouveau
3. Configure:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Variable d'environnement:
   ```
   VITE_API_URL=https://ton-backend.vercel.app/api
   ```
   (Remplace par l'URL du backend de l'étape 2)
5. Deploy!

## 4. C'est tout! 🎉

Ton site est en ligne:
- Frontend: `https://english-training-abc.vercel.app`
- Backend: `https://english-training-xyz.vercel.app`

## Mises à jour automatiques

Chaque push sur GitHub déploie automatiquement!

```powershell
git add .
git commit -m "Update"
git push
```

Vercel détecte et déploie automatiquement.

## Domaine personnalisé (optionnel)

Dans les settings du projet → Domains → Ajoute ton domaine

---

**Besoin d'aide?** Consulte [DEPLOYMENT_VERCEL.md](./DEPLOYMENT_VERCEL.md)
