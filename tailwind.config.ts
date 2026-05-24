import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Segoe UI', 'Tahoma', 'Arial Unicode MS', 'Arial', 'sans-serif'],
        arabic: ['Segoe UI', 'Tahoma', 'Arial Unicode MS', 'Arial', 'sans-serif'],
      },
      colors: {
        bs: {
          primary:  '#F5A623',
          'primary-d': '#D4880A',
          navy:     '#1E2B45',
          'navy-l': '#2D4070',
          pearl:    '#FFFBF5',
          silver:   '#9BA5B4',
        },
      },
      backgroundImage: {
        'bs-grad':      'linear-gradient(135deg, #F5A623 0%, #D4880A 100%)',
        'bs-grad-navy': 'linear-gradient(135deg, #1E2B45 0%, #2D4070 100%)',
      },
      screens: { xs: '400px' },
    },
  },
  plugins: [],
};
export default config;
