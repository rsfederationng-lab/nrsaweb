import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import Sitemap from "vite-plugin-sitemap";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig((): UserConfig => {
  return {
    plugins: [
      react({ jsxRuntime: "automatic" }),
      Sitemap({
        hostname: 'https://nrsa.com.ng',
        exclude: ['/old', '/admin', '/admin-nrsa-dashboard'],
        dynamicRoutes: [
          '/',
          '/about',
          '/history',
          '/competitions',
          '/interschool',
          '/interschool/register',
          '/players',
          '/clubs',
          '/leaders',
          '/member-states',
          '/news',
          '/events',
          '/media',
          '/gallery',
          '/videos',
          '/contact',
          '/partnership',
          '/privacy-policy',
          '/terms-of-service',
        ],
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "client", "src", "assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    envDir: __dirname,
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      rollupOptions: {
        onwarn: () => {},
        output: {
          manualChunks: { vendor: ["react", "react-dom"] },
        },
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
    },
    appType: "spa",
    server: {
      host: true,
      port: 5173,
      fs: { strict: false },
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
      hmr: { overlay: false },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react/jsx-runtime"],
    },
  };
});