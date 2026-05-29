#!/usr/bin/env python3
"""Regenerate the photos.html gallery-track from optimized-photos/.

Each photo becomes a lazy-loaded <img> inside a shaped <figure>. Rotation,
scatter and overlap are baked into per-figure CSS custom properties so the
duplicated (loop) half matches exactly and the marquee stays seamless.
"""
import hashlib
import os
import re
from urllib.parse import quote

ROOT = os.path.dirname(os.path.abspath(__file__))
PHOTO_DIR = os.path.join(ROOT, "optimized-photos")
HTML = os.path.join(ROOT, "photos.html")

EXTS = (".jpg", ".jpeg", ".png", ".webp")

# Frame shapes, cycled across the photos.
SHAPES = [
    "rect-tall", "heart", "oval-wide", "diamond", "regal",
    "circle", "arch", "rect", "hexagon", "oval-tall",
]

# Desktop vertical scatter magnitude per shape (vh). Tall frames move little so
# they don't clip off the top/bottom; short/square frames swing more.
DY_BY_SHAPE = {
    "rect-tall": 3, "regal": 3, "arch": 2, "rect": 4, "hexagon": 4,
    "oval-tall": 3, "heart": 11, "diamond": 13, "circle": 10, "oval-wide": 8,
}

ROT = [-2, 3, -4, 2, -3, 1.5, -1, 4, -2.5, 2.5, -3.5]   # deg
DX = [1, -3, 4, -5, 2, -4, 3, -2, 5, -3]                 # vw (desktop x jitter)
MX = [-9, 7, -4, 10, -6, 8, -3, 5]                       # vw (mobile x scatter)
ML = [0, -46, 0, -30, 0, 0, -58, 0, -24, -38, 0]         # px (overlap pull)


def fmt(n):
    return str(int(n)) if float(n).is_integer() else str(n)


def main():
    files = [f for f in os.listdir(PHOTO_DIR) if f.lower().endswith(EXTS)]
    # Deterministic scramble so near-sequential shots aren't adjacent.
    files.sort(key=lambda f: hashlib.md5(f.encode()).hexdigest())

    figures = []
    for i, name in enumerate(files):
        shape = SHAPES[i % len(SHAPES)]
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

    def render(half_hidden):
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

    inner = render(False) + "\n\n" + render(True)
    block = '<div class="gallery-track">\n' + inner + "\n      </div>"

    html = open(HTML, encoding="utf-8").read()
    open_tag = '<div class="gallery-track">'
    close = "</main>"
    i = html.index(open_tag)
    j = html.index(close)
    assert i < j, "unexpected document order"
    # head keeps the indentation before the track open; tail starts at </main>.
    new_html = html[:i] + block + "\n    " + html[j:]
    open(HTML, "w", encoding="utf-8").write(new_html)
    print(f"Wrote {len(figures)} photos ({len(figures) * 2} figures w/ loop).")


if __name__ == "__main__":
    main()
