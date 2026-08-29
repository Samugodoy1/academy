export const BottomNavItem = ({ id, icon: Icon, label, activeTab, setActiveTab, navigate }: any) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => {
        setActiveTab(id);
        navigate('/');
      }}
      className={`relative flex flex-col items-center justify-center gap-1 flex-1 py-1.5 transition-all duration-200 ${
        isActive ? 'text-primary' : 'text-academy-muted'
      }`}
    >
      {isActive && (
        <span className="absolute -top-0.5 w-8 h-1 rounded-full bg-primary/80" />
      )}
      <span
        className={`flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
          isActive ? 'bg-primary/10' : ''
        }`}
      >
        <Icon size={22} className={isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'} />
      </span>
      <span className={`text-[10px] font-semibold tracking-tight ${isActive ? 'opacity-100' : 'opacity-75'}`}>
        {label}
      </span>
    </button>
  );
};
