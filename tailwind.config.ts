import type { Config } from "tailwindcss"

export default {
  darkMode: ["class", "html"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: { 
    extend: {
      fontFamily: {
        'londrina': ['Londrina Solid', 'cursive'],
        'sans': ['Londrina Solid', 'system-ui', 'sans-serif'],
      },
      colors: {
        'dark-green': 'var(--dark-green)',
        green: 'oklch(0.7259 0.2028 132.47)',
        'light-green': 'var(--light-green)',
        'dark-cyan': 'var(--dark-cyan)',
        'white-pure': 'var(--white-pure)',
        'white-bg': 'var(--white-bg)',
        gray: 'var(--gray)',
        'gray-dark': 'var(--gray-dark)',
        red: 'var(--red)',
      },
      fontFamily: {
        'sans': ['ui-sans-serif', 'system-ui', 'sans-serif'],
        'serif': ['ui-serif', 'Georgia', 'serif'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'monospace'],
        'custom': ['"londrina-solid"', 'sans-serif'],
      },
    } 
  },
  plugins: [],
} satisfies Config
