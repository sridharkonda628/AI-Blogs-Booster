import express from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '@/config/supabase';
import { asyncHandler } from '@/middleware/errorHandler';

const router = express.Router();

// @desc    Authenticate user with Clerk
// @route   POST /api/auth/clerk
// @access  Public
router.post('/clerk', asyncHandler(async (req, res) => {
  const { clerkId, email, firstName, lastName, imageUrl } = req.body;

  if (!clerkId || !email) {
    return res.status(400).json({ error: 'Clerk ID and email are required' });
  }

  // Check if user exists
  let { data: user, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  // Create user if doesn't exist
  if (error && error.code === 'PGRST116') {
    const userData = {
      clerk_id: clerkId,
      email,
      name: `${firstName || ''} ${lastName || ''}`.trim() || email.split('@')[0],
      avatar: imageUrl,
      role: 'user',
      ai_usage_count: 0,
      ai_usage_reset_date: new Date().toISOString()
    };

    const { data: newUser, error: createError } = await supabase
      .from('user_profiles')
      .insert([userData])
      .select()
      .single();

    if (createError) {
      return res.status(500).json({ error: 'Failed to create user profile' });
    }

    user = newUser;
  } else if (error) {
    return res.status(500).json({ error: 'Database error' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      clerkId: user.clerk_id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      clerkId: user.clerk_id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      aiUsageCount: user.ai_usage_count
    }
  });
}));

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', asyncHandler(async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const { data: user, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_id', decoded.clerkId)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        clerkId: user.clerk_id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        aiUsageCount: user.ai_usage_count
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}));

export default router;