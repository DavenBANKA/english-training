import { supabase } from '../config/supabase.js';

/**
 * Contrôleur pour l'authentification
 */
class AuthController {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(req, res, next) {
    try {
      const { email, password, full_name } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email et mot de passe requis'
        });
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role: 'user'
          }
        }
      });

      if (error) {
        console.error('Supabase Register Error:', error.message);
        return res.status(error.status || 400).json({
          success: false,
          error: error.message || "Erreur lors de l'inscription"
        });
      }

      res.status(201).json({
        success: true,
        message: 'Inscription réussie. Veuillez vérifier votre boîte mail si nécessaire.',
        data: {
          user: data.user,
          session: data.session
        }
      });
    } catch (error) {
      console.error('Register Controller Error:', error);
      next(error);
    }
  }

  /**
   * Connexion utilisateur
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email et mot de passe requis'
        });
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Supabase Login Error:', error.message);
        return res.status(error.status || 401).json({
          success: false,
          error: error.message || 'Identifiants invalides'
        });
      }

      if (!data?.session) {
        return res.status(401).json({
          success: false,
          error: 'Session non trouvée. Veuillez vérifier votre boîte mail si la confirmation est requise.'
        });
      }

      res.json({
        success: true,
        data: {
          user: data.user,
          session: data.session,
          access_token: data.session.access_token
        }
      });
    } catch (error) {
      console.error('Login Controller Error:', error);
      next(error);
    }
  }

  /**
   * Déconnexion
   */
  async logout(req, res, next) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      res.json({
        success: true,
        message: 'Déconnexion réussie'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Récupérer le profil utilisateur
   */
  async getProfile(req, res, next) {
    try {
      // Extraire les informations importantes de l'utilisateur
      const userProfile = {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.user_metadata?.full_name || req.user.email,
        role: req.user.user_metadata?.role || 'user',
        created_at: req.user.created_at
      };

      res.json({
        success: true,
        data: {
          user: userProfile
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
