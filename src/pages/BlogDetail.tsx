import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Eye, 
  Clock, 
  Calendar,
  User,
  ThumbsUp,
  Flag,
  Edit
} from 'lucide-react';
import { toast } from 'sonner';

// Mock blog data
const mockBlog = {
  id: '1',
  title: 'The Future of AI in Content Creation: A Deep Dive',
  content: `# Introduction

Artificial Intelligence has revolutionized many industries, and content creation is no exception. In this comprehensive guide, we'll explore how AI is transforming the way we create, optimize, and distribute content across digital platforms.

## The Current State of AI in Content Creation

Today's AI tools can help writers in numerous ways:

### 1. Content Generation
AI can generate initial drafts, headlines, and even complete articles based on prompts and guidelines.

### 2. SEO Optimization
Modern AI tools analyze search trends and optimize content for better search engine visibility.

### 3. Style and Tone Adjustment
AI can adapt content to match specific brand voices and target audience preferences.

## Real-World Applications

Many successful companies are already leveraging AI for content creation:

- **Marketing Teams**: Using AI to generate social media posts and email campaigns
- **Publishers**: Automating news summaries and generating data-driven articles
- **E-commerce**: Creating product descriptions at scale

## Best Practices for AI-Assisted Writing

1. **Human Oversight**: Always review and edit AI-generated content
2. **Brand Consistency**: Ensure AI outputs align with your brand voice
3. **Fact-Checking**: Verify information and claims made by AI
4. **Originality**: Use AI as a starting point, not the final product

## The Future Outlook

As AI technology continues to advance, we can expect:

- More sophisticated understanding of context and nuance
- Better integration with existing content management systems
- Enhanced personalization capabilities
- Improved multilingual content generation

## Conclusion

AI in content creation is not about replacing human writers but augmenting their capabilities. The future belongs to creators who can effectively collaborate with AI tools to produce higher quality content at scale.`,
  excerpt: 'Exploring how artificial intelligence is revolutionizing the way we create, optimize, and distribute content across digital platforms.',
  author: {
    id: 'user_1',
    name: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    bio: 'AI researcher and content strategist with 8+ years of experience in digital marketing.',
    verified: true
  },
  publishedAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T15:45:00Z',
  category: 'AI & ML',
  tags: ['AI', 'Content', 'Future', 'Technology'],
  thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200',
  stats: {
    views: 12500,
    likes: 245,
    comments: 32,
    bookmarks: 89,
    shares: 56
  },
  readTime: '8 min',
  status: 'published'
};

const mockComments = [
  {
    id: '1',
    author: {
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    content: 'Great article! Really insightful perspective on AI in content creation. I especially found the section on best practices helpful.',
    publishedAt: '2024-01-15T14:20:00Z',
    likes: 12,
    replies: 2
  },
  {
    id: '2',
    author: {
      name: 'Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    content: 'The future outlook section is particularly interesting. Do you have any specific AI tools you\'d recommend for beginners?',
    publishedAt: '2024-01-15T16:45:00Z',
    likes: 8,
    replies: 1
  }
];

const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const { user, isSignedIn } = useUser();
  const [blog, setBlog] = useState(mockBlog);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In real app, fetch blog data by ID
    // For now, we'll use mock data
    const fetchBlog = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    fetchBlog();
  }, [id]);

  const handleLike = () => {
    if (!isSignedIn) {
      toast.error('Please sign in to like this article');
      return;
    }
    setIsLiked(!isLiked);
    setBlog(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        likes: isLiked ? prev.stats.likes - 1 : prev.stats.likes + 1
      }
    }));
    toast.success(isLiked ? 'Like removed' : 'Article liked!');
  };

  const handleBookmark = () => {
    if (!isSignedIn) {
      toast.error('Please sign in to bookmark this article');
      return;
    }
    setIsBookmarked(!isBookmarked);
    setBlog(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        bookmarks: isBookmarked ? prev.stats.bookmarks - 1 : prev.stats.bookmarks + 1
      }
    }));
    toast.success(isBookmarked ? 'Bookmark removed' : 'Article bookmarked!');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleComment = () => {
    if (!isSignedIn) {
      toast.error('Please sign in to comment');
      return;
    }
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      author: {
        name: user?.firstName + ' ' + user?.lastName || 'Anonymous',
        avatar: user?.imageUrl || ''
      },
      content: newComment,
      publishedAt: new Date().toISOString(),
      likes: 0,
      replies: 0
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setBlog(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        comments: prev.stats.comments + 1
      }
    }));
    toast.success('Comment posted!');
  };

  const canEdit = isSignedIn && (user?.id === blog.author.id || user?.publicMetadata?.role === 'admin');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white"
            >
              <Badge className="mb-4 bg-primary/90">
                {blog.category}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {blog.title}
              </h1>
              <p className="text-xl text-gray-200 mb-6 max-w-3xl">
                {blog.excerpt}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="mb-8">
              <CardHeader className="pb-6">
                {/* Author Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                      <AvatarFallback>{blog.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{blog.author.name}</h3>
                        {blog.author.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{blog.author.bio}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{blog.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{blog.stats.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {canEdit && (
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/edit/${blog.id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Engagement Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      className="flex items-center space-x-2"
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{blog.stats.likes}</span>
                    </Button>

                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {blog.stats.comments}
                    </Button>

                    <Button
                      variant={isBookmarked ? "default" : "outline"}
                      size="sm"
                      onClick={handleBookmark}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </Button>

                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {blog.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {blog.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Comments ({comments.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Comment */}
                {isSignedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
                        <AvatarFallback>
                          {user?.firstName?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Share your thoughts..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button onClick={handleComment} disabled={!newComment.trim()}>
                            Post Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Sign in to join the conversation</p>
                    <Button variant="outline">Sign In</Button>
                  </div>
                )}

                <Separator />

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-4"
                    >
                      <Avatar>
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{comment.author.name}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(comment.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{comment.content}</p>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {comment.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            Reply
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>About the Author</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <Avatar className="h-20 w-20 mx-auto">
                    <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                    <AvatarFallback className="text-xl">{blog.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{blog.author.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{blog.author.bio}</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Follow
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Article Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Views</span>
                  <span className="font-medium">{blog.stats.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Likes</span>
                  <span className="font-medium">{blog.stats.likes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Comments</span>
                  <span className="font-medium">{blog.stats.comments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Bookmarks</span>
                  <span className="font-medium">{blog.stats.bookmarks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Shares</span>
                  <span className="font-medium">{blog.stats.shares}</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Related Articles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="font-medium text-sm leading-tight">
                      <Link to={`/blog/${i + 1}`} className="hover:text-primary transition-colors">
                        Related Article Title {i}
                      </Link>
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Brief description of the related article...
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;