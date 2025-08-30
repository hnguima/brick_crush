import type { Piece, Bag } from "./Types";
import { generateBag } from "./Bag";
import { SeededRandom } from "./Random";

export class BagManager {
  private bag: (Piece | null)[];
  private rng: SeededRandom;

  constructor(seed?: string | number) {
    this.rng = new SeededRandom(seed);
    this.bag = generateBag(this.rng);
  }

  getBag(): Bag {
    return [...this.bag] as Bag;
  }

  getValidPieces(): (Piece | null)[] {
    return this.bag.filter((piece) => piece !== null);
  }

  removePiece(index: number): boolean {
    if (index < 0 || index >= 3 || this.bag[index] === null) {
      return false;
    }

    this.bag[index] = null;

    // Check if all pieces are used, generate new bag
    if (this.bag.every((piece) => piece === null)) {
      this.bag = generateBag(this.rng);
    }

    return true;
  }

  hasValidPieces(): boolean {
    return this.bag.some((piece) => piece !== null);
  }

  reset(seed?: string | number): void {
    if (seed !== undefined) {
      this.rng = new SeededRandom(seed);
    }
    this.bag = generateBag(this.rng);
  }
}
