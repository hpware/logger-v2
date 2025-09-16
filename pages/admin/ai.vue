<script setup lang="ts">
interface AIUsageData {
  label: string;
  limit: number;
  usage: number;
  is_provisioning_key: boolean;
  limit_remaining: number;
  is_free_tier: boolean;
  rate_limit: { requests: number; interval: string };
}
definePageMeta({
  layout: "admin",
  middleware: "auth",
});
useSeoMeta({
  title: "管理中心",
});
const data = ref<AIUsageData>();
onMounted(async () => {
  const req = await fetch("/api/admin/ai-usage");
  if (req.ok) {
    const res = await req.json();
    data.value = res.data;
  } else {
    console.error("Failed to fetch AI usage data");
  }
});
</script>

<template>
  <div>
    <div class="relative z-[1] justify-center text-center">
      <div class="flex flex-col items-center justify-center min-h-screen">
        <div
          class="bg-gray-300/5 backdrop-blur-sm z-10 p-8 rounded-lg shadow-lg border-2 border-gray-400/40 w-full max-w-md text-white"
        >
          <h1 class="text-2xl">AI 系統管理</h1>
          <section class="text-lg">
            <p>使用了 {{ data?.usage }} USD</p>
            <p>API 剩餘 {{ data?.limit_remaining }} USD</p>
            <p>免費版: {{ data?.is_free_tier ? "是" : "否" }}</p>
            <p>
              請求限制: 每 {{ data?.rate_limit.interval }} 可使用
              {{ data?.rate_limit.requests }} 次
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
