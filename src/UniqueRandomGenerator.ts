/**
 * UniqueRandomGenerator is a class that generates random integers in a range,
 * excluding the numbers that have been generated before, while in the randomized buffer.
 *
 * @remarks
 * This class uses cryptographically secure random number generation via the Web Crypto API,
 * which is available in both modern browsers and Node.js 18+.
 *
 * @example
 * ```typescript
 * const generator = new UniqueRandomGenerator()
 *   .setMinMax(1, 10)
 *   .setBufferSize(3);
 *
 * const num = generator.getRandomIntegerInRange(); // Won't repeat last 3 values
 * ```
 */
export class UniqueRandomGenerator {
  private min: number | null = null;
  private max: number | null = null;
  private buffer: number[] = [];
  private bufferSize: number = 0;
  private bufferSizeSet: boolean = false;
  private range: number = 0;

  /**
   * Sets the buffer size for the generator.
   *
   * @param bufferSize - The size of the buffer. Determines how many recent values to avoid.
   * @returns The instance of UniqueRandomGenerator for method chaining.
   *
   * @example
   * ```typescript
   * generator.setBufferSize(5); // Avoid repeating the last 5 generated numbers
   * ```
   */
  setBufferSize(bufferSize: number): this {
    if (this.bufferSize !== bufferSize) {
      this.bufferSize = bufferSize;
      this.bufferSizeSet = true;
    }
    return this;
  }

  /**
   * Sets the minimum value for the range.
   *
   * @param min - The minimum value (inclusive).
   * @returns The instance of UniqueRandomGenerator for method chaining.
   *
   * @example
   * ```typescript
   * generator.setMin(1); // Range starts at 1
   * ```
   */
  setMin(min: number): this {
    if (this.min !== min) {
      this.min = min;
      this.updateRange();
    }
    return this;
  }

  /**
   * Sets the maximum value for the range.
   *
   * @param max - The maximum value (inclusive).
   * @returns The instance of UniqueRandomGenerator for method chaining.
   *
   * @example
   * ```typescript
   * generator.setMax(10); // Range ends at 10
   * ```
   */
  setMax(max: number): this {
    if (this.max !== max) {
      this.max = max;
      this.updateRange();
    }
    return this;
  }

  /**
   * Sets both the minimum and maximum values for the range.
   *
   * @param min - The minimum value (inclusive).
   * @param max - The maximum value (inclusive).
   * @returns The instance of UniqueRandomGenerator for method chaining.
   *
   * @example
   * ```typescript
   * generator.setMinMax(1, 100); // Range from 1 to 100
   * ```
   */
  setMinMax(min: number, max: number): this {
    this.setMin(min);
    this.setMax(max);
    return this;
  }

  /**
   * Updates the range based on the current min and max values.
   *
   * @private
   */
  private updateRange(): void {
    if (this.min !== null && this.max !== null) {
      this.range = this.max - this.min + 1;
      if (!this.bufferSizeSet) {
        this.updateBufferSize();
        this.bufferSizeSet = true;
      }
    }
  }

  /**
   * Set the buffer size to a random number between 0 and this.range - 1,
   * so that the buffer size changes every time it's exhausted.
   *
   * @private
   */
  private updateBufferSize(): void {
    this.bufferSize = Math.floor(Math.random() * (this.range - 1));
  }

  /**
   * Generates a cryptographically secure random integer within the specified range.
   * This function ensures that the generated number hasn't been recently produced
   * by maintaining a buffer of previously generated numbers.
   *
   * @param min - Optional minimum value to override the configured min (inclusive).
   * @param max - Optional maximum value to override the configured max (inclusive).
   * @returns A random integer between min (inclusive) and max (inclusive).
   * @throws {Error} If min or max are not set (either via setMinMax or parameters).
   *
   * @example
   * ```typescript
   * // Using pre-configured range
   * generator.setMinMax(1, 10);
   * const num = generator.getRandomIntegerInRange();
   *
   * // Override range for this call
   * const num2 = generator.getRandomIntegerInRange(50, 100);
   * ```
   */
  getRandomIntegerInRange(min?: number, max?: number): number {
    // If min and max are provided, use them
    if (min !== undefined && max !== undefined) {
      this.min = min;
      this.max = max;
      this.updateRange();
    }

    // Check if min/max are set
    if (this.min === null || this.max === null) {
      throw new Error(
        'Min and max values must be set before generating random numbers.'
      );
    }

    if (this.min === this.max) {
      return this.min; // Return the min value if the range is a single number
    }

    const bitSize = Math.ceil(Math.log2(this.range));
    const byteSize = Math.ceil(bitSize / 8);
    let randomBytes: Uint8Array;
    let randomNumber: number;

    do {
      randomBytes = new Uint8Array(byteSize);
      // Use global crypto (works in Node 18+ and all modern browsers)
      crypto.getRandomValues(randomBytes);
      randomNumber = 0;
      for (let i = 0; i < byteSize; i++) {
        randomNumber |= randomBytes[i] << (8 * i);
      }
      randomNumber = (randomNumber % this.range) + this.min;
    } while (
      this.buffer.includes(randomNumber) &&
      this.buffer.length < this.range
    );

    if (this.buffer.length >= this.bufferSize) {
      this.buffer.shift();
      // Update bufferSize after the buffer is reset, but only if not explicitly set
      if (!this.bufferSizeSet) {
        this.updateBufferSize();
      }
    }
    this.buffer.push(randomNumber);

    return randomNumber;
  }
}
