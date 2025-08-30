import { NativeAudio } from "@capacitor-community/native-audio";

/**
 * Sound effects available in the game
 */
export enum SoundEffect {
  PIECE_PLACE = "piece_place",
  PIECE_INVALID = "piece_invalid",
  LINE_CLEAR = "line_clear",
  BAG_COMPLETE = "bag_complete",
  GAME_OVER = "game_over",
  UI_BUTTON = "ui_button",
}

/**
 * Sound configuration for each effect - supports single sounds or arrays of variations
 */
interface SoundConfig {
  paths: string | string[];
  volume: number;
  loop: boolean;
}

/**
 * High-performance native audio engine using Capacitor Native Audio plugin.
 * Provides low-latency sound effects for game interactions with cross-platform support.
 */
export class SoundEngine {
  private static instance: SoundEngine;
  private initialized = false;
  private enabled = true;
  private masterVolume = 1.0;
  private isNativePlatform = false;
  private assetPath = "/sounds/"; // Default web path, updated during platform detection

  private readonly soundConfigs: Record<SoundEffect, SoundConfig> = {
    [SoundEffect.PIECE_PLACE]: {
      paths: [
        "piece_place_1.wav",
        "piece_place_2.wav",
        "piece_place_3.wav",
        "piece_place_4.wav",
      ],
      volume: 0.3,
      loop: false,
    },
    [SoundEffect.PIECE_INVALID]: {
      paths: "piece_invalid.wav",
      volume: 0.5,
      loop: false,
    },
    [SoundEffect.LINE_CLEAR]: {
      paths: ["line_clear_1.wav", "line_clear_2.wav"],
      volume: 0.8,
      loop: false,
    },
    [SoundEffect.BAG_COMPLETE]: {
      paths: "bag_complete.wav",
      volume: 0.9,
      loop: false,
    },
    [SoundEffect.GAME_OVER]: {
      paths: "game_over.mp3",
      volume: 0.8,
      loop: false,
    },
    [SoundEffect.UI_BUTTON]: {
      paths: "ui_button.wav",
      volume: 0.6,
      loop: false,
    },
  };

  private constructor() {
    // Platform detection will be done during initialization
  }

  /**
   * Detect the current platform and configure sound loading strategy
   */
  private async detectPlatform(): Promise<void> {
    try {
      // Dynamically import Capacitor to avoid SSR issues
      const { Capacitor } = await import("@capacitor/core");
      this.isNativePlatform = Capacitor.isNativePlatform();

      // Set the appropriate asset path based on platform
      if (this.isNativePlatform) {
        this.assetPath = "public/sounds/"; // Android bundled assets path
      } else {
        this.assetPath = "/sounds/"; // Web public path
      }

      console.log(
        "🔊 Platform detected:",
        this.isNativePlatform ? "Native" : "Web",
        "- Asset path:",
        this.assetPath
      );
    } catch (error) {
      console.log("🔊 Platform detected: Web (fallback)");
      this.isNativePlatform = false;
      this.assetPath = "/sounds/";
      console.debug("Platform detection error:", error);
    }
  }

  /**
   * Get the singleton instance of the sound engine
   */
  static getInstance(): SoundEngine {
    if (!SoundEngine.instance) {
      SoundEngine.instance = new SoundEngine();
    }
    return SoundEngine.instance;
  }

  /**
   * Initialize the sound engine and preload all sound effects
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      console.log("🔊 Initializing sound engine...");

      // Detect platform first
      await this.detectPlatform();

      console.log(
        `🔊 Loading sounds for platform: ${
          this.isNativePlatform ? "Native" : "Web"
        }`
      );

      // Preload all sound effects
      const loadPromises = Object.entries(this.soundConfigs).map(
        async ([soundId, config]) => {
          const paths = this.getFullPaths(config);

          // Load all variations of this sound effect
          const pathPromises = paths.map(
            async (path: string, index: number) => {
              const assetId =
                paths.length > 1 ? `${soundId}_${index}` : soundId;

              try {
                console.log(`Loading sound: ${assetId} from ${path}`);

                await NativeAudio.preload({
                  assetId,
                  assetPath: path,
                  volume: config.volume * this.masterVolume,
                  audioChannelNum: 1,
                  isUrl: !this.isNativePlatform, // Use URLs for web, bundled assets for native
                });
                console.log(`✅ Loaded sound: ${assetId}`);
              } catch (error) {
                console.error(`❌ Failed to load sound ${assetId}:`, error);
              }
            }
          );

          await Promise.all(pathPromises);
        }
      );

      await Promise.all(loadPromises);
      this.initialized = true;
      console.log("🔊 Sound engine initialized successfully");
    } catch (error) {
      console.error("❌ Sound engine initialization failed:", error);
      // Disable sound engine if initialization fails
      this.enabled = false;
    }
  }

  /**
   * Get the full paths for sound files with the platform-appropriate prefix
   */
  private getFullPaths(config: SoundConfig): string[] {
    const paths = Array.isArray(config.paths) ? config.paths : [config.paths];
    return paths.map((path) => this.assetPath + path);
  }

  /**
   * Play a sound effect (randomly selects from variations if multiple exist)
   */
  async play(effect: SoundEffect): Promise<void> {
    console.log(`🔊 Attempting to play sound: ${effect}`);

    if (!this.initialized) {
      console.warn("🔊 Sound engine not initialized");
      return;
    }

    if (!this.enabled) {
      console.warn("🔊 Sound engine disabled");
      return;
    }

    try {
      const config = this.soundConfigs[effect];
      const paths = this.getFullPaths(config);

      let assetId: string = effect;
      if (paths.length > 1) {
        // Randomly select one of the variations
        const randomIndex = Math.floor(Math.random() * paths.length);
        assetId = `${effect}_${randomIndex}`;
      }

      console.log(`🔊 Playing sound: ${assetId}`);
      await NativeAudio.play({
        assetId,
        time: 0,
      });
      console.log(`✅ Successfully played sound: ${assetId}`);
    } catch (error) {
      console.warn(`⚠️ Failed to play sound ${effect}:`, error);
    }
  }

  /**
   * Set master volume (0.0 to 1.0)
   */
  async setMasterVolume(volume: number): Promise<void> {
    this.masterVolume = Math.max(0, Math.min(1, volume));

    if (!this.initialized) {
      return;
    }

    // Update volume for all loaded sounds
    const updatePromises = Object.entries(this.soundConfigs).map(
      async ([soundId, config]) => {
        const paths = this.getFullPaths(config);

        const pathPromises = paths.map(async (_: string, index: number) => {
          const assetId = paths.length > 1 ? `${soundId}_${index}` : soundId;
          try {
            await NativeAudio.setVolume({
              assetId,
              volume: config.volume * this.masterVolume,
            });
          } catch (error) {
            console.warn(`Failed to update volume for ${assetId}:`, error);
          }
        });

        await Promise.all(pathPromises);
      }
    );

    await Promise.all(updatePromises);
  }

  /**
   * Enable/disable all sound effects
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if sound is enabled
   */
  isEnabled(): boolean {
    return this.enabled && this.initialized;
  }

  /**
   * Get current master volume
   */
  getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Stop all currently playing sounds
   */
  async stopAll(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    const stopPromises = Object.entries(this.soundConfigs).map(
      async ([soundId, config]) => {
        const paths = this.getFullPaths(config);

        const pathPromises = paths.map(async (_: string, index: number) => {
          const assetId = paths.length > 1 ? `${soundId}_${index}` : soundId;
          try {
            await NativeAudio.stop({ assetId });
          } catch (error) {
            // Ignore errors when stopping sounds that aren't playing - this is expected
            console.debug("Sound not playing:", error);
          }
        });

        await Promise.all(pathPromises);
      }
    );

    await Promise.all(stopPromises);
  }

  /**
   * Unload all sounds and cleanup resources
   */
  async cleanup(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    await this.stopAll();

    const unloadPromises = Object.entries(this.soundConfigs).map(
      async ([soundId, config]) => {
        const paths = this.getFullPaths(config);

        const pathPromises = paths.map(async (_: string, index: number) => {
          const assetId = paths.length > 1 ? `${soundId}_${index}` : soundId;
          try {
            await NativeAudio.unload({ assetId });
          } catch (error) {
            console.warn(`Failed to unload sound ${assetId}:`, error);
          }
        });

        await Promise.all(pathPromises);
      }
    );

    await Promise.all(unloadPromises);
    this.initialized = false;
    console.log("🔇 Sound engine cleaned up");
  }

  /**
   * Test function to play a sound effect multiple times to hear variations
   */
  async testSoundVariations(
    effect: SoundEffect,
    times: number = 5
  ): Promise<void> {
    console.log(`🔊 Testing ${times} variations of ${effect}`);
    for (let i = 0; i < times; i++) {
      await this.play(effect);
      // Wait a bit between plays
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

// Export singleton instance for easy access
export const soundEngine = SoundEngine.getInstance();
