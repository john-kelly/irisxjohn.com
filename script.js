// NOTE: if the variables are const, it errors on reload! wow. i guess bc we're running in global window again..
// solution is to use var or to just make things module based and use the htmx callbacks. this is fine for now.

// Mobile menu ---------------------------------------------------------
// Re-bind after every body swap: the toggle has no hx-preserve, so htmx
// replaces it with a fresh element and the previous listener is on the
// orphaned node.
function bindMobileMenu() {
  var menu = document.querySelector("#mobileMenu");
  var toggle = document.querySelector("#mobileMenuToggle");
  if (!menu || !toggle) return;
  toggle.addEventListener("click", () => {
    var open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
}

// Audio ----------------------------------------------------------------
function setAudioState(isPlaying) {
  var audioToggle = document.querySelector("#audioToggle");
  if (isPlaying) {
    audioToggle.classList.remove("is-off");
  } else {
    audioToggle.classList.add("is-off");
  }
}

async function playAudio() {
  var audio = document.querySelector("#soundtrack");
  if (!audio) return;
  window.__audioWantsPlay = true;
  try {
    await audio.play();
    setAudioState(true);
  } catch {
    setAudioState(false);
  }
}

function pauseAudio() {
  var audio = document.querySelector("#soundtrack");
  if (!audio) return;
  window.__audioWantsPlay = false;
  audio.pause();
  setAudioState(false);
}

// htmx's hx-preserve briefly detaches the <audio> element during body swaps
// (back/forward history restore + boosted nav). HTML spec runs the media
// "internal pause steps" on detach, so the element stops despite hx-preserve.
// Resume if the user hadn't actually paused it.
function resumeAudioIfWanted() {
  setTimeout(function() {
    var audio = document.querySelector("#soundtrack");
    if (!audio) return;
    if (window.__audioWantsPlay) {
      audio.play().catch(() => {});
      setAudioState(true);
    } else {
      audio.pause();
      setAudioState(false);
    }
  }, 100);
}

// Theme color ----------------------------------------------------------
// Vanilla port of a React useThemeColor hook. iOS Safari only re-samples
// the URL-bar tint on real navigations, and our hx-boost links are soft
// body swaps -- so we re-create the sampled elements + force a layout to
// trick Safari into re-reading the color on every page. Other browsers
// (mobile + desktop) just pick up the meta tag.
function setThemeColor(color) {
  // var path = location.pathname;
  // var file = path.slice(path.lastIndexOf("/") + 1) || "index.html";
  // if (file === "index.html") {
  //   void document.body.offsetHeight;
  //   return;
  // }


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

  function removeShim(id) {
    var old = document.getElementById(id);
    if (old) old.remove();
  }


  replaceShim("shim-top", true);
  replaceShim("shim-bottom", false);

  // 4. Force a synchronous layout so Safari notices the changes.
  void document.body.offsetHeight;

  removeShim("shim-top");
  removeShim("shim-bottom");
}

// Per-page colors, matching the .page--X backgrounds in CSS.
var THEME_COLORS = {
  "index.html": "black",      // .page--hero     -> black
  "story.html": "#0d6638",    // .page--story    -> var(--green)
  "details.html": "#0076d0",  // .page--details  -> var(--blue)
  "registry.html": "#0d6638", // .page--registry -> var(--green)
  "rsvp.html": "#6b1018",     // .page--rsvp     -> var(--burgundy)
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

  (function() {
    var audio = document.querySelector("#soundtrack");
    var audioToggle = document.querySelector("#audioToggle");
    if (audio && audioToggle) {
      audioToggle.addEventListener("click", () => {
        if (audio.paused) {
          playAudio();
        } else {
          pauseAudio();
        }
      });
    }
    setAudioState(!audio.paused);
  })();
  bindMobileMenu();

  document.addEventListener("htmx:afterSettle", function () {
    setThemeColor(pageThemeColor());

    var audio = document.querySelector("#soundtrack");
    var audioToggle = document.querySelector("#audioToggle");
    if (audio && audioToggle) {
      audioToggle.addEventListener("click", () => {
        if (audio.paused) {
          playAudio();
        } else {
          pauseAudio();
        }
      });
    }

    bindMobileMenu();
    resumeAudioIfWanted();

    var isHero = document.querySelector(".scene--hero");
    if (isHero) openMenu();
  });

  // Close the menu before htmx snapshots the page for history. Otherwise the
  // cached HTML keeps is-open and back-nav flashes the menu before JS can
  // strip it.
  document.addEventListener("htmx:beforeRequest", function () {
    var menu = document.querySelector("#mobileMenu");
    var toggle = document.querySelector("#mobileMenuToggle");
    if (menu) menu.classList.remove("is-open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  });

  document.addEventListener("htmx:historyRestore", resumeAudioIfWanted);
}

// Enter gate (hero page only) ------------------------------------------
var enterButton = document.querySelector("#enterButton");
var heroScene = document.querySelector(".scene--hero");
var heroVideo = document.querySelector(".hero-video");
var heroVeil = document.querySelector(".hero-veil");

// hack bc we setup htmx bad.
// added document bc just body wasnt working? idk if bc of cache...?
if (heroScene) {
  document.body.style.setProperty('overflow', 'hidden');
} else {
  document.body.style.setProperty('overflow', 'auto');
}

function startHeroVideo() {
  if (!heroVideo) return;
  // Muted playback is allowed without a user gesture, so this also works
  // on load for a returning visitor who's already entered.
  var playing = heroVideo.play();
  if (playing && playing.catch) playing.catch(() => {});
}

function openMenu() {
  var menu = document.querySelector("#mobileMenu");
  var toggle = document.querySelector("#mobileMenuToggle");
  if (!menu || !toggle) return;
  menu.classList.toggle("is-open", true);
  toggle.setAttribute("aria-expanded", String(true));
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
    openMenu();
  }

  function openHeroGate() {
    if (document.documentElement.classList.contains("entered")) return;
    // Open the gate now: veil reveals the video, title fades in, button hides.
    // The .hero-name title is already in place and doesn't move.
    document.documentElement.classList.add("entered");
    sessionStorage.setItem("iris-entered", "1");
    startHeroVideo();
    // playAudio();  // disabled: don't auto-start music on enter

    // Hold the nav/chrome back so the circle-reveal plays for a beat and the
    // video is on screen before the navigation fades in. Skip the wait when
    // the reveal is disabled for reduced motion.
    setTimeout(() => {
      document.documentElement.classList.add("chrome-in");
      openMenu();
    }, 1500);
  }

  // Click anywhere on the hero (button included — clicks bubble up here).
  if (heroScene) {
    heroScene.addEventListener("click", openHeroGate)
  };
} else {
  // they loaded a page that wasnt the enter page
  sessionStorage.setItem("iris-entered", "1");
  // hack: sessions storage set might be async so just doing this to be safe
  document.documentElement.classList.add("entered");
}
