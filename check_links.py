import re
with open('public/index.html', encoding='utf-8') as f:
    html = f.read()
ids = set(re.findall(r'id=[\'\"]([^\'\"]+)[\'\"]', html))
hrefs = set([h for h in re.findall(r'href=[\'\"]#([^\'\"]+)[\'\"]', html) if h])
missing_sections = hrefs - ids
print('Missing anchor sections:', missing_sections)
print('Has loginModal?', 'loginModal' in ids)
print('Has signupModal?', 'signupModal' in ids)
