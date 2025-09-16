<script setup lang="ts">
import { TriangleAlertIcon } from "lucide-vue-next";

interface Props {
  streamUrl: string;
  videoClass?: string;
  mimeType?: string;
}

const props = withDefaults(defineProps<Props>(), {
  videoClass: "rounded-xl w-full max-w-md",
  mimeType: 'video/mp4; codecs="avc1.42E01E"',
});

const videoElement = ref<HTMLVideoElement>();
const mediaSource = ref<MediaSource>();
const sourceBuffer = ref<SourceBuffer>();
const websocket = ref<WebSocket>();
const isLoading = ref(false);
const error = ref("");

const handleVideoError = (event: Event) => {
  console.error("Video error:", event);
  error.value = "Failed to load video stream";
};

const handleLoadStart = () => {
  isLoading.value = true;
  error.value = "";
};

const handleCanPlay = () => {
  isLoading.value = false;
};

const initMSE = async () => {
  if (!videoElement.value) return;

  try {
    // Check MSE support
    if (!("MediaSource" in window)) {
      throw new Error("MSE not supported");
    }

    // Check codec support
    if (!MediaSource.isTypeSupported(props.mimeType)) {
      throw new Error(`Codec not supported: ${props.mimeType}`);
    }

    mediaSource.value = new MediaSource();
    videoElement.value.src = URL.createObjectURL(mediaSource.value);

    mediaSource.value.addEventListener("sourceopen", () => {
      try {
        if (!mediaSource.value) return;

        sourceBuffer.value = mediaSource.value.addSourceBuffer(props.mimeType);

        sourceBuffer.value.addEventListener("updateend", () => {
          console.log("Source buffer updated");
        });

        sourceBuffer.value.addEventListener("error", (e) => {
          console.error("SourceBuffer error:", e);
          error.value = "Source buffer error";
        });

        // Connect WebSocket after MediaSource is ready
        connectWebSocket();
      } catch (err) {
        console.error("Error setting up source buffer:", err);
        error.value = `Failed to initialize video stream: ${err}`;
      }
    });

    mediaSource.value.addEventListener("sourceended", () => {
      console.log("MediaSource ended");
    });

    mediaSource.value.addEventListener("error", (e) => {
      console.error("MediaSource error:", e);
      error.value = "MediaSource error";
    });
  } catch (err) {
    console.error("MSE initialization error:", err);
    error.value = `MSE error: ${err}`;
  }
};

const connectWebSocket = () => {
  try {
    console.log("Connecting to WebSocket:", props.streamUrl);

    websocket.value = new WebSocket(props.streamUrl);
    websocket.value.binaryType = "arraybuffer";

    websocket.value.onopen = () => {
      console.log("WebSocket connected successfully");
      isLoading.value = false;
      error.value = "";
    };

    websocket.value.onmessage = (event) => {
      if (sourceBuffer.value && event.data && event.data.byteLength > 0) {
        try {
          // Only append if sourceBuffer is not currently updating
          if (!sourceBuffer.value.updating) {
            sourceBuffer.value.appendBuffer(event.data);
          } else {
            // Queue the data if sourceBuffer is busy
            console.log("SourceBuffer busy, queuing data");
            setTimeout(() => {
              if (sourceBuffer.value && !sourceBuffer.value.updating) {
                sourceBuffer.value.appendBuffer(event.data);
              }
            }, 10);
          }
        } catch (err) {
          console.error("Error appending buffer:", err);
        }
      }
    };

    websocket.value.onerror = (error) => {
      console.error("WebSocket error:", error);
      error.value =
        "WebSocket connection failed - check if the server is running";
      isLoading.value = false;
    };

    websocket.value.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      if (event.code !== 1000) {
        // 1000 is normal closure
        error.value = `Connection closed unexpectedly (${event.code})`;
      }
      isLoading.value = false;
    };
  } catch (err) {
    console.error("WebSocket connection error:", err);
    error.value = "Failed to create WebSocket connection";
    isLoading.value = false;
  }
};

const cleanup = () => {
  if (websocket.value) {
    console.log("Closing WebSocket connection");
    websocket.value.close();
    websocket.value = undefined;
  }

  if (sourceBuffer.value) {
    try {
      sourceBuffer.value.abort();
    } catch (err) {
      console.log("Error aborting source buffer:", err);
    }
  }

  if (mediaSource.value) {
    if (mediaSource.value.readyState === "open") {
      try {
        mediaSource.value.endOfStream();
      } catch (err) {
        console.log("Error ending MediaSource stream:", err);
      }
    }
    if (videoElement.value?.src) {
      URL.revokeObjectURL(videoElement.value.src);
    }
  }
};

onMounted(() => {
  if (props.streamUrl) {
    initMSE();
  }
});

onUnmounted(() => {
  cleanup();
});

watch(
  () => props.streamUrl,
  (newUrl) => {
    if (newUrl) {
      cleanup();
      nextTick(() => {
        initMSE();
      });
    }
  },
);
</script>

<!-- Template remains the same -->
<template>
  <div class="mse-video-container">
    <video
      ref="videoElement"
      :class="videoClass"
      controls
      muted
      autoplay
      playsinline
      @error="handleVideoError"
      @loadstart="handleLoadStart"
      @canplay="handleCanPlay"
    >
      Your browser does not support MSE video streaming.
    </video>
    <div v-if="isLoading" class="loading-overlay">
      <svg
        class="animate-spin h-8 w-8 text-white"
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
      <span class="ml-2">Loading stream...</span>
    </div>
    <div v-if="error" class="error-overlay">
      <TriangleAlertIcon class="w-8 h-8 text-red-500" />
      <span class="text-red-300 ml-2">{{ error }}</span>
    </div>
  </div>
</template>

<style scoped>
.mse-video-container {
  position: relative;
  display: inline-block;
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  border-radius: 0.5rem;
  color: white;
  z-index: 10;
}
</style>
