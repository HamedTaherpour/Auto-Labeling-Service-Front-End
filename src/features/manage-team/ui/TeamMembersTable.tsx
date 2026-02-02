"use client";

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Shield, Trash2, UserX } from 'lucide-react';
import { TeamMember, Role, ROLE_LABELS, UserAvatar, RoleBadge } from '@/entities/user';
import { useCanManageUsers } from '@/shared/lib/rbac';
import { formatDistanceToNow } from 'date-fns';

interface TeamMembersTableProps {
  members: TeamMember[];
  currentUserId: string;
  onUpdateRole: (userId: string, newRole: Role) => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
  isLoading?: boolean;
}

export const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  currentUserId,
  onUpdateRole,
  onRemoveMember,
  isLoading = false,
}) => {
  const { hasAccess: canManageUsers } = useCanManageUsers();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      await onUpdateRole(userId, newRole);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      try {
        await onRemoveMember(userId);
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };

  const getStatusBadge = (status: TeamMember['status']) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <Badge variant="secondary" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading team members...</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Joined</TableHead>
            {canManageUsers && <TableHead className="w-[50px]"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <UserAvatar user={member} size="sm" />
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <RoleBadge role={member.role} />
              </TableCell>
              <TableCell>{getStatusBadge(member.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {member.lastActiveAt
                  ? formatDistanceToNow(new Date(member.lastActiveAt), { addSuffix: true })
                  : 'Never'
                }
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(member.createdAt), { addSuffix: true })}
              </TableCell>
              {canManageUsers && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* Role Management */}
                      <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                        Change Role
                      </DropdownMenuLabel>
                      {Object.entries(ROLE_LABELS).map(([role, label]) => (
                        <DropdownMenuItem
                          key={role}
                          onClick={() => handleRoleChange(member.id, role as Role)}
                          disabled={member.role === role || member.id === currentUserId}
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          {label}
                        </DropdownMenuItem>
                      ))}

                      <DropdownMenuSeparator />

                      {/* Remove Member */}
                      {member.id !== currentUserId && (
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Remove Member
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {members.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No team members found.
        </div>
      )}
    </div>
  );
};