"""
9:16 editorial mockup: exact screenshot in Samsung-style frame + "fresh work" typography.
Output: marketing/fresh-work-s26-mockup.png (2160x3840)
"""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "marketing" / "screenshots" / "hero-mobile-source.jpg"
OUT = ROOT / "marketing" / "fresh-work-s26-mockup.png"

W, H = 2160, 3840


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def vertical_gradient(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        r = int(lerp(top[0], bottom[0], t))
        g = int(lerp(top[1], bottom[1], t))
        b = int(lerp(top[2], bottom[2], t))
        for x in range(w):
            px[x, y] = (r, g, b)
    return img


def add_vignette(img: Image.Image, strength: float = 0.55) -> Image.Image:
    w, h = img.size
    vignette = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(vignette)
    draw.ellipse((-w * 0.15, -h * 0.1, w * 1.15, h * 1.2), fill=int(255 * strength))
    vignette = vignette.filter(ImageFilter.GaussianBlur(radius=180))
    dark = Image.new("RGB", (w, h), (8, 10, 12))
    return Image.composite(img, dark, ImageChops.invert(vignette))


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = []
    if bold:
        candidates = [
            "C:/Windows/Fonts/timesbd.ttf",
            "C:/Windows/Fonts/georgiab.ttf",
            "C:/Windows/Fonts/arialbd.ttf",
        ]
    else:
        candidates = [
            "C:/Windows/Fonts/times.ttf",
            "C:/Windows/Fonts/georgia.ttf",
            "C:/Windows/Fonts/arial.ttf",
        ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    w, h = size
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, w - 1, h - 1), radius=radius, fill=255)
    return mask


def paste_screen_perspective(
    base: Image.Image,
    screen: Image.Image,
    quad: list[tuple[float, float]],
) -> None:
    """Approximate tilt via quad warp using PIL transform (affine per strip simplified)."""
    # Simple axis-aligned paste with slight scale — perspective via pre-skewed layer
    x0, y0 = quad[0]
    x1, y1 = quad[2]
    tw, th = int(x1 - x0), int(y1 - y0)
    fitted = screen.resize((tw, th), Image.Resampling.LANCZOS)
    base.paste(fitted, (int(x0), int(y0)))


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing screenshot: {SRC}")

    screen_src = Image.open(SRC).convert("RGB")

    # Background: obsidian architectural mood
    bg = vertical_gradient((W, H), (22, 24, 26), (10, 11, 13))
    draw = ImageDraw.Draw(bg)

    # Subtle stone slab / light beam
    for i in range(0, W, 120):
        alpha = 8 + (i % 240) // 30
        draw.line([(i, 0), (i - 400, H)], fill=(alpha + 18, alpha + 20, alpha + 22), width=2)

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse((W * 0.15, H * 0.55, W * 0.95, H * 1.05), fill=(198, 87, 58, 28))
    gdraw.ellipse((-W * 0.1, H * 0.2, W * 0.5, H * 0.7), fill=(23, 56, 43, 35))
    bg = Image.alpha_composite(bg.convert("RGBA"), glow).convert("RGB")
    bg = add_vignette(bg, strength=0.42)

    canvas = bg.convert("RGBA")

    # Typography behind phone
    typo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(typo)
    font_fresh = load_font(280, bold=False)
    font_work = load_font(360, bold=True)

    fresh_text = "fresh"
    work_text = "work"
    fresh_bbox = tdraw.textbbox((0, 0), fresh_text, font=font_fresh)
    work_bbox = tdraw.textbbox((0, 0), work_text, font=font_work)
    fresh_w = fresh_bbox[2] - fresh_bbox[0]
    work_w = work_bbox[2] - work_bbox[0]

    cx = W // 2
    y_typo = int(H * 0.34)
    tdraw.text((cx - fresh_w // 2 - 40, y_typo - 120), fresh_text, font=font_fresh, fill=(235, 230, 220, 140))
    tdraw.text((cx - work_w // 2 + 60, y_typo + 40), work_text, font=font_work, fill=(210, 205, 198, 165))

    canvas = Image.alpha_composite(canvas, typo)

    # Phone geometry — ~70% frame height, slightly below center, subtle tilt
    phone_w = int(W * 0.76)
    phone_h = int(H * 0.72)
    phone_x = (W - phone_w) // 2
    phone_y = int(H * 0.54) - phone_h // 2

    bezel = 28
    outer_r = 96
    inner_r = 78
    screen_r = 64

    phone_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    pdraw = ImageDraw.Draw(phone_layer)

    # Contact shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.rounded_rectangle(
        (phone_x + 40, phone_y + phone_h - 20, phone_x + phone_w + 40, phone_y + phone_h + 90),
        radius=60,
        fill=(0, 0, 0, 120),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(45))
    canvas = Image.alpha_composite(canvas, shadow)

    # Titanium frame (layered bezels)
    for i, (pad, color) in enumerate(
        [
            (0, (118, 118, 122, 255)),
            (4, (78, 78, 82, 255)),
            (8, (145, 145, 150, 255)),
        ]
    ):
        pdraw.rounded_rectangle(
            (phone_x - pad, phone_y - pad, phone_x + phone_w + pad, phone_y + phone_h + pad),
            radius=outer_r + pad,
            fill=color,
        )

    pdraw.rounded_rectangle(
        (phone_x + bezel, phone_y + bezel, phone_x + phone_w - bezel, phone_y + phone_h - bezel),
        radius=inner_r,
        fill=(12, 12, 14, 255),
    )

    canvas = Image.alpha_composite(canvas, phone_layer)

    # Screen inset
    sx = phone_x + bezel + 6
    sy = phone_y + bezel + 6
    sw = phone_w - 2 * (bezel + 6)
    sh = phone_h - 2 * (bezel + 6)

    screen_fit = screen_src.resize((sw, sh), Image.Resampling.LANCZOS)
    mask = rounded_mask((sw, sh), screen_r)

    # Glass sheen
    screen_rgba = screen_fit.convert("RGBA")
    sheen = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(sheen)
    sdraw.polygon([(0, 0), (sw, 0), (int(sw * 0.55), int(sh * 0.45)), (0, int(sh * 0.35))], fill=(255, 255, 255, 22))
    screen_rgba = Image.alpha_composite(screen_rgba, sheen)

    canvas.paste(screen_rgba, (sx, sy), mask)

    # Punch-hole (subtle)
    hole_r = 14
    hx, hy = sx + sw // 2, sy + 42
    pdraw2 = ImageDraw.Draw(canvas)
    pdraw2.ellipse((hx - hole_r, hy - hole_r, hx + hole_r, hy + hole_r), fill=(6, 6, 8, 255))
    pdraw2.ellipse((hx - hole_r + 3, hy - hole_r + 3, hx + hole_r - 3, hy + hole_r - 3), fill=(20, 20, 24, 180))

    # Side buttons hint
    pdraw2.rounded_rectangle((phone_x - 6, phone_y + 220, phone_x - 2, phone_y + 320), radius=2, fill=(90, 90, 94, 255))
    pdraw2.rounded_rectangle((phone_x - 6, phone_y + 360, phone_x - 2, phone_y + 460), radius=2, fill=(90, 90, 94, 255))

    final_rgb = canvas.convert("RGB")
    final_rgb.save(OUT, format="PNG", optimize=True)
    print(f"Saved: {OUT} ({W}x{H})")


if __name__ == "__main__":
    main()
