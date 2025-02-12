import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs-extra";

// Custom plugin to copy sample documents
const copyPublicFiles = () => ({
  name: "copy-public-files",
  buildEnd: async () => {
    // Create sample-docs directory in dist
    await fs.ensureDir("dist/sample-docs");

    // Copy PDF files from public to dist/sample-docs
    const files = await fs.readdir("public");
    for (const file of files) {
      if (file.endsWith(".pdf")) {
        await fs.copy(`public/${file}`, `dist/sample-docs/${file}`);
      }
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyPublicFiles()],
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
    minify: false,
    sourcemap: "inline",
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
        sourcemap: true,
      },
    },
    cssCodeSplit: false,
    cssMinify: false,
  },
});
