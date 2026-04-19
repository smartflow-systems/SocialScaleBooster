import { defineConfig } from "drizzle-kit";

function getDbUrl(): string {
  const { DATABASE_URL, PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT } = process.env;

  if (DATABASE_URL) {
    return DATABASE_URL;
  }

  if (PGHOST && PGUSER && PGPASSWORD && PGDATABASE) {
    const port = PGPORT || "5432";
    return `postgresql://${PGUSER}:${encodeURIComponent(PGPASSWORD)}@${PGHOST}:${port}/${PGDATABASE}?sslmode=require`;
  }

  throw new Error("DATABASE_URL or PG* environment variables must be set.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getDbUrl(),
    ssl: { rejectUnauthorized: false },
  },
});
