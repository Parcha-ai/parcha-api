import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      entry: resolve(__dirname, "src/index.ts"),
      name: "FlashLoader",
      fileName: (format) =>
        `flash-loader.${format === "es" ? "js" : "umd.cjs"}`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@mui/material",
        "@mui/icons-material",
        "@emotion/react",
        "@emotion/styled",
        "@react-pdf-viewer/core",
        "@react-pdf-viewer/default-layout",
        "pdfjs-dist",
        "react-dropzone",
      ],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@mui/material": "MaterialUI",
          "@mui/icons-material": "MaterialIcons",
          "@emotion/react": "emotionReact",
          "@emotion/styled": "emotionStyled",
          "@react-pdf-viewer/core": "ReactPDFViewer",
          "@react-pdf-viewer/default-layout": "ReactPDFViewerDefaultLayout",
          "pdfjs-dist": "pdfjsLib",
          "react-dropzone": "ReactDropzone",
        },
        inlineDynamicImports: false,
        manualChunks: undefined,
        chunkFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "flash-loader.css";
          return assetInfo.name || "";
        },
      },
    },
    cssCodeSplit: false,
    cssMinify: true,
    sourcemap: true,
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
