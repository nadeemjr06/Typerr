import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/login', {
        email,
        password
      });

      // Store token and user data
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to home
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f2f2f2",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "320px",
          backgroundColor: "#d9d9d9",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "20px", whiteSpace: "nowrap" }}>
          Login to your account
        </h3>

        {error && (
          <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: loading ? "#666" : "black",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: "left", marginTop: "8px", fontSize: "14px" }}>
          <Link to="/forgot-password" style={{ color: "blue" }}>
            Forgot password?
          </Link>
        </p>

        <p style={{ marginTop: "10px", textAlign: "left", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "blue" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
