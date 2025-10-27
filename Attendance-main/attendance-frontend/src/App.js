import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import StudentLogin from "./components/StudentLogin";
import TeacherLayout from "./components/layout/TeacherLayout";
import StudentLayout from "./components/layout/StudentLayout";
import Profile from "./pages/teacher/Profile";
import Dashboard from "./pages/teacher/Dashboard";
import MyClasses from "./pages/teacher/MyClasses";
import QRGenerator from "./pages/teacher/QRGenerator";
import QRHistory from "./pages/teacher/QRHistory";
import AttendanceReport from "./pages/teacher/AttendanceReport";
import Reports from "./pages/teacher/Reports";
import Students from "./pages/teacher/Students";
import TodayClass from "./pages/student/TodayClass";
import AttendanceSummary from "./pages/student/AttendanceSummary";
import StudentProfile from "./pages/student/StudentProfile";
import ScanQRPage from "./pages/student/ScanQRPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DailyReport from "./pages/teacher/DailyReport";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/student-login" element={<StudentLogin />} />

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="today-class" element={<TodayClass />} />
          <Route path="attendance-summary" element={<AttendanceSummary />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="scan-qr" element={<ScanQRPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="classes" element={<MyClasses />} />
          <Route path="generate-qr" element={<QRGenerator />} />
          <Route path="qr-history" element={<QRHistory />} />
          <Route path="reports/:qrCodeId" element={<AttendanceReport />} />
          <Route path="reports" element={<Reports />} />
          <Route path="students" element={<Students />} />
          <Route path="daily-report" element={<DailyReport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;