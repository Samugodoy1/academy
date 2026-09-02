export const BottomNavItem = ({ id, icon: Icon, label, activeTab, setActiveTab, navigate }: any) => {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => {
        setActiveTab(id);
        navigate('/');
      }}
      aria-current={isActive ? 'page' : undefined}
      className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 min-w-0 h-11 px-0.5 transition-colors ${
        isActive ? 'text-white' : 'text-[#86868b]'
      }`}
    >
      <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
      <span className="text-[10px] font-normal leading-none truncate max-w-full px-0.5">
        {label}
      </span>
    </button>
  );
};
