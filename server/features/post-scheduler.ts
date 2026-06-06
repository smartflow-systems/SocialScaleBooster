import cron from "node-cron";
import { storage } from "../storage";
import { log } from "../vite";
import { getAnalyticsWS } from "../websocket";

async function processDuePostsForDemo(): Promise<void> {
  try {
    const duePosts = await storage.getDueScheduledPosts();
    if (duePosts.length === 0) return;

    log(`[scheduler] Found ${duePosts.length} queued post(s) due for demo processing`);

    for (const post of duePosts) {
      let published = false;
      try {
        // Retain the existing storage status for schema compatibility only.
        // This demo processor does not call any social-platform publishing API.
        await storage.markScheduledPostPublished(post.id);
        published = true;
        log(`[scheduler] Demo-processed queued post ${post.id}; no platform publishing performed`);
      } catch (err) {
        log(`[scheduler] Failed to demo-process queued post ${post.id}: ${err}`);
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
  await processDuePostsForDemo();

  cron.schedule("* * * * *", processDuePostsForDemo);

  log("[scheduler] Demo queue processor started — no platform publishing enabled");
}
