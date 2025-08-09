import { createAuthClient } from "better-auth/vue";
const config = useRuntimeConfig();


export const authClient = createAuthClient({
  baseURL: config.public.betterAuthUrl,
});

export const { signIn, signUp, useSession } = createAuthClient();
