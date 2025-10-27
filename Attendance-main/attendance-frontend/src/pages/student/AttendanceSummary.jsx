import React, { useEffect, useState } from "react";
import axios from "axios";

const AttendanceSummary = () => {
  const [data, setData] = useState([]);
  const regNo = localStorage.getItem("registerNumber");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/students/${regNo}/subject-attendance-summary`)
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("❌ Error fetching attendance summary", err);
        alert("Failed to load attendance data");
      });
  }, [regNo]);

  const getPercentageStyle = (percentage) => {
    if (percentage < 75) {
      return { color: "red", fontWeight: "bold" };
    }
    return {};
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 Subject-wise Attendance Summary</h2>
      {data.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            marginTop: "1rem",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
        >
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th>Subject Name</th>
              <th>Subject Code</th>
              <th>Total Periods</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((subject, idx) => {
              const total = subject.totalPeriods ?? 0;
              const present = subject.presentCount ?? subject.attended ?? 0;
              const absent = total - present;
              const percentage =
                subject.percentage ?? subject.attendancePercentage ?? (total > 0 ? (present / total) * 100 : 0);

              return (
                <tr key={idx}>
                  <td>{subject.subjectName ?? "N/A"}</td>
                  <td>{subject.subjectCode ?? "N/A"}</td>
                  <td>{total}</td>
                  <td>{present}</td>
                  <td>{absent}</td>
                  <td style={getPercentageStyle(percentage)}>
                    {percentage.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceSummary;