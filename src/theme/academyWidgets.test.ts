import { describe, expect, it } from 'vitest';
import {
  addAcademyWidget,
  canAddAcademyWidget,
  cycleAcademyWidgetSize,
  defaultAcademyWidgets,
  moveAcademyWidget,
  parseAcademyWidgets,
  patchAcademyWidget,
  removeAcademyWidget,
  studentGreeting,
} from './academyWidgets';

describe('Academy widgets', () => {
  it('starts with a clock, next box, photo and shortcuts', () => {
    const widgets = defaultAcademyWidgets();
    expect(widgets.map(widget => widget.kind)).toEqual([
      'clock',
      'next',
      'photo',
      'pacientes',
      'agenda',
      'estudos',
      'agendar',
    ]);
    expect(widgets[0].size).toBe('md');
  });

  it('keeps unique widgets unique', () => {
    const widgets = defaultAcademyWidgets();
    expect(canAddAcademyWidget(widgets, 'clock')).toBe(false);
    expect(addAcademyWidget(widgets, 'clock')).toEqual(widgets);
    expect(canAddAcademyWidget(widgets, 'note')).toBe(true);
    expect(addAcademyWidget(widgets, 'note').some(widget => widget.kind === 'note')).toBe(true);
  });

  it('moves a widget like iPad home', () => {
    const widgets = defaultAcademyWidgets();
    const moved = moveAcademyWidget(widgets, 'photo', 'clock');
    expect(moved[0].kind).toBe('photo');
    expect(moved[1].kind).toBe('clock');
  });

  it('cycles photo to a large tile', () => {
    expect(cycleAcademyWidgetSize('sm', 'photo')).toBe('md');
    expect(cycleAcademyWidgetSize('md', 'photo')).toBe('lg');
    expect(cycleAcademyWidgetSize('lg', 'photo')).toBe('sm');
    expect(cycleAcademyWidgetSize('sm', 'agenda')).toBe('md');
  });

  it('patches a recado and drops empty storage', () => {
    const widgets = patchAcademyWidget(defaultAcademyWidgets(), 'photo', { note: 'RX do 38' });
    expect(widgets.find(widget => widget.id === 'photo')?.note).toBe('RX do 38');
    expect(parseAcademyWidgets([])).toEqual([]);
    expect(parseAcademyWidgets([{ id: 'x', kind: 'nope' }])).toBeNull();
    expect(removeAcademyWidget(widgets, 'clock').some(widget => widget.kind === 'clock')).toBe(false);
  });

  it('greets like a student', () => {
    expect(studentGreeting(new Date('2026-09-03T09:00:00'))).toBe('Fala');
    expect(studentGreeting(new Date('2026-09-03T15:00:00'))).toBe('E aí');
    expect(studentGreeting(new Date('2026-09-03T21:00:00'))).toBe('Fechou?');
  });
});
