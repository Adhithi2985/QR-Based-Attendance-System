import React, { useState } from "react";
import QRScanner from "./QRScanner"; // same folder

function ScanQRPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedText, setScannedText] = useState("");
  const [marking, setMarking] = useState(false);
  const [markResult, setMarkResult] = useState(null);

  // GPS
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [locError, setLocError] = useState(null);

  const registerNumber = localStorage.getItem("registerNumber");

  /* -------------------- GPS Capture -------------------- */
  const captureLocationAndOpen = () => {
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported.");
      setShowScanner(true); // still allow scanning
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
        setShowScanner(true);
      },
      (err) => {
        console.warn("Geolocation denied:", err);
        setLocError("Location permission denied; geofence may fail.");
        setShowScanner(true); // still allow scanning
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* -------------------- Scan Callback -------------------- */
  const handleScanSuccess = async (decoded) => {
    setScannedText(decoded);
    await markAttendance(decoded);
  };

  /* -------------------- Attendance API -------------------- */
  const markAttendance = async (qrValue) => {
    if (!registerNumber) return;
    setMarking(true);
    setMarkResult(null);

    const payload = {
      registerNumber,
      qrValue,
      latitude: lat ?? 0,
      longitude: lon ?? 0,
    };

    try {
      const res = await fetch("http://localhost:8080/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      setMarkResult(text);
    } catch (err) {
      console.error("Attendance mark error:", err);
      setMarkResult("⚠️ Failed to mark attendance.");
    } finally {
      setMarking(false);
    }
  };

  /* -------------------- Close Scanner -------------------- */
  const closeScanner = () => setShowScanner(false);

  /* -------------------- Helpers -------------------- */
  const fmt = (n) =>
    typeof n === "number" && !isNaN(n) ? n.toFixed(6) : "—";

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🔍 Scan QR</h2>

      <button onClick={captureLocationAndOpen} style={{ marginTop: "1rem" }}>
        Open Scanner
      </button>

      {/* Location info (shows as soon as captured) */}
      {(lat != null || lon != null || locError) && (
        <div style={{ marginTop: "1rem" }}>
          <strong>Location:</strong>{" "}
          {locError ? (
            <span style={{ color: "#c00" }}>{locError}</span>
          ) : (
            <>
              Lat: {fmt(lat)}, Lon: {fmt(lon)}
            </>
          )}
        </div>
      )}

      {/* Last scanned QR */}
      {scannedText && (
        <div style={{ marginTop: "1.5rem" }}>
          <strong>Last Scan:</strong> {scannedText}
        </div>
      )}

      {/* Attendance mark result */}
      {marking && <p style={{ marginTop: "1rem" }}>Marking attendance…</p>}
      {markResult && (
        <p style={{ marginTop: "1rem" }}>{markResult}</p>
      )}

      {/* Modal scanner */}
      {showScanner && (
        <QRScanner onScanSuccess={handleScanSuccess} onClose={closeScanner} />
      )}
    </div>
  );
}

export default ScanQRPage;