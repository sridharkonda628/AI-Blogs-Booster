import express from 'express';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike
} from '@/controllers/commentController';
import { authMiddleware } from '@/middleware/auth';
import { validate, commentSchema } from '@/middleware/validation';

const router = express.Router();

// Public routes
router.get('/:blogId', getComments);

// Protected routes
router.post('/', authMiddleware, validate(commentSchema), createComment);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);
router.post('/:id/like', authMiddleware, toggleCommentLike);

export default router;