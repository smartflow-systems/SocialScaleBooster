import { useState, useEffect } from 'react';
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
  Keyboard,
} from 'lucide-react';

interface CommandAction {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  group: string;
  action: () => void;
  keywords?: string[];
  shortcut?: string;
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
      description: 'View your main dashboard',
      icon: <Home className="w-4 h-4" />,
      group: 'Navigation',
      action: () => {
        window.location.href = '/dashboard';
        setOpen(false);
      },
      keywords: ['home', 'main'],
      shortcut: '⌘D',
    },
    {
      id: 'nav-bots',
      label: 'My Bots',
      description: 'Manage your AI bots',
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
      description: 'View performance metrics',
      icon: <BarChart3 className="w-4 h-4" />,
      group: 'Navigation',
      action: () => {
        window.location.href = '/dashboard?tab=analytics';
        setOpen(false);
      },
      keywords: ['stats', 'metrics', 'data'],
      shortcut: '⌘A',
    },
    {
      id: 'nav-marketplace',
      label: 'Marketplace',
      description: 'Browse bot templates',
      icon: <Store className="w-4 h-4" />,
      group: 'Navigation',
      action: () => {
        window.location.href = '/dashboard?tab=marketplace';
        setOpen(false);
      },
      keywords: ['templates', 'shop', 'store'],
      shortcut: '⌘M',
    },
    {
      id: 'nav-scheduling',
      label: 'Scheduling',
      description: 'Plan your content',
      icon: <Calendar className="w-4 h-4" />,
      group: 'Navigation',
      action: () => {
        window.location.href = '/dashboard?tab=scheduling';
        setOpen(false);
      },
      keywords: ['calendar', 'plan', 'posts'],
      shortcut: '⌘S',
    },

    // Actions
    {
      id: 'action-create-bot',
      label: 'Create New Bot',
      description: 'Launch a new AI-powered bot',
      icon: <Bot className="w-4 h-4" />,
      group: 'Actions',
      action: () => {
        document.querySelector<HTMLButtonElement>('[data-create-bot]')?.click();
        setOpen(false);
      },
      keywords: ['new', 'add', 'robot'],
      shortcut: 'C',
    },
    {
      id: 'action-schedule-post',
      label: 'Schedule Post',
      description: 'Plan your next viral content',
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
      description: 'Create captions with GPT-4',
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
      description: 'AI-powered viral video scripts',
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
      description: 'See what\'s viral right now',
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
      <Command
        className="
          bg-[rgba(13,13,13,0.98)]
          backdrop-blur-2xl
          border-2 border-[rgba(255,215,0,0.25)]
          rounded-2xl
          overflow-hidden
        "
        style={{
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 215, 0, 0.15) inset'
        }}
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-[rgba(255,215,0,0.15)] px-4 bg-gradient-to-r from-[rgba(255,215,0,0.08)] to-transparent">
          <Search className="w-5 h-5 text-[#FFD700] mr-3" />
          <CommandInput
            placeholder="Type a command or search..."
            className="
              text-[#F5F5DC] placeholder:text-[#F5F5DC]/50
              border-0 focus:ring-0
              bg-transparent
              text-base
              py-4
            "
          />
          <kbd className="hidden sm:inline-block px-2.5 py-1 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.25)] rounded-lg text-[#FFD700] text-xs font-semibold ml-2">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <CommandList className="max-h-[450px] custom-scrollbar p-2">
          <CommandEmpty className="py-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[rgba(255,215,0,0.08)] rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-[#FFD700] opacity-40" />
            </div>
            <p className="text-sm text-[#F5F5DC]/60 font-medium">No results found</p>
            <p className="text-xs text-[#F5F5DC]/40 mt-1">Try searching for something else</p>
          </CommandEmpty>

          {/* Group commands by category */}
          {['Navigation', 'Actions', 'AI Features', 'Insights', 'Settings'].map((group, groupIndex) => {
            const groupCommands = commands.filter((cmd) => cmd.group === group);
            if (groupCommands.length === 0) return null;

            return (
              <div key={group}>
                <CommandGroup
                  heading={group}
                  className="
                    text-[#FFD700] font-bold text-xs uppercase tracking-wider
                    px-3 py-2
                    [&_[cmdk-group-heading]]:text-[#FFD700]
                  "
                >
                  {groupCommands.map((command) => (
                    <CommandItem
                      key={command.id}
                      onSelect={() => command.action()}
                      className="
                        flex items-center justify-between gap-3
                        px-4 py-3 my-1
                        cursor-pointer
                        rounded-xl
                        text-[#F5F5DC]
                        hover:bg-[rgba(255,215,0,0.08)]
                        aria-selected:bg-[rgba(255,215,0,0.12)]
                        transition-all duration-200
                        border border-transparent
                        hover:border-[rgba(255,215,0,0.2)]
                        group
                      "
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Icon */}
                        <div className="
                          p-2 rounded-lg
                          bg-gradient-to-br from-[rgba(255,215,0,0.15)] to-[rgba(255,215,0,0.05)]
                          border border-[rgba(255,215,0,0.2)]
                          text-[#FFD700]
                          group-hover:scale-110
                          transition-transform duration-200
                        ">
                          {command.icon}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm group-hover:text-[#FFD700] transition-colors duration-200">
                            {command.label}
                          </div>
                          {command.description && (
                            <div className="text-xs text-[#F5F5DC]/60 mt-0.5 truncate">
                              {command.description}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Shortcut Badge */}
                      {command.shortcut && (
                        <kbd className="
                          hidden sm:inline-block
                          px-2.5 py-1
                          bg-[rgba(255,215,0,0.08)]
                          border border-[rgba(255,215,0,0.2)]
                          rounded-lg
                          text-[#FFD700]
                          text-[10px]
                          font-bold
                          opacity-60 group-hover:opacity-100
                          transition-opacity duration-200
                        ">
                          {command.shortcut}
                        </kbd>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {groupIndex < 4 && <CommandSeparator className="bg-[rgba(255,215,0,0.1)] my-2" />}
              </div>
            );
          })}
        </CommandList>

        {/* Footer with Keyboard Hints */}
        <div className="
          border-t border-[rgba(255,215,0,0.15)]
          p-3 px-4
          text-xs text-[#F5F5DC]/70
          bg-gradient-to-r from-[rgba(255,215,0,0.05)] to-transparent
        ">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1">
              <div className="p-1.5 bg-gradient-to-br from-[#FFD700] to-[#E6C200] rounded-md shadow-sm">
                <Keyboard className="w-3 h-3 text-[#0D0D0D]" />
              </div>
              <span className="ml-1 text-[#FFD700] font-semibold">Shortcuts</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.25)] rounded text-[10px] text-[#FFD700] font-semibold">↑</kbd>
                <kbd className="px-2 py-1 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.25)] rounded text-[10px] text-[#FFD700] font-semibold">↓</kbd>
                <span className="ml-1">Navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.25)] rounded text-[10px] text-[#FFD700] font-semibold">↵</kbd>
                <span className="ml-1">Select</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-[rgba(255,215,0,0.1)] border border-[rgba(255,215,0,0.25)] rounded text-[10px] text-[#FFD700] font-semibold">ESC</kbd>
                <span className="ml-1">Close</span>
              </div>
            </div>
          </div>
        </div>
      </Command>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
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
    </CommandDialog>
  );
}
