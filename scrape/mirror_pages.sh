#!/bin/bash
set -e
cd "$(dirname "$0")"
mkdir -p pages

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

fetch() {
  local slug="$1"
  local url="$2"
  local out="pages/${slug}.html"
  echo "Fetching $slug -> $url"
  curl -sL --fail -A "$UA" "$url" -o "$out" || echo "FAIL: $url"
}

fetch "home"                 "https://www.hualien.cloud/"
fetch "news"                 "https://www.hualien.cloud/news/"
fetch "how-to-arrive"        "https://www.hualien.cloud/%e5%a6%82%e4%bd%95%e5%89%8d%e5%be%80/"
fetch "venue-rental"         "https://www.hualien.cloud/%e5%a0%b4%e5%9c%b0%e7%a7%9f%e7%94%a8/"
fetch "move-in"              "https://www.hualien.cloud/%e9%80%b2%e9%a7%90/"
fetch "cloudcoffee"          "https://www.hualien.cloud/cloudcoffee/"
fetch "post-812"             "https://www.hualien.cloud/uncategorized/812/"
fetch "category-uncategorized" "https://www.hualien.cloud/category/uncategorized/"
fetch "author-liann"         "https://www.hualien.cloud/author/liann/"

echo "--- list ---"
ls -la pages/
