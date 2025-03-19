/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    test: {
        testMatch: ['**/tests/**/*.test.js'],
        environment: 'jsdom',
        setupFiles: ['./tests/setup.jsx'],
        globals: true,
        css: true,
        coverage: {
            reporter: ['text', 'html', 'lcov', 'json', 'json-summary'],
            reportsDirectory: './tests/coverage',
            include: ['src/**'],
            exclude: ['src/main.jsx'],
            thresholds: {
                lines: 90,
                branches: 90,
                functions: 90,
                statements: 90,
            },
        },
    },
});
