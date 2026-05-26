// NOTE: if the variables are const, it errors on reload! wow. i guess bc we're running in global window again..
// solution is to use var or to just make things module based and use the htmx callbacks. this is fine for now.

// Mobile menu ---------------------------------------------------------
var mobileMenu = document.querySelector("#mobileMenu");
var mobileMenuToggle = document.querySelector("#mobileMenuToggle");

if (mobileMenuToggle && mobileMenu) {
  mobileMenuToggle.addEventListener("click", () => {
    var open = !mobileMenu.classList.contains("is-open");
    mobileMenu.classList.toggle("is-open", open);
    mobileMenuToggle.setAttribute("aria-expanded", String(open));
  });
}

// Audio ----------------------------------------------------------------
var audio = document.querySelector("#soundtrack");
var audioToggle = document.querySelector("#audioToggle");

function setAudioState(isPlaying) {
  if (audioToggle) audioToggle.classList.toggle("is-off", !isPlaying);
}

async function playAudio() {
  if (!audio) return;
  try {
    await audio.play();
    setAudioState(true);
  } catch {
    setAudioState(false);
  }
}

if (audio && audioToggle) {
  audioToggle.addEventListener("click", () => {
    if (audio.paused) {
      playAudio();
    } else {
      audio.pause();
      setAudioState(false);
    }
  });
}

// Enter overlay (hero page only) ---------------------------------------
var enter = document.querySelector("#enter");
var enterButton = document.querySelector("#enterButton");
var vhsFx = document.querySelector("#vhsFx");


function runVhsEffect() {
  vhsFx.classList.remove("is-running");

  // Restart the animation reliably
  void vhsFx.offsetWidth;

  vhsFx.classList.add("is-running");

  setTimeout(() => {
    vhsFx.classList.remove("is-running");
  }, 2000);
}

if (enter && enterButton) {
  enterButton.addEventListener("click", () => {
    enter.classList.add("is-hidden");
    sessionStorage.setItem("iris-entered", "1");
    // TODO: consider autoplaying music here
    // playAudio();
    setAudioState(false);
    runVhsEffect();
  });
} else {
  // they loaded a page that wasnt the enter page
  sessionStorage.setItem("iris-entered", "1");
  // hack: sessions storage set might be async so just doing this to be safe
  document.documentElement.classList.add("entered");
}

if (sessionStorage.getItem("iris-entered")) {
  document.documentElement.classList.add("entered");
}
