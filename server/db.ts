import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

function buildConnectionString(): string {
  const { DATABASE_URL, PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT } = process.env;

  if (DATABASE_URL) {
    console.log("[db] connecting via DATABASE_URL");
    return DATABASE_URL;
  }

  if (PGHOST && PGUSER && PGPASSWORD && PGDATABASE) {
    const port = PGPORT || "5432";
    const url = `postgresql://${PGUSER}:${encodeURIComponent(PGPASSWORD)}@${PGHOST}:${port}/${PGDATABASE}?sslmode=require`;
    console.log("[db] connecting via PG* environment variables");
    return url;
  }

  throw new Error(
    "No database credentials found. Set DATABASE_URL or PG* environment variables.",
  );
}

const connectionString = buildConnectionString();

export const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
export const db = drizzle(pool, { schema });
