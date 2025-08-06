# AI Blogs Booster - Admin Guide

## 🔐 Admin Access Setup

### Step 1: Create Admin User
1. **Sign up normally** through the application
2. **Get your Clerk User ID** from Clerk Dashboard
3. **Manually set admin role** in Supabase database

### Step 2: Set Admin Role in Database
```sql
-- In Supabase SQL Editor, run this query:
UPDATE user_profiles 
SET role = 'admin' 
WHERE clerk_id = 'your_clerk_user_id_here';
```

### Step 3: Update Clerk Metadata (Optional)
In Clerk Dashboard:
1. Go to Users → Select your user
2. Add to Public Metadata:
```json
{
  "role": "admin"
}
```

## 🛡️ Admin Features Overview

### 1. Content Moderation
- **Review pending articles** before publication
- **Approve or reject** submitted content
- **Edit articles** directly
- **Delete inappropriate** content
- **Flag management** system

### 2. User Management
- **View all users** with detailed information
- **Change user roles** (user → premium → admin)
- **Suspend/activate** user accounts
- **Monitor user activity** and statistics
- **AI usage tracking** per user

### 3. Analytics Dashboard
- **Platform statistics** (users, articles, engagement)
- **Content trends** and popular categories
- **User growth metrics**
- **Revenue tracking** (premium subscriptions)
- **System health monitoring**

### 4. System Administration
- **Database management** through Supabase
- **API monitoring** and logs
- **Performance metrics**
- **Security alerts**

## 🚀 How to Access Admin Panel

### Method 1: Direct URL
1. Login as admin user
2. Navigate to: `http://localhost:5173/admin`
3. Admin panel will load automatically

### Method 2: Header Navigation
1. Login as admin user
2. Look for **"Admin"** button in header
3. Click to access admin panel

### Method 3: Dashboard Link
1. Go to your user dashboard
2. Admin users see additional admin options
3. Click admin-specific navigation items

## 📋 Admin Workflow: Article Approval

### 1. Content Submission Flow
```
User writes article → Submits for review → Status: "pending"
                                              ↓
Admin reviews → Approve/Reject → Status: "published"/"rejected"
```

### 2. Review Process
1. **Access Moderation Queue**:
   - Go to Admin Panel → Content Moderation
   - View all pending articles

2. **Review Article**:
   - Read title, content, and metadata
   - Check for policy violations
   - Verify content quality

3. **Take Action**:
   - **Approve**: Article goes live immediately
   - **Reject**: Article removed from queue
   - **Edit**: Make changes before approval

### 3. Bulk Operations
- **Select multiple articles** for batch approval
- **Filter by category** or author
- **Search specific content**
- **Sort by submission date**

## 👥 User Management Features

### 1. User Roles
- **User**: Basic access, limited AI usage
- **Premium**: Unlimited AI, advanced features
- **Admin**: Full system access

### 2. Role Management
```javascript
// Admin can change user roles via API
PUT /api/admin/users/:id/role
{
  "role": "premium" // or "user", "admin"
}
```

### 3. User Actions
- **View user profile** and activity
- **Check AI usage** statistics
- **Monitor content creation**
- **Handle user reports**

## 📊 Analytics & Reporting

### 1. Dashboard Metrics
- **Total Users**: All registered users
- **Active Users**: Users active in last 30 days
- **Content Stats**: Articles, comments, likes
- **Revenue**: Premium subscriptions

### 2. Trend Analysis
- **User growth** over time
- **Content creation** patterns
- **Popular categories** and tags
- **Engagement metrics**

### 3. Export Features
- **User data** export (CSV/JSON)
- **Content reports** for analysis
- **Financial reports** for accounting

## 🔧 Admin API Endpoints

### Authentication
```javascript
// All admin routes require admin role
Authorization: Bearer <jwt_token>
```

### Content Moderation
```javascript
// Get pending articles
GET /api/admin/blogs/pending

// Approve article
PUT /api/admin/blogs/:id/approve

// Reject article
PUT /api/admin/blogs/:id/reject
{
  "reason": "Violation of community guidelines"
}

// Delete article
DELETE /api/admin/blogs/:id
```

### User Management
```javascript
// Get all users
GET /api/admin/users?page=1&limit=20&search=john

// Update user role
PUT /api/admin/users/:id/role
{
  "role": "premium"
}

// Get user statistics
GET /api/admin/users/:id/stats
```

### Analytics
```javascript
// Dashboard stats
GET /api/admin/stats

// Detailed analytics
GET /api/admin/analytics?period=30
```

## 🚨 Security Features

### 1. Access Control
- **Role-based permissions** at API level
- **Route protection** in frontend
- **Database-level security** with RLS

### 2. Audit Logging
- **All admin actions** are logged
- **User activity** tracking
- **System changes** recorded

### 3. Rate Limiting
- **API rate limits** to prevent abuse
- **Admin actions** have separate limits
- **Monitoring** for suspicious activity

## 🛠️ Troubleshooting

### Common Issues

1. **"Access Denied" Error**:
   - Check user role in database
   - Verify JWT token is valid
   - Ensure admin middleware is working

2. **Admin Panel Not Loading**:
   - Clear browser cache
   - Check network requests in DevTools
   - Verify API endpoints are responding

3. **Can't Approve Articles**:
   - Check database permissions
   - Verify Supabase connection
   - Test API endpoints directly

### Debug Commands
```bash
# Check user role in database
npx supabase sql --db-url="your_db_url" --query="SELECT * FROM user_profiles WHERE clerk_id='user_id'"

# Test admin API endpoint
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/admin/stats
```

## 📞 Support

For admin-related issues:
1. Check server logs for errors
2. Verify database connections
3. Test API endpoints with Postman
4. Review Clerk user metadata
5. Check Supabase RLS policies

## 🔄 Regular Admin Tasks

### Daily
- Review pending content
- Monitor user reports
- Check system health

### Weekly
- Analyze user growth
- Review popular content
- Update content policies

### Monthly
- Generate analytics reports
- Review premium subscriptions
- Plan feature updates