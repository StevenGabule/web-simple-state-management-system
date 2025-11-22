import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ["src"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "MyStateLibrary",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "react",
          "react-dom": "ReactDOM",
        },
      },
    },
    sourcemap: true,
    // Reduce bloat from legacy polyfills
    target: "esnext",
    // Leave minification up to applications
    minify: false,
  },
});
