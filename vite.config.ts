import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()));

  return defineConfig({
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
        define: {
          global: "globalThis",
        },
        supported: {
          bigint: true,
        },
      },
    },
    build: {
      target: ["es2020"],
    },
    plugins: [
      react(),
    ],
    define: {
      "process.env": {
        NX_WALLET_CONNECT_ID: process.env.VITE_WALLET_CONNECT_ID,
        NX_RIVET_KEY: process.env.VITE_RIVET_KEY,
        NX_GRAPH_API_KEY_MAINNET: process.env.VITE_GRAPH_API_KEY_MAINNET,
        NX_INFURA_PROJECT_ID: process.env.VITE_INFURA_PROJECT_ID,
        NX_ETHERSCAN_KEY: process.env.VITE_ETHERSCAN_KEY,
        NODE_ENV: "16.6.0",
      },
    },
  });
};
