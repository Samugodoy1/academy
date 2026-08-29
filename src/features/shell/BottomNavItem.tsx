export const BottomNavItem = ({ id, icon: Icon, label, activeTab, setActiveTab, navigate }: any) => (
  <button
    onClick={() => {
      setActiveTab(id);
      navigate('/');
    }}
    className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${activeTab === id
        ? 'text-primary'
        : 'text-academy-muted'
      }`}
  >
    <Icon size={24} className={activeTab === id ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} />
    <span className={`text-[10px] font-semibold ${activeTab === id ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
  </button>
);
