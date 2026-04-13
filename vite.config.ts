import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // يسمح بالوصول من الهاتف والأجهزة الأخرى على نفس شبكة الـ Wi‑Fi
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
});
