import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  root: "src/client",
  build: {
    outDir: resolve(process.cwd(), "public"),
    emptyOutDir: true
  }
});
