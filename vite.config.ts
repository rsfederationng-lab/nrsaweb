import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import Sitemap from "vite-plugin-sitemap";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log("Vite Config Debug - Root:", path.resolve(__dirname, "client"));
console.log("Vite Config Debug - Alias @:", path.resolve(__dirname, "client", "src"));

export default defineConfig(() => {
  const plugins = [
    react({
      jsxRuntime: "automatic",
    }),
    Sitemap({
      hostname: 'https://nrsa.com.ng',
      dynamicRoutes: [
        '/interschool-championship',
        '/partnership',
        '/news',
        '/events',
        '/players',
        '/clubs',
        '/leaders'
      ]
    }),
  ];

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    envDir: __dirname,
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      rollupOptions: {
        onwarn: () => { },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
          },
          // Add timestamp to filenames for cache busting
          entryFileNames: `[name]-${Date.now()}.js`,
          chunkFileNames: `[name]-${Date.now()}.js`,
          assetFileNames: `[name]-${Date.now()}.[ext]`
        },
      },
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
    },
    appType: 'spa',
    server: {
      host: true,
      port: 5173,
      fs: {
        strict: false,
      },
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
      hmr: {
        overlay: false,
      },
    },
    optimizeDeps: {
      force: true,
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime'
      ]
    },
  };
});
// Force restart: 1