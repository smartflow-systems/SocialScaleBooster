import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Allow running without DATABASE_URL in development (will use MemStorage)
if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set - using in-memory storage for development");
}

const connectionString = process.env.DATABASE_URL || "postgresql://localhost:5432/dev";
export const pool = new Pool({ connectionString });
export const db = drizzle({ client: pool, schema });