import { geminiManager } from '../config/gemini.js';

/**
 * Service central pour les interactions avec Gemini AI
 * Gère l'analyse, la correction et la notation des réponses
 * Utilise la rotation automatique des clés API
 */
class GeminiService {
  /**
   * Transcrit un fichier audio en texte avec Gemini
   * @param {Buffer} audioBuffer - Buffer du fichier audio
   * @returns {Promise<string>} Transcription du texte
   */
  async transcribeAudio(audioBuffer) {
    const prompt = `Transcribe this audio recording in English. Return ONLY the transcribed text, nothing else.`;

    try {
      // Convertir le buffer en base64
      const audioBase64 = audioBuffer.toString('base64');
      
      // Utiliser Gemini avec audio
      const result = await geminiManager.generateContentWithRotation([
        {
          inlineData: {
            mimeType: 'audio/wav',
            data: audioBase64
          }
        },
        { text: prompt }
      ]);
      
      const transcript = result.response.text().trim();
      return transcript;
    } catch (error) {
      console.error('Erreur transcription audio:', error);
      // Fallback: retourner un message si la transcription échoue
      return '[Transcription non disponible]';
    }
  }

  /**
   * Analyse une réponse Speaking
   * @param {string} transcript - Transcription de l'audio
   * @param {string} expectedText - Texte attendu (phrase à répéter ou question)
   * @param {string} questionType - Type de question ('repeat' ou 'answer')
   * @returns {Promise<Object>} Analyse complète avec score et niveau CECRL
   */
  async analyzeSpeaking(transcript, expectedText, questionType) {
    const isRepeat = questionType === 'repeat';
    
    const prompt = `Tu es un examinateur EFSET/IELTS expert. Analyse cette réponse orale en anglais.

${isRepeat ? 'Phrase à répéter' : 'Question posée'}: ${expectedText}
Réponse de l'étudiant: ${transcript}

${isRepeat 
  ? 'L\'étudiant devait répéter exactement la phrase. Évalue la précision, la fluidité et la prononciation.'
  : 'L\'étudiant devait répondre à la question. Évalue la pertinence, la grammaire, le vocabulaire et la fluidité.'}

Analyse la réponse selon les critères EFSET et retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "transcript": "${transcript.replace(/"/g, '\\"')}",
  "corrected_text": "version corrigée de la réponse",
  "grammar_errors": [
    {"error": "erreur détectée", "correction": "correction proposée", "explanation": "explication en français"}
  ],
  "pronunciation_issues": ["liste des problèmes de prononciation détectés"],
  "fluency_score": 0-100,
  "grammar_score": 0-100,
  "vocabulary_score": 0-100,
  "pronunciation_score": 0-100,
  "overall_score": 0-100,
  "cefr_level": "A1|A2|B1|B2|C1|C2",
  "feedback": "feedback pédagogique détaillé en français (2-3 phrases)"
}

Critères d'évaluation:
- Fluidité et cohérence
- Grammaire et structures
- Vocabulaire et expressions
- Prononciation (basée sur le texte)
${isRepeat ? '- Précision par rapport à la phrase originale' : '- Pertinence de la réponse'}

Retourne UNIQUEMENT le JSON, sans texte avant ou après.`;

    try {
      // Utiliser le gestionnaire avec rotation automatique
      const result = await geminiManager.generateContentWithRotation(prompt);
      const response = result.response.text();
      
      // Nettoyer la réponse pour extraire le JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Format de réponse Gemini invalide');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Erreur Gemini Speaking:', error);
      throw new Error('Erreur lors de l\'analyse de la réponse orale');
    }
  }

  /**
   * Analyse une réponse Writing
   * @param {string} text - Texte écrit par l'utilisateur
   * @param {string} prompt - Sujet de rédaction
   * @returns {Promise<Object>} Analyse complète avec score et niveau CECRL
   */
  async analyzeWriting(text, prompt) {
    const analysisPrompt = `Tu es un examinateur EFSET/IELTS expert. Analyse cette rédaction en anglais.

Sujet: ${prompt}
Texte: ${text}

Analyse la rédaction selon les critères EFSET et retourne UNIQUEMENT un JSON valide avec cette structure exacte:
{
  "original_text": "${text.replace(/"/g, '\\"')}",
  "corrected_text": "version entièrement corrigée",
  "errors": [
    {
      "type": "grammar|spelling|vocabulary|punctuation",
      "error": "erreur détectée",
      "correction": "correction proposée",
      "explanation": "explication en français"
    }
  ],
  "coherence_score": 0-100,
  "grammar_score": 0-100,
  "vocabulary_score": 0-100,
  "task_achievement_score": 0-100,
  "overall_score": 0-100,
  "cefr_level": "A1|A2|B1|B2|C1|C2",
  "feedback": "feedback pédagogique détaillé en français",
  "strengths": ["point fort 1", "point fort 2"],
  "improvements": ["amélioration suggérée 1", "amélioration suggérée 2"]
}

Critères d'évaluation:
- Cohérence et organisation
- Grammaire et structures
- Vocabulaire et expressions
- Réponse au sujet

Retourne UNIQUEMENT le JSON, sans texte avant ou après.`;

    try {
      // Utiliser le gestionnaire avec rotation automatique
      const result = await geminiManager.generateContentWithRotation(analysisPrompt);
      const response = result.response.text();
      
      // Nettoyer la réponse pour extraire le JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Format de réponse Gemini invalide');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Erreur Gemini Writing:', error);
      throw new Error('Erreur lors de l\'analyse de la rédaction');
    }
  }

  /**
   * Génère des questions adaptatives basées sur le niveau
   * @param {string} skill - Compétence (reading/listening)
   * @param {string} level - Niveau CECRL
   * @returns {Promise<Array>} Liste de questions
   */
  async generateAdaptiveQuestions(skill, level) {
    const prompt = `Génère 5 questions de type ${skill} pour le niveau ${level} (CECRL).
Format JSON uniquement:
{
  "questions": [
    {
      "text": "texte de la question",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A",
      "difficulty": "${level}"
    }
  ]
}`;

    try {
      // Utiliser le gestionnaire avec rotation automatique
      const result = await geminiManager.generateContentWithRotation(prompt);
      const response = result.response.text();
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Format de réponse invalide');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Erreur génération questions:', error);
      throw new Error('Erreur lors de la génération des questions');
    }
  }

  /**
   * Obtient les statistiques d'utilisation des clés API
   * @returns {Object} Statistiques
   */
  getAPIStats() {
    return geminiManager.getStats();
  }
}

export default new GeminiService();
