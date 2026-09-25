import React, { useEffect, useState } from 'react';
import { LogOut, UserCog } from '../../icons';
import { studentGreeting } from '../../theme/academyWidgets';
import { AcademyWidgetBoard } from './AcademyWidgetBoard';
import { AcademyDock } from './AcademyDock';
import { SidebarItem } from './SidebarItem';

export interface AcademyNextBox {
  time: string;
  patientName: string;
  procedure?: string;
  onOpen: () => void;
}

interface AcademySidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  setIsSidebarOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  isSidebarOpen: boolean;
  user?: { name?: string; role?: string } | null;
  profile?: {
    photo_url?: string;
    name?: string;
    academic_period?: string;
    institution?: string;
  } | null;
  productLabel?: string;
  onLogout: () => void;
  showAdmin?: boolean;
  nextBox?: AcademyNextBox | null;
  patientCount?: number;
  openAppointmentModal?: () => void;
  initialEditing?: boolean;
}

export function AcademySidebar({
  activeTab,
  setActiveTab,
  setIsSidebarOpen,
  navigate,
  isSidebarOpen,
  user,
  profile,
  onLogout,
  showAdmin = false,
  nextBox = null,
  patientCount = 0,
  openAppointmentModal,
  initialEditing = false,
}: AcademySidebarProps) {
  const firstName = (user?.name || profile?.name || '').replace(/^(Dr\.|Dra\.|Dr|Dra)\s+/i, '').split(' ')[0];
  const fullName = profile?.name || user?.name || 'Conta';
  const [editing, setEditing] = useState(initialEditing);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setClock(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const statusLine = nextBox
    ? `Box às ${nextBox.time} · ${nextBox.patientName.split(' ')[0]}`
    : 'Cadeira livre';

  const goTo = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    navigate('/');
  };

  return (
    <>
    <aside
      className={`
        fixed inset-y-0 left-0 z-[110] flex w-[292px] flex-col bg-[#f5f5f7] p-4 transition-all duration-300 ease-in-out no-print
        tablet-l:static tablet-l:translate-x-0 tablet-l:w-[292px] desktop:w-[300px]
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full tablet-l:translate-x-0'}
      `}
    >
      <div className="mb-4 px-1">
        <p className="text-[13px] tracking-[-0.011em] text-[var(--neo)]">
          {studentGreeting(clock)}
        </p>
        <p className="mt-0.5 truncate text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)]">
          {firstName || 'você'}
        </p>
        <p className="mt-1.5 text-[13px] leading-snug tracking-[-0.011em] text-[var(--neo-gray)]">
          {statusLine}
        </p>
      </div>

      {editing && (
        <p className="mb-3 px-1 text-[12px] leading-snug text-[var(--neo-gray)]">
          Arrasta pra mudar. Toca pra tamanho. Tira o que não usa.
        </p>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <AcademyWidgetBoard
          editing={editing}
          firstName={firstName}
          clock={clock}
          nextBox={nextBox}
          patientCount={patientCount}
          profilePhotoUrl={profile?.photo_url}
          onGo={goTo}
          onOpenNext={nextBox?.onOpen}
          onSchedule={() => {
            openAppointmentModal?.();
            setIsSidebarOpen(false);
          }}
        />

        {showAdmin && (
          <div className="mt-2">
            <SidebarItem
              id="admin"
              icon={UserCog}
              label="Admin"
              description="Painel"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsSidebarOpen={setIsSidebarOpen}
              navigate={navigate}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setEditing(value => !value)}
        className="mt-3 w-full py-2 text-center text-[13px] tracking-[-0.011em] text-[var(--neo)]"
      >
        {editing ? 'Pronto' : 'Personalizar'}
      </button>

      <div className="mt-3 space-y-0.5">
        <button
          type="button"
          onClick={() => goTo('configuracoes')}
          title="Conta"
          className={`flex w-full items-center gap-3 rounded-[22px] px-2 py-2 text-left ${
            activeTab === 'configuracoes' ? 'bg-white' : 'hover:bg-white/80'
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--neo-soft)] text-[14px] font-semibold text-[var(--neo)]">
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt=""
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              (firstName || 'A').charAt(0).toUpperCase()
            )}
          </div>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
              {fullName}
            </span>
            <span className="block text-[12px] text-[var(--neo-gray)]">Você</span>
          </span>
        </button>
        <button
          type="button"
          onClick={onLogout}
          title="Sair"
          className="flex w-full items-center gap-3 rounded-[980px] px-2 py-2 text-[var(--neo-gray)] hover:bg-white/80"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="text-[15px]">Sair</span>
        </button>
      </div>
    </aside>
    <AcademyDock
      activeTab={activeTab}
      onGo={goTo}
      onSchedule={() => {
        openAppointmentModal?.();
        setIsSidebarOpen(false);
      }}
    />
    </>
  );
}
