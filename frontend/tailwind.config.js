// tailwind.config.js
const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      backgroundImage: {
        'bgImage': "url(/public/bg.jpg)"
      },
      colors: {
        "primary": "#3aa764"
      }
    }
  },
  
  
  
  purge: ['./src/**/*.js', './src/**/*.jsx'],
  plugins: [],
}
