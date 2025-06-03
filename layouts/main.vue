<template>
  <!--Failback-->
  <div
    class="bg-gradient-to-r from-blue-500 to-green-500 min-h-screen flex items-center justify-center z-[1] hidden"
    id="failback"
  ></div>
  <div
    class="h-[100dvh] w-full absolute inset-0 bg-[url(/bg.jpg)] bg-cover bg-no-repeat bg-center"
  ></div>
  <div></div>
  <slot></slot>
</template>
