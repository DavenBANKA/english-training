# 📝 Instructions pour Insérer les Questions

## 🎯 Ordre d'Exécution

Exécuter les scripts SQL dans cet ordre dans l'éditeur SQL de Supabase:

### 1. Base de données
```sql
-- Exécuter d'abord
database.sql
```
Crée les tables et les skills de base.

### 2. Questions Reading
```sql
-- Exécuter ensuite
seed_questions.sql
```
Insère les 90 questions de Reading (A1 à C1).

### 3. Questions Listening
```sql
-- Exécuter après
seed_listening.sql
```
Insère les 26 questions de Listening (A1 à C1).

### 4. Questions Speaking & Writing
```sql
-- Exécuter en dernier
seed_speaking_writing.sql
```
Insère les 10 questions Speaking et 5 tâches Writing.

## ✅ Vérification

Après l'exécution, vérifier dans Supabase:

```sql
-- Compter les questions par skill
SELECT 
  s.name as skill,
  COUNT(q.id) as total_questions
FROM skills s
LEFT JOIN questions q ON q.skill_id = s.id
GROUP BY s.name
ORDER BY s.name;
```

**Résultat attendu:**
- reading: 90 questions
- listening: 26 questions
- speaking: 10 questions
- writing: 5 questions
- **TOTAL: 131 questions**

## 📊 Répartition par Niveau

### Reading (90)
- A1: 15 questions (Q1-Q15)
- A2: 15 questions (Q16-Q30)
- B1: 15 questions (Q31-Q45)
- B2: 15 questions (Q46-Q60)
- C1: 30 questions (Q61-Q90)

### Listening (26)
- A1: 5 questions
- A2: 5 questions
- B1: 6 questions
- B2: 5 questions
- C1: 5 questions

### Speaking (10)
- Listen & Repeat: 5 questions
- Listen & Answer: 5 questions

### Writing (5)
- Essay tasks: 5 tâches (80-120 mots chacune)

## 🔊 Notes sur les Fichiers Audio

Les URLs audio dans les questions sont des placeholders:
```
https://audio-url/listening_a1_1.mp3
```

**À faire:**
1. Enregistrer les audios pour chaque question Listening/Speaking
2. Uploader dans Supabase Storage (bucket `audio-submissions`)
3. Mettre à jour les URLs dans la base de données:

```sql
UPDATE questions 
SET audio_url = 'https://tjvvwjxysbhaylmqukjh.supabase.co/storage/v1/object/public/audio-submissions/listening_a1_1.mp3'
WHERE id = 'question_id';
```

## 🎯 Clés de Correction

### Reading
Toutes les réponses correctes sont dans le champ `correct_answer` (a, b, c, ou d).

### Listening
Toutes les réponses correctes sont dans le champ `correct_answer`.

### Speaking & Writing
Évalués par Gemini AI (pas de réponse correcte fixe).

## 🚀 Prochaines Étapes

1. ✅ Exécuter les 4 scripts SQL
2. ⏳ Créer les fichiers audio
3. ⏳ Uploader les audios dans Supabase Storage
4. ⏳ Mettre à jour les URLs audio
5. ⏳ Tester l'API avec quelques questions

## 📞 Support

En cas d'erreur lors de l'exécution:
- Vérifier que `database.sql` a été exécuté en premier
- Vérifier que les skills existent dans la table `skills`
- Consulter les logs d'erreur Supabase
