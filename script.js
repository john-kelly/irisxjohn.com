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

  // The audio element is hx-preserve'd, so it keeps playing across boosted
  // navigations while this toggle button gets recreated each swap. Sync the
  // button to the real playback state on (re)load.
  setAudioState(!audio.paused);
}

// Theme color ----------------------------------------------------------
// Vanilla port of a React useThemeColor hook. iOS Safari only re-samples
// the URL-bar tint on real navigations, and our hx-boost links are soft
// body swaps -- so we re-create the sampled elements + force a layout to
// trick Safari into re-reading the color on every page. Other browsers
// (mobile + desktop) just pick up the meta tag.
function setThemeColor(color) {
  // 1. html + body backgrounds (iOS samples the body bg for the URL bar).
  document.documentElement.style.backgroundColor = color;
  document.body.style.backgroundColor = color;

  // 2. Replace the meta tag so Safari re-reads it.
  var oldMeta = document.querySelector('meta[name="theme-color"]');
  if (oldMeta) oldMeta.remove();
  var meta = document.createElement("meta");
  meta.setAttribute("name", "theme-color");
  meta.setAttribute("content", color);
  document.head.appendChild(meta);

  // 3. Replace the shim strips (remove + re-add so Safari re-samples).
  function replaceShim(id, top) {
    var old = document.getElementById(id);
    if (old) old.remove();
    var shim = document.createElement("div");
    shim.id = id;
    shim.style.cssText =
      "position:fixed;left:0;width:100%;height:15px;pointer-events:none;" +
      "z-index:9999;" + (top ? "top:0" : "bottom:0") + ";background-color:" + color;
    document.body.appendChild(shim);
  }
  replaceShim("shim-top", true);
  replaceShim("shim-bottom", false);

  // 4. Force a synchronous layout so Safari notices the changes.
  void document.body.offsetHeight;
}

// Per-page colors, matching the .page--X backgrounds in CSS. The hero body
// is transparent (the video shows through), so it gets a black tint.
var THEME_COLORS = {
  "index.html": "transparent",       // .page--hero (transparent)
  "story.html": "#c11618",    // .page--story    -> var(--red)
  "details.html": "#0076d0",  // .page--details  -> var(--blue)
  "registry.html": "#0d6638", // .page--registry -> var(--green)
  "rsvp.html": "#6b1018",     // .page--rsvp     -> var(--burgundy)
  "photos.html": "#0d6638",   // .page--photos   -> var(--green)
};

function pageThemeColor() {
  var path = location.pathname;
  var file = path.slice(path.lastIndexOf("/") + 1) || "index.html";
  return THEME_COLORS[file] || "#000";
}

// Apply on the initial (hard) load, then again after each boosted nav. We
// key off location.pathname -- htmx has updated it by settle time, whereas
// the body class and <head> aren't refreshed on a soft swap. Bound once
// (the window flag persists across swaps) so it doesn't stack or double-fire.
if (!window.__themeColorBound) {
  window.__themeColorBound = true;
  setThemeColor(pageThemeColor());
  document.addEventListener("htmx:afterSettle", function () {
    setThemeColor(pageThemeColor());
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
    // Returning here via a boosted nav skips the <head> pre-paint script, so
    // re-apply the revealed + chrome-in state. Idempotent on a full load where
    // that head script already added these classes.
    document.documentElement.classList.add("entered", "chrome-in");
    startHeroVideo();
  }

  enterButton.addEventListener("click", () => {
    // Open the gate now: veil reveals the video, title fades in, button hides.
    // The .hero-name title is already in place and doesn't move.
    document.documentElement.classList.add("entered");
    sessionStorage.setItem("iris-entered", "1");
    startHeroVideo();
    // TODO: consider autoplaying music here
    playAudio();
    // setAudioState(false);
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
