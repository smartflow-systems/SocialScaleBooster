import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/ui/navigation";
import LiveCaptionDemo from "@/components/LiveCaptionDemo";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    { title: "AI captions that sound like you", desc: "Not a marketing agency. Punchy, real, written for your trade." },
    { title: "Smart hashtag sets", desc: "Niche-specific tags that get eyes on your posts, updated regularly." },
    { title: "Auto posting schedules", desc: "Know exactly when your audience is online and ready to book." },
    { title: "Built for barbers, salons & gyms", desc: "No bloated features you'll never use. Straight to the point." },
    { title: "Powered by GPT-4o-mini", desc: "Fast, sharp AI that generates quality content in under 10 seconds." },
    { title: "Works on your phone", desc: "Generate on the go, between clients — no laptop required." },
  ];

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
  ];

  return (
    <div className="min-h-screen bg-primary-black text-white">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-primary-black overflow-hidden pt-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-accent-gold rounded-full filter blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-brown rounded-full filter blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">Your Chair's Full.</span><br />
            <span className="text-accent-gold">Your Instagram's Dead.</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-gray mb-8 max-w-2xl mx-auto leading-relaxed">
            SocialScaleBooster writes your captions, picks your hashtags, and tells you exactly when to post — in seconds. Built for barbers, salons, and gyms. No faff.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => setLocation("/dashboard")}
              className="bg-accent-gold text-primary-black px-8 py-4 text-lg font-bold gold-glow gold-glow-hover hover:scale-105 transition-all"
              size="lg"
            >
              Start Generating Free
            </Button>
          </div>
          <p className="text-neutral-gray text-sm mt-4">No card required. Cancel any time.</p>
        </div>
      </section>

      {/* Live Demo */}
      <section className="py-20 bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-accent-gold">See it in action.</span> Pick your niche.
            </h2>
            <p className="text-neutral-gray text-lg">No signup. No card. Just see what it does.</p>
          </div>
          <LiveCaptionDemo />
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-primary-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              You're great with scissors.{" "}
              <span className="text-accent-gold">Not so great with Instagram.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "You don't have 45 minutes to write a caption.",
                body: "Back-to-back clients, a shop to run, a life outside these four walls. Sitting down to craft the perfect post? It's not happening. So nothing goes up. And nobody new finds you.",
              },
              {
                title: '"Just got a fresh cut" isn\'t a content strategy.',
                body: "Staring at a blank caption box after a long day is brutal. You post the same thing every week, engagement dies, and you wonder why you bother.",
              },
              {
                title: "The wrong hashtags are worse than no hashtags.",
                body: "Posting with #barber and #hair and hoping for the best? You're invisible. The people who'd book you tomorrow can't find you.",
              },
            ].map((item, i) => (
              <Card key={i} className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-colors">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                  <p className="text-neutral-gray leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-dark-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-accent-gold">Three steps.</span> Done before your next client.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Pick Your Niche", body: "Tell us you're a barber, salon, or gym. The AI knows what works for your world — not some generic playbook." },
              { step: "2", title: "Hit Generate", body: "One click. A sharp caption, the right hashtags, and the best time to post for maximum reach." },
              { step: "3", title: "Copy, Post, Get On With It", body: "Grab your content, drop it into Instagram, and get back to what pays — cutting hair, not writing copy." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-accent-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary-black">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-neutral-gray leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-primary-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-accent-gold">What you get</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="bg-card-bg border-secondary-brown hover:border-accent-gold transition-all">
                <CardContent className="p-6 flex gap-4">
                  <span className="w-2 h-2 bg-accent-gold rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white mb-1">{f.title}</h3>
                    <p className="text-neutral-gray text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-dark-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-accent-gold">Straight-up pricing.</span> No surprises.
            </h2>
            <p className="text-neutral-gray text-lg">No contracts. Cancel any time.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Starter",
                price: "£29",
                period: "/mo",
                sub: "100 generations/month",
                features: ["Captions, hashtags, posting schedule", "Perfect for getting started"],
                cta: "Get Started",
                highlight: false,
              },
              {
                name: "Pro",
                price: "£97",
                period: "/mo",
                sub: "1,000 generations/month",
                features: ["Everything in Starter", "Volume for busy shops posting daily"],
                cta: "Start Pro",
                highlight: true,
              },
              {
                name: "Agency",
                price: "£297",
                period: "/mo",
                sub: "Unlimited generations",
                features: ["Unlimited generations", "White label — sell as your own"],
                cta: "Go Agency",
                highlight: false,
              },
              {
                name: "Bundle",
                price: "£49",
                period: "/mo",
                sub: "SocialScaleBooster + Barber Booker",
                features: ["100 generations/month", "Full online booking system"],
                cta: "Get the Bundle",
                highlight: false,
              },
            ].map((tier) => (
              <Card
                key={tier.name}
                className={
                  tier.highlight
                    ? "border-2 border-accent-gold bg-card-bg transition-all"
                    : "bg-card-bg border-secondary-brown hover:border-accent-gold transition-all"
                }
              >
                <CardContent className="p-6 text-center flex flex-col h-full">
                  {tier.highlight && (
                    <span className="text-xs font-bold text-primary-black bg-accent-gold px-3 py-1 rounded-full mb-4 inline-block">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-accent-gold">{tier.price}</span>
                    <span className="text-neutral-gray">{tier.period}</span>
                  </div>
                  <p className="text-neutral-gray text-sm mb-4">{tier.sub}</p>
                  <ul className="text-left space-y-2 mb-6 flex-1">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-gray">
                        <span className="w-1.5 h-1.5 bg-accent-gold rounded-full mt-1.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => setLocation("/subscribe")}
                    className={
                      tier.highlight
                        ? "w-full bg-accent-gold text-primary-black font-bold hover:scale-105 transition-all"
                        : "w-full border border-accent-gold text-accent-gold bg-transparent hover:bg-accent-gold hover:text-primary-black transition-all"
                    }
                  >
                    {tier.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-primary-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-accent-gold">Don't take our word for it</h2>
          <Card className="bg-card-bg border-secondary-brown">
            <CardContent className="p-8 md:p-12">
              <p className="text-lg md:text-xl text-white leading-relaxed mb-6 italic">
                "I've been barbering for 11 years and never once bothered with Instagram properly. My mate kept telling me I was leaving money on the table. He was right. I started using SocialScaleBooster in January, spent about two minutes on it between clients, and had three new bookings that week from people who found me through my posts. Can't argue with that."
              </p>
              <p className="text-accent-gold font-bold">Danny R.</p>
              <p className="text-neutral-gray text-sm">Barber Shop Owner, Manchester</p>
              <p className="text-accent-gold mt-2">⭐⭐⭐⭐⭐</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-dark-bg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-accent-gold">Got questions?</span> Here's the short version.
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card key={i} className="bg-card-bg border-secondary-brown">
                <button
                  className="w-full text-left p-6 flex justify-between items-start gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-white">{faq.q}</span>
                  <span className="text-accent-gold text-xl flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-neutral-gray leading-relaxed">{faq.a}</div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-accent-gold">
            Stop leaving bookings on the table.
          </h2>
          <p className="text-xl text-neutral-gray mb-8 leading-relaxed">
            Every week you don't post, someone else in your area does. They get the follow. They get the booking. They get the client you should have had.
          </p>
          <Button
            onClick={() => setLocation("/dashboard")}
            className="bg-accent-gold text-primary-black px-10 py-5 text-xl font-bold gold-glow gold-glow-hover hover:scale-105 transition-all"
            size="lg"
          >
            Get Started Today — From £29/mo
          </Button>
          <p className="text-neutral-gray text-sm mt-4">
            Got questions?{" "}
            <a href="mailto:gareth@smartflowsystems.co.uk" className="text-accent-gold underline">
              Gareth answers everything
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
