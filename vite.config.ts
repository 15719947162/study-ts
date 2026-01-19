import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsxVapor from "vue-jsx-vapor/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsxVapor({
      macros: true,
    }),
  ],
});
