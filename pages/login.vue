<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
useSeoMeta({
  title: "Better Auth 登入系統",
});
import { signIn, useSession, authClient } from "@/lib/auth-client";
const username = ref("");
const password = ref("");
const name = ref("");
const login = async () => {
  try {
    const signin = await signIn.email({ email: username.value, password: password.value });
    if (!signin.user) {
      alert(`Login Failed, ${signin.code}`);
      return;
    }
    alert("Login successful!");
    const session = useSession();
    navigateTo("/admin");
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please check your credentials.");
  }
};
const session = authClient.useSession();

onMounted(() => {
  if (session) {
    navigateTo("/admin");
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
