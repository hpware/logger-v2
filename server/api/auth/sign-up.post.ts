import { createUser, getUserCount, createSession } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, email, password } = body;

    if (!name || !email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        statusMessage: "Password must be at least 6 characters long",
      });
    }

    // Check if this is the first user or if user creation is allowed
    const userCount = await getUserCount();
    if (userCount > 0) {
      // For additional users, we'll need admin approval or some other mechanism
      // For now, prevent additional user creation
      throw createError({
        statusCode: 400,
        statusMessage: "Account creation is restricted. Please contact an administrator.",
      });
    }

    const user = await createUser(name, email, password);
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
    console.error("Sign-up error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "User creation failed",
    });
  }
});
