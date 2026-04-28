import { Link, useLocation } from "wouter";
import { BookOpen, ArrowLeft, CheckCircle, ChevronRight } from "lucide-react";

const tutorials = [
  {
    number: "01",
    title: "Generate your first caption",
    time: "1 min",
    steps: [
      'Open the menu and click "Caption Generator"',
      "Describe your photo or post in the text box",
      "Choose your platform (Instagram, TikTok, etc.) and tone",
      'Hit "Generate Caption" — takes under 10 seconds',
      "Copy it, paste into Instagram, done",
    ],
  },
  {
    number: "02",
    title: "Use AI Studio for full posts",
    time: "2 min",
    steps: [
      'Go to "AI Studio" in the menu',
      "Enter your topic and pick your industry (e.g. Beauty & Skincare)",
      "Add your target audience if you want more specific content",
      "Generate and copy — includes caption, hashtags, and posting tips",
    ],
  },
  {
    number: "03",
    title: "Create a bot for your niche",
    time: "3 min",
    steps: [
      "Open your Dashboard and go to the Bots tab",
      'Click "Create Bot" in the top right',
      "Name your bot and pick the content type",
      "Save — your bot is now ready to generate content for you",
      "Free plan supports up to 3 bots",
    ],
  },
  {
    number: "04",
    title: "Schedule your posts",
    time: "2 min",
    steps: [
      'Click "Scheduling" tab in the Dashboard',
      "Pick the days and times you want content to go out",
      "The AI picks the best slots based on your niche audience",
      "Your content queue builds automatically",
    ],
  },
  {
    number: "05",
    title: "Upgrade to Pro",
    time: "1 min",
    steps: [
      'Click "Upgrade Pro" in the dashboard header',
      "Choose your plan — Starter, Pro, or Bundle",
      "Enter payment via Stripe — secure, takes 30 seconds",
      "Instantly unlocked: more bots, more generations, more features",
    ],
  },
];

export default function Tutorials() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-primary-black">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/dashboard">
          <a className="inline-flex items-center gap-2 text-accent-gold hover:text-gold-trim transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </a>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-gold-trim rounded-xl flex items-center justify-center shadow-lg shadow-accent-gold/20">
            <BookOpen className="w-6 h-6 text-primary-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Tutorials</h1>
            <p className="text-neutral-gray text-sm">Quick guides — each one under 3 minutes</p>
          </div>
        </div>

        <div className="space-y-4">
          {tutorials.map((tut) => (
            <div
              key={tut.number}
              className="border border-accent-gold/20 rounded-xl bg-rich-brown/10 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-accent-gold/40 text-sm font-mono font-bold">{tut.number}</span>
                  <h2 className="text-white font-bold">{tut.title}</h2>
                </div>
                <span className="text-xs text-neutral-gray bg-primary-black border border-accent-gold/20 rounded-full px-3 py-1 flex-shrink-0">
                  {tut.time}
                </span>
              </div>
              <ol className="space-y-2">
                {tut.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-neutral-gray">
                    <CheckCircle className="w-4 h-4 text-accent-gold/50 flex-shrink-0 mt-0.5" />
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="mt-8 border border-accent-gold/20 rounded-xl p-5 bg-rich-brown/10 flex items-center justify-between">
          <p className="text-neutral-gray text-sm">
            Ready to generate your first post?
          </p>
          <button
            onClick={() => setLocation("/captions")}
            className="inline-flex items-center gap-1 text-accent-gold font-semibold text-sm hover:text-gold-trim transition-colors"
          >
            Caption Generator <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
