import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

function requireEnvPlugin() {
  return {
    name: "require-env",
    config(_config, { command, mode }) {
      if (command === "build" && mode !== "test" && !process.env.VITE_API_BASE_URL) {
        throw new Error(
          "Missing required environment variable for production build: VITE_API_BASE_URL.\n" +
          "Copy .env.example to .env and fill in the values."
        );
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), requireEnvPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
