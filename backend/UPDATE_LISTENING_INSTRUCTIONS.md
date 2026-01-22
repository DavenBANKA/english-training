# Instructions pour mettre à jour les questions Listening

## Étapes à suivre dans Supabase

### 1. Ajouter la colonne audio_text
Aller dans **SQL Editor** et exécuter:

```sql
ALTER TABLE questions ADD COLUMN IF NOT EXISTS audio_text TEXT;
```

### 2. Insérer les nouvelles questions listening
Copier tout le contenu du fichier `seed_listening_new.sql` et l'exécuter dans **SQL Editor**.

Ce script va:
- Supprimer les anciennes questions listening
- Insérer 26 nouvelles questions groupées en 5 passages:
  - **Passage 1**: Sarah's Life (5 questions A1)
  - **Passage 2**: Tom's Commute (5 questions A2)
  - **Passage 3**: Mountain Hiking (6 questions B1)
  - **Passage 4**: Remote Work Conference (5 questions B2)
  - **Passage 5**: Sustainable Consumption (5 questions C1)

## Structure des passages

Chaque passage a:
- Un texte audio unique (`audio_text`) qui sera lu UNE SEULE FOIS
- Plusieurs questions basées sur ce texte
- Toutes les questions d'un même passage partagent le même `audio_text`

## Fonctionnement dans le test

1. L'utilisateur clique sur "Écouter l'audio" pour le Passage 1
2. L'audio est lu (synthèse vocale du navigateur)
3. Plusieurs questions apparaissent basées sur ce passage
4. L'utilisateur répond aux questions
5. Passage au Passage 2 avec un nouvel audio
6. Et ainsi de suite...

## Vérification

Après l'exécution, vérifier dans **Table Editor** > **questions**:
- La colonne `audio_text` existe
- Les questions listening ont toutes un `audio_text` rempli
- Les questions du même passage ont le même `audio_text`
