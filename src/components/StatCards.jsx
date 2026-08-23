import { STATUS } from "../theme";

function Card({ label, value, accent, icon, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ background: accent.soft, color: accent.ink }}
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

const Icon = ({ d }) => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d={d} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function StatCards({ counts }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <Card
        label="Total Tasks"
        value={counts.total}
        accent={{ soft: "#eef2ff", ink: "#4338ca" }}
        icon={<Icon d="M4 5h12M4 10h12M4 15h8" />}
      />
      <Card
        label="To Do"
        value={counts.PENDING}
        accent={{ soft: STATUS.PENDING.soft, ink: STATUS.PENDING.ink }}
        icon={<Icon d="M10 5.5v5l3 1.5M10 2.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" />}
      />
      <Card
        label="In Progress"
        value={counts.IN_PROGRESS}
        accent={{ soft: STATUS.IN_PROGRESS.soft, ink: STATUS.IN_PROGRESS.ink }}
        icon={<Icon d="M3 10a7 7 0 0111.9-5M17 10a7 7 0 01-11.9 5M15 3v2.5h-2.5M5 17v-2.5h2.5" />}
      />
      <Card
        label="Completed"
        value={counts.COMPLETED}
        accent={{ soft: STATUS.COMPLETED.soft, ink: STATUS.COMPLETED.ink }}
        icon={<Icon d="M4 10.5l3.5 3.5L16 6" />}
      />
    </div>
  );
}
