// src/pages/student/StudentDashboard.jsx
import React from "react";
import TodayClass from "../../components/student/TodayClass";
import AttendanceSummary from "../../components/student/AttendanceSummary"; // if you have
import StudentProfile from "../../components/student/StudentProfile"; // if you have

const StudentDashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">👨‍🎓 Student Dashboard</h2>

      <StudentProfile />
      <TodayClass />
      <AttendanceSummary />
    </div>
  );
};

export default StudentDashboard;