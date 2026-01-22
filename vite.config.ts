/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import vueJsxVapor from "vue-jsx-vapor/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import UnoCSS from 'unocss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsxVapor({
      macros: true,
    }),
    UnoCSS(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        "vue/macros",
        {
          // 其他库
          axios: [
            // 默认导入
            ["default", "axios"],
          ],
        },
      ],
      resolvers: [ElementPlusResolver()],
      // 生成自动导入的 TypeScript 声明文件
      dts: "src/auto-imports.d.ts",

      // 自动导入目录下的模块
      dirs: ["src/composables/**", "src/store/**", "src/utils/**"],

      // 是否在 vue 模板中自动导入
      vueTemplate: true,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
      "@components": path.resolve("./src/components"),
      "@utils": path.resolve("./src/utils"),
      "@assets": path.resolve("./src/assets"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/index.scss";`,
      },
    },
  },
  test: {
    // ...
  },
});
