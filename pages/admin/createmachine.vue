<script setup lang="ts">
definePageMeta({
  layout: false, // Changed to false to use the custom layout from this file
});
useSeoMeta({
  title: "AIOT 生態物種即時監測回報裝置網頁系統管理中心",
});
const machineName = ref("");
const password = ref("");
const camIp = ref("");
const errorv = ref("");
const success = ref(false);
const deviceId = ref("");
const createMachine = async () => {
  success.value = false;
  errorv.value = "";
  deviceId.value = "";
  const res = await fetch("/api/admin/createmachine", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      machine_name: machineName.value,
      machine_ip: camIp.value,
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
    success.value = true;
    errorv.value = "";
    deviceId.value = data.uuid; // Assuming the response contains the UUID of the created machine
    machineName.value = "";
    camIp.value = "";
    password.value = "";
  } else {
    errorv.value = "Failed to create machine.";
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
            加入新機器
          </h1>
          <div
            v-if="success"
            class="bg-green-500/20 backdrop-blur-lg border-l-4 border-green-500 text-green-200 p-4 mb-4 rounded-md"
          >
            <p class="font-bold text-green-300">成功</p>
            <p class="text-white">
              機器已成功加入，UUID:
              <span class="text-yellow-300">{{ deviceId }}</span>
            </p>
            <p class="text-white">
              連線地址:
              <a
                :href="`https://logger-v2.sch2.top/device_store/${deviceId}`"
                class="text-blue-300 hover:text-blue-500 hover:underline transition-all duration-300"
                >https://logger-v2.sch2.top/device_store/{{ deviceId }}</a
              >
            </p>
          </div>
          <div
            v-if="errorv"
            class="bg-red-500/20 backdrop-blur-lg border-l-4 border-red-500 text-red-200 p-4 mb-4 rounded-md"
          >
            <p class="font-bold text-red-300">錯誤</p>
            <p class="text-white">{{ errorv }}</p>
          </div>
          <form @submit.prevent="createMachine" class="space-y-6">
            <div>
              <label
                for="machineName"
                class="block text-sm font-medium text-white mb-2"
                >機器名稱</label
              >
              <input
                type="text"
                id="machineName"
                v-model="machineName"
                class="mt-1 block w-full px-3 py-2 bg-gray-300/10 backdrop-blur-lg border border-gray-400/40 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 sm:text-sm text-white"
                required
              />
            </div>
            <div>
              <label
                for="camIp"
                class="block text-sm font-medium text-white mb-2"
                >8735 鏡頭 IP 位置</label
              >
              <input
                type="text"
                id="camIp"
                v-model="camIp"
                class="mt-1 block w-full px-3 py-2 bg-gray-300/10 backdrop-blur-lg border border-gray-400/40 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 sm:text-sm text-white"
                required
              />
            </div>
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-white mb-2"
                >Password</label
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
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-yellow-300/50 hover:bg-yellow-300/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 transition-all duration-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
