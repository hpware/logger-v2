<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
useSeoMeta({
  title: "AIOT 生態物種即時監測回報裝置網頁系統管理中心",
});
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
      machine_uuid: machineName.value,
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
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
        刪除舊機器
      </h1>
      <form @submit.prevent="deleteMachine">
        <div class="mb-4">
          <label
            for="machineName"
            class="block text-sm font-medium text-gray-700"
            >機器名稱</label
          >
          <select
            id="machineName"
            v-model="machineName"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            :disabled="loading"
            required
          >
            <option disabled value="">Please select one</option>
            <option
              v-for="device in devices"
              :key="device.id"
              :value="device.uuid"
            >
              {{ device.name }}
            </option>
          </select>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >密碼</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          刪除
        </button>
      </form>
    </div>
  </div>
</template>
