import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    },
  },
  build: {
    lib: {
      entry: "src/index.ts",
      name: "ParchaDocsPlayground",
      fileName: (format) =>
        `docs-playground.${format === "es" ? "js" : "umd.cjs"}`,
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
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "docs-playground.css";
          return assetInfo.name || "";
        },
      },
    },
    cssCodeSplit: false,
    cssMinify: true,
    sourcemap: true,
  },
});
