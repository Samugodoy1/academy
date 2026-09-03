import React, { useEffect, useState } from 'react';
import { CalendarPlus, Home, LogOut, UserCog } from '../../icons';
import { useAcademyNavOrder } from '../../theme/AcademyNavProvider';
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
  openAppointmentModal?: () => void;
}

function dayGreeting(date: Date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
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
  openAppointmentModal,
}: AcademySidebarProps) {
  const firstName = (user?.name || profile?.name || '').replace(/^(Dr\.|Dra\.|Dr|Dra)\s+/i, '').split(' ')[0];
  const fullName = profile?.name || user?.name || 'Conta';
  const { tabs, pinFirst } = useAcademyNavOrder();
  const [editing, setEditing] = useState(false);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setClock(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const timeLabel = clock.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const featured = tabs.find(tab => tab.id === 'dashboard');
  const gridTabs = tabs.filter(tab => tab.id !== 'dashboard' && tab.id !== 'configuracoes');
  const statusLine = nextBox
    ? `Próximo: ${nextBox.patientName} · ${nextBox.time}`
    : 'Agenda livre hoje';

  const goTo = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
    navigate('/');
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-[110] bg-[#f5f5f7] p-3 tablet-l:p-2.5 desktop:p-4 flex flex-col transition-all duration-300 ease-in-out tablet-l:static tablet-l:translate-x-0 no-print
        ${isSidebarOpen ? 'translate-x-0 w-[292px]' : '-translate-x-full w-[292px] tablet-l:w-[92px] desktop:w-[292px]'}
      `}
    >
      <div className="mb-5 px-1 tablet-l:hidden desktop:block">
        <p className="text-[13px] text-[var(--neo-gray)] tracking-[-0.011em]">
          {dayGreeting(clock)}
        </p>
        <p className="mt-0.5 truncate text-[28px] font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--neo-ink)]">
          {firstName || 'Olá'}
        </p>
        <p className="mt-1.5 text-[13px] leading-snug text-[var(--neo-gray)] tracking-[-0.011em]">
          {statusLine}
        </p>
      </div>

      {featured && (
        <button
          type="button"
          onClick={() => {
            if (editing) {
              pinFirst(featured.id);
              return;
            }
            goTo('dashboard');
          }}
          title={featured.label}
          aria-current={activeTab === 'dashboard' ? 'page' : undefined}
          className="neo-control-featured mb-2.5"
        >
          <span className="flex min-w-0 items-center gap-3 tablet-l:justify-center desktop:justify-start">
            <Home size={22} />
            <span className="min-w-0 tablet-l:hidden desktop:block">
              <span className="block text-[15px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
                {featured.label}
              </span>
              <span className="block text-[12px] font-normal text-[var(--neo-gray)]">
                {featured.description}
              </span>
            </span>
          </span>
          <span className="hidden tabular-nums text-[22px] font-semibold tracking-[-0.025em] text-[var(--neo-ink)] desktop:block">
            {timeLabel}
          </span>
        </button>
      )}

      {editing && (
        <p className="mb-2 hidden px-1 text-[12px] text-[var(--neo-gray)] desktop:block">
          Toque para fixar no topo.
        </p>
      )}

      <nav className="grid grid-cols-1 gap-2 content-start desktop:grid-cols-2">
        {gridTabs.map(tab => (
          <SidebarItem
            key={tab.id}
            id={tab.id}
            icon={tab.icon}
            label={tab.label}
            description={tab.description}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsSidebarOpen={setIsSidebarOpen}
            navigate={navigate}
            editing={editing}
            onPin={() => pinFirst(tab.id)}
          />
        ))}
        {openAppointmentModal && (
          <button
            type="button"
            onClick={() => {
              openAppointmentModal();
              setIsSidebarOpen(false);
            }}
            title="Agendar"
            className="neo-control-tile w-full"
          >
            <span className="flex h-7 w-7 items-center justify-center text-[var(--neo-ink)]">
              <CalendarPlus size={22} />
            </span>
            <span className="min-w-0 tablet-l:hidden desktop:block">
              <span className="block text-[15px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
                Agendar
              </span>
              <span className="mt-0.5 block text-[12px] font-normal text-[var(--neo-gray)]">
                Novo horário
              </span>
            </span>
          </button>
        )}
        {showAdmin && (
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
        )}
      </nav>

      <button
        type="button"
        onClick={() => setEditing(value => !value)}
        className="neo-control-personalize mt-3 tablet-l:hidden desktop:block"
      >
        {editing ? 'Pronto' : 'Personalizar'}
      </button>

      <div className="mt-auto space-y-1 pt-4">
        <button
          type="button"
          onClick={() => goTo('configuracoes')}
          title="Conta"
          className={`flex w-full items-center gap-3 rounded-[22px] px-2 py-2 text-left tablet-l:justify-center desktop:justify-start ${activeTab === 'configuracoes' ? 'bg-white' : 'hover:bg-white/80'}`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-[15px] font-semibold text-[var(--neo-ink)]">
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
          <span className="min-w-0 tablet-l:hidden desktop:block">
            <span className="block truncate text-[15px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
              {fullName}
            </span>
            <span className="block text-[12px] text-[var(--neo-gray)]">Conta</span>
          </span>
        </button>
        <button
          type="button"
          onClick={onLogout}
          title="Sair"
          className="flex w-full items-center gap-3 rounded-[980px] px-2 py-2.5 text-[var(--neo-gray)] hover:bg-white/80 tablet-l:justify-center desktop:justify-start"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="text-[15px] tablet-l:hidden desktop:block">Sair</span>
        </button>
      </div>
    </aside>
  );
}
