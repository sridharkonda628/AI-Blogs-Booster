import express from 'express';
import {
  generateSuggestions,
  generateContent,
  optimizeForSEO
} from '@/controllers/aiController';
import { authMiddleware, premiumMiddleware } from '@/middleware/auth';

const router = express.Router();

// AI suggestion routes (with usage limits)
router.post('/suggestions', authMiddleware, generateSuggestions);
router.post('/seo-optimize', authMiddleware, optimizeForSEO);

// Premium AI features
router.post('/generate', authMiddleware, premiumMiddleware, generateContent);

export default router;