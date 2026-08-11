import type { Config } from "tailwindcss"

const config: Config = {
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                danger: {
                    50: "#fef2f2",
                    500: "#ef4444",
                    700: "#b91c1c",
                },
                safe: {
                    50: "#f0fdf4",
                    500: "#22c55e",
                    700: "#15803d",
                },
                warning: {
                    50: "#fffbeb",
                    500: "#f59e0b",
                    700: "#b45309",
                },
            },
            animation: {
                "pulse-sos": "pulse-sos 1.5s infinite",
            },
            keyframes: {
                "pulse-sos": {
                    "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(239,68,68,0.7)" },
                    "50%": { transform: "scale(1.05)", boxShadow: "0 0 0 10px rgba(239,68,68,0)" },
                },
            },
        },
    },
    plugins: [],
}
export default config