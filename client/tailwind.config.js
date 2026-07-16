/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          neon: '#8DE900', // Energetic neon lime
          neonHover: '#7CD100',
          dark: '#0A0B0E', // Sleek background dark
          card: '#12141C', // Card background
          border: '#1E2230', // Custom border lines
          accent: '#FF4A4A', // Warning/Alert red or high energy accent
          gray: {
            light: '#9CA3AF',
            dark: '#4B5563',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
