import { Preferences } from "@capacitor/preferences";

/**
 * Game settings that can be persisted
 */
export interface GameSettings {
  soundEnabled: boolean;
  soundVolume: number;
  reducedMotion: boolean;
  highContrast: boolean;
}

/**
 * Default game settings
 */
const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  soundVolume: 1.0,
  reducedMotion: false,
  highContrast: false,
};

const SETTINGS_KEY = "brick_crush_settings";

/**
 * Settings manager using Capacitor Preferences for persistence
 */
export class SettingsManager {
  private static instance: SettingsManager;
  private currentSettings: GameSettings = { ...DEFAULT_SETTINGS };
  private readonly listeners: Array<(settings: GameSettings) => void> = [];

  private constructor() {}

  static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  /**
   * Load settings from persistent storage
   */
  async loadSettings(): Promise<GameSettings> {
    try {
      const { value } = await Preferences.get({ key: SETTINGS_KEY });
      if (value) {
        const savedSettings = JSON.parse(value) as GameSettings;
        // Merge with defaults to handle new settings added in updates
        this.currentSettings = { ...DEFAULT_SETTINGS, ...savedSettings };
      }
    } catch (error) {
      console.warn("Failed to load settings, using defaults:", error);
      this.currentSettings = { ...DEFAULT_SETTINGS };
    }

    return this.currentSettings;
  }

  /**
   * Save settings to persistent storage
   */
  async saveSettings(settings: Partial<GameSettings>): Promise<void> {
    this.currentSettings = { ...this.currentSettings, ...settings };

    try {
      await Preferences.set({
        key: SETTINGS_KEY,
        value: JSON.stringify(this.currentSettings),
      });

      // Notify listeners of settings change
      this.notifyListeners();
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }

  /**
   * Get current settings
   */
  getSettings(): GameSettings {
    return { ...this.currentSettings };
  }

  /**
   * Reset to default settings
   */
  async resetToDefaults(): Promise<void> {
    await this.saveSettings(DEFAULT_SETTINGS);
  }

  /**
   * Subscribe to settings changes
   */
  subscribe(listener: (settings: GameSettings) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentSettings);
      } catch (error) {
        console.error("Error in settings listener:", error);
      }
    });
  }
}

// Export singleton instance
export const settingsManager = SettingsManager.getInstance();
