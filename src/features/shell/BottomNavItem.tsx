export const BottomNavItem = ({ id, icon: Icon, label, activeTab, setActiveTab, navigate }: any) => {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => {
        setActiveTab(id);
        navigate('/');
      }}
      aria-current={isActive ? 'page' : undefined}
      className="relative flex h-[54px] flex-1 flex-col items-center justify-center gap-0.5 min-w-0 px-0.5"
    >
      <span className={`dock-glyph ${isActive ? 'dock-glyph-active' : ''}`}>
        <Icon size={22} weight={isActive ? 'fill' : 'regular'} />
      </span>
      <span className={`text-[10px] leading-none truncate max-w-full px-0.5 ${isActive ? 'text-[var(--neo)]' : 'text-[#8e8e93]'}`}>
        {label}
      </span>
    </button>
  );
};
