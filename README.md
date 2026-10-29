index.html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0b0f14">
  <title>Senter SOS Flashlight</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="app">
    <header class="header">
      <h1>Senter SOS</h1>
      <p class="subtitle">Kontrol lampu flash untuk sinyal darurat</p>
    </header>

    <section class="lamp-area">
      <div id="lamp" class="lamp" aria-hidden="true"></div>
      <button id="toggleBtn" class="power-btn" type="button" aria-pressed="false">
        <span id="toggleText">ON</span>
      </button>
      <p id="status" class="status" role="status" aria-live="polite">Siap digunakan</p>
    </section>

    <section class="controls">
      <h2 class="label">Mode</h2>
      <div class="modes" role="radiogroup" aria-label="Pilih mode">
        <button type="button" class="mode-btn active" data-mode="steady" role="radio" aria-checked="true">Senter</button>
        <button type="button" class="mode-btn" data-mode="strobe" role="radio" aria-checked="false">Strobo</button>
        <button type="button" class="mode-btn" data-mode="sos" role="radio" aria-checked="false">SOS</button>
      </div>

      <div id="speedBox" class="speed-box hidden">
        <label for="speed" class="label">Kecepatan: <span id="speedValue">Normal</span></label>
        <input id="speed" type="range" min="1" max="5" value="3">
      </div>

      <p id="morseInfo" class="morse-info hidden">SOS dalam kode morse: ... --- ...</p>
    </section>

    <p id="support" class="support"></p>
    <p id="locStatus" class="loc-status" role="status" aria-live="polite"></p>
  </main>

  <script src="app.js"></script>
  <script type="module" src="firebase-sos.js"></script>
</body>
</html>



style.css
:root {
  --bg: #0b0f14;
  --panel: #151b23;
  --text: #e8edf2;
  --muted: #8b97a5;
  --accent: #ffd43b;
  --danger: #ff4d4f;
  --radius: 16px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

html,
body {
  height: 100%;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  transition: background 0.05s linear;
}

body.light-on {
  background: #ffffff;
  color: #111;
}

.app {
  min-height: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: calc(24px + env(safe-area-inset-top, 0px)) 20px calc(24px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.header {
  text-align: center;
}

.header h1 {
  font-size: 1.8rem;
  letter-spacing: 0.5px;
}

.subtitle {
  margin-top: 6px;
  color: var(--muted);
  font-size: 0.95rem;
}

body.light-on .subtitle,
body.light-on .status,
body.light-on .label,
body.light-on .support,
body.light-on .morse-info {
  color: #444;
}

.lamp-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.lamp {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2a323d;
  border: 2px solid #3a4452;
  transition: background 0.05s linear, box-shadow 0.05s linear;
}

.lamp.on {
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: 0 0 40px 14px rgba(255, 212, 59, 0.75);
}

.power-btn {
  width: 190px;
  height: 190px;
  border-radius: 50%;
  border: 6px solid var(--accent);
  background: var(--panel);
  color: var(--accent);
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: 2px;
  cursor: pointer;
  transition: transform 0.1s ease, background 0.2s ease, color 0.2s ease;
}

.power-btn:active {
  transform: scale(0.95);
}

.power-btn.active {
  background: var(--accent);
  color: #1a1a1a;
  border-color: #fff3bf;
}

.power-btn:focus-visible,
.mode-btn:focus-visible {
  outline: 3px solid #4dabf7;
  outline-offset: 3px;
}

.status {
  min-height: 1.4em;
  color: var(--muted);
  font-size: 0.95rem;
  text-align: center;
}

.status.error {
  color: var(--danger);
}

.controls {
  background: var(--panel);
  border-radius: var(--radius);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: var(--text);
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--muted);
}

.modes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.mode-btn {
  padding: 14px 8px;
  border-radius: 12px;
  border: 2px solid #2a323d;
  background: transparent;
  color: var(--text);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.mode-btn.active {
  border-color: var(--accent);
  background: var(--accent);
  color: #1a1a1a;
}

.speed-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.speed-box input[type="range"] {
  width: 100%;
  accent-color: var(--accent);
  height: 32px;
}

.morse-info {
  font-size: 0.9rem;
  color: var(--muted);
  text-align: center;
  letter-spacing: 1px;
}

.support {
  text-align: center;
  font-size: 0.85rem;
  color: var(--muted);
}

.hidden {
  display: none;
}
.loc-status {
  text-align: center;
  font-size: 0.85rem;
  color: var(--muted);
  min-height: 1.2em;
}

.loc-status.error {
  color: var(--danger);
}

body.light-on .loc-status {
  color: #444;
}

body.light-on .loc-status.error {
  color: #c92a2a;
}



app.js
(() => {
  "use strict";

  // Elemen
  const toggleBtn = document.getElementById("toggleBtn");
  const toggleText = document.getElementById("toggleText");
  const lamp = document.getElementById("lamp");
  const statusEl = document.getElementById("status");
  const supportEl = document.getElementById("support");
  const modeBtns = document.querySelectorAll(".mode-btn");
  const speedBox = document.getElementById("speedBox");
  const speedInput = document.getElementById("speed");
  const speedValue = document.getElementById("speedValue");
  const morseInfo = document.getElementById("morseInfo");

  // State
  let stream = null;
  let track = null;
  let torchSupported = false;
  let wakeLock = null;
  let isOn = false;
  let mode = "steady";
  let runId = 0;

  const SPEED_LABELS = ["Sangat lambat", "Lambat", "Normal", "Cepat", "Sangat cepat"];
  // Satuan waktu morse (ms) per level kecepatan
  const SOS_UNIT = [500, 400, 300, 220, 150];
  // Durasi kedip strobo (ms) per level kecepatan
  const STROBE_MS = [400, 250, 150, 90, 50];

  // Utilitas
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function setStatus(text, isError = false) {
    statusEl.textContent = text;
    statusEl.classList.toggle("error", isError);
  }

  // Akses lampu kilat kamera (torch)
  async function openTorch() {
    if (track && track.readyState === "live") return;

    if (!window.isSecureContext) {
      torchSupported = false;
      supportEl.textContent = "Alamat ini bukan HTTPS, jadi kamera diblokir browser. Cahaya layar dipakai sebagai pengganti.";
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      torchSupported = false;
      supportEl.textContent = "Browser tidak mendukung kamera. Cahaya layar dipakai sebagai pengganti.";
      return;
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });
      track = stream.getVideoTracks()[0];
      const caps = track.getCapabilities ? track.getCapabilities() : {};
      torchSupported = Boolean(caps && "torch" in caps);

      supportEl.textContent = torchSupported
        ? "Lampu kilat kamera aktif."
        : "Perangkat ini tidak mendukung lampu kilat dari browser. Cahaya layar dipakai sebagai pengganti.";
    } catch (err) {
      torchSupported = false;
      supportEl.textContent = "Izin kamera ditolak. Cahaya layar dipakai sebagai pengganti.";
    }
  }

  function closeTorch() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    stream = null;
    track = null;
  }

  // Nyalakan atau matikan cahaya
  async function setLight(on) {
    lamp.classList.toggle("on", on);
    document.body.classList.toggle("light-on", on);

    if (torchSupported && track && track.readyState === "live") {
      try {
        await track.applyConstraints({ advanced: [{ torch: on }] });
      } catch (err) {
        torchSupported = false;
        supportEl.textContent = "Lampu kilat gagal dikontrol. Cahaya layar dipakai sebagai pengganti.";
      }
    }
  }

  // Pola
  function buildSosPattern(unit) {
    const dot = { on: true, ms: unit };
    const dash = { on: true, ms: unit * 3 };
    const gap = { on: false, ms: unit };
    const letterGap = { on: false, ms: unit * 3 };
    const wordGap = { on: false, ms: unit * 7 };

    const S = [dot, gap, dot, gap, dot];
    const O = [dash, gap, dash, gap, dash];

    return [...S, letterGap, ...O, letterGap, ...S, wordGap];
  }

  function buildStrobePattern(ms) {
    return [
      { on: true, ms },
      { on: false, ms }
    ];
  }

  async function runPattern(pattern, id) {
    while (runId === id) {
      for (const step of pattern) {
        if (runId !== id) return;
        await setLight(step.on);
        await wait(step.ms);
      }
    }
  }

  // Kontrol utama
  function getLevel() {
    return Number(speedInput.value) - 1;
  }

  async function startLight() {
    runId += 1;
    const id = runId;

    if (mode === "steady") {
      await setLight(true);
      return;
    }

    if (mode === "strobe") {
      await runPattern(buildStrobePattern(STROBE_MS[getLevel()]), id);
      return;
    }

    if (mode === "sos") {
      await runPattern(buildSosPattern(SOS_UNIT[getLevel()]), id);
    }
  }

  async function stopLight() {
    runId += 1;
    await setLight(false);
  }

  async function requestWakeLock() {
    try {
      if ("wakeLock" in navigator) {
        wakeLock = await navigator.wakeLock.request("screen");
      }
    } catch (err) {
      wakeLock = null;
    }
  }

  function releaseWakeLock() {
    if (wakeLock) {
      wakeLock.release().catch(() => {});
      wakeLock = null;
    }
  }

  function updateButton() {
    toggleBtn.classList.toggle("active", isOn);
    toggleBtn.setAttribute("aria-pressed", String(isOn));
    toggleText.textContent = isOn ? "OFF" : "ON";
  }

  function modeName() {
    if (mode === "steady") return "Senter menyala";
    if (mode === "strobe") return "Strobo berjalan";
    return "Sinyal SOS berjalan";
  }

  async function turnOn() {
    isOn = true;
    updateButton();
    setStatus("Menyiapkan lampu...");
    await openTorch();
    await requestWakeLock();
    setStatus(modeName());
    startLight();
  }

  async function turnOff() {
    isOn = false;
    updateButton();
    await stopLight();
    closeTorch();
    releaseWakeLock();
    setStatus("Lampu mati");
  }

  // Event
  toggleBtn.addEventListener("click", () => {
    if (isOn) {
      turnOff();
    } else {
      turnOn();
    }
  });

  modeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      mode = btn.dataset.mode;

      modeBtns.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-checked", String(active));
      });

      speedBox.classList.toggle("hidden", mode === "steady");
      morseInfo.classList.toggle("hidden", mode !== "sos");

      if (isOn) {
        setStatus(modeName());
        stopLight().then(startLight);
      }
    });
  });

  speedInput.addEventListener("input", () => {
    speedValue.textContent = SPEED_LABELS[getLevel()];
    if (isOn && mode !== "steady") {
      stopLight().then(startLight);
    }
  });

  // Matikan lampu saat halaman disembunyikan
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && isOn) {
      turnOff();
    }
  });

  window.addEventListener("pagehide", () => {
    closeTorch();
  });

  speedValue.textContent = SPEED_LABELS[getLevel()];
})();



firebase-config.js
// Konfigurasi proyek Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyCGWrEq9PkQA4ChElnSucCDNX4rUj4YYUs",
  authDomain: "sosmobile-9fb03.firebaseapp.com",
  projectId: "sosmobile-9fb03",
  storageBucket: "sosmobile-9fb03.firebasestorage.app",
  messagingSenderId: "407141518878",
  appId: "1:407141518878:web:e6931277579cbd95d1e80f"
};



firebase-sos.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// Inisialisasi Firebase dan Firestore
const db = getFirestore(initializeApp(firebaseConfig));
const COLLECTION = "sos_alerts";

// Elemen yang sudah ada di halaman
const toggleBtn = document.getElementById("toggleBtn");
const modesBox = document.querySelector(".modes");
const locStatus = document.getElementById("locStatus");

let sosActive = false;

function setLocStatus(text, isError = false) {
  locStatus.textContent = text;
  locStatus.classList.toggle("error", isError);
}

// SOS aktif jika lampu menyala dan mode yang dipilih adalah SOS
function isSosActive() {
  const lampOn = toggleBtn.getAttribute("aria-pressed") === "true";
  const activeMode = document.querySelector(".mode-btn.active");
  return lampOn && Boolean(activeMode) && activeMode.dataset.mode === "sos";
}

// Ambil lokasi terkini dari GPS
function getPosition() {
  return new Promise((resolve, reject) => {
    if (!window.isSecureContext) {
      reject(new Error("Alamat bukan HTTPS, lokasi diblokir browser"));
      return;
    }
    if (!navigator.geolocation) {
      reject(new Error("Browser tidak mendukung lokasi"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      resolve,
      (err) => {
        const messages = {
          1: "Izin lokasi ditolak",
          2: "Lokasi tidak tersedia",
          3: "Waktu pengambilan lokasi habis"
        };
        reject(new Error(messages[err.code] || "Lokasi gagal diambil"));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

// Kirim data ke Firestore
async function sendSosLocation() {
  setLocStatus("Mengambil lokasi...");

  const payload = {
    type: "SOS",
    latitude: null,
    longitude: null,
    accuracyMeters: null,
    mapsUrl: null,
    locationError: null,
    createdAt: serverTimestamp(),
    clientTime: new Date().toISOString()
  };

  try {
    const pos = await getPosition();
    payload.latitude = pos.coords.latitude;
    payload.longitude = pos.coords.longitude;
    payload.accuracyMeters = Math.round(pos.coords.accuracy);
    payload.mapsUrl =
      "https://www.google.com/maps?q=" + pos.coords.latitude + "," + pos.coords.longitude;
  } catch (err) {
    payload.locationError = err.message;
  }

  setLocStatus("Mengirim ke admin...");
  const hint = setTimeout(() => {
    setLocStatus("Menunggu koneksi internet untuk mengirim...");
  }, 8000);

  try {
    await addDoc(collection(db, COLLECTION), payload);
    clearTimeout(hint);
    if (payload.locationError) {
      setLocStatus("Sinyal terkirim tanpa lokasi. " + payload.locationError, true);
    } else {
      setLocStatus("Lokasi terkirim ke admin.");
    }
  } catch (err) {
    clearTimeout(hint);
    setLocStatus("Gagal mengirim ke admin. Periksa koneksi dan aturan Firestore.", true);
    console.error("Gagal mengirim SOS:", err);
  }
}

// Cek perubahan status tombol dan mode
function check() {
  const now = isSosActive();
  if (now && !sosActive) {
    sendSosLocation();
  }
  sosActive = now;
}

const observer = new MutationObserver(check);
observer.observe(toggleBtn, { attributes: true, attributeFilter: ["aria-pressed"] });
observer.observe(modesBox, { attributes: true, attributeFilter: ["class"], subtree: true });
