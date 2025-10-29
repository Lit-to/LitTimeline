import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "js-cookie": "js-cookie/dist/js.cookie.mjs",
        },
    },
});
