import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initialize, SafeArea } from "@capacitor-community/safe-area";
import { Capacitor } from "@capacitor/core";
import { soundEngine } from "./game/SoundEngine";
import { settingsManager } from "./game/SettingsManager";
import "./colors.css";
import "./fonts.css"; // Import fonts
import App from "./App.tsx";

// Import test utilities in development mode
if (import.meta.env.DEV) {
  import("./test/FloatingScoreTest");
}

// Initialize safe area CSS variables for SSR compatibility
initialize();

// Enable edge-to-edge mode with transparent system bars only on native platforms
if (Capacitor.isNativePlatform()) {
  SafeArea.enable({
    config: {
      customColorsForSystemBars: true,
      statusBarColor: "#00000000", // transparent
      statusBarContent: "light",
      navigationBarColor: "#00000000", // transparent
      navigationBarContent: "light",
      offset: 0,
    },
  }).catch((error) => {
    console.warn("Failed to enable SafeArea:", error);
  });
}

// Initialize game systems
async function initializeGameSystems() {
  try {
    // Load user settings
    await settingsManager.loadSettings();
    const settings = settingsManager.getSettings();

    // Initialize sound engine with user preferences
    await soundEngine.initialize();
    soundEngine.setEnabled(settings.soundEnabled);
    await soundEngine.setMasterVolume(settings.soundVolume);

    console.log("🎮 Game systems initialized");
  } catch (error) {
    console.warn("⚠️ Game systems initialization failed:", error);
  }
}

// Initialize on app start
initializeGameSystems();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
