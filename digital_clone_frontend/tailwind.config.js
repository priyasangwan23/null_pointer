/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        border: 'var(--color-border)',
        heading: 'var(--color-heading)',
        body: 'var(--color-body)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.7rem', { lineHeight: '1rem' }],
        'sm': ['0.8rem', { lineHeight: '1.2rem' }],
        'base': ['0.875rem', { lineHeight: '1.4rem' }],
        'lg': ['1rem', { lineHeight: '1.5rem' }],
        'xl': ['1.1rem', { lineHeight: '1.6rem' }],
        '2xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '3xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      borderRadius: {
        'lg': '14px',
        'xl': '16px',
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
