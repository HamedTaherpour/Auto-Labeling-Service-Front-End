// Real-time event types
export type RealtimeEventType =
  | 'comment_added'
  | 'comment_updated'
  | 'comment_deleted'
  | 'comment_resolved'
  | 'notification_created'
  | 'notification_read'
  | 'notification_deleted'
  | 'user_online'
  | 'user_offline'
  | 'file_locked'
  | 'file_unlocked'
  | 'annotation_created'
  | 'annotation_updated'
  | 'annotation_deleted';

export interface RealtimeEvent {
  id: string;
  type: RealtimeEventType;
  payload: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  room?: string; // For room-based events (e.g., dataset-specific)
}

export interface RealtimeConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  enableLogging?: boolean;
}

export type EventCallback = (event: RealtimeEvent) => void;
export type ConnectionCallback = (connected: boolean) => void;