import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        transparent : 'transparent',
        current : 'currentColor',
        'white' : '#ffffff',
        'red-custom-1': '#B95050',
        'red-custom-2' : '#EB5A5A',
        'red-custom-3' : '#AA3E3E',
        'orange-custom-1' : '#D7AC87',
        'orange-custom-2' : '#847266',
        'black-custom-1' : '#282828',
        'green-custom-1' : '#c8e3b2',
      },
      aspectRatio: {
        '1/2' : '1 / 2',
      },
      scale: {
        '025': '0.25',
      },
      width: {
        '70' : '17.5rem',
        '100' : '25rem',
        '110' : '27.5rem',
        '120' : '30rem',
        '128' : '32rem',
      },
      height: {
        '4.5' : '1.175rem',
        '90' : '22.5rem',
        '152' : '48rem',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
