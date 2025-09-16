import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  css: ["~/styles/main.css"],
  devtools: { enabled: true },
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      betterAuthUrl:
        process.env.NUXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
    },
  },
  app: {
    head: {
      title: "AIOT 生態物種即時監測回報裝置網頁系統",
      htmlAttrs: {
        lang: "zh-Hant",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.svg" }],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
      ],
    },
  },
});
