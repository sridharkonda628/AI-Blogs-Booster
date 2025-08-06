# 🛡️ Admin Setup Guide - AI Blogs Booster

## Quick Admin Setup (Development)

### Method 1: Database Direct Setup
1. **Sign up normally** in the application
2. **Copy your Clerk User ID** from the URL or Clerk Dashboard
3. **Run this SQL in Supabase**:
```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE clerk_id = 'user_2xyz123abc456def789';  -- Replace with your Clerk ID
```

### Method 2: Clerk Metadata Setup
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Users** → Select your user
3. In **Public Metadata**, add:
```json
{
  "role": "admin"
}
```
4. Save and refresh the application

### Method 3: Email-based Admin (Quick Dev)
The system automatically grants admin access to `admin@prosepulse.com`. 

**To use this:**
1. Create a Clerk account with email: `admin@prosepulse.com`
2. Login to the application
3. Admin panel will be automatically accessible

## 🚀 Accessing Admin Features

### 1. Admin Panel URL
Direct access: `http://localhost:5173/admin`

### 2. Navigation Methods
- **Header Button**: Look for "Admin" button when logged in as admin
- **Dashboard Link**: Admin-specific options appear in user dashboard
- **Direct URL**: Bookmark `/admin` for quick access

## 📋 Admin Capabilities

### Content Moderation
- ✅ Review pending articles
- ✅ Approve/reject submissions
- ✅ Edit content before publishing
- ✅ Delete inappropriate content
- ✅ Bulk operations

### User Management
- ✅ View all users with details
- ✅ Change user roles (user ↔ premium ↔ admin)
- ✅ Suspend/activate accounts
- ✅ Monitor AI usage per user
- ✅ Track user activity

### Analytics Dashboard
- ✅ Platform statistics
- ✅ User growth metrics
- ✅ Content performance
- ✅ Revenue tracking
- ✅ System health monitoring

## 🔧 Testing Admin Features

### 1. Create Test Content
```bash
# As regular user, create some articles with status "pending"
# Then switch to admin to approve/reject them
```

### 2. Test User Management
```bash
# Create multiple test users
# Use admin panel to change their roles
# Verify permissions work correctly
```

### 3. Verify API Access
```bash
# Test admin endpoints
curl -H "Authorization: Bearer <admin_jwt>" \
     http://localhost:5000/api/admin/stats
```

## 🚨 Security Notes

1. **Production Setup**: Never use email-based admin in production
2. **Role Verification**: Always verify admin role in both frontend and backend
3. **Audit Logging**: All admin actions are logged automatically
4. **Rate Limiting**: Admin endpoints have separate rate limits

## 🛠️ Troubleshooting

### "Access Denied" Error
1. Check user role in Supabase: `SELECT role FROM user_profiles WHERE clerk_id = 'your_id'`
2. Verify Clerk metadata contains `"role": "admin"`
3. Clear browser cache and re-login
4. Check browser console for JWT token issues

### Admin Panel Not Loading
1. Verify you're logged in as admin user
2. Check network tab for API errors
3. Ensure backend server is running on port 5000
4. Test admin API endpoints directly

### Can't Approve Articles
1. Check Supabase connection
2. Verify database permissions
3. Test with Supabase SQL editor
4. Check server logs for errors

## 📞 Quick Support Commands

```bash
# Check if user is admin in database
npx supabase sql --query="SELECT * FROM user_profiles WHERE role='admin'"

# Test admin API
curl -X GET http://localhost:5000/api/admin/stats \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"

# View server logs
cd server && npm run dev  # Check console output
```

---

**Need Help?** Check the full `ADMIN_GUIDE.md` for comprehensive documentation.