<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-4">Create Machine</h1>
      <form @submit.prevent="createMachine">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Machine Name</label
          >
          <input
            type="text"
            id="name"
            v-model="machineName"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </form>
    </div>
  </div>
</template>
