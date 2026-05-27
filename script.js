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

// Enter gate (hero page only) ------------------------------------------
var enterButton = document.querySelector("#enterButton");
var vhsFx = document.querySelector("#vhsFx");
var heroVideo = document.querySelector(".hero-video");

function startHeroVideo() {
  if (!heroVideo) return;
  // Muted playback is allowed without a user gesture, so this also works
  // on load for a returning visitor who's already entered.
  var playing = heroVideo.play();
  if (playing && playing.catch) playing.catch(() => {});
}


function runVhsEffect() {
  vhsFx.classList.remove("is-running");

  // Restart the animation reliably
  void vhsFx.offsetWidth;

  vhsFx.classList.add("is-running");

  setTimeout(() => {
    vhsFx.classList.remove("is-running");
  }, 2000);
}

if (enterButton) {
  // Returning visitor who already entered (e.g. navigated back here from
  // another page): reveal immediately and start the video on load.
  if (sessionStorage.getItem("iris-entered")) {
    startHeroVideo();
  }

  enterButton.addEventListener("click", () => {
    // Open the gate now: veil reveals the video, title fades in, button hides.
    // The .hero-name title is already in place and doesn't move.
    document.documentElement.classList.add("entered");
    sessionStorage.setItem("iris-entered", "1");
    startHeroVideo();
    // TODO: consider autoplaying music here
    // playAudio();
    setAudioState(false);
    // runVhsEffect();

    // Hold the nav/chrome back so the circle-reveal plays for a beat and the
    // video is on screen before the navigation fades in. Skip the wait when
    // the reveal is disabled for reduced motion.
    setTimeout(() => {
      document.documentElement.classList.add("chrome-in");
    }, 1500);
  });
} else {
  // they loaded a page that wasnt the enter page
  sessionStorage.setItem("iris-entered", "1");
  // hack: sessions storage set might be async so just doing this to be safe
  document.documentElement.classList.add("entered");
}
