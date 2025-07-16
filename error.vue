<script lang="ts" setup>
useSeoMeta({
  title: "404 Not Found",
  description: "對不起，這個的頁面不存在或已被移除。",
});
const error = useError();
</script>
<template>
  <div
    class="text-center justify-center align-center absolute inset-0 flex flex-col"
  >
    <div class="text-6xl font-bold">{{ error.statusCode }} {{ error.statusMessage }}</div>
    <div class="text-2xl">{{error.statusCode === 404 ? "對不起，這個的頁面不存在或已被移除。" : error.message}}</div>
    <div class="text-lg">如果您認為這是錯誤，請聯繫網站管理員。</div>
  </div>
</template>
