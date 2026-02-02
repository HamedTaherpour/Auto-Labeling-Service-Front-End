"use client";

import React from 'react';
import { Role, hasPermission } from '@/entities/user';
import { useUser } from '@/hooks/use-user';

// Higher-order component for protecting UI elements
interface PermissionGuardProps {
    children: React.ReactNode;
    requiredRole: Role;
    fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    children,
    requiredRole,
    fallback = null,
}) => {
    const { user, isAuthenticated } = useUser();

    const hasAccess = React.useMemo(() => {
        if (!isAuthenticated || !user) return false;
        return hasPermission(user.role, requiredRole);
    }, [user, isAuthenticated, requiredRole]);

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

// Component for conditionally rendering based on role
interface RoleBasedRenderProps {
    children: React.ReactNode;
    roles: Role[];
    fallback?: React.ReactNode;
}

export const RoleBasedRender: React.FC<RoleBasedRenderProps> = ({
    children,
    roles,
    fallback = null,
}) => {
    const { user, isAuthenticated } = useUser();

    const hasAnyRole = React.useMemo(() => {
        if (!isAuthenticated || !user) return false;
        return roles.some(role => hasPermission(user.role, role));
    }, [user, isAuthenticated, roles]);

    if (!hasAnyRole) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};