/**
 * @packageDocumentation
 * A perceptual randomizer that makes random sequences feel more random by preventing recent repetitions.
 *
 * @example
 * ```typescript
 * import { UniqueRandomGenerator } from '@paperscissors/unique-random-generator';
 *
 * const generator = new UniqueRandomGenerator()
 *   .setMinMax(1, 10)
 *   .setBufferSize(3);
 *
 * const randomNumber = generator.getRandomIntegerInRange();
 * ```
 */

export { UniqueRandomGenerator } from './UniqueRandomGenerator';
export { UniqueRandomGenerator as default } from './UniqueRandomGenerator';
