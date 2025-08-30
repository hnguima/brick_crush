import seedrandom from "seedrandom";

/**
 * Seeded PRNG utilities for reproducible randomness
 * Uses the seedrandom library for high-quality pseudorandom generation
 */

export class SeededRandom {
  private rng: seedrandom.PRNG;
  private seedValue: string;

  constructor(seed: string | number = Date.now().toString()) {
    this.seedValue = seed.toString();
    this.rng = seedrandom(this.seedValue);
  }

  /**
   * Generate next pseudo-random number between 0 and 1
   */
  next(): number {
    return this.rng();
  }

  /**
   * Generate integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Generate integer between 0 (inclusive) and max (exclusive)
   */
  nextIntMax(max: number): number {
    return this.nextInt(0, max);
  }

  /**
   * Generate random float between min and max
   */
  nextFloat(min: number = 0, max: number = 1): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Choose random element from array
   */
  choice<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error("Cannot choose from empty array");
    }
    return array[this.nextIntMax(array.length)];
  }

  /**
   * Shuffle array in place using Fisher-Yates algorithm
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextIntMax(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Choose multiple random elements without replacement
   */
  sample<T>(array: T[], count: number): T[] {
    if (count >= array.length) {
      return this.shuffle(array);
    }

    const shuffled = this.shuffle(array);
    return shuffled.slice(0, count);
  }

  /**
   * Get current seed value
   */
  getSeed(): string {
    return this.seedValue;
  }

  /**
   * Reset to specific seed
   */
  setSeed(seed: string | number): void {
    this.seedValue = seed.toString();
    this.rng = seedrandom(this.seedValue);
  }
}

/**
 * Create a new seeded random generator
 */
export function createRandom(
  seed: string | number = Date.now().toString()
): SeededRandom {
  return new SeededRandom(seed);
}

/**
 * Global random instance (can be reseeded)
 */
export const globalRandom = createRandom();
