import { createAuthClient } from "better-auth/vue"
export const authClient = createAuthClient({
    baseURL: process.env.NUXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
})

export const { signIn, signUp, useSession } = createAuthClient()
