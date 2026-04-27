import cron from "node-cron";
import { storage } from "../storage";
import { log } from "../vite";
import { getAnalyticsWS } from "../websocket";

async function publishDuePosts(): Promise<void> {
  try {
    const duePosts = await storage.getDueScheduledPosts();
    if (duePosts.length === 0) return;

    log(`[scheduler] Found ${duePosts.length} post(s) due for publishing`);

    for (const post of duePosts) {
      let published = false;
      try {
        await storage.markScheduledPostPublished(post.id);
        published = true;
        log(`[scheduler] Published post ${post.id} (platform: ${post.platform}, user: ${post.userId})`);
      } catch (err) {
        log(`[scheduler] Failed to publish post ${post.id}: ${err}`);
        try {
          await storage.markScheduledPostFailed(post.id);
          log(`[scheduler] Marked post ${post.id} as failed`);
          try {
            const ws = getAnalyticsWS();
            if (ws) {
              ws.broadcastPostFailed({
                id: post.id,
                platform: post.platform,
                content: post.content,
                userId: post.userId,
              });
            }
          } catch (wsErr) {
            log(`[scheduler] WebSocket broadcast failed for post ${post.id}: ${wsErr}`);
          }
        } catch (failErr) {
          log(`[scheduler] Could not mark post ${post.id} as failed: ${failErr}`);
        }
      }

      if (published) {
        try {
          const ws = getAnalyticsWS();
          if (ws) {
            ws.broadcastPostPublished({
              id: post.id,
              platform: post.platform,
              content: post.content,
              userId: post.userId,
            });
          }
        } catch (wsErr) {
          log(`[scheduler] WebSocket broadcast failed for post ${post.id}: ${wsErr}`);
        }
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
