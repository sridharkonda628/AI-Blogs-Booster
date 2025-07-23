import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Database types
export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  status: 'draft' | 'pending' | 'published' | 'rejected';
  views: number;
  likes: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface Comment {
  id: string;
  blog_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  likes: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  clerk_id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'premium' | 'admin';
  ai_usage_count: number;
  ai_usage_reset_date: string;
  created_at: string;
}