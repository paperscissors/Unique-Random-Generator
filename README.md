# Unique-Random-Generator

A perceptual randomizer that makes random sequences feel more random by preventing recent repetitions.

## Overview

The Unique Random Generator ensures that recently generated values don't repeat, making random sequences feel more truly random. This is particularly useful in scenarios like:

- Music playlist shuffling
- Game level selection
- Quiz question randomization
- Any application where repeating recent selections feels "not random enough"

## Features

- **Configurable range**: Specify minimum and maximum values for generation
- **History-based uniqueness**: Prevents repetition of recently generated values
- **Adjustable history size**: Control how many recent values to avoid
- **Simple API**: Easy to use with sensible defaults

## Usage

```typescript
import { UniqueRandomGenerator } from './src/UniqueRandomGenerator';

// Create a generator for numbers between 1 and 10
// Avoids repeating the last 3 generated numbers
const generator = new UniqueRandomGenerator(1, 10, 3);

// Generate unique random numbers
const num1 = generator.generate(); // e.g., 5
const num2 = generator.generate(); // Won't be 5
const num3 = generator.generate(); // Won't be 5 or num2
const num4 = generator.generate(); // Won't be 5, num2, or num3
const num5 = generator.generate(); // 5 could appear again now

// Reset the history if needed
generator.reset();

// Check the current history
const history = generator.getHistory();
console.log(history); // Shows recent generated values
```

## API

### Constructor

```typescript
new UniqueRandomGenerator(min: number, max: number, maxHistorySize?: number)
```

- `min`: Minimum value (inclusive)
- `max`: Maximum value (inclusive)
- `maxHistorySize`: Number of recent values to avoid repeating (default: 3)

### Methods

#### `generate(): number`

Generates a random number that hasn't appeared in recent history.

#### `reset(): void`

Clears the history of generated values.

#### `getHistory(): number[]`

Returns an array of recently generated values.

## License

MIT
