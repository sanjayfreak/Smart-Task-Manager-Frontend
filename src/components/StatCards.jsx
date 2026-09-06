import { STATUS } from "../theme";

/**
 * Tally strip. One sheet with hairline dividers rather than four boxes —
 * the numbers read as a single line in a ledger.
 */
function Tally({ label, value, color, last }) {
  return (
    <div className={`flex items-baseline gap-3 px-5 py-4 ${last ? "" : "border-r border-[#e5dcc7]"}`}>
      <span className="font-serif text-[28px] leading-none tabular-nums" style={{ color }}>
        {value}
      </span>
      <span className="text-[13px] text-[#6f675a]">{label}</span>
    </div>
  );
}

export default function StatCards({ counts }) {
  return (
    <div className="paper grid grid-cols-2 sm:grid-cols-4">
      <Tally label="Total" value={counts.total} color="#2e2a24" />
      <Tally label="To do" value={counts.PENDING} color={STATUS.PENDING.ink} />
      <Tally label="In progress" value={counts.IN_PROGRESS} color={STATUS.IN_PROGRESS.ink} />
      <Tally label="Completed" value={counts.COMPLETED} color={STATUS.COMPLETED.ink} last />
    </div>
  );
}
