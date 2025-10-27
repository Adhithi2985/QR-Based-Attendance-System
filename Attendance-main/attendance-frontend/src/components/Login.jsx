import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ritLogo from "../assets/rit-logo.jpg";
import "../styles/Login.css";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Normalize / format a teacher id.
   * Rules:
   *  - If already starts with 'T' (any case) -> uppercase whole string.
   *  - If only digits -> zero-pad to at least 3 and prefix with 'T'.
   *  - Else just uppercase trimmed.
   */
  const formatTeacherId = (raw) => {
    if (!raw) return "";
    const trimmed = raw.toString().trim();
    if (/^t/i.test(trimmed)) {
      return trimmed.toUpperCase();
    }
    if (/^\d+$/.test(trimmed)) {
      // numeric only
      const padded = trimmed.padStart(3, "0"); // adjust length if you need
      return `T${padded}`;
    }
    return trimmed.toUpperCase();
  };

  const formatRegisterNumber = (raw) =>
    raw ? raw.toString().trim().toUpperCase() : "";

  const clearSessionKeys = () => {
    [
      "role",
      "token",
      "name",
      "teacherId",
      "teacherName",
      "registerNumber",
    ].forEach((k) => localStorage.removeItem(k));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    const payload = {
      id: userId.trim(),
      password,
      role,
    };

    setLoading(true);
    clearSessionKeys();

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        payload
      );

      const data = res.data || {};

      if (res.status === 200 && data.status === "success") {
        // Common storage
        localStorage.setItem("role", role);
        if (data.token) localStorage.setItem("token", data.token);
        if (data.name) localStorage.setItem("name", data.name);

        if (role === "student") {
          const registerNumber =
            formatRegisterNumber(data.registerNumber || data.id || payload.id);
            localStorage.setItem("registerNumber", registerNumber);
          navigate("/student");
        } else {
          let teacherId =
            data.teacherId ||
            data.internalId ||
            data.id ||
            payload.id;
          teacherId = formatTeacherId(teacherId);
          localStorage.setItem("teacherId", teacherId);
          if (data.name) localStorage.setItem("teacherName", data.name);
          navigate("/teacher");
        }

        // Optional toast/alert
        // alert(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful`);
      } else {
        alert(data.message || "Login failed. Check credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Invalid credentials or server error.";
      alert(backendMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <img src={ritLogo} alt="RIT Logo" className="logo" />
        <h2>Rajalakshmi Institute of Technology</h2>
        <p>Believe in the Possibilities</p>

        <form onSubmit={handleLogin}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
            required
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <input
            type="text"
            placeholder={role === "student" ? "Register Number" : "Teacher ID"}
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={loading}
            required
          />

            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;