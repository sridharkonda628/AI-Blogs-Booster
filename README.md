# AI Blogs Booster - Supercharge Your Content Creation

Boost your blogging with AI-powered tools, intelligent suggestions, and advanced SEO optimization. A modern AI-enhanced blogging platform with admin controls, user authentication, and premium features.

## Features

- 🚀 AI-powered content creation with intelligent suggestions
- 📈 Advanced SEO optimization and analytics
- 👨‍💼 Admin dashboard for content moderation
- 🔐 User authentication with Clerk
- 💎 Premium features with usage limits
- 🎨 Modern dark theme with clean UI
- 📱 Fully responsive design
- 💳 Payment integration ready
- ⚡ Real-time collaboration tools

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite  
- **Backend**: Node.js, Express.js, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Authentication**: Clerk
- **Database**: Supabase
- **State Management**: React Query
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI Integration**: OpenAI GPT

## Quick Start

### Full Stack Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Install server dependencies: `cd server && npm install`
4. Set up environment variables (see below)
5. Run both frontend and backend: `npm run dev:full`

### Frontend Only

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Run frontend only: `npm run dev`

### Backend Only

1. Navigate to server: `cd server`
2. Install dependencies: `npm install`
3. Set up environment variables (see below)
4. Run backend only: `npm run dev`

## Environment Variables

### Frontend (.env)
Create a `.env` file in the root directory:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (server/.env)
Create a `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
CLERK_SECRET_KEY=your_clerk_secret_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## API Documentation

The backend provides a comprehensive REST API:

### Authentication
- `POST /api/auth/clerk` - Authenticate with Clerk
- `GET /api/auth/me` - Get current user

### Blogs
- `GET /api/blogs` - Get all blogs (public)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog (auth required)
- `PUT /api/blogs/:id` - Update blog (auth required)
- `DELETE /api/blogs/:id` - Delete blog (auth required)
- `POST /api/blogs/:id/like` - Like/unlike blog

### AI Features
- `POST /api/ai/suggestions` - Generate AI suggestions
- `POST /api/ai/generate` - Generate content (premium)
- `POST /api/ai/seo-optimize` - SEO optimization

### Comments
- `GET /api/comments/:blogId` - Get blog comments
- `POST /api/comments` - Create comment (auth required)
- `PUT /api/comments/:id` - Update comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (auth required)
- `GET /api/users/stats` - Get user stats (auth required)

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/blogs/pending` - Moderate content
- `PUT /api/admin/blogs/:id/approve` - Approve blog
- `PUT /api/admin/blogs/:id/reject` - Reject blog

### File Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images

### Webhooks
- `POST /api/webhooks/stripe` - Stripe payment webhooks
- `POST /api/webhooks/clerk` - Clerk user webhooks

## Deployment

### Vercel Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - Add all required environment variables from the list above

### Netlify Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

## Setup Instructions

### 1. Clerk Authentication Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. **Important**: Select **React** as your framework
4. Copy your Publishable Key (starts with `pk_test_` or `pk_live_`)
5. Add it to your `.env` file as `VITE_CLERK_PUBLISHABLE_KEY`

### 2. Supabase Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Add them to your environment variables
4. Click "Connect to Supabase" in the app to set up database schema

### 3. OpenAI Integration (Optional)

1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add it to your server environment variables
3. Configure AI features in the admin panel

### 4. Payment Setup (Optional)

For premium features:
1. Set up Stripe account
2. Configure payment webhooks
3. Add Stripe keys to environment variables

## Project Structure

```
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   │   ├── auth/          # Authentication guards
│   │   ├── layout/        # Layout components
│   │   └── ui/            # shadcn/ui components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript type definitions
├── server/                # Backend API server
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── config/        # Configuration files
│   │   └── server.ts      # Main server file
│   ├── uploads/           # File upload directory
│   └── package.json       # Backend dependencies
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## Key Features

### For Content Creators
- AI-powered content suggestions and generation
- Advanced SEO optimization tools
- Real-time collaboration features
- Performance analytics and insights
- Content scheduling and automation
- Social media integration

### For Administrators
- Comprehensive content moderation system
- User management and role assignment
- Platform analytics and reporting
- Payment and subscription management
- System monitoring and health checks

### AI-Powered Tools
- Intelligent title suggestions
- Content optimization recommendations
- SEO keyword analysis
- Readability improvements
- Trending topic identification
- Automated tagging and categorization

## Development Scripts

```bash
# Frontend development
npm run dev              # Start frontend dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Backend development
cd server
npm run dev             # Start backend dev server
npm run build          # Build backend
npm start              # Start production server

# Full stack development
npm run dev:full        # Start both frontend and backend
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@aiblogsbooster.com or join our Discord community.

---

**AI Blogs Booster** - Supercharge Your Content Creation with AI 🚀