#!/bin/bash
set -e
cd "$(dirname "$0")"
mkdir -p assets

while IFS= read -r url; do
  [ -z "$url" ] && continue
  rel="${url#https://www.hualien.cloud/}"
  rel="${rel%%\?*}"  # strip query string
  out="assets/$rel"
  dir=$(dirname "$out")
  mkdir -p "$dir"
  if [ -f "$out" ]; then
    continue
  fi
  curl -sL --fail "$url" -o "$out" 2>/dev/null || echo "FAIL: $url"
done < api/asset_urls.txt
echo "--- counts ---"
find assets -type f | wc -l
du -sh assets
