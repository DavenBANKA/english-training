import express from 'express';
import multer from 'multer';
import speakingController from '../controllers/speaking.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { aiLimiter, uploadLimiter } from '../config/security.js';
import { validateSpeaking } from '../middlewares/validation.middleware.js';

const router = express.Router();

// Configuration multer pour upload audio
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format audio non supporté. Utilisez MP3, WAV, OGG ou WebM'));
    }
  }
});

// Routes protégées avec rate limiting
router.post('/analyze', authenticate, uploadLimiter, aiLimiter, upload.single('audio'), validateSpeaking, speakingController.analyze);
router.get('/submissions', authenticate, speakingController.getSubmissions);

export default router;
