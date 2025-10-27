import React, { useEffect, useState } from "react";
import axios from "axios";

const MyClasses = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/classes");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching class sessions:", error);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">🕓 Class Sessions</h2>
      <table className="w-full table-auto border border-gray-200 shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Subject</th>
            <th className="px-4 py-2">Start Time</th>
            <th className="px-4 py-2">End Time</th>
            <th className="px-4 py-2">Classroom</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id} className="text-center border-t">
              <td className="px-4 py-2">{cls.subject}</td>
              <td className="px-4 py-2">{cls.startTime?.replace("T", " ")}</td>
              <td className="px-4 py-2">{cls.endTime?.replace("T", " ")}</td>
              <td className="px-4 py-2">{cls.classroomCode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyClasses;