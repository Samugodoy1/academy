import { describe, expect, it } from 'vitest';
import { planPhoneNotifications } from './plan';

const now = new Date(2026, 8, 24, 15, 0, 0);

describe('phone notifications', () => {
  it('reminds the daily question at 19:00 and names the streak when it is at risk', () => {
    const open = planPhoneNotifications({
      now,
      study: { streak: 0, goalReached: false, lastDay: null, today: '2026-09-24' },
      appointments: [],
    });
    expect(open).toHaveLength(1);
    expect(open[0].title).toBe('Questão do dia');
    expect(new Date(open[0].at).getHours()).toBe(19);

    const streak = planPhoneNotifications({
      now,
      study: { streak: 4, goalReached: false, lastDay: '2026-09-23', today: '2026-09-24' },
      appointments: [],
    });
    expect(streak[0].title).toBe('Ofensiva');
    expect(streak[0].body).toContain('4 dias');
  });

  it('stays quiet after the question of the day is done', () => {
    expect(planPhoneNotifications({
      now,
      study: { streak: 4, goalReached: true, lastDay: '2026-09-24', today: '2026-09-24' },
      appointments: [],
    })).toEqual([]);
  });

  it('warns one hour before a scheduled visit inside the next two days', () => {
    const start = new Date(2026, 8, 24, 18, 30, 0).getTime();
    const items = planPhoneNotifications({
      now,
      study: { streak: 1, goalReached: true, lastDay: '2026-09-24', today: '2026-09-24' },
      appointments: [
        { id: 7, patientName: 'Ana Lima', startMs: start, status: 'CONFIRMED' },
        { id: 8, patientName: 'Cancelado', startMs: start, status: 'CANCELLED' },
        { id: 9, patientName: 'Longe', startMs: now.getTime() + 3 * 24 * 60 * 60 * 1000, status: 'SCHEDULED' },
      ],
    });
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('Atendimento às 18:30');
    expect(items[0].body).toBe('Ana Lima');
    expect(items[0].at).toBe(start - 60 * 60 * 1000);
  });
});
