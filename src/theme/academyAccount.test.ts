import { describe, expect, it } from 'vitest';
import { resolveAcademyPrefs } from './academyAccount';

describe('Academy account prefs', () => {
  it('reads color and widgets from the profile', () => {
    const resolved = resolveAcademyPrefs({
      academy_neo: 'lima',
      academy_widgets: [
        { id: 'clock', kind: 'clock', size: 'md' },
        { id: 'next', kind: 'next', size: 'sm' },
      ],
    });
    expect(resolved.neo).toBe('lima');
    expect(resolved.widgets?.map(widget => widget.kind)).toEqual(['clock', 'next']);
  });

  it('reads nested settings when the API stores a blob', () => {
    const resolved = resolveAcademyPrefs({
      settings: {
        academy_neo: 'rosa',
        academy_widgets: [{ id: 'agenda', kind: 'agenda', size: 'sm' }],
      },
    });
    expect(resolved.neo).toBe('rosa');
    expect(resolved.widgets?.[0].kind).toBe('agenda');
  });

  it('ignores unknown colorways', () => {
    const resolved = resolveAcademyPrefs({ academy_neo: 'space-black' });
    expect(resolved.neo).toBeNull();
    expect(resolved.widgets).toBeNull();
  });
});
