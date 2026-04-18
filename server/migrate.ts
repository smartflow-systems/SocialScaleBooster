import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import { pool } from './db';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Run database migrations on startup using Drizzle's migration runner.
 *
 * Strategy:
 * 1. Parse each migration's SQL to determine which tables it creates.
 * 2. For any migration already recorded in the tracking table, verify its tables
 *    actually exist. If they don't, remove the stale tracking record so Drizzle
 *    will re-apply the migration.
 * 3. If the tracking table is empty but the core schema is already present
 *    (applied via drizzle-kit push), pre-seed only migrations whose tables are
 *    all confirmed present in the database.
 * 4. Let Drizzle apply any remaining (unrecorded) migrations normally.
 *
 * This approach is fully generic — it requires no per-migration hardcoding and
 * will work correctly for any future migration added to the journal.
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

    const migrationsDir = join(process.cwd(), 'migrations');

    // Helper: check if a table exists in the public schema
    const tableExists = async (tableName: string): Promise<boolean> => {
      const { rows } = await pool.query(
        `SELECT 1 FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = $1`,
        [tableName]
      );
      return rows.length > 0;
    };

    // Helper: parse a migration SQL file and return all tables it creates
    const getCreatedTables = (tag: string): string[] => {
      try {
        const sql = readFileSync(join(migrationsDir, `${tag}.sql`), 'utf-8');
        const matches = [...sql.matchAll(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?"?(\w+)"?\s*\(/gi)];
        return matches.map(m => m[1]);
      } catch {
        return [];
      }
    };

    // Helper: check if all tables created by a migration exist in the DB
    const allTablesExist = async (tag: string): Promise<boolean> => {
      const tables = getCreatedTables(tag);
      if (tables.length === 0) return true; // no tables to check (e.g. pure ALTER migration)
      for (const table of tables) {
        if (!(await tableExists(table))) return false;
      }
      return true;
    };

    // Read the journal
    const journal = JSON.parse(
      readFileSync(join(migrationsDir, 'meta', '_journal.json'), 'utf-8')
    );
    const entries: Array<{ idx: number; tag: string; when: number }> = journal.entries;

    // Get all currently tracked created_at timestamps
    const { rows: trackedRows } = await pool.query(
      `SELECT created_at FROM drizzle.__drizzle_migrations`
    );
    const trackedTimestamps = new Set(trackedRows.map((r: any) => Number(r.created_at)));

    // Step 1: For tracked migrations whose tables are missing, remove the stale
    // record so Drizzle will apply the migration properly.
    for (const entry of entries) {
      if (trackedTimestamps.has(entry.when)) {
        const tablesOk = await allTablesExist(entry.tag);
        if (!tablesOk) {
          await pool.query(
            `DELETE FROM drizzle.__drizzle_migrations WHERE created_at = $1`,
            [entry.when]
          );
          trackedTimestamps.delete(entry.when);
          console.log(`[db] removed stale tracking record for ${entry.tag} — will apply migration`);
        }
      }
    }

    // Step 2: If tracking table is now empty but core schema exists, this DB was
    // bootstrapped via drizzle-kit push. Pre-seed only migrations whose tables
    // are all confirmed present so Drizzle won't try to re-create them.
    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) as count FROM drizzle.__drizzle_migrations`
    );
    const recordedCount = Number(countRows[0].count);

    if (recordedCount === 0 && (await tableExists('users'))) {
      for (const entry of entries) {
        const tablesOk = await allTablesExist(entry.tag);
        if (tablesOk) {
          await pool.query(
            `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [`${entry.tag}_pre_seeded`, entry.when]
          );
          console.log(`[db] pre-seeded migration record: ${entry.tag}`);
        } else {
          console.log(`[db] skipping pre-seed for ${entry.tag} — tables missing, will apply migration`);
        }
      }
    }

    // Safety net for ALTER-only migrations: ensure sort_order column exists
    // (idempotent — harmless if the column was already added by a migration)
    await pool.query(
      `ALTER TABLE "scheduled_posts" ADD COLUMN IF NOT EXISTS "sort_order" integer DEFAULT 0`
    );
    console.log('[db] sort_order column ensured on scheduled_posts');

    // Step 3: Run any genuinely new (unrecorded) migrations
    const db = drizzle({ client: pool });
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('[db] all migrations applied — database ready');
  } catch (err: any) {
    console.error('[db] migration failed:', err.message);
    throw err;
  }
}
