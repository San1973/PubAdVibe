import { describe, it, expect, vi } from 'vitest';
import { parseVibeScore } from '../gemini'; // adjust path

describe('gemini utilities', () => {
  describe('parseVibeScore', () => {
    it('extracts integer score', () => {
      expect(parseVibeScore('vibe_score: 8.7')).toBe(8.7);
      expect(parseVibeScore('{"vibe_score": 9.2}')).toBe(9.2);
      expect(parseVibeScore('Vibe Score = 7')).toBe(7);
    });

    it('returns 0 when no score found', () => {
      expect(parseVibeScore('no score here')).toBe(0);
      expect(parseVibeScore('vibe: high')).toBe(0);
      expect(parseVibeScore('')).toBe(0);
    });

    it('handles malformed but close JSON-like text', () => {
      expect(parseVibeScore('vibe_score "10.5"')).toBe(10.5);
    });
  });

  // If you extract more pure functions from gemini.ts, test them similarly
});
