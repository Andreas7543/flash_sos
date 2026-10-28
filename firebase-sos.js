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
