<script setup lang="ts">
definePageMeta({
  layout: false,
});
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
  local_jistatus: false,
  light: false,
});

const gpsData = ref({
  gps_lat: "N/A",
  gps_long: "N/A",
});

const detectedItems = ref([]);
const ipport = ref("");

// Fetch data functions
const fetchDeviceData = async () => {
  try {
    // Replace with your actual API endpoint
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

    /*if (response.newsItems) {
      console.log("New items:", response.newsItems);
      getDetectedItems();
    }*/
    console.log(response);
    if (response.cached === true) {
      console.log("Using cached data");
      return;
    } else {
      console.log("Fetching new data");
    }

    dataId.value = response.dataid;
    console.log("Data ID:", dataId.value);

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
      local_jistatus: response.local_jistatus || false,
      light: response.local_light || false,
    };

    gpsData.value = {
      gps_lat: response.local_gps_lat || "N/A",
      gps_long: response.local_gps_long || "N/A",
    };
  } catch (error) {
    console.error("Failed to fetch device data:", error);
  }
};

const getDetectedItems = async () => {
  try {
    const res = await fetch(`/api/detecteditems/${deviceId}`);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await res.json();
    detectedItems.value = data.data || [];
  } catch (error) {
    console.error("Failed to fetch detected items:", error);
  }
};

const toggleJiStatus = async () => {
  // Toggle logic here
  localData.value.local_jistatus = !localData.value.local_jistatus;
};

const toggleLight = async () => {
  // Toggle logic here
  localData.value.light = !localData.value.light;
};

const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleString();
};

onMounted(() => {
  fetchDeviceData();
  // Set up polling for real-time updates
  setInterval(fetchDeviceData, 3000);
});
</script>

<template>
  <div
    class="justify-center align-center text-center selection:opactiy-[50%] p-1 bg-[url(https://raw.githubusercontent.com/hpware/esp32-postgres-logger-view-and-api/refs/heads/main/bg.jpg?raw=true)] bg-cover bg-no-repeat bg-center"
  >
  <div v-if="dataId === 0" class="h-screen flex items-center justify-center gap-2 text-white backdrop-blur-lg rounded-  ">
      <h3 class="text-lg">尚未有資料，等待中&nbsp;</h3>
      <svg
            class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
  </div>
  <div v-else>
    <h1
      class="text-4xl bg-white m-4 p-2 text-transparent text-center align-middle justify-center bg-clip-text backdrop-blur-lg shadow-lg shadown-gray-200 border border-white rounded-3xl flex flex-col"
    >
      顯示資料
    </h1>

    <a :href="`http://${ipport}`">
      <button
        class="bg-blue-200/70 p-2 rounded-xl hover:bg-blue-300/40 transition-all duration-300"
      >
        即時影像
      </button>
    </a>

    <section
      class="bg-gray-200/70 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
    >
      <h3 class="text-3xl text-bold">氣象局</h3>
      <hr />
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        測站:
        <span class="text-yellow-800">{{ weatherData.test_station }}</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        天氣狀態: <span class="text-yellow-800">{{ weatherData.type }}</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        氣溫: <span class="text-yellow-800">{{ weatherData.temp }}</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        濕度: <span class="text-yellow-800">{{ weatherData.hum }}</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        最高氣溫:
        <span class="text-yellow-800">{{ weatherData.daily_high }}</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        最低氣溫:
        <span class="text-yellow-800">{{ weatherData.daily_low }}</span>
      </p>
    </section>

    <section
      class="bg-gray-200/70 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
    >
      <h3 class="text-3xl text-bold">本地</h3>
      <hr />
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        氣溫: <span class="text-yellow-800">{{ localData.local_temp }}</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        濕度: <span class="text-yellow-800">{{ localData.local_hum }}</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        蠕動馬達
        <button
          @click="toggleJiStatus"
          class="p-2 bg-lime-400 hover:bg-lime-600 rounded-xl m-1 transition-all duration-100"
        >
          {{ localData.local_jistatus ? "關" : "開" }}
        </button>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        紅外線
        <button
          @click="toggleLight"
          class="p-2 bg-lime-400 hover:bg-lime-600 rounded-xl m-1 transition-all duration-100"
        >
          {{ localData.light ? "關" : "開" }}
        </button>
      </p>
    </section>

    <section
      class="bg-gray-200/70 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
    >
      <h3 class="text-3xl text-bold">GPS 定位</h3>
      <hr />
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        經度: <span class="text-yellow-800">{{ gpsData.gps_lat }}</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        緯度: <span class="text-yellow-800">{{ gpsData.gps_long }}</span>
      </p>
    </section>

    <section
      class="bg-gray-200/70 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
    >
      <ul>
        <li v-if="detectedItems.length === 0">尚未偵測到物種</li>
        <li v-for="item in detectedItems" :key="item.id">
          <a :href="item.imageURL">
            <div>
              <span>{{ item.item }}</span>
              <br />
              偵測時間: {{ formatTime(item.detected_at) }}
            </div>
          </a>
        </li>
      </ul>
    </section>
  </div>
</div>
</template>
