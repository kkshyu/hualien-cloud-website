import json
out = []
for f, kind in [('posts','post'),('pages','page')]:
    d = json.load(open(f'scrape/api/{f}.json'))
    for it in d:
        out.append((kind, it.get('id'), it.get('slug'), it.get('link')))
with open('scrape/api/page_urls.txt','w') as fp:
    for k,i,s,l in out:
        fp.write(f"{l}\n")
for r in out:
    print(r)
