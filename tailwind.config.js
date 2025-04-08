module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#243c5a',
      },
      fontFamily: {
        
        karla: ['Karla', 'sans-serif'],
        roboto: ['"Roboto Condensed"', 'sans-serif'],

        
      }
    },
  },
  plugins: [],
};
