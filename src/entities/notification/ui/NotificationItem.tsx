import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  X,
  AtSign,
  UserCheck,
  Download,
  GitBranch,
  MessageCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Notification, notificationTypeIcons, notificationTypeLabels } from '../index';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (notificationId: string) => void;
  onDelete?: (notificationId: string) => void;
  onClick?: (notification: Notification) => void;
  className?: string;
}

const iconMap = {
  'at-sign': AtSign,
  'user-check': UserCheck,
  'download': Download,
  'git-branch': GitBranch,
  'message-circle': MessageCircle,
  'check-circle': CheckCircle,
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  className
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[notificationTypeIcons[notification.type] as keyof typeof iconMap];

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    } catch {
      return dateString;
    }
  };

  const handleClick = () => {
    if (!notification.read && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
    onClick?.(notification);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'relative p-4 border-b border-[#1A1A1A] hover:bg-[#0A0A0A]/50 transition-colors cursor-pointer',
        !notification.read && 'bg-[#FF6300]/5 border-l-4 border-l-[#FF6300]',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          notification.read
            ? 'bg-[#1A1A1A] text-gray-400'
            : 'bg-[#FF6300]/20 text-[#FF6300]'
        )}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className={cn(
                  'text-sm font-medium truncate',
                  notification.read ? 'text-gray-300' : 'text-white'
                )}>
                  {notification.title}
                </h4>
                {!notification.read && (
                  <div className="w-2 h-2 bg-[#FF6300] rounded-full flex-shrink-0" />
                )}
              </div>

              <p className={cn(
                'text-sm leading-relaxed mb-2',
                notification.read ? 'text-gray-400' : 'text-gray-300'
              )}>
                {notification.message}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatTimeAgo(notification.createdAt)}</span>
                {notification.actorName && (
                  <>
                    <span>•</span>
                    <span>{notification.actorName}</span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className={cn(
              'flex items-center gap-1 transition-opacity',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}>
              {!notification.read && onMarkAsRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-green-400"
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(notification.id);
                  }}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}