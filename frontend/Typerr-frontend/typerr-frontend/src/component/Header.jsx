// src/component/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">TYPERR</div>
          <div className="header-right">
            <button
              className="profile-btn"
              title="Profile"
              onClick={() => navigate("/profile")}
              aria-label="Open profile"
            >
              <span className="material-symbols-outlined profile-icon">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <div className="header-divider" />
    </>
  );
}
