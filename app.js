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