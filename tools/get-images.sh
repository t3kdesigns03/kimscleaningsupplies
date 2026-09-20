#!/usr/bin/env bash
# Download the original product photos from the old Squarespace CDN into
# images/products/. Safe to re-run — existing files are skipped.
# Any photo that is no longer there is reported and skipped; the site falls
# back to its SVG illustration automatically.
set -u
cd "$(dirname "$0")/.." || exit 1
mkdir -p images/products

BASE="https://147458827.cdn6.editmysite.com/uploads/1/4/7/4/147458827"

FILES=(
  3WE6ZFHZ6L3CZCJ5ADX3BIEV.png
  V7KMXPSLGQLGOUUUODTY4CCT.png
  FCECSWD3IWVIL2JEHUPIU3TD.png
  HC7I2N6D6JKVRNEZ23RJFP3H.png
  4EK5OKNWSGAVNIT6IBLVE3WH.png
  MNF2D7WSEOHZVSSTYYJYV7MH.png
  A5ATN4JPJJTKB4DQ6JN2RB5O.png
  64NIUDQLZU4JRFFW6BYDZAFV.png
  SVNVXTDAXJJ5GE4MLVIO3B3P.png
  ULZJVS362RKARQVRIEXAHGYC.png
  QNVEEZAQVYGZJ5M4YW6UHQNE.png
  B4JFA4NLXALZ2332BWL6TGEW.png
  QD5PPQDRZV6HTAFM6QXVLAI4.png
)

ok=0; skipped=0; failed=0
for f in "${FILES[@]}"; do
  out="images/products/$f"
  if [ -s "$out" ]; then echo "have    $f"; skipped=$((skipped+1)); continue; fi
  if curl -fsSL "$BASE/$f" -o "$out"; then
    echo "got     $f"; ok=$((ok+1))
  else
    rm -f "$out"; echo "MISSING $f (skipping)"; failed=$((failed+1))
  fi
done

echo
echo "downloaded $ok, already had $skipped, missing $failed"
echo "Refresh the site — the real photos take over on their own."
