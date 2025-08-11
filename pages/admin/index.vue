<script setup>
definePageMeta({
  layout: "admin",
  middleware: "auth",
});
useSeoMeta({
  title: "管理中心",
});
</script>

<template>
  <div>
    <div class="relative z-[1] justify-center text-center">
      <div class="flex flex-col items-center justify-center min-h-screen">
        <div
          class="bg-gray-300/5 backdrop-blur-sm z-10 p-8 rounded-lg shadow-lg border-2 border-gray-400/40 w-full max-w-4xl"
        >
          <h1 class="text-4xl font-bold text-center text-white mb-8">
            管理中心
          </h1>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NuxtLink
              to="/admin/createmachine"
              class="group block p-6 bg-blue-500/50 backdrop-blur-lg rounded-lg border-2 border-blue-400/40 hover:bg-blue-500/80 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <h2 class="text-xl font-semibold text-white">加入新機器</h2>
              <p class="text-blue-200 mt-2">新增裝置</p>
            </NuxtLink>
            <NuxtLink
              to="/admin/deletemachines"
              class="group block p-6 bg-red-500/50 backdrop-blur-lg rounded-lg border-2 border-red-400/40 hover:bg-red-500/80 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <h2 class="text-xl font-semibold text-white">刪除舊機器</h2>
              <p class="text-red-200 mt-2">移除裝置</p>
            </NuxtLink>
            <NuxtLink
              to="/admin/editmachine"
              class="group block p-6 bg-purple-500/50 backdrop-blur-lg rounded-lg border-2 border-purple-400/40 hover:bg-purple-500/80 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <h2 class="text-xl font-semibold text-white">編輯機器</h2>
              <p class="text-purple-200 mt-2">修改名稱、IP、密碼</p>
            </NuxtLink>
            <NuxtLink
              to="/admin/signup"
              class="group block p-6 bg-amber-500/50 backdrop-blur-lg rounded-lg border-2 border-amber-400/40 hover:bg-amber-500/80 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <h2 class="text-xl font-semibold text-white">增加管理者帳號</h2>
              <p class="text-purple-200 mt-2">加入管理者</p>
            </NuxtLink>
            <a
              href="/createDatabase"
              class="group block p-6 bg-green-500/50 backdrop-blur-lg rounded-lg border-2 border-green-400/40 hover:bg-green-500/80 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <h2 class="text-xl font-semibold text-white">創立資料庫</h2>
              <p class="text-green-200 mt-2">初始化資料庫</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
