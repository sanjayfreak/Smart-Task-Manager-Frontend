import { STATUS, STATUS_ORDER } from "../theme";

const Dot = ({ color }) => (
  <span
    className="h-2 w-2 shrink-0 rounded-full"
    style={{ background: color }}
    aria-hidden="true"
  />
);

const GridIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="2.5" y="2.5" width="6" height="6" rx="1.5" />
    <rect x="11.5" y="2.5" width="6" height="6" rx="1.5" />
    <rect x="2.5" y="11.5" width="6" height="6" rx="1.5" />
    <rect x="11.5" y="11.5" width="6" height="6" rx="1.5" />
  </svg>
);

export default function Sidebar({ filter, setFilter, counts, username, onLogout, open, onClose }) {
  const items = [
    { key: "ALL", label: "All Tasks", count: counts.total, icon: <GridIcon /> },
    ...STATUS_ORDER.map((k) => ({
      key: k,
      label: STATUS[k].label,
      count: counts[k],
      icon: <Dot color={STATUS[k].color} />,
    })),
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-slate-900 text-slate-300
          transition-transform duration-200 lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-2.5 px-5 py-6">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 10.5l3.5 3.5L16 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-[15px] font-semibold tracking-tight text-white">
            Smart<span className="text-indigo-400">Task</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Views
          </p>
          {items.map((it) => {
            const active = filter === it.key;
            return (
              <button
                key={it.key}
                onClick={() => { setFilter(it.key); onClose?.(); }}
                aria-current={active ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition
                  ${active
                    ? "bg-indigo-600 font-medium text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
              >
                <span className={active ? "text-white" : "text-slate-400"}>{it.icon}</span>
                <span className="flex-1 text-left">{it.label}</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs tabular-nums
                    ${active ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"}`}
                >
                  {it.count}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-700 text-sm font-semibold text-white">
              {(username || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{username || "Signed in"}</p>
              <p className="text-xs text-slate-500">Free plan</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
