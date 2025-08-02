import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import BlogEditor from '@/pages/BlogEditor';
import BlogDetail from '@/pages/BlogDetail';
import Dashboard from '@/pages/Dashboard';
import AdminPanel from '@/pages/AdminPanel';
import Profile from '@/pages/Profile';
import Pricing from '@/pages/Pricing';
import Category from '@/pages/Category';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AdminGuard } from '@/components/auth/AdminGuard';

const queryClient = new QueryClient();

// Get Clerk publishable key from environment variables
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function SetupInstructions() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Setup Required</h1>
        <p className="text-gray-300 mb-6">
          To use AI Blogs Booster, you need to set up Clerk authentication and Supabase database.
        </p>
        <div className="text-left space-y-4">
          <div>
            <h3 className="text-white font-semibold mb-2">Step 1:</h3>
            <p className="text-gray-400 text-sm">
              Go to <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Clerk Dashboard</a> and create a new application
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Step 2:</h3>
            <p className="text-gray-400 text-sm">
              Choose <strong className="text-white">React</strong> as your framework when creating the application
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Step 3:</h3>
            <p className="text-gray-400 text-sm">
              Copy your <strong className="text-white">Publishable Key</strong> from the API Keys section
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Step 4:</h3>
            <p className="text-gray-400 text-sm">
              Update the <code className="bg-gray-700 px-1 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> in your .env file
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Step 5:</h3>
            <p className="text-gray-400 text-sm">
              Click the "Connect to Supabase" button in the top right to set up your database
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Step 6:</h3>
            <p className="text-gray-400 text-sm">
              Configure your Supabase environment variables in the .env file
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-700">
          <p className="text-blue-300 text-sm">
            <strong>Important:</strong> Make sure to select <strong>React</strong> as your framework when setting up your Clerk application. The publishable key should start with <code className="bg-gray-700 px-1 rounded">pk_test_</code> or <code className="bg-gray-700 px-1 rounded">pk_live_</code>
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  // If no Clerk key is provided, show setup instructions
  if (!CLERK_PUBLISHABLE_KEY || CLERK_PUBLISHABLE_KEY === 'pk_test_your_key_here') {
    return <SetupInstructions />;
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="blog-theme">
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/category/:category" element={<Category />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/create" element={
                  <AuthGuard>
                    <BlogEditor />
                  </AuthGuard>
                } />
                <Route path="/edit/:id" element={
                  <AuthGuard>
                    <BlogEditor />
                  </AuthGuard>
                } />
                <Route path="/dashboard" element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                } />
                <Route path="/profile" element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                } />
                <Route path="/admin" element={
                  <AdminGuard>
                    <AdminPanel />
                  </AdminGuard>
                } />
              </Routes>
              <Toaster />
            </Layout>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;