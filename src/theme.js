// Single source of truth for status + priority presentation.
// Status colours are validated for colour-vision deficiency:
// worst all-pairs CVD deltaE 16.2, normal-vision 29.0 on a light surface.
export const STATUS = {
  PENDING:     { label: "To Do",       color: "#eda100", soft: "#fdf3dc", ink: "#7a5300" },
  IN_PROGRESS: { label: "In Progress", color: "#2a78d6", soft: "#e4eefb", ink: "#1b4d8a" },
  COMPLETED:   { label: "Completed",   color: "#008300", soft: "#e0f0e0", ink: "#005400" },
};

export const STATUS_ORDER = ["PENDING", "IN_PROGRESS", "COMPLETED"];

export const PRIORITY = {
  HIGH:   { label: "High",   soft: "#fbe6e6", ink: "#a12525" },
  MEDIUM: { label: "Medium", soft: "#fdf3dc", ink: "#7a5300" },
  LOW:    { label: "Low",    soft: "#eef1f5", ink: "#4a5565" },
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
