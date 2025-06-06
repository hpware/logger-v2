<script setup lang="ts">
const machineName = ref("");
const password = ref("");
const camIp = ref("");
const createMachine = async () => {
  const res = await fetch("/api/admin/createmachine", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      machine_name: machineName.value,
      machine_ip: camIp.value,
      password: password.value || "sss",
    }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    alert(`Error: ${errorData.message}`);
    return;
  }
  const data = await res.json();
  if (data.success) {
    alert("Machine created successfully!");
    machineName.value = "";
    camIp.value = "";
    password.value = "";
  } else {
    alert("Failed to create machine.");
  }
  console.log(data);
};
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div
      class="container mx-auto p-4 bg-gray-200/70 rounded-lg shadow-md border border-gray-300"
    >
      <h1 class="text-2xl font-bold mb-4">加入新機器</h1>
      <div class="mb-4">
        <span class="block text-sm font-medium text-gray-700"
          >機器名稱</span
        >
        <input
          type="text"
          id="name"
          v-model="machineName"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 transition-all duration-200"
        />
        <span class="block text-sm font-medium text-gray-700"
          >8735 鏡頭 IP 位置</span
        >
        <input
          type="text"
          id="name"
          v-model="camIp"
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
