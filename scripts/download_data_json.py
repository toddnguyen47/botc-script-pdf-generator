"""
usage
uv run download_data_json.py \
  --input roles.json jinxes.json nightsheet.json \
  --output ../packages/botc-character-sheet/src/data/
"""

import argparse
import urllib.request
from pathlib import Path


BASE_URL = "https://release.botc.app/resources/data/"


def main():
    parser = argparse.ArgumentParser(
        description="Download JSON resources from the BotC release server."
    )
    parser.add_argument(
        "--input",
        nargs="+",
        required=True,
        help="List of JSON filenames to download.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        required=True,
        help="Directory to save downloaded files.",
    )

    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    for filename in args.input:
        url = BASE_URL + filename
        output_path = args.output / filename

        try:
            with urllib.request.urlopen(url, timeout=30) as response:
                output_path.write_bytes(response.read())

            print(f"Downloaded {url} -> {output_path}")

        except Exception as e:
            print(f"Failed to download {url}: {e}")


if __name__ == "__main__":
    main()
