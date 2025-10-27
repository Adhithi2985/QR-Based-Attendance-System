import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function AttendanceReport() {
  const { qrCodeId } = useParams();
  const [report, setReport] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/attendance/report/${qrCodeId}`)
      .then((res) => setReport(res.data))
      .catch((err) => {
        console.error("❌ Failed to load attendance report", err);
        alert("Could not load attendance report");
      });
  }, [qrCodeId]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📄 Attendance Report</h2>
      <p>
        <Link to="/teacher/qr-history">← Back to QR History</Link>
      </p>
      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Register Number</th>
            <th>Status</th>
            <th>Marked At</th>
          </tr>
        </thead>
        <tbody>
          {report.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No attendance marked for this QR code.
              </td>
            </tr>
          ) : (
            report.map((entry, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{entry.registerNumber}</td>
                <td>{entry.status || "Present"}</td>
                <td>{new Date(entry.markedAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AttendanceReport;