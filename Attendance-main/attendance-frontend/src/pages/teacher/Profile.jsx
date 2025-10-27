import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [teacher, setTeacher] = useState(null);
  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    if (teacherId) {
      axios.get(`http://localhost:8080/api/teachers/${teacherId}`)
        .then((res) => {
          setTeacher(res.data);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch profile:", err);
        });
    }
  }, [teacherId]);

  if (!teacher) return <div>🔄 Loading profile...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>
      <p><strong>Name:</strong> {teacher.name}</p>
      <p><strong>ID:</strong> {teacher.teacherId}</p>
      <p><strong>Email:</strong> {teacher.email}</p>
      {/* Add more fields if needed */}
    </div>
  );
}

export default Profile;