<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold mb-4">管理中心</h1>
    <div class="flex space-x-4">
      <NuxtLink
        to="/admin/createmachine"
        class="p-2 bg-sky-300 rounded hover:bg-sky-400 transition-all duration-200"
        >加入新機器</NuxtLink
      >
      <NuxtLink
        to="/admin/deletemachines"
        class="p-2 bg-sky-300 rounded hover:bg-sky-400 transition-all duration-200"
        >刪除舊機器</NuxtLink
      >
      <a 
        href="/createDatabase"
        class="p-2 bg-sky-300 rounded hover:bg-sky-400 transition-all duration-200"
        >創立資料庫</a>
    </div>
  </div>
</template>
