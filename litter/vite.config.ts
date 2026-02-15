import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: process.env.VITE_GITHUB_PAGES ? process.env.VITE_GITHUB_PAGES_REPO : './',
    resolve: {
        alias: {
            "js-cookie": "js-cookie/dist/js.cookie.mjs",
        },
    },
});
