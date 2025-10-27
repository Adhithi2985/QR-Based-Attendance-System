import React, { useEffect, useState } from "react";
import axios from "axios";

function TodayClass() {
  const [classes, setClasses] = useState([]);
  const regNo = localStorage.getItem("registerNumber");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/timetable/student/${regNo}/today`)
      .then((res) => setClasses(res.data))
      .catch((err) => {
        console.error("❌ Error fetching today's classes", err);
        alert("Failed to load today's classes");
      });
  }, [regNo]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📅 Today's Classes</h2>

      {classes.length === 0 ? (
        <p>No classes scheduled for today.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f5f5f5" }}>
            <tr>
              <th>Period</th>
              <th>Subject</th>
              <th>Subject Code</th>
              <th>Year</th>
              <th>Department</th>
              <th>Section</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls, index) => (
              <tr key={index}>
                <td>{cls.hour}</td>
                <td>{cls.subjectName}</td>
                <td>{cls.subjectCode}</td>
                <td>{cls.year}</td>
                <td>{cls.department}</td>
                <td>{cls.section}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TodayClass;