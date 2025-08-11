import { createAuthClient } from "better-auth/vue";
const config = useRuntimeConfig();

export const authClient = createAuthClient({
  baseURL: process.env.NUXT_PUBLIC_BETTER_AUTH_URL,
});

export const { signIn, signUp, useSession } = createAuthClient();
