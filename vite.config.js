import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // 開發、產品路徑
  base: process.env.NODE_ENV === "production" ? "/vite-react/" : "/",
  plugins: [react()],
});
