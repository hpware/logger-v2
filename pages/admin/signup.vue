<script setup lang="ts">
definePageMeta({
  layout: "admin",
    middleware: "auth",
});
useSeoMeta({
    title: "Better Auth 登入系統",
});
import { signUp } from "@/lib/auth-client";
const username = ref("");
const password = ref("");
const name = ref("");
const signUpAction = async () => {
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
};
</script>
<template>
    <div class="z-50 flex flex-col items-center justify-center absolute inset-0 backdrop-blur-lg text-white h-fit w-fit m-auto p-8 rounded-lg">
        <form class="flex flex-col items-center my-8 rounded-lg p-4 space-y-3">

      <input type="email" placeholder="Email" v-model="username" class="border rounded my-2 p-1"  />
      <input type="text" placeholder="Name" v-model="name" class="border rounded my-2 p-1" />
      <input type="password" placeholder="Password" v-model="password" class="border rounded my-2 p-1" />
      <button @click.prevent="signUpAction"  class="border rounded-lg p-1 bg-blue-500 px-7 hover:cursor-pointer transition-all duration-500 hover:bg-blue-500/50">Sign Up</button>
    </form>
    </div>
    </template>