# -*- coding: utf-8 -*-
import io, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
files = [
 '페이즈1_플랫폼운영기초_상세화면구성_v3.1.html',
 '페이즈2_개시이월전표증빙_상세화면구성_v3.1.html',
 '페이즈3_장부자금예산_상세화면구성_v3.1.html',
 '페이즈4_결산공시외화_상세화면구성_v3.1.html',
 '페이즈5_세무고정자산AI_상세화면구성_v3.1.html',
]
for p in files:
    raw = open(p,'rb').read()
    t = raw.decode('utf-8')
    print(p)
    print('  BOM', raw[:3]==b'\xef\xbb\xbf', 'chars', len(t))
    print('  sid blocks', t.count('<span class="sid">'), 'wf-cap', t.count('class="wf-cap"'))
    print('  section', t.count('<section'), '/', t.count('</section>'),
          'table', t.count('<table'), '/', t.count('</table>'),
          'div', t.count('<div'), '/', t.count('</div>'))
    print('  s-menu', ('id="s-menu"' in t), 'title v3.1', '<title>' in t and 'v3.1' in t)
    print()
