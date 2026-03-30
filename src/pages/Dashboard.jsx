import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.content || []);
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const addTask = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Enter title and description");
      return;
    }
    setLoading(true);
    try {
      await API.post("/tasks", { title, description, status: "PENDING" });
      setTitle("");
      setDescription("");
      loadTasks();
    } catch (err) {
      alert("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle status between PENDING and COMPLETED
  const toggleStatus = async (task) => {
    const newStatus = task.status === "PENDING" ? "COMPLETED" : "PENDING";
    try {
      await API.patch(`/tasks/${task.id}/status`, { status: newStatus });
      loadTasks();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      loadTasks();
    } catch (err) {
      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Failed to delete";
      alert(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const pending = tasks.filter((t) => t.status === "PENDING");
  const completed = tasks.filter((t) => t.status === "COMPLETED");

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-purple-400">📋 Task Manager</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      {/* Add Task */}
      <div className="bg-gray-800 p-4 rounded-lg mb-8 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-200">Add New Task</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            placeholder="Title"
            className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Description"
            className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={addTask}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded transition"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-yellow-600 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{pending.length}</p>
          <p className="text-sm mt-1">Pending</p>
        </div>
        <div className="bg-green-600 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{completed.length}</p>
          <p className="text-sm mt-1">Completed</p>
        </div>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No tasks yet. Add one above!</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <div
              key={t.id}
              className={`flex items-start justify-between p-4 rounded-lg border ${
                t.status === "COMPLETED"
                  ? "bg-green-900 border-green-700"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              {/* Task Info */}
              <div className="flex-1 mr-4">
                <p
                  className={`font-semibold text-lg ${
                    t.status === "COMPLETED"
                      ? "line-through text-gray-400"
                      : "text-white"
                  }`}
                >
                  {t.title}
                </p>
                {/* ✅ Description now showing */}
                <p className="text-gray-400 text-sm mt-1">{t.description}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                {/* ✅ Status toggle */}
                <button
                  onClick={() => toggleStatus(t)}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition ${
                    t.status === "COMPLETED"
                      ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {t.status === "COMPLETED" ? "↩ Pending" : "✓ Complete"}
                </button>

                {/* ✅ Delete button */}
                <button
                  onClick={() => deleteTask(t.id)}
                  className="text-xs px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;