<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: "auth",
});
useSeoMeta({
  title: "AIOT 生態物種即時監測回報裝置網頁系統管理中心",
});
const machineName = ref("");
const password = ref("");
const camIp = ref("");
const devices = ref([]);
const loading = ref(false); // Added loading state
const getDevices = async () => {
  loading.value = true;
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
  } finally {
    loading.value = false;
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
    // Refresh the device list
    const updatedDevices = await getDevices();
    devices.value = updatedDevices;
  } else {
    alert("Failed to delete machine.");
  }
  console.log(data);
};
</script>

<template>
  <div>
    <div
      class="fixed inset-0 w-full h-full bg-[url(https://raw.githubusercontent.com/hpware/esp32-postgres-logger-view-and-api/refs/heads/main/bg.jpg?raw=true)] bg-cover bg-no-repeat bg-center z-[-1]"
    ></div>
    <div class="relative z-[1] justify-center text-center">
      <div class="flex flex-col items-center justify-center min-h-screen">
        <div
          class="bg-gray-300/5 backdrop-blur-sm z-10 p-8 rounded-lg shadow-lg border-2 border-gray-400/40 w-full max-w-md"
        >
          <h1 class="text-4xl font-bold text-center text-white mb-8">
            刪除舊機器
          </h1>
          <form @submit.prevent="deleteMachine" class="space-y-6">
            <div>
              <label
                for="machineName"
                class="block text-sm font-medium text-white mb-2"
                >機器名稱</label
              >
              <select
                id="machineName"
                v-model="machineName"
                class="mt-1 block w-full px-3 py-2 bg-gray-300/10 backdrop-blur-lg border border-gray-400/40 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 sm:text-sm text-white"
                :disabled="loading"
                required
              >
                <option disabled value="" class="text-gray-500">
                  Please select one
                </option>
                <option
                  v-for="device in devices"
                  :key="device.id"
                  :value="device.uuid"
                  class="text-black"
                >
                  {{ device.name }}
                </option>
              </select>
            </div>
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-white mb-2"
                >密碼</label
              >
              <input
                type="password"
                id="password"
                v-model="password"
                class="mt-1 block w-full px-3 py-2 bg-gray-300/10 backdrop-blur-lg border border-gray-400/40 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 sm:text-sm text-white"
                required
              />
            </div>
            <button
              type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-500/50 hover:bg-red-500/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
            >
              刪除
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
