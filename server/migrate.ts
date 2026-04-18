import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { pool } from './db';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Run database migrations on startup using Drizzle's migration runner.
 *
 * The Drizzle migrator tracks applied migrations by recording the `when`
 * (folderMillis) timestamp from the journal in drizzle.__drizzle_migrations.
 * It only applies migrations newer than the latest recorded timestamp.
 *
 * If the database schema was previously applied outside Drizzle's runner
 * (via drizzle-kit push), we pre-seed the tracking table for all known
 * migrations so Drizzle skips re-applying them.
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

    // Read the migration journal to find all migration timestamps
    const journalPath = join(process.cwd(), 'migrations', 'meta', '_journal.json');
    const journal = JSON.parse(readFileSync(journalPath, 'utf-8'));
    const allTimestamps: number[] = journal.entries.map((e: any) => e.when as number);
    const latestJournalTimestamp = Math.max(...allTimestamps);

    // Get the latest recorded migration timestamp
    const { rows } = await pool.query(
      `SELECT created_at FROM drizzle.__drizzle_migrations ORDER BY created_at DESC LIMIT 1`
    );
    const latestRecordedTimestamp = rows.length > 0 ? Number(rows[0].created_at) : 0;

    // If any journal migrations are unrecorded, seed them as pre-applied.
    // This handles the case where schema was applied via drizzle-kit push.
    if (latestRecordedTimestamp < latestJournalTimestamp) {
      for (const entry of journal.entries) {
        if (entry.when > latestRecordedTimestamp) {
          await pool.query(
            `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [`${entry.tag}_pre_seeded`, entry.when]
          );
          console.log(`[db] recorded pre-existing migration: ${entry.tag}`);
        }
      }
    }

    // Now run any genuinely new migrations (added after the current schema)
    const db = drizzle({ client: pool });
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('[db] all migrations applied — database ready');
  } catch (err: any) {
    console.error('[db] migration failed:', err.message);
    throw err;
  }
}
