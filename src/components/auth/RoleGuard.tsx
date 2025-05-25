
import { ReactNode } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

const RoleGuard = ({ allowedRoles, children, fallback }: RoleGuardProps) => {
  const { userProfile, isAuthorized } = useAuth();

  if (!userProfile) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized(allowedRoles)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this section. This area is restricted to: {allowedRoles.join(', ')}.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Your current role: <span className="font-medium capitalize">{userProfile.role}</span>
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
