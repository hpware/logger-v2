<script lang="ts" setup>
import { Toaster } from "vue-sonner";
import { useFirstTimeSetup } from "~/composables/useFirstTimeSetup";
import "vue-sonner/style.css";

const { showPopup, form, isLoading, error, checkFirstTimeSetup, createFirstAccount, closePopup } = useFirstTimeSetup();

// Check for first time setup when the app starts
onMounted(() => {
  checkFirstTimeSetup();
});
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

    <!-- First-time setup popup -->
    <Transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
      appear
    >
      <div
        v-if="showPopup"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
          <h2 class="text-2xl font-bold text-center mb-4">歡迎使用系統</h2>
          <p class="text-gray-600 mb-6 text-center">
            這是您第一次使用系統，請創建管理員帳戶。
          </p>

          <form @submit.prevent="createFirstAccount" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入您的姓名"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                電子郵件
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入電子郵件地址"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                密碼
              </label>
              <input
                v-model="form.password"
                type="password"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請輸入密碼（至少6個字符）"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                確認密碼
              </label>
              <input
                v-model="form.confirmPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請再次輸入密碼"
              />
            </div>

            <div v-if="error" class="text-red-600 text-sm">
              {{ error }}
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                @click="closePopup"
                class="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                :disabled="isLoading"
              >
                稍後
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                :disabled="isLoading"
              >
                <span v-if="isLoading">創建中...</span>
                <span v-else>創建帳戶</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </NuxtLayout>
</template>
