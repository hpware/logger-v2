import { ref, computed } from "vue";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user?: AuthUser;
  token?: string;
  expiresAt?: Date;
  isDeviceAuth?: boolean;
}

const session = ref<AuthSession | null>(null);

export function useAuth() {
  const isAuthenticated = computed(() => !!session.value?.user);
  const user = computed(() => session.value?.user);
  const isDeviceAuth = computed(() => session.value?.isDeviceAuth);

  const checkSession = async () => {
    try {
      const response = await $fetch("/api/auth/session", {
        method: "GET",
      });

      session.value = {
        user: {
          ...response.user,
          createdAt: new Date(response.user.createdAt),
          updatedAt: new Date(response.user.updatedAt),
        },
        token: response.session.token,
        expiresAt: new Date(response.session.expiresAt),
      };

      return session.value;
    } catch (error) {
      session.value = null;
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await $fetch("/api/auth/sign-in", {
        method: "POST",
        body: { email, password },
      });

      session.value = {
        user: {
          ...response.user,
          createdAt: new Date(response.user.createdAt),
          updatedAt: new Date(response.user.updatedAt),
        },
        token: response.session.token,
        expiresAt: new Date(response.session.expiresAt),
      };

      if (process.client) {
        // Redirect to admin after successful login
        await navigateTo("/admin");
      }

      return session.value;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await $fetch("/api/auth/sign-up", {
        method: "POST",
        body: { name, email, password },
      });

      session.value = {
        user: {
          ...response.user,
          createdAt: new Date(response.user.createdAt),
          updatedAt: new Date(response.user.updatedAt),
        },
        token: response.session.token,
        expiresAt: new Date(response.session.expiresAt),
      };

      if (process.client) {
        // Redirect to admin after successful signup
        await navigateTo("/admin");
      }

      return session.value;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await $fetch("/api/auth/sign-out", {
        method: "POST",
      });

      session.value = null;

      if (process.client) {
        // Redirect to login
        await navigateTo("/");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const authenticateDevice = async (deviceKey: string) => {
    try {
      const response = await $fetch("/api/auth/device.authenticate", {
        method: "POST",
        body: { deviceKey },
      });

      session.value = {
        user: {
          ...response.user,
          createdAt: new Date(response.user.createdAt),
          updatedAt: new Date(response.user.updatedAt),
        },
        isDeviceAuth: response.isDeviceAuth,
      };

      return session.value;
    } catch (error) {
      console.error("Device authentication error:", error);
      throw error;
    }
  };

  return {
    session: readonly(session),
    isAuthenticated,
    user,
    isDeviceAuth,
    checkSession,
    signIn,
    signUp,
    signOut,
    authenticateDevice,
  };
}
