import { STATUS, STATUS_ORDER } from "../theme";

const Dot = ({ color }) => (
  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} aria-hidden="true" />
);

const AllIcon = () => (
  <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-[#8a5a3c]" aria-hidden="true" />
);

/**
 * Index-tab rail. Views read as tabs cut into the edge of a notebook,
 * so the active one sits flush with the page rather than floating on it.
 */
export default function Sidebar({ filter, setFilter, counts, username, onLogout, open, onClose }) {
  const items = [
    { key: "ALL", label: "All Tasks", count: counts.total, icon: <AllIcon /> },
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
        <div className="fixed inset-0 z-30 bg-[#2e2a24]/45 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#ddd2ba] bg-[#e9e1cf]
          transition-transform duration-200 lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="px-6 pb-7 pt-7">
          <div className="font-hand text-[30px] leading-none text-[#8a5a3c]">Task book</div>
          <div className="mt-1.5 font-serif text-xs italic text-[#8d8471]">
            {new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </div>
        </div>

        <nav className="flex flex-col">
          <p className="px-6 pb-2 font-serif text-xs italic text-[#8d8471]">Views</p>
          {items.map((it) => {
            const active = filter === it.key;
            return (
              <button
                key={it.key}
                onClick={() => { setFilter(it.key); onClose?.(); }}
                aria-current={active ? "page" : undefined}
                className={`flex w-full items-center gap-3 border-l-[3px] px-6 py-2.5 text-left text-sm transition
                  ${active
                    ? "border-[#8a5a3c] bg-[#f4efe3] font-semibold text-[#2e2a24]"
                    : "border-transparent text-[#6f675a] hover:bg-[#efe6d4] hover:text-[#2e2a24]"}`}
              >
                {it.icon}
                <span className="flex-1">{it.label}</span>
                <span className="font-serif text-[13px] tabular-nums text-[#8d8471]">{it.count}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="border-t border-[#ddd2ba] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#8a5a3c] text-sm font-semibold text-[#f7f3ea]">
              {(username || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-sm text-[#2e2a24]">{username || "Signed in"}</p>
              <p className="font-hand text-[15px] leading-tight text-[#a89c84]">keep going</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="mt-3 text-sm text-[#8d8471] underline decoration-[#c9bda4] underline-offset-4 transition hover:text-[#8a5a3c]"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
