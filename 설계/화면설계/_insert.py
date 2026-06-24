# -*- coding: utf-8 -*-
import io, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def rd(p):
    return open(p,'rb').read().decode('utf-8')

def insert_before(target_file, frag_file, marker):
    t = rd(target_file)
    frag = rd(frag_file)
    assert marker in t, 'marker not found in %s' % target_file
    # insert before the LAST occurrence of marker
    idx = t.rfind(marker)
    new = t[:idx] + frag + '\n' + t[idx:]
    open(target_file,'w',encoding='utf-8').write(new)
    print('INSERTED', frag_file, 'into', target_file, '->', len(new), 'chars')

if __name__ == '__main__':
    target = sys.argv[1]
    frag = sys.argv[2]
    marker = sys.argv[3] if len(sys.argv) > 3 else '</main>'
    insert_before(target, frag, marker)
