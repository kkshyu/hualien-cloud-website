import json
all_media = json.load(open('scrape/api/media-all.json'))
with open('scrape/api/originals.txt','w') as f:
    for m in all_media:
        u = m.get('source_url')
        if u:
            f.write(u + '\n')
print(f"Wrote {len(all_media)} originals")
