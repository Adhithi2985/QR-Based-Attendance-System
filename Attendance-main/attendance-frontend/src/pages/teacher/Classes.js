import { useEffect, useState } from "react";
import axios from "axios";

function Classes() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const teacherId = JSON.parse(localStorage.getItem("user"))?.id;
    axios
      .get(`http://localhost:8080/api/classes/teacher/${teacherId}`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">🏫 Classes Handled</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Class Name</th>
            <th className="p-2">Year</th>
            <th className="p-2">Department</th>
            <th className="p-2">Section</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls.id} className="text-center">
              <td className="p-2">{cls.name}</td>
              <td className="p-2">{cls.year}</td>
              <td className="p-2">{cls.department}</td>
              <td className="p-2">{cls.section}</td>
              <td className="p-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded">
                  View Students
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Classes;