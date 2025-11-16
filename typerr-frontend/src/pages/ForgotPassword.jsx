import React from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
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
          Forgot password
        </h3>

        <div style={{ textAlign: "left" }}>
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Enter your email and we'll send you a reset link.
          </p>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
          />
        </div>

        <button
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
          Send reset link
        </button>

        <p style={{ marginTop: "10px", textAlign: "left", fontSize: "14px" }}>
          Remembered your password?{" "}
          <Link to="/login" style={{ color: "blue" }}>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
