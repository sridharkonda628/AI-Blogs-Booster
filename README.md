# ProsePulse - AI-Powered Blogging Platform

Where Words Meet Intelligence. A modern AI-powered blogging platform with admin controls, user authentication, and premium features.

## Features

- 🤖 AI-powered content creation with SEO optimization
- 👨‍💼 Admin dashboard for content moderation
- 🔐 User authentication with Clerk
- 💎 Premium features with usage limits
- 🎨 Modern dark theme with clean UI
- 📱 Fully responsive design
- 💳 Payment integration ready

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite  
- **Backend**: Node.js, Express.js, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Authentication**: Clerk
- **Database**: Supabase
- **State Management**: React Query
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Quick Start

### Frontend + Backend Development

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
   - Go to your project settings
   - Add `VITE_CLERK_PUBLISHABLE_KEY` with your Clerk key

### Manual Vercel Deployment

1. Build the project: `npm run build`
2. Upload the `dist` folder to Vercel
3. Configure environment variables in Vercel dashboard

## Setup Instructions

### 1. Clerk Authentication Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. **Important**: Select **React** as your framework
4. Copy your Publishable Key (starts with `pk_test_` or `pk_live_`)
5. Add it to your `.env` file

### 2. Database Setup (Optional)

For full functionality, you can set up Supabase:
1. Create a Supabase project
2. Add database environment variables
3. Run migrations for user data and blog posts

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

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/blogs/pending` - Moderate content

### 3. Payment Setup (Optional)

For premium features:
1. Set up Stripe account
2. Configure payment webhooks
3. Add Stripe keys to environment variables

## Project Structure

```
server/                 # Backend API server
├── src/
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── config/         # Configuration files
│   └── server.ts       # Main server file
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication guards
│   ├── layout/         # Layout components
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## Key Features

### For Users
- Create and edit blog posts with AI assistance
- Get AI suggestions for titles, content, and SEO
- Track article performance and analytics
- Manage profile and preferences
- Upgrade to premium for unlimited AI features

### For Admins
- Review and moderate all blog posts
- Manage user accounts and permissions
- View platform analytics and reports
- Control content publication workflow

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.