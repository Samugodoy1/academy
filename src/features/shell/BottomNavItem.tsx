export const BottomNavItem = ({ id, icon: Icon, label, activeTab, setActiveTab, navigate }: any) => {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => {
        setActiveTab(id);
        navigate('/');
      }}
      aria-current={isActive ? 'page' : undefined}
      className="relative flex h-[49px] flex-1 flex-col items-center justify-center gap-0.5 min-w-0"
    >
      <Icon size={22} className={isActive ? 'text-[var(--neo)]' : 'text-[#8e8e93]'} strokeWidth={isActive ? 2.2 : 1.8} />
      <span className={`text-[10px] leading-none tracking-[-0.01em] truncate max-w-full ${isActive ? 'text-[var(--neo)]' : 'text-[#8e8e93]'}`}>
        {label}
      </span>
    </button>
  );
};
