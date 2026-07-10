/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F2EB',
        card: '#FFFDF9',
        primary: '#4B3621',
        secondary: '#6F4E37',
        accent: '#C68E5D',
        border: '#E8DED1',
        heading: '#2B2118',
        body: '#7A6F66',
        success: '#7A8F69',
        warning: '#C38A62',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'lg': '18px',
        'xl': '20px',
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
