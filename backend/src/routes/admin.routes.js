import express from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import geminiService from '../services/gemini.service.js';
import { supabaseAdmin } from '../config/supabase.js';

const router = express.Router();

/**
 * Route admin pour voir les statistiques des clés API Gemini
 * GET /api/admin/gemini-stats
 */
router.get('/gemini-stats', authenticate, requireAdmin, (req, res) => {
  try {
    const stats = geminiService.getAPIStats();

    res.json({
      success: true,
      data: {
        ...stats,
        message: `${stats.availableKeys}/${stats.totalKeys} clés disponibles`
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Route admin pour voir la liste des utilisateurs
 * GET /api/admin/users
 */
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

    if (error) throw error;

    // Formater les données pour le frontend
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || 'Non renseigné',
      created_at: user.created_at
    }));

    res.json({
      success: true,
      data: formattedUsers
    });
  } catch (error) {
    console.error('Erreur listing users:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
