import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthShell from "./AuthShell";

const field =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 " +
  "placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Choose a username and password.");
      return;
    }
    if (password.length < 6) {
      setError("Use at least 6 characters for your password.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await API.post("/auth/register", { username, password });
      setNotice("Account created. Taking you to sign in…");
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === "string" && data
          ? data
          : data?.message || "Registration failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Set up your workspace in a few seconds."
      footer={
        <>
          Already registered?{" "}
          <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="reg-user" className="mb-1.5 block text-xs font-medium text-slate-700">
            Username
          </label>
          <input id="reg-user" value={username} onChange={(e) => setUsername(e.target.value)}
            autoComplete="username" placeholder="pick a username" className={field} />
        </div>

        <div>
          <label htmlFor="reg-pass" className="mb-1.5 block text-xs font-medium text-slate-700">
            Password
          </label>
          <input id="reg-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password" placeholder="at least 6 characters" className={field} />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
        )}
        {notice && (
          <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{notice}</p>
        )}

        <button type="submit" disabled={busy}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white shadow-sm
                     transition hover:bg-indigo-700 disabled:opacity-60">
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
