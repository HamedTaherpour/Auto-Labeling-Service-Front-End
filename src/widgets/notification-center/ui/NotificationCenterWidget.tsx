"use client";

import { useState, useEffect } from 'react';
import { NotificationCenter } from '@/entities/notification';
import { Notification } from '@/entities/notification';
import { useUser } from '@/hooks/use-user';

// Mock data - in real app this would come from API
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'mentioned_in_comment',
    title: 'Mentioned in comment',
    message: '@johndoe mentioned you in a comment on "street_scene_001.jpg"',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    userId: 'current-user',
    actorId: 'john-doe',
    actorName: 'John Doe',
    actionUrl: '/dashboard/datasets/123/files/456/review',
  },
  {
    id: '2',
    type: 'dataset_export_ready',
    title: 'Export completed',
    message: 'Your dataset "City Streets v2" export is ready for download',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    userId: 'current-user',
    actionUrl: '/dashboard/datasets/123/exports',
  },
  {
    id: '3',
    type: 'assignment_updated',
    title: 'Assignment updated',
    message: 'You have been assigned 50 new images for review',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    userId: 'current-user',
    actorId: 'admin',
    actorName: 'Admin',
  },
  {
    id: '4',
    type: 'comment_added',
    title: 'New comment',
    message: 'Sarah added a comment to "parking_lot_023.jpg"',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    userId: 'current-user',
    actorId: 'sarah-smith',
    actorName: 'Sarah Smith',
    actionUrl: '/dashboard/datasets/123/files/789/review',
  },
];

interface NotificationCenterWidgetProps {
  className?: string;
}

export function NotificationCenterWidget({ className }: NotificationCenterWidgetProps) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // In a real app, this would fetch notifications from API
  useEffect(() => {
    // Simulate API call
    const fetchNotifications = async () => {
      // This would be: await api.getNotifications(user?.id);
      // For now, just use mock data
      setNotifications(mockNotifications);
    };

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Navigate to the action URL if provided
    if (notification.actionUrl) {
      // In Next.js, you would use router.push(notification.actionUrl)
      console.log('Navigate to:', notification.actionUrl);
    }
  };

  return (
    <NotificationCenter
      notifications={notifications}
      onMarkAsRead={handleMarkAsRead}
      onMarkAllAsRead={handleMarkAllAsRead}
      onDeleteNotification={handleDeleteNotification}
      onClearAll={handleClearAll}
      onNotificationClick={handleNotificationClick}
      className={className}
    />
  );
}