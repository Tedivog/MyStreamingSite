import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      await registerUser(data.username, data.email, data.password);
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError("Registration failed. Email may already exist.");
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2>Create Account</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button onClick={handleSubmit}>Register</button>

        <p style={{ marginTop: "15px" }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
