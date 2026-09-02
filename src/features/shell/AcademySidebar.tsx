import React from 'react';
import { AcademyWordmark } from '../../components/AcademyWordmark';
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
        fixed inset-y-0 left-0 z-[110] bg-black border-r border-white/10 p-3 tablet-l:p-2.5 desktop:p-4 flex flex-col transition-all duration-300 ease-in-out tablet-l:static tablet-l:translate-x-0 no-print
        ${isSidebarOpen ? 'translate-x-0 w-[272px]' : '-translate-x-full w-[272px] tablet-l:w-[88px] desktop:w-[272px]'}
      `}
    >
      <div className="flex items-center gap-3 px-1 desktop:px-2 mb-8 tablet-l:justify-center desktop:justify-start">
        <div className="tablet-l:hidden desktop:block">
          <AcademyWordmark invert />
        </div>
        <div className="hidden tablet-l:block desktop:hidden w-8 h-8 rounded-full bg-[#1d1d1f]" style={{ boxShadow: 'inset 0 0 0 2px var(--academy-accent)' }} />
      </div>

      <nav className="flex flex-col gap-1 flex-1">
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
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1d1d1f] flex items-center justify-center text-white text-[15px] font-semibold shrink-0">
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
            <p className="text-[15px] font-semibold text-white truncate leading-tight tracking-[-0.016em]">
              {firstName || 'Aluno'}
            </p>
            <p className="text-[12px] font-normal text-[#86868b] truncate">Na clínica</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Sair"
          className="w-full flex items-center gap-3 rounded-[980px] px-3 py-2.5 text-[#86868b] hover:bg-[#1d1d1f] tablet-l:justify-center desktop:justify-start"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="text-[15px] tablet-l:hidden desktop:block">
            Sair
          </span>
        </button>

        <p className="hidden desktop:block text-[11px] text-[#86868b]/80 px-2 pt-1">
          {productLabel}
        </p>
      </div>
    </aside>
  );
}

export { ACADEMY_NAV };
