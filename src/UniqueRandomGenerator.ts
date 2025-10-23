/**
 * Unique Random Generator
 * A perceptual randomizer that makes random sequences feel more random by preventing recent repetitions.
 */

export class UniqueRandomGenerator {
  private history: number[] = [];
  private maxHistorySize: number;
  private min: number;
  private max: number;

  /**
   * Creates a new UniqueRandomGenerator
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @param maxHistorySize - Number of recent values to avoid repeating (default: 3)
   */
  constructor(min: number, max: number, maxHistorySize: number = 3) {
    if (min >= max) {
      throw new Error('min must be less than max');
    }
    if (maxHistorySize < 1) {
      throw new Error('maxHistorySize must be at least 1');
    }
    if (max - min + 1 < maxHistorySize) {
      throw new Error('Range must be larger than maxHistorySize to avoid infinite loops');
    }

    this.min = min;
    this.max = max;
    this.maxHistorySize = maxHistorySize;
  }

  /**
   * Generates a random number that hasn't appeared in recent history
   * @returns A random number within the specified range
   */
  generate(): number {
    let value: number;
    let attempts = 0;
    const maxAttempts = 1000;

    do {
      value = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
      attempts++;

      if (attempts > maxAttempts) {
        throw new Error('Failed to generate unique value after maximum attempts');
      }
    } while (this.history.includes(value));

    this.history.push(value);

    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    return value;
  }

  /**
   * Resets the history of generated values
   */
  reset(): void {
    this.history = [];
  }

  /**
   * Gets the current history of generated values
   * @returns Array of recently generated values
   */
  getHistory(): number[] {
    return [...this.history];
  }
}

export default UniqueRandomGenerator;
