# -*- coding: utf-8 -*-
import io, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
src = '페이즈01_기초정보_상세화면구성_v3.0.html'
with io.open(src, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def block(a, b):  # 1-based inclusive
    return ''.join(lines[a-1:b])

style_block = block(4, 109)        # <style>...</style>
menu_section = block(233, 313)     # <section id="s-menu">...</section>
bf_screens = block(352, 990)       # BF-00..BF-12 (h4 through last validation table)
sabas_screens = block(996, 1677)   # SA-BAS-01..14

for name, txt in [('_style.frag', style_block), ('_menu.frag', menu_section),
                  ('_bf.frag', bf_screens), ('_sabas.frag', sabas_screens)]:
    with io.open(name, 'w', encoding='utf-8') as o:
        o.write(txt)
    print(name, len(txt), 'chars')

# sanity checks
print('style starts:', style_block.lstrip()[:20])
print('style ends:', style_block.rstrip()[-20:])
print('menu starts:', menu_section.lstrip()[:30])
print('menu ends:', menu_section.rstrip()[-15:])
print('bf starts:', bf_screens.lstrip()[:30])
print('bf ends:', bf_screens.rstrip()[-30:])
print('sabas starts:', sabas_screens.lstrip()[:30])
print('sabas ends:', sabas_screens.rstrip()[-30:])
