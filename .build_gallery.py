#!/usr/bin/env python3
"""Regenerate the photo marquee inside story.html from optimized-photos/.

This replaces ONLY the inner HTML of <div class="gallery-track">…</div>;
everything else on the page (nav, story-quote, story-coda, mobile menu) is
left untouched. Each photo on disk yields exactly one visible <figure> plus one aria-hidden
loop duplicate, so the two marquee halves always match and the scroll stays
seamless. The photo ORDER is reshuffled randomly on every run — re-running
without adding photos will still reorder the gallery (and produce a git diff).
A few photos are pinned and survive the shuffle: see PINNED_FIRST, LAST_PHOTO
and SHAPE_OVERRIDES below.

Add new photos to optimized-photos/ and re-run:  python3 .build_gallery.py
"""
import os
import random
from urllib.parse import quote

ROOT = os.path.dirname(os.path.abspath(__file__))
PHOTO_DIR = os.path.join(ROOT, "optimized-photos")
HTML = os.path.join(ROOT, "story.html")

EXTS = (".jpg", ".jpeg", ".png", ".webp")

# The gallery lives inside this div on story.html. We rewrite only its inner
# content, between the open tag and its matching close tag. The track contains
# nothing but <figure> elements, so the first </div> after the open tag is the
# correct close — no nested-div ambiguity.
TRACK_OPEN = '<div class="gallery-track">'
TRACK_CLOSE = "</div>"

# Rectangle proportions, cycled across the photos. No frames, no colour.
SHAPES = ["rect-tall", "rect", "rect-wide"]

# Desktop vertical scatter magnitude per shape (vh). Tall frames move little so
# they don't clip off the top/bottom; wider/shorter ones swing more. Bump these
# if you want a more dramatic scatter — don't hand-edit the HTML.
DY_BY_SHAPE = {"rect-tall": 3, "rect": 5, "rect-wide": 8}

ROT = [-2, 3, -4, 2, -3, 1.5, -1, 4, -2.5, 2.5, -3.5]   # deg
DX = [1, -3, 4, -5, 2, -4, 3, -2, 5, -3]                 # vw (desktop x jitter)
MX = [-9, 7, -4, 10, -6, 8, -3, 5]                       # vw (mobile x scatter)
ML = [0, -46, 0, -30, 0, 0, -58, 0, -24, -38, 0]         # px (overlap pull)

# --- Pinned overrides (these survive the random shuffle) ---------------------
# Favourite shots that should always land in a fixed spot. Set to None to
# disable. Names must match the file in optimized-photos/ exactly; a pin naming
# a file that isn't there is reported and ignored.
# Photos pinned to the front, in this exact order (first, second, ...).
# Everything not pinned shuffles into the middle.
PINNED_FIRST = [
    "IMG_5705_1.JPG",   # first
    "IMG_5075_1.JPG",   # second
]
LAST_PHOTO = "IMG_1170.jpeg"     # always the last figure

# Force specific photos to a given shape, regardless of their position. Each
# value must be one of SHAPES.
SHAPE_OVERRIDES = {
    "DSCF4044_1.JPG": "rect-wide",
    "IMG_7081.JPG": "rect-wide",
    "000140260012_2.jpeg": "rect-wide",
    "IMG_2749_2.jpeg": "rect-wide",
    "DSCF4050.JPG": "rect-wide",
    "DSCF3649_1.JPG": "rect-wide",
    "IMG_6044.jpg": "rect-tall",
    "IMG_7398.JPEG": "rect-tall",
    "IMG_6703_1.JPG": "rect-tall",
    "IMG_5714_1.JPG": "rect-tall",
    "IMG_5187.jpeg": "rect-tall",
    "EC147C2E-7EEF-438D-9EDC-B727C1CE8B38-preview.jpeg": "rect-tall",
}
assert all(v in SHAPES for v in SHAPE_OVERRIDES.values()), "bad shape in SHAPE_OVERRIDES"


def fmt(n):
    return str(int(n)) if float(n).is_integer() else str(n)


def pin_order(files):
    """Pin PINNED_FIRST to the front (in declared order) and LAST_PHOTO to the
    end, leaving the rest of the shuffled order untouched. Pins naming a missing
    file are reported and skipped so the build never silently drops a photo."""
    files = list(files)
    for name in (*PINNED_FIRST, LAST_PHOTO, *SHAPE_OVERRIDES):
        if name and name not in files:
            print(f"  warning: pinned photo {name!r} not in optimized-photos/ — ignored")
    # Front pins: pull out any that are present, then prepend in declared order.
    front = [p for p in PINNED_FIRST if p in files]
    for p in front:
        files.remove(p)
    files = front + files
    if LAST_PHOTO in files:
        files.remove(LAST_PHOTO)
        files.append(LAST_PHOTO)
    return files


def build_figures(files):
    """One (shape, style, src) tuple per photo, in the given order."""
    figures = []
    for i, name in enumerate(files):
        shape = SHAPE_OVERRIDES.get(name, SHAPES[i % len(SHAPES)])
        rot = ROT[i % len(ROT)]
        dx = DX[i % len(DX)]
        mx = MX[i % len(MX)]
        ml = ML[i % len(ML)]
        dy = DY_BY_SHAPE[shape] * (1 if i % 2 == 0 else -1)
        style = (
            f"--rot:{fmt(rot)}deg;--dx:{fmt(dx)}vw;--dy:{fmt(dy)}vh;"
            f"--mx:{fmt(mx)}vw;--ml:{fmt(ml)}px"
        )
        src = "optimized-photos/" + quote(name)
        figures.append((shape, style, src))
    return figures


def render(figures, half_hidden):
    rows = []
    hidden = ' aria-hidden="true"' if half_hidden else ""
    for shape, style, src in figures:
        rows.append(
            f'        <figure class="gallery-item gallery-item--{shape}" '
            f'style="{style}"{hidden}>\n'
            f'          <img class="photo" loading="lazy" decoding="async" '
            f'src="{src}" alt="">\n'
            f'        </figure>'
        )
    return "\n".join(rows)


def main():
    files = [f for f in os.listdir(PHOTO_DIR) if f.lower().endswith(EXTS)]
    if not files:
        raise SystemExit(f"No photos found in {PHOTO_DIR}")
    # Fresh random shuffle each run, so near-sequential shots aren't adjacent
    # and the arrangement changes every time the gallery is regenerated...
    random.shuffle(files)
    # ...then re-pin the favourites so they always keep their spot.
    files = pin_order(files)

    figures = build_figures(files)
    inner = render(figures, False) + "\n\n" + render(figures, True)

    html = open(HTML, encoding="utf-8").read()
    if html.count(TRACK_OPEN) != 1:
        raise SystemExit(
            f"Expected exactly one {TRACK_OPEN!r} in {HTML}; "
            f"found {html.count(TRACK_OPEN)}."
        )

    start = html.index(TRACK_OPEN)
    after_open = start + len(TRACK_OPEN)
    close = html.index(TRACK_CLOSE, after_open)

    # Rebuild only the track's inner content; preserve the open tag, the close
    # tag, and everything before/after the track verbatim.
    new_html = html[:after_open] + "\n" + inner + "\n      " + html[close:]
    open(HTML, "w", encoding="utf-8").write(new_html)
    print(
        f"Wrote {len(figures)} photos "
        f"({len(figures) * 2} figures incl. loop duplicate) to {os.path.basename(HTML)}."
    )


if __name__ == "__main__":
    main()
