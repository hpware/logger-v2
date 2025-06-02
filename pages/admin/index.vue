<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl font-bold mb-4">管理中心</h1>
    <div class="flex space-x-4">
      <NuxtLink
        to="/admin/createmachine"
        class="p-2 bg-sky-300 rounded hover:bg-sky-400 transition-all duration-200"
        >Create Machine</NuxtLink
      >
      <NuxtLink
        to="/admin/manageusers"
        class="p-2 bg-sky-300 rounded hover:bg-sky-400 transition-all duration-200"
        >Manage Users</NuxtLink
      >
    </div>
  </div>
</template>
