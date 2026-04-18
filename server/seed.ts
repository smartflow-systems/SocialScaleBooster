import { storage } from "./storage";

const DEFAULT_TEMPLATES = [
  {
    name: "Instagram Growth Bot",
    category: "growth",
    platform: "instagram",
    description: "Automatically engage with your niche audience to grow your following organically.",
    isPremium: false,
    price: null,
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=200&fit=crop",
    config: JSON.stringify({ engageFrequency: "high", targetHashtags: ["growth", "smallbusiness"] }),
    rating: "4.8",
    reviewCount: 312,
  },
  {
    name: "Twitter Engagement Assistant",
    category: "engagement",
    platform: "twitter",
    description: "Boost your tweet reach with smart retweets, likes, and keyword replies.",
    isPremium: false,
    price: null,
    imageUrl: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=200&fit=crop",
    config: JSON.stringify({ replyEnabled: true, retweetEnabled: true }),
    rating: "4.6",
    reviewCount: 189,
  },
  {
    name: "LinkedIn Lead Generator",
    category: "leads",
    platform: "linkedin",
    description: "Connect with decision-makers and nurture warm B2B leads on autopilot.",
    isPremium: true,
    price: "29.00",
    imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
    config: JSON.stringify({ targetTitle: "CEO, Founder, CMO", sendConnectionNote: true }),
    rating: "4.9",
    reviewCount: 97,
  },
  {
    name: "TikTok Trend Rider",
    category: "content",
    platform: "tiktok",
    description: "Automatically surfaces trending sounds and hashtags to maximise your TikTok reach.",
    isPremium: false,
    price: null,
    imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=200&fit=crop",
    config: JSON.stringify({ trendCheckInterval: "6h" }),
    rating: "4.7",
    reviewCount: 254,
  },
  {
    name: "Facebook Community Manager",
    category: "community",
    platform: "facebook",
    description: "Moderate, welcome new members, and schedule posts in your Facebook Groups.",
    isPremium: false,
    price: null,
    imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=200&fit=crop",
    config: JSON.stringify({ autoWelcome: true, postSchedule: "daily" }),
    rating: "4.5",
    reviewCount: 143,
  },
  {
    name: "Agency White-Label Suite",
    category: "agency",
    platform: "all",
    description: "Full white-label toolkit — manage unlimited client workspaces with one login.",
    isPremium: true,
    price: "99.00",
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop",
    config: JSON.stringify({ clientLimit: 999, whiteLabel: true }),
    rating: "5.0",
    reviewCount: 41,
  },
];

export async function seedBotTemplates() {
  try {
    const existing = await storage.getAllBotTemplates();
    if (existing.length > 0) return;
    for (const tpl of DEFAULT_TEMPLATES) {
      await storage.createBotTemplate(tpl as any);
    }
    console.log(`[seed] inserted ${DEFAULT_TEMPLATES.length} default bot templates`);
  } catch (err: any) {
    console.error("[seed] failed to seed bot templates:", err.message);
  }
}
