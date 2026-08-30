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
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-200 tablet-l:justify-center tablet-l:px-2 desktop:justify-start desktop:px-4 ${
        isActive
          ? 'bg-[#F2F2F7] text-primary'
          : 'text-academy-muted hover:text-academy-text hover:bg-[#F2F2F7]/70'
      }`}
    >
      <Icon size={20} className="shrink-0" />
      <span className="font-medium tablet-l:hidden desktop:block whitespace-nowrap">{label}</span>
    </button>
  );
};
