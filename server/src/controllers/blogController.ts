import { Request, Response } from 'express';
import { supabase } from '@/config/supabase';
import { AuthRequest } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
  const { 
    page = 1, 
    limit = 10, 
    category, 
    status = 'published',
    search,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = req.query;

  let query = supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .eq('status', status)
    .order(sortBy as string, { ascending: sortOrder === 'asc' })
    .range(
      (Number(page) - 1) * Number(limit),
      Number(page) * Number(limit) - 1
    );

  if (category) {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data: blogs, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch blogs' });
  }

  res.json({
    success: true,
    data: blogs,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: count,
      pages: Math.ceil((count || 0) / Number(limit))
    }
  });
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
export const getBlog = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  // Increment view count
  await supabase.rpc('increment_blog_views', { blog_id: id });

  res.json({
    success: true,
    data: blog
  });
});

// @desc    Create blog
// @route   POST /api/blogs
// @access  Private
export const createBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, content, excerpt, category, tags, thumbnail, status } = req.body;

  const blogData = {
    title,
    content,
    excerpt,
    category,
    tags: tags || [],
    thumbnail,
    status: status || 'draft',
    author_id: req.user!.clerkId,
    author_name: req.user!.email.split('@')[0], // Fallback name
    views: 0,
    likes: 0,
    comments_count: 0
  };

  const { data: blog, error } = await supabase
    .from('blogs')
    .insert([blogData])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to create blog' });
  }

  res.status(201).json({
    success: true,
    data: blog
  });
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
export const updateBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  // Check if user owns the blog or is admin
  const { data: existingBlog, error: fetchError } = await supabase
    .from('blogs')
    .select('author_id')
    .eq('id', id)
    .single();

  if (fetchError || !existingBlog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  if (existingBlog.author_id !== req.user!.clerkId && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to update this blog' });
  }

  const { data: blog, error } = await supabase
    .from('blogs')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to update blog' });
  }

  res.json({
    success: true,
    data: blog
  });
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
export const deleteBlog = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  // Check if user owns the blog or is admin
  const { data: existingBlog, error: fetchError } = await supabase
    .from('blogs')
    .select('author_id')
    .eq('id', id)
    .single();

  if (fetchError || !existingBlog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  if (existingBlog.author_id !== req.user!.clerkId && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to delete this blog' });
  }

  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: 'Failed to delete blog' });
  }

  res.json({
    success: true,
    message: 'Blog deleted successfully'
  });
});

// @desc    Like/Unlike blog
// @route   POST /api/blogs/:id/like
// @access  Private
export const toggleLike = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const { error } = await supabase.rpc('toggle_blog_like', {
    blog_id: id,
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

// @desc    Get user's blogs
// @route   GET /api/blogs/user/:userId
// @access  Private
export const getUserBlogs = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  const { status } = req.query;

  // Users can only see their own blogs unless they're admin
  if (userId !== req.user!.clerkId && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  let query = supabase
    .from('blogs')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data: blogs, error } = await query;

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch user blogs' });
  }

  res.json({
    success: true,
    data: blogs
  });
});