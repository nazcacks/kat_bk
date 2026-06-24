# -*- coding: utf-8 -*-
import io, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def rd(p):
    with io.open(p, 'r', encoding='utf-8') as f:
        return f.read()

STYLE = rd('_style.frag')      # <style>...</style>
MENU  = rd('_menu.frag')       # <section id="s-menu">...</section> (verbatim)
BF    = rd('_bf.frag')         # BF-00..BF-12 screen blocks
SABAS = rd('_sabas.frag')      # SA-BAS-01..14 screen blocks

PHASE_TITLE = '페이즈 1 · 플랫폼·운영 콘솔·기초정보'

# ---------------- HEAD + NAV ----------------
HEAD = '''<!DOCTYPE html><html lang="ko"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>''' + PHASE_TITLE + ''' v3.1</title>
''' + STYLE + '''
</head><body>
<nav id="toc">
  <h2>구현 화면설계서 v3.1</h2>
  <div class="ver">페이즈 1 · 플랫폼·운영 콘솔·기초정보 · 2026-06-24</div>
  <a href="#s1">1. 문서 개요</a>
  <a href="#s2">2. 업무 흐름</a>
  <a class="sub" href="#s2-flow">2.1 온보딩 업무 흐름</a>
  <a href="#s-menu">2.4 전체 화면 메뉴 카탈로그(트리)</a>
  <a href="#s3">3. 화면 목록(인벤토리)</a>
  <div class="g">4. 플랫폼·기초 (BF-*)</div>
  <a class="sub" href="#bf-00">BF-00 이용회사 선택</a>
  <a class="sub" href="#bf-01">BF-01 운영조직·IP 허용</a>
  <a class="sub" href="#bf-02">BF-02 테넌트 운영 콘솔</a>
  <a class="sub" href="#bf-03">BF-03 기장 설정·전환</a>
  <a class="sub" href="#bf-04">BF-04 보안 사용자</a>
  <a class="sub" href="#bf-05">BF-05 인증 정책</a>
  <a class="sub" href="#bf-06">BF-06 접근 세션 감사</a>
  <a class="sub" href="#bf-07">BF-07 권한 매트릭스</a>
  <a class="sub" href="#bf-08">BF-08 표준 카탈로그</a>
  <a class="sub" href="#bf-09">BF-09 차원·조직관리</a>
  <a class="sub" href="#bf-10">BF-10 구독·청구</a>
  <a class="sub" href="#bf-11">BF-11 알림 매트릭스</a>
  <a class="sub" href="#bf-12">BF-12 메뉴 발행</a>
  <div class="g">5. 외부 연계 볼트 (M-OP-08)</div>
  <a class="sub" href="#op-vlt-01">OP-VLT-01 시크릿·자격증명 볼트</a>
  <a class="sub" href="#op-vlt-02">OP-VLT-02 토큰·인증서 만료관리</a>
  <a class="sub" href="#op-vlt-03">OP-VLT-03 외부 연결 모니터링</a>
  <a class="sub" href="#op-vlt-04">OP-VLT-04 ETL 파이프라인</a>
  <div class="g">6. 시스템 운영 (M-OP-09)</div>
  <a class="sub" href="#op-sys-01">OP-SYS-01 관측성 대시보드</a>
  <a class="sub" href="#op-sys-02">OP-SYS-02 CI/CD·릴리스</a>
  <a class="sub" href="#op-sys-03">OP-SYS-03 SLO·DR 현황</a>
  <a class="sub" href="#op-sys-04">OP-SYS-04 배치 잡 모니터</a>
  <div class="g">7. 기장 워크벤치 (M-OP-10)</div>
  <a class="sub" href="#op-wbx-01">OP-WBX-01 담당 회사 큐</a>
  <a class="sub" href="#op-wbx-02">OP-WBX-02 마감·신고 진행판</a>
  <div class="g">8. BK 기초정보 (SA-BAS-*)</div>
  <a class="sub" href="#sa-bas-01">SA-BAS-01 회사등록</a>
  <a class="sub" href="#sa-bas-02">SA-BAS-02 권한설정</a>
  <a class="sub" href="#sa-bas-03">SA-BAS-03 환경설정</a>
  <a class="sub" href="#sa-bas-04">SA-BAS-04 부서등록</a>
  <a class="sub" href="#sa-bas-05">SA-BAS-05 사원등록</a>
  <a class="sub" href="#sa-bas-06">SA-BAS-06 거래처등록</a>
  <a class="sub" href="#sa-bas-07">SA-BAS-07 계정과목·적요</a>
  <a class="sub" href="#sa-bas-08">SA-BAS-08 현장등록</a>
  <a class="sub" href="#sa-bas-09">SA-BAS-09 프로젝트등록</a>
  <a class="sub" href="#sa-bas-10">SA-BAS-10 업무용승용차</a>
  <a class="sub" href="#sa-bas-11">SA-BAS-11 외주처등록</a>
  <a class="sub" href="#sa-bas-12">SA-BAS-12 거래처DM인쇄</a>
  <a class="sub" href="#sa-bas-13">SA-BAS-13 거래처등코드변환</a>
  <a class="sub" href="#sa-bas-14">SA-BAS-14 마감후이월</a>
  <div class="g">전체 페이즈</div>
  <a class="sub" href="페이즈1_플랫폼운영기초_상세화면구성_v3.1.html">P1 플랫폼·운영·기초</a>
  <a class="sub" href="페이즈2_개시이월전표증빙_상세화면구성_v3.1.html">P2 개시이월·전표·증빙</a>
  <a class="sub" href="페이즈3_장부자금예산_상세화면구성_v3.1.html">P3 장부·자금·예산</a>
  <a class="sub" href="페이즈4_결산공시외화_상세화면구성_v3.1.html">P4 결산·공시·외화</a>
  <a class="sub" href="페이즈5_세무고정자산AI_상세화면구성_v3.1.html">P5 세무·고정자산·AI</a>
</nav>
<main>

<div class="doc-header">
  <h1>''' + PHASE_TITLE + ''' v3.1</h1>
  <p>BK 회계/세무 SaaS 구현 화면설계서 · BK 기준 · v3.1</p>
  <p>작성일 2026-06-24 · 멀티테넌트(SHARED+RLS) · NestJS / React 18</p>
</div>
'''

# ---------------- SECTION 1 : 문서 개요 ----------------
S1 = '''
<section id="s1">
<h2>1. 문서 개요 · 페이즈 1 범위</h2>
<table class="meta">
  <tr><th>목적</th><td>v3.0 10개 페이즈 상세화면구성을 <b>2채널 메뉴 카탈로그</b>(채널 ① 운영 콘솔 OP=<code>M-OP-*</code> / 채널 ② 회사 작업공간 TN=<code>M-WS-*</code>) 기준의 <b>신 5페이즈 v3.1</b> 구조로 재편하면서, 그 첫 페이즈인 <b>플랫폼·운영 콘솔·기초정보</b> 화면을 구현 가능한 수준(레이아웃·필드·액션/검증·연계 API·권한·상태)으로 정의한다. 플랫폼 기반(테넌트/인증/권한/표준)·운영 콘솔(외부 연계 볼트·시스템 운영·기장 워크벤치)·BK 기초정보(회사·환경·6 관리차원 마스터)를 한 페이즈로 묶어, 후행 전표·결산·신고 화면의 <b>부모 엔티티</b>와 <b>운영 인프라 화면</b>을 모두 확정한다.</td></tr>
  <tr><th>페이즈 정의</th><td>멀티테넌시(SHARED+RLS)·인증/2FA·운영 콘솔(테넌트/구독/표준)·권한 위임/가드레일·관리자 접근 로그·공통 표준 배포 + <b>외부 연계 볼트(시크릿·토큰·연결 모니터링·ETL)</b> + <b>시스템 운영(관측성·CI/CD·SLO/DR·배치)</b> + <b>기장 워크벤치(담당 회사 큐·마감/신고 진행판)</b> + <b>회사등록·환경설정·6 관리차원 마스터(부서/사원/거래처/계정과목/현장/프로젝트)·차량·외주처·코드변환·마감후이월</b>.</td></tr>
  <tr><th>화면 구성</th><td><b>이관 27화면</b> — 플랫폼/기초 BF-00~BF-12(13) + BK 기초정보 SA-BAS-01~SA-BAS-14(14). <b>신규 10화면</b> — 외부 연계 볼트 OP-VLT-01~04(4) + 시스템 운영 OP-SYS-01~04(4) + 기장 워크벤치 OP-WBX-01~02(2). <b>합계 27 + 10 = 총 37화면</b>.</td></tr>
  <tr><th>표기 원칙</th><td>화면 ID는 본 문서 전용으로 <code>BF-xx</code>(플랫폼/기초)·<code>SA-BAS-xx</code>(BK 기초정보)·<code>OP-VLT/SYS/WBX-xx</code>(운영 콘솔 신규)를 사용하고, 메뉴 카탈로그 <code>M-OP-*</code>/<code>M-WS-*</code>에 매핑한다. 검증은 <span class="badge b-amber">경고</span>(저장가능)·<span class="badge b-red">차단</span>(저장불가) 2단계로 표기한다.</td></tr>
</table>
<div class="tip">본 페이즈는 <b>설정·마스터·운영</b> 중심이므로, 화면 대부분이 <b>좌측 목록/트리 + 중앙 상세 입력(탭) + 우측 정책/검증 패널</b>의 3분할이거나 <b>매트릭스·콘솔·대시보드·배치</b> 형태다. 신규 OP-* 운영 화면은 <b>좌측 자산/잡 목록 + 우측 상세·실행이력</b> 또는 <b>KPI 카드 + 그리드</b> 패턴을 따른다.</div>
<div class="note"><b>페이즈 1 연계 핵심</b> — <code>SA-BAS-03</code> 환경설정의 <b>관리코드 사용여부</b>와 <code>SA-BAS-07</code> 계정과목별 <b>관리항목</b> 설정이 후행 페이즈(P2 전표)의 우측 「선택 라인 추가입력」 패널 노출/필수를 결정한다. 또한 <code>OP-VLT-*</code> 외부 연계 볼트에 등록된 시크릿·토큰은 P2 증빙 수집(국세청 스크래핑)·전자신고 채널의 자격증명으로 직접 소비된다.</div>
</section>
'''

# ---------------- SECTION 2 : 업무 흐름 + 메뉴 카탈로그 ----------------
S2 = '''
<section id="s2">
<h2>2. 업무 흐름 (로그인 → 운영 콘솔 셋업 → 테넌트 생성 → 기초정보 등록)</h2>
<p id="s2-flow">신규 이용회사 도입부터 정상 운영까지 페이즈 1 화면이 사용되는 순서. 1~3단계는 <b>플랫폼/운영조직 1회 설정(전역)</b>, 4~8단계는 <b>이용회사별 셋업</b>, 9~11단계는 <b>반복 운영</b>이다. 각 단계의 <span style="color:#15803d;font-family:Consolas,monospace">코드</span>는 해당 화면 ID이다.</p>
<div class="flow">
  <div class="step"><span class="n">1</span>로그인·MFA<span class="sc">BF-05</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>운영조직·IP 허용<span class="sc">BF-01</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>외부 연계 볼트·시스템 점검<span class="sc">OP-VLT-01·OP-SYS-01</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>공통표준 배포<span class="sc">BF-08</span></div>
</div>
<div class="flow">
  <div class="step"><span class="n">5</span>테넌트 생성·격리<span class="sc">BF-02</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">6</span>구독 활성·기장방식 합의<span class="sc">BF-10·BF-03</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">7</span>사용자·인증·권한<span class="sc">BF-04·BF-07</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">8</span>차원·메뉴·알림<span class="sc">BF-09·BF-12·BF-11</span></div>
</div>
<div class="flow">
  <div class="step"><span class="n">9</span>회사·환경·마스터 등록<span class="sc">SA-BAS-01~11</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">10</span>회사 선택·기장 큐 운영<span class="sc">BF-00 · OP-WBX-01·02</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">11</span>접근 감사·마감이월<span class="sc">BF-06·SA-BAS-14</span></div>
</div>
<div class="tip"><b>로그인 채널 흐름</b> · 로그인(PASSWORD→MFA, BF-05) → 채널 판별 → 운영자는 <b>이용회사 선택</b>(BF-00) 후 접근 모드 선택 → 업무 진입(접근 세션 시작, BF-06). 운영자는 OP 채널의 <b>기장 워크벤치</b>(OP-WBX-01/02)에서 담당 회사 큐·마감 진행판을 운영한다.</div>
</section>

''' + MENU + '''
'''

# ---------------- SECTION 3 : 화면 목록 인벤토리 ----------------
def inv(idv, menu, name, typ, note):
    return ('<tr><td><code>%s</code></td><td>%s</td><td>%s</td><td>%s</td><td>%s</td></tr>'
            % (idv, menu, name, typ, note))

INV_ROWS = []
bf_names = [
 ('BF-00','이용회사 선택(테넌트 스위처)','회사 선택 카드','로그인 후 컨텍스트 확정'),
 ('BF-01','관리회사·운영조직·IP 허용목록','운영조직 배정','M-OP-01'),
 ('BF-02','테넌트 운영 콘솔','운영 콘솔','M-OP-02'),
 ('BF-03','기장 설정·전환 워크플로우','워크플로우 칸반','M-WS-01'),
 ('BF-04','보안 사용자·인증수단·SSO·세션','보안 사용자 관리','M-OP-07'),
 ('BF-05','인증 정책 편집','인증 정책 편집','M-OP-06'),
 ('BF-06','접근 세션 로그·긴급대행','접근 세션 감사','M-OP-05'),
 ('BF-07','역할·가드레일·결재선·배정','권한 매트릭스','M-OP-07'),
 ('BF-08','표준 카탈로그·버전·채택','표준 버전 관리','M-OP-03'),
 ('BF-09','차원·조직관리·사용정책','조직/차원 관리','M-WS-01'),
 ('BF-10','구독 상세·사용량·청구/결제','사용량/청구','M-OP-04'),
 ('BF-11','알림 매트릭스·템플릿·웹훅','알림 매트릭스','M-WS-15'),
 ('BF-12','메뉴 마스터·권한 메뉴·발행','메뉴 발행','M-OP-07'),
]
for c,n,t,note in bf_names:
    INV_ROWS.append(inv(c, 'M-OP/M-WS', n, t, note+' · 이관'))

new_op = [
 ('OP-VLT-01','M-OP-08','시크릿·자격증명 볼트(값 마스킹·키 회전)','볼트 목록+상세','신규'),
 ('OP-VLT-02','M-OP-08','토큰·인증서 만료관리','만료 캘린더/그리드','신규'),
 ('OP-VLT-03','M-OP-08','외부 연결 모니터링','상태 대시보드','신규'),
 ('OP-VLT-04','M-OP-08','ETL 파이프라인(잡·스케줄·이력)','잡 목록+실행이력','신규'),
 ('OP-SYS-01','M-OP-09','관측성(로그·메트릭 대시보드)','관측 대시보드','신규'),
 ('OP-SYS-02','M-OP-09','CI/CD·릴리스','릴리스 파이프라인','신규'),
 ('OP-SYS-03','M-OP-09','SLO·DR 현황','SLO/DR 현황판','신규'),
 ('OP-SYS-04','M-OP-09','배치 잡 모니터','배치 모니터','신규'),
 ('OP-WBX-01','M-OP-10','담당 회사 큐(기장 대행 작업 큐)','작업 큐','신규'),
 ('OP-WBX-02','M-OP-10','마감·신고 진행판(회사별 칸반)','칸반 진행판','신규'),
]
for c,m,n,t,note in new_op:
    INV_ROWS.append(inv(c, m, n, t, note))

sabas_names = [
 ('SA-BAS-01','회사등록','회사 등록 탭'),('SA-BAS-02','권한설정','권한 매트릭스'),
 ('SA-BAS-03','환경설정','환경 설정 콘솔'),('SA-BAS-04','부서등록(회계)','부서 조직도'),
 ('SA-BAS-05','사원등록(회계)','사원 카드'),('SA-BAS-06','거래처등록','거래처 3탭'),
 ('SA-BAS-07','계정과목 및 적요등록','계정과목 빌더'),('SA-BAS-08','현장등록(회계)','현장 계약'),
 ('SA-BAS-09','프로젝트등록(회계)','프로젝트 예산'),('SA-BAS-10','업무용승용차 등록','차량 세무'),
 ('SA-BAS-11','외주처등록','외주 계약'),('SA-BAS-12','거래처DM인쇄','DM 라벨 출력'),
 ('SA-BAS-13','거래처등코드변환','코드 변환 마법사'),('SA-BAS-14','마감후이월(회계)','마감 후 이월'),
]
for c,n,t in sabas_names:
    INV_ROWS.append(inv(c, 'M-WS-01', n, t, '이관'))

S3 = '''
<section id="s3">
<h2>3. 페이즈 1 화면 목록 (인벤토리) — 이관 27 + 신규 10 = 37</h2>
<table>
<tr><th>화면 ID</th><th>메뉴(M-OP/M-WS)</th><th>화면명</th><th>유형</th><th>비고</th></tr>
''' + '\n'.join(INV_ROWS) + '''
</table>
</section>
'''

# ---------------- carried screen sections ----------------
S4 = '''
<section id="s4">
<h2>4. 플랫폼·기초 화면 (BF-00 ~ BF-12, 상세 · 이관)</h2>

''' + BF + '''
</section>
'''

S8 = '''
<section id="s8">
<h2>8. BK 기초정보 화면 (SA-BAS-01 ~ SA-BAS-14, 상세 · 이관)</h2>

''' + SABAS + '''
</section>
'''

# new sections inserted via separate placeholder; written by build then edited.
PLACEHOLDER_NEW = '<!--NEW_OP_SCREENS-->'

doc = (HEAD + S1 + S2 + S3 + S4 + PLACEHOLDER_NEW + S8 + '\n</main></body></html>\n')

out = '페이즈1_플랫폼운영기초_상세화면구성_v3.1.html'
with io.open(out, 'w', encoding='utf-8') as f:
    f.write(doc)
print('WROTE', out, len(doc), 'chars')
