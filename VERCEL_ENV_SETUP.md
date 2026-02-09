# Configuration des Variables d'Environnement Vercel

## Erreur 500 - Variables manquantes

Si tu vois l'erreur `500` avec "A server e..." dans la console, c'est que les **variables d'environnement ne sont pas configurées** dans Vercel.

## Comment configurer

### 1. Va sur ton projet Vercel
https://vercel.com/dashboard

### 2. Sélectionne ton projet
Clique sur le projet `english-training`

### 3. Va dans Settings
Settings → Environment Variables

### 4. Ajoute TOUTES ces variables

Pour chaque variable, clique sur "Add New" et entre:

#### Variables Backend (OBLIGATOIRES)

```
Name: SUPABASE_URL
Value: (copie depuis ton fichier backend/.env)
Environment: Production, Preview, Development
```

```
Name: SUPABASE_ANON_KEY
Value: (copie depuis ton fichier backend/.env)
Environment: Production, Preview, Development
```

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: (copie depuis ton fichier backend/.env)
Environment: Production, Preview, Development
```

```
Name: GEMINI_API_KEYS
Value: (copie depuis ton fichier backend/.env - format: key1,key2,key3)
Environment: Production, Preview, Development
```

```
Name: NODE_ENV
Value: production
Environment: Production
```

### 5. Redéploie le projet

Après avoir ajouté les variables:
1. Va dans l'onglet "Deployments"
2. Clique sur les 3 points (...) du dernier déploiement
3. Clique sur "Redeploy"
4. Coche "Use existing Build Cache"
5. Clique sur "Redeploy"

## Vérification

Une fois redéployé, teste:
1. Ouvre ton site
2. Essaie de créer un compte
3. Ça devrait fonctionner!

## Où trouver tes valeurs?

Ouvre le fichier `backend/.env` sur ton ordinateur:

```powershell
cat backend/.env
```

Copie les valeurs et colle-les dans Vercel.

## Troubleshooting

### Les variables ne sont pas prises en compte
- Assure-toi de sélectionner "Production, Preview, Development" pour chaque variable
- Redéploie après avoir ajouté les variables

### Erreur Supabase
- Vérifie que `SUPABASE_URL` commence par `https://`
- Vérifie que les clés sont complètes (pas de caractères manquants)

### Erreur Gemini
- Format: `key1,key2,key3` (séparées par des virgules, sans espaces)
- Au moins une clé valide est nécessaire
