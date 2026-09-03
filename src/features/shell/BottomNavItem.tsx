export const BottomNavItem = ({ id, icon: Icon, label, activeTab, setActiveTab, navigate }: any) => {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => {
        setActiveTab(id);
        navigate('/');
      }}
      aria-current={isActive ? 'page' : undefined}
      className="relative flex h-14 flex-1 flex-col items-center justify-center gap-0.5 min-w-0 px-0.5"
    >
      <span className={`flex h-8 w-11 items-center justify-center ${isActive ? 'text-[var(--neo)]' : 'text-[var(--neo-ink)]'}`}>
        <Icon size={20} />
      </span>
      <span className={`text-[10px] leading-none truncate max-w-full px-0.5 ${isActive ? 'text-[var(--neo)]' : 'text-[var(--neo-gray)]'}`}>
        {label}
      </span>
    </button>
  );
};
