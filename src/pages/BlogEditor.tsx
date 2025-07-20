import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Save, 
  Eye, 
  Sparkles, 
  Image, 
  Hash, 
  TrendingUp, 
  Target, 
  Zap,
  AlertTriangle,
  Crown,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';

const BlogEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('write');

  // AI Usage tracking
  const aiUsageCount = user?.publicMetadata?.aiUsageCount as number || 0;
  const isContentCreator = user?.publicMetadata?.plan === 'premium';
  const canUseAI = isContentCreator || aiUsageCount < 5;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    thumbnail: '',
    status: 'draft' as 'draft' | 'published' | 'pending'
  });

  // AI suggestions state
  const [aiSuggestions, setAiSuggestions] = useState({
    titles: [] as string[],
    thumbnails: [] as string[],
    tags: [] as string[],
    seoScore: 0,
    readabilityScore: 0,
    suggestions: [] as string[]
  });

  useEffect(() => {
    if (id) {
      // Load existing blog post
      loadBlogPost(id);
    }
  }, [id]);

  const loadBlogPost = async (blogId: string) => {
    // Mock loading existing blog post
    setIsLoading(true);
    setTimeout(() => {
      setFormData({
        title: 'Sample Blog Post',
        content: 'This is a sample blog post content...',
        excerpt: 'This is a sample excerpt',
        category: 'technology',
        tags: 'react, javascript, web development',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
        status: 'draft'
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateAISuggestions = async () => {
    if (!canUseAI) {
      toast.error('AI features are limited. Upgrade to premium for unlimited access.');
      return;
    }

    setIsLoading(true);
    try {
      // Mock AI suggestions - in real app, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAiSuggestions({
        titles: [
          'The Ultimate Guide to ' + formData.title,
          '10 Essential Tips for ' + formData.title,
          'Master ' + formData.title + ': A Complete Tutorial',
          'Everything You Need to Know About ' + formData.title
        ],
        thumbnails: [
          'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
          'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
          'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg'
        ],
        tags: ['trending', 'popular', 'beginner-friendly', 'advanced', 'tutorial'],
        seoScore: 85,
        readabilityScore: 78,
        suggestions: [
          'Add more subheadings to improve readability',
          'Include relevant keywords in the first paragraph',
          'Consider adding internal links to related articles',
          'Optimize meta description for better SEO'
        ]
      });

      // Increment AI usage count
      // In real app, you'd update this in your user metadata
      toast.success('AI suggestions generated successfully!');
    } catch (error) {
      toast.error('Failed to generate AI suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published' | 'pending') => {
    setIsLoading(true);
    try {
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedData = { ...formData, status };
      
      if (status === 'published') {
        toast.success('Blog post published successfully!');
        navigate('/dashboard');
      } else if (status === 'pending') {
        toast.success('Blog post submitted for review!');
        navigate('/dashboard');
      } else {
        toast.success('Blog post saved as draft!');
      }
    } catch (error) {
      toast.error('Failed to save blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    'technology', 'ai-ml', 'web-development', 'design', 'business', 'lifestyle'
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {id ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className="text-muted-foreground">
              Use AI-powered tools to create engaging content with SEO optimization
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* AI Usage Badge */}
            <Badge variant={canUseAI ? "secondary" : "destructive"} className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {isContentCreator ? (
                <>
                  <Crown className="h-3 w-3" />
                  Unlimited AI
                </>
              ) : (
                `AI: ${aiUsageCount}/5`
              )}
            </Badge>
            
            <Button 
              variant="outline" 
              onClick={() => handleSave('draft')}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            
            <Button 
              onClick={() => handleSave('pending')}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isLoading ? 'Publishing...' : 'Submit for Review'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="seo">
                  <Target className="h-4 w-4 mr-2" />
                  SEO
                </TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter article title..."
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="text-lg font-medium"
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        placeholder="Brief description of your article..."
                        value={formData.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                          id="tags"
                          placeholder="react, javascript, tutorial"
                          value={formData.tags}
                          onChange={(e) => handleInputChange('tags', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="thumbnail">Thumbnail URL</Label>
                      <Input
                        id="thumbnail"
                        placeholder="https://example.com/image.jpg"
                        value={formData.thumbnail}
                        onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                    <CardDescription>
                      Write your article content using Markdown syntax
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Start writing your amazing article..."
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      rows={20}
                      className="font-mono"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-invert max-w-none">
                      <h1>{formData.title || 'Your Article Title'}</h1>
                      <p className="text-muted-foreground">{formData.excerpt}</p>
                      {formData.thumbnail && (
                        <img src={formData.thumbnail} alt="Thumbnail" className="rounded-lg" />
                      )}
                      <div className="whitespace-pre-wrap">{formData.content}</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>SEO Analysis</CardTitle>
                      <CardDescription>
                        Optimize your content for better search engine visibility
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>SEO Score</Label>
                          <div className="flex items-center space-x-2">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${aiSuggestions.seoScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{aiSuggestions.seoScore}/100</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Readability Score</Label>
                          <div className="flex items-center space-x-2">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${aiSuggestions.readabilityScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{aiSuggestions.readabilityScore}/100</span>
                          </div>
                        </div>
                      </div>

                      {aiSuggestions.suggestions.length > 0 && (
                        <div>
                          <Label>Optimization Suggestions</Label>
                          <div className="space-y-2 mt-2">
                            {aiSuggestions.suggestions.map((suggestion, index) => (
                              <Alert key={index}>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{suggestion}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Assistant
                </CardTitle>
                <CardDescription>
                  Get intelligent suggestions to improve your content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!canUseAI && (
                  <Alert className="border-orange-500/50 bg-orange-500/10">
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      You've reached your AI usage limit. 
                      <Button variant="link" className="p-0 h-auto font-medium text-orange-500">
                        Upgrade to Premium
                      </Button>
                      for unlimited access.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={generateAISuggestions} 
                  disabled={isLoading || !canUseAI}
                  className="w-full"
                  variant={canUseAI ? "default" : "secondary"}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isLoading ? 'Generating...' : 'Generate AI Suggestions'}
                </Button>

                {/* Title Suggestions */}
                {aiSuggestions.titles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      Title Suggestions
                    </Label>
                    <div className="space-y-2">
                      {aiSuggestions.titles.map((title, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => handleInputChange('title', title)}
                        >
                          <span className="text-sm">{title}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Thumbnail Suggestions */}
                {aiSuggestions.thumbnails.length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <Image className="h-4 w-4" />
                      Trending Thumbnails
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {aiSuggestions.thumbnails.map((thumbnail, index) => (
                        <button
                          key={index}
                          onClick={() => handleInputChange('thumbnail', thumbnail)}
                          className="relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                        >
                          <img
                            src={thumbnail}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tag Suggestions */}
                {aiSuggestions.tags.length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Trending Tags
                    </Label>
                    <div className="flex flex-wrap gap-1">
                      {aiSuggestions.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => {
                            const currentTags = formData.tags ? formData.tags.split(',').map(t => t.trim()) : [];
                            if (!currentTags.includes(tag)) {
                              const newTags = [...currentTags, tag].join(', ');
                              handleInputChange('tags', newTags);
                            }
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Save className="h-4 w-4 mr-2" />
                  Auto-save enabled
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Word count: {formData.content.split(' ').length}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;