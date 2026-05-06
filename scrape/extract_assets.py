import os, re, glob
from urllib.parse import urlparse

DOMAIN = 'www.hualien.cloud'
asset_urls = set()
all_links = set()

href_re = re.compile(r'href=["\']([^"\']+)["\']', re.I)
src_re = re.compile(r'src=["\']([^"\']+)["\']', re.I)
srcset_re = re.compile(r'srcset=["\']([^"\']+)["\']', re.I)
url_re = re.compile(r'url\(["\']?([^)"\']+)["\']?\)', re.I)
content_re = re.compile(r'content=["\']([^"\']+)["\']', re.I)

for f in glob.glob('scrape/pages/*.html'):
    html = open(f, encoding='utf-8', errors='ignore').read()
    for m in href_re.finditer(html):
        asset_urls.add(m.group(1))
    for m in src_re.finditer(html):
        asset_urls.add(m.group(1))
    for m in srcset_re.finditer(html):
        for part in m.group(1).split(','):
            u = part.strip().split(' ')[0]
            asset_urls.add(u)
    for m in url_re.finditer(html):
        asset_urls.add(m.group(1))

internal_assets = []
external_links = []
for u in asset_urls:
    if not u or u.startswith(('data:', 'javascript:', '#', 'mailto:', 'tel:')):
        continue
    if u.startswith('//'):
        u = 'https:' + u
    if u.startswith('/'):
        u = 'https://' + DOMAIN + u
    pr = urlparse(u)
    if not pr.netloc:
        continue
    if pr.netloc == DOMAIN:
        # Determine if static asset (skip page links)
        path = pr.path.lower()
        if path.endswith(('.css','.js','.woff','.woff2','.ttf','.eot','.svg','.png','.jpg','.jpeg','.gif','.webp','.ico','.avif','.heic','.mp4','.pdf','.json','.xml','.map','.otf')):
            internal_assets.append(u)
        else:
            external_links.append(u)
    else:
        external_links.append(u)

internal_assets = sorted(set(internal_assets))
external_links = sorted(set(external_links))

with open('scrape/api/asset_urls.txt','w') as f:
    f.write('\n'.join(internal_assets))
with open('scrape/api/external_links.txt','w') as f:
    f.write('\n'.join(external_links))

print(f"Internal asset URLs: {len(internal_assets)}")
print(f"External/page links: {len(external_links)}")
ext_count = {}
for u in internal_assets:
    ext = os.path.splitext(urlparse(u).path)[1].lower()
    ext_count[ext] = ext_count.get(ext, 0) + 1
print("Asset extensions:", ext_count)
