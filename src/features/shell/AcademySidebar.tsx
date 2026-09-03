import React, { useState } from 'react';
import { AcademyWordmark } from '../../components/AcademyWordmark';
import { AcademyNeoPicker } from '../../components/AcademyNeoPicker';
import { LogOut, UserCog } from '../../icons';
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
  productLabel: string;
  onLogout: () => void;
  showAdmin?: boolean;
  nextBox?: AcademyNextBox | null;
}

export function AcademySidebar({
  activeTab,
  setActiveTab,
  setIsSidebarOpen,
  navigate,
  isSidebarOpen,
  user,
  profile,
  productLabel,
  onLogout,
  showAdmin = false,
  nextBox = null,
}: AcademySidebarProps) {
  const firstName = (user?.name || profile?.name || '').replace(/^(Dr\.|Dra\.|Dr|Dra)\s+/i, '').split(' ')[0];
  const academicLine = [profile?.academic_period, profile?.institution].filter(Boolean).join(' · ');
  const { tabs, pinFirst } = useAcademyNavOrder();
  const [editing, setEditing] = useState(false);

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-[110] bg-transparent p-3 tablet-l:p-2.5 desktop:p-4 flex flex-col transition-all duration-300 ease-in-out tablet-l:static tablet-l:translate-x-0 no-print
        ${isSidebarOpen ? 'translate-x-0 w-[292px]' : '-translate-x-full w-[292px] tablet-l:w-[92px] desktop:w-[292px]'}
      `}
    >
      <div className="flex items-center gap-3 px-1 desktop:px-1 mb-5 tablet-l:justify-center desktop:justify-start">
        <div className="tablet-l:hidden desktop:block">
          <AcademyWordmark />
        </div>
        <div className="hidden tablet-l:block desktop:hidden w-11 h-11 rounded-full overflow-hidden bg-white">
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-[15px] font-semibold text-[var(--neo)]">
              {(firstName || 'A').charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="neo-control-card mb-3 hidden px-4 py-4 desktop:block">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-[var(--neo-soft)] text-[var(--neo)] flex items-center justify-center text-[17px] font-semibold shrink-0">
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt={profile.name || user?.name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              (firstName || 'A').charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] text-[var(--neo-gray)] tracking-[-0.011em]">
              Oi{firstName ? `, ${firstName}` : ''}
            </p>
            <p className="truncate text-[15px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
              {academicLine || 'A sua clínica'}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <AcademyNeoPicker mini />
        </div>
      </div>

      {nextBox && (
        <button
          type="button"
          onClick={() => {
            nextBox.onOpen();
            setIsSidebarOpen(false);
          }}
          className="mb-3 hidden w-full rounded-[24px] bg-[var(--neo)] px-4 py-4 text-left text-white desktop:block"
        >
          <p className="text-[13px] text-white/80">{nextBox.time}</p>
          <p className="mt-0.5 truncate text-[18px] font-semibold tracking-[-0.025em]">{nextBox.patientName}</p>
          {nextBox.procedure && (
            <p className="mt-0.5 truncate text-[13px] text-white/80">{nextBox.procedure}</p>
          )}
        </button>
      )}

      <div className="mb-2 hidden items-center justify-between px-1 desktop:flex">
        <p className="text-[12px] text-[var(--neo-gray)]">A sua central</p>
        <button
          type="button"
          onClick={() => setEditing(value => !value)}
          className="neo-link text-[12px]"
        >
          {editing ? 'Pronto' : 'Personalizar ›'}
        </button>
      </div>
      {editing && (
        <p className="mb-2 hidden px-1 text-[12px] text-[var(--neo-gray)] desktop:block">
          Toque para fixar no topo.
        </p>
      )}

      <nav className="grid grid-cols-1 gap-2 desktop:grid-cols-2 flex-1 content-start">
        {tabs.map(tab => (
          <SidebarItem
            key={tab.id}
            id={tab.id}
            icon={tab.icon}
            label={tab.label}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsSidebarOpen={setIsSidebarOpen}
            navigate={navigate}
            editing={editing}
            onPin={() => pinFirst(tab.id)}
          />
        ))}
        {showAdmin && (
          <SidebarItem
            id="admin"
            icon={UserCog}
            label="Admin"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsSidebarOpen={setIsSidebarOpen}
            navigate={navigate}
          />
        )}
      </nav>

      <div className="mt-3 space-y-2">
        <button
          onClick={onLogout}
          title="Sair"
          className="w-full flex items-center gap-3 rounded-[980px] px-3 py-2.5 text-[var(--neo-gray)] hover:bg-white/70 tablet-l:justify-center desktop:justify-start"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="text-[15px] tablet-l:hidden desktop:block">Sair</span>
        </button>
        <p className="hidden desktop:block text-[11px] text-[var(--neo-gray)] px-2">
          {productLabel}
        </p>
      </div>
    </aside>
  );
}
