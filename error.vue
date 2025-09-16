<script lang="ts" setup>
import { TriangleAlertIcon } from "lucide-vue-next";
useSeoMeta({
  title: "404 Not Found",
  description: "對不起，這個的頁面不存在或已被移除。",
});
const error = useError();
</script>

<template>
  <div>
    <div
      class="fixed inset-0 w-full h-full bg-[url(https://raw.githubusercontent.com/hpware/esp32-postgres-logger-view-and-api/refs/heads/main/bg.jpg?raw=true)] bg-cover bg-no-repeat bg-center z-[-1]"
    ></div>
    <div class="relative z-[1] justify-center text-center">
      <div
        class="h-screen flex items-center justify-center text-white text-bold text-xl backdrop-blur-lg rounded-lg flex flex-col"
      >
        <div
          class="text-2xl sm:text-4xl md:text-6xl font-bold text-white text-border flex flex-col"
        >
          <TriangleAlertIcon
            class="inline-block fill-red-500 stroke-white text-2xl w-[100px] h-[100px] p-1"
          />
          {{ error.statusCode }}
        </div>
        <div class="text-2xl text-white mt-4 text-border">
          {{
            error.statusCode === 404
              ? "對不起，這個的頁面不存在或已被移除。"
              : error.message
          }}
        </div>
      </div>
    </div>
  </div>
</template>
