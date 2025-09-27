<script lang="ts" setup>
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
</script>
<template>
  <NuxtLayout>
    <NuxtPage />
    <Toaster
      :closeButton="true"
      closeButtonPosition="top-right"
      position="top-right"
      :expand="false"
      richColors
    />
  </NuxtLayout>
</template>
