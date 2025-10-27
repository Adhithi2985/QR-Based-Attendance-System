// src/pages/teacher/DailyReportDetailModal.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const DailyReportDetailModal = ({ summary, date, onClose }) => {
  const { timeTableId, className, subjectName, subjectCode, hour } = summary;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchDetails = useCallback(() => {
    if (!timeTableId || !date) return;
    setLoading(true);
    setErr("");
    axios
      .get(
        `http://localhost:8080/api/teacher-report/details/${timeTableId}?date=${date}`
      )
      .then((res) => setStudents(res.data || []))
      .catch((e) => {
        console.error("Error fetching attendance details", e);
        setErr("Failed to load details.");
      })
      .finally(() => setLoading(false));
  }, [timeTableId, date]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Close modal on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const exportCSV = () => {
    if (!students.length) return;
    const header = [
      "Register Number",
      "Student Name",
      "Present",
      "Absent",
      "OD",
    ];
    const rows = students.map((s) => [
      s.registerNumber,
      s.studentName,
      s.present ? "Yes" : "",
      s.absent ? "Yes" : "",
      s.od ? "Yes" : "",
    ]);
    const csv =
      [header, ...rows].map((r) => r.map(escapeCSV).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Attendance_${subjectCode || subjectName}_${date}.csv`;
    link.click();
  };

  const presentCount = students.filter((s) => s.present).length;
  const odCount = students.filter((s) => s.od).length;
  const absentCount = students.filter((s) => s.absent).length;
  const total = students.length;
  const presentPercent =
    total > 0 ? ((presentCount / total) * 100).toFixed(2) : "0.00";

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          zIndex: 9998,
        }}
      />
      <div style={modalWrapper}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0 }}>
            📋 {subjectName} ({subjectCode}) – Hour {hour}
          </h3>
          <button onClick={onClose} style={closeBtn}>
            ✖
          </button>
        </div>
        <p style={{ margin: "6px 0 12px", fontSize: 13, color: "#444" }}>
          Class: <strong>{className}</strong> | Date:{" "}
          <strong>{date}</strong>
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          <Badge color="#2e7d32">Present: {presentCount}</Badge>
          <Badge color="#c62828">Absent: {absentCount}</Badge>
          <Badge color="#f57c00">OD: {odCount}</Badge>
          <Badge color="#1565c0">
            % Present: {presentPercent}%
          </Badge>
          <button
            onClick={exportCSV}
            style={{
              background: "#455a64",
              color: "#fff",
              border: "none",
              padding: "4px 10px",
              borderRadius: 5,
              cursor: "pointer",
            }}
          >
            ⬇ Export CSV
          </button>
        </div>

        {loading && <p>Loading students…</p>}
        {err && <p style={{ color: "crimson" }}>{err}</p>}

        {!loading && !err && (
          <div style={{ overflowX: "auto", maxHeight: "55vh" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Register No</th>
                  <th style={thStyle}>Student Name</th>
                  <th style={thStyle}>Present</th>
                  <th style={thStyle}>Absent</th>
                  <th style={thStyle}>OD</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => (
                  <tr
                    key={s.registerNumber || idx}
                    style={{
                      background: idx % 2 ? "#fafafa" : "#fff",
                    }}
                  >
                    <td style={tdStyle}>{idx + 1}</td>
                    <td style={tdStyle}>{s.registerNumber}</td>
                    <td style={tdStyle}>{s.studentName}</td>
                    <td style={tdStyle}>{s.present && <StatusDot color="#2e7d32" />}</td>
                    <td style={tdStyle}>{s.absent && <StatusDot color="#c62828" />}</td>
                    <td style={tdStyle}>{s.od && <StatusDot color="#f57c00" />}</td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td style={tdStyle} colSpan={6}>
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button onClick={onClose} style={footerCloseBtn}>
            Close
          </button>
        </div>
      </div>
    </>
  );
};

// Helpers / small components
const escapeCSV = (val) => {
  if (val == null) return "";
  const s = String(val);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const StatusDot = ({ color }) => (
  <span
    style={{
      display: "inline-block",
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: color,
      boxShadow: "0 0 0 2px #fff, 0 0 2px rgba(0,0,0,0.3)",
    }}
  ></span>
);

const Badge = ({ color, children }) => (
  <span
    style={{
      background: color,
      color: "#fff",
      padding: "4px 10px",
      borderRadius: 30,
      fontSize: 12,
      display: "inline-flex",
      alignItems: "center",
      fontWeight: 500,
    }}
  >
    {children}
  </span>
);

// Styles
const modalWrapper = {
  position: "fixed",
  top: "6%",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#fff",
  padding: "18px 22px 20px",
  borderRadius: 12,
  boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
  zIndex: 9999,
  width: "min(1000px, 92%)",
  maxHeight: "88vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: 600,
  fontSize: 13.5,
};

const thStyle = {
  position: "sticky",
  top: 0,
  background: "#f1f3f5",
  padding: "8px 10px",
  textAlign: "left",
  fontWeight: 600,
  borderBottom: "2px solid #dcdfe2",
  zIndex: 1,
};

const tdStyle = {
  padding: "7px 10px",
  borderBottom: "1px solid #ececec",
  verticalAlign: "middle",
  fontSize: 13.5,
  lineHeight: 1.3,
};

const closeBtn = {
  background: "transparent",
  border: "none",
  fontSize: 20,
  cursor: "pointer",
  lineHeight: 1,
  color: "#444",
};

const footerCloseBtn = {
  background: "#d32f2f",
  color: "#fff",
  border: "none",
  padding: "8px 18px",
  borderRadius: 6,
  fontSize: 14,
  cursor: "pointer",
  fontWeight: 500,
};

export default DailyReportDetailModal;