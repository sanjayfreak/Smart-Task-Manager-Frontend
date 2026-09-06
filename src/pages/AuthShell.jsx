/**
 * Shared frame for Login and Register.
 *
 * The left page is the inside cover of the notebook: a ruled sample of
 * the list itself, so the first thing a new user sees is the thing they
 * are about to make — not a feature list.
 */

const SAMPLE = [
  { title: "Finish DBMS record", note: "2 days late", late: true, dot: "#8a5a3c" },
  { title: "Submit internship report", note: "12 Sep", late: false, dot: "#5c7a5e" },
  { title: "Prep Capgemini aptitude", note: "14 Sep", late: false, dot: "#5c7a5e" },
  { title: "Update resume", note: "", late: false, dot: "", done: true },
];

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-full lg:grid-cols-2">

      {/* ---------- inside cover ---------- */}
      <div className="relative hidden overflow-hidden border-r border-[#ddd2ba] bg-[#e9e1cf] lg:flex lg:flex-col">
        <div className="flex h-full flex-col justify-between p-12">

          <div>
            <div className="font-hand text-[34px] leading-none text-[#8a5a3c]">Task book</div>
            <div className="mt-1.5 font-serif text-xs italic text-[#8d8471]">Since 2026</div>
          </div>

          <div className="max-w-md">
            <h2 className="font-serif text-[34px] leading-[1.2] tracking-[-0.01em] text-[#2e2a24] [text-wrap:pretty]">
              A page for everything you owe yourself this week.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#6f675a]">
              Write it down, give it a day, cross it off. Status, priority and due
              dates — nothing you would not put on paper.
            </p>

            {/* a ruled sample of the real list */}
            <div className="mt-9 border-t border-[#cfc2a8]">
              {SAMPLE.map((s) => (
                <div key={s.title} className="flex items-center gap-3.5 border-b border-[#cfc2a8] py-3">
                  <span
                    className={`grid h-[19px] w-[19px] shrink-0 place-items-center rounded-[3px] border-[1.6px] ${
                      s.done ? "border-[#a89c84]" : "border-[#8a5a3c]"
                    }`}
                  >
                    {s.done && (
                      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="#8a5a3c" strokeWidth="2.4">
                        <path d="M3 11l4 4 10-11" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>

                  <span className={`flex-1 font-serif text-[15px] ${s.done ? "italic text-[#a89c84] line-through" : "text-[#2e2a24]"}`}>
                    {s.title}
                  </span>

                  {s.note && (
                    <span className={s.late ? "font-hand text-[17px] text-[#b0472f]" : "text-[11px] text-[#8d8471]"}>
                      {s.note}
                    </span>
                  )}
                  {s.dot && <span className="h-2 w-2 rounded-full" style={{ background: s.dot }} />}
                </div>
              ))}
            </div>
          </div>

          <p className="font-serif text-xs italic text-[#a89c84]">© {new Date().getFullYear()} Task book</p>
        </div>
      </div>

      {/* ---------- form ---------- */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          <div className="mb-8 lg:hidden">
            <div className="font-hand text-[28px] leading-none text-[#8a5a3c]">Task book</div>
          </div>

          <div className="paper p-7">
            <h1 className="font-serif text-[24px] tracking-[-0.01em] text-[#2e2a24]">{title}</h1>
            <p className="mt-1.5 text-sm text-[#8d8471]">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>

          <p className="mt-5 text-center text-sm text-[#8d8471]">{footer}</p>
        </div>
      </div>
    </div>
  );
}
