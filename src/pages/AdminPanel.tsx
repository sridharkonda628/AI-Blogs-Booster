import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  FileText, 
  Flag,
  Shield,
  Eye,
  Trash2,
  Edit,
  Search,
  Filter,
  Crown,
  Settings,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for pending articles
const mockPendingArticles = [
  {
    id: '1',
    title: 'Understanding Modern JavaScript Frameworks',
    author: 'John Smith',
    authorId: 'user_1',
    category: 'Web Development',
    submittedAt: '2024-01-16T10:30:00Z',
    wordCount: 1250,
    status: 'pending',
    flagged: false,
    excerpt: 'A comprehensive guide to choosing the right JavaScript framework for your next project.'
  },
  {
    id: '2',
    title: 'AI Ethics in Content Generation',
    author: 'Sarah Wilson',
    authorId: 'user_2',
    category: 'AI & ML',
    submittedAt: '2024-01-16T09:15:00Z',
    wordCount: 890,
    status: 'pending',
    flagged: true,
    excerpt: 'Exploring the ethical implications of using AI for automated content creation.'
  },
  {
    id: '3',
    title: 'The Future of Remote Work',
    author: 'Mike Johnson',
    authorId: 'user_3',
    category: 'Business',
    submittedAt: '2024-01-15T16:45:00Z',
    wordCount: 1680,
    status: 'pending',
    flagged: false,
    excerpt: 'How remote work is reshaping the business landscape and what it means for companies.'
  }
];

// Mock user data
const mockUsers = [
  {
    id: 'user_1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    joinedAt: '2024-01-10',
    articlesCount: 12,
    aiUsageCount: 3
  },
  {
    id: 'user_2',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'premium',
    status: 'active',
    joinedAt: '2024-01-08',
    articlesCount: 28,
    aiUsageCount: 15
  },
  {
    id: 'user_3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'user',
    status: 'suspended',
    joinedAt: '2024-01-12',
    articlesCount: 5,
    aiUsageCount: 5
  }
];

const AdminPanel: React.FC = () => {
  const { user } = useUser();
  const [pendingArticles, setPendingArticles] = useState(mockPendingArticles);
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('articles');

  // Get admin info
  const adminName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Admin';
  const adminEmail = user?.emailAddresses?.[0]?.emailAddress || '';

  const handleApproveArticle = (articleId: string) => {
    setPendingArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, status: 'approved' }
          : article
      ).filter(article => article.status !== 'approved')
    );
    toast.success('Article approved and published!');
  };

  const handleRejectArticle = (articleId: string) => {
    setPendingArticles(prev => 
      prev.filter(article => article.id !== articleId)
    );
    toast.success('Article rejected and removed from queue.');
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
          : user
      )
    );
    toast.success('User status updated.');
  };

  const handlePromoteUser = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, role: user.role === 'user' ? 'premium' : 'user' }
          : user
      )
    );
    toast.success('User role updated.');
  };

  const filteredArticles = pendingArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'flagged' && article.flagged) ||
                         (filterStatus === 'normal' && !article.flagged);
    return matchesSearch && matchesFilter;
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    pendingArticles: pendingArticles.length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    flaggedContent: pendingArticles.filter(a => a.flagged).length
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Admin Control Panel
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {adminName}! Manage content, users, and platform analytics.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Alert className="max-w-sm">
              <Crown className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Admin Session Active</strong><br />
                All actions are logged for security
              </AlertDescription>
            </Alert>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Pending Articles',
              value: stats.pendingArticles,
              icon: Clock,
              color: 'text-yellow-600'
            },
            {
              title: 'Total Users',
              value: stats.totalUsers,
              icon: Users,
              color: 'text-blue-600'
            },
            {
              title: 'Active Users',
              value: stats.activeUsers,
              icon: CheckCircle,
              color: 'text-green-600'
            },
            {
              title: 'Flagged Content',
              value: stats.flaggedContent,
              icon: Flag,
              color: 'text-red-600'
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
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="articles">Content Moderation</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation Queue</CardTitle>
                <CardDescription>
                  Review and moderate articles before they go live
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search articles or authors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Articles</SelectItem>
                      <SelectItem value="flagged">Flagged Content</SelectItem>
                      <SelectItem value="normal">Normal Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-6 space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{article.title}</h3>
                            {article.flagged && (
                              <Badge variant="destructive">
                                <Flag className="h-3 w-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                            <Badge variant="outline">{article.category}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{article.excerpt}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>By {article.author}</span>
                            <span>{article.wordCount} words</span>
                            <span>Submitted {new Date(article.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button 
                          size="sm" 
                          onClick={() => handleApproveArticle(article.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRejectArticle(article.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </motion.div>
                  ))}

                  {filteredArticles.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No articles found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery ? 'Try adjusting your search terms.' : 'All articles have been reviewed.'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                          <Badge variant={user.role === 'premium' ? 'secondary' : 'outline'}>
                            {user.role}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>{user.email}</p>
                          <p>Joined {new Date(user.joinedAt).toLocaleDateString()} • {user.articlesCount} articles • {user.aiUsageCount} AI uses</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={user.status === 'active' ? 'destructive' : 'default'}
                          onClick={() => handleToggleUserStatus(user.id)}
                        >
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePromoteUser(user.id)}
                        >
                          {user.role === 'user' ? 'Promote' : 'Demote'}
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Articles</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Published Today</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Processing Time</span>
                      <span className="font-medium">2.3 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approval Rate</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>New Signups (30d)</span>
                      <span className="font-medium">342</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Writers</span>
                      <span className="font-medium">1,089</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Subscribers</span>
                      <span className="font-medium">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Retention Rate</span>
                      <span className="font-medium">87.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Article approved', user: 'Admin', time: '2 minutes ago', type: 'success' },
                    { action: 'User reported content', user: 'System', time: '15 minutes ago', type: 'warning' },
                    { action: 'New user registered', user: 'System', time: '1 hour ago', type: 'info' },
                    { action: 'Article rejected', user: 'Admin', time: '2 hours ago', type: 'error' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' :
                          activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">by {activity.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;