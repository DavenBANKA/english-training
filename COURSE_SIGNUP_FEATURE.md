# 📧 Fonctionnalité d'Inscription aux Cours

## 📋 Description

Un cadre d'inscription aux cours d'anglais a été ajouté sur la page d'accueil, juste après la section "Compétences évaluées". Lorsqu'un visiteur clique sur le bouton, un popup professionnel s'ouvre pour collecter ses informations.

## 🎨 Design

- **Style professionnel** : Cadre orange avec dégradé, cohérent avec le design du site
- **Popup moderne** : Animation fluide, design épuré
- **Responsive** : Adapté mobile, tablette et desktop
- **UX optimale** : Fermeture facile, validation en temps réel

## 📝 Formulaire

Le popup collecte les informations suivantes :
- Prénom (requis)
- Nom (requis)
- Email (requis, validé)
- Pays (requis)

## 📧 Envoi des Données

Lorsque l'utilisateur valide le formulaire :

1. **Ouverture du client email** : Un lien `mailto:` s'ouvre automatiquement
2. **Email pré-rempli** :
   - Destinataire : `contact@conseiluxtraining.com`
   - Sujet : "Nouvelle inscription aux cours d'anglais"
   - Corps : Toutes les informations du formulaire formatées

3. **Avantages de cette approche** :
   - ✅ Pas de serveur SMTP nécessaire
   - ✅ Pas de configuration email complexe
   - ✅ Fonctionne immédiatement
   - ✅ L'utilisateur voit l'email avant envoi
   - ✅ Pas de problème de spam/deliverability

## 🔧 Fichiers Créés

### Frontend
- `frontend/src/components/CourseSignupSection.jsx` - Composant React
- `frontend/src/components/CourseSignupSection.css` - Styles

### Backend
- `backend/src/routes/contact.routes.js` - Route API (pour logging)

### Modifications
- `frontend/src/pages/Home.jsx` - Ajout du composant
- `backend/src/app.js` - Enregistrement de la route

## 📍 Emplacement

Le cadre apparaît sur la page d'accueil :
```
Hero Section
↓
Niveaux CECRL (Compétences évaluées)
↓
🆕 INSCRIPTION AUX COURS 🆕  ← ICI
↓
Comment ça marche
↓
Pour qui
↓
...
```

## 🎯 Utilisation

1. L'utilisateur visite la page d'accueil
2. Il voit le cadre orange "Intéressé par nos cours d'anglais ?"
3. Il clique sur "S'inscrire aux cours"
4. Un popup s'ouvre avec le formulaire
5. Il remplit ses informations
6. Il clique sur "Envoyer ma demande"
7. Son client email s'ouvre avec l'email pré-rempli
8. Il envoie l'email à contact@conseiluxtraining.com

## 🔄 Alternative : Service d'Email Automatique

Si vous souhaitez envoyer les emails automatiquement sans passer par le client email de l'utilisateur, vous pouvez intégrer un service comme :

### Option 1 : SendGrid (Recommandé)
```bash
npm install @sendgrid/mail
```

### Option 2 : Nodemailer avec Gmail
```bash
npm install nodemailer
```

### Option 3 : Mailgun
```bash
npm install mailgun-js
```

### Option 4 : AWS SES
```bash
npm install @aws-sdk/client-ses
```

## 📱 Responsive

Le composant est entièrement responsive :
- **Desktop** : Popup centré, formulaire en 2 colonnes
- **Tablette** : Popup adapté, formulaire en 2 colonnes
- **Mobile** : Popup plein écran, formulaire en 1 colonne

## 🎨 Personnalisation

Pour modifier le design :

### Couleurs
```css
/* CourseSignupSection.css */
.course-signup-card {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
}
```

### Texte
```jsx
/* CourseSignupSection.jsx */
<h3 className="course-signup-title">
  Intéressé par nos cours d'anglais ?
</h3>
```

### Email de destination
```jsx
/* CourseSignupSection.jsx */
const mailtoLink = `mailto:contact@conseiluxtraining.com?...`
```

## ✅ Checklist

- [x] Composant créé
- [x] Styles responsive
- [x] Popup fonctionnel
- [x] Validation du formulaire
- [x] Envoi par mailto
- [x] Messages de succès/erreur
- [x] Intégration dans Home.jsx
- [x] Route backend (logging)
- [x] Tests de diagnostic OK

## 🚀 Prêt à l'emploi !

La fonctionnalité est complète et prête à être utilisée. Aucune configuration supplémentaire n'est nécessaire.
