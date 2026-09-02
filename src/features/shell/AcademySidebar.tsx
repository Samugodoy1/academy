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
        fixed inset-y-0 left-0 z-[110] bg-white border-r border-apple-line p-3 tablet-l:p-2.5 desktop:p-4 flex flex-col transition-all duration-300 ease-in-out tablet-l:static tablet-l:translate-x-0 no-print
        ${isSidebarOpen ? 'translate-x-0 w-[272px]' : '-translate-x-full w-[272px] tablet-l:w-[88px] desktop:w-[272px]'}
      `}
    >
      <div className="flex items-center gap-3 px-1 desktop:px-2 mb-8 tablet-l:justify-center desktop:justify-start">
        <AcademyMark size={36} />
        <div className="min-w-0 tablet-l:hidden desktop:block">
          <p className="text-[12px] font-normal tracking-[-0.011em] text-apple-gray leading-none">
            Academy
          </p>
          <p className="text-[17px] font-semibold text-apple-ink tracking-[-0.025em] leading-[1.05] mt-1 truncate">
            OdontoHub
          </p>
        </div>
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
          <div className="w-9 h-9 rounded-full overflow-hidden bg-apple-surface flex items-center justify-center text-apple-ink text-[15px] font-semibold shrink-0">
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
            <p className="text-[15px] font-semibold text-apple-ink truncate leading-tight tracking-[-0.016em]">
              {firstName || 'Aluno'}
            </p>
            <p className="text-[12px] font-normal text-apple-gray truncate">Na clínica</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          title="Sair"
          className="w-full flex items-center gap-3 rounded-[980px] px-3 py-2.5 text-apple-gray hover:bg-apple-surface tablet-l:justify-center desktop:justify-start"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="text-[15px] tablet-l:hidden desktop:block">
            Sair
          </span>
        </button>

        <p className="hidden desktop:block text-[11px] text-apple-gray/80 px-2 pt-1">
          {productLabel}
        </p>
      </div>
    </aside>
  );
}

export { ACADEMY_NAV };
