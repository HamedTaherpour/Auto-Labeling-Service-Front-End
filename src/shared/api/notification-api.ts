import { apiClient } from './client';
import { Notification } from '@/entities/notification';

export interface NotificationFilters {
  read?: boolean;
  type?: string;
  limit?: number;
  offset?: number;
}

export interface MarkNotificationsReadRequest {
  notificationIds: string[];
}

export interface CreateNotificationRequest {
  type: Notification['type'];
  title: string;
  message: string;
  userId: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

class NotificationApi {
  // Get user notifications
  async getNotifications(filters: NotificationFilters = {}): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
  }> {
    const params = new URLSearchParams();

    if (filters.read !== undefined) params.append('read', filters.read.toString());
    if (filters.type) params.append('type', filters.type);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const response = await apiClient.get(`/api/v1/notifications?${params}`);
    return response.data;
  }

  // Mark notifications as read
  async markAsRead(notificationIds: string[]): Promise<void> {
    await apiClient.patch('/api/v1/notifications/read', { notificationIds });
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/api/v1/notifications/read-all');
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/api/v1/notifications/${notificationId}`);
  }

  // Create notification (admin/system use)
  async createNotification(data: CreateNotificationRequest): Promise<Notification> {
    const response = await apiClient.post('/api/v1/notifications', data);
    return response.data;
  }

  // Get notification preferences
  async getNotificationPreferences(): Promise<{
    email: boolean;
    push: boolean;
    types: Record<string, boolean>;
  }> {
    const response = await apiClient.get('/api/v1/notifications/preferences');
    return response.data;
  }

  // Update notification preferences
  async updateNotificationPreferences(preferences: {
    email?: boolean;
    push?: boolean;
    types?: Record<string, boolean>;
  }): Promise<void> {
    await apiClient.patch('/api/v1/notifications/preferences', preferences);
  }

  // Get unread count
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await apiClient.get('/api/v1/notifications/unread-count');
    return response.data;
  }
}

export const notificationApi = new NotificationApi();