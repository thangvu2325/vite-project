/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";
import withMT from "@material-tailwind/react/utils/withMT";
export default withMT({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    colors: {
      blueBtn: "var(--btn-blue)",
      blueBtnHover: "#0064f1e3",
      transparent: "transparent",
      current: "currentColor",
      red: colors.red,
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      green: colors.emerald,
      purple: colors.violet,
      yellow: colors.amber,
      pink: colors.fuchsia,
    },
    extend: {
      screens: {
        xsm: "376px",
        "3xl": "1920px",
      },

      keyframes: () => ({
        sidebarShow: {
          "0%": { transform: "translateX(-100%)", opacity: 0 },
          "100%": { transform: "translateX(0%)", opacity: 1 },
        },
        sidebarHidden: {
          "0%": { transform: "translateX(0%)", opacity: 1 },
          "100%": { transform: "translateX(-100%)", opacity: 0 },
        },
        WhenSiderOn: {
          "0%": { left: "0" },
          "100%": { left: "280px" },
        },
        WhenSiderOff: {
          "0%": { left: "280px" },
          "100%": { left: "0" },
        },
      }),
      animation: {
        sidebarShow: "sidebarShow 0.6s ease-in-out",
        sidebarHidden: "sidebarHidden 0.6s ease-in-out",
        whenSideOn: "WhenSiderOn 0.6s ease-in-out",
        WhenSiderOff: "WhenSiderOff 0.6s ease-in-out",
      },
    },
  },
  plugins: ["tailwindcss-animate", "tailwindcss/colors"],
});
