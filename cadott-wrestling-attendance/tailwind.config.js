module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Wrestling Theme Colors
        wrestling: {
          primary: '#C41E3A',      // Wrestling red
          secondary: '#002244',    // Deep navy
          accent: '#FFD700',       // Gold
          success: '#10B981',      // Green for check-ins
          warning: '#F59E0B',      // Amber for warnings
          danger: '#EF4444',       // Red for alerts
        },
        cadott: {
          maroon: '#800000',       // School maroon
          gold: '#FFD700',         // School gold
          lightGray: '#F3F4F6',    // Light backgrounds
          darkGray: '#1F2937',     // Dark text/headers
        },
      },
      screens: {
        'tablet': '640px',
        'tablet-lg': '768px',
      },
      fontFamily: {
        'wrestling': ['Impact', 'Arial Black', 'sans-serif'],
        'body': ['Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};