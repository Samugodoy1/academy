import { describe, expect, it } from 'vitest';
import {
  chooseAcademyNeo,
  chooseAcademyWidgets,
  embedAcademyPrefsInBio,
  parseAcademyPrefsEnvelope,
  prefsFromUnknown,
  resolveAcademyPrefs,
  stripAcademyPrefsEnvelope,
} from './academyAccount';
import { parseAcademyWidgets } from './academyWidgets';

describe('Academy account prefs', () => {
  it('reads color and widgets from the profile', () => {
    const resolved = resolveAcademyPrefs({
      academy_neo: 'green',
      academy_widgets: [
        { id: 'clock', kind: 'clock', size: 'md' },
        { id: 'next', kind: 'next', size: 'sm' },
      ],
    });
    expect(resolved.neo).toBe('green');
    expect(resolved.widgets?.map(widget => widget.kind)).toEqual(['clock', 'next']);
  });

  it('reads nested settings when the API stores a blob', () => {
    const resolved = resolveAcademyPrefs({
      settings: {
        academy_neo: 'pink',
        academy_widgets: [{ id: 'agenda', kind: 'agenda', size: 'sm' }],
      },
    });
    expect(resolved.neo).toBe('pink');
    expect(resolved.widgets?.[0].kind).toBe('agenda');
  });

  it('round-trips color, widgets and photo URL through the profile bio the API already saves', () => {
    const widgets = [
      { id: 'clock', kind: 'clock' as const, size: 'md' as const },
      { id: 'photo', kind: 'photo' as const, size: 'sm' as const, photo: 'https://res.cloudinary.com/odontohub/image/upload/widget.jpg' },
    ];
    const bio = embedAcademyPrefsInBio('texto visivel', {
      academy_neo: 'purple',
      academy_widgets: widgets,
    });
    expect(stripAcademyPrefsEnvelope(bio)).toBe('texto visivel');
    expect(parseAcademyPrefsEnvelope(bio).neo).toBe('purple');
    expect(parseAcademyPrefsEnvelope(bio).widgets?.map(widget => widget.kind)).toEqual(['clock', 'photo']);
    expect(parseAcademyPrefsEnvelope(bio).widgets?.find(widget => widget.kind === 'photo')?.photo).toContain('cloudinary');

    const resolved = resolveAcademyPrefs({ bio });
    expect(resolved.neo).toBe('purple');
    expect(resolved.widgets?.find(widget => widget.kind === 'photo')?.photo).toBe(
      'https://res.cloudinary.com/odontohub/image/upload/widget.jpg',
    );
  });

  it('keeps https widget photos when parsing', () => {
    const parsed = parseAcademyWidgets([
      { id: 'photo', kind: 'photo', size: 'sm', photo: 'https://res.cloudinary.com/odontohub/image/upload/widget.jpg' },
    ]);
    expect(parsed?.[0].photo).toMatch(/^https:\/\//);
  });

  it('keeps the widget photo inside the profile envelope', () => {
    const photo = 'data:image/jpeg;base64,/9j/4AAQ';
    const bio = embedAcademyPrefsInBio('', {
      academy_neo: 'green',
      academy_widgets: [{ id: 'photo', kind: 'photo', size: 'sm', photo }],
    });
    expect(parseAcademyPrefsEnvelope(bio).widgets?.[0].photo).toBe(photo);
    expect(resolveAcademyPrefs({ bio }).widgets?.[0].photo).toBe(photo);
    expect(resolveAcademyPrefs({ clinic_address: bio }).widgets?.[0].photo).toBe(photo);
  });

  it('ignores unknown colorways', () => {
    const resolved = resolveAcademyPrefs({ academy_neo: 'space-black' });
    expect(resolved.neo).toBeNull();
    expect(resolved.widgets).toBeNull();
  });

  it('uses the color saved on the account, not the one left by another login', () => {
    expect(chooseAcademyNeo('orange', 'pink')).toEqual({ id: 'orange', pushLocal: false });
    expect(chooseAcademyNeo('pink', 'blue')).toEqual({ id: 'pink', pushLocal: false });
    expect(chooseAcademyNeo('blue', 'green')).toEqual({ id: 'green', pushLocal: true });
    expect(chooseAcademyNeo(null, 'green')).toEqual({ id: 'green', pushLocal: false });
  });

  it('keeps a local widget board when the server has none', () => {
    const local = [
      { id: 'clock', kind: 'clock' as const, size: 'md' as const },
      { id: 'base', kind: 'base' as const, size: 'sm' as const },
    ];
    const chosen = chooseAcademyWidgets([], null, local, []);
    expect(chosen.widgets.map(widget => widget.kind)).toEqual(['clock', 'base']);
    expect(chosen.pushLocal).toBe(true);
    expect(chooseAcademyWidgets(local, null, local, []).pushLocal).toBe(false);
  });

  it('uses the server board on a device that never arranged widgets', () => {
    const remote = [{ id: 'agenda', kind: 'agenda' as const, size: 'sm' as const }];
    const chosen = chooseAcademyWidgets(remote, null, null, []);
    expect(chosen.widgets).toEqual(remote);
    expect(chosen.pushLocal).toBe(false);
  });

  it('reads the dedicated /api/academy/prefs payload', () => {
    const prefs = prefsFromUnknown({
      academy_neo: 'blue',
      academy_widgets: [{ id: 'clock', kind: 'clock', size: 'md' }],
    });
    expect(prefs?.academy_neo).toBe('blue');
    expect(prefs?.academy_widgets).toHaveLength(1);
    expect(prefsFromUnknown({})).toBeNull();
  });
});
