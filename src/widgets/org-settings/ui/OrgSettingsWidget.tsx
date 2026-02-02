"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from './GeneralSettings';
import { ApiKeysSettings } from './ApiKeysSettings';
import { AuthLogsSettings } from './AuthLogsSettings';
import { SecurityCompliance } from './SecurityCompliance';
import { useCanManageUsers } from '@/shared/lib/rbac';

export const OrgSettingsWidget: React.FC = () => {
  const { hasAccess: canManageUsers } = useCanManageUsers();

  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <h3 className="text-lg font-medium">Access Denied</h3>
          <p className="text-muted-foreground">
            You don't have permission to access organization settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
          <CardDescription>
            Manage your organization's settings, API keys, and security configurations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="auth-logs">Auth Logs</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <GeneralSettings />
            </TabsContent>

            <TabsContent value="api-keys" className="space-y-4">
              <ApiKeysSettings />
            </TabsContent>

            <TabsContent value="auth-logs" className="space-y-4">
              <AuthLogsSettings />
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <SecurityCompliance />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};