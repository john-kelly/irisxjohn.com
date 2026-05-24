// Mobile menu ---------------------------------------------------------
const mobileMenu = document.querySelector("#mobileMenu");
const mobileMenuToggle = document.querySelector("#mobileMenuToggle");

if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener("click", () => {
    const open = !mobileMenu.classList.contains("is-open");
    mobileMenu.classList.toggle("is-open", open);
    mobileMenuToggle.setAttribute("aria-expanded", String(open));
  });
}

// Audio ----------------------------------------------------------------
const audio = document.querySelector("#soundtrack");
const audioToggle = document.querySelector("#audioToggle");

const MUSIC_ON_KEY = "iris-music-on";
const MUSIC_TIME_KEY = "iris-music-time";

function setAudioState(isPlaying) {
  if (audioToggle) audioToggle.classList.toggle("is-off", !isPlaying);
}

async function playAudio() {
  if (!audio) return;
  try {
    await audio.play();
    setAudioState(true);
    sessionStorage.setItem(MUSIC_ON_KEY, "1");
  } catch {
    setAudioState(false);
  }
}

function saveAudioState() {
  if (!audio) return;
  if (Number.isFinite(audio.currentTime)) {
    sessionStorage.setItem(MUSIC_TIME_KEY, String(audio.currentTime));
  }
  sessionStorage.setItem(MUSIC_ON_KEY, audio.paused ? "0" : "1");
}

function restoreAudioPosition() {
  if (!audio) return;
  const t = parseFloat(sessionStorage.getItem(MUSIC_TIME_KEY) || "0");
  if (!t) return;
  const apply = () => {
    try { audio.currentTime = t; } catch {}
  };
  if (audio.readyState >= 1) apply();
  else audio.addEventListener("loadedmetadata", apply, { once: true });
}

if (audio && audioToggle) {
  audioToggle.addEventListener("click", () => {
    if (audio.paused) {
      playAudio();
    } else {
      audio.pause();
      setAudioState(false);
      sessionStorage.setItem(MUSIC_ON_KEY, "0");
    }
  });

  // Keep saved time fresh while playing so the next page picks up close to where we left off.
  audio.addEventListener("timeupdate", saveAudioState);
  window.addEventListener("pagehide", saveAudioState);

  // On page load, resume from saved position if music was playing.
  restoreAudioPosition();
  if (sessionStorage.getItem(MUSIC_ON_KEY) === "1") {
    playAudio();
  }
}

// Enter overlay (hero page only) ---------------------------------------
const enter = document.querySelector("#enter");
const enterButton = document.querySelector("#enterButton");

if (enter && enterButton) {
  enterButton.addEventListener("click", () => {
    enter.classList.add("is-hidden");
    sessionStorage.setItem("iris-entered", "1");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", "#000000");
    playAudio();
  });
}
