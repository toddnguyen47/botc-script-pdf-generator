import re
import sys
from pathlib import Path

MM_TO_PT = 72 / 25.4


def convert_font_sizes(css: str) -> str:
    pattern = re.compile(
        r"(font-size\s*:\s*)(\d+(?:\.\d+)?)\s*mm\b",
        re.IGNORECASE,
    )

    def replace(match):
        prefix = match.group(1)
        mm = float(match.group(2))
        pt = mm * MM_TO_PT
        return f"{prefix}{pt:.1f}pt"

    return pattern.sub(replace, css)


if len(sys.argv) < 2:
    print("Usage: python convert_css.py <input.css>")
    sys.exit(1)

css_file = Path(sys.argv[1])

css = css_file.read_text(encoding="utf-8")
converted = convert_font_sizes(css)
css_file.write_text(converted, encoding="utf-8")

print(f"Updated {css_file}")
