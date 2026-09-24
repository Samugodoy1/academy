export type PresenceStatus = 'online' | 'recent' | 'away' | 'offline' | 'never';

export function presenceFromLastSeen(lastSeenAt: string | null | undefined): PresenceStatus {
  if (!lastSeenAt) return 'never';
  const diffMs = Date.now() - new Date(lastSeenAt).getTime();
  const diffMin = diffMs / (1000 * 60);
  if (diffMin <= 5) return 'online';
  if (diffMin <= 60 * 24) return 'recent';
  if (diffMin <= 60 * 24 * 7) return 'away';
  return 'offline';
}

export const PRESENCE_LABELS: Record<PresenceStatus, string> = {
  online: 'Online agora',
  recent: 'Ativo hoje',
  away: 'Esta semana',
  offline: 'Inativo',
  never: 'Nunca entrou',
};

export const PRESENCE_DOT: Record<PresenceStatus, string> = {
  online: 'bg-emerald-500 ring-emerald-500/30',
  recent: 'bg-sky-500 ring-sky-500/30',
  away: 'bg-amber-500 ring-amber-500/30',
  offline: 'bg-slate-300 ring-slate-300/30',
  never: 'bg-slate-200 ring-slate-200/30',
};
