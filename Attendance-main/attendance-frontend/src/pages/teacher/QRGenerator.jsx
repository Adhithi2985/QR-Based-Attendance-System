import { useState } from "react";
import axios from "axios";

function QRGenerator() {
  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [qrData, setQrData] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  const handleGenerate = () => {
    if (!className || !subjectName) {
      alert("Please enter class name and subject name");
      return;
    }

    setLoading(true);
    setLocationError("");
    setQrData(null);
    setImageBase64("");

    if (!navigator.geolocation) {
      setLocationError("❌ Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const acc = position.coords.accuracy;

        setLatitude(lat);
        setLongitude(lon);
        setAccuracy(acc);

        console.log("📍 Accurate Teacher Location:", lat, lon, `±${Math.round(acc)}m`);

        try {
          const response = await axios.post("http://localhost:8080/api/qr/generate", {
            className,
            subjectName,
            latitude: lat,
            longitude: lon,
          });

          setQrData(response.data);
          setImageBase64(response.data.image);
        } catch (err) {
          console.error("QR generation error:", err);
          alert("❌ Failed to generate QR code. Please check backend or console.");
        } finally {
          setLoading(false);
          navigator.geolocation.clearWatch(watchId); // stop watching
        }
      },
      (error) => {
        console.error("❌ Location access error:", error);
        setLocationError("❌ Please allow GPS location access in your browser settings.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Welcome, Teacher 👨‍🏫</h2>

      <label>Class Name:</label>
      <input
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        placeholder="e.g., CSE-A"
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />

      <label>Subject Name:</label>
      <input
        type="text"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        placeholder="e.g., Java"
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />

      {locationError && (
        <p style={{ color: "red", marginBottom: "1rem" }}>{locationError}</p>
      )}

      <button onClick={handleGenerate} style={{ padding: "0.5rem 1rem" }} disabled={loading}>
        {loading ? "⏳ Generating..." : "Generate QR Code"}
      </button>

      {qrData && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <img
            src={`data:image/png;base64,${imageBase64}`}
            alt="Generated QR"
            style={{ width: "250px", height: "250px", marginBottom: "1rem", border: "1px solid #ccc" }}
          />
          <p><strong>QR Value:</strong> {qrData.qrValue}</p>
          <p><strong>Class:</strong> {qrData.className}</p>
          <p><strong>Subject:</strong> {qrData.subjectName}</p>
          <p><strong>Expires At:</strong> {new Date(qrData.expiresAt).toLocaleTimeString()}</p>
          <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "gray" }}>
            📍 Classroom Location:{" "}
            <a
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {latitude?.toFixed(6)}, {longitude?.toFixed(6)} {accuracy && ` (±${Math.round(accuracy)} m)`}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export default QRGenerator;