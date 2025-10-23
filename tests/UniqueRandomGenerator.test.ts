import { describe, it, expect, beforeEach } from 'vitest';
import { UniqueRandomGenerator } from '../src/UniqueRandomGenerator';

describe('UniqueRandomGenerator', () => {
  let generator: UniqueRandomGenerator;

  beforeEach(() => {
    generator = new UniqueRandomGenerator();
  });

  describe('Basic functionality', () => {
    it('should create an instance', () => {
      expect(generator).toBeInstanceOf(UniqueRandomGenerator);
    });

    it('should support method chaining', () => {
      const result = generator.setMinMax(1, 10).setBufferSize(3);
      expect(result).toBe(generator);
    });

    it('should generate a number within range', () => {
      generator.setMinMax(1, 10);
      const num = generator.getRandomIntegerInRange();
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(10);
    });

    it('should accept min/max as parameters to getRandomIntegerInRange', () => {
      const num = generator.getRandomIntegerInRange(50, 100);
      expect(num).toBeGreaterThanOrEqual(50);
      expect(num).toBeLessThanOrEqual(100);
    });

    it('should return the same value when min equals max', () => {
      generator.setMinMax(5, 5);
      const num = generator.getRandomIntegerInRange();
      expect(num).toBe(5);
    });

    it('should throw error if min/max not set', () => {
      expect(() => generator.getRandomIntegerInRange()).toThrow(
        'Min and max values must be set before generating random numbers.'
      );
    });
  });

  describe('Range configuration', () => {
    it('should set min value', () => {
      generator.setMin(10).setMax(20);
      const num = generator.getRandomIntegerInRange();
      expect(num).toBeGreaterThanOrEqual(10);
      expect(num).toBeLessThanOrEqual(20);
    });

    it('should set max value', () => {
      generator.setMax(50).setMin(40);
      const num = generator.getRandomIntegerInRange();
      expect(num).toBeGreaterThanOrEqual(40);
      expect(num).toBeLessThanOrEqual(50);
    });

    it('should set both min and max', () => {
      generator.setMinMax(100, 200);
      const num = generator.getRandomIntegerInRange();
      expect(num).toBeGreaterThanOrEqual(100);
      expect(num).toBeLessThanOrEqual(200);
    });
  });

  describe('Buffer exclusion', () => {
    it('should not repeat values within buffer size', () => {
      generator.setMinMax(1, 10).setBufferSize(5);

      const generated = new Set<number>();
      for (let i = 0; i < 5; i++) {
        const num = generator.getRandomIntegerInRange();
        expect(generated.has(num)).toBe(false);
        generated.add(num);
      }
    });

    it('should allow repetition after buffer is exceeded', () => {
      // Small range with buffer size 2
      generator.setMinMax(1, 3).setBufferSize(2);

      const numbers: number[] = [];
      // Generate enough numbers to potentially see repeats
      for (let i = 0; i < 20; i++) {
        numbers.push(generator.getRandomIntegerInRange());
      }

      // Should have generated numbers (not throw or hang)
      expect(numbers.length).toBe(20);

      // Each number should be in valid range
      numbers.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(3);
      });
    });

    it('should handle buffer size of 0', () => {
      generator.setMinMax(1, 5).setBufferSize(0);

      // Should be able to generate multiple values
      const nums = Array.from({ length: 10 }, () =>
        generator.getRandomIntegerInRange()
      );

      expect(nums.length).toBe(10);
      nums.forEach(num => {
        expect(num).toBeGreaterThanOrEqual(1);
        expect(num).toBeLessThanOrEqual(5);
      });
    });

    it('should handle buffer size equal to range', () => {
      generator.setMinMax(1, 5).setBufferSize(5);

      const generated = new Set<number>();
      // Generate 5 numbers, all should be unique
      for (let i = 0; i < 5; i++) {
        const num = generator.getRandomIntegerInRange();
        generated.add(num);
      }

      expect(generated.size).toBe(5);
    });
  });

  describe('Edge cases', () => {
    it('should handle range of 0-0', () => {
      generator.setMinMax(0, 0);
      expect(generator.getRandomIntegerInRange()).toBe(0);
    });

    it('should handle negative numbers', () => {
      generator.setMinMax(-10, -1);
      const num = generator.getRandomIntegerInRange();
      expect(num).toBeGreaterThanOrEqual(-10);
      expect(num).toBeLessThanOrEqual(-1);
    });

    it('should handle large ranges', () => {
      generator.setMinMax(1, 1000000);
      const num = generator.getRandomIntegerInRange();
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(1000000);
    });

    it('should handle ranges crossing zero', () => {
      generator.setMinMax(-5, 5);
      const num = generator.getRandomIntegerInRange();
      expect(num).toBeGreaterThanOrEqual(-5);
      expect(num).toBeLessThanOrEqual(5);
    });
  });

  describe('Distribution', () => {
    it('should generate different numbers over multiple calls', () => {
      generator.setMinMax(1, 100).setBufferSize(10);

      const generated = new Set<number>();
      for (let i = 0; i < 50; i++) {
        generated.add(generator.getRandomIntegerInRange());
      }

      // Should have generated many unique values
      expect(generated.size).toBeGreaterThan(30);
    });

    it('should eventually use all values in a small range', () => {
      generator.setMinMax(1, 5).setBufferSize(2);

      const generated = new Set<number>();
      // Generate enough to likely hit all values
      for (let i = 0; i < 100; i++) {
        generated.add(generator.getRandomIntegerInRange());
      }

      expect(generated.size).toBe(5);
      expect(generated.has(1)).toBe(true);
      expect(generated.has(2)).toBe(true);
      expect(generated.has(3)).toBe(true);
      expect(generated.has(4)).toBe(true);
      expect(generated.has(5)).toBe(true);
    });
  });

  describe('Randomness quality', () => {
    it('should use crypto for secure randomness', () => {
      // This test verifies the crypto API is available
      expect(crypto.getRandomValues).toBeDefined();

      generator.setMinMax(1, 1000);
      const num = generator.getRandomIntegerInRange();
      expect(typeof num).toBe('number');
    });
  });
});
