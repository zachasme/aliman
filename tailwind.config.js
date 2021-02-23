const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{ts,tsx}"],
  darkMode: "media", // or false or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
      },
      screens: {
        'print': {'raw': 'print'}
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
