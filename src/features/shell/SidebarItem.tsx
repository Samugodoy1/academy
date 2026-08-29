export const SidebarItem = ({ id, icon: Icon, label, activeTab, setActiveTab, setIsSidebarOpen, navigate }: any) => (
  <button
    onClick={() => {
      setActiveTab(id);
      setIsSidebarOpen(false);
      navigate('/');
    }}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-200 ${activeTab === id
        ? 'bg-white text-primary shadow-sm'
        : 'text-slate-500 hover:text-slate-900'
      }`}
  >
    <Icon size={20} className="shrink-0" />
    <span className="font-medium tablet-l:hidden desktop:block whitespace-nowrap">{label}</span>
  </button>
);
