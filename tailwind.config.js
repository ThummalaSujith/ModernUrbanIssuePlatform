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
        'sans': ['Montserrat', 'sans-serif'],
        'karla': ['Karla', 'sans-serif']

        
      }
    },
  },
  plugins: [],
};
