import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { pool } from './db';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Run database migrations on startup using Drizzle's migration runner.
 *
 * Strategy:
 * 1. Before running Drizzle's migrate, verify that every migration recorded
 *    in the tracking table has its tables actually present in the DB.
 *    If a record exists for a migration whose tables are missing (e.g. it was
 *    incorrectly pre-seeded), remove that record so Drizzle will apply it.
 * 2. If the tracking table is completely empty but the core schema is already
 *    in place (applied via drizzle-kit push), pre-seed only migrations whose
 *    tables are confirmed to exist — so Drizzle won't try to re-run them.
 * 3. Let Drizzle apply any remaining migrations normally.
 */
export async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.log('[db] DATABASE_URL not set — using in-memory storage');
    return;
  }

  try {
    // Ensure the Drizzle migrations schema and table exist
    await pool.query(`CREATE SCHEMA IF NOT EXISTS "drizzle"`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
        id serial PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `);

    // Helper: check if a table exists in the public schema
    const tableExists = async (tableName: string): Promise<boolean> => {
      const { rows } = await pool.query(
        `SELECT 1 FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = $1`,
        [tableName]
      );
      return rows.length > 0;
    };

    // Migration 0002 creates scheduled_posts and drafts.
    // If either table is missing, remove any tracking record for that migration
    // so Drizzle will actually apply it.
    const scheduledPostsExists = await tableExists('scheduled_posts');
    const draftsExists = await tableExists('drafts');

    if (!scheduledPostsExists || !draftsExists) {
      const journalPath = join(process.cwd(), 'migrations', 'meta', '_journal.json');
      const journal = JSON.parse(readFileSync(journalPath, 'utf-8'));
      const entry0002 = journal.entries.find((e: any) => e.tag === '0002_dusty_deathstrike');

      if (entry0002) {
        await pool.query(
          `DELETE FROM drizzle.__drizzle_migrations WHERE created_at = $1`,
          [entry0002.when]
        );
        console.log('[db] removed stale tracking record for 0002_dusty_deathstrike — will apply migration');
      }
    }

    // Check how many migrations are now recorded
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) as count FROM drizzle.__drizzle_migrations`
    );
    const recordedCount = Number(countRows[0].count);

    if (recordedCount === 0) {
      // Tracking table is empty — check if schema was already applied via drizzle-kit push
      const usersExists = await tableExists('users');

      if (usersExists) {
        // Pre-seed only migrations whose tables are confirmed present
        const journalPath = join(process.cwd(), 'migrations', 'meta', '_journal.json');
        const journal = JSON.parse(readFileSync(journalPath, 'utf-8'));

        for (const entry of journal.entries) {
          // Only pre-seed if the tables for this migration exist
          // Migration 0002: requires both scheduled_posts and drafts
          if (entry.tag === '0002_dusty_deathstrike') {
            const sp = await tableExists('scheduled_posts');
            const dr = await tableExists('drafts');
            if (!sp || !dr) {
              console.log(`[db] skipping pre-seed for ${entry.tag} — tables missing, will apply migration`);
              continue;
            }
          }

          await pool.query(
            `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [`${entry.tag}_pre_seeded`, entry.when]
          );
          console.log(`[db] pre-seeded migration record: ${entry.tag}`);
        }
      }
    }

    // Run any genuinely new (unrecorded) migrations
    const db = drizzle({ client: pool });
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('[db] all migrations applied — database ready');
  } catch (err: any) {
    console.error('[db] migration failed:', err.message);
    throw err;
  }
}
