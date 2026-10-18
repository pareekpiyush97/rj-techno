// GeoCameraCapture.jsx
// On-site, live-camera photo capture with GPS + geofence + burned-in watermark.
// NO gallery upload possible — frames come only from the live camera stream.
// Stack: React (Vite) + Pocketbase. Requires HTTPS (secure context) for camera + GPS.
//
// Usage:
//   <GeoCameraCapture
//     projectId="REC_ID"
//     stepNo={8}
//     site={{ name: "NAN'S Solar – Site #42", lat: 28.0229, lng: 73.3119 }}
//     onDone={(rec) => console.log("saved", rec)}
//   />

import { useEffect, useRef, useState } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

// ---- tunable policy ----
const MAX_ACCURACY_M = 50;      // reject capture if GPS accuracy worse than this
const GEOFENCE_RADIUS_M = 150;  // must be within this distance of the site
const IMG_QUALITY = 0.8;        // keep files light (good for a 512MB VPS)
const TARGET_WIDTH = 1280;      // downscale on capture

// Haversine distance in metres between two {lat, lng}
function distanceM(a, b) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export default function GeoCameraCapture({ projectId, stepNo, site, onDone }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [status, setStatus] = useState("starting"); // starting | ready | done | error
  const [coords, setCoords] = useState(null);        // { lat, lng, acc, t }
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Start the LIVE camera + watch GPS. Cleanup stops both on unmount.
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: TARGET_WIDTH } },
          audio: false,
        });
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStatus("ready");
      } catch (e) {
        // Camera blocked -> there is deliberately NO gallery fallback.
        setError("Camera band hai. Live photo zaroori hai — gallery se upload allowed nahi.");
        setStatus("error");
      }
    })();

    const watchId = navigator.geolocation.watchPosition(
      (p) =>
        setCoords({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          acc: p.coords.accuracy,
          t: p.timestamp,
        }),
      () => setError("Location band hai. On-site proof ke liye GPS zaroori hai."),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );

    return () => {
      active = false;
      navigator.geolocation.clearWatch(watchId);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function capture() {
    setError("");

    // ---- gates: no fix / weak GPS / outside geofence ----
    if (!coords) return setError("GPS fix ka wait karein…");
    if (coords.acc > MAX_ACCURACY_M)
      return setError(`GPS weak (±${Math.round(coords.acc)} m). Khule aasman ke neeche jaayein.`);

    const dist = site ? distanceM(coords, site) : 0;
    const inFence = site ? dist <= GEOFENCE_RADIUS_M : true;
    if (!inFence)
      return setError(
        `Aap site se ${Math.round(dist)} m door hain (max ${GEOFENCE_RADIUS_M} m). Site pe aa kar capture karein.`
      );

    // ---- draw current video frame to canvas (downscaled) ----
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const scale = Math.min(1, TARGET_WIDTH / video.videoWidth);
    const w = Math.round(video.videoWidth * scale);
    const h = Math.round(video.videoHeight * scale);
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);

    // ---- burn the proof watermark into the image itself ----
    const lines = [
      site?.name || "On-site capture",
      `Lat ${coords.lat.toFixed(6)}   Lng ${coords.lng.toFixed(6)}`,
      `±${Math.round(coords.acc)} m   ${new Date().toLocaleString("en-IN")}`,
    ];
    const pad = Math.round(w * 0.018);
    const fs = Math.max(12, Math.round(w * 0.028));
    ctx.font = `600 ${fs}px system-ui, sans-serif`;
    const bandH = lines.length * (fs + 6) + pad;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, h - bandH, w, bandH);
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "top";
    lines.forEach((ln, i) => ctx.fillText(ln, pad, h - bandH + pad / 2 + i * (fs + 6)));

    // Prefer WebP (smaller at the same quality); fall back to JPEG if the
    // browser can't encode WebP (otherwise toBlob silently returns a huge PNG).
    let blob = await new Promise((r) => canvas.toBlob(r, "image/webp", IMG_QUALITY));
    if (!blob || blob.type !== "image/webp") {
      blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", IMG_QUALITY));
    }
    const ext = blob.type === "image/webp" ? "webp" : "jpg";

    // ---- upload to Pocketbase (server records its own created timestamp) ----
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("project", projectId);
      fd.append("step_no", String(stepNo));
      fd.append("photo", blob, `step-${stepNo}-${Date.now()}.${ext}`);
      fd.append("lat", String(coords.lat));
      fd.append("lng", String(coords.lng));
      fd.append("accuracy_m", String(Math.round(coords.acc)));
      fd.append("device_time", new Date(coords.t).toISOString());
      fd.append("distance_m", String(Math.round(dist)));
      fd.append("within_geofence", String(inFence));

      const rec = await pb.collection("step_photos").create(fd);
      onDone?.(rec);
      setStatus("done");
    } catch (e) {
      setError("Upload fail hua. Connection check karke dubara try karein.");
    } finally {
      setBusy(false);
    }
  }

  const gpsReady = coords && coords.acc <= MAX_ACCURACY_M;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ position: "relative", background: "#000", borderRadius: 12, overflow: "hidden" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", display: status === "done" ? "none" : "block" }}
        />
        {/* live GPS HUD */}
        {status === "ready" && (
          <div
            style={{
              position: "absolute", left: 8, bottom: 8, padding: "4px 8px",
              borderRadius: 8, fontSize: 12, color: "#fff",
              background: gpsReady ? "rgba(21,162,74,0.85)" : "rgba(245,158,11,0.9)",
            }}
          >
            {coords ? `GPS ±${Math.round(coords.acc)} m` : "GPS…"}
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {error && (
        <p style={{ color: "#dc2626", fontSize: 14, margin: "10px 2px" }}>{error}</p>
      )}

      {status !== "done" && (
        <button
          onClick={capture}
          disabled={status !== "ready" || busy || !gpsReady}
          style={{
            width: "100%", marginTop: 12, padding: "14px", border: "none",
            borderRadius: 10, fontSize: 16, fontWeight: 600, color: "#fff",
            background: status === "ready" && gpsReady && !busy ? "#15A24A" : "#9ca3af",
            cursor: status === "ready" && gpsReady && !busy ? "pointer" : "not-allowed",
          }}
        >
          {busy ? "Uploading…" : "Capture On-site Photo"}
        </button>
      )}

      {status === "done" && (
        <p style={{ color: "#15A24A", fontWeight: 600, marginTop: 12 }}>
          ✅ Photo saved with GPS proof.
        </p>
      )}
    </div>
  );
}
