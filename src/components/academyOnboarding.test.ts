import { describe, expect, it } from 'vitest';
import { ACADEMY_TOUR } from './academyOnboarding';

describe('Academy onboarding tour', () => {
  it('presents clinic, cola and the game — not only patient signup', () => {
    const blob = ACADEMY_TOUR.map(slide => `${slide.kicker} ${slide.title} ${slide.body}`).join(' ').toLowerCase();
    expect(blob).toMatch(/clínica|clinica/);
    expect(blob).toContain('cola');
    expect(blob).toMatch(/jogo|jogando/);
    expect(blob).toContain('prontuário');
    expect(blob).toContain('odontohub');
  });

  it('opens with the product, not a form instruction', () => {
    expect(ACADEMY_TOUR[0].title.toLowerCase()).not.toContain('cadastr');
    expect(ACADEMY_TOUR[0].kicker).toBe('OdontoHub Academy');
  });
});
