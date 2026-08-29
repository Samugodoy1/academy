export const BottomNavItem = ({ id, icon: Icon, label, activeTab, setActiveTab, navigate }: any) => {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => {
        setActiveTab(id);
        navigate('/');
      }}
      aria-current={isActive ? 'page' : undefined}
      className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 min-w-0 py-1.5 px-1 rounded-full transition-all duration-300 ease-out ${
        isActive ? 'tab-bar-item-active text-primary' : 'text-academy-muted hover:text-academy-text/80'
      }`}
    >
      <span className="flex items-center justify-center w-9 h-7">
        <Icon
          size={isActive ? 23 : 22}
          className={`transition-all duration-300 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`}
        />
      </span>
      <span
        className={`text-[9px] font-semibold tracking-tight leading-none truncate max-w-full px-0.5 transition-all duration-300 ${
          isActive ? 'opacity-100' : 'opacity-70'
        }`}
      >
        {label}
      </span>
    </button>
  );
};
