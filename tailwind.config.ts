import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: "#0099FF",
          dark: "#0077CC",
          light: "#E6F4FF",
        },
        glass: {
          DEFAULT: "rgba(32, 32, 32, 0.8)",
          hover: "rgba(45, 45, 45, 0.9)",
          border: "rgba(255, 255, 255, 0.1)",
        },
        dark: {
          DEFAULT: "#1a1a1a",
          lighter: "#2a2a2a",
        },
        purple: {
          500: "#8B5CF6",
        },
        background: {
          DEFAULT: "#FFFFFF",
          blue: "#0099FF",
        },
        text: {
          DEFAULT: "#ABABAB",
          light: "#666666",
        },
      },
      boxShadow: {
        card: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        input: "0 2px 4px rgba(0, 0, 0, 0.05)",
        glow: "0 0 20px rgba(139, 92, 246, 0.3)",
      },
      borderRadius: {
        'xl': '1rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        success: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'success': 'success 0.3s ease-out',
      },
      backdropBlur: {
        'xl': '16px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config;
