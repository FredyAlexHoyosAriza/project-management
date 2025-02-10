import type { Config } from "tailwindcss";

export default {
  // content: [
  //   "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  //   "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  //   "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  //   "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  //   "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  // ],
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        'custom': '956px',
      },
    },
  },
  plugins: [],
} satisfies Config;
