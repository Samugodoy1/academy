import React from 'react';
import { BottomNavItem } from './BottomNavItem';

type TabBarTab = {
  id: string;
  label: string;
  icon: React.ElementType;
};

interface BottomNavProps {
  tabs: TabBarTab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigate: (path: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  navigate,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 tablet-l:hidden no-print pointer-events-none pb-[max(10px,env(safe-area-inset-bottom))] px-3">
      <nav
        className="tab-bar-float pointer-events-auto mx-auto max-w-[420px] flex items-stretch justify-between gap-0.5 px-1.5 py-1.5"
        aria-label="Navegação principal"
      >
        {tabs.map(tab => (
          <BottomNavItem
            key={tab.id}
            id={tab.id}
            icon={tab.icon}
            label={tab.label}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navigate={navigate}
          />
        ))}
      </nav>
    </div>
  );
};
