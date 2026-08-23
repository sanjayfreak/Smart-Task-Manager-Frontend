import { STATUS, STATUS_ORDER, priorityOf, formatDue, isOverdue } from "../theme";

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
    <li className="group flex items-start gap-3 px-5 py-4 transition hover:bg-slate-50">
      <button
        onClick={() => onCycleStatus(task)}
        title="Change status"
        aria-label={`Change status of ${task.title}`}
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition
          ${done
            ? "border-transparent text-white"
            : "border-slate-300 text-transparent hover:border-slate-400"}`}
        style={done ? { background: STATUS.COMPLETED.color } : undefined}
      >
        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6">
          <path d="M4 10.5l3.5 3.5L16 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span
            className={`text-sm font-medium ${done ? "text-slate-400 line-through" : "text-slate-900"}`}
          >
            {task.title}
          </span>
          {task.category && (
            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
              {task.category}
            </span>
          )}
        </div>

        {task.description && (
          <p className="mt-0.5 truncate text-xs text-slate-500">{task.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusPill status={task.status} />
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ background: p.soft, color: p.ink }}
          >
            {p.label} priority
          </span>
          {due && (
            <span
              className={`inline-flex items-center gap-1 text-[11px] ${
                late ? "font-medium text-red-600" : "text-slate-500"
              }`}
            >
              <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4.5" width="14" height="13" rx="2" />
                <path d="M3 8.5h14M7 2.5v3M13 2.5v3" strokeLinecap="round" />
              </svg>
              {late ? `Overdue · ${due}` : due}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        disabled={busy}
        aria-label={`Delete ${task.title}`}
        className="rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600
                   focus:opacity-100 group-hover:opacity-100 disabled:opacity-40"
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
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">My Tasks</h2>
        <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                filter === t.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {t.label}
              <span className="ml-1.5 tabular-nums text-slate-400">{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 p-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-5 w-5 shrink-0 animate-pulse rounded-md bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-1/3 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-400">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M4 5h12M4 10h12M4 15h8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="mt-3 text-sm font-medium text-slate-900">
            {query ? "No matching tasks" : "Nothing here yet"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {query
              ? "Try a different search term."
              : "Create your first task to get started."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
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
