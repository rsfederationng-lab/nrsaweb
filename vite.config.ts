import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import Sitemap from "vite-plugin-sitemap";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    plugins: [
      react({ jsxRuntime: "automatic" }),
      Sitemap({
        hostname: 'https://nrsa.com.ng',
        exclude: ['/old', '/admin*', '/admin-nrsa-dashboard*'],
        dynamicRoutes: [
          // ── Core (highest priority) ──
          { path: '/',                    changefreq: 'daily',   priority: 1.0 },
          { path: '/about',               changefreq: 'monthly', priority: 0.9 },
          { path: '/history',             changefreq: 'monthly', priority: 0.8 },
          { path: '/competitions',        changefreq: 'weekly',  priority: 0.9 },
          { path: '/interschool',         changefreq: 'weekly',  priority: 0.9 },
          // ── People & Organisation ──
          { path: '/players',             changefreq: 'weekly',  priority: 0.8 },
          { path: '/clubs',               changefreq: 'weekly',  priority: 0.8 },
          { path: '/leaders',             changefreq: 'monthly', priority: 0.8 },
          { path: '/member-states',       changefreq: 'monthly', priority: 0.7 },
          // ── Content ──
          { path: '/news',                changefreq: 'daily',   priority: 0.9 },
          { path: '/events',              changefreq: 'weekly',  priority: 0.9 },
          { path: '/media',               changefreq: 'weekly',  priority: 0.7 },
          { path: '/gallery',             changefreq: 'weekly',  priority: 0.7 },
          { path: '/videos',              changefreq: 'weekly',  priority: 0.7 },
          // ── Engagement ──
          { path: '/contact',             changefreq: 'monthly', priority: 0.7 },
          { path: '/partnership',         changefreq: 'monthly', priority: 0.7 },
          { path: '/interschool/register',changefreq: 'monthly', priority: 0.8 },
          // ── Legal ──
          { path: '/privacy-policy',      changefreq: 'yearly',  priority: 0.3 },
          { path: '/terms-of-service',    changefreq: 'yearly',  priority: 0.3 },
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