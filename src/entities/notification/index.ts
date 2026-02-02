// Notification entity types and interfaces
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string; // The user who should receive this notification
  actorId?: string; // The user who performed the action
  actorName?: string;
  metadata?: Record<string, any>; // Additional data specific to notification type
  actionUrl?: string; // URL to navigate to when clicked
}

export type NotificationType =
  | 'mentioned_in_comment'
  | 'assignment_updated'
  | 'dataset_export_ready'
  | 'workflow_stage_changed'
  | 'comment_added'
  | 'review_completed';

// Notification type helpers
export const notificationTypeLabels: Record<NotificationType, string> = {
  mentioned_in_comment: 'Mentioned in Comment',
  assignment_updated: 'Assignment Updated',
  dataset_export_ready: 'Export Ready',
  workflow_stage_changed: 'Workflow Updated',
  comment_added: 'New Comment',
  review_completed: 'Review Completed',
};

export const notificationTypeIcons: Record<NotificationType, string> = {
  mentioned_in_comment: 'at-sign',
  assignment_updated: 'user-check',
  dataset_export_ready: 'download',
  workflow_stage_changed: 'git-branch',
  comment_added: 'message-circle',
  review_completed: 'check-circle',
};

// Notification priority levels
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export const getNotificationPriority = (type: NotificationType): NotificationPriority => {
  switch (type) {
    case 'mentioned_in_comment':
    case 'review_completed':
      return 'high';
    case 'assignment_updated':
    case 'workflow_stage_changed':
      return 'medium';
    case 'comment_added':
      return 'low';
    case 'dataset_export_ready':
      return 'urgent';
    default:
      return 'low';
  }
};

// Re-export components
export { NotificationItem } from './ui/NotificationItem';
export { NotificationCenter } from './ui/NotificationCenter';