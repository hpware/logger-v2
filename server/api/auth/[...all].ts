import { auth } from "~/utils/auth"; // path to your auth file
import sql from "~/server/db/pg";

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'POST' && new URL(event.node.req.url!, `http://${event.node.req.headers.host}`).pathname === '/auth/sign-up') {
    const countResult = await sql`SELECT COUNT(*) as count FROM "user"`;
    const userCount = parseInt(countResult[0].count);
    if (userCount > 0) {
      return createError({
        statusCode: 400,
        statusMessage: 'An administrator account already exists. Please log in instead.',
      });
    }
  }
  return auth.handler(toWebRequest(event));
});
