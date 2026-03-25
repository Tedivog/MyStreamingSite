import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await loginUser(data.email, data.password);
      console.log("here");
      if (res.token) {
        localStorage.setItem("token", res.token);  // store JWT
        navigate("/"); // redirect to home
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

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

        <button onClick={handleSubmit}>Login</button>

        <p style={{ marginTop: "15px" }}>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
