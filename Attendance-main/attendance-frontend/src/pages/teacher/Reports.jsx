import React, { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
  const [records, setRecords] = useState([]);
  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [date, setDate] = useState("");

  const fetchRecords = async () => {
    try {
      const params = {};
      if (className) params.className = className;
      if (subjectName) params.subjectName = subjectName;
      if (date) params.date = date;

      const res = await axios.get("http://localhost:8080/api/attendance/all", { params });
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching records", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📄 All Attendance Records</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Class Name (e.g., CSE-A)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subject (e.g., Java)"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={fetchRecords}>🔍 Filter</button>
      </div>

      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Register No</th>
            <th>Class</th>
            <th>Subject</th>
            <th>QR Value</th>
            <th>Marked At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>No records found</td>
            </tr>
          ) : (
            records.map((rec, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{rec.registerNumber}</td>
                <td>{rec.className}</td>
                <td>{rec.subjectName}</td>
                <td>{rec.qrValue}</td>
                <td>{new Date(rec.markedAt).toLocaleString()}</td>
                <td>{rec.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;