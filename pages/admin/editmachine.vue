<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});
useSeoMeta({
  title: "AIOT 生態物種即時監測回報裝置網頁系統管理中心",
});

type Machine = {
  uuid: string;
  name: string;
  ip: string;
  token: string;
  created_at?: string;
};

const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const devices = ref<Machine[]>([]);
const selectedUuid = ref<string | null>(null);

const form = reactive({
  name: "",
  ip: "",
  token: "",
});

async function loadDevices() {
  loading.value = true;
  error.value = null;
  try {
    const res = await $fetch("/api/devices");
    devices.value = (res as any).data as Machine[];
  } catch (e: any) {
    error.value = e?.message || "Failed to load devices";
  } finally {
    loading.value = false;
  }
}

function onSelectChange() {
  success.value = null;
  error.value = null;
  const m = devices.value.find((d) => d.uuid === selectedUuid.value);
  if (m) {
    form.name = m.name || "";
    form.ip = m.ip || "";
    form.token = m.token || "";
  } else {
    form.name = "";
    form.ip = "";
    form.token = "";
  }
}

const adminPassword = ref(""); // New field for auth

async function save() {
  if (!selectedUuid.value) {
    error.value = "Please select a machine first";
    return;
  }
  saving.value = true;
  error.value = null;
  success.value = null;
  try {
    const res = await $fetch("/api/admin/updatemachine", {
      method: "POST",
      body: {
        uuid: selectedUuid.value,
        name: form.name,
        ip: form.ip,
        admin_password: adminPassword.value, // Use admin_password for auth
      },
    });
    if ((res as any).success) {
      success.value = "機器更新成功";
      // Update local cache
      const idx = devices.value.findIndex((d) => d.uuid === selectedUuid.value);
      const cur = idx > -1 ? devices.value[idx] : undefined;
      if (idx > -1 && cur) {
        devices.value[idx] = {
          uuid: cur.uuid,
          name: form.name,
          ip: form.ip,
          token: cur.token, // Do not update token in local cache
          created_at: cur.created_at,
        } as Machine;
      }
      // Clear password field after successful update
      adminPassword.value = "";
    } else {
      error.value = (res as any).message || "Update failed";
    }
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || "Update failed";
  } finally {
    saving.value = false;
  }
}

onMounted(loadDevices);
</script>

<template>
  <div>
    <div class="relative z-[1] justify-center text-center">
      <div class="flex flex-col items-center justify-center min-h-screen">
        <div
          class="bg-gray-300/5 backdrop-blur-sm z-10 p-8 rounded-lg shadow-lg border-2 border-gray-400/40 w-full max-w-md"
        >
          <h1 class="text-4xl font-bold text-center text-white mb-8">
            編輯機器
          </h1>

          <div
            v-if="success"
            class="bg-green-500/20 backdrop-blur-lg text-left border-l-4 border-green-500 text-green-200 p-4 mb-4 rounded-md"
          >
            <p class="font-bold text-green-300">成功</p>
            <p class="text-white">{{ success }}</p>
          </div>
          <div
            v-if="error"
            class="bg-red-500/20 backdrop-blur-lg border-l-4 border-red-500 text-red-200 p-4 mb-4 rounded-md"
          >
            <p class="font-bold text-red-300">錯誤</p>
            <p class="text-white">{{ error }}</p>
          </div>

          <form @submit.prevent="save" class="space-y-6">
            <div>
              <label
                for="selectedUuid"
                class="block text-sm font-medium text-white mb-2 text-left ml-3"
                >選擇機器</label
              >
              <select
                id="selectedUuid"
                v-model="selectedUuid"
                class="mt-1 block w-full px-3 py-2 bg-gray-300/10 backdrop-blur-lg border border-gray-400/40 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 sm:text-sm text-white"
                :disabled="loading"
                @change="onSelectChange"
                required
              >
                <option disabled value="" class="text-gray-500">
                  Please select one
                </option>
                <option
                  v-for="m in devices"
                  :key="m.uuid"
                  :value="m.uuid"
                  class="text-black"
                >
                  {{ m.name }}
                </option>
              </select>
            </div>

            <div v-if="loading" class="text-sm text-gray-200">
              Loading devices...
            </div>

            <div v-if="selectedUuid" class="space-y-6">
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-white mb-2 text-left ml-3"
                  >機器名稱</label
                >
                <input
                  type="text"
                  id="name"
                  v-model="form.name"
                  class="mt-1 block w-full px-3 py-2 bg-gray-300/10 backdrop-blur-lg border border-gray-400/40 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 sm:text-sm text-white"
                  required
                />
              </div>

              <div>
                <label
                  for="ip"
                  class="block text-sm font-medium text-white mb-2 text-left ml-3"
                  >相機 IP</label
                >
                <input
                  type="text"
                  id="ip"
                  v-model="form.ip"
                  class="mt-1 block w-full px-3 py-2 bg-gray-300/10 backdrop-blur-lg border border-gray-400/40 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 sm:text-sm text-white"
                  required
                />
              </div>

              <div>
                <label
                  for="adminPassword"
                  class="block text-sm font-medium text-white mb-2 text-left ml-3"
                  >管理密碼</label
                >
                <input
                  type="password"
                  id="adminPassword"
                  v-model="adminPassword"
                  class="mt-1 block w-full px-3 py-2 bg-gray-300/10 backdrop-blur-lg border border-gray-400/40 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-yellow-300 sm:text-sm text-white"
                  required
                />
              </div>

              <button
                type="submit"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-yellow-300/50 hover:bg-yellow-300/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 transition-all duration-300"
                :disabled="saving"
              >
                {{ saving ? "Saving..." : "更新" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
