import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    const success = login(username, password, role);

   if (!success) {
  setError("Please enter username, password and select a role");
  return;
}

navigate("/dashboard");

    alert("Login successful!");
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>

        <button type="submit">Login</button>

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export default Login;