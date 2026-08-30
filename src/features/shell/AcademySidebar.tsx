import React from 'react';
import { AcademyMark } from '../../components/AcademyMark';
import { LogOut, UserCog } from '../../icons';
import { ACADEMY_NAV } from './nav';
import { SidebarItem } from './SidebarItem';

interface AcademySidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  setIsSidebarOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  isSidebarOpen: boolean;
  user?: { name?: string; role?: string } | null;
  profile?: { photo_url?: string; name?: string } | null;
  productLabel: string;
  onLogout: () => void;
  showAdmin?: boolean;
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
}: AcademySidebarProps) {
  const firstName = (user?.name || '').replace(/^(Dr\.|Dra\.|Dr|Dra)\s+/i, '').split(' ')[0];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-[110] bg-white border-r border-[#E5E5EA] p-3 tablet-l:p-2.5 desktop:p-4 flex flex-col transition-all duration-300 ease-in-out tablet-l:static tablet-l:translate-x-0 no-print
        ${isSidebarOpen ? 'translate-x-0 w-[272px]' : '-translate-x-full w-[272px] tablet-l:w-[88px] desktop:w-[272px]'}
      `}
    >
      <div className="flex items-center gap-3 px-1 desktop:px-2 mb-7 tablet-l:justify-center desktop:justify-start">
        <AcademyMark size={48} />
        <div className="min-w-0 tablet-l:hidden desktop:block">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary leading-none">
            Academy
          </p>
          <p className="text-[15px] font-extrabold text-academy-text tracking-tight mt-1 truncate">
            Box do aluno
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-2.5 flex-1">
        {ACADEMY_NAV.map(tab => (
          <SidebarItem
            key={tab.id}
            id={tab.id}
            icon={tab.icon}
            label={tab.label}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setIsSidebarOpen={setIsSidebarOpen}
            navigate={navigate}
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

      <div className="mt-4 pt-3 space-y-2">
        <div className="flex items-center gap-3 px-1 desktop:px-2 tablet-l:justify-center desktop:justify-start overflow-hidden">
          <div className="w-10 h-10 rounded-[14px] overflow-hidden bg-[#F2F2F7] flex items-center justify-center text-primary font-extrabold shrink-0 border-2 border-[#E5E5EA]">
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt={profile.name || user?.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              (firstName || 'A').charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 tablet-l:hidden desktop:block">
            <p className="text-[14px] font-extrabold text-academy-text truncate leading-tight">
              {firstName || 'Aluno'}
            </p>
            <p className="text-[11px] font-bold text-primary/70 truncate">Na clínica</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Sair"
          className="duo-btn w-full flex items-center gap-3 rounded-[16px] px-3 py-2.5 text-academy-muted tablet-l:justify-center desktop:justify-start"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="font-extrabold uppercase tracking-[0.12em] text-[12px] tablet-l:hidden desktop:block">
            Sair
          </span>
        </button>

        <p className="hidden desktop:block text-[10px] font-bold text-academy-muted/70 px-2 pt-1">
          {productLabel}
        </p>
      </div>
    </aside>
  );
}

export { ACADEMY_NAV };
