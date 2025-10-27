// src/pages/teacher/DailyReport.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DailyReportDetailModal from "./DailyReportDetailModal";

const DailyReport = () => {
  const [classes, setClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null); // store whole summary dto

  const teacherId = localStorage.getItem("teacherId");

  const fetchClasses = useCallback(() => {
    if (!teacherId || !selectedDate) return;
    setLoading(true);
    setError("");
    axios
      .get(
        `http://localhost:8080/api/teacher-report/classes/${teacherId}?date=${selectedDate}`
      )
      .then((res) => {
        setClasses(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching classes", err);
        setError("Failed to load classes. Try again.");
      })
      .finally(() => setLoading(false));
  }, [teacherId, selectedDate]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const openDetails = (cls) => {
    setSelectedClass(cls);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>📅 Daily Attendance Report</h2>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontWeight: 500 }}>
          Select Date:&nbsp;
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: "4px 8px",
              border: "1px solid #bbb",
              borderRadius: 4,
            }}
          />
        </label>
        <button
            onClick={fetchClasses}
            style={{
              background: "#1976d2",
              color: "#fff",
              border: "none",
              padding: "6px 14px",
              borderRadius: 6,
              cursor: "pointer",
            }}
        >
          🔄 Refresh
        </button>
      </div>

      {loading && <p>Loading classes…</p>}
      {error && (
        <p style={{ color: "crimson", fontWeight: 500, marginTop: "0.5rem" }}>
          {error}
        </p>
      )}

      {!loading && !error && classes.length === 0 && (
        <p style={{ marginTop: "0.75rem" }}>No classes found for this date.</p>
      )}

      {classes.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 680,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f5f6f8",
                  borderBottom: "2px solid #ddd",
                }}
              >
                <th style={thStyle}>Class</th>
                <th style={thStyle}>Subject Code</th>
                <th style={thStyle}>Subject</th>
                <th style={thStyle}>Hour</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, idx) => (
                <tr
                  key={cls.timeTableId}
                  style={{
                    background: idx % 2 ? "#fafafa" : "#fff",
                    transition: "background .15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#eef6ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      idx % 2 ? "#fafafa" : "#fff")
                  }
                >
                  <td style={tdStyle}>{cls.className}</td>
                  <td style={tdStyle}>{cls.subjectCode}</td>
                  <td style={tdStyle}>{cls.subjectName}</td>
                  <td style={tdStyle}>{cls.hour}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => openDetails(cls)}
                      style={viewBtn}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedClass && (
        <DailyReportDetailModal
          summary={selectedClass}
            // pass date from summary OR selectedDate
          date={selectedDate}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// Reusable style objects
const thStyle = {
  padding: "10px 12px",
  textAlign: "left",
  fontSize: 14,
  fontWeight: 600,
  borderRight: "1px solid #e1e4e8",
};

const tdStyle = {
  padding: "8px 12px",
  fontSize: 14,
  borderTop: "1px solid #eee",
  borderRight: "1px solid #f2f2f2",
  whiteSpace: "nowrap",
};

const viewBtn = {
  background: "#1976d2",
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  fontSize: 13,
  borderRadius: 6,
  cursor: "pointer",
  boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
};

export default DailyReport;