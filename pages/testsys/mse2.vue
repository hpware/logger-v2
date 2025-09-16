<template>
  <div class="p-4">
    <h2 class="text-white text-2xl mb-4">MSE WebSocket Stream Test</h2>

    <!-- Try different codecs -->
    <div class="space-y-4">
      <MSEVideoPlayer
        stream-url="ws://localhost:8083/stream/cam/channel/0/mse?uuid=stream&channel=0"
        video-class="rounded-xl w-full max-w-md"
        mime-type="video/mp4; codecs=avc1.42E01E"
      />
    </div>
  </div>
</template>

<script setup>
import MSEVideoPlayer from "~/pages/testsys/mse.vue";
</script>
