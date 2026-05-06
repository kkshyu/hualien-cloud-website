#!/bin/bash
set -e
cd "$(dirname "$0")"
mkdir -p files
while IFS= read -r url; do
  [ -z "$url" ] && continue
  rel="${url#https://www.hualien.cloud/wp-content/uploads/}"
  out="files/$rel"
  dir=$(dirname "$out")
  mkdir -p "$dir"
  if [ -f "$out" ]; then
    continue
  fi
  curl -sL --fail "$url" -o "$out" || echo "FAIL: $url"
done < api/originals.txt
echo "Done"
find files -type f | wc -l
du -sh files
