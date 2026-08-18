import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: "#0B8F68", // Emerald Primary
                    deep: "#07634B",    // Emerald Deep
                    darkest: "#173A30", // Emerald Darkest
                    accent: "#A8F24A",  // Lime Accent
                },
                surface: {
                    DEFAULT: "#FFFFFF",
                    alt: "#F9FBFA",
                    muted: "#F0F7F3",
                },
                status: {
                    success: "#0B8F68",
                    warning: "#F59E0B",
                    danger: "#EF4444",
                    info: "#3B82F6",
                },
                text: {
                    primary: "#0F1A15",
                    secondary: "#4A5E54",
                    muted: "#6B7A6F",
                    placeholder: "#9AAEA3",
                    hairline: "#C8D5CC",
                },
                border: {
                    main: "rgba(11, 143, 104, 0.10)",
                    card: "#E8EDEA",
                    divider: "#F0F5F2",
                    glass: "rgba(255, 255, 255, 0.75)",
                }
            },
            boxShadow: {
                sidebar: "0 4px 32px rgba(11,143,104,0.09), 0 1px 0 rgba(11,143,104,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
                card: "0 8px 24px rgba(11,143,104,0.05)",
                button: "0 2px 8px rgba(11,143,104,0.28)",
                "button-primary": "0 4px 16px rgba(11,143,104,0.35)",
            },
        },
    },
    plugins: [],
};

export default config;