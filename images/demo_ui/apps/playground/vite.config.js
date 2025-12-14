import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler']],
            },
        }),
    ],
    base: '/playground',
    build: {
        emptyOutDir: false,
    },
    resolve: {
        alias: [
            {
                find: '@docs',
                replacement: path.resolve(__dirname, 'src/pages/docs'), // The absolute path it resolves to
            },
            {
                find: '@',
                replacement: path.resolve(__dirname, 'src'),
            },
        ],
    },
})
