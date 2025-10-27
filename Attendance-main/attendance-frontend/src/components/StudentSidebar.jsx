import React from 'react';
import { NavLink } from 'react-router-dom';

const StudentSidebar = () => {
  const linkClasses = ({ isActive }) =>
    isActive
      ? 'text-yellow-300 font-semibold'
      : 'hover:text-yellow-200 transition-colors';

  return (
    <div className="w-64 h-screen fixed bg-indigo-900 text-white p-6">
      <h2 className="text-xl font-bold mb-8">🎓 Student Panel</h2>
      <ul className="space-y-6">
        <li>
          <NavLink to="/student/profile">🙋‍♂️ Profile</NavLink>
          <NavLink to="/student/today-class">📅 Today's Class</NavLink>
          <NavLink to="/student/attendance-summary">📊 Attendance</NavLink>
        </li>
        <li>
          <NavLink to="/student/profile" className={linkClasses}>
            🙋‍♂️ Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/student/today-class" className={linkClasses}>
            📚 Today's Class
          </NavLink>
        </li>
        <li>
          <NavLink to="/student/attendance" className={linkClasses}>
            📊 Attendance Summary
          </NavLink>
        </li>
        <li>
          <NavLink to="/student/scan-qr" className={linkClasses}>
            🔍 Scan QR
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default StudentSidebar;