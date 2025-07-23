import { Request, Response } from 'express';
import { supabase } from '@/config/supabase';
import { AuthRequest } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

// @desc    Get comments for a blog
// @route   GET /api/comments/:blogId
// @access  Public
export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const { data: comments, error, count } = await supabase
    .from('comments')
    .select('*', { count: 'exact' })
    .eq('blog_id', blogId)
    .order('created_at', { ascending: false })
    .range(
      (Number(page) - 1) * Number(limit),
      Number(page) * Number(limit) - 1
    );

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }

  res.json({
    success: true,
    data: comments,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: count,
      pages: Math.ceil((count || 0) / Number(limit))
    }
  });
});

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
export const createComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { content, blogId } = req.body;

  // Check if blog exists
  const { data: blog, error: blogError } = await supabase
    .from('blogs')
    .select('id')
    .eq('id', blogId)
    .single();

  if (blogError || !blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  const commentData = {
    blog_id: blogId,
    content,
    author_id: req.user!.clerkId,
    author_name: req.user!.email.split('@')[0], // Fallback name
    likes: 0
  };

  const { data: comment, error } = await supabase
    .from('comments')
    .insert([commentData])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to create comment' });
  }

  // Increment comment count on blog
  await supabase.rpc('increment_blog_comments', { blog_id: blogId });

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;

  // Check if user owns the comment
  const { data: existingComment, error: fetchError } = await supabase
    .from('comments')
    .select('author_id')
    .eq('id', id)
    .single();

  if (fetchError || !existingComment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (existingComment.author_id !== req.user!.clerkId && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to update this comment' });
  }

  const { data: comment, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to update comment' });
  }

  res.json({
    success: true,
    data: comment
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Check if user owns the comment
  const { data: existingComment, error: fetchError } = await supabase
    .from('comments')
    .select('author_id, blog_id')
    .eq('id', id)
    .single();

  if (fetchError || !existingComment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (existingComment.author_id !== req.user!.clerkId && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to delete this comment' });
  }

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: 'Failed to delete comment' });
  }

  // Decrement comment count on blog
  await supabase.rpc('decrement_blog_comments', { blog_id: existingComment.blog_id });

  res.json({
    success: true,
    message: 'Comment deleted successfully'
  });
});

// @desc    Like/Unlike comment
// @route   POST /api/comments/:id/like
// @access  Private
export const toggleCommentLike = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.rpc('toggle_comment_like', {
    comment_id: id,
    user_id: req.user!.clerkId
  });

  if (error) {
    return res.status(500).json({ error: 'Failed to toggle like' });
  }

  res.json({
    success: true,
    message: 'Like toggled successfully'
  });
});