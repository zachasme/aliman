const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.tsx?"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: colors.trueGray,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
