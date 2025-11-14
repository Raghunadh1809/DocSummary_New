import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://doc-summary-backend.vercel.app/", // or your backend port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
