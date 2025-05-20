import { describe, it, expect } from 'vitest';
import { add, subtract } from '@thaitype/core-utils';

describe('math functions', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('subtracts two numbers', () => {
    expect(subtract(5, 2)).toBe(3);
  });
});