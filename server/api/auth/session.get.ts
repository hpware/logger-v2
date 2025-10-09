import { getSession } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const cookies = parseCookies(event);
    const token = cookies.auth_token;

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "No session token provided",
      });
    }

    const sessionData = await getSession(token);

    if (!sessionData) {
      // Clear invalid cookie
      setCookie(event, "auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
      });

      throw createError({
        statusCode: 401,
        statusMessage: "Session expired or invalid",
      });
    }

    return {
      user: sessionData.user,
      session: {
        token: sessionData.session.token,
        expiresAt: sessionData.session.expiresAt,
      },
    };
  } catch (error: any) {
    console.error("Session check error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Session validation failed",
    });
  }
});
