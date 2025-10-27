import React from "react";
import { Link, Outlet } from "react-router-dom";
import "./StudentLayout.css"; // Create this for styling

function StudentLayout() {
  return (
    <div className="student-layout">
      <aside className="sidebar">
        <h2>🎓 Student Panel</h2>
        <nav>
          <Link to="/student/profile">👤 Profile</Link>
          <Link to="/student/today-class">📅 Today's Class</Link>
          <Link to="/student/attendance-summary">📊 Attendance Summary</Link>
          <Link to="/student/scan-qr">🔍 Scan QR</Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;