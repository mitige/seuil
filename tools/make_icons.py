#!/usr/bin/env python3
"""Génère les icônes PNG de Seuil (marque « seuil » : cercle au-dessus de la ligne).

Rendu en sur-échantillonnage 4x puis réduction LANCZOS pour des bords nets.
Icônes pleines (sans coins transparents) : compatibles purpose "any maskable".
"""

from PIL import Image, ImageDraw


def vertical_gradient(size, top, bottom):
    strip = Image.new("RGB", (1, size))
    for y in range(size):
        t = y / (size - 1)
        strip.putpixel((0, y), tuple(int(a + (b - a) * t) for a, b in zip(top, bottom)))
    return strip.resize((size, size))


def make_icon(size, path):
    S = size * 4
    u = S / 64.0

    img = vertical_gradient(S, (0x16, 0x19, 0x22), (0x09, 0x0A, 0x0F)).convert("RGBA")

    # Halo discret derrière la marque
    halo = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    hd = ImageDraw.Draw(halo)
    hd.ellipse(
        [32 * u - 22 * u, 27 * u - 20 * u, 32 * u + 22 * u, 27 * u + 20 * u],
        fill=(0x6E, 0x8B, 0xFF, 16),
    )
    img = Image.alpha_composite(img, halo)

    # Marque (cercle + ligne de seuil) en dégradé indigo
    mark = vertical_gradient(S, (0x9D, 0xB0, 0xFF), (0x5B, 0x7B, 0xFF)).convert("RGBA")
    mask = Image.new("L", (S, S), 0)
    md = ImageDraw.Draw(mask)
    md.ellipse(
        [32 * u - 9.5 * u, 25.5 * u - 9.5 * u, 32 * u + 9.5 * u, 25.5 * u + 9.5 * u],
        fill=255,
    )
    md.rounded_rectangle([13 * u, 40 * u, 51 * u, 43.6 * u], radius=1.8 * u, fill=255)
    img.paste(mark, (0, 0), mask)

    # Écho sous la ligne (reflet atténué)
    echo = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    ed = ImageDraw.Draw(echo)
    ed.rounded_rectangle(
        [21 * u, 49 * u, 43 * u, 52.2 * u], radius=1.6 * u, fill=(0x5B, 0x7B, 0xFF, 97)
    )
    img = Image.alpha_composite(img, echo)

    img = img.resize((size, size), Image.LANCZOS).convert("RGB")
    img.save(path, optimize=True)
    print(f"OK {path} ({size}x{size})")


if __name__ == "__main__":
    make_icon(192, "icon-192.png")
    make_icon(512, "icon-512.png")
    make_icon(180, "icon-180.png")
