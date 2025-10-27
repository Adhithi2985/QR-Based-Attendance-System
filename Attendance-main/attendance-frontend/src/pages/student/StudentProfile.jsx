import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const regNo = localStorage.getItem("registerNumber");

  useEffect(() => {
    if (regNo) {
      axios
        .get(`http://localhost:8080/api/students/${regNo}`)
        .then((res) => setStudent(res.data))
        .catch((err) => console.error("Error fetching student:", err));
    }
  }, [regNo]);

  if (!student) {
    return <div className="p-6">Loading student profile...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🙋‍♂️ Student Profile</h2>
      <p><strong>Name:</strong> {student.name}</p>
      <p><strong>Register Number:</strong> {student.registerNumber}</p>
      <p><strong>Department:</strong> {student.department}</p>
      <p><strong>Year:</strong> {student.year}</p>
      <p><strong>Section:</strong> {student.section}</p>
    </div>
  );
};

export default StudentProfile;