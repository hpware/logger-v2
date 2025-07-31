<script lang="ts" setup>
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
      <div class="flex flex-col items-center justify-center min-h-screen">
        <div
          class="bg-gray-300/5 backdrop-blur-sm z-10 p-8 rounded-lg shadow-lg border-2 border-gray-400/40 w-full max-w-fit"
        >
          <div
            class="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-4 text-border"
          >
            {{ error.statusCode }} {{ error.statusMessage }}
          </div>
          <div class="text-2xl text-white mt-4 text-border">
            {{
              error.statusCode === 404
                ? "對不起，這個的頁面不存在或已被移除。"
                : error.message
            }}
          </div>
          <div class="text-lg text-white mt-4 text-border">
            如果您認為這是錯誤，請聯繫網站管理員。
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
