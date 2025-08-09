<script setup lang="ts">
import { signIn, signUp, useSession } from "@/lib/auth-client";
const username = ref("");
const password = ref("");
const name = ref("");
const login = async () => {
  try {
    await signIn.email({ email: username.value, password: password.value });
    alert("Login successful!");
    const session = useSession();
    navigateTo("/admin");
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please check your credentials.");
  }
};
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
  <div>
    Please login!
    <form>
      <input type="text" placeholder="Email" v-model="username" />
      <input type="password" placeholder="Password" v-model="password" />
      <button @click.prevent="login">Login</button>
    </form>
    Sign Up here:
    <form>
      <input type="text" placeholder="Email" v-model="username" />
      <input type="text" placeholder="Name" v-model="name" />
      <input type="password" placeholder="Password" v-model="password" />
      <button @click.prevent="signUpAction">Sign Up</button>
    </form>
  </div>
</template>
