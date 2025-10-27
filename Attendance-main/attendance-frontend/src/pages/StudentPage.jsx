import QRScanner from "../components/QRScanner";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentPage() {
  const [scannedData, setScannedData] = useState(null);
  const [status, setStatus] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [gpsStatus, setGpsStatus] = useState("📡 Waiting for GPS...");
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [accuracy, setAccuracy] = useState(null);
  const [isScanningAllowed, setIsScanningAllowed] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (!userData || role !== "student") {
      alert("Please login as a student to continue");
      navigate("/");
      return;
    }

    try {
      const user = JSON.parse(userData);
      const regNo = user.registerNumber || user.id || "";
      if (regNo.trim()) {
        setRegisterNumber(regNo.trim());
        console.log("✅ Loaded student register number:", regNo);
        setIsReady(true);
      } else {
        throw new Error("Register number missing");
      }
    } catch (e) {
      console.error("❌ Error loading user data:", e);
      alert("Something went wrong. Please login again.");
      navigate("/");
    }
  }, [navigate]);

  const handleScan = (qrValue) => {
    if (!isReady || !registerNumber.trim()) {
      setStatus("❌ Register number not loaded. Please refresh or login again.");
      return;
    }

    if (!qrValue || !isScanningAllowed) return;

    setStatus("📍 Fetching your current location...");
    setGpsStatus("⏳ Detecting GPS location...");
    setIsScanningAllowed(false);

    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          alert("❌ Location permission denied. Enable location and try again.");
          setGpsStatus("❌ Permission denied.");
          setIsScanningAllowed(true);
        }
      });
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        console.log("📍 Live GPS Location:", latitude, longitude, "📏 Accuracy:", accuracy, "m");

        setLocation({ latitude, longitude });
        setAccuracy(accuracy);

        const trimmedQRValue = qrValue.trim();
        const trimmedRegisterNumber = registerNumber.trim();
        setScannedData(trimmedQRValue);

        try {
          const response = await axios.post("http://localhost:8080/api/attendance/mark", {
            registerNumber: trimmedRegisterNumber,
            qrValue: trimmedQRValue,
            latitude,
            longitude,
          });

          if (response.status === 200) {
            setStatus("✅ " + response.data);
          } else {
            setStatus("⚠️ Unexpected response");
          }

          navigator.geolocation.clearWatch(watchId);
        } catch (err) {
          console.error("❌ Error:", err.response?.data || err.message);
          let errorMsg = "Network or server error";
          if (err.response?.data) {
            const data = err.response.data;
            errorMsg = typeof data === "object" ? JSON.stringify(data) : data;
          }
          setStatus("❌ " + errorMsg);
          navigator.geolocation.clearWatch(watchId);
        } finally {
          setGpsStatus("📡 Location fetched.");
        }
      },
      (error) => {
        console.error("❌ Location Error:", error.message);
        setGpsStatus("❌ Please enable location access to mark attendance.");
        setStatus("❌ Location access denied. Turn on GPS and try again.");
        setIsScanningAllowed(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {registerNumber || "Student"}</h2>

      {isReady ? (
        <>
          <QRScanner onScanSuccess={handleScan} />
          <p style={{ fontSize: "0.9rem", color: "gray", marginTop: "0.5rem" }}>{gpsStatus}</p>
        </>
      ) : (
        <p>⏳ Loading student info...</p>
      )}

      {scannedData && (
        <p style={{ marginTop: "1rem" }}>
          Scanned Data: <strong>{scannedData}</strong>
        </p>
      )}

      {location.latitude !== null && location.longitude !== null && (
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "gray" }}>
          📍 Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          {accuracy && <span> (±{Math.round(accuracy)} m)</span>}
        </p>
      )}

      {status && (
        <p
          style={{
            color: status.startsWith("✅") ? "green" : "red",
            marginTop: "1rem",
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default StudentPage;