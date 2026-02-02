import React from 'react';
import { Role, hasPermission } from '@/entities/user';
import { useUser } from '@/hooks/use-user';

// Hook for checking permissions
export const usePermission = (requiredRole: Role) => {
  const { user, isAuthenticated } = useUser();

  const hasAccess = React.useMemo(() => {
    if (!isAuthenticated || !user) return false;
    return hasPermission(user.role, requiredRole);
  }, [user, isAuthenticated, requiredRole]);

  return {
    hasAccess,
    user,
    isAuthenticated,
  };
};

// Hook for checking specific permissions
export const useCanManageUsers = () => {
  return usePermission('admin');
};

export const useCanReviewAnnotations = () => {
  return usePermission('reviewer');
};

export const useCanCreateAnnotations = () => {
  return usePermission('annotator');
};

// Utility functions for common permission checks
export const canAccessAdminPanel = (userRole: Role): boolean => {
  return hasPermission(userRole, 'admin');
};

export const canManageTeamMembers = (userRole: Role): boolean => {
  return hasPermission(userRole, 'admin');
};

export const canInviteUsers = (userRole: Role): boolean => {
  return hasPermission(userRole, 'admin');
};

export const canReviewAnnotations = (userRole: Role): boolean => {
  return hasPermission(userRole, 'reviewer');
};

export const canApproveRejectAnnotations = (userRole: Role): boolean => {
  return hasPermission(userRole, 'reviewer');
};

export const canCreateAnnotations = (userRole: Role): boolean => {
  return hasPermission(userRole, 'annotator');
};

export const canViewAnalytics = (userRole: Role): boolean => {
  return hasPermission(userRole, 'reviewer');
};

// Export components
export { PermissionGuard, RoleBasedRender } from './components';