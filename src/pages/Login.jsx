import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthShell from "./AuthShell";

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Enter your username and password.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", username);
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === "string" && data
          ? data
          : data?.message || "Login failed. Check your details and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back. Pick up where you left off."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="login-user" className="mb-1.5 block text-xs font-medium text-slate-700">
            Username
          </label>
          <input id="login-user" value={username} onChange={(e) => setUsername(e.target.value)}
            autoComplete="username" placeholder="your username" className={field} />
        </div>

        <div>
          <label htmlFor="login-pass" className="mb-1.5 block text-xs font-medium text-slate-700">
            Password
          </label>
          <input id="login-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" placeholder="••••••••" className={field} />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
        )}

        <button type="submit" disabled={busy}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm
                     transition hover:bg-indigo-700 disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-slate-400">
          The server sleeps when idle — the first sign-in can take up to a minute.
        </p>
      </form>
    </AuthShell>
  );
}
