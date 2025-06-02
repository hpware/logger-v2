import postgres from "postgres";

if (!process.env.POSTGRES_URL) {
  throw new Error("POSTGRES_URL is not defined in the environment variables");
}
const db = postgres(process.env.POSTGRES_URL);

export default db;
