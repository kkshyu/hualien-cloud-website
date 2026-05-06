import json, os
all_media = []
for p in [1, 2, 3]:
    with open(f'scrape/api/media-p{p}.json') as f:
        all_media.extend(json.load(f))

with open('scrape/api/media-all.json', 'w') as f:
    json.dump(all_media, f, ensure_ascii=False, indent=2)

print(f"Total media: {len(all_media)}")

urls = []
for m in all_media:
    src = m.get('source_url')
    if src:
        urls.append(src)
    sizes = (m.get('media_details') or {}).get('sizes') or {}
    for sz in sizes.values():
        u = sz.get('source_url')
        if u and u not in urls:
            urls.append(u)

urls = list(dict.fromkeys(urls))
with open('scrape/api/media-urls.txt', 'w') as f:
    f.write('\n'.join(urls))
print(f"Unique media URLs (incl. all sizes): {len(urls)}")

mime_count = {}
for m in all_media:
    mt = m.get('mime_type','?')
    mime_count[mt] = mime_count.get(mt, 0) + 1
print("Mime types:", mime_count)
