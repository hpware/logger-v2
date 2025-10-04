<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
useSeoMeta({
  title: "Better Auth 管理員註冊系統",
});
import { signUp, authClient } from "@/lib/auth-client";
const username = ref("");
const password = ref("");
const name = ref("");
const compeleteRequest = ref(false);
const errMessage = ref("");
const signUpAction = async () => {
  compeleteRequest.value = false;
  try {
    await signUp.email({
      email: username.value,
      name: name.value,
      password: password.value,
    });
    alert("Sign up successful! You can now log in.");
  } catch (error) {
    console.error("Sign up failed:", error);
    alert("Sign up failed. Please try again.");
  }
  compeleteRequest.value = true;
};
</script>
<template>
  <div>
    <div class="relative z-[1] justify-center text-center">
      <div class="flex flex-col items-center justify-center min-h-screen">
        <div
          class="bg-gray-300/5 backdrop-blur-sm z-10 p-8 rounded-lg shadow-lg border-2 border-gray-400/40 w-full max-w-md"
        >
          <div
            v-if="errMessage.length !== 0 && compeleteRequest"
            class="bg-green-500/20 backdrop-blur-lg text-left border-l-4 border-green-500 text-green-200 p-4 mb-4 rounded-md"
          >
            <p class="font-bold text-green-300">成功</p>
            <p class="text-white">管理者加入成功!</p>
          </div>

          <h1 class="text-4xl font-bold text-center text-white mb-8">
            增加管理者帳號
          </h1>
          <form
            class="flex flex-col items-center my-8 rounded-lg p-4 space-y-3"
          >
            <input
              type="email"
              placeholder="Email"
              v-model="username"
              class="border rounded border-white text-white my-2 p-1"
            />
            <input
              type="text"
              placeholder="Name"
              v-model="name"
              class="border rounded border-white text-white my-2 p-1"
            />
            <input
              type="password"
              placeholder="Password"
              v-model="password"
              class="border rounded border-white text-white my-2 p-1"
            />
            <button
              @click.prevent="signUpAction"
              class="border rounded-lg p-1 border-white text-white bg-blue-500 px-7 hover:cursor-pointer transition-all duration-500 hover:bg-blue-500/50"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
