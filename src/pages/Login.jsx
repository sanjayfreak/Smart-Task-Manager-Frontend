import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Enter all fields");
      return;
    }

    try {
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="p-6 bg-gray-800 rounded w-80">
        <h2 className="text-xl mb-4">Login</h2>

        <input
          type="text"
          placeholder="Username"        /* ✅ changed from Email */
          value={username}
          className="w-full p-2 mb-3 text-black rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          className="w-full p-2 mb-3 text-black rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="bg-blue-500 w-full p-2 rounded hover:bg-blue-600">
          Login
        </button>

        <p
          className="mt-3 text-sm cursor-pointer text-blue-400"
          onClick={() => navigate("/register")}
        >
          Create account
        </p>
      </form>
    </div>
  );
}

export default Login;