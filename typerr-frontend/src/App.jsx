// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./component/Header";
import Sidebar from "./component/Sidebar";

import Home from "./pages/Home";
import BlogView from "./pages/BlogView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateEditBlog from "./pages/CreateEditBlog";
import Library from "./pages/Library";
import Profile from "./pages/Profile";

export default function App() {
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
              <Route path="/" element={<Home />} />
              <Route path="/blog/:id" element={<BlogView />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create" element={<CreateEditBlog />} />
              <Route path="/library" element={<Library />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
