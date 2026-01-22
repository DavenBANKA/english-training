import writingService from '../services/writing.service.js';

/**
 * Contrôleur pour Writing
 */
class WritingController {
  /**
   * Analyser une rédaction
   * POST /api/writing/analyze
   */
  async analyze(req, res, next) {
    try {
      const { question_id, text } = req.body;
      const userId = req.user.id;

      if (!question_id || !text) {
        return res.status(400).json({
          success: false,
          error: 'question_id et text requis'
        });
      }

      const result = await writingService.analyzeResponse(
        userId,
        question_id,
        text
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupérer l'historique des soumissions
   * GET /api/writing/submissions
   */
  async getSubmissions(req, res, next) {
    try {
      const userId = req.user.id;
      const submissions = await writingService.getUserSubmissions(userId);

      res.json({
        success: true,
        data: submissions
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new WritingController();
