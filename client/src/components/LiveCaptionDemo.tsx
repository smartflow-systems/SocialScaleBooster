import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Niche = "barber" | "salon" | "gym";
type Voice = "professional" | "casual" | "hype";

interface CaptionData {
  caption: string;
  hashtags: string[];
  platform: string;
}

// ─── Sample Caption Bank (3 niches × 3 voices = 9 captions) ──────────────────

const CAPTIONS: Record<Niche, Record<Voice, CaptionData>> = {
  barber: {
    professional: {
      caption:
        "Precision is our craft. Every fade, every line-up, every detail — executed with care and expertise. Our clients don't just leave looking sharp; they leave feeling confident. Book your appointment today and experience the difference a dedicated barber makes.",
      hashtags: [
        "#BarberUK",
        "#FreshCut",
        "#PrecisionFade",
        "#BarbershopLife",
        "#UKBarber",
      ],
      platform: "Instagram",
    },
    casual: {
      caption:
        "Nothing beats that fresh-cut feeling on a Monday morning 💈 Popped in for a quick tidy-up and left looking proper sharp. The lads at the shop never disappoint — cheers as always. Drop a comment if you know the vibe!",
      hashtags: [
        "#FreshCut",
        "#BarberVibes",
        "#SharpLook",
        "#BarbershopUK",
        "#MondayMotivation",
      ],
      platform: "Instagram",
    },
    hype: {
      caption:
        "LEVELS 🔥 This fade is SPEAKING. No cap, walked in looking basic, walked out looking ELITE. The barber is a proper wizard with them clippers — book NOW before the waiting list fills up again. Don't sleep on this one 💈⚡",
      hashtags: [
        "#FadeGod",
        "#CleanCut",
        "#BarberElite",
        "#FreshToDeath",
        "#UKBarbers",
      ],
      platform: "Instagram",
    },
  },
  salon: {
    professional: {
      caption:
        "Beautiful hair begins with expert care. Our skilled stylists use only the finest products to ensure your colour, cut, and condition exceed expectations every single visit. Whether you're after a subtle refresh or a bold transformation, we're here to make it happen. Consultations available — enquire via the link in bio.",
      hashtags: [
        "#HairSalonUK",
        "#HairGoals",
        "#SalonLife",
        "#ExpertStylist",
        "#HairColour",
      ],
      platform: "Instagram",
    },
    casual: {
      caption:
        "Right, we are absolutely obsessed with how this colour turned out ✨ Our client came in asking for something a bit different and honestly, she smashed it. Love it when the vision comes together perfectly. Swipe to see the before and after — you won't believe it!",
      hashtags: [
        "#HairTransformation",
        "#ColourCorrection",
        "#SalonGoals",
        "#UKSalon",
        "#NewHairWhoThis",
      ],
      platform: "Instagram",
    },
    hype: {
      caption:
        "SHE ATE AND LEFT NO CRUMBS 😭🔥 This transformation has us absolutely SHOOK. Came in for a change and walked out a whole new woman — this is why we do what we do! Slots are filling fast so get in our DMs NOW if you want your glow-up era to start this week 💇‍♀️✨",
      hashtags: [
        "#GlowUp",
        "#HairVibes",
        "#SalonElite",
        "#TransformationTuesday",
        "#HairGodsUK",
      ],
      platform: "Instagram",
    },
  },
  gym: {
    professional: {
      caption:
        "Consistent effort, structured training, and the right environment — that's the formula for lasting results. At our facility, we provide everything you need to reach your fitness goals, from certified personal trainers to state-of-the-art equipment. Your progress starts with a single decision. Join us today.",
      hashtags: [
        "#GymUK",
        "#FitnessGoals",
        "#PersonalTraining",
        "#StrengthTraining",
        "#HealthyLifestyle",
      ],
      platform: "Instagram",
    },
    casual: {
      caption:
        "Didn't feel like training today — showed up anyway. That's honestly the secret nobody tells you about 😅 Sometimes the best session is the one you nearly skipped. Finished feeling brilliant, as always. What's your go-to trick for getting yourself through the gym door on a tough day?",
      hashtags: [
        "#GymLife",
        "#FitnessMindset",
        "#ShowUp",
        "#TrainingDay",
        "#UKFitness",
      ],
      platform: "Instagram",
    },
    hype: {
      caption:
        "WE ARE NOT DONE 🔥💪 Another PB in the books — the gym has been absolutely HUMMING this week and the energy is unmatched. If you're not training here yet, what are you actually doing?! Come get this work, the gains are REAL and the vibes are even better. LET'S GOOO 🏋️‍♂️⚡",
      hashtags: [
        "#GymGoals",
        "#BeastMode",
        "#LiftHeavy",
        "#GymVibesUK",
        "#PersonalBest",
      ],
      platform: "Instagram",
    },
  },
};

// ─── Typing animation hook ────────────────────────────────────────────────────

function useTypingEffect(text: string, active: boolean, speed = 22) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      setDone(false);
      return;
    }

    setDisplayed("");
    setDone(false);
    let i = 0;

    const tick = () => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i < text.length) {
        frameRef.current = setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    };

    frameRef.current = setTimeout(tick, speed);

    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [text, active, speed]);

  return { displayed, done };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SelectorProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

function Selector<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectorProps<T>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        style={{ color: "#FFD700" }}
        className="text-xs font-semibold uppercase tracking-widest"
      >
        {label}
      </label>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              style={
                selected
                  ? {
                      backgroundColor: "#FFD700",
                      color: "#0D0D0D",
                      borderColor: "#FFD700",
                    }
                  : {
                      backgroundColor: "transparent",
                      color: "#d1d5db",
                      borderColor: "#3B2F2F",
                    }
              }
              className="px-4 py-2 rounded-md border text-sm font-medium transition-all duration-200 hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 focus:ring-offset-transparent"
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface CursorProps {
  visible: boolean;
}

function Cursor({ visible }: CursorProps) {
  const [on, setOn] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setOn((v) => !v), 530);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;
  return (
    <span
      style={{ backgroundColor: "#FFD700" }}
      className={`inline-block w-0.5 h-4 ml-0.5 align-middle transition-opacity duration-100 ${on ? "opacity-100" : "opacity-0"}`}
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const LiveCaptionDemo: React.FC = () => {
  const [niche, setNiche] = useState<Niche>("barber");
  const [voice, setVoice] = useState<Voice>("professional");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [captionData, setCaptionData] = useState<CaptionData | null>(null);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { displayed, done } = useTypingEffect(
    captionData?.caption ?? "",
    generating || generated,
    18
  );

  // Reset output when selectors change
  useEffect(() => {
    setGenerated(false);
    setGenerating(false);
    setCaptionData(null);
    setCopied(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [niche, voice]);

  const handleGenerate = useCallback(() => {
    if (generating) return;
    setCopied(false);
    setGenerated(false);
    setGenerating(true);
    setCaptionData(CAPTIONS[niche][voice]);

    // Brief artificial "thinking" pause before typing starts — purely UX flavour
    timerRef.current = setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 400);
  }, [niche, voice, generating]);

  const handleCopy = useCallback(() => {
    if (!captionData) return;
    const full = `${captionData.caption}\n\n${captionData.hashtags.join(" ")}`;
    navigator.clipboard
      .writeText(full)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      })
      .catch(() => {
        // Fallback for environments without clipboard API
        const ta = document.createElement("textarea");
        ta.value = full;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
  }, [captionData]);

  const showOutput = generating || generated;
  const typingActive = showOutput && !!captionData;
  const cursorVisible = typingActive && !done;

  return (
    <section
      style={{ backgroundColor: "#0D0D0D", borderColor: "#3B2F2F" }}
      className="rounded-2xl border p-6 sm:p-8 max-w-2xl mx-auto font-sans shadow-2xl"
      aria-label="Live Caption Preview Demo"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span
            style={{ backgroundColor: "#FFD700" }}
            className="inline-block w-2 h-2 rounded-full"
            aria-hidden="true"
          />
          <span
            style={{ color: "#FFD700" }}
            className="text-xs font-bold uppercase tracking-widest"
          >
            Live Preview
          </span>
        </div>
        <h2 className="text-white text-xl sm:text-2xl font-bold leading-tight">
          See Your Caption — Instantly
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Pick your niche and brand voice, then hit generate. No signup needed.
        </p>
      </div>

      {/* Selectors */}
      <div className="flex flex-col gap-5 mb-6">
        <Selector
          label="Your Niche"
          value={niche}
          onChange={setNiche as (v: string) => void}
          options={[
            { value: "barber", label: "💈 Barber" },
            { value: "salon", label: "✂️ Salon" },
            { value: "gym", label: "🏋️ Gym" },
          ]}
        />
        <Selector
          label="Brand Voice"
          value={voice}
          onChange={setVoice as (v: string) => void}
          options={[
            { value: "professional", label: "Professional" },
            { value: "casual", label: "Casual" },
            { value: "hype", label: "Hype" },
          ]}
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={generating}
        style={{
          backgroundColor: generating ? "#b89a00" : "#FFD700",
          color: "#0D0D0D",
        }}
        className="w-full py-3 rounded-lg font-bold text-base tracking-wide transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
        aria-live="polite"
        aria-busy={generating}
      >
        {generating ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
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
            Generating…
          </span>
        ) : (
          "Generate Caption"
        )}
      </button>

      {/* Output Area */}
      {showOutput && captionData && (
        <div
          style={{ borderColor: "#3B2F2F", backgroundColor: "#111111" }}
          className="mt-6 rounded-xl border overflow-hidden"
          role="region"
          aria-label="Generated caption output"
          aria-live="polite"
        >
          {/* Platform Tag */}
          <div
            style={{ backgroundColor: "#1a1a1a", borderColor: "#3B2F2F" }}
            className="flex items-center justify-between px-4 py-2.5 border-b"
          >
            <div className="flex items-center gap-2">
              {/* Instagram icon (inline SVG — no external dependency) */}
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="#E1306C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="#E1306C" stroke="none" />
              </svg>
              <span className="text-gray-400 text-xs font-medium">
                {captionData.platform}
              </span>
            </div>
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              disabled={!done}
              style={
                copied
                  ? { color: "#FFD700" }
                  : { color: done ? "#9ca3af" : "#4b5563" }
              }
              className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-200 hover:text-yellow-400 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-yellow-500 rounded px-1"
              aria-label={copied ? "Copied to clipboard" : "Copy caption to clipboard"}
            >
              {copied ? (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Caption Text */}
          <div className="px-4 py-4">
            <p className="text-gray-100 text-sm leading-relaxed min-h-[3rem]">
              {displayed}
              <Cursor visible={cursorVisible} />
            </p>
          </div>

          {/* Hashtags — only show once typing is done */}
          {done && (
            <div
              style={{ borderColor: "#3B2F2F", backgroundColor: "#0f0f0f" }}
              className="px-4 py-3 border-t flex flex-wrap gap-2"
            >
              {captionData.hashtags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: "#1e1a10",
                    color: "#FFD700",
                    borderColor: "#3B2F2F",
                  }}
                  className="text-xs font-medium px-2.5 py-1 rounded-full border"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      {done && (
        <div
          style={{ backgroundColor: "#111111", borderColor: "#3B2F2F" }}
          className="mt-4 rounded-xl border px-4 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          role="complementary"
          aria-label="Call to action"
        >
          <p className="text-gray-400 text-sm leading-snug">
            Want captions like this for{" "}
            <span className="text-white font-medium">your business</span>,
            every single day?
          </p>
          <a
            href="#pricing"
            style={{
              backgroundColor: "#FFD700",
              color: "#0D0D0D",
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap hover:brightness-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black"
          >
            Start free — £29/mo
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      )}
    </section>
  );
};

export default LiveCaptionDemo;
