import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthShell from "./AuthShell";

const field = "field";

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
          <Link to="/register" className="font-medium text-[#8a5a3c] hover:text-[#70472f]">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="login-user" className="mb-1.5 block text-xs font-medium text-[#4a4338]">
            Username
          </label>
          <input id="login-user" value={username} onChange={(e) => setUsername(e.target.value)}
            autoComplete="username" placeholder="your username" className={field} />
        </div>

        <div>
          <label htmlFor="login-pass" className="mb-1.5 block text-xs font-medium text-[#4a4338]">
            Password
          </label>
          <input id="login-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" placeholder="••••••••" className={field} />
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-[#f8e7e2] px-3 py-2 text-xs text-[#b0472f]">{error}</p>
        )}

        <button type="submit" disabled={busy}
          className="w-full rounded-md bg-[#8a5a3c] py-2.5 text-sm font-medium text-white shadow-sm
                     transition hover:bg-[#70472f] disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="text-center text-[11px] leading-relaxed text-[#a89c84]">
          The server sleeps when idle — the first sign-in can take up to a minute.
        </p>
      </form>
    </AuthShell>
  );
}
