import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Search, PenTool, Crown, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const Header: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.publicMetadata?.role === 'admin';
  const aiUsageCount = user?.publicMetadata?.aiUsageCount as number || 0;
  const isContentCreator = user?.publicMetadata?.plan === 'premium';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Technology', href: '/category/technology' },
    { name: 'AI & Machine Learning', href: '/category/ai-ml' },
    { name: 'Web Development', href: '/category/web-dev' },
    { name: 'Design', href: '/category/design' },
    { name: 'Business', href: '/category/business' },
    { name: 'Lifestyle', href: '/category/lifestyle' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center hover-lift animate-pulse-glow">
              <PenTool className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              AI Blogs Booster
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-80 grid-cols-2">
                      {categories.map((category) => (
                        <NavigationMenuLink key={category.name} asChild>
                          <Link
                            to={category.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium">{category.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center space-x-2 flex-1 max-w-sm mx-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {isSignedIn ? (
              <>
                {/* AI Usage Counter */}
                <div className="hidden sm:flex items-center space-x-2">
                  <Badge variant={aiUsageCount >= 5 ? "destructive" : "secondary"} className="text-xs">
                    AI: {aiUsageCount}/5
                  </Badge>
                  {isContentCreator && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>

                <Button asChild size="sm" className="hidden sm:inline-flex">
                  <Link to="/create">
                    <PenTool className="h-4 w-4 mr-2 animate-float" />
                    Write
                  </Link>
                </Button>

                {isAdmin && (
                  <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex hover-lift animate-pulse-glow">
                    <Link to="/admin">Admin</Link>
                  </Button>
                )}

                <UserButton 
                  afterSignOutUrl="/"
                  userProfileMode="navigation"
                  userProfileUrl="/profile"
                />
              </>
            ) : (
              <SignInButton>
                <Button>Sign In</Button>
              </SignInButton>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border mt-4 pt-4 pb-4"
            >
              <div className="flex flex-col space-y-4">
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </form>

                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.href}
                      className="text-sm p-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col space-y-2">
                  <Link to="/pricing" className="text-sm p-2 rounded-md hover:bg-muted transition-colors">
                    Pricing
                  </Link>
                  {isSignedIn && (
                    <>
                      <Link to="/create" className="text-sm p-2 rounded-md hover:bg-muted transition-colors">
                        Write Article
                      </Link>
                      <Link to="/dashboard" className="text-sm p-2 rounded-md hover:bg-muted transition-colors">
                        Dashboard
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="text-sm p-2 rounded-md hover:bg-muted transition-colors">
                          Admin Panel
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;