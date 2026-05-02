import { useEffect, useState } from "react";
import { getTasks, createTask, deleteTask } from "../services/TaskService";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task) => {
    try {
      setAdding(true);
      const res = await createTask(task);

      // ✅ Optimistic update
      setTasks((prev) => [...prev, res.data]);
    } catch (err) {
      console.log("ADD ERROR:", err);
    } finally {
      setAdding(false);
    }
  };

  const removeTask = async (id) => {
    try {
      setDeletingId(id);

      // ✅ Optimistic delete
      setTasks((prev) => prev.filter((t) => t.id !== id));

      await deleteTask(id);
    } catch (err) {
      console.log("DELETE ERROR:", err);
      fetchTasks(); // rollback
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    adding,
    deletingId,
    addTask,
    removeTask,
  };
};