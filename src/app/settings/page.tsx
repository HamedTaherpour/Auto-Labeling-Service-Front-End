import React from 'react';
import { Metadata } from 'next';
import { ManageTeam } from '@/features/manage-team';
import { OrgSettingsWidget } from '@/widgets/org-settings';
import { useCanManageUsers } from '@/shared/lib/rbac';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Team Settings - AuraVision',
  description: 'Manage your team members, roles, and organization settings.',
};

export default function SettingsPage() {
  // Note: Since this is a server component, we can't use the useCanManageUsers hook directly
  // In a real implementation, you'd check permissions on the server side or use a client component wrapper
  // For now, we'll assume the user has access (permissions would be checked in the components themselves)

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Settings</h1>
          <p className="text-muted-foreground">
            Manage your team members, roles, and organization configuration.
          </p>
        </div>
      </div>

      {/* Team Management Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Team Management</h2>
        </div>
        <ManageTeam />
      </div>

      {/* Organization Settings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Organization Settings</h2>
        </div>
        <OrgSettingsWidget />
      </div>

      {/* Information Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Invite new members, manage roles, and oversee team activities.
              Access is restricted to administrators and owners.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Monitor authentication logs, manage API keys, and ensure compliance
              with industry security standards.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Customize organization settings, branding, and operational preferences
              to match your team's workflow.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}