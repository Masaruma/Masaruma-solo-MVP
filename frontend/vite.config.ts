
import {defineConfig, UserConfig} from "vitest/config";
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    root: "./",
    base:"./",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    test: {
        // include: ['src/**/*.test.tsx'],
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTest.ts',
        mockReset: true,
    },
    server: {
        proxy: {
            '/api': 'http://localhost:8080',
        }
    },
    build: {
        // outDir: path.resolve(__dirname, '../backend/src/main/resources/static'),
        emptyOutDir: true,
    }
})
