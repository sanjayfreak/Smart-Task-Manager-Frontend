import { STATUS, STATUS_ORDER } from "../theme";

const R = 54;
const C = 2 * Math.PI * R;
const GAP = 3; // surface gap between segments, in path units

/**
 * Task status breakdown. Every segment is directly labelled in the legend,
 * so colour never carries the meaning alone.
 */
export default function StatusDonut({ counts }) {
  const total = counts.total;
  let offset = 0;

  const segments = STATUS_ORDER.map((key) => {
    const value = counts[key] || 0;
    const frac = total ? value / total : 0;
    const full = frac * C;
    // Only inset a gap when the segment is wide enough to keep a visible arc.
    const len = full > GAP * 2 ? full - GAP : full;
    const seg = { key, value, frac, len, offset, color: STATUS[key].color };
    offset += full;
    return seg;
  });

  const donePct = total ? Math.round(((counts.COMPLETED || 0) / total) * 100) : 0;

  return (
    <section className="paper p-6">
      <h2 className="font-serif text-[17px] text-[#2e2a24]">Task Overview</h2>
      <p className="mt-0.5 text-xs text-[#8d8471]">Breakdown by status</p>

      <div className="mt-5 flex min-w-0 flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-[148px] w-[148px] shrink-0">
          <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
            <circle cx="70" cy="70" r={R} fill="none" stroke="#e8dfc9" strokeWidth="16" />
            {total > 0 &&
              segments.map((s) =>
                s.value === 0 ? null : (
                  <circle
                    key={s.key}
                    cx="70"
                    cy="70"
                    r={R}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="16"
                    strokeLinecap="butt"
                    strokeDasharray={`${Math.max(s.len, 0)} ${C}`}
                    strokeDashoffset={-s.offset}
                  >
                    <title>{`${STATUS[s.key].label}: ${s.value} of ${total}`}</title>
                  </circle>
                )
              )}
          </svg>

          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-serif text-[26px] tabular-nums text-[#2e2a24]">{total}</div>
              <div className="text-[11px] text-[#8d8471]">Total</div>
            </div>
          </div>
        </div>

        <ul className="w-full min-w-0 space-y-2.5">
          {segments.map((s) => (
            <li key={s.key} className="flex items-center gap-2.5 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: s.color }}
                aria-hidden="true"
              />
              <span className="flex-1 whitespace-nowrap text-[#6f675a]">{STATUS[s.key].label}</span>
              <span className="tabular-nums font-medium text-[#2e2a24]">{s.value}</span>
              <span className="w-9 text-right tabular-nums text-xs text-[#8d8471]">
                {total ? Math.round(s.frac * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 border-t border-[#e5dcc7] pt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-[#8d8471]">Completion</span>
          <span className="font-medium tabular-nums text-[#2e2a24]">{donePct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e8dfc9]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${donePct}%`, background: STATUS.COMPLETED.color }}
          />
        </div>
      </div>
    </section>
  );
}
