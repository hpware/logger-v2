<script setup lang="ts">
definePageMeta({
  layout: "admin",
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
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
        加入新機器
      </h1>
      <div
        v-if="success"
        class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md"
      >
        <p class="font-bold">成功</p>
        <p>機器 {{ machineName }} 已成功加入，UUID: {{ deviceId }}</p>
        <p>
          連線地址:
          <a
            :href="`https://logger-v2.sch2.top/device_store/${deviceId}`"
            class="text-blue-500 hover:underline"
            >https://logger-v2.sch2.top/device_store/{{ deviceId }}</a
          >
        </p>
      </div>
      <div
        v-if="errorv"
        class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md"
      >
        <p class="font-bold">錯誤</p>
        <p>{{ errorv }}</p>
      </div>
      <form @submit.prevent="createMachine">
        <div class="mb-4">
          <label
            for="machineName"
            class="block text-sm font-medium text-gray-700"
            >機器名稱</label
          >
          <input
            type="text"
            id="machineName"
            v-model="machineName"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-4">
          <label for="camIp" class="block text-sm font-medium text-gray-700"
            >8735 鏡頭 IP 位置</label
          >
          <input
            type="text"
            id="camIp"
            v-model="camIp"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
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
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</template>
