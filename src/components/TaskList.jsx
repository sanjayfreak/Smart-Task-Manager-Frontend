import { STATUS, STATUS_ORDER, priorityOf, formatDue, isOverdue, lateness } from "../theme";

function StatusPill({ status }) {
  const s = STATUS[status] || STATUS.PENDING;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: s.soft, color: s.ink }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} aria-hidden="true" />
      {s.label}
    </span>
  );
}

function TaskRow({ task, onCycleStatus, onDelete, busy }) {
  const done = task.status === "COMPLETED";
  const p = priorityOf(task);
  const due = formatDue(task.dueDate);
  const late = !done && isOverdue(task.dueDate);

  return (
    <li className="group flex min-w-0 items-start gap-3.5 px-4 py-3.5 transition hover:bg-[#f6f1e6] sm:px-5">
      <button
        onClick={() => onCycleStatus(task)}
        title="Change status"
        aria-label={`Change status of ${task.title}`}
        className={`mt-1 grid h-[19px] w-[19px] shrink-0 place-items-center rounded-[3px] border-[1.6px] transition
          ${done
            ? "border-[#a89c84] text-[#8a5a3c]"
            : "border-[#8a5a3c] text-transparent hover:bg-[#f0e7d5]"}`}
        style={undefined}
      >
        <svg viewBox="0 0 20 20" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M3 11l4 4 10-11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={`font-serif text-[16px] ${done ? "italic text-[#a89c84] line-through" : "text-[#2e2a24]"}`}
          >
            {task.title}
          </span>
          {task.category && (
            <span className="rounded-[3px] bg-[#efe9dc] px-1.5 py-0.5 text-[11px] font-medium text-[#6f675a]">
              {task.category}
            </span>
          )}
        </div>

        {task.description && (
          <p className="mt-0.5 truncate text-xs text-[#8d8471]">{task.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusPill status={task.status} />
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ background: p.soft, color: p.ink }}
          >
            {p.label} priority
          </span>
          {late && (
            <span className="font-hand text-[17px] leading-none text-[#b0472f]">{lateness(task.dueDate)}</span>
          )}
          {due && (
            <span
              className="inline-flex items-center gap-1 text-[11px] text-[#8d8471]"
            >
              <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4.5" width="14" height="13" rx="2" />
                <path d="M3 8.5h14M7 2.5v3M13 2.5v3" strokeLinecap="round" />
              </svg>
              {due}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        disabled={busy}
        aria-label={`Delete ${task.title}`}
        className="shrink-0 rounded-md p-2 text-[#a89c84] transition hover:bg-[#f8e7e2] hover:text-[#b0472f]
                   focus:opacity-100 disabled:opacity-40
                   sm:opacity-0 sm:group-hover:opacity-100"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h12M8 6V4.5A1.5 1.5 0 019.5 3h1A1.5 1.5 0 0112 4.5V6M6.5 6l.6 9a1.5 1.5 0 001.5 1.4h2.8a1.5 1.5 0 001.5-1.4l.6-9"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </li>
  );
}

export default function TaskList({ tasks, loading, filter, setFilter, counts, onCycleStatus, onDelete, deletingId, query }) {
  const tabs = [
    { key: "ALL", label: "All", count: counts.total },
    ...STATUS_ORDER.map((k) => ({ key: k, label: STATUS[k].label, count: counts[k] })),
  ];

  return (
    <section className="min-w-0 paper">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5dcc7] px-5 py-4">
        <h2 className="font-serif text-[17px] text-[#2e2a24]">My Tasks</h2>
        <div className="flex flex-wrap gap-1 rounded-md bg-[#efe9dc] p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`border-b-2 pb-1 text-[13px] transition ${
                filter === t.key
                  ? "border-[#8a5a3c] font-semibold text-[#2e2a24]"
                  : "border-transparent text-[#8d8471] hover:text-[#2e2a24]"
              }`}
            >
              {t.label}
              <span className="ml-1.5 font-serif tabular-nums text-[#a89c84]">{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-5 w-5 shrink-0 animate-pulse rounded-[3px] bg-[#efe9dc]" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-1/3 animate-pulse rounded bg-[#efe9dc]" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-[#efe9dc]" />
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#efe9dc] text-[#a89c84]">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M4 5h12M4 10h12M4 15h8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-medium text-[#2e2a24]">
            {query ? "No matching tasks" : "Nothing here yet"}
          </p>
          <p className="mt-1 text-xs text-[#8d8471]">
            {query
              ? "Try a different search term."
              : "Create your first task to get started."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[#e5dcc7]">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onCycleStatus={onCycleStatus}
              onDelete={onDelete}
              busy={deletingId === task.id}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
