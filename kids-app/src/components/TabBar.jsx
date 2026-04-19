export default function TabBar({ tabs, active, onSelect }) {
  return (
    <nav className="tabbar" role="tablist">
      {tabs.map(tab => {
        const isActive = active === tab.id
        const className =
          'tab' +
          (isActive ? ' tab-active' : '') +
          (tab.coming ? ' tab-coming' : '')
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={className}
            style={{ '--tab-color': tab.color }}
            onClick={() => !tab.coming && onSelect(tab.id)}
            disabled={tab.coming && !isActive}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}
