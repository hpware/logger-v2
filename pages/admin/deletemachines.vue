<script setup lang="ts">
const machineName = ref("");
const password = ref("");
const camIp = ref("");
const devices = ref([]);
const getDevices = async () => {
  try {
    const response = await fetch("/api/devices");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch devices:", error);
    return [];
  }
};
onMounted(async () => {
  const getDevice = await getDevices();
    if (getDevice.length === 0) {
        alert("目前沒有任何機器可以刪除。");
    } else {
        devices.value = getDevice;
    }
});
const deleteMachine = async () => {
  const res = await fetch("/api/admin/deletemachine", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      machine_name: machineName.value,
      password: password.value,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    alert(`Error: ${errorData.message}`);
    return;
  }
  const data = await res.json();
  if (data.success) {
    alert("Machine deleted successfully!");
    machineName.value = "";
    camIp.value = "";
    password.value = "";
  } else {
    alert("Failed to delete machine.");
  }
  console.log(data);
};
</script>
<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div
      class="container mx-auto p-4 bg-gray-200/70 rounded-lg shadow-md border border-gray-300"
    >
      <h1 class="text-2xl font-bold mb-4">刪除舊機器</h1>
      <div class="mb-4">
        <span class="block text-sm font-medium text-gray-700"
          >機器名稱</span
        >
        <select
          class="bg-white text-black border border-gray-300 rounded-md p-2 mb-4 mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 transition-all duration-200"
          v-model="machineName"
          :disabled="loading"
        >
          <option
            v-for="device in devices"
            :key="device.id"
            :value="device.name"
          >
            {{ device.name }}
          </option>
        </select>
        <span class="block text-sm font-medium text-gray-700">密碼:</span>
        <input
          type="password"
          v-model="password"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 transition-all duration-200"
        />
        <button
          class="p-2 bg-sky-300 hover:bg-sky-500 rounded mt-2 hover:cursor-pointer transition-all duration-200"
          @click="deleteMachine"
        >
          刪除
        </button>
      </div>
    </div>
  </div>
</template>
