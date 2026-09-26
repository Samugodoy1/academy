export const ACADEMY_WIDGETS_KEY = 'odontohub-academy-widgets-v2';

export const ACADEMY_WIDGET_KINDS = [
  'clock',
  'next',
  'hoje',
  'pacientes',
  'agenda',
  'estudos',
  'base',
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
  'base',
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
  { kind: 'base', label: 'Estudos', hint: 'Ciclo básico', defaultSize: 'sm' },
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

export function isAcademyWidgetPhoto(value: string) {
  if (!value) return false;
  if (value.startsWith('data:image')) return value.length < 1_500_000;
  return /^https?:\/\//i.test(value);
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
    if (typeof record.photo === 'string' && isAcademyWidgetPhoto(record.photo)) widget.photo = record.photo;
    if (typeof record.note === 'string') widget.note = record.note.slice(0, 140);
    if (typeof record.wash === 'string') widget.wash = record.wash.slice(0, 24);
    widgets.push(widget);
  }
  return widgets.length > 0 ? widgets : null;
}

export function readExplicitAcademyWidgets(): AcademyWidget[] | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(ACADEMY_WIDGETS_KEY);
  if (raw == null) return null;
  try {
    return parseAcademyWidgets(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function readAcademyWidgets(): AcademyWidget[] {
  return readExplicitAcademyWidgets() || defaultAcademyWidgets();
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

export function homeGreeting(
  date: Date,
  situation: {
    focusKind: string;
    pendingCount: number;
    patientFirstName?: string | null;
    userName?: string;
    patientCount: number;
  },
) {
  const you = situation.userName ? `, ${situation.userName}` : '';
  const who = situation.patientFirstName;

  if (situation.focusKind === 'evolution' || situation.pendingCount > 0) {
    const count = Math.max(situation.pendingCount, situation.focusKind === 'evolution' ? 1 : 0);
    return count > 1 ? `${count} atendimentos pra fechar${you}` : `Tem atendimento pra fechar${you}`;
  }
  if (situation.focusKind === 'today' && who) return `${who} te espera agora${you}`;
  if (situation.focusKind === 'next' && who) return `Próximo box com ${who}${you}`;
  if (situation.focusKind === 'paused') return `Um caso parado pede retorno${you}`;
  if (situation.focusKind === 'pending') return `Falta um dado no prontuário${you}`;
  if (situation.focusKind === 'study') {
    const hour = date.getHours();
    if (hour < 12) return `Bom dia pra um resumo${you}`;
    if (hour < 18) return `Boa hora de estudar${you}`;
    return `Um resumo antes de encerrar${you}`;
  }
  if (situation.focusKind === 'start' || situation.patientCount === 0) {
    return `O primeiro caso ainda não chegou${you}`;
  }
  const hour = date.getHours();
  if (hour < 12) return `Bom dia${you}. Cadeira livre`;
  if (hour < 18) return `Boa tarde${you}. Cadeira livre`;
  return `Boa noite${you}. Nada pendente`;
}
