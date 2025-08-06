import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { AuthGuard } from './AuthGuard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldX, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user } = useUser();

  // Check if user has admin role in Clerk metadata or if email is admin
  const isAdmin = user?.publicMetadata?.role === 'admin' || 
                  user?.emailAddresses?.[0]?.emailAddress === 'admin@prosepulse.com';

  return (
    <AuthGuard>
      {isAdmin ? (
        children
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg w-full space-y-6"
          >
            <Alert className="border-destructive/50 bg-destructive/10">
              <ShieldX className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-4">
                  <p className="font-medium">Admin Access Required</p>
                  <p className="text-sm text-muted-foreground">
                    You don't have permission to access the admin panel. Contact your system administrator to get admin privileges.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
            
            <div className="bg-muted/30 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Crown className="h-5 w-5" />
                <h3 className="font-semibold">How to Get Admin Access</h3>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                  <p>Contact your system administrator to assign admin role</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                  <p>Admin updates your role in the database or Clerk dashboard</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                  <p>Refresh the page to access admin features</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button asChild variant="outline">
                <Link to="/dashboard">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AuthGuard>
  );
};