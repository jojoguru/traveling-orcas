import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0099FF",
          dark: "#0077CC",
          light: "#E6F4FF",
        },
        background: {
          DEFAULT: "#FFFFFF",
          blue: "#0099FF",
        },
        text: {
          DEFAULT: "#333333",
          light: "#666666",
        },
      },
      boxShadow: {
        card: "0 2px 4px rgba(0, 0, 0, 0.1)",
        input: "0 2px 4px rgba(0, 0, 0, 0.05)",
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
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config;
