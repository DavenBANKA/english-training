import speakingService from '../services/speaking.service.js';

/**
 * Contrôleur pour Speaking
 */
class SpeakingController {
  /**
   * Analyser une réponse orale (sans upload)
   * POST /api/speaking/analyze
   */
  async analyze(req, res, next) {
    try {
      const { question_id } = req.body;
      const userId = req.user.id;

      if (!question_id) {
        return res.status(400).json({
          success: false,
          error: 'question_id requis'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Fichier audio requis'
        });
      }

      // Analyser directement sans upload
      const result = await speakingService.analyzeResponseDirect(
        userId,
        question_id,
        req.file.buffer
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupérer l'historique des soumissions
   * GET /api/speaking/submissions
   */
  async getSubmissions(req, res, next) {
    try {
      const userId = req.user.id;
      const submissions = await speakingService.getUserSubmissions(userId);

      res.json({
        success: true,
        data: submissions
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SpeakingController();
