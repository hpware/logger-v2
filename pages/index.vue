<script setup lang="ts">
definePageMeta({
  layout: "main",
});
useSeoMeta({
  title: "AIOT 生態物種即時監測回報裝置網頁系統",
  description: "歡迎使用管理系統",
});

const { authenticateDevice } = useAuth();
const password = ref("");
const deviceId = ref("0");
const devices = ref([]);
const router = useRouter();
const loading = ref(false);

const loginAsDevice = async () => {
  if (!password.value.trim()) {
    alert("請輸入裝置密鑰");
    return;
  }

  try {
    await authenticateDevice(password.value);
    await loadDevices();
    // Redirect to device selection or a default device
    if (devices.value.length > 0) {
      // For authenticated devices, go directly to the first device
      router.push(`/devices/${devices.value[0].uuid}`);
    }
  } catch (error: any) {
    alert("裝置密鑰錯誤");
  }
};

const loadDevices = async () => {
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
};
</script>
<template>
  <div
    class="justify-center select-none align-center text-center selection:opacity-50 absolute inset-0 flex flex-col p-4 md:p-10 lg:p-20 xl:p-40"
  >
    <div
      class="flex flex-col justify-center items-center bg-gray-300/5 backdrop-blur-sm z-10 p-6 rounded-lg shadow-lg border-2 border-gray-400/40 w-full max-w-md"
    >
      <h1 class="text-2xl md:text-4xl font-bold text-white mb-4 text-border">
        AIOT 生態物種即時監測回報裝置網頁系統
      </h1>
      <p class="text-lg text-white mb-6">請選擇登入方式</p>

      <div class="w-full space-y-4">
        <!-- User Login Button -->
        <NuxtLink
          to="/login"
          class="block w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md p-3 transition-all duration-300 text-center"
        >
          管理員登入
        </NuxtLink>

        <!-- Divider -->
        <div class="flex items-center">
          <hr class="flex-1 border-gray-400" />
          <span class="px-3 text-white text-sm">或</span>
          <hr class="flex-1 border-gray-400" />
        </div>

        <!-- Device Authentication -->
        <div class="space-y-3">
          <input
            v-model="password"
            type="password"
            placeholder="輸入裝置密鑰"
            class="w-full bg-white text-black border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="loginAsDevice"
            class="w-full bg-green-600 hover:bg-green-700 text-white rounded-md p-3 transition-all duration-300"
          >
            裝置登入
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
