import express from 'express';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  getUserBlogs
} from '@/controllers/blogController';
import { authMiddleware } from '@/middleware/auth';
import { validate, blogSchema } from '@/middleware/validation';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlog);

// Protected routes
router.post('/', authMiddleware, validate(blogSchema), createBlog);
router.put('/:id', authMiddleware, validate(blogSchema), updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);
router.post('/:id/like', authMiddleware, toggleLike);
router.get('/user/:userId', authMiddleware, getUserBlogs);

export default router;