// src/pages/teacher/QRHistory.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function QRHistory() {
  const [qrCodes, setQrCodes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/qr/history")
      .then((res) => setQrCodes(res.data))
      .catch((err) => {
        console.error("❌ Error fetching QR history", err);
        alert("Failed to load QR History");
      });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📜 QR Code History</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>QR Value</th>
            <th>Class</th>
            <th>Subject</th>
            <th>Generated At</th>
            <th>Expires At</th>
            <th>Report</th>
          </tr>
        </thead>
        <tbody>
          {qrCodes.map((qr) => (
            <tr key={qr.id}>
              <td>{qr.qrValue}</td>
              <td>{qr.className}</td>
              <td>{qr.subjectName}</td>
              <td>{new Date(qr.generatedAt).toLocaleString()}</td>
              <td>{new Date(qr.expiresAt).toLocaleString()}</td>
              <td>
                <Link to={`/teacher/reports/${qr.id}`}>View Report</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QRHistory;