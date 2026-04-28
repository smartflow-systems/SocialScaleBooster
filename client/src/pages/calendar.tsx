import { useState } from "react";
import { Link } from "wouter";
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight, Instagram, Twitter, Facebook, Youtube, Music } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { type ScheduledPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { GlassCard, GoldHeading, SfsContainer } from "@/components/sfs";

const platforms = [
  { value: "instagram", label: "Instagram", icon: Instagram, color: "bg-pink-500/20 text-pink-400 border-pink-400/30" },
  { value: "twitter", label: "Twitter", icon: Twitter, color: "bg-blue-500/20 text-blue-400 border-blue-400/30" },
  { value: "facebook", label: "Facebook", icon: Facebook, color: "bg-blue-600/20 text-blue-500 border-blue-500/30" },
  { value: "youtube", label: "YouTube", icon: Youtube, color: "bg-red-500/20 text-red-400 border-red-400/30" },
  { value: "tiktok", label: "TikTok", icon: Music, color: "bg-cyan-500/20 text-cyan-400 border-cyan-400/30" },
];

function getPlatformStyle(platform: string) {
  return platforms.find(p => p.value === platform)?.color ?? "bg-[var(--sf-gold)]/10 text-[var(--sf-gold)] border-[var(--sf-gold)]/30";
}

function PlatformIcon({ platform }: { platform: string }) {
  const found = platforms.find(p => p.value === platform);
  if (!found) return null;
  const Icon = found.icon;
  return <Icon className="w-3 h-3" />;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type ViewMode = "month" | "week";

function getWeekDays(baseDate: Date): Date[] {
  const day = baseDate.getDay();
  const sunday = new Date(baseDate);
  sunday.setDate(baseDate.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

export default function ContentCalendar() {
  const today = new Date();
  const [view, setView] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [weekBase, setWeekBase] = useState(new Date());

  const { data: posts = [], isLoading } = useQuery<ScheduledPost[]>({
    queryKey: ["/api/scheduled-posts"],
  });

  function getPostsForDay(day: Date): ScheduledPost[] {
    return posts.filter(p => isSameDay(new Date(p.scheduledAt), day));
  }

  function prevMonth() {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  function prevWeek() {
    setWeekBase(d => { const n = new Date(d); n.setDate(d.getDate() - 7); return n; });
  }

  function nextWeek() {
    setWeekBase(d => { const n = new Date(d); n.setDate(d.getDate() + 7); return n; });
  }

  const monthYear = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const calendarCells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)),
  ];
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  const weekDays = getWeekDays(weekBase);
  const weekLabel = `${weekDays[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${weekDays[6].toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;

  return (
    <div className="min-h-screen bg-[var(--sf-black)] text-white">
      <SfsContainer className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--sf-gold)] hover:text-[var(--sf-gold-2)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--sf-gold)] to-[var(--sf-gold-2)] rounded-xl flex items-center justify-center shadow-[var(--sf-glow-gold-sm)]">
              <Calendar className="w-6 h-6 text-[var(--sf-black)]" />
            </div>
            <div>
              <GoldHeading level={1} className="text-2xl font-bold">Content Calendar</GoldHeading>
              <p className="text-neutral-400 text-sm">View your scheduled posts at a glance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-[var(--sf-gold)]/20 overflow-hidden">
              <button
                onClick={() => setView("month")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${view === "month" ? "bg-[var(--sf-gold)] text-[var(--sf-black)]" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
              >
                Month
              </button>
              <button
                onClick={() => setView("week")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${view === "week" ? "bg-[var(--sf-gold)] text-[var(--sf-black)]" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
              >
                Week
              </button>
            </div>
            <Link href="/scheduler" className="px-3 py-2 text-sm font-medium rounded-lg bg-[var(--sf-gold)]/10 text-[var(--sf-gold)] border border-[var(--sf-gold)]/30 hover:bg-[var(--sf-gold)]/20 transition-colors">
              + Schedule
            </Link>
          </div>
        </div>

        <GlassCard className="overflow-hidden p-0">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--sf-gold)]/10">
            <Button
              variant="ghost"
              size="icon"
              onClick={view === "month" ? prevMonth : prevWeek}
              className="text-neutral-400 hover:text-white hover:bg-white/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-white font-semibold text-lg">
              {view === "month" ? monthYear : weekLabel}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={view === "month" ? nextMonth : nextWeek}
              className="text-neutral-400 hover:text-white hover:bg-white/5"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {view === "month" ? (
            <>
              <div className="grid grid-cols-7 border-b border-[var(--sf-gold)]/10">
                {DAY_NAMES.map(d => (
                  <div key={d} className="py-2 text-center text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarCells.map((day, idx) => {
                  const dayPosts = day ? getPostsForDay(day) : [];
                  const isToday = day ? isSameDay(day, today) : false;
                  return (
                    <div
                      key={idx}
                      className={`min-h-[90px] p-2 border-b border-r border-[var(--sf-gold)]/10 last:border-r-0 ${
                        !day ? "bg-transparent" : isToday ? "bg-[var(--sf-gold)]/5" : ""
                      } ${idx % 7 === 6 ? "border-r-0" : ""}`}
                    >
                      {day && (
                        <>
                          <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                            isToday ? "bg-[var(--sf-gold)] text-[var(--sf-black)]" : "text-neutral-400"
                          }`}>
                            {day.getDate()}
                          </div>
                          {isLoading ? null : (
                            <div className="space-y-1">
                              {dayPosts.slice(0, 3).map(post => (
                                <div
                                  key={post.id}
                                  className={`text-xs px-1.5 py-0.5 rounded border flex items-center gap-1 truncate ${getPlatformStyle(post.platform)}`}
                                  title={post.content}
                                >
                                  <PlatformIcon platform={post.platform} />
                                  <span className="truncate">{post.content}</span>
                                </div>
                              ))}
                              {dayPosts.length > 3 && (
                                <div className="text-xs text-neutral-400 pl-1">+{dayPosts.length - 3} more</div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-7 border-b border-[var(--sf-gold)]/10">
                {weekDays.map((day, i) => {
                  const isToday = isSameDay(day, today);
                  return (
                    <div key={i} className="py-3 text-center border-r border-[var(--sf-gold)]/10 last:border-r-0">
                      <div className="text-xs text-neutral-400 uppercase tracking-wider mb-1">{DAY_NAMES[day.getDay()]}</div>
                      <div className={`text-sm font-semibold w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
                        isToday ? "bg-[var(--sf-gold)] text-[var(--sf-black)]" : "text-white"
                      }`}>
                        {day.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-7 min-h-[300px]">
                {weekDays.map((day, i) => {
                  const dayPosts = getPostsForDay(day);
                  return (
                    <div key={i} className="p-2 border-r border-[var(--sf-gold)]/10 last:border-r-0 space-y-1.5">
                      {isLoading ? null : dayPosts.map(post => (
                        <div
                          key={post.id}
                          className={`text-xs px-2 py-1.5 rounded border flex flex-col gap-0.5 ${getPlatformStyle(post.platform)}`}
                          title={post.content}
                        >
                          <div className="flex items-center gap-1">
                            <PlatformIcon platform={post.platform} />
                            <span className="font-medium capitalize">{post.platform}</span>
                          </div>
                          <span className="truncate opacity-80">{post.content}</span>
                          <span className="opacity-60">
                            {new Date(post.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))}
                      {!isLoading && dayPosts.length === 0 && (
                        <div className="h-full min-h-[60px]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </GlassCard>

        {!isLoading && posts.length === 0 && (
          <p className="text-center text-neutral-400 text-sm mt-6">
            No scheduled posts yet.{" "}
            <Link href="/scheduler" className="text-[var(--sf-gold)] hover:underline">Schedule your first post</Link>
          </p>
        )}
      </SfsContainer>
    </div>
  );
}
