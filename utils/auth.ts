import { getSession } from "../server/utils/auth";

export async function validateAdminSession(event: any) {
  const cookies = parseCookies(event);
  const token = cookies.auth_token;

  if (!token) {
    return null;
  }

  const sessionData = await getSession(token);
  return sessionData;
}

// Compatibility export for better-auth API
export const auth = {
  api: {
    getSession: async ({ headers }: any) => {
      // Extract token from Authorization header or cookies (for compatibility)
      let token = null;

      // Try Authorization header first
      const authHeader = headers.authorization || headers.Authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }

      if (!token) {
        // Fallback to cookies if no Authorization header
        const cookies = parseCookies({ headers } as any);
        token = cookies.auth_token;
      }

      if (!token) {
        return null;
      }

      return await getSession(token);
    },
  },
};
