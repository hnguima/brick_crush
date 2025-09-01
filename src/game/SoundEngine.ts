import { NativeAudio } from "@capacitor-community/native-audio";

/**
 * Sound effects available in the game
 */
export enum SoundEffect {
  PIECE_PLACE = "piece_place",
  PIECE_INVALID = "piece_invalid",
  LINE_CLEAR = "line_clear",
  // Line count specific sounds for multi-line completions
  LINE_CLEAR_DOUBLE = "line_clear_double", // 2 lines completed
  LINE_CLEAR_TRIPLE = "line_clear_triple", // 3 lines completed
  LINE_CLEAR_QUAD_PLUS = "line_clear_quad_plus", // 4+ lines completed
  // Combo sounds (mapped to line_clear_1.wav through line_clear_16.wav)
  LINE_CLEAR_COMBO = "line_clear_combo",
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
      paths: [
        "line_clear_1.wav",
        "line_clear_2.wav",
        "line_clear_3.m4a",
        "line_clear_4.m4a",
        "line_clear_5.m4a",
        "line_clear_6.m4a",
      ],
      volume: 0.8,
      loop: false,
    },
    // Line count specific sounds for multi-line completions
    [SoundEffect.LINE_CLEAR_DOUBLE]: {
      paths: "line_clear_6.m4a", // Satisfying double-line completion
      volume: 0.7,
      loop: false,
    },
    [SoundEffect.LINE_CLEAR_TRIPLE]: {
      paths: "line_clear_5.m4a", // Exciting triple-line completion
      volume: 0.8,
      loop: false,
    },
    [SoundEffect.LINE_CLEAR_QUAD_PLUS]: {
      paths: "line_clear_4.m4a", // Epic 4+ line completion
      volume: 0.9,
      loop: false,
    },
    // Combo sounds (line_clear_1.wav to line_clear_16.wav for combo progression)
    [SoundEffect.LINE_CLEAR_COMBO]: {
      paths: [
        "line_clear_1.wav", // Index 0: Combos 1-4
        "line_clear_2.wav", // Index 1: Combo 5
        "line_clear_3.wav", // Index 2: Combo 6
        "line_clear_4.wav", // Index 3: Combo 7
        "line_clear_5.wav", // Index 4: Combo 8
        "line_clear_6.wav", // Index 5: Combo 9
        "line_clear_7.wav", // Index 6: Combo 10
        "line_clear_8.wav", // Index 7: Combo 11
        "line_clear_9.wav", // Index 8: Combo 12
        "line_clear_10.wav", // Index 9: Combo 13
        "line_clear_11.wav", // Index 10: Combo 14
        "line_clear_12.wav", // Index 11: Combo 15
        "line_clear_13.wav", // Index 12: Combo 16
        "line_clear_14.wav", // Index 13: Combo 17
        "line_clear_15.wav", // Index 14: Combo 18
        "line_clear_16.wav", // Index 15: Combo 19+ (also used for combo 20+)
      ],
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
    } catch {
      this.isNativePlatform = false;
      this.assetPath = "/sounds/";
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
      // Detect platform first
      await this.detectPlatform();

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
                await NativeAudio.preload({
                  assetId,
                  assetPath: path,
                  volume: config.volume * this.masterVolume,
                  audioChannelNum: 1,
                  isUrl: !this.isNativePlatform, // Use URLs for web, bundled assets for native
                });
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
    if (!this.initialized || !this.enabled) {
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

      await NativeAudio.play({
        assetId,
        time: 0,
      });
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
  }

  /**
   * Test function to play a sound effect multiple times to hear variations
   */
  async testSoundVariations(
    effect: SoundEffect,
    times: number = 5
  ): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.play(effect);
      // Wait a bit between plays
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  /**
   * Get appropriate line clear sound effect based on number of lines completed
   */
  getLineClearSoundByLineCount(linesCleared: number): SoundEffect | null {
    if (linesCleared === 2) return SoundEffect.LINE_CLEAR_DOUBLE;
    if (linesCleared === 3) return SoundEffect.LINE_CLEAR_TRIPLE;
    if (linesCleared >= 4) return SoundEffect.LINE_CLEAR_QUAD_PLUS;
    return null; // No special sound for single line clears
  }

  /**
   * Play a combo-specific line clear sound based on combo level
   * Combos 1-4: sound 1, Combos 5-19: sounds 2-16, Combo 20+: sound 16
   */
  async playComboSound(combo: number): Promise<void> {
    if (!this.initialized || !this.enabled) {
      return;
    }

    try {
      const config = this.soundConfigs[SoundEffect.LINE_CLEAR_COMBO];
      const paths = this.getFullPaths(config);

      // Determine sound index based on combo level
      let soundIndex: number;
      if (combo <= 4) {
        soundIndex = 0; // line_clear_1.wav for combos 1-4
      } else if (combo <= 19) {
        soundIndex = Math.min(combo - 4, paths.length - 1); // combos 5-19 map to indices 1-15
      } else {
        soundIndex = paths.length - 1; // Last sound for combo 20+
      }

      const assetId = `${SoundEffect.LINE_CLEAR_COMBO}_${soundIndex}`;

      await NativeAudio.play({
        assetId,
        time: 0,
      });
    } catch (error) {
      console.warn(`⚠️ Failed to play combo sound for combo ${combo}:`, error);
    }
  }

  /**
   * Determine which type of line clear sound to play based on context
   * COMBO SOUND: Always plays on every line clear
   * LINE COUNT SOUND: Additionally plays for 2, 3, or 4+ line completions
   */
  async playLineClearSound(options: {
    linesCleared: number;
    combo: number;
    score: number;
  }): Promise<void> {
    const { linesCleared, combo } = options;

    // ALWAYS play combo sound for any line clear
    await this.playComboSound(combo);

    // ADDITIONALLY play line count sound for multi-line clears (2, 3, 4+ lines)
    const lineCountSound = this.getLineClearSoundByLineCount(linesCleared);
    if (lineCountSound) {
      await this.play(lineCountSound);
    }
  }
}

// Export singleton instance for easy access
export const soundEngine = SoundEngine.getInstance();
