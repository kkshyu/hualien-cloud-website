import json
for f in ['posts','pages','media','categories','tags','users','comments']:
    try:
        d = json.load(open(f'scrape/api/{f}.json'))
        if isinstance(d, list):
            print(f"{f}: {len(d)} items")
            if d and f != 'media':
                for item in d[:8]:
                    title = ''
                    if isinstance(item.get('title'), dict):
                        title = item['title'].get('rendered','')[:60]
                    elif item.get('name'):
                        title = item['name'][:60]
                    print(f"  - id={item.get('id')} slug={item.get('slug')} title={title}")
        else:
            print(f"{f}: {type(d).__name__} | {str(d)[:100]}")
    except Exception as e:
        print(f"{f}: error {e}")
