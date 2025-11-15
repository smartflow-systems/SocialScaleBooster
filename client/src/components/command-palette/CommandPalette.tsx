import { useState, useEffect, useCallback } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Bot,
  Calendar,
  BarChart3,
  Store,
  Users,
  Settings,
  Zap,
  TrendingUp,
  Crown,
  Home,
  LogOut,
  Search,
  Hash,
  Video,
  Image,
  FileText,
  Sparkles,
} from 'lucide-react';

interface CommandAction {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  group: string;
  action: () => void;
  keywords?: string[];
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  // Keyboard shortcut to open (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commands: CommandAction[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      icon: <Home className="w-4 h-4" />,
      group: 'Navigation',
      action: () => {
        window.location.href = '/dashboard';
        setOpen(false);
      },
      keywords: ['home', 'main'],
    },
    {
      id: 'nav-bots',
      label: 'My Bots',
      icon: <Bot className="w-4 h-4" />,
      group: 'Navigation',
      action: () => {
        window.location.href = '/dashboard?tab=bots';
        setOpen(false);
      },
      keywords: ['robots', 'automation'],
    },
    {
      id: 'nav-analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      group: 'Navigation',
      action: () => {
        window.location.href = '/dashboard?tab=analytics';
        setOpen(false);
      },
      keywords: ['stats', 'metrics', 'data'],
    },
    {
      id: 'nav-marketplace',
      label: 'Marketplace',
      icon: <Store className="w-4 h-4" />,
      group: 'Navigation',
      action: () => {
        window.location.href = '/dashboard?tab=marketplace';
        setOpen(false);
      },
      keywords: ['templates', 'shop', 'store'],
    },
    {
      id: 'nav-scheduling',
      label: 'Scheduling',
      icon: <Calendar className="w-4 h-4" />,
      group: 'Navigation',
      action: () => {
        window.location.href = '/dashboard?tab=scheduling';
        setOpen(false);
      },
      keywords: ['calendar', 'plan', 'posts'],
    },

    // Actions
    {
      id: 'action-create-bot',
      label: 'Create New Bot',
      description: 'Launch a new AI bot',
      icon: <Bot className="w-4 h-4" />,
      group: 'Actions',
      action: () => {
        document.querySelector<HTMLButtonElement>('[data-create-bot]')?.click();
        setOpen(false);
      },
      keywords: ['new', 'add', 'robot'],
    },
    {
      id: 'action-schedule-post',
      label: 'Schedule Post',
      description: 'Plan your next content',
      icon: <Calendar className="w-4 h-4" />,
      group: 'Actions',
      action: () => {
        window.location.href = '/dashboard?tab=scheduling';
        setOpen(false);
      },
      keywords: ['post', 'publish', 'content'],
    },
    {
      id: 'action-upgrade',
      label: 'Upgrade to Pro',
      description: 'Unlock premium features',
      icon: <Crown className="w-4 h-4" />,
      group: 'Actions',
      action: () => {
        window.location.href = '/subscribe';
        setOpen(false);
      },
      keywords: ['premium', 'paid', 'upgrade'],
    },

    // AI Features
    {
      id: 'ai-caption',
      label: 'Generate AI Caption',
      description: 'Create captions with AI',
      icon: <Sparkles className="w-4 h-4" />,
      group: 'AI Features',
      action: () => {
        alert('🤖 AI Caption Generator coming soon! Generate multiple caption variations with GPT-4.');
        setOpen(false);
      },
      keywords: ['gpt', 'write', 'text'],
    },
    {
      id: 'ai-hashtags',
      label: 'Generate Hashtags',
      description: 'Find trending hashtags',
      icon: <Hash className="w-4 h-4" />,
      group: 'AI Features',
      action: () => {
        alert('📈 Hashtag Generator coming soon! Get trending hashtags optimized for your content.');
        setOpen(false);
      },
      keywords: ['tags', 'trending'],
    },
    {
      id: 'ai-video',
      label: 'Generate Video Script',
      description: 'AI-powered video scripts',
      icon: <Video className="w-4 h-4" />,
      group: 'AI Features',
      action: () => {
        alert('🎬 Video Script Generator coming soon! Create viral video scripts with AI.');
        setOpen(false);
      },
      keywords: ['script', 'content', 'viral'],
    },
    {
      id: 'ai-image',
      label: 'AI Image Generator',
      description: 'Generate images with DALL-E',
      icon: <Image className="w-4 h-4" />,
      group: 'AI Features',
      action: () => {
        alert('🎨 AI Image Generator coming soon! Create custom images with DALL-E 3.');
        setOpen(false);
      },
      keywords: ['dalle', 'picture', 'visual'],
    },

    // Insights
    {
      id: 'insight-trends',
      label: 'View Trending Content',
      description: 'See what\'s viral now',
      icon: <TrendingUp className="w-4 h-4" />,
      group: 'Insights',
      action: () => {
        alert('🔥 Trend Detection coming soon! Real-time viral trends from all platforms.');
        setOpen(false);
      },
      keywords: ['viral', 'popular', 'hot'],
    },
    {
      id: 'insight-performance',
      label: 'Performance Report',
      description: 'View detailed analytics',
      icon: <FileText className="w-4 h-4" />,
      group: 'Insights',
      action: () => {
        window.location.href = '/dashboard?tab=analytics';
        setOpen(false);
      },
      keywords: ['report', 'stats', 'metrics'],
    },

    // Settings
    {
      id: 'settings',
      label: 'Settings',
      description: 'Account and preferences',
      icon: <Settings className="w-4 h-4" />,
      group: 'Settings',
      action: () => {
        alert('⚙️ Settings page coming soon!');
        setOpen(false);
      },
      keywords: ['preferences', 'config'],
    },
    {
      id: 'logout',
      label: 'Logout',
      description: 'Sign out of your account',
      icon: <LogOut className="w-4 h-4" />,
      group: 'Settings',
      action: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          window.location.href = '/';
        } catch (error) {
          console.error('Logout failed:', error);
        }
        setOpen(false);
      },
      keywords: ['signout', 'exit'],
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="bg-[#0D0D0D] border-[#3B2F2F]">
        <CommandInput
          placeholder="Type a command or search..."
          className="text-[#F5F5DC] placeholder:text-[#F5F5DC]/50"
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty className="py-6 text-center text-sm text-[#F5F5DC]/60">
            No results found.
          </CommandEmpty>

          {/* Group commands by category */}
          {['Navigation', 'Actions', 'AI Features', 'Insights', 'Settings'].map((group) => {
            const groupCommands = commands.filter((cmd) => cmd.group === group);
            if (groupCommands.length === 0) return null;

            return (
              <div key={group}>
                <CommandGroup
                  heading={group}
                  className="text-[#FFD700]"
                >
                  {groupCommands.map((command) => (
                    <CommandItem
                      key={command.id}
                      onSelect={() => command.action()}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#3B2F2F] text-[#F5F5DC] aria-selected:bg-[#3B2F2F]"
                    >
                      <div className="text-[#FFD700]">{command.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium">{command.label}</div>
                        {command.description && (
                          <div className="text-xs text-[#F5F5DC]/60">
                            {command.description}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                {group !== 'Settings' && <CommandSeparator className="bg-[#3B2F2F]" />}
              </div>
            );
          })}
        </CommandList>

        <div className="border-t border-[#3B2F2F] p-2 text-xs text-[#F5F5DC]/60 bg-[#1a1a1a]">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-[#3B2F2F] rounded text-[10px]">↑</kbd>
                <kbd className="px-2 py-1 bg-[#3B2F2F] rounded text-[10px]">↓</kbd>
                <span className="ml-1">Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-[#3B2F2F] rounded text-[10px]">Enter</kbd>
                <span className="ml-1">Select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-[#3B2F2F] rounded text-[10px]">Esc</kbd>
                <span className="ml-1">Close</span>
              </div>
            </div>
          </div>
        </div>
      </Command>
    </CommandDialog>
  );
}
