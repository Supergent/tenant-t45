import type { Config } from "tailwindcss";
import { tailwindPreset } from "@jn79wtdqtw4r1c2vp4esmnez697shgbv/design-tokens/tailwind.preset";

const config: Config = {
  darkMode: ["class"],
  presets: [tailwindPreset],
  content: ["./src/**/*.{{ts,tsx}}"],
  plugins: [],
};

export default config;
