import { useEffect, useRef, useCallback, useState } from 'react';
import { RealtimeManager } from './RealtimeManager';
import { RealtimeEvent, RealtimeEventType, RealtimeConfig, EventCallback } from './types';

let globalManager: RealtimeManager | null = null;

export function useRealtime(config?: RealtimeConfig) {
  const managerRef = useRef<RealtimeManager | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);

  // Initialize manager
  useEffect(() => {
    if (!globalManager) {
      const defaultConfig: RealtimeConfig = {
        url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws',
        reconnectInterval: 5000,
        maxReconnectAttempts: 10,
        enableLogging: process.env.NODE_ENV === 'development',
        ...config,
      };
      globalManager = new RealtimeManager(defaultConfig);
    }

    managerRef.current = globalManager;

    // Connect on mount
    globalManager.connect().catch(console.error);

    // Handle connection status
    const handleConnection = (connected: boolean) => {
      setIsConnected(connected);
    };

    globalManager.onConnection(handleConnection);

    return () => {
      globalManager?.offConnection(handleConnection);
    };
  }, [config]);

  // Event subscription hook
  const useEvent = useCallback((eventType: RealtimeEventType, callback: EventCallback) => {
    useEffect(() => {
      if (!managerRef.current) return;

      managerRef.current.on(eventType, callback);

      return () => {
        if (managerRef.current) {
          managerRef.current.off(eventType, callback);
        }
      };
    }, [eventType, callback]);
  }, []);

  // Room management
  const joinRoom = useCallback((room: string) => {
    managerRef.current?.joinRoom(room);
  }, []);

  const leaveRoom = useCallback((room: string) => {
    managerRef.current?.leaveRoom(room);
  }, []);

  // Broadcasting
  const broadcast = useCallback((eventType: RealtimeEventType, payload: any, room?: string) => {
    managerRef.current?.broadcast(eventType, payload, room);
  }, []);

  // Send comment event
  const sendCommentEvent = useCallback((
    action: 'added' | 'updated' | 'deleted' | 'resolved',
    commentData: any,
    room?: string
  ) => {
    const eventType = `comment_${action}` as RealtimeEventType;
    broadcast(eventType, commentData, room);
  }, [broadcast]);

  // Send notification event
  const sendNotificationEvent = useCallback((
    action: 'created' | 'read' | 'deleted',
    notificationData: any,
    targetUserId: string
  ) => {
    const eventType = `notification_${action}` as RealtimeEventType;
    broadcast(eventType, { ...notificationData, targetUserId }, `user_${targetUserId}`);
  }, [broadcast]);

  // Listen for comment events
  const useCommentEvents = useCallback((callback: (event: RealtimeEvent) => void) => {
    useEvent('comment_added', callback);
    useEvent('comment_updated', callback);
    useEvent('comment_deleted', callback);
    useEvent('comment_resolved', callback);
  }, [useEvent]);

  // Listen for notification events
  const useNotificationEvents = useCallback((callback: (event: RealtimeEvent) => void) => {
    useEvent('notification_created', callback);
    useEvent('notification_read', callback);
    useEvent('notification_deleted', callback);
  }, [useEvent]);

  // Update last event for debugging
  useEffect(() => {
    if (!managerRef.current) return;

    const handleAnyEvent = (event: RealtimeEvent) => {
      setLastEvent(event);
    };

    // This is a simplified way - in practice you'd want to subscribe to all events
    // For now, we'll just track comment and notification events
    managerRef.current.on('comment_added', handleAnyEvent);
    managerRef.current.on('comment_updated', handleAnyEvent);
    managerRef.current.on('comment_deleted', handleAnyEvent);
    managerRef.current.on('comment_resolved', handleAnyEvent);
    managerRef.current.on('notification_created', handleAnyEvent);

    return () => {
      if (managerRef.current) {
        managerRef.current.off('comment_added', handleAnyEvent);
        managerRef.current.off('comment_updated', handleAnyEvent);
        managerRef.current.off('comment_deleted', handleAnyEvent);
        managerRef.current.off('comment_resolved', handleAnyEvent);
        managerRef.current.off('notification_created', handleAnyEvent);
      }
    };
  }, []);

  return {
    isConnected,
    lastEvent,
    joinRoom,
    leaveRoom,
    broadcast,
    sendCommentEvent,
    sendNotificationEvent,
    useEvent,
    useCommentEvents,
    useNotificationEvents,
    manager: managerRef.current,
  };
}