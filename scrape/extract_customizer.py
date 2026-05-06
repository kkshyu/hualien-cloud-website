import re, json, os
html = open('/Users/kkshyu/Repos/hualien-cloud-website/scrape/api/customize.html', encoding='utf-8', errors='ignore').read()

results = {}

m = re.search(r'_wpCustomizeSettings\s*=\s*(\{.*?\});\s*</script>', html, re.S)
if m:
    body = m.group(1)
    try:
        results['_wpCustomizeSettings'] = json.loads(body)
    except Exception as e:
        results['_wpCustomizeSettings_raw'] = body
        results['_wpCustomizeSettings_error'] = str(e)

for var in ['_wpCustomizeWidgetsSettings', '_wpCustomizeNavMenusSettings', '_wpCustomizeControlsL10n']:
    m = re.search(rf'{var}\s*=\s*(\{{.*?\}});\s*</script>', html, re.S)
    if m:
        try:
            results[var] = json.loads(m.group(1))
        except:
            results[var] = m.group(1)[:500]

m = re.search(r'window\._tp_ajax_url\s*=\s*"([^"]+)"', html)
if m:
    results['translatepress_ajax_url'] = m.group(1)

with open('/Users/kkshyu/Repos/hualien-cloud-website/scrape/api/customize-extracted.json', 'w') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Extracted keys: {list(results.keys())}")
if '_wpCustomizeSettings' in results:
    s = results['_wpCustomizeSettings']
    print(f"  Settings count: {len(s.get('settings', {}))}")
    print(f"  Controls count: {len(s.get('controls', {}))}")
    print(f"  Theme: {s.get('theme', {})}")
    print(f"  URL: {s.get('url', {})}")
