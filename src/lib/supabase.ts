import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Blog {
  id: string
  title: string
  content: string
  excerpt: string
  author_id: string
  author_name: string
  author_avatar?: string
  category: string
  tags: string[]
  thumbnail?: string
  status: 'draft' | 'pending' | 'published' | 'rejected'
  views: number
  likes: number
  comments_count: number
  created_at: string
  updated_at: string
  published_at?: string
}

export interface Comment {
  id: string
  blog_id: string
  author_id: string
  author_name: string
  author_avatar?: string
  content: string
  likes: number
  created_at: string
}

export interface UserProfile {
  id: string
  clerk_id: string
  email: string
  name: string
  avatar?: string
  bio?: string
  role: 'user' | 'premium' | 'admin'
  ai_usage_count: number
  ai_usage_reset_date: string
  created_at: string
}

// Blog operations
export const blogService = {
  async getBlogs(filters?: { category?: string; status?: string; limit?: number }) {
    let query = supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getBlogById(id: string) {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createBlog(blog: Omit<Blog, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'comments_count'>) {
    const { data, error } = await supabase
      .from('blogs')
      .insert([blog])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateBlog(id: string, updates: Partial<Blog>) {
    const { data, error } = await supabase
      .from('blogs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteBlog(id: string) {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async incrementViews(id: string) {
    const { error } = await supabase.rpc('increment_blog_views', { blog_id: id })
    if (error) throw error
  },

  async toggleLike(blogId: string, userId: string) {
    const { error } = await supabase.rpc('toggle_blog_like', { 
      blog_id: blogId, 
      user_id: userId 
    })
    if (error) throw error
  }
}

// Comment operations
export const commentService = {
  async getComments(blogId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('blog_id', blogId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async createComment(comment: Omit<Comment, 'id' | 'created_at' | 'likes'>) {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// User operations
export const userService = {
  async getUserProfile(clerkId: string) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async createUserProfile(profile: Omit<UserProfile, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateUserProfile(clerkId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('clerk_id', clerkId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async incrementAIUsage(clerkId: string) {
    const { error } = await supabase.rpc('increment_ai_usage', { 
      clerk_user_id: clerkId 
    })
    if (error) throw error
  }
}