import { deleteSession } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const cookies = parseCookies(event);
    const token = cookies.auth_token;

    if (token) {
      await deleteSession(token);
    }

    // Clear cookie
    setCookie(event, "auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Sign-out error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Sign-out failed",
    });
  }
});
