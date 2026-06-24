# -*- coding: utf-8 -*-
import io, os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
p = '페이즈1_플랫폼운영기초_상세화면구성_v3.1.html'
raw = open(p, 'rb').read()
print('BOM present:', raw[:3] == b'\xef\xbb\xbf')
txt = raw.decode('utf-8')  # will raise if not valid UTF-8
print('valid UTF-8, chars:', len(txt))

ids = ['bf-%02d' % i for i in range(0,13)]
ids += ['sa-bas-%02d' % i for i in range(1,15)]
ids += ['op-vlt-01','op-vlt-02','op-vlt-03','op-vlt-04',
        'op-sys-01','op-sys-02','op-sys-03','op-sys-04',
        'op-wbx-01','op-wbx-02']
missing = [i for i in ids if ('id="%s"' % i) not in txt]
print('total expected screens:', len(ids))
print('missing screen ids:', missing)

# counts
print('h4 screen blocks:', txt.count('<span class="sid">'))
print('section blocks:', txt.count('<section id='))
print('s-menu present:', 'id="s-menu"' in txt)
print('wireframe blocks (.wf-cap):', txt.count('class="wf-cap"'))
# balance check
print('<section>:', txt.count('<section'), '</section>:', txt.count('</section>'))
print('open tags <table>:', txt.count('<table'), '</table>:', txt.count('</table>'))
print('title check:', '<title>' in txt and 'v3.1' in txt)
# nav phase links
for f in ['페이즈1_플랫폼운영기초','페이즈2_개시이월전표증빙','페이즈3_장부자금예산','페이즈4_결산공시외화','페이즈5_세무고정자산AI']:
    print('nav link', f, ':', (f+'_상세화면구성_v3.1.html') in txt)
