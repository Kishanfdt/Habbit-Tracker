import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './api';

describe('api getErrorMessage', () => {
  it('should return message from Error instance', () => {
    const error = new Error('Test error message');
    expect(getErrorMessage(error)).toBe('Test error message');
  });

  it('should return fallback message for unknown error', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred');
  });
});
