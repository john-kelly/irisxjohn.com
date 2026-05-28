// RSVP page logic. Talks to Supabase entirely from the browser via the three
// SECURITY DEFINER functions defined in supabase/schema.sql. Wrapped in an IIFE
// so the consts below stay scoped (and don't blow up on dev live-reload).
(function () {
  "use strict";

  // ---- Fill these in (see SUPABASE_SETUP.md, steps 3–4) --------------------
  const SUPABASE_URL = "https://pbwyogngwrcutwdezgri.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_nnkdt0ieUM9vQ7Km4VLxEg_cZjKHfKV";

  // --------------------------------------------------------------------------

  const searchInput = document.querySelector("#rsvpSearchInput");
  const resultsList = document.querySelector("#rsvpResults");
  const searchHint = document.querySelector("#rsvpHint");
  const inviteForm = document.querySelector("#rsvpInvite");
  const inviteTitle = document.querySelector("#rsvpInviteTitle");
  const guestList = document.querySelector("#guestList");
  const saveButton = document.querySelector("#rsvpSave");
  const restartButton = document.querySelector("#rsvpRestart");
  const statusEl = document.querySelector("#rsvpStatus");

  // Only run on the RSVP page.
  if (!searchInput) return;

  const isConfigured =
    !SUPABASE_URL.includes("YOUR-PROJECT") &&
    !SUPABASE_ANON_KEY.includes("YOUR-PUBLIC");

  if (!isConfigured) {
    searchInput.disabled = true;
    searchInput.placeholder = "RSVP opens soon…";
    setHint("The RSVP isn't connected yet — check back shortly.");
    return;
  }

  if (!window.supabase || !window.supabase.createClient) {
    setHint("Couldn't load the RSVP service. Please refresh the page.");
    return;
  }

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  let activeIndex = -1; // highlighted autocomplete row, for keyboard nav
  let results = []; // current search matches

  // ---- Search + autocomplete ----------------------------------------------

  const runSearch = debounce(async function (term) {
    if (term.trim().length < 2) {
      closeResults();
      setHint("");
      return;
    }
    try {
      const { data, error } = await sb.rpc("rsvp_search", { term });
      if (error) throw error;
      results = data || [];
      renderResults();
    } catch (err) {
      console.error(err);
      closeResults();
      setHint("Something went wrong searching. Please try again.");
    }
  }, 220);

  searchInput.addEventListener("input", function () {
    runSearch(searchInput.value);
  });

  // Refocusing after a blur should bring the dropdown back, as long as there's
  // still enough typed to meet the search threshold. Re-render cached matches
  // instantly when we have them; otherwise re-run the search.
  searchInput.addEventListener("focus", function () {
    if (searchInput.value.trim().length < 2) return;
    if (results.length) {
      renderResults();
    } else {
      runSearch(searchInput.value);
    }
  });

  searchInput.addEventListener("keydown", function (event) {
    if (resultsList.hidden) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Enter") {
      if (activeIndex >= 0 && results[activeIndex]) {
        event.preventDefault();
        chooseResult(results[activeIndex]);
      }
    } else if (event.key === "Escape") {
      closeResults();
    }
  });

  // Close the dropdown when focus/clicks land outside the search box.
  document.addEventListener("click", function (event) {
    if (!event.target.closest("#rsvpSearch")) closeResults();
  });

  function renderResults() {
    resultsList.innerHTML = "";
    activeIndex = -1;

    if (results.length === 0) {
      closeResults();
      setHint("No match — try a different spelling, or reach out to Iris & John.");
      return;
    }

    setHint("");
    results.forEach(function (row, index) {
      const li = document.createElement("li");
      li.className = "rsvp-result";
      li.id = "rsvp-result-" + index;
      li.setAttribute("role", "option");
      li.setAttribute("aria-selected", "false");

      const name = document.createElement("span");
      name.className = "rsvp-result-name";
      name.textContent = row.full_name;
      li.appendChild(name);

      if (row.household) {
        const house = document.createElement("span");
        house.className = "rsvp-result-house";
        house.textContent = row.household;
        li.appendChild(house);
      }

      li.addEventListener("mouseenter", function () {
        setActive(index);
      });
      li.addEventListener("click", function () {
        chooseResult(row);
      });
      resultsList.appendChild(li);
    });

    resultsList.hidden = false;
    searchInput.setAttribute("aria-expanded", "true");

    // Always keep one row highlighted so Enter has a target to choose.
    setActive(0);
  }

  function setActive(index) {
    const rows = resultsList.querySelectorAll(".rsvp-result");
    if (!rows.length) return;
    activeIndex = (index + rows.length) % rows.length;
    rows.forEach(function (row, i) {
      const on = i === activeIndex;
      row.classList.toggle("is-active", on);
      row.setAttribute("aria-selected", String(on));
      if (on) {
        searchInput.setAttribute("aria-activedescendant", row.id);
        row.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function moveActive(delta) {
    setActive(activeIndex + delta);
  }

  function closeResults() {
    resultsList.hidden = true;
    resultsList.innerHTML = "";
    activeIndex = -1;
    searchInput.setAttribute("aria-expanded", "false");
    searchInput.removeAttribute("aria-activedescendant");
  }

  // ---- Opening an invitation ----------------------------------------------

  async function chooseResult(row) {
    closeResults();
    searchInput.value = row.full_name;
    setHint("Loading your invitation…");
    try {
      const { data, error } = await sb.rpc("rsvp_get_invitation", {
        inv_id: row.invitation_id,
      });
      if (error) throw error;
      renderInvitation(data || []);
      setHint("");
    } catch (err) {
      console.error(err);
      setHint("Couldn't open that invitation. Please try again.");
    }
  }

  function renderInvitation(guests) {
    inviteTitle.textContent =
      guests.length && guests[0].household ? guests[0].household : "Your invitation";

    guestList.innerHTML = "";
    guests.forEach(function (guest) {
      const li = document.createElement("li");
      li.className = "guest-row";

      const label = document.createElement("label");
      label.className = "guest-check";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.className = "guest-checkbox";
      input.dataset.guestId = guest.guest_id;
      input.checked = guest.attending === true;

      const box = document.createElement("span");
      box.className = "guest-box";
      box.setAttribute("aria-hidden", "true");

      const name = document.createElement("span");
      name.className = "guest-name";
      name.textContent = guest.full_name;

      label.appendChild(input);
      label.appendChild(box);
      label.appendChild(name);
      li.appendChild(label);
      guestList.appendChild(li);
    });

    setStatus("");
    inviteForm.hidden = false;
    inviteForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // ---- Saving --------------------------------------------------------------

  inviteForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const boxes = Array.from(guestList.querySelectorAll(".guest-checkbox"));
    if (!boxes.length) return;

    saveButton.disabled = true;
    saveButton.textContent = "Saving…";
    setStatus("");

    try {
      await Promise.all(
        boxes.map(function (box) {
          return sb
            .rpc("rsvp_set_attending", {
              guest_id: box.dataset.guestId,
              is_attending: box.checked,
            })
            .then(function (res) {
              if (res.error) throw res.error;
            });
        })
      );
      const coming = boxes.filter((b) => b.checked).length;
      setStatus(
        coming > 0
          ? "Thank you — your reply is saved. We can't wait to celebrate with you!"
          : "Got it — your reply is saved. We'll miss you, but thank you for letting us know.",
        "ok"
      );
    } catch (err) {
      console.error(err);
      setStatus("We couldn't save that. Please try again in a moment.", "error");
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = "Save RSVP";
    }
  });

  restartButton.addEventListener("click", function () {
    inviteForm.hidden = true;
    guestList.innerHTML = "";
    setStatus("");
    searchInput.value = "";
    searchInput.focus();
  });

  // ---- Helpers -------------------------------------------------------------

  function setHint(text) {
    searchHint.textContent = text;
  }

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.classList.remove("is-ok", "is-error");
    if (kind === "ok") statusEl.classList.add("is-ok");
    if (kind === "error") statusEl.classList.add("is-error");
  }

  function debounce(fn, wait) {
    let timer;
    return function () {
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
      }, wait);
    };
  }
})();
