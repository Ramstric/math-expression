import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import prism from "vite-plugin-prismjs";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return {
        plugins: [
            react(),

            prism({
                languages: ["latex", "python"],
                plugins: ["line-numbers"],
                css: true,
            }),
        ],

        base: process.env.VITE_BASE_PATH || "/",
        
        /*
        server: {
      
            proxy: {
                // Proxy API calls to your backend during development
                "/api": {
                    target: process.env.VITE_MATH_EXPR_API_URL,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, ""),
                    configure: (proxy) => {
                        proxy.on("proxyReq", (proxyReq) => {
                            proxyReq.setHeader("x-internal-api-key", process.env.VITE_MATH_EXPR_API_KEY ?? "");
                        });
                    }
                },
            },
        },*/
    };
});
