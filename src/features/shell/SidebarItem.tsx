export const SidebarItem = ({
  id,
  icon: Icon,
  label,
  activeTab,
  setActiveTab,
  setIsSidebarOpen,
  navigate,
  editing = false,
  onPin,
}: any) => {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => {
        if (editing && onPin) {
          onPin();
          return;
        }
        setActiveTab(id);
        setIsSidebarOpen(false);
        navigate('/');
      }}
      title={label}
      aria-current={isActive ? 'page' : undefined}
      className={`neo-control-tile w-full tablet-l:min-h-[64px] tablet-l:items-center tablet-l:px-0 desktop:min-h-[84px] desktop:items-start ${isActive ? 'neo-control-tile-active' : ''} ${editing ? 'ring-1 ring-[color-mix(in_srgb,var(--neo)_28%,transparent)]' : ''}`}
    >
      <span className="flex h-8 w-8 items-center justify-center">
        <Icon size={22} strokeWidth={isActive ? 2 : 1.6} />
      </span>
      <span className="text-[14px] font-semibold tracking-[-0.016em] tablet-l:hidden desktop:block">
        {label}
      </span>
    </button>
  );
};
