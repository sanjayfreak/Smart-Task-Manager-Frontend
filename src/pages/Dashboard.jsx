import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import StatCards from "../components/StatCards";
import StatusDonut from "../components/StatusDonut";
import TaskList from "../components/TaskList";
import AddTaskModal from "../components/AddTaskModal";
import { STATUS_ORDER, isOverdue } from "../theme";

const NEXT_STATUS = {
  PENDING: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
  COMPLETED: "PENDING",
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [banner, setBanner] = useState("");

  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "";

  const loadTasks = useCallback(async () => {
    try {
      const res = await API.get("/tasks", { params: { size: 200 } });
      setTasks(res.data.content || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        setBanner("Couldn't load your tasks. The server may still be waking up.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const counts = useMemo(() => {
    const c = { total: tasks.length };
    STATUS_ORDER.forEach((k) => { c[k] = 0; });
    tasks.forEach((t) => {
      const k = STATUS_ORDER.includes(t.status) ? t.status : "PENDING";
      c[k] += 1;
    });
    return c;
  }, [tasks]);

  const overdueCount = useMemo(
    () => tasks.filter((t) => t.status !== "COMPLETED" && isOverdue(t.dueDate)).length,
    [tasks]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filter !== "ALL" && (t.status || "PENDING") !== filter) return false;
      if (!q) return true;
      return [t.title, t.description, t.category]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q));
    });
  }, [tasks, filter, query]);

  const createTask = async (payload) => {
    setSaving(true);
    try {
      const res = await API.post("/tasks", payload);
      setTasks((prev) => [...prev, res.data]);
      setModalOpen(false);
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  };

  const cycleStatus = async (task) => {
    const next = NEXT_STATUS[task.status] || "IN_PROGRESS";
    const before = tasks;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)));
    try {
      await API.patch(`/tasks/${task.id}/status`, { status: next });
    } catch {
      setTasks(before);
      setBanner("Couldn't update that task.");
    }
  };

  const deleteTask = async (id) => {
    setDeletingId(id);
    const before = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await API.delete(`/tasks/${id}`);
    } catch {
      setTasks(before);
      setBanner("Couldn't delete that task.");
    } finally {
      setDeletingId(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="min-h-full bg-[#efe9dc]">
      <Sidebar
        filter={filter}
        setFilter={setFilter}
        counts={counts}
        username={username}
        onLogout={logout}
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-[#ddd2ba] bg-[#f4efe3]/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6">
            <button
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              className="rounded-md p-2 text-[#8d8471] hover:bg-[#e9e1cf] lg:hidden"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative min-w-0 flex-1 max-w-md">
              <svg viewBox="0 0 20 20"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a89c84]"
                fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="9" r="5.5" />
                <path d="M13.5 13.5L17 17" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks…"
                aria-label="Search tasks"
                className="w-full rounded-md border border-[#ddd2ba] bg-[#efe9dc] py-2 pl-9 pr-3 text-sm
                           text-[#2e2a24] placeholder:text-[#a89c84] focus:border-[#8a5a3c] focus:bg-[#fbf8f1]
                           focus:outline-none focus:ring-2 focus:ring-[#8a5a3c]/15"
              />
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-[#8a5a3c] px-3.5 py-2
                         text-sm font-medium text-white shadow-sm transition hover:bg-[#70472f]"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 4.5v11M4.5 10h11" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">New task</span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
          <div>
            <h1 className="font-serif text-[26px] tracking-[-0.01em] text-[#2e2a24]">
              {username ? `Welcome back, ${username}` : "Dashboard"}
            </h1>
            <p className="mt-0.5 text-sm text-[#8d8471]">
              {counts.total === 0 ? (
                "No tasks yet — create one to get started."
              ) : (
                <>
                  {counts.PENDING + counts.IN_PROGRESS} open · {counts.COMPLETED} completed
                  {overdueCount > 0 && (
                    <span className="font-medium text-[#b0472f]"> · {overdueCount} overdue</span>
                  )}
                </>
              )}
            </p>
          </div>

          {banner && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-[#e3cfa3] bg-[#f9f0dc] px-4 py-3 text-sm text-[#7a5326]">
              <span className="flex-1">{banner}</span>
              <button onClick={() => setBanner("")} className="text-[#8a5a3c] hover:text-[#7a5326]" aria-label="Dismiss">✕</button>
            </div>
          )}

          <StatCards counts={counts} />

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="min-w-0 lg:col-span-2">
              <TaskList
                tasks={visible}
                loading={loading}
                filter={filter}
                setFilter={setFilter}
                counts={counts}
                onCycleStatus={cycleStatus}
                onDelete={deleteTask}
                deletingId={deletingId}
                query={query}
              />
            </div>
            <div className="min-w-0 lg:col-span-1">
              <StatusDonut counts={counts} />
            </div>
          </div>
        </main>
      </div>

      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={createTask}
        saving={saving}
      />
    </div>
  );
}
