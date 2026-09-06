import { useEffect, useState } from "react";
import { STATUS, STATUS_ORDER, PRIORITY } from "../theme";

const field = "field";

export default function AddTaskModal({ open, onClose, onCreate, saving }) {
  const [form, setForm] = useState({
    title: "", description: "", status: "PENDING",
    priority: "MEDIUM", dueDate: "", category: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({ title: "", description: "", status: "PENDING", priority: "MEDIUM", dueDate: "", category: "" });
      setError("");
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Give the task a title.");
    setError("");
    const ok = await onCreate({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim() || null,
      dueDate: form.dueDate || null,
    });
    if (!ok) setError("Could not save the task. Please try again.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2e2a24]/45 p-4 sm:items-center">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create task"
        className="relative w-full max-w-lg paper p-6 shadow-lg"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif text-[19px] text-[#2e2a24]">New task</h2>
            <p className="mt-0.5 text-xs text-[#8d8471]">Add it to your board.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1.5 text-[#a89c84] transition hover:bg-[#e9e1cf] hover:text-[#4a4338]"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="t-title" className="mb-1.5 block text-xs font-medium text-[#4a4338]">Title</label>
            <input id="t-title" autoFocus value={form.title} onChange={set("title")}
              placeholder="e.g. Design the landing page" className={field} />
          </div>

          <div>
            <label htmlFor="t-desc" className="mb-1.5 block text-xs font-medium text-[#4a4338]">
              Description <span className="font-normal text-[#a89c84]">(optional)</span>
            </label>
            <textarea id="t-desc" rows={2} value={form.description} onChange={set("description")}
              placeholder="Any extra detail" className={`${field} resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="t-cat" className="mb-1.5 block text-xs font-medium text-[#4a4338]">
                Category <span className="font-normal text-[#a89c84]">(optional)</span>
              </label>
              <input id="t-cat" value={form.category} onChange={set("category")}
                placeholder="Backend" className={field} />
            </div>
            <div>
              <label htmlFor="t-due" className="mb-1.5 block text-xs font-medium text-[#4a4338]">
                Due date <span className="font-normal text-[#a89c84]">(optional)</span>
              </label>
              <input id="t-due" type="date" value={form.dueDate} onChange={set("dueDate")} className={field} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="t-pri" className="mb-1.5 block text-xs font-medium text-[#4a4338]">Priority</label>
              <select id="t-pri" value={form.priority} onChange={set("priority")} className={field}>
                {Object.keys(PRIORITY).map((k) => (
                  <option key={k} value={k}>{PRIORITY[k].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="t-status" className="mb-1.5 block text-xs font-medium text-[#4a4338]">Status</label>
              <select id="t-status" value={form.status} onChange={set("status")} className={field}>
                {STATUS_ORDER.map((k) => (
                  <option key={k} value={k}>{STATUS[k].label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-md bg-[#f8e7e2] px-3 py-2 text-xs text-[#b0472f]">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-[#6f675a] transition hover:bg-[#e9e1cf]">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="rounded-md bg-[#8a5a3c] px-4 py-2 text-sm font-medium text-white shadow-sm transition
                         hover:bg-[#70472f] disabled:opacity-60">
              {saving ? "Saving…" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
