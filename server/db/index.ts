import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined in the environment variables");
}

const connection = postgres(process.env.POSTGRES_URL);

export const db = drizzle(connection, { schema });
