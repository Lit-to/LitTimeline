import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: process.env.GITHUB_PAGES ? 'REPOSITORY_NAME' : './',
    resolve: {
        alias: {
            "js-cookie": "js-cookie/dist/js.cookie.mjs",
        },
    },
});
