"""Build a repackaging manifest for the hualien.cloud scrape."""
import json, os, hashlib, re
from urllib.parse import urlparse, unquote

ROOT = '/Users/kkshyu/Repos/hualien-cloud-website/scrape'

def file_info(path):
    if not os.path.isfile(path): return None
    st = os.stat(path)
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1024*64), b''):
            h.update(chunk)
    return {'path': os.path.relpath(path, ROOT), 'size': st.st_size, 'sha256': h.hexdigest()}

manifest = {
    'site': {
        'name': '花蓮雲基地',
        'url': 'https://www.hualien.cloud',
        'admin_email': 'want2design.info@gmail.com',
        'language': 'zh-TW',
        'timezone': '',
        'theme': {'name': 'Blocksy', 'stylesheet': 'blocksy', 'template': 'blocksy', 'status': 'active'},
        'plugins_active': [
            {'slug': 'chaty/cht-icons', 'name': 'Chaty', 'version': '3.5.0'},
            {'slug': 'limit-login-attempts-reloaded/limit-login-attempts-reloaded', 'name': 'Limit Login Attempts Reloaded', 'version': '2.26.24'},
            {'slug': 'ultimate-addons-for-gutenberg/ultimate-addons-for-gutenberg', 'name': 'Spectra (UAG)', 'version': '2.19.16'},
            {'slug': 'astra-sites/astra-sites', 'name': 'Starter Templates', 'version': '4.4.42'},
            {'slug': 'translatepress-multilingual/index', 'name': 'TranslatePress', 'version': '3.0.4'},
            {'slug': 'wpvivid-backuprestore/wpvivid-backuprestore', 'name': 'WPvivid Backup', 'version': '0.9.121'},
        ],
        'front_page': {'show_on_front': 'page', 'page_id': 24, 'slug': 'home'},
        'languages': ['zh-TW (default)', 'en'],
    },
    'pages': [],
    'posts': [],
    'media': [],
    'navigation': {'menus': [], 'menu_items': []},
    'users': [],
    'categories': [],
    'sitemaps': [],
    'public_html_zh': [],
    'public_html_en': [],
    'public_assets': [],
    'api_dumps': [],
    'admin_extracts': [],
    'screenshots': [],
}

# Pages
for it in json.load(open(f'{ROOT}/api/pages.json')):
    manifest['pages'].append({
        'id': it['id'],
        'slug': it['slug'],
        'slug_decoded': unquote(it['slug']),
        'title': it['title']['rendered'],
        'link': it['link'],
        'date': it['date'],
        'modified': it['modified'],
        'status': it['status'],
        'parent': it.get('parent'),
        'menu_order': it.get('menu_order'),
        'template': it.get('template'),
        'author': it.get('author'),
    })

# Posts
for it in json.load(open(f'{ROOT}/api/posts.json')):
    manifest['posts'].append({
        'id': it['id'], 'slug': it['slug'], 'title': it['title']['rendered'],
        'link': it['link'], 'date': it['date'], 'modified': it['modified'],
        'status': it['status'], 'categories': it.get('categories'), 'tags': it.get('tags'),
        'author': it.get('author'),
    })

# Categories
for it in json.load(open(f'{ROOT}/api/categories.json')):
    manifest['categories'].append({
        'id': it['id'], 'slug': it['slug'], 'name': it['name'], 'count': it['count'],
        'description': it.get('description'), 'parent': it.get('parent'),
    })

# Users (public)
for it in json.load(open(f'{ROOT}/api/users.json')):
    manifest['users'].append({
        'id': it['id'], 'slug': it['slug'], 'name': it['name'],
        'description': it.get('description'), 'link': it.get('link'),
    })

# Media
for it in json.load(open(f'{ROOT}/api/media-all.json')):
    src = it.get('source_url','')
    rel = src.replace('https://www.hualien.cloud/wp-content/uploads/','')
    local = f'files/{rel}'
    manifest['media'].append({
        'id': it['id'], 'slug': it.get('slug'), 'title': it['title']['rendered'],
        'mime_type': it.get('mime_type'), 'media_type': it.get('media_type'),
        'date': it['date'], 'modified': it['modified'],
        'source_url': src, 'local_path': local,
        'width': (it.get('media_details') or {}).get('width'),
        'height': (it.get('media_details') or {}).get('height'),
        'filesize': (it.get('media_details') or {}).get('filesize'),
        'alt_text': it.get('alt_text',''),
        'caption': it.get('caption',{}).get('rendered',''),
        'description': it.get('description',{}).get('rendered',''),
        'post': it.get('post'),
        'author': it.get('author'),
    })

# Navigation
admin = json.load(open(f'{ROOT}/api/admin-data.json'))
for m in admin.get('menus', []):
    manifest['navigation']['menus'].append({'id': m['id'], 'name': m['name'], 'slug': m['slug'], 'locations': m.get('locations',[])})
for mi in admin.get('menu-items', []):
    manifest['navigation']['menu_items'].append({
        'id': mi['id'], 'parent': mi.get('parent'), 'order': mi.get('menu_order'),
        'title': mi['title']['rendered'], 'url': mi.get('url'),
        'object': mi.get('object'), 'object_id': mi.get('object_id'),
        'description': mi.get('description',''),
        'classes': mi.get('classes',[]),
        'menus': mi.get('menus'),
    })

# Sitemaps
for f in os.listdir(f'{ROOT}/raw'):
    info = file_info(f'{ROOT}/raw/{f}')
    if info: manifest['sitemaps'].append(info)

# Public HTML zh-TW
for f in sorted(os.listdir(f'{ROOT}/pages')):
    info = file_info(f'{ROOT}/pages/{f}')
    if info: manifest['public_html_zh'].append(info)

# Public HTML en
if os.path.isdir(f'{ROOT}/pages_en'):
    for f in sorted(os.listdir(f'{ROOT}/pages_en')):
        info = file_info(f'{ROOT}/pages_en/{f}')
        if info: manifest['public_html_en'].append(info)

# Assets
for root, dirs, files in os.walk(f'{ROOT}/assets'):
    for fn in files:
        info = file_info(os.path.join(root, fn))
        if info: manifest['public_assets'].append(info)

# API dumps
for f in sorted(os.listdir(f'{ROOT}/api')):
    if f.endswith(('.json','.xml','.html','.txt')) and f not in ('cookies.txt','originals.txt','asset_urls.txt','external_links.txt','media-urls.txt','page_urls.txt'):
        info = file_info(f'{ROOT}/api/{f}')
        if info: manifest['api_dumps'].append(info)

# Screenshots
if os.path.isdir(f'{ROOT}/screenshots'):
    for f in sorted(os.listdir(f'{ROOT}/screenshots')):
        info = file_info(f'{ROOT}/screenshots/{f}')
        if info: manifest['screenshots'].append(info)

# Counts
manifest['summary'] = {
    'pages': len(manifest['pages']),
    'posts': len(manifest['posts']),
    'media_items': len(manifest['media']),
    'media_files_downloaded': len(manifest['media']),
    'menus': len(manifest['navigation']['menus']),
    'menu_items': len(manifest['navigation']['menu_items']),
    'users': len(manifest['users']),
    'categories': len(manifest['categories']),
    'public_html_zh_count': len(manifest['public_html_zh']),
    'public_html_en_count': len(manifest['public_html_en']),
    'public_assets_count': len(manifest['public_assets']),
    'api_dumps_count': len(manifest['api_dumps']),
}

# Total bytes
def total_bytes(items):
    return sum(i.get('size',0) for i in items)
manifest['summary']['total_bytes'] = {
    'public_html_zh': total_bytes(manifest['public_html_zh']),
    'public_html_en': total_bytes(manifest['public_html_en']),
    'public_assets': total_bytes(manifest['public_assets']),
    'sitemaps': total_bytes(manifest['sitemaps']),
    'api_dumps': total_bytes(manifest['api_dumps']),
}

with open(f'{ROOT}/manifest.json','w') as f:
    json.dump(manifest, f, ensure_ascii=False, indent=2)
print(json.dumps(manifest['summary'], indent=2, ensure_ascii=False))
print(f"Manifest written: {ROOT}/manifest.json")
