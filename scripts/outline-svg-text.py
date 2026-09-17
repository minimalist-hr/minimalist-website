"""Convert <text> in the brand SVGs to outlined <path>, so shipped marks need no font.

The master SVGs in design/assets use live Archivo type ("outline the type before handoff").
Browsers without Archivo installed would fall back to Helvetica/Arial, so every SVG we ship
is outlined first.

Run manually when a master SVG changes (not part of the build):

    pip install fonttools
    curl -sSLo Archivo.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/Archivo%5Bwdth%2Cwght%5D.ttf"
    python scripts/outline-svg-text.py Archivo.ttf design/assets/minimalist-mark-ink.svg public/favicon.svg

usage: outline-svg-text.py <variable-archivo.ttf> <input.svg> <output.svg>
"""

import re
import sys
import xml.etree.ElementTree as ET

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

SVG_NS = "http://www.w3.org/2000/svg"
WEIGHT = 500  # brand: wordmark and mark are Archivo 500
WIDTH = 100


def load_font(path: str) -> TTFont:
    font = TTFont(path)
    if "fvar" in font:
        font = instantiateVariableFont(font, {"wght": WEIGHT, "wdth": WIDTH})
    return font


def text_to_path(font: TTFont, text: str, x: float, y: float, size: float, tracking: float) -> str:
    """Glyph outlines for one <text> run, positioned at its baseline origin."""
    upem = font["head"].unitsPerEm
    scale = size / upem
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]

    parts = []
    pen_x = x
    for char in text:
        name = cmap[ord(char)]
        pen = SVGPathPen(glyph_set, ntos=lambda v: f"{v:.2f}")
        glyph_set[name].draw(pen)
        d = pen.getCommands()
        if d:
            # Font units are y-up; SVG is y-down. Place the glyph on the baseline.
            parts.append(
                f'<path transform="translate({pen_x:.2f} {y:.2f}) scale({scale:.6f} {-scale:.6f})" d="{d}"/>'
            )
        pen_x += hmtx[name][0] * scale + tracking
    return "".join(parts)


def main() -> None:
    font_path, src, dest = sys.argv[1:4]
    font = load_font(font_path)
    svg = open(src, encoding="utf-8").read()

    # Drop provenance metadata and the editable-source note; neither applies once outlined.
    svg = re.sub(r"<metadata>.*?</metadata>", "", svg, flags=re.S)
    svg = re.sub(r'\s*xmlns:c2pa="[^"]*"', "", svg)
    label = re.search(r'aria-label="([^"]*)"', svg)
    svg = re.sub(r"<title>.*?</title>", f"<title>{label.group(1) if label else 'Minimalist'}</title>", svg, flags=re.S)

    def replace(match: re.Match[str]) -> str:
        element = ET.fromstring(match.group(0).replace("<text", f'<text xmlns="{SVG_NS}"', 1))
        return text_to_path(
            font,
            element.text or "",
            float(element.get("x", 0)),
            float(element.get("y", 0)),
            float(element.get("font-size", 16)),
            float(element.get("letter-spacing", 0)),
        )

    svg = re.sub(r"<text\b[^>]*>[^<]*</text>", replace, svg)
    svg = re.sub(r'\s*font-family="[^"]*"|\s*font-weight="[^"]*"', "", svg)
    svg = re.sub(r"\n\s*\n", "\n", svg)

    open(dest, "w", encoding="utf-8", newline="\n").write(svg)
    print(f"{dest}: {len(svg)} bytes, {svg.count('<path')} paths")


if __name__ == "__main__":
    main()
