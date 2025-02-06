import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      credentials: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
      "Access-Control-Allow-Credentials": "true",
      "Referrer-Policy": "no-referrer",
    },
  },
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "FlashLoader",
      fileName: "flash-loader",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        assetFileNames: (assetInfo) => {
          return assetInfo.name === "style.css"
            ? "flash-loader.css"
            : assetInfo.name || "";
        },
      },
    },
    cssCodeSplit: false,
    cssMinify: true,
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
});
