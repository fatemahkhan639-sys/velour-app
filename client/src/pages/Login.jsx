import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/auth/login", form);
      localStorage.setItem("velour_token", data.token);
      localStorage.setItem("velour_user", JSON.stringify(data.user));
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 24px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Sign in</h1>
      <p style={{ color: "#999", marginBottom: 32 }}>Welcome back to Velour</p>
      <form
        onSubmit={handle}
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
      >
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{
            padding: "12px 16px",
            border: "1px solid #ddd",
            borderRadius: 8,
            fontSize: 14,
          }}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{
            padding: "12px 16px",
            border: "1px solid #ddd",
            borderRadius: 8,
            fontSize: 14,
          }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "13px",
            background: "#1a1a1a",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Sign in
        </button>
      </form>
      <p
        style={{
          marginTop: 24,
          textAlign: "center",
          fontSize: 14,
          color: "#666",
        }}
      >
        No account?{" "}
        <Link to="/register" style={{ color: "#1a1a1a", fontWeight: 600 }}>
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
