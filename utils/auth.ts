import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { admin } from "better-auth/plugins"


export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.POSTGRES_URL,
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
  plugins: [
    admin() 
]
});
