// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy auth and users endpoints to backend
      "/auth": "http://localhost:3000",
      "/users": "http://localhost:3000",
      // add more proxies as you add more routes:
      // "/roles": "http://localhost:3000",
      // "/departments": "http://localhost:3000",
    }
  }
});