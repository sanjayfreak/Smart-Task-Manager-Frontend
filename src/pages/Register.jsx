import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Enter all fields");
      return;
    }

    try {
      const res = await API.post("/auth/register", { username, password });
      alert(res.data);   // ✅ backend returns plain string "Registered Successfully"
      navigate("/");
    } catch (err) {
      // ✅ Fix: extract message properly from Spring error response
      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Registration failed";
      alert(msg);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <div className="p-6 bg-gray-800 rounded w-80">
        <h2 className="text-xl mb-4">Register</h2>

        <input
          placeholder="Username"
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

        <button
          className="bg-green-500 w-full p-2 rounded hover:bg-green-600"
          onClick={handleRegister}
        >
          Register
        </button>

        <p
          className="mt-3 text-sm cursor-pointer text-blue-400"
          onClick={() => navigate("/")}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

export default Register;