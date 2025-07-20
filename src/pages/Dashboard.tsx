import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  PenTool, 
  Eye, 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Clock, 
  Star,
  Edit,
  Trash2,
  BarChart3,
  Users,
  Sparkles,
  Crown,
  Target
} from 'lucide-react';

// Mock data for user's articles
const mockArticles = [
  {
    id: '1',
    title: 'The Future of AI in Content Creation',
    status: 'published',
    publishedAt: '2024-01-15',
    views: 12500,
    likes: 245,
    comments: 32,
    category: 'AI & ML',
    readTime: '8 min'
  },
  {
    id: '2',
    title: 'Building Scalable React Applications',
    status: 'pending',
    publishedAt: null,
    views: 0,
    likes: 0,
    comments: 0,
    category: 'Web Development',
    readTime: '12 min'
  },
  {
    id: '3',
    title: 'Design Systems Best Practices',
    status: 'draft',
    publishedAt: null,
    views: 0,
    likes: 0,
    comments: 0,
    category: 'Design',
    readTime: '6 min'
  }
];

const mockStats = {
  totalViews: 45600,
  totalLikes: 892,
  totalComments: 156,
  totalFollowers: 234,
  articlesPublished: 12,
  averageReadTime: '7.5 min'
};

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [articles] = useState(mockArticles);
  const [activeTab, setActiveTab] = useState('overview');

  const aiUsageCount = user?.publicMetadata?.aiUsageCount as number || 0;
  const isContentCreator = user?.publicMetadata?.plan === 'premium';
  const aiUsagePercentage = (aiUsageCount / 5) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'pending': return 'secondary';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground">
              Manage your articles, track performance, and grow your audience.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {isContentCreator && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Premium Creator
              </Badge>
            )}
            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <Link to="/create">
                <PenTool className="h-4 w-4 mr-2" />
                New Article
              </Link>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* AI Usage Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI Assistant Usage
                  </CardTitle>
                  <CardDescription>
                    {isContentCreator 
                      ? 'Unlimited AI features with Premium plan'
                      : `${5 - aiUsageCount} AI suggestions remaining this month`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isContentCreator ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Monthly Usage</span>
                        <span className="font-medium">{aiUsageCount}/5</span>
                      </div>
                      <Progress value={aiUsagePercentage} className="h-2" />
                      {aiUsageCount >= 5 && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Upgrade to Premium for unlimited AI features
                          </p>
                          <Button size="sm" asChild>
                            <Link to="/pricing">Upgrade</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-500" />
                        <span className="font-medium">Premium Features Unlocked</span>
                      </div>
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        Unlimited
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Total Views',
                  value: mockStats.totalViews.toLocaleString(),
                  icon: Eye,
                  change: '+12.5%'
                },
                {
                  title: 'Total Likes',
                  value: mockStats.totalLikes.toLocaleString(),
                  icon: Heart,
                  change: '+8.2%'
                },
                {
                  title: 'Comments',
                  value: mockStats.totalComments.toLocaleString(),
                  icon: MessageCircle,
                  change: '+15.3%'
                },
                {
                  title: 'Followers',
                  value: mockStats.totalFollowers.toLocaleString(),
                  icon: Users,
                  change: '+5.7%'
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">{stat.change}</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Articles</CardTitle>
                <CardDescription>
                  Your latest published and draft articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.slice(0, 3).map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{article.title}</h3>
                          <Badge variant={getStatusVariant(article.status)}>
                            {article.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{article.category}</span>
                          <span>{article.readTime}</span>
                          {article.publishedAt && (
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      
                      {article.status === 'published' && (
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mr-4">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{article.likes}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/edit/${article.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Articles</h2>
              <Button asChild>
                <Link to="/create">
                  <PenTool className="h-4 w-4 mr-2" />
                  Create New
                </Link>
              </Button>
            </div>

            <div className="grid gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{article.title}</CardTitle>
                            <Badge variant={getStatusVariant(article.status)}>
                              {article.status}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-4">
                            <span>{article.category}</span>
                            <span>{article.readTime}</span>
                            {article.publishedAt && (
                              <span>Published {new Date(article.publishedAt).toLocaleDateString()}</span>
                            )}
                          </CardDescription>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/edit/${article.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          {article.status === 'published' && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/blog/${article.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {article.status === 'published' && (
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-primary">{article.views.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Views</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{article.likes}</div>
                            <div className="text-sm text-muted-foreground">Likes</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary">{article.comments}</div>
                            <div className="text-sm text-muted-foreground">Comments</div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Articles</span>
                      <span className="font-medium">{mockStats.articlesPublished}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Read Time</span>
                      <span className="font-medium">{mockStats.averageReadTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement Rate</span>
                      <span className="font-medium">12.4%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Growth Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monthly Growth</span>
                      <span className="font-medium text-green-600">+24.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Followers</span>
                      <span className="font-medium">+89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reach</span>
                      <span className="font-medium">67.2K</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Articles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles
                    .filter(article => article.status === 'published')
                    .sort((a, b) => b.views - a.views)
                    .map((article, index) => (
                      <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <div>
                            <h3 className="font-medium">{article.title}</h3>
                            <p className="text-sm text-muted-foreground">{article.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{article.views.toLocaleString()} views</div>
                          <div className="text-sm text-muted-foreground">{article.likes} likes</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Subscription Status</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {isContentCreator ? 'Premium Plan' : 'Free Plan'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isContentCreator 
                          ? 'Unlimited AI features and priority support'
                          : `${5 - aiUsageCount} AI suggestions remaining`
                        }
                      </div>
                    </div>
                    {!isContentCreator && (
                      <Button asChild>
                        <Link to="/pricing">
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Notification Preferences</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Email notifications for comments</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span>Email notifications for likes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span>Weekly performance digest</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;