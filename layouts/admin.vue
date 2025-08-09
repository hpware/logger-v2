<script setup lang="ts">
import { LogOutIcon } from "lucide-vue-next";
import { authClient } from "~/lib/auth-client";
const session = authClient.useSession();
const signOutFlow = async () => {
  await authClient.signOut();
  navigateTo("/login");
};
const loggedIn = ref(false);
watchEffect(() => {
  if (session.value.data) {
    loggedIn.value = true;
  } else {
    loggedIn.value = false;
  }
});
</script>
<template>
  <div>
    <div
      class="fixed inset-0 w-full h-full bg-[url(https://raw.githubusercontent.com/hpware/esp32-postgres-logger-view-and-api/refs/heads/main/bg.jpg?raw=true)] bg-cover bg-no-repeat bg-center z-[-1]"
    ></div>
    <div
      v-if="loggedIn"
      class="fixed bottom-0 right-0 m-2 p-2 z-50 flex flex-row bg-gray-300/30 p-2 border rounded-xl transition-all duration-300 ease-in-out"
    >
      <span class="m-auto pr-2 text-white">{{ session.data?.user.name }}</span>
      <button
        @click="signOutFlow"
        class="text-white hover:cursor-pointer flex flex-row backdrop-blur-xl bg-gray-300/30 p-2 border rounded-xl hover:bg-gray-300/50 transition-all duration-300 ease-in-out"
      >
        <LogOutIcon />
      </button>
    </div>
    <slot></slot>
  </div>
</template>
