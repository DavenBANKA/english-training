# 🔄 Système de Rotation des Clés API Gemini

## 📋 Vue d'ensemble

Le système implémente une rotation automatique et intelligente des clés API Gemini pour garantir une disponibilité maximale du service, même lorsqu'une clé atteint son quota.

## ✨ Fonctionnalités

### 1. Rotation Automatique
- Bascule automatiquement vers la clé suivante en cas d'erreur de quota
- Supporte un nombre illimité de clés API
- Cycle continu à travers toutes les clés disponibles

### 2. Gestion Intelligente des Erreurs
- Détecte les erreurs de quota (429, RESOURCE_EXHAUSTED)
- Marque temporairement les clés échouées
- Réinitialise les clés après un cycle complet

### 3. Monitoring
- Logs détaillés de chaque rotation
- Statistiques en temps réel via endpoint admin
- Suivi des clés disponibles/échouées

## 🔧 Configuration

### Variables d'environnement

Dans votre fichier `.env`:

```env
# Séparer les clés par des virgules (sans espaces ou avec espaces)
GEMINI_API_KEYS=key1,key2,key3,key4
```

**Vos clés configurées:**
```env
GEMINI_API_KEYS=AIzaSyAO3LD9SNLOsftf7moHHjQqGgBOCe75Bto,AIzaSyAEfmb-Xp0LzFDCbN3dtdvhXIw7qwSbzx8,AIzaSyDoWIU-OP7B-u4NioWH8gP6CBPZxpMU3hUA,AIzaSyAt1I1yaY8cqdztOqPg3CzNd6CxV8gPl-o
```

## 🚀 Utilisation

### Automatique

Le système fonctionne automatiquement. Aucune action requise de votre part.

```javascript
// Dans vos services, utilisez simplement:
import geminiService from './services/gemini.service.js';

// La rotation est gérée automatiquement
const result = await geminiService.analyzeSpeaking(transcript, question);
```

### Monitoring (Admin)

Endpoint pour surveiller l'état des clés:

```http
GET /api/admin/gemini-stats
Authorization: Bearer <admin_token>
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "totalKeys": 4,
    "currentKeyIndex": 0,
    "failedKeys": [],
    "availableKeys": 4,
    "message": "4/4 clés disponibles"
  }
}
```

## 🔄 Flux de Rotation

```
1. Requête → Clé 1 (succès) ✅
2. Requête → Clé 1 (quota atteint) ⚠️
3. Rotation automatique → Clé 2
4. Requête → Clé 2 (succès) ✅
5. Requête → Clé 2 (quota atteint) ⚠️
6. Rotation automatique → Clé 3
7. ... et ainsi de suite
```

## 📊 Logs Console

Le système affiche des logs détaillés:

```
✅ 4 clés Gemini API chargées
⚠️  Quota atteint pour la clé 0
🔄 Rotation de clé API: 0 → 1
❌ Clé 0 marquée comme échouée
♻️  Réinitialisation des clés échouées (après cycle complet)
```

## 🛡️ Gestion des Erreurs

### Erreurs de Quota
- **Détection:** 429, RESOURCE_EXHAUSTED, "quota"
- **Action:** Rotation automatique vers la clé suivante
- **Délai:** 1 seconde entre tentatives

### Autres Erreurs
- Propagées immédiatement (pas de rotation)
- Exemples: erreurs réseau, format invalide, etc.

### Toutes les Clés Épuisées
Si toutes les clés atteignent leur quota:
```json
{
  "error": "Toutes les clés API Gemini ont échoué"
}
```

## 🔧 Architecture

### Classe GeminiAPIManager

```javascript
class GeminiAPIManager {
  constructor()                    // Initialise les clés
  getCurrentKey()                  // Obtient la clé active
  rotateKey()                      // Passe à la clé suivante
  markKeyAsFailed(index)          // Marque une clé comme échouée
  getModel()                       // Obtient un modèle Gemini
  generateContentWithRotation()    // Génère avec rotation auto
  getStats()                       // Statistiques
}
```

### Singleton Pattern

Une seule instance partagée dans toute l'application:

```javascript
export const geminiManager = new GeminiAPIManager();
```

## 📈 Optimisations

### 1. Réinitialisation Cyclique
Après un cycle complet, les clés échouées sont réinitialisées (les quotas peuvent s'être rechargés).

### 2. Délai entre Tentatives
1 seconde de pause entre rotations pour éviter le spam.

### 3. Tentatives Limitées
Par défaut, essaie toutes les clés une fois avant d'échouer.

## 🧪 Tests

### Test Manuel

```bash
# Démarrer le serveur
npm run dev

# Faire plusieurs requêtes pour déclencher la rotation
curl -X POST http://localhost:3000/api/writing/analyze \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"question_id":"uuid","text":"test"}'

# Vérifier les stats
curl http://localhost:3000/api/admin/gemini-stats \
  -H "Authorization: Bearer <admin_token>"
```

### Logs à Surveiller

```
✅ 4 clés Gemini API chargées
🔄 Rotation de clé API: 0 → 1
⚠️  Quota atteint pour la clé 1
```

## 💡 Bonnes Pratiques

1. **Nombre de Clés:** Minimum 2-3 clés pour une bonne redondance
2. **Monitoring:** Vérifier régulièrement `/api/admin/gemini-stats`
3. **Quotas:** Surveiller les quotas Google AI Studio
4. **Logs:** Activer les logs en production pour détecter les problèmes

## 🔐 Sécurité

- Les clés ne sont jamais exposées dans les réponses API
- Seuls les admins peuvent voir les statistiques
- Les clés sont stockées uniquement dans `.env` (gitignored)

## 🆘 Troubleshooting

### Problème: "No valid Gemini API keys found"
**Solution:** Vérifier que `GEMINI_API_KEYS` est bien défini dans `.env`

### Problème: Toutes les clés échouent immédiatement
**Solution:** 
- Vérifier que les clés sont valides
- Vérifier les quotas dans Google AI Studio
- Attendre la réinitialisation des quotas (généralement 1 minute)

### Problème: Rotation trop fréquente
**Solution:** Augmenter les quotas ou ajouter plus de clés

## 📞 Support

Pour toute question sur le système de rotation:
- Consulter les logs console
- Vérifier `/api/admin/gemini-stats`
- Consulter la documentation Gemini: https://ai.google.dev/docs
