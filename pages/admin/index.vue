<script setup>
definePageMeta({
  layout: "admin",
});
useSeoMeta({
  title: "AIOT 生態物種即時監測回報裝置網頁系統管理中心",
})
</script>
<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center"
  >
    <div class="max-w-2xl w-full p-8 bg-white rounded-lg shadow-lg text-center">
      <h1 class="text-4xl font-bold text-gray-800 mb-8">管理中心</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          to="/admin/createmachine"
          class="group block p-6 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
        >
          <h2 class="text-xl font-semibold text-white">加入新機器</h2>
          <p class="text-blue-200 mt-2">新增並設定新的裝置</p>
        </NuxtLink>
        <NuxtLink
          to="/admin/deletemachines"
          class="group block p-6 bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
        >
          <h2 class="text-xl font-semibold text-white">刪除舊機器</h2>
          <p class="text-red-200 mt-2">移除不再使用的裝置</p>
        </NuxtLink>
        <a
          href="/createDatabase"
          class="group block p-6 bg-green-500 rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
        >
          <h2 class="text-xl font-semibold text-white">創立資料庫</h2>
          <p class="text-green-200 mt-2">初始化或重設資料庫</p>
        </a>
      </div>
    </div>
  </div>
</template>
