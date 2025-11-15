import { useState } from 'react';
import { Bot, Calendar, BarChart3, Zap, TrendingUp, Users, Sparkles, Plus, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  badge?: string;
}

export default function QuickActionsPanel() {
  const [showDialog, setShowDialog] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'create-bot',
      title: 'Create Bot',
      description: 'Launch a new AI-powered social media bot',
      icon: <Bot className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      action: () => {
        // Trigger create bot dialog
        document.querySelector<HTMLButtonElement>('[data-create-bot]')?.click();
      },
    },
    {
      id: 'schedule-post',
      title: 'Schedule Post',
      description: 'Plan your next viral content',
      icon: <Calendar className="w-6 h-6" />,
      color: 'from-green-500 to-green-600',
      action: () => {
        window.location.href = '/dashboard?tab=scheduling';
      },
    },
    {
      id: 'view-analytics',
      title: 'Analytics',
      description: 'Check your performance metrics',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      action: () => {
        window.location.href = '/dashboard?tab=analytics';
      },
    },
    {
      id: 'browse-templates',
      title: 'Browse Templates',
      description: 'Explore pre-built bot templates',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-yellow-500 to-yellow-600',
      action: () => {
        window.location.href = '/dashboard?tab=marketplace';
      },
    },
    {
      id: 'trending-content',
      title: 'Trending Now',
      description: 'See what\'s going viral today',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-red-500 to-red-600',
      action: () => {
        // Navigate to trends page (to be created)
        alert('🔥 Trending content detection coming soon! This will show real-time viral trends from TikTok, Instagram, and Twitter.');
      },
      badge: 'NEW',
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connect your social accounts',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      action: () => {
        window.location.href = '/dashboard?tab=integrations';
      },
    },
    {
      id: 'invite-team',
      title: 'Invite Team',
      description: 'Collaborate with your team',
      icon: <Users className="w-6 h-6" />,
      color: 'from-pink-500 to-pink-600',
      action: () => {
        alert('👥 Team collaboration coming soon! Invite team members, assign roles, and collaborate on content.');
      },
      badge: 'SOON',
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Get AI-powered content ideas',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-indigo-500 to-indigo-600',
      action: () => {
        alert('🤖 AI Content Assistant coming soon! Generate captions, hashtags, and video scripts with GPT-4.');
      },
      badge: 'AI',
    },
  ];

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#E6C200] hover:to-[#FF8C00] shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-40"
          size="icon"
        >
          <Plus className="w-6 h-6 text-[#0D0D0D]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-[#0D0D0D] border-[#3B2F2F] text-[#F5F5DC]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#FFD700] flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Quick Actions
          </DialogTitle>
          <DialogDescription className="text-[#F5F5DC]/70">
            Fast access to common tasks. Press <kbd className="px-2 py-1 bg-[#3B2F2F] rounded text-xs">Cmd+K</kbd> anytime to open.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {quickActions.map((action) => (
            <Card
              key={action.id}
              className="relative group cursor-pointer hover:scale-105 transition-all duration-200 bg-gradient-to-br from-[#1a1a1a] to-[#0D0D0D] border-[#3B2F2F] hover:border-[#FFD700] overflow-hidden"
              onClick={() => {
                action.action();
                setShowDialog(false);
              }}
            >
              {action.badge && (
                <div className="absolute top-2 right-2 z-10">
                  <span className="text-[8px] font-bold px-2 py-0.5 bg-[#FFD700] text-[#0D0D0D] rounded-full">
                    {action.badge}
                  </span>
                </div>
              )}
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg`}>
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#F5F5DC] mb-1">
                    {action.title}
                  </h3>
                  <p className="text-xs text-[#F5F5DC]/60">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#3B2F2F]">
          <div className="flex items-center gap-2 text-sm text-[#F5F5DC]/70">
            <Command className="w-4 h-4 text-[#FFD700]" />
            <span>
              <strong className="text-[#FFD700]">Pro Tip:</strong> Use keyboard shortcuts to access actions faster!
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-[#F5F5DC]/60">
            <div><kbd className="px-2 py-1 bg-[#3B2F2F] rounded">C</kbd> Create Bot</div>
            <div><kbd className="px-2 py-1 bg-[#3B2F2F] rounded">S</kbd> Schedule Post</div>
            <div><kbd className="px-2 py-1 bg-[#3B2F2F] rounded">A</kbd> Analytics</div>
            <div><kbd className="px-2 py-1 bg-[#3B2F2F] rounded">T</kbd> Templates</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
