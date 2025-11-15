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
        return 'text-emerald-400';
      case 'warning':
        return 'text-[#FFD700]';
      case 'alert':
        return 'text-red-400';
      case 'milestone':
        return 'text-[#FFD700]';
      default:
        return 'text-[#FFD700]';
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
          className="relative hover:bg-[rgba(255,215,0,0.08)] transition-all duration-300 rounded-lg group"
        >
          <Bell className="w-5 h-5 text-[#FFD700] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white text-xs border-2 border-[#0D0D0D] shadow-lg animate-pulse"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[420px] bg-[rgba(59,47,47,0.95)] backdrop-blur-xl border border-[rgba(255,215,0,0.25)] text-[#F5F5DC] shadow-2xl rounded-2xl overflow-hidden"
        style={{
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 215, 0, 0.1) inset'
        }}
      >
        {/* Header */}
        <DropdownMenuLabel className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[rgba(255,215,0,0.12)] to-transparent border-b border-[rgba(255,215,0,0.15)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#FFD700] to-[#E6C200] rounded-lg shadow-md">
              <Bell className="w-4 h-4 text-[#0D0D0D]" />
            </div>
            <span className="text-[#FFD700] font-bold text-lg">Notifications</span>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-[#FFD700] hover:text-[#E6C200] hover:bg-[rgba(255,215,0,0.1)] transition-all duration-300 rounded-lg px-3 py-1.5"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>

        {/* Notifications List */}
        <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[rgba(255,215,0,0.08)] rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-[#FFD700] opacity-40" />
              </div>
              <p className="text-[#F5F5DC]/60 font-medium">No notifications</p>
              <p className="text-[#F5F5DC]/40 text-sm mt-1">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <DropdownMenuItem
                key={notification.id}
                className={`
                  flex items-start gap-4 p-5 cursor-pointer
                  hover:bg-[rgba(255,215,0,0.08)]
                  transition-all duration-300
                  border-b border-[rgba(255,215,0,0.08)] last:border-b-0
                  ${!notification.read ? 'bg-[rgba(255,215,0,0.04)]' : ''}
                  group
                `}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                }}
              >
                {/* Icon */}
                <div className={`
                  mt-0.5 p-2.5 rounded-xl
                  bg-gradient-to-br from-[rgba(255,215,0,0.15)] to-[rgba(255,215,0,0.05)]
                  border border-[rgba(255,215,0,0.2)]
                  ${getTypeColor(notification.type)}
                  transition-transform duration-300 group-hover:scale-110
                  shadow-lg
                `}>
                  {getIcon(notification.icon)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="font-semibold text-sm text-[#F5F5DC] leading-tight">
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <div className="w-2.5 h-2.5 bg-gradient-to-br from-[#FFD700] to-[#E6C200] rounded-full mt-1 flex-shrink-0 shadow-lg animate-pulse" />
                    )}
                  </div>
                  <p className="text-sm text-[#F5F5DC]/75 leading-relaxed mb-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-[#FFD700]/60 font-medium">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 rounded-lg opacity-0 group-hover:opacity-100"
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

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-[rgba(255,215,0,0.15)]" />
            <div className="p-3 bg-gradient-to-r from-[rgba(255,215,0,0.05)] to-transparent">
              <Button
                variant="ghost"
                className="w-full text-[#FFD700] hover:text-[#E6C200] hover:bg-[rgba(255,215,0,0.1)] font-semibold transition-all duration-300 rounded-lg py-2"
                onClick={() => {
                  window.location.href = '/notifications';
                }}
              >
                View all notifications →
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 215, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.5);
        }
      `}</style>
    </DropdownMenu>
  );
}
