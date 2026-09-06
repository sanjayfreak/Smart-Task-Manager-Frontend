import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthShell from "./AuthShell";

const field = "field";

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
          <Link to="/" className="font-medium text-[#8a5a3c] hover:text-[#70472f]">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="reg-user" className="mb-1.5 block text-xs font-medium text-[#4a4338]">
            Username
          </label>
          <input id="reg-user" value={username} onChange={(e) => setUsername(e.target.value)}
            autoComplete="username" placeholder="pick a username" className={field} />
        </div>

        <div>
          <label htmlFor="reg-pass" className="mb-1.5 block text-xs font-medium text-[#4a4338]">
            Password
          </label>
          <input id="reg-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password" placeholder="at least 6 characters" className={field} />
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-[#f8e7e2] px-3 py-2 text-xs text-[#b0472f]">{error}</p>
        )}
        {notice && (
          <p role="status" className="rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800">{notice}</p>
        )}

        <button type="submit" disabled={busy}
          className="w-full rounded-md bg-[#8a5a3c] py-2.5 text-sm font-medium text-white shadow-sm
                     transition hover:bg-[#70472f] disabled:opacity-60">
          {busy ? "Creating…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
