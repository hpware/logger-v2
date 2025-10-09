<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
useSeoMeta({
  title: "登入系統",
});
import { useAuth } from "~/composables/useAuth";

const { isAuthenticated, signIn: authSignIn, checkSession } = useAuth();
const username = ref("");
const password = ref("");

const login = async () => {
  try {
    const result = await authSignIn(username.value, password.value);
    console.log("Login successful!", result);
  } catch (error: any) {
    console.error("Login failed:", error);

    // Show error message based on error type
    if (error.response?.status === 401) {
      alert("登入失敗，請檢查帳號密碼。");
    } else {
      alert("登入失敗，請稍後再試。");
    }
  }
};

onMounted(async () => {
  try {
    await checkSession();
    if (isAuthenticated.value) {
      navigateTo("/admin");
    }
  } catch (error) {
    // Session check failed, user needs to log in
  }
});
</script>
<template>
  <div
    class="flex flex-row items-center justify-center absolute inset-0 backdrop-blur-lg w-fit max-h-fit m-auto p-8 text-white bg-gray-300/30 rounded-lg shadow-lg border border-gray-200/30"
  >
    <form class="flex flex-col items-center p-4 space-y-3">
      <h2 class="text-4xl">請登入!</h2>
      <input
        type="email"
        placeholder="Email"
        v-model="username"
        class="border rounded my-2 p-1"
      />
      <input
        type="password"
        placeholder="Password"
        v-model="password"
        class="border rounded my-2 p-1"
      />
      <button
        @click.prevent="login"
        class="border rounded-lg p-1 bg-blue-500 px-7 hover:cursor-pointer transition-all duration-500 hover:bg-blue-500/50"
      >
        Login
      </button>
    </form>
  </div>
</template>
