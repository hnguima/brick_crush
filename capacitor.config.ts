/// <reference types="@capacitor-community/safe-area" />

import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "brick_crush",
  webDir: "dist",
  plugins: {
    SafeArea: {
      enabled: true,
      customColorsForSystemBars: true,
      statusBarColor: "#00000000", // transparent
      statusBarContent: "light",
      navigationBarColor: "#00000000", // transparent
      navigationBarContent: "light",
      offset: 0,
    },
  },
};

export default config;
