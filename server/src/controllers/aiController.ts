import { Request, Response } from 'express';
import OpenAI from 'openai';
import { supabase } from '@/config/supabase';
import { AuthRequest } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Generate AI suggestions for blog content
// @route   POST /api/ai/suggestions
// @access  Private
export const generateSuggestions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, content, category } = req.body;

  // Check AI usage limits for non-premium users
  if (req.user!.role !== 'premium' && req.user!.role !== 'admin') {
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('ai_usage_count, ai_usage_reset_date')
      .eq('clerk_id', req.user!.clerkId)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to check AI usage' });
    }

    // Reset usage count if it's a new month
    const resetDate = new Date(userProfile.ai_usage_reset_date);
    const now = new Date();
    if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
      await supabase
        .from('user_profiles')
        .update({
          ai_usage_count: 0,
          ai_usage_reset_date: new Date().toISOString()
        })
        .eq('clerk_id', req.user!.clerkId);
    } else if (userProfile.ai_usage_count >= 5) {
      return res.status(429).json({ 
        error: 'AI usage limit reached. Upgrade to premium for unlimited access.' 
      });
    }
  }

  try {
    // Generate title suggestions
    const titlePrompt = `Generate 4 engaging blog titles for a ${category} article about: ${title}. Make them SEO-friendly and clickable.`;
    const titleResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: titlePrompt }],
      max_tokens: 200,
      temperature: 0.8,
    });

    // Generate content suggestions
    const contentPrompt = `Analyze this blog content and provide 3 specific improvement suggestions: ${content.substring(0, 1000)}`;
    const contentResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: contentPrompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    // Generate SEO tags
    const tagsPrompt = `Generate 8 relevant SEO tags for a ${category} blog post about: ${title}`;
    const tagsResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: tagsPrompt }],
      max_tokens: 100,
      temperature: 0.6,
    });

    // Parse responses
    const titles = titleResponse.choices[0].message.content?.split('\n').filter(t => t.trim()) || [];
    const suggestions = contentResponse.choices[0].message.content?.split('\n').filter(s => s.trim()) || [];
    const tags = tagsResponse.choices[0].message.content?.split(',').map(t => t.trim()) || [];

    // Increment AI usage count for non-premium users
    if (req.user!.role !== 'premium' && req.user!.role !== 'admin') {
      await supabase.rpc('increment_ai_usage', { clerk_user_id: req.user!.clerkId });
    }

    res.json({
      success: true,
      data: {
        titles: titles.slice(0, 4),
        suggestions: suggestions.slice(0, 3),
        tags: tags.slice(0, 8),
        seoScore: Math.floor(Math.random() * 30) + 70, // Mock SEO score
        readabilityScore: Math.floor(Math.random() * 30) + 70, // Mock readability score
      }
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to generate AI suggestions' });
  }
});

// @desc    Generate blog content from prompt
// @route   POST /api/ai/generate
// @access  Private (Premium)
export const generateContent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { prompt, wordCount = 500, tone = 'professional' } = req.body;

  // Check if user has premium access
  if (req.user!.role !== 'premium' && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Premium subscription required for content generation' });
  }

  try {
    const contentPrompt = `Write a ${wordCount}-word blog post with a ${tone} tone about: ${prompt}. 
    Include an engaging introduction, well-structured body paragraphs, and a compelling conclusion. 
    Use markdown formatting for headers and emphasis.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: contentPrompt }],
      max_tokens: Math.min(wordCount * 2, 2000),
      temperature: 0.7,
    });

    const generatedContent = response.choices[0].message.content;

    res.json({
      success: true,
      data: {
        content: generatedContent,
        wordCount: generatedContent?.split(' ').length || 0
      }
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

// @desc    Optimize content for SEO
// @route   POST /api/ai/seo-optimize
// @access  Private
export const optimizeForSEO = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, content, targetKeywords } = req.body;

  try {
    const seoPrompt = `Analyze this blog post for SEO optimization:
    Title: ${title}
    Content: ${content.substring(0, 1500)}
    Target Keywords: ${targetKeywords?.join(', ') || 'N/A'}
    
    Provide specific SEO recommendations including:
    1. Title optimization
    2. Meta description suggestion
    3. Header structure improvements
    4. Keyword density analysis
    5. Content improvements`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: seoPrompt }],
      max_tokens: 500,
      temperature: 0.5,
    });

    const recommendations = response.choices[0].message.content;

    // Calculate mock SEO score based on content analysis
    const seoScore = calculateSEOScore(title, content, targetKeywords);

    res.json({
      success: true,
      data: {
        recommendations,
        seoScore,
        improvements: recommendations?.split('\n').filter(r => r.trim()) || []
      }
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to optimize content for SEO' });
  }
});

// Helper function to calculate SEO score
function calculateSEOScore(title: string, content: string, keywords?: string[]): number {
  let score = 0;
  
  // Title length check
  if (title.length >= 30 && title.length <= 60) score += 20;
  
  // Content length check
  if (content.length >= 300) score += 20;
  
  // Keyword presence
  if (keywords && keywords.length > 0) {
    const keywordPresence = keywords.some(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase()) ||
      content.toLowerCase().includes(keyword.toLowerCase())
    );
    if (keywordPresence) score += 30;
  }
  
  // Headers check (mock)
  const hasHeaders = content.includes('#') || content.includes('<h');
  if (hasHeaders) score += 15;
  
  // Base score
  score += 15;
  
  return Math.min(score, 100);
}