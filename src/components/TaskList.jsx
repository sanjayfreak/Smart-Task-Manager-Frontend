const TaskList = ({ tasks, loading, removeTask, deletingId }) => {
  if (loading) return <p>Loading...</p>;
  if (tasks.length === 0) return <p>No tasks</p>;

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white/10 p-4 rounded flex justify-between"
        >
          <div>
            <h3>{task.title}</h3>
            <p>{task.description}</p>

            <span
              className={`px-2 py-1 text-xs rounded ${
                task.status === "COMPLETED"
                  ? "bg-green-500"
                  : "bg-yellow-500"
              }`}
            >
              {task.status}
            </span>
          </div>

          <button
            onClick={() => removeTask(task.id)}
            disabled={deletingId === task.id}
            className="text-red-400"
          >
            {deletingId === task.id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;