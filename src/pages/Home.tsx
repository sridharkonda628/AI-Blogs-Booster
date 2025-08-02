import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  Clock, 
  Star, 
  Eye, 
  Heart, 
  MessageCircle, 
  Search,
  Sparkles,
  Zap,
  Users,
  BarChart3
} from 'lucide-react';

// Mock data for demonstration
const featuredBlogs = [
  {
    id: '1',
    title: 'The Future of AI in Content Creation: A Deep Dive',
    excerpt: 'Exploring how artificial intelligence is revolutionizing the way we create, optimize, and distribute content across digital platforms.',
    author: 'Sarah Chen',
    publishedAt: '2024-01-15',
    category: 'AI & ML',
    thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    views: 12500,
    likes: 245,
    comments: 32,
    readTime: '8 min',
    tags: ['AI', 'Content', 'Future'],
    featured: true
  },
  {
    id: '2',
    title: 'Building Scalable React Applications with Modern Architecture',
    excerpt: 'Learn advanced patterns and best practices for creating maintainable React applications that can grow with your business needs.',
    author: 'Michael Rodriguez',
    publishedAt: '2024-01-14',
    category: 'Web Development',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    views: 8900,
    likes: 189,
    comments: 28,
    readTime: '12 min',
    tags: ['React', 'Architecture', 'JavaScript'],
    featured: true
  },
  {
    id: '3',
    title: 'Design Systems That Scale: A Comprehensive Guide',
    excerpt: 'Discover how to create design systems that maintain consistency across large organizations while remaining flexible and efficient.',
    author: 'Emma Thompson',
    publishedAt: '2024-01-13',
    category: 'Design',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    views: 6700,
    likes: 156,
    comments: 19,
    readTime: '10 min',
    tags: ['Design', 'Systems', 'UI/UX'],
    featured: false
  }
];

const categories = [
  { name: 'All', count: 1240 },
  { name: 'Technology', count: 342 },
  { name: 'AI & ML', count: 189 },
  { name: 'Web Development', count: 267 },
  { name: 'Design', count: 156 },
  { name: 'Business', count: 198 },
  { name: 'Lifestyle', count: 88 }
];

const stats = [
  { label: 'Articles Published', value: '12,456', icon: BarChart3 },
  { label: 'Active Writers', value: '3,290', icon: Users },
  { label: 'Monthly Readers', value: '89.2K', icon: Eye },
  { label: 'AI Optimizations', value: '45,670', icon: Sparkles }
];

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('trending');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Blogs Booster
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Supercharge Your Content Creation. Boost your blogging with AI-powered tools, intelligent suggestions, and advanced SEO optimization. 
              Join thousands of creators amplifying their reach with AI Blogs Booster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8">
                <Zap className="h-5 w-5 mr-2" />
                Start Writing
              </Button>
              <Button size="lg" variant="outline">
                Explore Articles
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search articles, topics, or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg bg-background border-border/50 focus:border-primary"
                />
                <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  Search
                </Button>
              </div>
            </form>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.name)}
                  className="rounded-full"
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Articles</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the most popular and trending articles from our community of creators.
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Popular
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="space-y-0">
              <BlogGrid blogs={featuredBlogs} />
            </TabsContent>

            <TabsContent value="recent" className="space-y-0">
              <BlogGrid blogs={[...featuredBlogs].reverse()} />
            </TabsContent>

            <TabsContent value="popular" className="space-y-0">
              <BlogGrid blogs={[...featuredBlogs].sort((a, b) => b.views - a.views)} />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Start Creating?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community of writers and start creating content with AI-powered tools and insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Link to="/create">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Create Your First Article
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">View Pricing Plans</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

// Blog Grid Component
const BlogGrid: React.FC<{ blogs: typeof featuredBlogs }> = ({ blogs }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog, index) => (
        <motion.div
          key={blog.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
            <div className="relative overflow-hidden">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary/90 text-primary-foreground">
                  {blog.category}
                </Badge>
              </div>
              {blog.featured && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
            
            <CardHeader className="p-6">
              <div className="flex flex-wrap gap-1 mb-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
              </CardTitle>
              <CardDescription className="line-clamp-3 text-muted-foreground">
                {blog.excerpt}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-6 pb-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>By {blog.author}</span>
                <span>{blog.readTime} read</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{blog.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{blog.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{blog.comments}</span>
                  </div>
                </div>
                <span className="text-muted-foreground">
                  {new Date(blog.publishedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default Home;