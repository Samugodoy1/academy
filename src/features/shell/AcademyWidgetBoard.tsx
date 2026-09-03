import React, { useRef, useState } from 'react';
import {
  BookOpen,
  Calendar,
  CalendarPlus,
  Camera,
  Home,
  Plus,
  Users,
  X,
} from '../../icons';
import {
  addAcademyWidget,
  canAddAcademyWidget,
  cycleAcademyWidgetSize,
  moveAcademyWidget,
  patchAcademyWidget,
  persistAcademyWidgets,
  readAcademyWidgets,
  removeAcademyWidget,
  studentGreeting,
  type AcademyWidget,
  type AcademyWidgetKind,
  WASH_WORDS,
  WIDGET_CATALOG,
} from '../../theme/academyWidgets';

interface AcademyWidgetBoardProps {
  editing: boolean;
  activeTab: string;
  firstName?: string;
  clock: Date;
  nextBox?: { time: string; patientName: string; procedure?: string } | null;
  patientCount: number;
  profilePhotoUrl?: string;
  onGo: (tab: string) => void;
  onOpenNext?: () => void;
  onSchedule?: () => void;
}

function compressWidgetImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const max = 720;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('canvas'));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('image'));
    };
    img.src = url;
  });
}

const NAV_ICON: Partial<Record<AcademyWidgetKind, React.ElementType>> = {
  hoje: Home,
  pacientes: Users,
  agenda: Calendar,
  estudos: BookOpen,
  agendar: CalendarPlus,
};

export function AcademyWidgetBoard({
  editing,
  activeTab,
  firstName,
  clock,
  nextBox,
  patientCount,
  profilePhotoUrl,
  onGo,
  onOpenNext,
  onSchedule,
}: AcademyWidgetBoardProps) {
  const [widgets, setWidgets] = useState<AcademyWidget[]>(readAcademyWidgets);
  const [adding, setAdding] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const photoTargetRef = useRef<string | null>(null);
  const dragId = useRef<string | null>(null);

  const commit = (next: AcademyWidget[]) => {
    setWidgets(next);
    persistAcademyWidgets(next);
  };

  const available = WIDGET_CATALOG.filter(item => canAddAcademyWidget(widgets, item.kind));

  const openPhotoPicker = (id: string) => {
    photoTargetRef.current = id;
    photoInputRef.current?.click();
  };

  const onPhotoFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    const target = photoTargetRef.current;
    if (!file || !target) return;
    try {
      const photo = await compressWidgetImage(file);
      commit(patchAcademyWidget(widgets, target, { photo }));
    } catch {
      /* keep previous photo */
    }
  };

  const activate = (widget: AcademyWidget) => {
    if (editing) {
      if (widget.kind === 'photo') {
        openPhotoPicker(widget.id);
        return;
      }
      if (widget.kind === 'note') {
        setEditingNoteId(widget.id);
        return;
      }
      if (widget.kind === 'wash') {
        const current = widget.wash || WASH_WORDS[0];
        const index = WASH_WORDS.indexOf(current as (typeof WASH_WORDS)[number]);
        const nextWord = WASH_WORDS[(index + 1) % WASH_WORDS.length];
        commit(patchAcademyWidget(widgets, widget.id, { wash: nextWord, size: cycleAcademyWidgetSize(widget.size, widget.kind) }));
        return;
      }
      commit(patchAcademyWidget(widgets, widget.id, { size: cycleAcademyWidgetSize(widget.size, widget.kind) }));
      return;
    }

    if (widget.kind === 'clock' || widget.kind === 'hoje') onGo('dashboard');
    else if (widget.kind === 'next') (onOpenNext || (() => onGo('agenda')))();
    else if (widget.kind === 'pacientes') onGo('pacientes');
    else if (widget.kind === 'agenda') onGo('agenda');
    else if (widget.kind === 'estudos') onGo('estudos');
    else if (widget.kind === 'agendar') onSchedule?.();
    else if (widget.kind === 'photo' && !widget.photo) openPhotoPicker(widget.id);
  };

  return (
    <div>
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onPhotoFile}
      />
      <div className="grid grid-cols-2 gap-2">
        {widgets.map(widget => (
          <div
            key={widget.id}
            draggable={editing}
            onDragStart={() => {
              dragId.current = widget.id;
            }}
            onDragOver={event => {
              if (editing) event.preventDefault();
            }}
            onDrop={() => {
              if (!editing || !dragId.current) return;
              commit(moveAcademyWidget(widgets, dragId.current, widget.id));
              dragId.current = null;
            }}
            className={`relative ${widget.size === 'sm' ? '' : 'col-span-2'} ${editing ? 'neo-widget-editing' : ''}`}
          >
            {editing && (
              <button
                type="button"
                aria-label="Remover widget"
                onClick={event => {
                  event.stopPropagation();
                  commit(removeAcademyWidget(widgets, widget.id));
                }}
                className="absolute -left-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-[#8e8e93] text-white"
              >
                <X size={11} />
              </button>
            )}
            <WidgetFace
              widget={widget}
              editing={editing}
              editingNote={editingNoteId === widget.id}
              activeTab={activeTab}
              firstName={firstName}
              clock={clock}
              nextBox={nextBox}
              patientCount={patientCount}
              profilePhotoUrl={profilePhotoUrl}
              onActivate={() => activate(widget)}
              onNoteChange={note => commit(patchAcademyWidget(widgets, widget.id, { note }))}
              onNoteDone={() => setEditingNoteId(null)}
            />
          </div>
        ))}

        {editing && (
          <button
            type="button"
            onClick={() => setAdding(value => !value)}
            className="neo-widget neo-widget-add col-span-2 min-h-[72px]"
          >
            <Plus size={18} />
            Adicionar widget
          </button>
        )}
      </div>

      {editing && adding && available.length > 0 && (
        <div className="mt-2 overflow-hidden rounded-[22px] bg-white p-2">
          {available.map(item => (
            <button
              key={item.kind}
              type="button"
              onClick={() => {
                const next = addAcademyWidget(widgets, item.kind);
                commit(next);
                const added = next[next.length - 1];
                if (item.kind === 'photo' && added) openPhotoPicker(added.id);
                setAdding(false);
              }}
              className="flex w-full items-center justify-between rounded-[16px] px-3 py-2.5 text-left hover:bg-[#f5f5f7]"
            >
              <span>
                <span className="block text-[15px] font-semibold text-[var(--neo-ink)]">{item.label}</span>
                <span className="block text-[12px] text-[var(--neo-gray)]">{item.hint}</span>
              </span>
              <Plus size={16} className="text-[var(--neo)]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function WidgetFace({
  widget,
  editing,
  editingNote,
  activeTab,
  firstName,
  clock,
  nextBox,
  patientCount,
  profilePhotoUrl,
  onActivate,
  onNoteChange,
  onNoteDone,
}: {
  widget: AcademyWidget;
  editing: boolean;
  editingNote: boolean;
  activeTab: string;
  firstName?: string;
  clock: Date;
  nextBox?: { time: string; patientName: string; procedure?: string } | null;
  patientCount: number;
  profilePhotoUrl?: string;
  onActivate: () => void;
  onNoteChange: (note: string) => void;
  onNoteDone: () => void;
}) {
  const timeLabel = clock.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const weekday = clock.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  const Icon = NAV_ICON[widget.kind];
  const sizeClass =
    widget.size === 'lg' ? 'neo-widget neo-widget-lg' : widget.size === 'md' ? 'neo-widget neo-widget-md' : 'neo-widget';

  if (widget.kind === 'clock') {
    return (
      <button type="button" onClick={onActivate} className={`${sizeClass} neo-widget-neo text-left`}>
        <span className="text-[13px] text-white/80">{studentGreeting(clock)}{firstName ? `, ${firstName}` : ''}</span>
        <span className="mt-1 block text-[28px] font-semibold leading-none tracking-[-0.025em] tabular-nums">
          {timeLabel}
        </span>
        <span className="mt-1 hidden text-[12px] text-white/80 desktop:block">
          {weekday} · toca e vai pro hoje
        </span>
      </button>
    );
  }

  if (widget.kind === 'next') {
    return (
      <button type="button" onClick={onActivate} className={`${sizeClass} neo-widget-soft text-left`}>
        <span className="text-[12px] text-[var(--neo)]">{nextBox ? 'Box' : 'Cadeira'}</span>
        <span className="mt-1 block truncate text-[17px] font-semibold tracking-[-0.02em] text-[var(--neo-ink)]">
          {nextBox ? nextBox.patientName.split(' ')[0] : 'Livre'}
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-[var(--neo-ink)]/70">
          {nextBox ? `${nextBox.time}${nextBox.procedure ? ` · ${nextBox.procedure}` : ''}` : 'Nada marcado'}
        </span>
      </button>
    );
  }

  if (widget.kind === 'photo') {
    const src = widget.photo || profilePhotoUrl;
    return (
      <button type="button" onClick={onActivate} className={`${sizeClass} neo-widget-photo`}>
        {src ? (
          <img src={src} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-full min-h-[108px] flex-col items-center justify-center gap-1 bg-[var(--neo-soft)] text-[var(--neo)]">
            <Camera size={22} />
            <span className="text-[12px]">{editing ? 'Manda uma foto' : 'Sua foto'}</span>
          </span>
        )}
      </button>
    );
  }

  if (widget.kind === 'note') {
    return (
      <div className={`${sizeClass} neo-widget-note`}>
        {editingNote ? (
          <textarea
            autoFocus
            value={widget.note || ''}
            maxLength={140}
            placeholder="Recado pro box"
            onChange={event => onNoteChange(event.target.value)}
            onBlur={onNoteDone}
            className="h-full w-full resize-none bg-transparent text-[15px] leading-snug text-[var(--neo-ink)] outline-none"
          />
        ) : (
          <button type="button" onClick={onActivate} className="h-full w-full text-left">
            <span className="text-[12px] text-[var(--neo)]">Recado</span>
            <span className="mt-1 block text-[15px] leading-snug text-[var(--neo-ink)]">
              {widget.note || (editing ? 'Escreve aqui' : 'Nada anotado')}
            </span>
          </button>
        )}
      </div>
    );
  }

  if (widget.kind === 'wash') {
    return (
      <button type="button" onClick={onActivate} className={`${sizeClass} neo-widget-neo items-end`}>
        <span className="text-[26px] font-semibold leading-[0.95] tracking-[-0.025em]">
          {widget.wash || 'Box'}
        </span>
      </button>
    );
  }

  const copy: Record<string, { label: string; meta: string; tone: string }> = {
    hoje: { label: 'Hoje', meta: 'O seu dia', tone: 'neo-widget-white' },
    pacientes: {
      label: 'Casos',
      meta: `${patientCount} na lista`,
      tone: 'neo-widget-wash',
    },
    agenda: { label: 'Agenda', meta: 'Os boxes', tone: 'neo-widget-white' },
    estudos: { label: 'Cola', meta: 'Antes de sentar', tone: 'neo-widget-soft' },
    agendar: { label: 'Encaixar', meta: 'Marca um horário', tone: 'neo-widget-white' },
  };
  const item = copy[widget.kind] || copy.hoje;
  const active = widget.kind === 'hoje' ? activeTab === 'dashboard' : activeTab === widget.kind;

  return (
    <button
      type="button"
      onClick={onActivate}
      className={`${sizeClass} ${item.tone} ${active ? 'neo-widget-active' : ''} text-left`}
    >
      {Icon && (
        <span className="flex h-7 w-7 items-center justify-center text-[var(--neo)]">
          <Icon size={22} />
        </span>
      )}
      <span className="min-w-0 tablet-l:hidden desktop:block">
        <span className="block text-[15px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
          {item.label}
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-[var(--neo-gray)]">{item.meta}</span>
      </span>
    </button>
  );
}
