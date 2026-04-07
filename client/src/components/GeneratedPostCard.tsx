/**
 * GeneratedPostCard.tsx — SocialScaleBooster
 * Post-generation UX: copy caption, copy hashtags, open platform app.
 * Stack: React 18 + TypeScript + Tailwind CSS
 * Brand: Black #0D0D0D / Brown #3B2F2F / Gold #FFD700
 */

import React, { useCallback, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = 'Instagram' | 'TikTok' | 'Facebook';

export interface GeneratedPostCardProps {
  caption: string;
  hashtags: string[];          // 5 items
  firstComment?: string;       // optional extra hashtags block
  platform: Platform;
  onRegenerate: () => void;
  isLoading: boolean;
}

// ─── Platform config ──────────────────────────────────────────────────────────

interface PlatformConfig {
  label: string;
  colour: string;               // Tailwind bg class (inline style fallback below)
  hex: string;
  mobileScheme: string;         // deep-link URI
  webUrl: string;
  icon: React.ReactNode;
}

const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  Instagram: {
    label: 'Instagram',
    colour: 'bg-[#E1306C]',
    hex: '#E1306C',
    mobileScheme: 'instagram://camera',
    webUrl: 'https://www.instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.516 2.497 5.783 2.225 7.15 2.163 8.416 2.105 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 1.978 2.05.6 3.427.084 5.269 0 7.124-.014 8.404 0 8.813 0 12c0 3.187.014 3.596.072 4.876.085 1.855.601 3.697 1.978 5.074C3.427 23.327 5.269 23.843 7.124 23.928 8.404 23.986 8.813 24 12 24c3.187 0 3.596-.014 4.876-.072 1.855-.085 3.697-.601 5.074-1.978C23.327 20.573 23.843 18.731 23.928 16.876 23.986 15.596 24 15.187 24 12c0-3.187-.014-3.596-.072-4.876-.085-1.855-.601-3.697-1.978-5.074C20.573.673 18.731.157 16.876.072 15.596.014 15.187 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  TikTok: {
    label: 'TikTok',
    colour: 'bg-[#010101]',
    hex: '#010101',
    mobileScheme: 'tiktok://',
    webUrl: 'https://www.tiktok.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
      </svg>
    ),
  },
  Facebook: {
    label: 'Facebook',
    colour: 'bg-[#1877F2]',
    hex: '#1877F2',
    mobileScheme: 'fb://composer/',
    webUrl: 'https://www.facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function openPlatform(platform: Platform): void {
  const cfg = PLATFORM_CONFIG[platform];
  if (isMobile()) {
    // Attempt deep link; fall back to web after 1.5 s if app isn't installed
    const fallbackTimer = window.setTimeout(() => {
      window.open(cfg.webUrl, '_blank', 'noopener,noreferrer');
    }, 1500);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.src = cfg.mobileScheme;
    // Clear fallback if the user left the page (app opened)
    window.addEventListener(
      'blur',
      () => {
        window.clearTimeout(fallbackTimer);
        document.body.removeChild(iframe);
      },
      { once: true },
    );
  } else {
    window.open(cfg.webUrl, '_blank', 'noopener,noreferrer');
  }
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="w-5 h-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
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
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

interface CopyButtonProps {
  label: string;
  getText: () => string;
  className?: string;
}

function CopyButton({ label, getText, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older/restricted browsers
      const el = document.createElement('textarea');
      el.value = getText();
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [getText]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : label}
      className={[
        'flex items-center justify-center gap-2',
        'min-h-[52px] px-5 rounded-xl',
        'text-base font-semibold transition-all duration-200 select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]',
        'active:scale-95',
        copied
          ? 'bg-emerald-500 text-white border border-emerald-400'
          : 'bg-[rgba(255,215,0,0.10)] text-[#FFD700] border border-[rgba(255,215,0,0.30)] hover:bg-[rgba(255,215,0,0.18)] hover:border-[rgba(255,215,0,0.60)]',
        className,
      ].join(' ')}
    >
      {copied ? (
        <>
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"/>
            <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"/>
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

// ─── PlatformBadge ────────────────────────────────────────────────────────────

function PlatformBadge({ platform }: { platform: Platform }) {
  const cfg = PLATFORM_CONFIG[platform];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white"
      style={{ backgroundColor: cfg.hex }}
      aria-label={`Platform: ${cfg.label}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

// ─── FirstCommentAccordion ────────────────────────────────────────────────────

function FirstCommentAccordion({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[rgba(255,215,0,0.18)] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={[
          'w-full flex items-center justify-between gap-3',
          'min-h-[52px] px-4 py-3',
          'text-sm font-semibold text-[#F5F5DC] text-left',
          'bg-[rgba(59,47,47,0.50)] hover:bg-[rgba(59,47,47,0.70)]',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-inset',
        ].join(' ')}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#FFD700] shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
          </svg>
          First Comment Hashtags
        </span>
        <svg
          className={`w-4 h-4 text-[#FFD700] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!open}
      >
        <div className="px-4 py-3 bg-[rgba(13,13,13,0.40)] border-t border-[rgba(255,215,0,0.12)]">
          <p className="text-sm text-[rgba(245,245,220,0.70)] leading-relaxed whitespace-pre-wrap break-words font-mono">
            {content}
          </p>
          <div className="mt-3">
            <CopyButton label="Copy First Comment" getText={() => content} className="w-full text-sm min-h-[44px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── GeneratedPostCard ────────────────────────────────────────────────────────

export default function GeneratedPostCard({
  caption,
  hashtags,
  firstComment,
  platform,
  onRegenerate,
  isLoading,
}: GeneratedPostCardProps) {
  const cfg = PLATFORM_CONFIG[platform];
  const captionRef = useRef<HTMLTextAreaElement>(null);

  // Auto-select caption text on click/tap
  const handleCaptionFocus = useCallback(() => {
    captionRef.current?.select();
  }, []);

  const hashtagsText = hashtags.join(' ');
  const getCaptionText = useCallback(() => caption, [caption]);
  const getHashtagsText = useCallback(() => hashtagsText, [hashtagsText]);

  return (
    <article
      className={[
        'relative w-full max-w-lg mx-auto',
        'rounded-2xl overflow-hidden',
        'border border-[rgba(255,215,0,0.20)]',
        'bg-[rgba(59,47,47,0.65)]',
        'shadow-[0_8px_32px_rgba(0,0,0,0.40),inset_0_1px_0_rgba(255,255,255,0.08)]',
        'animate-[slideUp_0.45s_cubic-bezier(0.4,0,0.2,1)_both]',
      ].join(' ')}
      aria-label="Generated post"
      style={
        {
          '--tw-animate-duration': '0.45s',
        } as React.CSSProperties
      }
    >
      {/* Shimmer accent line */}
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${cfg.hex}99, #FFD700, ${cfg.hex}99, transparent)`,
        }}
        aria-hidden="true"
      />

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <PlatformBadge platform={platform} />
        <span className="text-xs text-[rgba(245,245,220,0.45)] font-medium tracking-wide">
          AI-Generated Caption
        </span>
      </header>

      <div className="px-5 pb-6 flex flex-col gap-4">

        {/* ── Caption textarea (auto-selects on tap) ── */}
        <div>
          <label
            htmlFor="ssb-caption"
            className="block text-xs font-semibold text-[#FFD700] uppercase tracking-widest mb-2"
          >
            Caption
          </label>
          <textarea
            id="ssb-caption"
            ref={captionRef}
            readOnly
            value={caption}
            onFocus={handleCaptionFocus}
            onClick={handleCaptionFocus}
            rows={5}
            className={[
              'w-full resize-none rounded-xl px-4 py-3',
              'bg-[rgba(13,13,13,0.50)] border border-[rgba(255,215,0,0.18)]',
              'text-[#F5F5DC] text-base leading-relaxed',
              'selection:bg-[rgba(255,215,0,0.35)] selection:text-[#0D0D0D]',
              'focus:outline-none focus:border-[rgba(255,215,0,0.55)] focus:ring-1 focus:ring-[rgba(255,215,0,0.30)]',
              'transition-colors duration-200 cursor-text',
              'scrollbar-thin scrollbar-thumb-[rgba(255,215,0,0.25)] scrollbar-track-transparent',
            ].join(' ')}
            aria-label="Generated caption — click to select all"
          />
        </div>

        {/* ── Hashtags ── */}
        <div>
          <label
            htmlFor="ssb-hashtags"
            className="block text-xs font-semibold text-[#FFD700] uppercase tracking-widest mb-2"
          >
            Hashtags
          </label>
          <div
            id="ssb-hashtags"
            className="flex flex-wrap gap-2 p-3 rounded-xl bg-[rgba(13,13,13,0.40)] border border-[rgba(255,215,0,0.12)]"
          >
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm font-medium bg-[rgba(255,215,0,0.10)] border border-[rgba(255,215,0,0.25)] text-[#FFD700]"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>

        {/* ── Primary action buttons ── */}
        <div className="grid grid-cols-2 gap-3">
          <CopyButton label="Copy Caption" getText={getCaptionText} />
          <CopyButton label="Copy Hashtags" getText={getHashtagsText} />
        </div>

        {/* ── Open Platform button ── */}
        <button
          type="button"
          onClick={() => openPlatform(platform)}
          className={[
            'w-full flex items-center justify-center gap-3',
            'min-h-[56px] px-5 rounded-xl',
            'text-base font-bold text-white',
            'transition-all duration-200 active:scale-95',
            'shadow-lg hover:shadow-xl hover:-translate-y-0.5',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]',
          ].join(' ')}
          style={{
            background: `linear-gradient(135deg, ${cfg.hex}, ${cfg.hex}cc)`,
            boxShadow: `0 4px 20px ${cfg.hex}55`,
          }}
          aria-label={`Open ${cfg.label}`}
        >
          {cfg.icon}
          Open {cfg.label}
          <svg className="w-4 h-4 opacity-70 ml-auto shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
          </svg>
        </button>

        {/* ── First Comment accordion ── */}
        {firstComment && (
          <FirstCommentAccordion content={firstComment} />
        )}

        {/* ── Divider ── */}
        <div
          className="h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.20), transparent)' }}
          aria-hidden="true"
        />

        {/* ── Regenerate button ── */}
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isLoading}
          className={[
            'w-full flex items-center justify-center gap-2',
            'min-h-[52px] px-5 rounded-xl',
            'text-base font-semibold',
            'border border-[rgba(255,215,0,0.30)]',
            'bg-[rgba(255,215,0,0.08)] text-[#FFD700]',
            'hover:bg-[rgba(255,215,0,0.15)] hover:border-[rgba(255,215,0,0.55)]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
            'active:scale-95 transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D0D]',
          ].join(' ')}
          aria-label={isLoading ? 'Generating new caption…' : 'Regenerate caption'}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner />
              Generating…
            </>
          ) : (
            <>
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
              Regenerate
            </>
          )}
        </button>

      </div>
    </article>
  );
}

// ─── Tailwind keyframe (add to tailwind.config if not present) ────────────────
//
// theme: {
//   extend: {
//     keyframes: {
//       slideUp: {
//         '0%':   { opacity: '0', transform: 'translateY(20px)' },
//         '100%': { opacity: '1', transform: 'translateY(0)' },
//       },
//     },
//     animation: {
//       slideUp: 'slideUp 0.45s cubic-bezier(0.4, 0, 0.2, 1) both',
//     },
//   },
// },
