import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function handleLoginClick() {
    navigate("/home");
  }

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

        <div style={{ textAlign: "left" }}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>

        <button
          onClick={handleLoginClick}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login
        </button>

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
