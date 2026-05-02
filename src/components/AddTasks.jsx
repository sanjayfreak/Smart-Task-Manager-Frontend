import { useState } from "react";

const AddTask = ({ addTask, adding }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;

    addTask({ title, description, status });

    setTitle("");
    setDescription("");
    setStatus("PENDING");
  };

  return (
    <div className="bg-white/10 p-6 rounded-xl flex flex-col gap-4">
      <h3>Create Task</h3>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="p-2 rounded bg-white/20"
      />

      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="p-2 rounded bg-white/20"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="p-2 rounded bg-white/20"
      >
        <option value="PENDING">PENDING</option>
        <option value="COMPLETED">COMPLETED</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={adding}
        className="bg-indigo-500 py-2 rounded"
      >
        {adding ? "Adding..." : "Add Task"}
      </button>
    </div>
  );
};

export default AddTask;