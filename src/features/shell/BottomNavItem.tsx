export const BottomNavItem = ({ id, icon: Icon, label, activeTab, setActiveTab, navigate }: any) => {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => {
        setActiveTab(id);
        navigate('/');
      }}
      aria-current={isActive ? 'page' : undefined}
      className="relative flex h-[62px] flex-1 flex-col items-center justify-center gap-0.5 min-w-0"
    >
      {isActive && <span className="ac-lens absolute inset-y-2 inset-x-1 rounded-[22px]" aria-hidden />}
      <Icon
        size={22}
        strokeWidth={isActive ? 2.15 : 1.75}
        className={`relative ${isActive ? 'text-[var(--neo)]' : 'text-[#8e8e93]'}`}
      />
      <span className={`relative text-[10px] font-medium leading-none tracking-[-0.01em] ${isActive ? 'text-[var(--neo)]' : 'text-[#8e8e93]'}`}>
        {label}
      </span>
    </button>
  );
};
