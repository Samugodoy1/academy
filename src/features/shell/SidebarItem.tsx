export const SidebarItem = ({ id, icon: Icon, label, activeTab, setActiveTab, setIsSidebarOpen, navigate }: any) => {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsSidebarOpen(false);
        navigate('/');
      }}
      title={label}
      aria-current={isActive ? 'page' : undefined}
      className={`w-full flex items-center gap-3 rounded-[16px] px-3 py-2.5 tablet-l:justify-center tablet-l:px-0 tablet-l:py-3 desktop:justify-start desktop:px-3 transition-colors ${
        isActive ? 'bg-[#1d1d1f] text-white' : 'text-[#86868b] hover:bg-[#1d1d1f] hover:text-white'
      }`}
    >
      <span className="flex items-center justify-center w-8 h-8 shrink-0">
        <Icon size={22} strokeWidth={isActive ? 2 : 1.6} />
      </span>
      <span className="text-[15px] font-normal tracking-[-0.011em] tablet-l:hidden desktop:block whitespace-nowrap">
        {label}
      </span>
    </button>
  );
};
