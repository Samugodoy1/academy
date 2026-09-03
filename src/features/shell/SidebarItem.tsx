export const SidebarItem = ({
  id,
  icon: Icon,
  label,
  description,
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
      className={`neo-control-tile w-full ${isActive ? 'neo-control-tile-active' : ''} ${editing ? 'ring-1 ring-[#d2d2d7]' : ''}`}
    >
      <span className="flex h-7 w-7 items-center justify-center text-[var(--neo-ink)]">
        <Icon size={22} />
      </span>
      <span className="min-w-0 tablet-l:hidden desktop:block">
        <span className="block text-[15px] font-semibold tracking-[-0.016em] text-[var(--neo-ink)]">
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-[12px] font-normal tracking-[-0.011em] text-[var(--neo-gray)]">
            {description}
          </span>
        )}
      </span>
    </button>
  );
};
