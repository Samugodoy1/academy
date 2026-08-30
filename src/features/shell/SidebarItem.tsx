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
      className={`duo-btn w-full flex items-center gap-3 rounded-[16px] px-3 py-3 tablet-l:justify-center tablet-l:px-0 tablet-l:py-3 desktop:justify-start desktop:px-3 ${
        isActive ? 'duo-btn-active' : ''
      }`}
    >
      <span
        className={`flex items-center justify-center w-9 h-9 rounded-[12px] shrink-0 ${
          isActive ? 'bg-white/15 text-white' : 'bg-primary/10 text-primary'
        }`}
      >
        <Icon size={22} />
      </span>
      <span className="font-extrabold uppercase tracking-[0.12em] text-[13px] tablet-l:hidden desktop:block whitespace-nowrap">
        {label}
      </span>
    </button>
  );
};
