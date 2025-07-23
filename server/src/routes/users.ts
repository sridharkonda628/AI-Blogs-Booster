import express from 'express';
import { supabase } from '@/config/supabase';
import { authMiddleware } from '@/middleware/auth';
import { validate, userUpdateSchema } from '@/middleware/validation';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: user, error } = await supabase
    .from('user_profiles')
    .select('id, clerk_id, name, avatar, bio, created_at')
    .eq('clerk_id', id)
    .single();

  if (error || !user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get user's published blogs count
  const { count: blogsCount } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', id)
    .eq('status', 'published');

  res.json({
    success: true,
    data: {
      ...user,
      blogsCount: blogsCount || 0
    }
  });
}));

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', authMiddleware, validate(userUpdateSchema), asyncHandler(async (req: AuthRequest, res) => {
  const { name, bio, avatar } = req.body;

  const { data: user, error } = await supabase
    .from('user_profiles')
    .update({ name, bio, avatar })
    .eq('clerk_id', req.user!.clerkId)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to update profile' });
  }

  res.json({
    success: true,
    data: user
  });
}));

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', authMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const clerkId = req.user!.clerkId;

  // Get blog stats
  const { data: blogs, error: blogsError } = await supabase
    .from('blogs')
    .select('views, likes, comments_count, status')
    .eq('author_id', clerkId);

  if (blogsError) {
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }

  const stats = {
    totalBlogs: blogs.length,
    publishedBlogs: blogs.filter(b => b.status === 'published').length,
    draftBlogs: blogs.filter(b => b.status === 'draft').length,
    pendingBlogs: blogs.filter(b => b.status === 'pending').length,
    totalViews: blogs.reduce((sum, blog) => sum + blog.views, 0),
    totalLikes: blogs.reduce((sum, blog) => sum + blog.likes, 0),
    totalComments: blogs.reduce((sum, blog) => sum + blog.comments_count, 0)
  };

  res.json({
    success: true,
    data: stats
  });
}));

export default router;