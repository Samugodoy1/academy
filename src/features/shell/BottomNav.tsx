import React from 'react';
import { useAcademyNavOrder } from '../../theme/AcademyNavProvider';
import { BottomNavItem } from './BottomNavItem';
import { StudentMark } from './StudentMark';
import { ColaNudgeChip } from '../game/ColaNudgeChip';
import type { GamePlan } from '../game/plan';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigate: (path: string) => void;
  studentActive?: boolean;
  onSubscribe?: () => void;
  gamePlan?: GamePlan;
  onOpenCola?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  navigate,
  studentActive = false,
  onSubscribe,
  gamePlan,
  onOpenCola,
}) => {
  const { tabs } = useAcademyNavOrder();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 tablet-l:hidden no-print px-3 pb-[max(10px,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto relative">
      {onOpenCola && (
        <div className="mb-2 flex justify-center">
          <ColaNudgeChip plan={gamePlan} onOpen={onOpenCola} />
        </div>
      )}
      <nav
        className="tab-bar-liquid flex items-stretch justify-between px-1.5"
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
        <StudentMark active={studentActive} onSubscribe={onSubscribe} className="mr-1 shrink-0 self-center" />
      </nav>
      </div>
    </div>
  );
};
