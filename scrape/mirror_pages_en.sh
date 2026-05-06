#!/bin/bash
set -e
cd "$(dirname "$0")"
mkdir -p pages_en

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

fetch() {
  local slug="$1"
  local url="$2"
  local out="pages_en/${slug}.html"
  echo "Fetching $slug -> $url"
  curl -sL --fail -A "$UA" "$url" -o "$out" || echo "FAIL: $url"
}

fetch "home"                 "https://www.hualien.cloud/en/"
fetch "news"                 "https://www.hualien.cloud/en/news/"
fetch "how-to-arrive"        "https://www.hualien.cloud/en/%e5%a6%82%e4%bd%95%e5%89%8d%e5%be%80/"
fetch "venue-rental"         "https://www.hualien.cloud/en/%e5%a0%b4%e5%9c%b0%e7%a7%9f%e7%94%a8/"
fetch "move-in"              "https://www.hualien.cloud/en/%e9%80%b2%e9%a7%90/"
fetch "cloudcoffee"          "https://www.hualien.cloud/en/cloudcoffee/"
fetch "post-812"             "https://www.hualien.cloud/en/uncategorized/812/"
fetch "category-uncategorized" "https://www.hualien.cloud/en/category/uncategorized/"
fetch "author-liann"         "https://www.hualien.cloud/en/author/liann/"

ls -la pages_en/
