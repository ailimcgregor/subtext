/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "rw-gray": "#AAAFB4",
        "rw-purple": "#8e6edd",
        "rw-blue": "#65a5e8",
        "rw-green": "#6dc65b",
        "rw-orange": "#eda147",
      },
      fontFamily: {
        sfBold: ["SFProDisplay-Bold"],
        sfRegular: ["SFProDisplay-Regular"],
        sfSemiBold: ["SFProDisplay-Semibold"],
      },
      animation: {
        typing: "typing 2s steps(20) infinite alternate, blink .7s infinite",
      },
    },
  },
  plugins: [],
};
