# 🔒 Documentation Sécurité - Backend EFSET

## 🛡️ Vue d'ensemble

Le backend implémente une sécurité complète et multicouche pour protéger contre toutes les attaques courantes et avancées.

## 📋 Mesures de Sécurité Implémentées

### 1. **Helmet - Sécurisation des Headers HTTP**

Protection automatique contre les vulnérabilités web courantes :

```javascript
✅ Content Security Policy (CSP)
✅ X-Frame-Options (Clickjacking)
✅ X-Content-Type-Options (MIME Sniffing)
✅ X-XSS-Protection
✅ Strict-Transport-Security (HSTS)
✅ Referrer-Policy
✅ Hide X-Powered-By
```

**Configuration:**
- CSP strict limitant les sources de contenu
- HSTS avec preload pour forcer HTTPS
- Protection contre le clickjacking (X-Frame-Options: DENY)

### 2. **Rate Limiting - Protection contre les Attaques par Force Brute**

Plusieurs niveaux de rate limiting :

#### Global Limiter
```javascript
15 minutes = 100 requêtes max par IP
```

#### Auth Limiter (Login/Register)
```javascript
15 minutes = 5 tentatives max
```

#### AI Limiter (Gemini)
```javascript
1 minute = 10 requêtes max
```

#### Upload Limiter
```javascript
1 minute = 5 uploads max
```

**Avantages:**
- Empêche les attaques par force brute
- Protège les ressources coûteuses (IA)
- Limite l'abus des endpoints

### 3. **Validation et Sanitization des Entrées**

#### Express Validator
Validation stricte de toutes les entrées :

```javascript
✅ Email: Format valide + normalisation
✅ Password: Min 6 caractères + complexité
✅ UUID: Format valide
✅ Text: Longueur min/max + caractères autorisés
✅ Arrays: Taille min/max
✅ Enums: Valeurs autorisées uniquement
```

#### Sanitization Automatique
```javascript
✅ Suppression des propriétés dangereuses (__proto__, constructor)
✅ Nettoyage des injections NoSQL (express-mongo-sanitize)
✅ Protection contre HPP (HTTP Parameter Pollution)
✅ Normalisation des emails
✅ Trim des espaces
```

### 4. **Protection contre les Injections**

#### SQL Injection
Détection de patterns SQL malveillants :
```javascript
- SELECT, INSERT, UPDATE, DELETE, DROP
- --, ;, /*, */
- xp_, sp_
- Quotes et caractères spéciaux
```

#### NoSQL Injection
```javascript
✅ express-mongo-sanitize
✅ Suppression des opérateurs MongoDB ($, .)
```

#### XSS (Cross-Site Scripting)
Détection de patterns XSS :
```javascript
- <script>
- javascript:
- on* event handlers
- <iframe>, <object>, <embed>
```

### 5. **CORS Sécurisé**

Configuration CORS stricte :

```javascript
// Développement
✅ Toutes les origines autorisées

// Production
✅ Whitelist d'origines uniquement
✅ Credentials autorisés
✅ Headers spécifiques
✅ Méthodes limitées (GET, POST, PUT, DELETE, PATCH)
```

**Origines autorisées:**
- localhost:3000, 3001, 5173, 4200
- FRONTEND_URL (variable d'environnement)

### 6. **Détection des Bots Malveillants**

Blocage automatique des bots suspects :

```javascript
❌ Bloqués: curl, wget, python, scrapers
✅ Autorisés: Googlebot, Bingbot, Slackbot
```

### 7. **Vérification de l'Origine**

En production, vérification stricte de l'origine des requêtes :

```javascript
✅ Origin header vérifié
✅ Referer header vérifié
✅ Whitelist d'origines
```

### 8. **Limitation de Taille des Requêtes**

```javascript
✅ Body JSON: 10MB max
✅ URL encoded: 10MB max
✅ Fichiers audio: 10MB max
✅ Nombre de fichiers: 1 max
```

### 9. **Logging et Monitoring**

#### Winston Logger
Logs structurés et persistants :

```javascript
✅ Logs d'erreurs (error.log)
✅ Logs combinés (combined.log)
✅ Logs console (développement)
✅ Rotation automatique (5MB max, 5 fichiers)
```

#### Événements Loggés
```javascript
✅ Toutes les requêtes (méthode, URL, status, durée, IP)
✅ Tentatives d'authentification
✅ Événements de sécurité (SQL injection, XSS, bots)
✅ Erreurs serveur
✅ Origines invalides
```

### 10. **Headers de Sécurité Supplémentaires**

```javascript
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Language: en
X-Translated: false
```

### 11. **Compression**

```javascript
✅ Compression gzip des réponses
✅ Réduction de la bande passante
✅ Amélioration des performances
```

### 12. **Gestion des Erreurs**

```javascript
✅ Middleware centralisé
✅ Pas de stack trace en production
✅ Messages d'erreur génériques
✅ Logging détaillé
✅ Gestion des erreurs non capturées
```

## 🎯 Flux de Sécurité

```
Requête entrante
    ↓
1. Helmet (Headers sécurisés)
    ↓
2. Compression
    ↓
3. CORS (Vérification origine)
    ↓
4. Rate Limiting
    ↓
5. Détection bots malveillants
    ↓
6. Vérification origine
    ↓
7. Limite taille requête
    ↓
8. Détection SQL Injection
    ↓
9. Détection XSS
    ↓
10. Sanitization entrées
    ↓
11. Validation (Express Validator)
    ↓
12. Authentification JWT
    ↓
13. Autorisation (rôles)
    ↓
14. Contrôleur
    ↓
15. Réponse + Headers sécurité
```

## 🔐 Authentification et Autorisation

### JWT via Supabase
```javascript
✅ Tokens signés et vérifiés
✅ Expiration automatique
✅ Refresh tokens
✅ Révocation possible
```

### Rôles
```javascript
✅ user: Accès aux tests
✅ admin: Accès complet + gestion
```

### Middleware Auth
```javascript
✅ Vérification token sur toutes les routes protégées
✅ Extraction user depuis token
✅ Vérification rôle admin
```

## 📊 Endpoints et Sécurité

| Endpoint | Rate Limit | Validation | Auth | Admin |
|----------|------------|------------|------|-------|
| POST /auth/register | 5/15min | ✅ | ❌ | ❌ |
| POST /auth/login | 5/15min | ✅ | ❌ | ❌ |
| GET /auth/profile | 100/15min | ❌ | ✅ | ❌ |
| GET /questions | 100/15min | ✅ | ✅ | ❌ |
| POST /speaking/analyze | 5/min + 10/min | ✅ | ✅ | ❌ |
| POST /writing/analyze | 10/min | ✅ | ✅ | ❌ |
| POST /answers/submit | 100/15min | ✅ | ✅ | ❌ |
| GET /admin/gemini-stats | 100/15min | ❌ | ✅ | ✅ |

## 🚨 Événements de Sécurité Loggés

```javascript
✅ SQL_INJECTION_ATTEMPT
✅ XSS_ATTEMPT
✅ REQUEST_TOO_LARGE
✅ INVALID_ORIGIN
✅ MALICIOUS_BOT_DETECTED
✅ AUTHENTICATION_FAILED
✅ RATE_LIMIT_EXCEEDED
```

## 🔧 Configuration Production

### Variables d'Environnement Requises

```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
LOG_LEVEL=error
```

### Recommandations Supplémentaires

1. **HTTPS Obligatoire**
   - Utiliser un certificat SSL/TLS valide
   - Rediriger HTTP → HTTPS
   - HSTS activé

2. **Firewall**
   - Limiter les IPs autorisées (si possible)
   - Bloquer les ports non utilisés

3. **Monitoring**
   - Surveiller les logs d'erreurs
   - Alertes sur événements de sécurité
   - Monitoring des performances

4. **Backups**
   - Sauvegardes régulières de la base de données
   - Sauvegardes des logs
   - Plan de récupération

5. **Updates**
   - Mettre à jour les dépendances régulièrement
   - Scanner les vulnérabilités (npm audit)
   - Patcher rapidement

## 🧪 Tests de Sécurité

### Tests Recommandés

```bash
# 1. Scanner les vulnérabilités
npm audit

# 2. Tester les injections SQL
curl -X POST http://localhost:3000/api/auth/login \
  -d '{"email":"admin@test.com","password":"' OR '1'='1"}'

# 3. Tester XSS
curl -X POST http://localhost:3000/api/writing/analyze \
  -d '{"text":"<script>alert(1)</script>"}'

# 4. Tester rate limiting
for i in {1..10}; do
  curl http://localhost:3000/api/auth/login
done

# 5. Tester CORS
curl -H "Origin: https://malicious.com" \
  http://localhost:3000/api/questions
```

## 📞 Incident Response

En cas d'incident de sécurité :

1. **Identifier** - Analyser les logs
2. **Contenir** - Bloquer l'attaquant (IP, token)
3. **Éradiquer** - Corriger la vulnérabilité
4. **Récupérer** - Restaurer le service
5. **Apprendre** - Documenter et améliorer

## ✅ Checklist Sécurité

- [x] Helmet configuré
- [x] Rate limiting actif
- [x] Validation des entrées
- [x] Sanitization automatique
- [x] Protection SQL Injection
- [x] Protection XSS
- [x] Protection NoSQL Injection
- [x] CORS sécurisé
- [x] Détection bots
- [x] Logging complet
- [x] Gestion erreurs
- [x] Headers sécurité
- [x] Compression
- [x] Limite taille requêtes
- [x] Authentification JWT
- [x] Autorisation par rôles
- [x] Anti-traduction
- [x] Upload sécurisé

## 🎉 Résultat

Le backend est maintenant **sécurisé au niveau production** avec :
- ✅ Protection contre toutes les attaques OWASP Top 10
- ✅ Logging et monitoring complets
- ✅ Rate limiting multicouche
- ✅ Validation et sanitization strictes
- ✅ Headers de sécurité optimaux
- ✅ Détection et blocage des menaces

**Prêt pour la production ! 🚀**
