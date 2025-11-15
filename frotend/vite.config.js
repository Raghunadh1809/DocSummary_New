// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "https://doc-summary-backend.vercel.app/",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
//   // Add build configuration for Vercel
//   build: {
//     outDir: "dist",
//     sourcemap: false,
//     minify: "esbuild",
//   },
//   // Ensure proper handling of environment variables
//   define: {
//     "process.env": {},
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Remove server configuration for production
  // Server proxy only works in development
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
  },
  // Ensure proper handling of environment variables
  define: {
    "process.env": {},
  },
});
