/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sos: {
          bg: '#F8FAFC',
          primary: '#1D4ED8',
          'primary-hover': '#1E40AF',
          'primary-light': '#EFF6FF',
          danger: '#DC2626',
          'danger-hover': '#B91C1C',
          'danger-light': '#FEF2F2',
          warning: '#F59E0B',
          'warning-light': '#FFFBEB',
          'warning-box': '#FEF9C3',
          success: '#10B981',
          'success-light': '#ECFDF5',
          dark: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
          card: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'glow-primary': '0 0 20px rgba(29, 78, 216, 0.15)',
        'glow-danger': '0 0 20px rgba(220, 38, 38, 0.15)',
      }
    },
  },
  plugins: [],
}
