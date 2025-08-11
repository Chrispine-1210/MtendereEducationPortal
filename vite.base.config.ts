import { defineConfig } from 'vite';
import path from 'path';
import dns from 'dns';

// Fix localhost resolution in dev
dns.setDefaultResultOrder('verbatim');

export default defineConfig({
    // Shared aliases
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, './shared'),
            '@types': path.resolve(__dirname, './types')
        }
    },

    // Shared build options
    build: {
        sourcemap: true,
        chunkSizeWarningLimit: 1500
    },

    // Shared server options
    server: {
        strictPort: true,
        cors: true
    },

    // Shared plugins
    plugins: [] // Add shared plugins here
});
