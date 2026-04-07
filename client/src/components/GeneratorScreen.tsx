import React, { useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Platform = 'instagram' | 'tiktok' | 'facebook';
export type PostType = string;
export type Voice = 'professional' | 'casual' | 'hype';
export type Niche = 'barber' | 'salon' | 'gym';

export interface GenerateParams {
  platform: Platform;
  postType: PostType;
  topic: string;
  voice: Voice;
  niche: Niche;
}

interface GeneratorScreenProps {
  niche: Niche;
  defaultVoice: Voice;
  generationsUsed: number;
  generationsLimit: number;
  onGenerate: (params: GenerateParams) => void;
  isLoading: boolean;
}

// ---------------------------------------------------------------------------
// Post type data per niche
// ---------------------------------------------------------------------------

const POST_TYPES: Record<Niche, PostType[]> = {
  barber: [
    'Fresh Cut',
    'Before & After',
    'Booking Open',
    'Staff Intro',
    'Testimonial',
    'Behind the Scenes',
    'Style Tip',
    'Product Feature',
    'Seasonal',
    'Community',
  ],
  salon: [
    'Colour Transform',
    'Before & After',
    'Booking Open',
    'Stylist Spotlight',
    'Testimonial',
    'Behind the Scenes',
    'Style Tip',
    'Product Feature',
    'Seasonal',
    'Community',
  ],
  gym: [
    'Member Win',
    'Before & After',
    'Class Schedule',
    'Trainer Intro',
    'Testimonial',
    'Behind the Scenes',
    'Workout Tip',
    'Supplement Feature',
    'Seasonal Challenge',
    'Community',
  ],
};

// ---------------------------------------------------------------------------
// Platform icon SVGs (inline — no icon library dependency needed)
// ---------------------------------------------------------------------------

const InstagramIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="w-7 h-7"
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="5"
      stroke={active ? '#FFD700' : '#9CA3AF'}
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="12"
      r="4"
      stroke={active ? '#FFD700' : '#9CA3AF'}
      strokeWidth="2"
    />
    <circle cx="17.5" cy="6.5" r="1" fill={active ? '#FFD700' : '#9CA3AF'} />
  </svg>
);

const TikTokIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="w-7 h-7"
  >
    <path
      d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"
      stroke={active ? '#FFD700' : '#9CA3AF'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FacebookIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className="w-7 h-7"
  >
    <path
      d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
      stroke={active ? '#FFD700' : '#9CA3AF'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

const Spinner: React.FC = () => (
  <svg
    className="animate-spin w-5 h-5 text-[#0D0D0D]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

// ---------------------------------------------------------------------------
// Section label
// ---------------------------------------------------------------------------

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-2 select-none">
    {children}
  </p>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const GeneratorScreen: React.FC<GeneratorScreenProps> = ({
  niche,
  defaultVoice,
  generationsUsed,
  generationsLimit,
  onGenerate,
  isLoading,
}) => {
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [postType, setPostType] = useState<PostType>(POST_TYPES[niche][0]);
  const [topic, setTopic] = useState('');
  const [voice, setVoice] = useState<Voice>(defaultVoice);

  const remaining = Math.max(0, generationsLimit - generationsUsed);
  const isExhausted = remaining === 0;
  const canGenerate = !isLoading && !isExhausted && topic.trim().length > 0;

  const handleGenerate = useCallback(() => {
    if (!canGenerate) return;
    onGenerate({ platform, postType, topic: topic.trim(), voice, niche });
  }, [canGenerate, onGenerate, platform, postType, topic, voice, niche]);

  const platforms: { id: Platform; label: string; Icon: React.FC<{ active: boolean }> }[] = [
    { id: 'instagram', label: 'Instagram', Icon: InstagramIcon },
    { id: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
    { id: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  ];

  const voices: { id: Voice; label: string }[] = [
    { id: 'professional', label: 'Professional' },
    { id: 'casual', label: 'Casual' },
    { id: 'hype', label: 'Hype' },
  ];

  return (
    // Full-screen dark backdrop, vertically centred on larger screens
    <div className="min-h-screen bg-[#0D0D0D] flex items-start sm:items-center justify-center px-4 py-6 sm:py-10">
      {/* Card */}
      <div className="w-full max-w-md bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#3B2F2F] overflow-hidden">

        {/* Card header */}
        <div className="bg-[#3B2F2F] px-5 py-4">
          <h1 className="text-[#FFD700] font-bold text-lg tracking-tight leading-tight">
            SocialScaleBooster
          </h1>
          <p className="text-[#D1C4A8] text-xs mt-0.5 opacity-80">
            AI caption generator
          </p>
        </div>

        {/* Form body */}
        <div className="px-5 py-6 space-y-7">

          {/* ── 1. Platform selector ── */}
          <div>
            <SectionLabel>Platform</SectionLabel>
            <div className="flex gap-3" role="group" aria-label="Select platform">
              {platforms.map(({ id, label, Icon }) => {
                const isActive = platform === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPlatform(id)}
                    aria-pressed={isActive}
                    aria-label={label}
                    className={[
                      'flex flex-col items-center justify-center gap-1.5 flex-1',
                      'h-16 rounded-xl border-2 transition-all duration-150',
                      'active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]',
                      isActive
                        ? 'border-[#FFD700] bg-[#FFD700]/10'
                        : 'border-[#3B2F2F] bg-[#0D0D0D] hover:border-[#FFD700]/40',
                    ].join(' ')}
                  >
                    <Icon active={isActive} />
                    <span
                      className={`text-[10px] font-semibold tracking-wide select-none ${
                        isActive ? 'text-[#FFD700]' : 'text-[#9CA3AF]'
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 2. Post type chips ── */}
          <div>
            <SectionLabel>Post type</SectionLabel>
            {/* Horizontally scrollable chip list */}
            <div
              className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x"
              role="group"
              aria-label="Select post type"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {POST_TYPES[niche].map((type) => {
                const isActive = postType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setPostType(type)}
                    aria-pressed={isActive}
                    className={[
                      'flex-shrink-0 snap-start',
                      'px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap',
                      'border transition-all duration-150',
                      'active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700]',
                      isActive
                        ? 'bg-[#FFD700] text-[#0D0D0D] border-[#FFD700] shadow-sm'
                        : 'bg-[#0D0D0D] text-[#9CA3AF] border-[#3B2F2F] hover:border-[#FFD700]/50 hover:text-[#D1C4A8]',
                    ].join(' ')}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 3. Topic input ── */}
          <div>
            <SectionLabel>Topic</SectionLabel>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 80))}
              placeholder="e.g. fresh skin fade, walk-ins this Saturday"
              maxLength={80}
              enterKeyHint="done"
              className={[
                'w-full bg-[#0D0D0D] border rounded-xl px-4 py-3.5',
                'text-[#F5F0E8] text-base font-medium placeholder-[#4B4B4B]',
                'focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]',
                'transition-colors duration-150',
                topic.length >= 80
                  ? 'border-amber-500'
                  : 'border-[#3B2F2F]',
              ].join(' ')}
              aria-label="Topic"
            />
            <div className="flex justify-end mt-1.5">
              <span
                className={`text-xs tabular-nums ${
                  topic.length >= 80 ? 'text-amber-400' : 'text-[#4B4B4B]'
                }`}
              >
                {topic.length}/80
              </span>
            </div>
          </div>

          {/* ── 4. Voice toggle ── */}
          <div>
            <SectionLabel>Voice</SectionLabel>
            <div
              className="flex rounded-xl overflow-hidden border border-[#3B2F2F] bg-[#0D0D0D]"
              role="group"
              aria-label="Select voice tone"
            >
              {voices.map(({ id, label }, idx) => {
                const isActive = voice === id;
                const isFirst = idx === 0;
                const isLast = idx === voices.length - 1;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setVoice(id)}
                    aria-pressed={isActive}
                    className={[
                      'flex-1 py-3 text-sm font-semibold transition-all duration-150',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FFD700]',
                      'active:scale-y-95',
                      // Dividers between buttons
                      !isFirst && !isActive ? 'border-l border-[#3B2F2F]' : '',
                      !isLast && !isActive ? '' : '',
                      isActive
                        ? 'bg-[#FFD700] text-[#0D0D0D]'
                        : 'bg-transparent text-[#9CA3AF] hover:text-[#D1C4A8]',
                    ].join(' ')}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 5. Generate button ── */}
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={[
                'w-full flex items-center justify-center gap-2.5',
                'py-4 rounded-xl font-bold text-base tracking-wide',
                'transition-all duration-150 active:scale-[0.98]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A]',
                canGenerate
                  ? 'bg-[#FFD700] text-[#0D0D0D] shadow-lg shadow-[#FFD700]/20 hover:bg-[#F5CB00]'
                  : 'bg-[#3B2F2F] text-[#5A4A4A] cursor-not-allowed',
              ].join(' ')}
              aria-busy={isLoading}
              aria-label={isLoading ? 'Generating caption…' : 'Generate caption'}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Generating…</span>
                </>
              ) : (
                <span>Generate Caption</span>
              )}
            </button>

            {/* ── 6. Generation counter ── */}
            <div className="flex items-center justify-center gap-2" aria-live="polite">
              {/* Mini usage bar */}
              <div className="w-24 h-1.5 bg-[#3B2F2F] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (remaining / generationsLimit) * 100)}%`,
                    backgroundColor:
                      remaining > generationsLimit * 0.25
                        ? '#FFD700'
                        : remaining > 0
                        ? '#F59E0B'
                        : '#EF4444',
                  }}
                />
              </div>
              <p
                className={`text-xs font-medium ${
                  isExhausted
                    ? 'text-red-400'
                    : remaining <= 10
                    ? 'text-amber-400'
                    : 'text-[#6B7280]'
                }`}
              >
                {isExhausted
                  ? 'No generations remaining this month'
                  : `${remaining} of ${generationsLimit} remaining this month`}
              </p>
            </div>
          </div>

        </div>
        {/* End form body */}
      </div>
    </div>
  );
};

export default GeneratorScreen;
