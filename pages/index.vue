<script setup lang="ts">
const openDevice = () => {

}
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
            id="device-select"
          >
            <option value="0">選擇連線機器</option>
          </select>
          <div class="flex flex-row">
            <input
              type="password"
              placeholder="輸入存取密碼"
              class="bg-white text-black border border-gray-300 rounded-md p-2"
              id="access-key"
            />
          </div>
          <p class="text-sm text-gray-300 mb-4">請選擇連線機器並輸入存取密碼</p>
          <button
            class="bg-white text-black rounded-md p-2 mb-4 hover:bg-gray-200 transition-all duartion-300"
            @click="openDevice"
          >
            送出
          </button>
        </div>
      </div>
    </div>
</template>