export const BottomNavItem = ({ id, icon: Icon, label, activeTab, setActiveTab, navigate }: any) => {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => {
        setActiveTab(id);
        navigate('/');
      }}
      aria-current={isActive ? 'page' : undefined}
      className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 min-w-0 py-1 px-0.5 rounded-[18px] transition-all duration-150 ${
        isActive ? 'text-primary' : 'text-academy-muted'
      }`}
    >
      <span
        className={`flex items-center justify-center w-11 h-8 rounded-[12px] transition-all ${
          isActive ? 'bg-primary text-white shadow-[0_3px_0_#3B0459]' : ''
        }`}
      >
        <Icon size={22} />
      </span>
      <span
        className={`text-[9px] font-extrabold uppercase tracking-[0.08em] leading-none truncate max-w-full px-0.5 ${
          isActive ? 'text-primary' : 'opacity-70'
        }`}
      >
        {label}
      </span>
    </button>
  );
};
