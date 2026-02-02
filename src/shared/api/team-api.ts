// Team management API functions
// Note: These endpoints need to be added to the Postman collection

import { apiClient } from './client';
import { TeamMember, InviteRequest, Role } from '@/entities/user';

// GET /api/v1/organization/members - List team members
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const response = await apiClient.get('/api/v1/organization/members');
    return response.data.members || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    // Fallback to mock data for development
    return [];
  }
};

// PATCH /api/v1/users/{id}/role - Update user role
export const updateUserRole = async (userId: string, role: Role): Promise<void> => {
  try {
    await apiClient.patch(`/api/v1/users/${userId}/role`, { role });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// POST /api/v1/teams/invite - Invite new team member
export const inviteTeamMember = async (invite: InviteRequest): Promise<void> => {
  try {
    await apiClient.post('/api/v1/teams/invite', invite);
  } catch (error) {
    console.error('Error sending team invitation:', error);
    throw error;
  }
};

// DELETE /api/v1/users/{id} - Remove team member (if endpoint exists)
export const removeTeamMember = async (userId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/users/${userId}`);
  } catch (error) {
    console.error('Error removing team member:', error);
    throw error;
  }
};

// API Keys management endpoints
interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  permissions: string[];
}

// GET /api/v1/organization/api-keys - List API keys
export const getApiKeys = async (): Promise<ApiKey[]> => {
  try {
    const response = await apiClient.get('/api/v1/organization/api-keys');
    return response.data.apiKeys || [];
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return [];
  }
};

// POST /api/v1/organization/api-keys - Create new API key
export const createApiKey = async (name: string): Promise<ApiKey> => {
  try {
    const response = await apiClient.post('/api/v1/organization/api-keys', { name });
    return response.data.apiKey;
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
};

// DELETE /api/v1/organization/api-keys/{id} - Delete API key
export const deleteApiKey = async (keyId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/organization/api-keys/${keyId}`);
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
};

// Organization settings endpoints
interface OrganizationSettings {
  name: string;
  description: string;
  website: string;
  contactEmail: string;
}

// GET /api/v1/organization/settings - Get organization settings
export const getOrganizationSettings = async (): Promise<OrganizationSettings> => {
  try {
    const response = await apiClient.get('/api/v1/organization/settings');
    return response.data.settings;
  } catch (error) {
    console.error('Error fetching organization settings:', error);
    // Return mock data
    return {
      name: 'AuraVision Labs',
      description: 'Advanced computer vision and AI annotation platform',
      website: 'https://auravision.com',
      contactEmail: 'admin@auravision.com',
    };
  }
};

// PATCH /api/v1/organization/settings - Update organization settings
export const updateOrganizationSettings = async (settings: OrganizationSettings): Promise<void> => {
  try {
    await apiClient.patch('/api/v1/organization/settings', settings);
  } catch (error) {
    console.error('Error updating organization settings:', error);
    throw error;
  }
};

// Authentication logs endpoints
interface AuthLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  status: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
}

// GET /api/v1/organization/auth-logs - Get authentication logs
export const getAuthLogs = async (params?: {
  limit?: number;
  offset?: number;
  status?: string;
}): Promise<{ logs: AuthLog[]; total: number }> => {
  try {
    const response = await apiClient.get('/api/v1/organization/auth-logs', { params });
    return {
      logs: response.data.logs || [],
      total: response.data.total || 0,
    };
  } catch (error) {
    console.error('Error fetching auth logs:', error);
    return { logs: [], total: 0 };
  }
};

// Compliance status endpoints
interface ComplianceStatus {
  framework: string;
  status: 'compliant' | 'pending' | 'non_compliant';
  lastAudit: string;
  nextAudit: string;
  certificateUrl?: string;
}

// GET /api/v1/organization/compliance - Get compliance status
export const getComplianceStatus = async (): Promise<ComplianceStatus[]> => {
  try {
    const response = await apiClient.get('/api/v1/organization/compliance');
    return response.data.compliance || [];
  } catch (error) {
    console.error('Error fetching compliance status:', error);
    return [];
  }
};