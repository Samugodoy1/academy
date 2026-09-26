import { describe, expect, it } from 'vitest';
import { weakestStudyFocus } from './weakStudy';
import type { GameState } from './types';

const memory = (attempts: number, correct: number) => ({
  attempts,
  correct,
  streak: 0,
  lastSeenAt: 0,
  dueAt: 0,
});

describe('weakest study focus', () => {
  it('picks the subject with the most wrong answers', () => {
    const focus = weakestStudyFocus({
      mistakes: [],
      exerciseMemory: {
        'dent-01': memory(4, 1),
        'anest-01': memory(4, 3),
      },
    } as Pick<GameState, 'exerciseMemory' | 'mistakes'>);
    expect(focus?.topic).toBe('dentistica');
    expect(focus?.wrong).toBe(3);
  });

  it('returns null when nothing was missed', () => {
    expect(weakestStudyFocus({
      mistakes: [],
      exerciseMemory: { 'dent-01': memory(2, 2) },
    } as Pick<GameState, 'exerciseMemory' | 'mistakes'>)).toBeNull();
  });
});
