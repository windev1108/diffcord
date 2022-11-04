/** @type {import('tailwindcss').Config} */

module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend : {
      colors : {
        "theme" : "#7269ef",
        "primary" : "#495057"
      },
      
    }
  },
  plugins: [],
}
