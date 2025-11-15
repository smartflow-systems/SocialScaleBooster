import { useState } from 'react';
import { Bot, Calendar, BarChart3, Zap, TrendingUp, Users, Sparkles, Plus, Command, Download, Settings, UserPlus } from 'lucide-react';
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
  gradient: string;
  action: () => void;
  badge?: string;
  badgeColor?: string;
}

export default function QuickActionsPanel() {
  const [showDialog, setShowDialog] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'create-bot',
      title: 'Create Bot',
      description: 'Launch a new AI-powered bot',
      icon: <Bot className="w-6 h-6" />,
      gradient: 'from-[#FFD700] to-[#E6C200]',
      action: () => {
        document.querySelector<HTMLButtonElement>('[data-create-bot]')?.click();
      },
    },
    {
      id: 'schedule-post',
      title: 'Schedule Post',
      description: 'Plan your next viral content',
      icon: <Calendar className="w-6 h-6" />,
      gradient: 'from-emerald-400 to-emerald-600',
      action: () => {
        window.location.href = '/dashboard?tab=scheduling';
      },
    },
    {
      id: 'view-analytics',
      title: 'Analytics',
      description: 'Check performance metrics',
      icon: <BarChart3 className="w-6 h-6" />,
      gradient: 'from-purple-400 to-purple-600',
      action: () => {
        window.location.href = '/dashboard?tab=analytics';
      },
    },
    {
      id: 'ai-assistant',
      title: 'AI Caption',
      description: 'Generate AI-powered captions',
      icon: <Sparkles className="w-6 h-6" />,
      gradient: 'from-[#FFD700] to-amber-500',
      action: () => {
        alert('🤖 AI Caption Generator coming soon! Generate multiple caption variations with GPT-4.');
      },
      badge: 'AI',
      badgeColor: 'bg-gradient-to-r from-violet-500 to-purple-600',
    },
    {
      id: 'browse-templates',
      title: 'Marketplace',
      description: 'Explore bot templates',
      icon: <Sparkles className="w-6 h-6" />,
      gradient: 'from-amber-400 to-orange-500',
      action: () => {
        window.location.href = '/dashboard?tab=marketplace';
      },
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download your analytics',
      icon: <Download className="w-6 h-6" />,
      gradient: 'from-cyan-400 to-blue-500',
      action: () => {
        alert('📊 Export feature coming soon! Download reports in CSV, JSON, or PDF format.');
      },
    },
    {
      id: 'integrations',
      title: 'Settings',
      description: 'Configure your account',
      icon: <Settings className="w-6 h-6" />,
      gradient: 'from-slate-400 to-slate-600',
      action: () => {
        alert('⚙️ Settings page coming soon!');
      },
    },
    {
      id: 'invite-team',
      title: 'Invite Team',
      description: 'Collaborate with team',
      icon: <UserPlus className="w-6 h-6" />,
      gradient: 'from-pink-400 to-rose-500',
      action: () => {
        alert('👥 Team collaboration coming soon! Invite members, assign roles, and collaborate.');
      },
      badge: 'SOON',
      badgeColor: 'bg-gradient-to-r from-[#FFD700] to-[#E6C200]',
    },
  ];

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button
          className="
            fixed bottom-6 right-6 h-16 w-16 rounded-2xl
            bg-gradient-to-br from-[#FFD700] via-[#E6C200] to-[#FFA500]
            hover:from-[#E6C200] hover:via-[#FFD700] hover:to-[#FF8C00]
            shadow-2xl hover:shadow-[0_20px_80px_rgba(255,215,0,0.5)]
            transition-all duration-500
            transform hover:scale-110 hover:rotate-[8deg]
            z-40
            border-2 border-[rgba(255,215,0,0.3)]
            animate-pulse hover:animate-none
          "
          size="icon"
        >
          <Plus className="w-7 h-7 text-[#0D0D0D] font-bold" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          max-w-4xl
          bg-[rgba(13,13,13,0.98)]
          backdrop-blur-2xl
          border-2 border-[rgba(255,215,0,0.25)]
          text-[#F5F5DC]
          shadow-2xl
          rounded-3xl
          p-0
          overflow-hidden
        "
        style={{
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 215, 0, 0.15) inset'
        }}
      >
        {/* Gradient Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[rgba(255,215,0,0.08)] to-transparent pointer-events-none" />

        <DialogHeader className="relative px-8 pt-8 pb-6 border-b border-[rgba(255,215,0,0.15)]">
          <DialogTitle className="text-3xl font-bold text-[#FFD700] flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-[#FFD700] to-[#E6C200] rounded-xl shadow-lg">
              <Zap className="w-7 h-7 text-[#0D0D0D]" />
            </div>
            Quick Actions
          </DialogTitle>
          <DialogDescription className="text-[#F5F5DC]/70 text-base mt-2">
            Fast access to common tasks. Press{' '}
            <kbd className="px-3 py-1.5 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.25)] rounded-lg text-[#FFD700] text-sm font-semibold shadow-md">
              Cmd+K
            </kbd>
            {' '}anytime for the command palette.
          </DialogDescription>
        </DialogHeader>

        {/* Actions Grid */}
        <div className="relative px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {quickActions.map((action, index) => (
              <Card
                key={action.id}
                className="
                  relative group cursor-pointer
                  bg-[rgba(59,47,47,0.4)]
                  backdrop-blur-md
                  border border-[rgba(255,215,0,0.2)]
                  hover:border-[rgba(255,215,0,0.5)]
                  hover:bg-[rgba(59,47,47,0.6)]
                  transition-all duration-300
                  transform hover:scale-105 hover:-translate-y-1
                  overflow-hidden
                  rounded-2xl
                  shadow-lg hover:shadow-2xl
                "
                style={{
                  animationDelay: `${index * 50}ms`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
                onClick={() => {
                  action.action();
                  setShowDialog(false);
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,215,0,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge */}
                {action.badge && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`
                      text-[10px] font-bold px-2.5 py-1 rounded-full
                      ${action.badgeColor || 'bg-gradient-to-r from-[#FFD700] to-[#E6C200]'}
                      text-[#0D0D0D] shadow-lg
                    `}>
                      {action.badge}
                    </span>
                  </div>
                )}

                <CardContent className="relative p-6 flex flex-col items-center text-center gap-4">
                  {/* Icon with gradient */}
                  <div className={`
                    p-4 rounded-2xl
                    bg-gradient-to-br ${action.gradient}
                    text-white
                    shadow-xl
                    transition-transform duration-300
                    group-hover:scale-110 group-hover:rotate-3
                  `}>
                    {action.icon}
                  </div>

                  {/* Text Content */}
                  <div>
                    <h3 className="font-bold text-base text-[#F5F5DC] mb-1.5 group-hover:text-[#FFD700] transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-xs text-[#F5F5DC]/60 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </CardContent>

                {/* Bottom glow effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </Card>
            ))}
          </div>
        </div>

        {/* Pro Tip Footer */}
        <div className="relative px-8 pb-8">
          <div className="p-5 bg-[rgba(59,47,47,0.4)] backdrop-blur-md rounded-2xl border border-[rgba(255,215,0,0.15)]">
            <div className="flex items-start gap-3 text-sm text-[#F5F5DC]/80 mb-3">
              <div className="p-2 bg-gradient-to-br from-[#FFD700] to-[#E6C200] rounded-lg shadow-md flex-shrink-0">
                <Command className="w-4 h-4 text-[#0D0D0D]" />
              </div>
              <div>
                <strong className="text-[#FFD700] font-bold">Pro Tip:</strong>
                <span className="ml-1">Use keyboard shortcuts to access actions faster!</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                { key: 'C', label: 'Create Bot' },
                { key: 'S', label: 'Schedule' },
                { key: 'A', label: 'Analytics' },
                { key: 'M', label: 'Marketplace' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2 text-xs text-[#F5F5DC]/70">
                  <kbd className="px-2.5 py-1.5 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.25)] rounded-lg text-[#FFD700] font-semibold text-[11px] shadow-sm">
                    {key}
                  </kbd>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
