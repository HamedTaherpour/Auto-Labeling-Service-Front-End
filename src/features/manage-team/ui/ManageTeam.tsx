"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { InviteMemberModal } from './InviteMemberModal';
import { TeamMembersTable } from './TeamMembersTable';
import { TeamMember, InviteRequest, Role } from '@/entities/user';
import { useUser } from '@/hooks/use-user';
import { useCanManageUsers } from '@/shared/lib/rbac';
import { toast } from 'sonner';

// Mock data for development
const MOCK_TEAM_MEMBERS: TeamMember[] = [
    {
        id: '1',
        email: 'owner@example.com',
        name: 'John Owner',
        role: 'owner',
        createdAt: '2024-01-01T00:00:00Z',
        lastActiveAt: '2024-01-15T10:30:00Z',
        status: 'active',
    },
    {
        id: '2',
        email: 'admin@example.com',
        name: 'Jane Admin',
        role: 'admin',
        createdAt: '2024-01-02T00:00:00Z',
        lastActiveAt: '2024-01-15T09:15:00Z',
        status: 'active',
    },
    {
        id: '3',
        email: 'reviewer@example.com',
        name: 'Bob Reviewer',
        role: 'reviewer',
        createdAt: '2024-01-03T00:00:00Z',
        lastActiveAt: '2024-01-15T08:45:00Z',
        status: 'active',
    },
    {
        id: '4',
        email: 'annotator@example.com',
        name: 'Alice Annotator',
        role: 'annotator',
        createdAt: '2024-01-04T00:00:00Z',
        lastActiveAt: '2024-01-15T07:20:00Z',
        status: 'active',
    },
    {
        id: '5',
        email: 'pending@example.com',
        name: 'Charlie Pending',
        role: 'annotator',
        createdAt: '2024-01-05T00:00:00Z',
        status: 'pending',
        invitedBy: '1',
        invitedAt: '2024-01-05T00:00:00Z',
    },
];

export const ManageTeam: React.FC = () => {
    const { user } = useUser();
    const { hasAccess: canManageUsers } = useCanManageUsers();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading team members
        const loadMembers = async () => {
            try {
                // In real app, this would fetch from API
                await new Promise(resolve => setTimeout(resolve, 500));
                setMembers(MOCK_TEAM_MEMBERS);
            } catch (error) {
                console.error('Error loading team members:', error);
                toast.error('Failed to load team members');
            } finally {
                setIsLoading(false);
            }
        };

        loadMembers();
    }, []);

    const handleInviteMember = async (invite: InviteRequest) => {
        // In real app, this would call the API: POST /api/v1/teams/invite
        console.log('Inviting member:', invite);

        // Mock successful invitation
        const newMember: TeamMember = {
            id: Date.now().toString(),
            email: invite.email,
            name: invite.email.split('@')[0], // Mock name from email
            role: invite.role,
            createdAt: new Date().toISOString(),
            status: 'pending',
            invitedBy: user?.id,
            invitedAt: new Date().toISOString(),
        };

        setMembers(prev => [...prev, newMember]);
    };

    const handleUpdateRole = async (userId: string, newRole: Role) => {
        // In real app, this would call: PATCH /api/v1/users/{id}/role
        console.log('Updating role for user', userId, 'to', newRole);

        setMembers(prev =>
            prev.map(member =>
                member.id === userId
                    ? { ...member, role: newRole }
                    : member
            )
        );

        toast.success('Role updated successfully');
    };

    const handleRemoveMember = async (userId: string) => {
        // In real app, this would call the appropriate API endpoint
        console.log('Removing member:', userId);

        setMembers(prev => prev.filter(member => member.id !== userId));
        toast.success('Member removed successfully');
    };

    if (!canManageUsers) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-center space-y-4">
                    <div>
                        <h3 className="text-lg font-medium">Access Denied</h3>
                        <p className="text-muted-foreground">
                            You don't have permission to manage team members.
                        </p>
                    </div>
                    {user && (
                        <div className="text-sm text-muted-foreground">
                            <p>Current user: {user.name} ({user.email})</p>
                            <p>Role: {user.role}</p>
                            <p className="text-xs mt-2">
                                Required role: admin or owner
                            </p>
                        </div>
                    )}
                    {!user && (
                        <div className="text-sm text-muted-foreground">
                            <p>No user logged in</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Team Members</CardTitle>
                            <CardDescription>
                                Manage your team members, roles, and permissions.
                            </CardDescription>
                        </div>
                        <Button onClick={() => setIsInviteModalOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite Member
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <TeamMembersTable
                        members={members}
                        currentUserId={user?.id || ''}
                        onUpdateRole={handleUpdateRole}
                        onRemoveMember={handleRemoveMember}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>

            <InviteMemberModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInvite={handleInviteMember}
            />
        </div>
    );
};