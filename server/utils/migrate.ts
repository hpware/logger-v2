#!/usr/bin/env node

import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "../db";
import path from "path";
import postgres from "postgres";

async function runMigrations() {
  const client = postgres(process.env.POSTGRES_URL!, { prepare: false });

  try {
    console.log("Running database migrations...");
    await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
