import { authenticateUser, createSession } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Email and password are required",
      });
    }

    const user = await authenticateUser(email, password);
    const session = await createSession(
      user.id,
      getClientIP(event) || null,
      getClientUserAgent(event)
    );

    // Set session cookie
    setCookie(event, "auth_token", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      user,
      session: {
        token: session.token,
        expiresAt: session.expiresAt,
      },
    };
  } catch (error: any) {
    console.error("Sign-in error:", error);
    throw createError({
      statusCode: error.statusCode || 401,
      statusMessage: error.message || "Authentication failed",
    });
  }
});
