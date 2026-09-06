// Single source of truth for status + priority presentation.
//
// "Paper Planner": pigments rather than screen colours — walnut ink,
// sage, plum and a rust red for anything late. Every status is also
// labelled in text, so colour never carries the meaning alone.

export const STATUS = {
  PENDING:     { label: "To Do",       color: "#c98a3f", soft: "#f6ecd9", ink: "#7a5326" },
  IN_PROGRESS: { label: "In Progress", color: "#7a6a99", soft: "#efeaf5", ink: "#55476f" },
  COMPLETED:   { label: "Completed",   color: "#5c7a5e", soft: "#e6eee6", ink: "#3c5540" },
};

export const STATUS_ORDER = ["PENDING", "IN_PROGRESS", "COMPLETED"];

export const PRIORITY = {
  HIGH:   { label: "High",   soft: "#f8e7e2", ink: "#b0472f" },
  MEDIUM: { label: "Medium", soft: "#f6ecd9", ink: "#7a5326" },
  LOW:    { label: "Low",    soft: "#eee9dd", ink: "#6f675a" },
};

export const statusOf = (t) => STATUS[t?.status] || STATUS.PENDING;
export const priorityOf = (t) => PRIORITY[t?.priority] || PRIORITY.MEDIUM;

/** "2026-09-14" -> "14 Sep". Returns "" for empty/invalid input. */
export function formatDue(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/** True when the date is strictly before today. */
export function isOverdue(iso) {
  if (!iso) return false;
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

/** "2 days late" / "due today" — the phrasing used in the margin notes. */
export function lateness(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.round((today - d) / 86400000);
  if (days <= 0) return days === 0 ? "due today" : "";
  return days === 1 ? "a day late" : `${days} days late`;
}
