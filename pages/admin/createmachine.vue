<script setup lang="ts">
const machineName = ref("");
const password = ref("");
const createMachine = async () => {
  console.log("hi");
};
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div
      class="container mx-auto p-4 bg-gray-200/70 rounded-lg shadow-md border border-gray-300"
    >
      <h1 class="text-2xl font-bold mb-4">Create Machine</h1>
      <div class="mb-4">
        <span class="block text-sm font-medium text-gray-700"
          >Machine Name</span
        >
        <input
          type="text"
          id="name"
          v-model="machineName"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 transition-all duration-200"
        />
        <span class="block text-sm font-medium text-gray-700">Password:</span>
        <input
          type="password"
          v-model="password"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 transition-all duration-200"
        />
        <button
          class="p-2 bg-sky-300 hover:bg-sky-500 rounded mt-2 hover:cursor-pointer transition-all duration-200"
          @click="createMachine"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
