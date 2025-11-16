// src/component/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const loc = useLocation();
  const isActive = (path) => loc.pathname === path;

  return (
    <aside className="sidebar-container">
      <nav className="sidebar-nav">
        {/* Home now goes to /home instead of / */}
        <Link
          to="/home"
          className={`sidebar-item ${isActive("/home") ? "active" : ""}`}
        >
          <span className="material-symbols-outlined">home</span>
          <span className="label">Home</span>
        </Link>

        <Link
          to="/library"
          className={`sidebar-item ${isActive("/library") ? "active" : ""}`}
        >
          <span className="material-symbols-outlined">library_books</span>
          <span className="label">Library</span>
        </Link>

        <Link
          to="/profile"
          className={`sidebar-item ${isActive("/profile") ? "active" : ""}`}
        >
          <span className="material-symbols-outlined">person</span>
          <span className="label">Profile</span>
        </Link>

        <div style={{ flex: 1 }} />

        {/* Logout left unchanged (no navigation, same as your original code) */}
        <div className="sidebar-item logout">
          <span className="material-symbols-outlined">logout</span>
          <span className="label">Logout</span>
        </div>
      </nav>
    </aside>
  );
}
