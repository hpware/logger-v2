<script setup lang="ts">
definePageMeta({
  layout: "main",
});
const password = ref("sss");
const deviceId = ref("0");
const devices = ref([]);
const router = useRouter();
const loading = ref(false);
const openDevice = () => {
  if (password.value === "") {
    alert("請輸入存取密碼");
    return;
  } else {
    if (deviceId.value !== "0") {
      loading.value = true;
      getAuthToken();
      setTimeout(() => {
        router.push(`/devices/${deviceId.value}`);
      }, 2000);
    } else {
      alert("請選擇一個連線機器");
    }
  }
  setTimeout(() => {
    loading.value = false;
  }, 4000);
};

const getAuthToken = async () => {
  const req = await fetch("/api/getAuthToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deviceId: deviceId.value,
      password: password.value,
    }),
  });
  if (!req.ok) {
    const errorData = await req.json();
    alert(`錯誤: ${errorData.message}`);
    return;
  }
  const data = await req.json();
  localStorage.setItem("authToken", data.token);
};

onMounted(async () => {
  try {
    const response = await fetch("/api/devices");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    devices.value = data.data;
  } catch (error) {
    console.error("Failed to fetch devices:", error);
  }
});
</script>
<template>
  <div
    class="justify-center align-center text-center selection:opactiy-[50%] absolute inset-0 flex flex-col p-10 md:p-20 lg:p-40 xl:p-60 2xl:p-80"
  >
    <div
      class="flex flex-col justify-center items-center bg-gray-300/50 backdrop-blur-sm z-10 p-3 rounded-lg shadow-lg py-10"
    >
      <h1 class="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-4">
        AIOT 生態物種即時監測回報裝置網頁系統
      </h1>
      <p class="text-lg text-white mb-8">歡迎使用管理系統</p>
      <div class="flex flex-col items-center">
        <select
          class="bg-white text-black border border-gray-300 rounded-md p-2 mb-4"
          v-model="deviceId"
          :disabled="loading"
        >
          <option value="0">選擇連線機器</option>
          <option
            v-for="device in devices"
            :key="device.id"
            :value="device.endpointid"
          >
            {{ device.name }}
          </option>
        </select>

        <button
          class="bg-white text-black rounded-md p-2 mb-4 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center min-w-[80px]"
          @click="openDevice"
          :disabled="loading"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
        >
          <!-- Spinner -->
          <svg
            v-if="loading"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ loading ? "連線中..." : "送出" }}
        </button>

        <!-- Loading message -->
        <p v-if="loading" class="text-sm text-white mt-2">
          正在建立連線，請稍候...
        </p>
      </div>
    </div>
  </div>
</template>
