import { supabase } from '../config/supabase.js';
import geminiService from './gemini.service.js';

/**
 * Service pour gérer les soumissions Speaking
 */
class SpeakingService {
  /**
   * Analyse une réponse orale sans upload (transcription + analyse directe)
   * @param {string} userId - ID de l'utilisateur
   * @param {string} questionId - ID de la question
   * @param {Buffer} audioBuffer - Buffer de l'audio pour transcription
   * @returns {Promise<Object>} Résultat de l'analyse
   */
  async analyzeResponseDirect(userId, questionId, audioBuffer) {
    try {
      // Récupérer la question
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .select('question_text, audio_text, question_type')
        .eq('id', questionId)
        .single();

      if (questionError) throw questionError;

      // Transcrire l'audio avec Gemini
      const transcript = await geminiService.transcribeAudio(audioBuffer);

      // Analyser le texte transcrit avec Gemini
      const analysis = await geminiService.analyzeSpeaking(
        transcript,
        question.audio_text || question.question_text,
        question.question_type
      );

      // Sauvegarder la soumission (sans audio_url)
      const { data: submission, error: submissionError } = await supabase
        .from('speaking_submissions')
        .insert({
          user_id: userId,
          question_id: questionId,
          audio_url: null, // Pas de stockage audio
          transcript: transcript,
          corrected_text: analysis.corrected_text,
          grammar_errors: analysis.grammar_errors,
          fluency_score: analysis.fluency_score,
          grammar_score: analysis.grammar_score,
          vocabulary_score: analysis.vocabulary_score,
          pronunciation_score: analysis.pronunciation_score,
          overall_score: analysis.overall_score,
          cefr_level: analysis.cefr_level,
          feedback: analysis.feedback
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      return {
        success: true,
        data: {
          submission_id: submission.id,
          transcript: transcript,
          ...analysis
        }
      };
    } catch (error) {
      console.error('Erreur analyse speaking:', error);
      throw error;
    }
  }

  /**
   * Upload un fichier audio vers Supabase Storage
   * @param {Buffer} fileBuffer - Buffer du fichier audio
   * @param {string} userId - ID de l'utilisateur
   * @param {string} fileName - Nom du fichier
   * @returns {Promise<string>} URL publique du fichier
   */
  async uploadAudio(fileBuffer, userId, fileName) {
    try {
      const filePath = `speaking/${userId}/${Date.now()}_${fileName}`;

      const { data, error } = await supabase.storage
        .from('audio-submissions')
        .upload(filePath, fileBuffer, {
          contentType: 'audio/mpeg',
          upsert: false
        });

      if (error) throw error;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('audio-submissions')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Erreur upload audio:', error);
      throw new Error('Erreur lors de l\'upload de l\'audio');
    }
  }

  /**
   * Récupérer l'historique des soumissions d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des soumissions
   */
  async getUserSubmissions(userId) {
    try {
      const { data, error } = await supabase
        .from('speaking_submissions')
        .select(`
          *,
          questions (
            question_text,
            skill_id
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erreur récupération soumissions:', error);
      throw error;
    }
  }
}

export default new SpeakingService();
