// src/pages/student/QRScanner.jsx  (or wherever you keep it)
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

/**
 * QRScanner
 * @param {function} onScanSuccess - called with decodedText when a QR is scanned.
 * @param {function} onClose       - called when user closes the scanner modal.
 */
function QRScanner({
  onScanSuccess = (text) => console.log("Scanned:", text),
  onClose = () => {},
}) {
  const scannerDivId = "qr-scanner-container"; // must match the div id below

  const html5QrCodeRef = useRef(null);
  const scanningLockRef = useRef(false);
  const mountedRef = useRef(true);

  const [cameras, setCameras] = useState([]);
  const [currentCameraId, setCurrentCameraId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ------------ Cleanup ------------ */
  const stopScanner = useCallback(async (suppressWarn = false) => {
    try {
      const scanner = html5QrCodeRef.current;
      if (!scanner) return;

      // stop() safely even if not scanning
      await scanner.stop().catch(() => {});
      await scanner.clear().catch(() => {});

      html5QrCodeRef.current = null;
    } catch (err) {
      if (!suppressWarn) {
        console.warn("QRScanner cleanup warning:", err);
      }
    }
  }, []);

  /* ------------ Start Scan ------------ */
  const startScanner = useCallback(
    async (cameraId) => {
      if (!cameraId) return;
      await stopScanner(true); // ensure clean state

      // ensure container div exists in DOM
      const el = document.getElementById(scannerDivId);
      if (!el) {
        console.error("Scanner div not found in DOM; aborting start.");
        return;
      }

      const scanner = new Html5Qrcode(scannerDivId);
      html5QrCodeRef.current = scanner;

      scanningLockRef.current = false; // reset lock when starting

      try {
        await scanner.start(
          { deviceId: { exact: cameraId } },
          { fps: 10, qrbox: 250 },
          (decodedText /* , decodedResult */) => {
            if (scanningLockRef.current) return;
            scanningLockRef.current = true;
            // fire user callback
            onScanSuccess(decodedText);
            // stop immediately after successful scan
            stopScanner(true).then(() => onClose());
          },
          /* optional frame scan failure cb */ () => {}
        );
      } catch (err) {
        console.error("Error starting scanner:", err);
        alert("Unable to start camera. Check permissions.");
      }
    },
    [onClose, onScanSuccess, stopScanner]
  );

  /* ------------ Init on mount ------------ */
  useEffect(() => {
    mountedRef.current = true;

    async function init() {
      try {
        const found = await Html5Qrcode.getCameras();
        if (!mountedRef.current) return;

        if (!found || found.length === 0) {
          alert("❌ No camera devices found.");
          return;
        }

        setCameras(found);
        setCurrentCameraId(found[0].id);

        // Wait a tick so the div renders
        setTimeout(() => {
          if (mountedRef.current) {
            startScanner(found[0].id);
          }
        }, 150);
      } catch (err) {
        console.error("Camera discovery error:", err);
        alert("⚠️ Camera permission denied or unavailable.");
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    }

    init();

    return () => {
      mountedRef.current = false;
      stopScanner(true);
    };
  }, [startScanner, stopScanner]);

  /* ------------ Switch Camera ------------ */
  const handleSwitch = () => {
    if (cameras.length < 2) return;
    const idx = cameras.findIndex((c) => c.id === currentCameraId);
    const nextIdx = (idx + 1) % cameras.length;
    const nextCam = cameras[nextIdx];
    setCurrentCameraId(nextCam.id);
    startScanner(nextCam.id);
  };

  /* ------------ Change via select ------------ */
  const handleCameraSelect = (e) => {
    const newId = e.target.value;
    setCurrentCameraId(newId);
    startScanner(newId);
  };

  /* ------------ Close ------------ */
  const handleClose = async () => {
    await stopScanner(true);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "10px",
          width: "360px",
          maxWidth: "90%",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>📷 Scan QR</h3>

        {cameras.length > 1 && (
          <select
            value={currentCameraId || ""}
            onChange={handleCameraSelect}
            style={{
              width: "100%",
              marginBottom: "0.75rem",
              padding: "0.4rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            {cameras.map((cam) => (
              <option key={cam.id} value={cam.id}>
                {cam.label || cam.id}
              </option>
            ))}
          </select>
        )}

        {isLoading ? (
          <div
            style={{
              width: 300,
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#888",
              margin: "0 auto",
            }}
          >
            📡 Initializing camera...
          </div>
        ) : (
          <div
            id={scannerDivId}
            style={{
              width: 300,
              height: 300,
              margin: "0 auto",
              border: "2px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        )}

        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          {cameras.length > 1 && (
            <button onClick={handleSwitch}>🔄 Switch</button>
          )}
          <button onClick={handleClose}>❌ Close</button>
        </div>
      </div>
    </div>
  );
}

export default QRScanner;