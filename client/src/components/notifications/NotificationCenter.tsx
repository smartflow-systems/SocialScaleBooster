import { useState, useEffect } from 'react';
import { Bell, Check, X, TrendingUp, AlertCircle, DollarSign, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'milestone' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  icon?: 'trending' | 'dollar' | 'users' | 'zap' | 'alert';
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'milestone',
      title: '🎉 Milestone Reached!',
      message: 'Your bot just hit 10,000 followers!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      icon: 'users',
      actionUrl: '/dashboard?tab=analytics'
    },
    {
      id: '2',
      type: 'success',
      title: '📈 Trending Content',
      message: 'Your post is going viral! 50K views in 2 hours',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
      icon: 'trending',
      actionUrl: '/dashboard?tab=analytics'
    },
    {
      id: '3',
      type: 'info',
      title: '💡 Content Suggestion',
      message: 'New trending hashtag #AIAutomation detected',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      icon: 'zap',
      actionUrl: '/dashboard?tab=marketplace'
    },
    {
      id: '4',
      type: 'milestone',
      title: '💰 Revenue Update',
      message: 'You generated $1,250 today from tracked links',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      icon: 'dollar',
      actionUrl: '/dashboard?tab=analytics'
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'trending':
        return <TrendingUp className="w-4 h-4" />;
      case 'dollar':
        return <DollarSign className="w-4 h-4" />;
      case 'users':
        return <Users className="w-4 h-4" />;
      case 'zap':
        return <Zap className="w-4 h-4" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'alert':
        return 'text-red-500';
      case 'milestone':
        return 'text-purple-500';
      default:
        return 'text-blue-500';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-[#3B2F2F] transition-colors"
        >
          <Bell className="w-5 h-5 text-[#FFD700]" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs border-2 border-[#0D0D0D]"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] bg-[#0D0D0D] border-[#3B2F2F] text-[#F5F5DC]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="text-[#FFD700] font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-[#FFD700] hover:text-[#E6C200] hover:bg-[#3B2F2F]"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#3B2F2F]" />

        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-[#F5F5DC]/60">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-[#3B2F2F] ${
                  !notification.read ? 'bg-[#1a1a1a]' : ''
                }`}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                }}
              >
                <div className={`mt-1 ${getTypeColor(notification.type)}`}>
                  {getIcon(notification.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm text-[#F5F5DC]">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-[#FFD700] rounded-full mt-1 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-[#F5F5DC]/70 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-[#F5F5DC]/50 mt-2">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-500/20 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </DropdownMenuItem>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-[#3B2F2F]" />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full text-[#FFD700] hover:text-[#E6C200] hover:bg-[#3B2F2F]"
                onClick={() => {
                  // Navigate to full notifications page
                  window.location.href = '/notifications';
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
