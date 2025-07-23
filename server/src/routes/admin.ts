import express from 'express';
import { supabase } from '@/config/supabase';
import { authMiddleware, adminMiddleware } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthRequest } from '@/middleware/auth';

const router = express.Router();

// Apply admin middleware to all routes
router.use(authMiddleware, adminMiddleware);

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
router.get('/stats', asyncHandler(async (req, res) => {
  // Get total users
  const { count: totalUsers } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });

  // Get active users (logged in last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { count: activeUsers } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString());

  // Get total blogs
  const { count: totalBlogs } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true });

  // Get pending blogs
  const { count: pendingBlogs } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  // Get published blogs
  const { count: publishedBlogs } = await supabase
    .from('blogs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  // Get total comments
  const { count: totalComments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true });

  res.json({
    success: true,
    data: {
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalBlogs: totalBlogs || 0,
      pendingBlogs: pendingBlogs || 0,
      publishedBlogs: publishedBlogs || 0,
      totalComments: totalComments || 0
    }
  });
}));

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;

  let query = supabase
    .from('user_profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(
      (Number(page) - 1) * Number(limit),
      Number(page) * Number(limit) - 1
    );

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (role) {
    query = query.eq('role', role);
  }

  const { data: users, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }

  res.json({
    success: true,
    data: users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: count,
      pages: Math.ceil((count || 0) / Number(limit))
    }
  });
}));

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
router.put('/users/:id/role', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'premium', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const { data: user, error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to update user role' });
  }

  res.json({
    success: true,
    data: user
  });
}));

// @desc    Get pending blogs for moderation
// @route   GET /api/admin/blogs/pending
// @access  Admin
router.get('/blogs/pending', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const { data: blogs, error, count } = await supabase
    .from('blogs')
    .select('*', { count: 'exact' })
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .range(
      (Number(page) - 1) * Number(limit),
      Number(page) * Number(limit) - 1
    );

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch pending blogs' });
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
}));

// @desc    Approve blog
// @route   PUT /api/admin/blogs/:id/approve
// @access  Admin
router.put('/blogs/:id/approve', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: blog, error } = await supabase
    .from('blogs')
    .update({ 
      status: 'published',
      published_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to approve blog' });
  }

  res.json({
    success: true,
    data: blog
  });
}));

// @desc    Reject blog
// @route   PUT /api/admin/blogs/:id/reject
// @access  Admin
router.put('/blogs/:id/reject', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const { data: blog, error } = await supabase
    .from('blogs')
    .update({ 
      status: 'rejected',
      rejection_reason: reason
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to reject blog' });
  }

  res.json({
    success: true,
    data: blog
  });
}));

// @desc    Delete any blog
// @route   DELETE /api/admin/blogs/:id
// @access  Admin
router.delete('/blogs/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Delete associated comments first
  await supabase.from('comments').delete().eq('blog_id', id);

  // Delete the blog
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
}));

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Admin
router.get('/analytics', asyncHandler(async (req, res) => {
  const { period = '30' } = req.query;
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - Number(period));

  // Get blog creation trends
  const { data: blogTrends, error: blogError } = await supabase
    .from('blogs')
    .select('created_at, status')
    .gte('created_at', daysAgo.toISOString());

  // Get user registration trends
  const { data: userTrends, error: userError } = await supabase
    .from('user_profiles')
    .select('created_at, role')
    .gte('created_at', daysAgo.toISOString());

  if (blogError || userError) {
    return res.status(500).json({ error: 'Failed to fetch analytics' });
  }

  // Process data for charts
  const blogsByDay = processTrendData(blogTrends || [], 'created_at');
  const usersByDay = processTrendData(userTrends || [], 'created_at');

  res.json({
    success: true,
    data: {
      blogTrends: blogsByDay,
      userTrends: usersByDay,
      summary: {
        totalBlogs: blogTrends?.length || 0,
        totalUsers: userTrends?.length || 0,
        publishedBlogs: blogTrends?.filter(b => b.status === 'published').length || 0,
        premiumUsers: userTrends?.filter(u => u.role === 'premium').length || 0
      }
    }
  });
}));

// Helper function to process trend data
function processTrendData(data: any[], dateField: string) {
  const trends: { [key: string]: number } = {};
  
  data.forEach(item => {
    const date = new Date(item[dateField]).toISOString().split('T')[0];
    trends[date] = (trends[date] || 0) + 1;
  });

  return Object.entries(trends).map(([date, count]) => ({
    date,
    count
  }));
}

export default router;