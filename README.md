# Unique Random Generator

**A perceptual randomizer that makes random sequences *feel* more random by preventing recent repetitions.**

True randomness can feel clustered and repetitive. This utility generates cryptographically random numbers while maintaining a buffer of recent values, ensuring a more natural distribution that humans perceive as "truly random."

## Why?

Pure random number generators can produce jarring repetitions—the same card twice in a row, back-to-back sound effects, or repeated quiz questions. While mathematically random, these patterns feel wrong to users. UniqueRandomGenerator solves this by tracking recently generated values and avoiding them, creating sequences that are both random *and* perceptually smooth.

## Features

- 🎲 Cryptographically secure random generation using Web Crypto API
- 🔄 Configurable history buffer to prevent recent repetitions
- ⛓️ Chainable API for clean, readable code
- 🎯 Perfect for games, quizzes, playlists, and UI variety
- 🪶 Zero dependencies, TypeScript-native

## Quick Start

```typescript
import { UniqueRandomGenerator } from '@/tools/UniqueRandomGenerator';

const gen = new UniqueRandomGenerator()
  .setMinMax(1, 10)
  .setBufferSize(3); // Remember last 3 values

const number = gen.getRandomIntegerInRange(); // Never repeats the last 3 numbers
```

## Installation

```bash
npm install unique-random-generator
```

Or copy the source file directly into your project.

## Usage Examples

### Basic Usage

```typescript
import { UniqueRandomGenerator } from '@/tools/UniqueRandomGenerator';

// Create a generator for dice rolls that doesn't repeat the last 2 rolls
const dice = new UniqueRandomGenerator()
  .setMinMax(1, 6)
  .setBufferSize(2);

console.log(dice.getRandomIntegerInRange()); // e.g., 4
console.log(dice.getRandomIntegerInRange()); // e.g., 2 (not 4)
console.log(dice.getRandomIntegerInRange()); // e.g., 6 (not 2)
```

### Shuffled Deck

```typescript
function createShuffledDeck(numCards: number = 52) {
  const generator = new UniqueRandomGenerator()
    .setMinMax(0, numCards - 1)
    .setBufferSize(numCards); // Remember all cards for complete shuffle
  
  return Array.from({ length: numCards }, () => 
    generator.getRandomIntegerInRange()
  );
}

const deck = createShuffledDeck();
console.log(deck); // All cards, shuffled, no repeats
```

### Sound Effect Randomizer

```typescript
class SoundEffectRandomizer {
  private generator: UniqueRandomGenerator;
  private sounds: string[];
  
  constructor(sounds: string[]) {
    this.sounds = sounds;
    this.generator = new UniqueRandomGenerator()
      .setMinMax(0, sounds.length - 1)
      .setBufferSize(Math.min(3, sounds.length - 1)); // Avoid last 3 sounds
  }
  
  play() {
    const index = this.generator.getRandomIntegerInRange();
    const sound = this.sounds[index];
    console.log(`Playing: ${sound}`);
    return sound;
  }
}

const footsteps = new SoundEffectRandomizer([
  'step1.mp3', 'step2.mp3', 'step3.mp3', 'step4.mp3'
]);

// Natural-sounding footsteps without jarring repeats
for (let i = 0; i < 10; i++) {
  footsteps.play();
}
```

### Quiz Question Selector

```typescript
interface Question {
  id: number;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

class QuizSelector {
  private generator: UniqueRandomGenerator;
  private questions: Question[];
  
  constructor(questions: Question[]) {
    this.questions = questions;
    this.generator = new UniqueRandomGenerator()
      .setMinMax(0, questions.length - 1)
      .setBufferSize(Math.floor(questions.length * 0.75)); // Remember 75% of questions
  }
  
  getNextQuestion(): Question {
    const index = this.generator.getRandomIntegerInRange();
    return this.questions[index];
  }
}
```

## API Reference

### Constructor

```typescript
new UniqueRandomGenerator()
```

Creates a new instance with default settings.

### Methods

#### `setMinMax(min: number, max: number): this`

Sets the range (inclusive) for random number generation.

```typescript
generator.setMinMax(1, 100); // Generate numbers from 1 to 100
```

#### `setMin(min: number): this`

Sets only the minimum value.

```typescript
generator.setMin(0);
```

#### `setMax(max: number): this`

Sets only the maximum value.

```typescript
generator.setMax(99);
```

#### `setBufferSize(size: number): this`

Sets how many recent values to remember and avoid.

```typescript
generator.setBufferSize(5); // Avoid last 5 generated numbers
```

#### `getRandomIntegerInRange(min?: number, max?: number): number`

Generates a random integer that hasn't been recently generated.

```typescript
// Use configured range
const num = generator.getRandomIntegerInRange();

// Override range for this call only
const num2 = generator.getRandomIntegerInRange(1, 10);
```

## How It Works

1. **Cryptographic Randomness**: Uses `window.crypto.getRandomValues()` for secure random generation
2. **Buffer Tracking**: Maintains an internal array of recently generated values
3. **Smart Avoidance**: Regenerates numbers that exist in the buffer until finding a fresh value
4. **Dynamic Adaptation**: Buffer size can be auto-adjusted based on range when not explicitly set

## Best Practices

### Buffer Size Guidelines

- **Strict avoidance**: Set buffer size to 50-75% of your range
- **Natural feeling**: Set buffer size to 20-30% of your range
- **Complete shuffle**: Set buffer size equal to your range
- **Minimal repetition**: Set buffer size to 1-3 for small ranges

### When to Use

✅ **Good for:**
- UI element selection (backgrounds, colors, animations)
- Game mechanics (levels, enemies, power-ups)
- Audio (music playlists, sound effects)
- Content delivery (quiz questions, flashcards)
- Any scenario where perceived randomness matters

❌ **Not ideal for:**
- Cryptographic applications (use pure crypto.getRandomValues)
- Statistical sampling (use unbiased random)
- Security-critical randomness (predictability is introduced by the buffer)

## Performance Notes

- Efficient for typical ranges (hundreds to thousands of values)
- Buffer checking is O(n) where n is buffer size
- For very large ranges with large buffers, consider pre-generating values
- For extreme non-repetition needs, consider Fisher-Yates shuffle instead

## The Philosophy

When used correctly, this increases the *perception* of randomness by aligning random generation with human expectations of variety. True randomness includes clusters and repetitions that feel "broken" to users. By preventing recent repetitions, we create sequences that are both mathematically random and experientially satisfying.

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

---

**Made with ❤️ for better user experiences**
