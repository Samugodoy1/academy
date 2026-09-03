export const ACADEMY_WIDGETS_KEY = 'odontohub-academy-widgets-v2';

export const ACADEMY_WIDGET_KINDS = [
  'clock',
  'next',
  'hoje',
  'pacientes',
  'agenda',
  'estudos',
  'agendar',
  'photo',
  'note',
  'wash',
] as const;

export type AcademyWidgetKind = (typeof ACADEMY_WIDGET_KINDS)[number];
export type AcademyWidgetSize = 'sm' | 'md' | 'lg';

export interface AcademyWidget {
  id: string;
  kind: AcademyWidgetKind;
  size: AcademyWidgetSize;
  photo?: string;
  note?: string;
  wash?: string;
}

export const UNIQUE_WIDGET_KINDS: AcademyWidgetKind[] = [
  'clock',
  'next',
  'hoje',
  'pacientes',
  'agenda',
  'estudos',
  'agendar',
];

export const WIDGET_CATALOG: Array<{
  kind: AcademyWidgetKind;
  label: string;
  hint: string;
  defaultSize: AcademyWidgetSize;
}> = [
  { kind: 'clock', label: 'Relógio', hint: 'Hora e um oi', defaultSize: 'md' },
  { kind: 'next', label: 'Próximo box', hint: 'Quem vem agora', defaultSize: 'sm' },
  { kind: 'hoje', label: 'Hoje', hint: 'A home', defaultSize: 'sm' },
  { kind: 'pacientes', label: 'Casos', hint: 'Sua lista', defaultSize: 'sm' },
  { kind: 'agenda', label: 'Agenda', hint: 'Os boxes', defaultSize: 'sm' },
  { kind: 'estudos', label: 'Cola', hint: 'Antes de sentar', defaultSize: 'sm' },
  { kind: 'agendar', label: 'Encaixar', hint: 'Marca um horário', defaultSize: 'sm' },
  { kind: 'photo', label: 'Foto', hint: 'Uma foto sua', defaultSize: 'sm' },
  { kind: 'note', label: 'Recado', hint: 'Lembrete do box', defaultSize: 'sm' },
  { kind: 'wash', label: 'Cor', hint: 'Só estética', defaultSize: 'sm' },
];

export const WASH_WORDS = ['Box', 'Foco', 'Cadeira', 'Academy'] as const;

export function defaultAcademyWidgets(): AcademyWidget[] {
  return [
    { id: 'clock', kind: 'clock', size: 'md' },
    { id: 'next', kind: 'next', size: 'sm' },
    { id: 'photo', kind: 'photo', size: 'sm' },
    { id: 'pacientes', kind: 'pacientes', size: 'sm' },
    { id: 'agenda', kind: 'agenda', size: 'sm' },
  ];
}

export function isAcademyWidgetKind(value: string): value is AcademyWidgetKind {
  return (ACADEMY_WIDGET_KINDS as readonly string[]).includes(value);
}

export function isAcademyWidgetSize(value: string): value is AcademyWidgetSize {
  return value === 'sm' || value === 'md' || value === 'lg';
}

export function parseAcademyWidgets(raw: unknown): AcademyWidget[] | null {
  if (!Array.isArray(raw)) return null;
  if (raw.length === 0) return [];
  const widgets: AcademyWidget[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    if (typeof record.id !== 'string' || !record.id) continue;
    if (typeof record.kind !== 'string' || !isAcademyWidgetKind(record.kind)) continue;
    const size = typeof record.size === 'string' && isAcademyWidgetSize(record.size) ? record.size : 'sm';
    const widget: AcademyWidget = { id: record.id, kind: record.kind, size };
    if (typeof record.photo === 'string' && record.photo.startsWith('data:image')) widget.photo = record.photo;
    if (typeof record.note === 'string') widget.note = record.note.slice(0, 140);
    if (typeof record.wash === 'string') widget.wash = record.wash.slice(0, 24);
    widgets.push(widget);
  }
  return widgets.length > 0 ? widgets : null;
}

export function readAcademyWidgets(): AcademyWidget[] {
  if (typeof localStorage === 'undefined') return defaultAcademyWidgets();
  try {
    const parsed = parseAcademyWidgets(JSON.parse(localStorage.getItem(ACADEMY_WIDGETS_KEY) || 'null'));
    return parsed || defaultAcademyWidgets();
  } catch {
    return defaultAcademyWidgets();
  }
}

export function persistAcademyWidgets(widgets: AcademyWidget[]) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(ACADEMY_WIDGETS_KEY, JSON.stringify(widgets));
}

export function createAcademyWidget(kind: AcademyWidgetKind, extras: Partial<AcademyWidget> = {}): AcademyWidget {
  const catalog = WIDGET_CATALOG.find(item => item.kind === kind);
  return {
    id: `${kind}-${Date.now().toString(36)}`,
    kind,
    size: extras.size || catalog?.defaultSize || 'sm',
    ...extras,
  };
}

export function canAddAcademyWidget(widgets: AcademyWidget[], kind: AcademyWidgetKind) {
  if (!UNIQUE_WIDGET_KINDS.includes(kind)) return true;
  return !widgets.some(widget => widget.kind === kind);
}

export function addAcademyWidget(widgets: AcademyWidget[], kind: AcademyWidgetKind): AcademyWidget[] {
  if (!canAddAcademyWidget(widgets, kind)) return widgets;
  return [...widgets, createAcademyWidget(kind)];
}

export function removeAcademyWidget(widgets: AcademyWidget[], id: string): AcademyWidget[] {
  return widgets.filter(widget => widget.id !== id);
}

export function moveAcademyWidget(widgets: AcademyWidget[], fromId: string, toId: string): AcademyWidget[] {
  if (fromId === toId) return widgets;
  const from = widgets.findIndex(widget => widget.id === fromId);
  const to = widgets.findIndex(widget => widget.id === toId);
  if (from < 0 || to < 0) return widgets;
  const next = [...widgets];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function cycleAcademyWidgetSize(size: AcademyWidgetSize, kind: AcademyWidgetKind): AcademyWidgetSize {
  if (kind === 'photo' || kind === 'wash') {
    if (size === 'sm') return 'md';
    if (size === 'md') return 'lg';
    return 'sm';
  }
  return size === 'sm' ? 'md' : 'sm';
}

export function patchAcademyWidget(
  widgets: AcademyWidget[],
  id: string,
  patch: Partial<AcademyWidget>,
): AcademyWidget[] {
  return widgets.map(widget => (widget.id === id ? { ...widget, ...patch } : widget));
}

export function studentGreeting(date: Date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Fala';
  if (hour < 18) return 'E aí';
  return 'Fechou?';
}
