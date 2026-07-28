import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // LINK V1.5 master brand = monochrome base. Rescue burgundy is this
        // site's single accent. It sits outside the regular division palette
        // on purpose: rescue.link.com.au stands beside LINK, not inside the
        // family tree.
        ink: "#000000",
        cloud: "#f4f5f6",
        line: "#e7e9ec",
        rescue: {
          DEFAULT: "#7B1E3A", // classic burgundy - gravity without alarm-red
          bright: "#A34D63", // lifted tint for gradients/dark bg accents
          light: "#F3DEE4",
          dark: "#3D0F1E",
        },
      },
      fontFamily: {
        // Work Sans now; Elza drops in via CSS var when the web licence lands
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
