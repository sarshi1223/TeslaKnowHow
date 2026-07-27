import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  root: "pages",
  base: "/TeslaKnowHow/",
  publicDir: "../public",
  plugins: [react()],
  build: {
    outDir: "../pages-dist",
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL("./pages/index.html", import.meta.url)),
    },
  },
});
