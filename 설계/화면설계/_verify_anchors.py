# -*- coding: utf-8 -*-
import io, os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
files = [
 '페이즈1_플랫폼운영기초_상세화면구성_v3.1.html',
 '페이즈2_개시이월전표증빙_상세화면구성_v3.1.html',
 '페이즈3_장부자금예산_상세화면구성_v3.1.html',
 '페이즈4_결산공시외화_상세화면구성_v3.1.html',
 '페이즈5_세무고정자산AI_상세화면구성_v3.1.html',
]
for p in files:
    t = open(p,'rb').read().decode('utf-8')
    ids = set(re.findall(r'id="([^"]+)"', t))
    # internal anchors only (start with #, no slash)
    anchors = re.findall(r'href="#([^"]+)"', t)
    missing = sorted(set(a for a in anchors if a not in ids))
    # sid labels
    sids = re.findall(r'<span class="sid">([^<]+)</span>', t)
    print(p)
    print('  nav anchors:', len(anchors), 'broken:', missing)
    print('  screen ids (sid):', sids[:60])
    print()
