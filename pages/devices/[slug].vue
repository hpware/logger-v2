<script setup lang="ts">
import { signIn, useSession, authClient } from "@/lib/auth-client";

import {
  ImageOffIcon,
  CircleOffIcon,
  DatabaseIcon,
  TriangleAlertIcon,
} from "lucide-vue-next";
import adapter from "webrtc-adapter";
console.log(adapter);
definePageMeta({
  layout: false,
});
useSeoMeta({
  title: "AIOT 生態物種即時監測回報裝置網頁系統",
});
import "animate.css";

const cannotDisplayContent = ref(false);
onMounted(() => {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
      deviceId,
    )
  ) {
    cannotDisplayContent.value = true;
  }
});

// Define the type for detected items
interface DetectedItem {
  id: number;
  item: string;
  detected_at: string;
  imageurl: string;
}
const route = useRoute();
const deviceId = route.params.slug;
const dataId = ref(0);
// Reactive data
const weatherData = ref({
  test_station: "N/A",
  type: "",
  temp: "N/A",
  hum: "N/A",
  daily_high: "N/A",
  daily_low: "N/A",
});

const localData = ref({
  local_temp: "N/A",
  local_hum: "N/A",
});

const clientUpdateValues = ref({
  local_jistatus: false,
  light: 0,
});

const gpsData = ref({
  gps_lat: "N/A",
  gps_long: "N/A",
});

const machineDoesNotExist = ref(false);
onMounted(async () => {
  // Fetch device info
  const req = await fetch(`/api/device_info/${deviceId}`);
  const res = await req.json();
  if (JSON.stringify(res) === "{}") {
    machineDoesNotExist.value = true;
    return;
  }
});

const watchZeroCount = ref(false);
const watchZeroCountMainValue = ref(0);
watch(
  () => watchZeroCountMainValue.value,
  async () => {
    if (watchZeroCountMainValue.value > 70) {
      watchZeroCount.value = true;
    }
  },
);

const hiddenPage = ref(false);

const detectedItems = ref<DetectedItem[]>([]);
const ipport = ref("");

// Popup related refs
const showPopup = ref(false);
const popupImageUrl = ref("");
// Fetch data functions
const fetchDeviceData = async () => {
  if (cannotDisplayContent.value) {
    return;
  }
  try {
    const res = await fetch(`/api/devicedata/${deviceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataid: dataId.value,
      }),
    });

    const response = await res.json();
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    console.log(response);
    if (response.cached === true) {
      console.log("Using cached data");
      return;
    } else {
      console.log("Fetching new data");
    }

    dataId.value = response.dataid;
    console.log("Data ID:", dataId.value);
    const hiddenPage = ref(false);

    weatherData.value = {
      test_station: response.cwa_location || "N/A",
      type: response.cwa_type || "",
      temp: response.cwa_temp ? `${response.cwa_temp}°C` : "N/A°C",
      hum: response.cwa_hum ? `${response.cwa_hum}%` : "N/A%",
      daily_high: response.cwa_daily_high
        ? `${response.cwa_daily_high}°C`
        : "N/A°C",
      daily_low: response.cwa_daily_low
        ? `${response.cwa_daily_low}°C`
        : "N/A°C",
    };

    localData.value = {
      local_temp: response.local_temp ? `${response.local_temp}°C` : "N/A°C",
      local_hum: response.local_hum ? `${response.local_hum}%` : "N/A%",
    };

    gpsData.value = {
      gps_lat: response.local_gps_lat || "N/A",
      gps_long: response.local_gps_long || "N/A",
    };
    ipport.value = response.device_live_link || "";
    detectedItems.value = response.local_detect || [];
    detectedItems.value.forEach((item) => {
      if (item.imageurl) {
        const img = new Image();
        img.src = item.imageurl;
        img.onload = () => {
          console.log(`Image loaded: ${item.imageurl}`);
        };
        img.onerror = () => {
          console.error(`Error loading image: ${item.imageurl}`);
        };
      }
    });
  } catch (error) {
    console.error("Failed to fetch device data:", error);
  }
};

const onValueChange = async () => {
  if (cannotDisplayContent.value && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(deviceId)) {
    return;
  }
  const req = await fetch("/api/update_device", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      deviceId: deviceId,
      local_jistatus: clientUpdateValues.value.local_jistatus,
      light: clientUpdateValues.value.light,
    }),
  });
  const res = await req.json();
  if (!req.ok || !res.success) {
    alert("更新失敗，請稍後再試");
    return;
  }
};

const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleString();
};

const getErrorHandlerImage = () => {
  hiddenPage.value = true;
};

const showImagePopup = (imageUrl: string) => {
  popupImageUrl.value = imageUrl;
  showPopup.value = true;
};

onMounted(() => {
    fetchDeviceData();
    // Set up polling for real-time updates
    setInterval(fetchDeviceData, 3000);
    // Fetch all images first
    PullDataFromApiEndpointAboutGetDeviceStatus();

    setInterval(PullDataFromApiEndpointAboutGetDeviceStatus, 100000);
});
const changeJiStatus = () => {
  clientUpdateValues.value.local_jistatus =
    !clientUpdateValues.value.local_jistatus;
};

const PullDataFromApiEndpointAboutGetDeviceStatus = async () => {
  if (cannotDisplayContent.value) {
    return;
  }
  const req = await fetch(`/api/getDeviceStatus/${deviceId}`);
  const res = await req.json();
  clientUpdateValues.value.local_jistatus = res.jistatus;
  clientUpdateValues.value.light = res.lightstatus;
};
</script>

<template>
  <div>
    <div
      class="fixed inset-0 w-full h-full bg-[url(https://raw.githubusercontent.com/hpware/esp32-postgres-logger-view-and-api/refs/heads/main/bg.jpg?raw=true)] bg-cover bg-no-repeat bg-center z-[-1]"
    ></div>
    <div class="relative z-[1] justify-center text-center">
      <div
        v-if="cannotDisplayContent"
        class="h-screen flex items-center justify-center text-white text-bold text-xl backdrop-blur-lg rounded-lg flex flex-col"
      >
        <CircleOffIcon class="inline-block text-white text-2xl w-12 h-12 p-1" />
        <h3 class="text-gray-300">暫時無法顯示資料！</h3>
      </div>
      <div v-else>
        <div
          v-if="dataId === 0"
          class="h-screen flex flex-col items-center justify-center gap-2 text-white backdrop-blur-lg rounded-lg"
        >
          <svg
            class="animate-spin -ml-1 mr-2 h-12 w-12 text-white justify-center align-center text-center"
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
          <h3 class="text-lg">等待資料中</h3>
          <span
            >請複製以下程式到 // API 網址底下:
            <br />
            <code> const char *deviceId = "{{ deviceId }}"; </code>
          </span>
        </div>
        <Transition
          enter-active-class="animate__animated animate__fadeIn"
          leave-active-class="animate__animated animate__fadeOut"
          appear
          v-else
        >
          <div class="flex flex-col items-center justify-center">
            <section
              class="bg-gray-300/5 p-2 m-0 backdrop-blur-sm z-10 flex flex-col rounded-lg min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm m-3"
            >
              <h1
                class="text-4xl bg-white flex flex-row p-0 m-0 text-transparent text-center align-middle justify-center bg-clip-text flex flex-col"
              >
                <DatabaseIcon
                  class="inline-block text-white text-2xl w-12 h-12 p-1"
                />&nbsp;顯示資料
              </h1>
              <div class="flex flex-row text-center justify-center">
                <p class="text-white text-sm text-center">
                  ID:
                  <span class="text-yellow-300 p-1 m-1">{{ deviceId }}</span>
                </p>
              </div>
            </section>
            <section
              class="bg-gray-300/5 backdrop-blur-sm z-10 p-3 rounded-lg shadow-lg py-10 border-2 border-gray-400/40 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
            >
              <img
                :src="ipport"
                class="rounded-xl"
                v-on:error="getErrorHandlerImage"
                v-if="hiddenPage === false"
              />
              <div
                class="text-red-500 text-bold flex flex-col justify-center text-center"
                v-if="hiddenPage"
              >
                <TriangleAlertIcon
                  class="text-2xl w-12 h-12 p-1 text-center justify-center align-center align-middle align-center m-auto"
                />
                <span class="text-red-300 p-2">無法顯示圖片</span>
              </div>
            </section>
            <section
              class="bg-gray-300/5 backdrop-blur-sm z-10 p-3 rounded-lg shadow-lg py-10 border-2 border-gray-400/40 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
            >
              <h3 class="text-3xl text-bold text-white">氣象局</h3>
              <hr class="text-white" />
              <p
                class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2"
              >
                測站:
                <span class="text-yellow-300">{{
                  weatherData.test_station
                }}</span>
              </p>
              <p
                class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2"
              >
                天氣狀態:
                <span class="text-yellow-300">{{ weatherData.type }}</span>
              </p>
              <p
                class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2"
              >
                氣溫:
                <span class="text-yellow-300">{{ weatherData.temp }}</span>
              </p>
              <p
                class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2"
              >
                濕度: <span class="text-yellow-300">{{ weatherData.hum }}</span>
              </p>
              <p
                class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2"
              >
                最高氣溫:
                <span class="text-yellow-300">{{
                  weatherData.daily_high
                }}</span>
              </p>
              <p
                class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2"
              >
                最低氣溫:
                <span class="text-yellow-300">{{ weatherData.daily_low }}</span>
              </p>
            </section>

            <section
              class="bg-gray-300/5 backdrop-blur-sm z-10 p-3 rounded-lg shadow-lg py-10 border-2 border-gray-400/40 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
            >
              <h3 class="text-3xl text-bold text-white">本地</h3>
              <hr class="text-white" />
              <p
                class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2"
              >
                氣溫:
                <span class="text-yellow-300">{{ localData.local_temp }}</span>
              </p>
              <p
                class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2"
              >
                濕度:
                <span class="text-yellow-300">{{ localData.local_hum }}</span>
              </p>
              <p
                class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2"
              >
                蠕動馬達
                <button
                  @click="
                    () => {
                      changeJiStatus();
                      onValueChange();
                    }
                  "
                  class="p-2 bg-yellow-300/50 hover:bg-yellow-300/80 rounded-xl m-1 transition-all duration-300"
                >
                  {{ clientUpdateValues.local_jistatus ? "OFF" : "ON" }}
                </button>
              </p>
              <p
                class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2"
              >
                燈光
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="1"
                  v-model="clientUpdateValues.light"
                  @change="onValueChange"
                  class="w-full h-2 bg-gray-300/80 rounded-lg accent-yellow-300 hover:border-none transition-all duration-300"
                />
              </p>
            </section>

            <section
              class="bg-gray-300/5 backdrop-blur-sm z-10 p-3 rounded-lg shadow-lg py-10 border-2 border-gray-400/40 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
            >
              <h3 class="text-3xl text-bold text-white">GPS 定位</h3>
              <hr class="text-white" />
              <p
                class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2"
              >
                經度: <span class="text-yellow-300">{{ gpsData.gps_lat }}</span>
              </p>
              <p
                class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2"
              >
                緯度:
                <span class="text-yellow-300">{{ gpsData.gps_long }}</span>
              </p>
            </section>

            <section
              class="bg-gray-300/5 backdrop-blur-sm z-10 p-3 rounded-lg shadow-lg py-10 border-2 border-gray-400/40 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
            >
              <h3 class="text-3xl text-bold text-white">偵測紀錄</h3>
              <hr class="text-white" />
              <ul class="text-white">
                <li v-if="detectedItems.length === 0">
                  <div class="text-gray-300/80 p-4 flex flex-col items-center">
                    <ImageOffIcon
                      class="inline-block text-gray-300/90 text-2xl w-12 h-12 p-1"
                    />
                    <span>尚未有偵測紀錄</span>
                  </div>
                </li>

                <li
                  v-for="item in detectedItems"
                  :key="item.id"
                  class="bg-gray-300/5 backdrop-blur-lg rounded-lg shadow-lg p-2 border-2 border-gray-400/40 text-white m-2 hover:bg-gray-400/20 transition-all duration-500"
                >
                  <div
                    @click="showImagePopup(item.imageurl)"
                    class="cursor-pointer"
                  >
                    <div>
                      <span>{{ item.item }}</span>
                      <br />
                      偵測時間: {{ formatTime(item.detected_at) }}
                    </div>
                  </div>
                </li>
              </ul>
            </section>
            <section id="ai"></section>
          </div>
        </Transition>
      </div>

      <!-- Image Popup Modal -->
      <Transition
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut"
        appear
      >
        <div
          v-if="showPopup"
          class="fixed inset-0 bg-gray-300/30 backdrop-blur-lg flex items-center justify-center z-50 transition-all duration-500 max-w-full p-2"
        >
          <div class="relative">
            <button
              @click="showPopup = false"
              class="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200 max-w-full p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              :src="popupImageUrl"
              class="max-w-screen-md max-h-screen-md object-contain p-1"
            />
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
