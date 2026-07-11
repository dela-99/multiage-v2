import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

function requireEnvPlugin() {
  return {
    name: "require-env",
    config(_config, { command, mode }) {
      // Only require VITE_API_BASE_URL in production mode
      if (command === "build" && mode === "production" && !process.env.VITE_API_BASE_URL) {
        console.warn(
          "Warning: VITE_API_BASE_URL not set for production build. Using relative URLs."
        );
        // Don't throw - allow build to continue with relative URLs
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
