import React from 'react';
import { useAcademyNavOrder } from '../../theme/AcademyNavProvider';
import { BottomNavItem } from './BottomNavItem';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigate: (path: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  navigate,
}) => {
  const { tabs } = useAcademyNavOrder();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 tablet-l:hidden no-print px-3 pb-[max(10px,env(safe-area-inset-bottom))]">
      <nav
        className="tab-bar-liquid pointer-events-auto flex items-stretch justify-between px-1.5"
        aria-label="Navegação principal"
      >
        {tabs.map(tab => (
          <BottomNavItem
            key={tab.id}
            id={tab.id}
            icon={tab.icon}
            label={tab.short}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navigate={navigate}
          />
        ))}
      </nav>
    </div>
  );
};
