import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Eye, 
  Heart, 
  MessageCircle, 
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react';

const Category: React.FC = () => {
  const { category } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // Mock articles for the category
  const categoryArticles = [
    {
      id: '1',
      title: 'Advanced React Patterns for Large Applications',
      excerpt: 'Learn how to structure React applications using advanced patterns like render props, compound components, and custom hooks.',
      author: 'Sarah Chen',
      publishedAt: '2024-01-16',
      thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 8900,
      likes: 189,
      comments: 28,
      readTime: '12 min',
      tags: ['React', 'JavaScript', 'Architecture']
    },
    {
      id: '2',
      title: 'Building Scalable APIs with Node.js and TypeScript',
      excerpt: 'A comprehensive guide to creating robust, type-safe APIs that can handle millions of requests.',
      author: 'Michael Rodriguez',
      publishedAt: '2024-01-15',
      thumbnail: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 6700,
      likes: 156,
      comments: 19,
      readTime: '15 min',
      tags: ['Node.js', 'TypeScript', 'API']
    },
    {
      id: '3',
      title: 'Modern CSS Grid Techniques for Complex Layouts',
      excerpt: 'Discover advanced CSS Grid techniques that will transform how you approach web layout design.',
      author: 'Emma Thompson',
      publishedAt: '2024-01-14',
      thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      views: 5400,
      likes: 124,
      comments: 15,
      readTime: '8 min',
      tags: ['CSS', 'Grid', 'Layout']
    }
  ];

  const getCategoryInfo = (categorySlug: string) => {
    const categories = {
      'technology': {
        name: 'Technology',
        description: 'Latest trends and insights in technology, software development, and innovation.',
        color: 'bg-blue-500',
        articleCount: 342
      },
      'ai-ml': {
        name: 'AI & Machine Learning',
        description: 'Explore the world of artificial intelligence and machine learning.',
        color: 'bg-purple-500',
        articleCount: 189
      },
      'web-dev': {
        name: 'Web Development',
        description: 'Frontend, backend, and full-stack web development tutorials and guides.',
        color: 'bg-green-500',
        articleCount: 267
      },
      'design': {
        name: 'Design',
        description: 'UI/UX design, graphic design, and creative inspiration.',
        color: 'bg-pink-500',
        articleCount: 156
      },
      'business': {
        name: 'Business',
        description: 'Business strategies, entrepreneurship, and industry insights.',
        color: 'bg-orange-500',
        articleCount: 198
      },
      'lifestyle': {
        name: 'Lifestyle',
        description: 'Personal development, productivity, and life improvement tips.',
        color: 'bg-indigo-500',
        articleCount: 88
      }
    };

    return categories[categorySlug as keyof typeof categories] || {
      name: 'Unknown Category',
      description: 'Articles in this category.',
      color: 'bg-gray-500',
      articleCount: 0
    };
  };

  const categoryInfo = getCategoryInfo(category || '');

  const filteredArticles = categoryArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      case 'recent':
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${categoryInfo.color} mb-6`}>
            <span className="text-2xl font-bold text-white">
              {categoryInfo.name[0]}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryInfo.name}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            {categoryInfo.description}
          </p>
          <Badge variant="secondary" className="text-sm">
            {categoryInfo.articleCount} articles
          </Badge>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search articles in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Most Recent
                </div>
              </SelectItem>
              <SelectItem value="popular">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Most Popular
                </div>
              </SelectItem>
              <SelectItem value="likes">
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  Most Liked
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 h-full">
                <div className="relative overflow-hidden">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-background/90 text-foreground border">
                      {article.readTime}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="p-6">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-muted-foreground">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="px-6 pb-6">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>By {article.author}</span>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{article.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{article.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{article.comments}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {sortedArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? `No articles match "${searchQuery}" in this category.`
                : 'This category doesn\'t have any articles yet.'
              }
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </motion.div>
        )}

        {/* Load More */}
        {sortedArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Category;