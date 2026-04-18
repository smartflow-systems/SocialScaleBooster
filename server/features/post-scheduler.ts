import cron from "node-cron";
import { storage } from "../storage";
import { log } from "../vite";

async function publishDuePosts(): Promise<void> {
  try {
    const duePosts = await storage.getDueScheduledPosts();
    if (duePosts.length === 0) return;

    log(`[scheduler] Found ${duePosts.length} post(s) due for publishing`);

    for (const post of duePosts) {
      try {
        await storage.markScheduledPostPublished(post.id);
        log(`[scheduler] Published post ${post.id} (platform: ${post.platform}, user: ${post.userId})`);
      } catch (err) {
        log(`[scheduler] Failed to publish post ${post.id}: ${err}`);
      }
    }
  } catch (err) {
    log(`[scheduler] Error checking due posts: ${err}`);
  }
}

export async function startPostScheduler(): Promise<void> {
  await publishDuePosts();

  cron.schedule("* * * * *", publishDuePosts);

  log("[scheduler] Post scheduler started — checking every minute");
}
