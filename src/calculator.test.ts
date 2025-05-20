import { test, expect } from 'vitest';
import { add } from './calculator.js';

test('libs', () => {
  expect(add(1, 2)).toBe(3);
});
