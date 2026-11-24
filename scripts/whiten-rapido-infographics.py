#!/usr/bin/env python3
"""Flatten light gray infographic backgrounds to pure white (#fff)."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "images"

FILES = [
    "rapido-pro-system-01.png",
    "rapido-pro-system-02.png",
    "rapido-pro-system-03.png",
    "rapido-pro-system-04.png",
    "rapido-pro.png",
    "hero-overlay-rapido.png",
    "rapido-pro-hero-cutout.png",
    "rapido-pro-hero-front.png",
    "rapido-pro-hero-rear.png",
    "rapido-pro-hero-system.png",
]

THRESHOLD = 232
CHANNEL_SPREAD = 22


def whiten_pixel(r: int, g: int, b: int, a: int) -> tuple[int, int, int, int]:
    if a < 16:
        return 255, 255, 255, 0
    lo, hi = min(r, g, b), max(r, g, b)
    if hi >= THRESHOLD and hi - lo <= CHANNEL_SPREAD:
        return 255, 255, 255, a
    return r, g, b, a


def process(path: Path) -> None:
    if not path.is_file():
        print(f"skip (missing): {path.name}")
        return
    im = Image.open(path).convert("RGBA")
    out = Image.new("RGBA", im.size)
    px_in = im.load()
    px_out = out.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            px_out[x, y] = whiten_pixel(*px_in[x, y])
    if path.suffix.lower() == ".png":
        out.save(path, optimize=True)
    else:
        out.convert("RGB").save(path, quality=92)
    print(f"ok: {path.name}")


def main() -> None:
    for name in FILES:
        process(ROOT / name)


if __name__ == "__main__":
    main()