import React, { useState } from "react";
import axios from "axios";

function Students() {
  const [year, setYear] = useState("");
  const [department, setDepartment] = useState("");
  const [section, setSection] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    if (!year || !department || !section) {
      alert("❗ Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/student/class", {
        params: {
          year,
          department,
          section,
        },
      });
      setStudents(response.data);
    } catch (error) {
      alert("❌ Failed to fetch students");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 className="text-xl font-bold mb-4">🧑‍🎓 Students in Class</h2>

      <div className="mb-4 grid grid-cols-3 gap-4 max-w-xl">
        <input
          type="text"
          placeholder="Year (e.g., II)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Department (e.g., CSE)"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Section (e.g., A)"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="border p-2"
        />
      </div>

      <button
        onClick={fetchStudents}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Loading..." : "📋 View Students"}
      </button>

      {students.length > 0 && (
        <table className="mt-6 w-full border text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Reg No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
            </tr>
          </thead>
          <tbody>
            {students.map((stu) => (
              <tr key={stu.id}>
                <td className="border p-2">{stu.registerNumber}</td>
                <td className="border p-2">{stu.name}</td>
                <td className="border p-2">{stu.email}</td>
                <td className="border p-2">{stu.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Students;