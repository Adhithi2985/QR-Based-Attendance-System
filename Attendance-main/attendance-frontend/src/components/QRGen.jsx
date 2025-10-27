import React, { useState } from "react";
import axios from "axios";

function QRGen() {
  const [className, setClassName] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [accuracy, setAccuracy] = useState(null);
  const [qrData, setQrData] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const detectLocation = () => {
    setLoadingLocation(true);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const acc = position.coords.accuracy;

        setLatitude(lat.toFixed(6));
        setLongitude(lon.toFixed(6));
        setAccuracy(Math.round(acc));
        setLoadingLocation(false);

        // Stop watching after one accurate fix
        navigator.geolocation.clearWatch(watchId);
      },
      (error) => {
        alert("⚠️ Failed to get location: " + error.message);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleGenerateQR = async () => {
    if (!className || !subjectName || !latitude || !longitude) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/qr/generate", {
        className,
        subjectName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });

      setQrData(response.data.image);
      setQrUrl(response.data.qrValue);
      setExpiresAt(response.data.expiresAt);
    } catch (error) {
      alert("❌ Failed to generate QR Code");
      console.error(error);
    }
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1rem" }}>
      <h3>📍 Generate QR Code with Location</h3>

      <input
        type="text"
        placeholder="Class Name"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        style={{ padding: "0.5rem", marginBottom: "0.5rem", width: "100%" }}
      />
      <input
        type="text"
        placeholder="Subject Name"
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        style={{ padding: "0.5rem", marginBottom: "0.5rem", width: "100%" }}
      />

      <button onClick={detectLocation} disabled={loadingLocation} style={{ marginBottom: "0.5rem" }}>
        {loadingLocation ? "Detecting..." : "📍 Use My Location"}
      </button>

      <input
        type="text"
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        style={{ padding: "0.5rem", marginBottom: "0.5rem", width: "100%" }}
      />
      <input
        type="text"
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        style={{ padding: "0.5rem", marginBottom: "0.5rem", width: "100%" }}
      />

      {accuracy && (
        <p style={{ fontSize: "0.9rem", color: "gray" }}>
          📡 Accuracy: ±{accuracy} meters
        </p>
      )}

      <button onClick={handleGenerateQR} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
        Generate QR Code
      </button>

      {qrData && (
        <div style={{ marginTop: "1.5rem" }}>
          <h4>QR Code Value: {qrUrl}</h4>
          <p>Expires At: {new Date(expiresAt).toLocaleTimeString()}</p>
          <img
            src={`data:image/png;base64,${qrData}`}
            alt="QR Code"
            style={{ width: "250px", height: "250px", border: "1px solid gray" }}
          />
        </div>
      )}
    </div>
  );
}

export default QRGen;