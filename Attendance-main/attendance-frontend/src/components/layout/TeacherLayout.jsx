// src/components/layout/TeacherLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./TeacherLayout.css";

function TeacherLayout() {
  return (
    <div className="teacher-layout">
      <aside className="sidebar">
        <h2>📚 Teacher Panel</h2>
        <nav>
          <Link to="/teacher/profile">👤 Profile</Link>
          <Link to="/teacher/classes">📘 Classes</Link>
          <Link to="/teacher/students">🧑‍🎓 Students</Link>
          <Link to="/teacher/attendance">📊 Attendance</Link>
          <Link to="/teacher/generate-qr">🔲 QR Generator</Link>
          <Link to="/teacher/qr-history">📜 QR History</Link>
          <Link to="/teacher/reports">📄 Reports</Link>
          <Link to="/teacher/daily-report">📄Daily Reports</Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default TeacherLayout;