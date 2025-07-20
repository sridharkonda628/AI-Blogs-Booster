import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { AuthGuard } from './AuthGuard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldX } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user } = useUser();

  return (
    <AuthGuard>
      {user?.publicMetadata?.role === 'admin' ? (
        children
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full"
          >
            <Alert className="border-destructive/50 bg-destructive/10">
              <ShieldX className="h-4 w-4" />
              <AlertDescription className="text-center">
                You don't have permission to access this area. Admin access required.
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      )}
    </AuthGuard>
  );
};