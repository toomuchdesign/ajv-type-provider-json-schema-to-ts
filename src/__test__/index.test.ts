import { describe, it, expect } from 'vitest';
import { hello } from '../index';

describe('hello', () => {
  it('returns greeting', () => {
    const actual = hello('world');
    expect(actual).toBe('world');
  });
});
