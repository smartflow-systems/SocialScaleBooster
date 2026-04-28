import { useState } from "react";
import { Link } from "wouter";
import { HelpCircle, ArrowLeft, Mail } from "lucide-react";

const faqs = [
  {
    q: "Do I need to know anything about social media to use this?",
    a: "No. If you can copy and paste text into Instagram, you're qualified. The AI does the thinking. You just post.",
  },
  {
    q: "Is the content actually written for barbers, or is it generic AI?",
    a: "It's niche-specific. Barber content sounds like barber content. Salon content sounds like salon content. Trained on what works in your industry — not a tech startup.",
  },
  {
    q: "Can I cancel any time?",
    a: "Yes. No contracts, no minimum term. Cancel from your dashboard whenever you like.",
  },
  {
    q: "What's the difference between this and just using ChatGPT?",
    a: "ChatGPT doesn't know your industry posting times, doesn't generate matched hashtag sets, and doesn't have a schedule built in. It's the difference between a Swiss Army knife and a proper barber's razor.",
  },
  {
    q: "What's the Bundle deal?",
    a: "The bundle gets you SocialScaleBooster and Barber Booker (our online booking system) for £49/mo instead of £58. Social content and bookings, sorted.",
  },
  {
    q: "How do I generate a caption?",
    a: "Go to Caption Generator in the menu. Describe your photo or post, pick your platform and tone, hit Generate. It takes under 10 seconds.",
  },
  {
    q: "How many captions can I generate per month?",
    a: "Starter plan: 100 per month. Pro plan: 1,000 per month. Agency: unlimited. You'll see your usage in the dashboard.",
  },
  {
    q: "Something isn't working — what do I do?",
    a: "Email gareth@smartflowsystems.co.uk with your account email and a description of what happened. Gareth answers personally, usually within a few hours.",
  },
];

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            <HelpCircle className="w-6 h-6 text-primary-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Help Center</h1>
            <p className="text-neutral-gray text-sm">Common questions, answered straight</p>
          </div>
        </div>

        <div className="space-y-3 mb-10">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-accent-gold/20 rounded-xl bg-rich-brown/10 overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-4 flex justify-between items-start gap-4"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-white text-sm">{faq.q}</span>
                <span className="text-accent-gold text-xl flex-shrink-0 leading-none">
                  {openFaq === i ? "−" : "+"}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-neutral-gray text-sm leading-relaxed border-t border-accent-gold/10 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border border-accent-gold/20 rounded-xl p-6 bg-rich-brown/10 text-center">
          <p className="text-white font-semibold mb-1">Still stuck?</p>
          <p className="text-neutral-gray text-sm mb-4">
            Email Gareth directly — he handles all support personally.
          </p>
          <a
            href="mailto:gareth@smartflowsystems.co.uk?subject=Help%20Request%20-%20SocialScaleBooster"
            className="inline-flex items-center gap-2 text-accent-gold hover:text-gold-trim transition-colors font-semibold text-sm"
          >
            <Mail className="w-4 h-4" />
            gareth@smartflowsystems.co.uk
          </a>
        </div>
      </div>
    </div>
  );
}
