// User and Role entity definitions for team management and RBAC

export type Role = 'owner' | 'admin' | 'reviewer' | 'annotator';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: Role;
  createdAt: string;
  lastActiveAt?: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface TeamMember extends User {
  invitedBy?: string;
  invitedAt?: string;
}

export interface InviteRequest {
  email: string;
  role: Role;
  message?: string;
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: string;
}

// Role hierarchy and permissions
export const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 4,
  admin: 3,
  reviewer: 2,
  annotator: 1,
};

export const ROLE_LABELS: Record<Role, string> = {
  owner: 'Owner',
  admin: 'Admin',
  reviewer: 'Reviewer',
  annotator: 'Annotator',
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  owner: 'Full access to all features and team management',
  admin: 'Manage team members, settings, and organization',
  reviewer: 'Review and approve annotations, manage datasets',
  annotator: 'Create and edit annotations',
};

// Permission checks
export const hasPermission = (userRole: Role, requiredRole: Role): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const canManageUsers = (userRole: Role): boolean => {
  return hasPermission(userRole, 'admin');
};

export const canReviewAnnotations = (userRole: Role): boolean => {
  return hasPermission(userRole, 'reviewer');
};

export const canCreateAnnotations = (userRole: Role): boolean => {
  return hasPermission(userRole, 'annotator');
};

// Export UI components
export { UserAvatar } from './ui/UserAvatar';
export { RoleBadge } from './ui/RoleBadge';