/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#4F46E5',     // Premium tech Indigo (was pinkish-red #E61E4F)
          success: '#008A05',     // Live Database Green
          deep: '#222222',        // Deep headers text
          body: '#484848',        // Body text
          muted: '#717171',       // Muted labels
          surface: '#FFFFFF',     // White card surfaces
          background: '#F7F7F7',  // App light gray bg
          border: '#EBEBEB',      // Border dividers
        }
      }
    },
  },
  plugins: [],
};
