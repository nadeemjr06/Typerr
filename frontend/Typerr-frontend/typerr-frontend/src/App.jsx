// src/App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./component/Header";
import Sidebar from "./component/Sidebar";

import Home from "./pages/Home";
import BlogView from "./pages/BlogView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import CreateEditBlog from "./pages/CreateEditBlog";
import MyBlogs from "./pages/MyBlogs";
import Library from "./pages/Library";
// import Profile from "./pages/Profile";

export default function App() {
  const location = useLocation();

  // login, register, forgot-password, and root ("/") are auth pages
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password";

  // For auth pages, don't show Header + Sidebar
  if (isAuthPage) {
    return (
      <main
        style={{
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
    );
  }

  // For other pages, show normal layout with Header + Sidebar
  return (
    <>
      <Header />

      <div className="page-shell">
        <div className="left-column">
          <Sidebar />
        </div>

        <div className="vertical-divider" />

        <div className="main-column">
          <main className="main-scroll">
            <Routes>
              {/* Home is now at /home */}
              <Route path="/home" element={<Home />} />
              <Route path="/blog/:id" element={<BlogView />} />
              <Route path="/create" element={<CreateEditBlog />} />
              <Route path="/my-blogs" element={<MyBlogs />} />
              <Route path="/library" element={<Library />} />
              {/* <Route path="/profile" element={<Profile />} /> */}
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
