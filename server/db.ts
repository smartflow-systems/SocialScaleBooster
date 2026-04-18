import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

function buildConnectionString(): string | undefined {
  const { DATABASE_URL, PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT } = process.env;

  if (PGHOST && PGUSER && PGPASSWORD && PGDATABASE) {
    const port = PGPORT || "5432";
    const url = `postgresql://${PGUSER}:${encodeURIComponent(PGPASSWORD)}@${PGHOST}:${port}/${PGDATABASE}?sslmode=require`;
    console.log('[db] using connection string built from PG* environment variables');
    return url;
  }

  if (DATABASE_URL) {
    return DATABASE_URL;
  }

  return undefined;
}

const connectionString = buildConnectionString();

if (!connectionString) {
  console.warn("⚠️  No database credentials found - using in-memory storage for development");
}

export const pool = new Pool({ connectionString: connectionString || "postgresql://localhost:5432/dev" });
export const db = drizzle({ client: pool, schema });
