import { describe, expect, it } from 'vitest';
import { emptyReviewState, gradeReviewCard, scheduleAfterSession, dueCards } from './review';

describe('review scheduling', () => {
  it('schedules after confident session with longer interval', () => {
    const base = emptyReviewState();
    const next = scheduleAfterSession(base, 'ad-notacao', 'confident', new Date('2026-01-01T12:00:00Z'));
    expect(next.cards['ad-notacao'].intervalDays).toBeGreaterThanOrEqual(1);
    expect(next.cards['ad-notacao'].streak).toBe(1);
  });

  it('dueCards includes cards at or before now', () => {
    const state = scheduleAfterSession(emptyReviewState(), 'x', 'review', new Date('2026-01-01T12:00:00Z'));
    const due = dueCards(state, new Date('2026-01-02T12:00:00Z'));
    expect(due.some(c => c.lessonId === 'x')).toBe(true);
  });

  it('gradeReviewCard resets streak on miss', () => {
    let state = scheduleAfterSession(emptyReviewState(), 'y', 'confident', new Date('2026-01-01T12:00:00Z'));
    state = gradeReviewCard(state, 'y', false, new Date('2026-01-02T12:00:00Z'));
    expect(state.cards['y'].streak).toBe(0);
  });
});
