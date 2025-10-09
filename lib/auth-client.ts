import { useAuth } from "~/composables/useAuth";

export const { signIn, signUp, useSession, session, isAuthenticated, user } = useAuth();

export const authClient = {
  useSession: () => ({
    data: { value: useSession().session.value?.user },
    isPending: computed(() => false),
  }),
};
