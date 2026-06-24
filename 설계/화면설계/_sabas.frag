<h4 id="sa-bas-01"><span class="sid">SA-BAS-01</span>회사등록</h4>
<table class="meta">
<tr><th>용도</th><td>이용회사의 기본사항·회계기간·신고인·본지점·환급계좌를 등록한다. BK의 "기수 단일파일"을 <code>tenant + fiscal_period</code> 모델로 대체한다.</td></tr>
<tr><th>권한</th><td>회사 관리자</td></tr>
<tr><th>API</th><td><code>GET/POST /api/company</code> · <code>GET/POST /api/company/fiscal-period</code></td></tr>
<tr><th>엔티티</th><td><code>Tenant</code> · <code>FiscalPeriod</code> · <code>Reporter</code> · <code>BranchOffice</code> · <code>RefundAccount</code></td></tr>
</table>
<div class="tip"><b>설계 의도</b> · 기수는 <code>fiscal_period.seq</code> 로 관리하며 회계기간은 법인의 경우 정관상 1년 초과 불가, 개인은 1/1~12/31 고정. 법인등록번호(13자리)·사업자번호(체크섬)를 검증한다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 회사등록<span class="sep">·</span>접근 주체: 회사 관리자<span class="sep">·</span>회사 선택: 좌측 회사 목록에서 선택 또는 [신규]</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>회사구분·기본<span class="sc">Tenant</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>회계기간·기수<span class="sc">FiscalPeriod</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>신고인·본지점<span class="sc">Reporter</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>환급계좌<span class="sc">RefundAccount</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-01 · 회사등록</div>
  <div class="wf-bar"><span>회사등록</span><span class="sp"></span><button class="wf-btn">신규</button><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:0 0 30%">
      <div class="pt">회사 목록</div>
      (주)가나무역<br>다라상사<br>마바건설(주)
    </div>
    <div class="wf-panel pnl" style="flex:1">
      <div class="wf-tab"><span class="on">기본사항</span><span>회계기간</span><span>신고인</span><span>본지점</span><span>환급계좌</span></div>
      <div class="wf-row"><label>회사구분 <span class="req">*</span></label><span class="wf-in">법인 / 개인</span></div>
      <div class="wf-row"><label>회사명 <span class="req">*</span></label><span class="wf-in">(주)가나무역</span></div>
      <div class="wf-row"><label>사업자번호 <span class="req">*</span></label><span class="wf-in">123-45-67890</span></div>
      <div class="wf-row"><label>법인등록번호</label><span class="wf-in">110111-1234567</span></div>
      <div class="wf-row"><label>대표자 <span class="req">*</span></label><span class="wf-in">박대표 (공동대표 가능)</span></div>
      <div class="wf-row"><label>기수 / 회계기간</label><span class="wf-in">제28기 · 2026-01-01~2026-12-31</span></div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>회사구분</td><td>법인/개인 선택</td><td>검증·신고 분기</td></tr>
<tr><td>사업자번호</td><td>체크섬 검증</td><td></td></tr>
<tr><td>회계기간</td><td>법인=1년 초과불가 / 개인=1/1~12/31</td><td>fiscal_period</td></tr>
<tr><td>본지점·환급계좌</td><td>본지점 매핑·환급 계좌(마스킹)</td><td>PII 암호화</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>사업자번호 체크섬</td><td>검증 알고리즘 불일치</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>법인 회계기간 초과</td><td>법인 기간 1년 초과</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>법인등록번호 자리수</td><td>13자리 아님</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="sa-bas-02"><span class="sid">SA-BAS-02</span>권한설정</h4>
<table class="meta">
<tr><th>용도</th><td>사원별 회사권한(전체/관리)·사용여부·메뉴사용(전체/선택)을 권한 매트릭스로 설정한다. 사원은 서비스 배포 시 <code>user↔tenant</code> 자동 반영.</td></tr>
<tr><th>권한</th><td>회사 관리자</td></tr>
<tr><th>API</th><td><code>GET/PUT /api/company/permissions</code></td></tr>
<tr><th>엔티티</th><td><code>UserTenant</code> · <code>MenuPermission</code> · <code>Role</code></td></tr>
</table>
<div class="note"><b>주의</b> · 회사권한 <b>0.전체회사</b> 와 <b>1.관리회사</b> 가 RLS 스코프를 결정한다. 메뉴사용 "선택"은 메뉴 권한 비트맵으로 저장되며 BF-12 발행 메뉴와 결합된다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 권한설정<span class="sep">·</span>접근 주체: 회사 관리자<span class="sep">·</span>회사 선택: 사원 행 선택 → 우측 메뉴사용 비트맵</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>사원 배정<span class="sc">UserTenant</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>회사권한(RLS)<span class="sc">전체/관리</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>메뉴사용 비트맵<span class="sc">MenuPermission</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>BF-12 발행 결합<span class="sc">최종 노출</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-02 · 권한설정 (사원 + 메뉴 비트맵)</div>
  <div class="wf-bar"><b>기초정보 ▸ 권한설정</b><span class="sp"></span><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:1"><div class="pt">사원 권한 (UserTenant)</div>
      <table class="wf-grid">
        <tr><th>사원</th><th>회사권한</th><th>사용여부</th><th>메뉴사용</th></tr>
        <tr><td>김회계</td><td>1.관리회사</td><td>사용</td><td>전체</td></tr>
        <tr><td>이세무</td><td>1.관리회사</td><td>사용</td><td>선택(전표·장부)</td></tr>
        <tr><td>박파트너</td><td>0.전체회사</td><td>사용</td><td>전체</td></tr>
      </table>
    </div>
    <div class="wf-panel pnl" style="flex:0 0 36%"><div class="pt">메뉴사용 · 선택: 이세무</div>
      <div class="wf-row"><label>회사권한</label><span class="wf-sel">1.관리회사</span> <span class="badge b-blue">RLS 스코프</span></div>
      <div class="wf-row"><label>메뉴사용</label><span class="wf-sel">선택</span></div>
      <div class="wf-row"><label>선택 메뉴</label><span class="wf-in wide">☑ 전표 ☑ 장부 ☐ 결산 ☐ 신고</span></div>
      <div class="note" style="margin-top:6px">비트맵 → BF-12 발행 메뉴와 AND 결합.</div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>엔티티 · 비고</th></tr>
<tr><td>회사권한</td><td>0.전체회사 / 1.관리회사</td><td>RLS 스코프</td></tr>
<tr><td>사용여부</td><td>계정 활성/비활성</td><td><code>UserTenant</code></td></tr>
<tr><td>메뉴사용</td><td>전체/선택 → 메뉴 비트맵</td><td><code>MenuPermission</code> · BF-12 결합</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>전체회사 권한 남용</td><td>0.전체회사 다수 부여</td><td><span class="badge b-amber">경고</span></td></tr>
<tr><td>메뉴 미선택</td><td>메뉴사용=선택 ∧ 0건</td><td><span class="badge b-red">차단</span></td></tr>
</table>

<h4 id="sa-bas-03"><span class="sid">SA-BAS-03</span>환경설정</h4>
<table class="meta">
<tr><th>용도</th><td>계정과목 코드체계·소수점 처리·관리코드 사용여부·단축키 등 회사 단위 환경을 설정한다.</td></tr>
<tr><th>권한</th><td>회사 관리자</td></tr>
<tr><th>API</th><td><code>GET/PUT /api/company/settings</code></td></tr>
<tr><th>엔티티</th><td><code>CompanySetting</code> · <code>DimensionConfig</code> · <code>CoaScheme</code></td></tr>
</table>
<div class="note"><b>핵심 연계</b> · 관리코드 <b>사용여부</b>(프로젝트·자금·현장·제품·부서사원·거래처·차량)에서 "<b>1.사용함</b>" 으로 설정한 항목만 <b>전표 입력 시 우측 패널에 노출</b>된다. 이는 BF-09 <code>DimensionConfig.required</code> 및 SA-BAS-07 계정과목별 관리항목과 함께 전표 우측 패널 노출/필수를 최종 결정한다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 환경설정<span class="sep">·</span>접근 주체: 회사 관리자<span class="sep">·</span>회사 선택: 상단 회사 컨텍스트 고정</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>코드체계·소수점<span class="sc">CoaScheme</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>관리코드 사용여부<span class="sc">DimensionConfig</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>계정별 관리항목<span class="sc">→ SA-BAS-07</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>전표 우측 패널<span class="sc">→ P03 입력</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-03 · 환경 설정 콘솔</div>
  <div class="wf-bar"><span>환경설정</span><span class="sp"></span><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel pnl" style="flex:1">
      <div class="pt">코드·소수점</div>
      <div class="wf-row"><label>계정과목 코드체계</label><span class="wf-in">5자리(세목) → COA 길이</span></div>
      <div class="wf-row"><label>소수점 관리</label><span class="wf-in">절사 / 올림 / 반올림</span></div>
      <div class="wf-row"><label>단축키</label><span class="wf-in">F2 조회 · Ctrl+F1 신규</span></div>
    </div>
    <div class="wf-panel" style="flex:1">
      <div class="pt">관리코드 사용여부 (→ 전표 우측 패널)</div>
      프로젝트 <span class="badge b-green">1.사용함</span> · 4자리<br>
      자금 <span class="badge b-green">1.사용함</span><br>
      현장 <span class="badge b-green">1.사용함</span> · 6자리<br>
      제품 <span class="badge b-gray">0.미사용</span><br>
      부서·사원 <span class="badge b-green">1.사용함</span><br>
      거래처 <span class="badge b-green">1.사용함</span><br>
      차량 <span class="badge b-green">1.사용함</span>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>계정 코드체계</td><td>3자리 / 5자리(세목)</td><td>COA 길이 결정</td></tr>
<tr><td>소수점 관리</td><td>절사/올림/반올림</td><td>금액 라운딩</td></tr>
<tr><td>관리코드 사용여부</td><td>7개 관리항목 사용/자리수</td><td><b>전표 우측 패널 노출 결정</b></td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>코드체계 변경</td><td>전표 존재 후 자리수 변경</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>관리코드 사용 해제</td><td>참조 전표 존재 항목 해제</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="sa-bas-04"><span class="sid">SA-BAS-04</span>부서등록</h4>
<table class="meta">
<tr><th>용도</th><td>부서 조직도를 등록한다. <code>DEPARTMENT</code> 독립 차원으로 코스트센터와 분리 운영 가능.</td></tr>
<tr><th>권한</th><td>회사 관리자</td></tr>
<tr><th>API</th><td><code>GET/POST /api/dept</code></td></tr>
<tr><th>엔티티</th><td><code>Department</code> (DEPARTMENT 차원)</td></tr>
</table>
<div class="tip"><b>설계 의도</b> · 부서코드는 4~8자리, 부서명은 한글 30/영문 60자. 조직도 연동 옵션을 제공한다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 부서등록<span class="sep">·</span>접근 주체: 회사 관리자<span class="sep">·</span>회사 선택: 부서 행 선택 → 우측 상세</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>부서 코드·명<span class="sc">Department</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>계층·순위<span class="sc">parent/sort</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>연동<span class="sc">옵션</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>전표 차원 사용<span class="sc">DEPARTMENT</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-04 · 부서 조직도 (목록 + 상세)</div>
  <div class="wf-bar"><b>기초정보 ▸ 부서등록</b><span class="sp"></span><button class="wf-btn">조직도 연동</button><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:1"><div class="pt">부서 목록 (Department)</div>
      <table class="wf-grid">
        <tr><th>코드</th><th>부서명</th><th class="r">순위</th><th>사용</th></tr>
        <tr><td>1000</td><td>경영지원본부</td><td class="r">1</td><td>✔</td></tr>
        <tr><td>1100</td><td>관리부</td><td class="r">2</td><td>✔</td></tr>
        <tr><td>2000</td><td>영업본부</td><td class="r">3</td><td>✔</td></tr>
      </table>
    </div>
    <div class="wf-panel pnl" style="flex:0 0 36%"><div class="pt">상세 · 선택: 관리부</div>
      <div class="wf-row"><label>부서코드 <span class="req">*</span></label><span class="wf-in">1100 (4~8자리)</span></div>
      <div class="wf-row"><label>부서명 <span class="req">*</span></label><span class="wf-in wide">관리부</span></div>
      <div class="wf-row"><label>상위부서</label><span class="wf-sel">경영지원본부</span></div>
      <div class="wf-row"><label>코스트센터</label><span class="wf-in">CC-100 매핑</span></div>
      <div class="wf-row"><label>사용여부</label><span class="wf-sel">사용</span></div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>부서 코드</td><td>4~8자리</td><td></td></tr>
<tr><td>부서명</td><td>한글 30 / 영문 60자</td><td></td></tr>
<tr><td>조직도 연동</td><td>조직 동기화</td><td>옵션</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>코드 자리수</td><td>4~8자리 위반</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>중복 코드</td><td>부서코드 중복</td><td><span class="badge b-red">차단</span></td></tr>
</table>

<h4 id="sa-bas-05"><span class="sid">SA-BAS-05</span>사원등록</h4>
<table class="meta">
<tr><th>용도</th><td>사원을 등록한다. <code>EMPLOYEE</code> 차원. 주민번호는 PII 암호화·마스킹 저장한다.</td></tr>
<tr><th>권한</th><td>회사 관리자 / 인사 담당</td></tr>
<tr><th>API</th><td><code>GET/POST /api/employee</code></td></tr>
<tr><th>엔티티</th><td><code>Employee</code> (EMPLOYEE 차원)</td></tr>
</table>
<div class="note"><b>주의</b> · 사원코드(숫자/문자 10자)는 등록 후 <b>변경 불가</b>. 외국인은 단일세율(19%)·체류자격·국적 입력 필요. 주민번호는 마스킹 표시·Step-up 인증 시 전체 조회.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 사원등록<span class="sep">·</span>접근 주체: 회사 관리자 / 인사 담당<span class="sep">·</span>회사 선택: 사원 행 선택 → 우측 카드</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>사원코드·명<span class="sc">Employee</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>주민/외국인번호<span class="sc">PII 암호화</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>부서·입사<span class="sc">DEPARTMENT</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>전표 차원 사용<span class="sc">EMPLOYEE</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-05 · 사원 (목록 + 카드)</div>
  <div class="wf-bar"><b>기초정보 ▸ 사원등록</b><span class="sp"></span><span class="wf-in">🔍 사원명·코드</span><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:0 0 38%"><div class="pt">사원 목록 (Employee)</div>
      <table class="wf-grid">
        <tr><th>코드</th><th>사원명</th><th>부서</th><th>구분</th></tr>
        <tr><td>E000123</td><td>김직원</td><td>관리부</td><td>내국인</td></tr>
        <tr><td>E000156</td><td>Nguyen V.</td><td>생산부</td><td>외국인</td></tr>
      </table>
    </div>
    <div class="wf-panel pnl" style="flex:1"><div class="pt">사원 카드 · 선택: 김직원</div>
      <div class="wf-row"><label>사원코드 <span class="req">*</span></label><span class="wf-in">E000123</span> <span class="badge b-gray">변경불가</span></div>
      <div class="wf-row"><label>사원명 <span class="req">*</span></label><span class="wf-in wide">김직원</span></div>
      <div class="wf-row"><label>내/외국인</label><span class="wf-sel">내국인</span></div>
      <div class="wf-row"><label>주민번호 <span class="req">*</span></label><span class="wf-in">900101-1****** 👁</span> <span class="badge b-purple">마스킹</span></div>
      <div class="wf-row"><label>부서 / 입사일</label><span class="wf-sel">관리부</span> <span class="wf-in">2024-03-02</span></div>
      <div class="wf-row"><label>체류자격·국적</label><span class="wf-in wide">외국인 시 필수 · 단일세율 19%</span></div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>사원코드</td><td>숫자/문자 10자</td><td>변경불가</td></tr>
<tr><td>주민번호</td><td>PII 암호화·마스킹</td><td>Step-up 조회</td></tr>
<tr><td>외국인 정보</td><td>체류자격·국적·단일세율</td><td>외국인 19%</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>주민번호 형식</td><td>체크섬·생년월일 검증</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>외국인 체류자격 누락</td><td>외국인 ∧ 체류자격 미입력</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="sa-bas-06"><span class="sid">SA-BAS-06</span>거래처등록</h4>
<table class="meta">
<tr><th>용도</th><td>거래처를 일반/금융/카드 3탭으로 등록한다. 국세청 휴폐업·진위확인 연동.</td></tr>
<tr><th>권한</th><td>회사 관리자 / 기장 담당</td></tr>
<tr><th>API</th><td><code>GET/POST /api/partner</code> · <code>POST /api/partner/verify</code> (국세청)</td></tr>
<tr><th>엔티티</th><td><code>Partner</code> · <code>PartnerBank</code> · <code>PartnerCard</code></td></tr>
</table>
<div class="tip"><b>설계 의도</b> · 거래처구분(매출/매입)·등록번호구분(사업자/주민/외국인)이 세금계산서·신고 분류에 사용된다. 금융·카드 탭의 계좌·카드번호는 마스킹.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 거래처등록<span class="sep">·</span>접근 주체: 회사 관리자 / 기장 담당<span class="sep">·</span>회사 선택: 거래처 행 선택 → 우측 3탭 상세</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>거래처 기본<span class="sc">Partner</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>진위·휴폐업 확인<span class="sc">국세청</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>금융·카드 등록<span class="sc">PartnerBank/Card</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>전표·원장 연결<span class="sc">→ 거래처원장</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-06 · 거래처 (목록 + 3탭 상세)</div>
  <div class="wf-bar"><b>기초정보 ▸ 거래처등록</b><span class="sp"></span><button class="wf-btn">진위확인</button><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:0 0 36%"><div class="pt">거래처 목록 (Partner)</div>
      <table class="wf-grid">
        <tr><th>코드</th><th>거래처명</th><th>구분</th></tr>
        <tr><td>P001023</td><td>(주)대한전자</td><td>매입</td></tr>
        <tr><td>P001044</td><td>가나무역</td><td>매출</td></tr>
      </table>
    </div>
    <div class="wf-panel pnl" style="flex:1"><div class="pt">상세 · 선택: (주)대한전자</div>
      <div class="wf-tab"><span class="on">일반</span><span>금융(PartnerBank)</span><span>카드(PartnerCard)</span></div>
      <div class="wf-row"><label>거래처코드 <span class="req">*</span></label><span class="wf-in">P001023 (6~10)</span></div>
      <div class="wf-row"><label>거래처명 <span class="req">*</span></label><span class="wf-in wide">(주)대한전자</span></div>
      <div class="wf-row"><label>거래처구분</label><span class="wf-sel">매입</span></div>
      <div class="wf-row"><label>등록번호구분</label><span class="wf-sel">사업자</span></div>
      <div class="wf-row"><label>사업자번호 <span class="req">*</span></label><span class="wf-in">220-81-12345</span> <span class="badge b-green">정상(휴폐업 아님)</span></div>
      <div class="wf-row"><label>사용여부</label><span class="wf-sel">사용</span></div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>3탭</td><td>일반/금융/카드</td><td>계좌·카드 마스킹</td></tr>
<tr><td>거래처구분</td><td>매출/매입</td><td>신고 분류</td></tr>
<tr><td>진위확인</td><td>국세청 휴폐업 조회</td><td><code>partner_type</code></td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>사업자번호 체크섬</td><td>검증 불일치</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>휴폐업 거래처</td><td>국세청 폐업 확인</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="sa-bas-07"><span class="sid">SA-BAS-07</span>계정과목·적요</h4>
<table class="meta">
<tr><th>용도</th><td>계정체계(자산/부채/자본/수익/비용·제조·도급·분양)별 계정과목을 등록하고 계정별 적요·관리항목을 설정한다.</td></tr>
<tr><th>권한</th><td>회사 관리자</td></tr>
<tr><th>API</th><td><code>GET/POST /api/coa</code> · <code>GET/PUT /api/coa/:code/dimensions</code></td></tr>
<tr><th>엔티티</th><td><code>ChartOfAccount</code> · <code>AccountSummary</code> · <code>AccountDimension</code></td></tr>
</table>
<div class="note"><b>핵심 연계</b> · 계정과목별 <b>관리항목</b> 설정이 전표 라인의 <b>필수 관리차원 및 전표 우측 패널 노출</b>을 결정한다. SA-BAS-03 관리코드 사용여부(회사 단위)와 본 화면의 관리항목(계정 단위)이 함께 작용한다. 검은색 계정은 수정 가능, 붉은색 계정은 Ctrl+F1로 신규 추가.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 계정과목·적요<span class="sep">·</span>접근 주체: 회사 관리자<span class="sep">·</span>회사 선택: 계정체계 트리 → 계정 선택</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>계정체계 선택<span class="sc">자산~분양</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>계정·세목 등록<span class="sc">ChartOfAccount</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>적요·관계 설정<span class="sc">AccountSummary</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>관리항목 지정<span class="sc">→ 전표 우측 패널</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-07 · 계정과목 빌더</div>
  <div class="wf-bar"><span>계정과목·적요</span><span class="sp"></span><span class="kbd">Ctrl+F1 신규</span><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:0 0 30%">
      <div class="pt">계정체계</div>
      자산 · 부채 · 자본<br>수익 · 비용<br>제조 · 도급 · 분양
    </div>
    <div class="wf-panel pnl" style="flex:1">
      <div class="wf-row"><label>계정코드 <span class="req">*</span></label><span class="wf-in">40100 (3/5자리 세목)</span></div>
      <div class="wf-row"><label>계정과목 <span class="req">*</span></label><span class="wf-in">제품매출</span></div>
      <div class="wf-row"><label>구분 / 사용</label><span class="wf-in">수익 / 사용</span></div>
      <div class="wf-row"><label>관계(결산대체)</label><span class="wf-in">손익대체</span></div>
      <div class="wf-row"><label>관리항목 <span class="req">*</span></label><span class="wf-in">거래처(필수)·부서·프로젝트 → 전표 우측 패널</span></div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>계정체계</td><td>자산~비용·제조·도급·분양</td><td></td></tr>
<tr><td>계정코드</td><td>3자리 / 5자리(세목)</td><td>SA-BAS-03 연동</td></tr>
<tr><td>관리항목</td><td>계정별 필수 관리차원</td><td><b>전표 우측 패널 노출/필수 결정</b></td></tr>
<tr><td>관계</td><td>결산대체 연결</td><td></td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>표준 계정 코드 수정</td><td>붉은색 표준계정 직접 수정</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>관리항목 변경</td><td>전표 존재 계정 관리항목 변경</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="sa-bas-08"><span class="sid">SA-BAS-08</span>현장등록</h4>
<table class="meta">
<tr><th>용도</th><td>건설 현장을 등록한다. <code>SITE</code> 차원. 현장구분(도급/분양)이 원가귀속·매출원가 결산대체 분기를 결정한다.</td></tr>
<tr><th>권한</th><td>회사 관리자 (건설업)</td></tr>
<tr><th>API</th><td><code>GET/POST /api/site</code></td></tr>
<tr><th>엔티티</th><td><code>Site</code> (SITE 차원)</td></tr>
</table>
<div class="note"><b>주의</b> · 현장코드 사용은 SA-BAS-03에서 현장 관리코드 "사용함" 전제. 현장구분 <b>0.도급</b> / <b>1.분양</b>에 따라 407 공사수입금 등 원가귀속·결산대체 로직이 분기된다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 현장등록<span class="sep">·</span>접근 주체: 회사 관리자(건설업)<span class="sep">·</span>회사 선택: 현장 행 선택 → 우측 계약 상세</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>현장 코드·명<span class="sc">Site</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>현장구분(도급/분양)<span class="sc">원가귀속 분기</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>공사기간·진행<span class="sc">공정률</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>전표 차원 사용<span class="sc">SITE</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-08 · 현장 (목록 + 계약 상세)</div>
  <div class="wf-bar"><b>기초정보 ▸ 현장등록</b><span class="sp"></span><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:0 0 38%"><div class="pt">현장 목록 (Site)</div>
      <table class="wf-grid">
        <tr><th>코드</th><th>현장명</th><th>구분</th></tr>
        <tr><td>S00012</td><td>강남 OO오피스텔</td><td>도급</td></tr>
        <tr><td>S00015</td><td>판교 분양아파트</td><td>분양</td></tr>
      </table>
    </div>
    <div class="wf-panel pnl" style="flex:1"><div class="pt">계약 상세 · 선택: 강남 OO오피스텔</div>
      <div class="wf-row"><label>현장코드 <span class="req">*</span></label><span class="wf-in">S00012</span></div>
      <div class="wf-row"><label>현장명 <span class="req">*</span></label><span class="wf-in wide">강남 OO오피스텔 신축</span></div>
      <div class="wf-row"><label>현장구분</label><span class="wf-sel">0.도급</span></div>
      <div class="wf-row"><label>진행상황</label><span class="wf-in">진행중 (공정 62%)</span></div>
      <div class="wf-row"><label>공사기간</label><span class="wf-in wide">2025-04-01 ~ 2027-03-31</span></div>
      <div class="wf-row"><label>사용구분</label><span class="wf-sel">사용</span></div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>현장구분</td><td>0.도급 / 1.분양</td><td>원가귀속 분기</td></tr>
<tr><td>진행상황</td><td>진행/완료/보류·공정률</td><td></td></tr>
<tr><td>공사기간</td><td>착공~준공</td><td></td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>현장코드 미사용 설정</td><td>SA-BAS-03 현장 미사용</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>공사기간 역전</td><td>착공일 > 준공일</td><td><span class="badge b-red">차단</span></td></tr>
</table>

<h4 id="sa-bas-09"><span class="sid">SA-BAS-09</span>프로젝트등록</h4>
<table class="meta">
<tr><th>용도</th><td>프로젝트를 등록하고 예산을 관리한다. <code>PROJECT</code> 차원.</td></tr>
<tr><th>권한</th><td>회사 관리자</td></tr>
<tr><th>API</th><td><code>GET/POST /api/project</code></td></tr>
<tr><th>엔티티</th><td><code>Project</code> (PROJECT 차원)</td></tr>
</table>
<div class="tip"><b>설계 의도</b> · 프로젝트 예산금액은 장부·보조부에서 예산 대비 실적 집계의 기준이 된다. 조회조건(진행/완료/보류)으로 필터.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 프로젝트등록<span class="sep">·</span>접근 주체: 회사 관리자<span class="sep">·</span>회사 선택: 프로젝트 행 선택 → 우측 예산 상세</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>프로젝트 등록<span class="sc">Project</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>기간·예산<span class="sc">budget</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>전표 차원 사용<span class="sc">PROJECT</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>예산 대비 실적<span class="sc">→ 장부</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-09 · 프로젝트 (목록 + 예산)</div>
  <div class="wf-bar"><b>기초정보 ▸ 프로젝트등록</b><span class="sp"></span><button class="wf-btn pri">저장</button></div>
  <div class="wf-tool"><span class="wf-sel">조회조건: 진행</span><span class="wf-btn">조회</span></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:1"><div class="pt">프로젝트 목록 (Project)</div>
      <table class="wf-grid">
        <tr><th>코드</th><th>프로젝트명</th><th>시작</th><th>종료</th><th class="r">예산금액</th></tr>
        <tr><td>PRJ001</td><td>차세대 ERP 구축</td><td>2026-01-01</td><td>2026-12-31</td><td class="r">350,000,000</td></tr>
        <tr><td>PRJ002</td><td>물류센터 자동화</td><td>2026-03-01</td><td>2026-09-30</td><td class="r">120,000,000</td></tr>
      </table>
    </div>
    <div class="wf-panel pnl" style="flex:0 0 34%"><div class="pt">상세 · 선택: 차세대 ERP 구축</div>
      <div class="wf-row"><label>코드</label><span class="wf-in">PRJ001</span></div>
      <div class="wf-row"><label>기간</label><span class="wf-in wide">2026-01-01 ~ 12-31</span></div>
      <div class="wf-row"><label>예산금액</label><span class="wf-in">350,000,000</span></div>
      <div class="wf-row"><label>집행(실적)</label><span class="wf-in">142,000,000</span> <span class="badge b-green">41%</span></div>
      <div class="wf-row"><label>상태</label><span class="wf-sel">진행</span></div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>조회조건</td><td>진행/완료/보류</td><td></td></tr>
<tr><td>예산금액</td><td>프로젝트 예산</td><td>실적 대비</td></tr>
<tr><td>시작/종료일</td><td>프로젝트 기간</td><td></td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>기간 역전</td><td>시작일 > 종료일</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>예산 미입력</td><td>예산금액 0</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="sa-bas-10"><span class="sid">SA-BAS-10</span>업무용승용차</h4>
<table class="meta">
<tr><th>용도</th><td>업무용 승용차를 등록한다. 명의구분·임차기간·운행기록·보험을 관리하며 비용한도(800만원)·운행기록부 업무사용비율 산정 근거가 된다.</td></tr>
<tr><th>권한</th><td>회사 관리자 / 세무 담당</td></tr>
<tr><th>API</th><td><code>GET/POST /api/vehicle</code></td></tr>
<tr><th>엔티티</th><td><code>Vehicle</code> · <code>VehicleLog</code> (고정자산 연동)</td></tr>
</table>
<div class="note"><b>주의</b> · 명의구분(회사/렌트/리스)이 업무용승용차 비용명세서 작성을 분기한다. 업무전용 보험 미가입·운행기록부 미작성 시 비용 한도(연 800만원) 제한이 적용된다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 업무용승용차<span class="sep">·</span>접근 주체: 회사 관리자 / 세무 담당<span class="sep">·</span>회사 선택: 차량 행 선택 → 우측 세무 상세</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>차량 등록<span class="sc">Vehicle</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>명의구분·임차<span class="sc">회사/렌트/리스</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>보험·운행기록<span class="sc">VehicleLog</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>비용명세서·한도<span class="sc">800만원</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-10 · 차량 (목록 + 세무 상세)</div>
  <div class="wf-bar"><b>기초정보 ▸ 업무용승용차</b><span class="sp"></span><span class="kbd">Enter 코드자동</span><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:0 0 36%"><div class="pt">차량 목록 (Vehicle)</div>
      <table class="wf-grid">
        <tr><th>코드</th><th>차량번호</th><th>명의</th></tr>
        <tr><td>V001</td><td>12가3456</td><td>회사</td></tr>
        <tr><td>V002</td><td>34나7890</td><td>리스</td></tr>
      </table>
    </div>
    <div class="wf-panel pnl" style="flex:1"><div class="pt">세무 상세 · 선택: 12가3456</div>
      <div class="wf-row"><label>차량코드</label><span class="wf-in">V001 (Enter 자동)</span></div>
      <div class="wf-row"><label>차량번호 / 차종</label><span class="wf-in wide">12가3456 / 카니발</span></div>
      <div class="wf-row"><label>명의구분</label><span class="wf-sel">회사</span></div>
      <div class="wf-row"><label>임차기간</label><span class="wf-in wide">2025-01-01 ~ 2027-12-31</span></div>
      <div class="wf-row"><label>기초주행거리</label><span class="wf-in">12,500 km</span></div>
      <div class="wf-row"><label>업무전용보험</label><span class="wf-in">가입 · 업무사용비율 92%</span></div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>명의구분</td><td>회사/렌트/리스</td><td>비용명세서 분기</td></tr>
<tr><td>보험·운행기록</td><td>업무전용보험·업무사용비율</td><td>한도 800만원</td></tr>
<tr><td>고정자산 연동</td><td>회사 명의 차량 자산 연결</td><td></td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>업무전용보험 미가입</td><td>법인 차량 보험 미가입</td><td><span class="badge b-amber">경고</span></td></tr>
<tr><td>운행기록 누락</td><td>비율 산정 근거 없음</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="sa-bas-11"><span class="sid">SA-BAS-11</span>외주처등록</h4>
<table class="meta">
<tr><th>용도</th><td>외주 계약을 등록한다. 현장·거래처와 연결되며 회차별 계약금·선급금을 관리한다(외주대장).</td></tr>
<tr><th>권한</th><td>회사 관리자 (건설업)</td></tr>
<tr><th>API</th><td><code>GET/POST /api/subcontract</code></td></tr>
<tr><th>엔티티</th><td><code>Subcontract</code> · <code>SubcontractPayment</code> (Site·Partner 연결)</td></tr>
</table>
<div class="tip"><b>설계 의도</b> · 외주처는 현장(SA-BAS-08)과 거래처(SA-BAS-06)를 연결한 계약 단위이며, 회차별 계약금/선급금이 외주대장·원가에 반영된다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 외주처등록<span class="sep">·</span>접근 주체: 회사 관리자(건설업)<span class="sep">·</span>회사 선택: 외주 계약 행 선택 → 우측 회차 상세</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>현장·거래처 연결<span class="sc">Site×Partner</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>계약 등록<span class="sc">Subcontract</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>회차별 지급<span class="sc">SubcontractPayment</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>외주대장·원가<span class="sc">→ 원가</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-11 · 외주 (목록 + 계약·회차)</div>
  <div class="wf-bar"><b>기초정보 ▸ 외주처등록</b><span class="sp"></span><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:0 0 38%"><div class="pt">외주 계약 (Subcontract)</div>
      <table class="wf-grid">
        <tr><th>현장</th><th>외주처</th><th class="r">계약금액</th></tr>
        <tr><td>강남 오피스텔</td><td>(주)튼튼건설</td><td class="r">2,400,000,000</td></tr>
        <tr><td>판교 아파트</td><td>대박설비(주)</td><td class="r">680,000,000</td></tr>
      </table>
    </div>
    <div class="wf-panel pnl" style="flex:1"><div class="pt">계약 상세 · 선택: (주)튼튼건설</div>
      <div class="wf-row"><label>현장 / 거래처</label><span class="wf-in wide">강남 OO오피스텔 / (주)튼튼건설</span></div>
      <div class="wf-row"><label>공사내용 / 면허</label><span class="wf-in wide">철근콘크리트 / 종합건설</span></div>
      <div class="wf-row"><label>공사기간</label><span class="wf-in wide">2025-06-01 ~ 2026-08-31</span></div>
      <div class="wf-row"><label>총계약금액</label><span class="wf-in">2,400,000,000</span></div>
      <div class="wf-row"><label>회차별 계약금/선급</label><span class="wf-in wide">1회 선급 240,000,000 (10%)</span></div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>현장·거래처 연결</td><td>현장 + 외주처 매핑</td><td></td></tr>
<tr><td>총계약금액</td><td>계약 총액</td><td></td></tr>
<tr><td>회차별 지급</td><td>계약금/선급금 회차</td><td>외주대장</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>선급금 초과</td><td>회차 합 > 총계약금액</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>현장 미연결</td><td>외주처 ∧ 현장 미지정</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="sa-bas-12"><span class="sid">SA-BAS-12</span>거래처DM인쇄</h4>
<table class="meta">
<tr><th>용도</th><td>거래처 DM 라벨을 출력한다(read-only 뷰). 거래상태·주소 선택 후 라벨 미리보기·인쇄.</td></tr>
<tr><th>권한</th><td>기장 담당 / 영업 담당</td></tr>
<tr><th>API</th><td><code>GET /api/partner/dm-labels</code></td></tr>
<tr><th>엔티티</th><td><code>Partner</code> (조회 전용)</td></tr>
</table>
<div class="tip"><b>설계 의도</b> · 데이터 변경이 없는 출력 전용 화면. 주소는 사업장 주소 또는 DB 주소 중 선택하며 라벨 규격 미리보기 후 인쇄.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 거래처DM인쇄<span class="sep">·</span>접근 주체: 기장 담당 / 영업 담당<span class="sep">·</span>회사 선택: 거래처 필터 후 라벨 미리보기 (read-only)</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>거래처 필터<span class="sc">구분·상태</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>주소 선택<span class="sc">사업장/DB</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>라벨 미리보기<span class="sc">규격</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>인쇄<span class="sc">print</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-12 · DM 라벨 출력</div>
  <div class="wf-bar"><span>거래처DM인쇄</span><span class="sp"></span><button class="wf-btn">미리보기</button><button class="wf-btn pri">라벨 인쇄</button></div>
  <div class="wf-tool"><span class="wf-in">구분: 매출</span><span class="wf-in">거래상태: 정상</span><span class="kbd">F2 거래처</span></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:0 0 40%"><div class="pt">주소 선택</div>사업장 주소 / DB 주소</div>
    <div class="wf-panel pnl" style="flex:1"><div class="pt">라벨 미리보기</div>(주)대한전자<br>서울 강남구 테헤란로 ...<br>대표 홍길동 귀하</div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>구분·거래상태</td><td>매출/매입·정상/중지</td><td>필터</td></tr>
<tr><td>주소 선택</td><td>사업장/DB 주소</td><td></td></tr>
<tr><td>라벨 미리보기·인쇄</td><td>규격 미리보기 후 출력</td><td>read-only</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>주소 없음</td><td>선택 주소 미등록</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="sa-bas-13"><span class="sid">SA-BAS-13</span>거래처등코드변환</h4>
<table class="meta">
<tr><th>용도</th><td>계정·거래처·품목 코드를 일괄 변환한다. 변환 전→후 코드 매핑 후 미리보기·변환 실행.</td></tr>
<tr><th>권한</th><td>회사 관리자</td></tr>
<tr><th>API</th><td><code>POST /api/code-convert/preview</code> · <code>POST /api/code-convert/execute</code></td></tr>
<tr><th>엔티티</th><td><code>Journal</code> · <code>ChartOfAccount</code> · <code>Partner</code> (복합키 일괄 갱신)</td></tr>
</table>
<div class="note"><b>주의</b> · <b>자금항목 계정은 변환 불가</b>, <b>마감 기간은 변환 불가</b>(마감 상태 가드). 변환은 <code>(tenant_id, 전표일자, 전표번호)</code> 복합키 기준 일괄 갱신이며, 실행 전 미리보기로 영향 건수를 확인한다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 거래처등코드변환<span class="sep">·</span>접근 주체: 회사 관리자<span class="sep">·</span>회사 선택: 상단 회사·기간 컨텍스트 고정 (배치)</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>변환대상 선택<span class="sc">계정/거래처/품목</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>변환 전→후 매핑<span class="sc">F2 조회</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>미리보기(영향 건수)<span class="sc">preview</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>일괄 변환·가드<span class="sc">execute</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-13 · 코드 변환 마법사</div>
  <div class="wf-bar"><span>거래처등코드변환</span><span class="sp"></span><button class="wf-btn">미리보기</button><button class="wf-btn dng">변환 실행</button></div>
  <div class="wf-body"><div class="wf-panel pnl">
    <div class="wf-row"><label>변환대상</label><span class="wf-in">계정 / 거래처 / 품목코드</span></div>
    <div class="wf-row"><label>변환대상조건</label><span class="wf-in">사용중 · 미마감 기간</span></div>
    <div class="wf-row"><label>변환 전 → 후</label><span class="wf-in">P001023 → P002500</span> <span class="kbd">F2</span></div>
    <div class="wf-row"><label>전표구분</label><span class="wf-in">전체 / 매입 / 매출</span></div>
    <div class="wf-row"><label>영향 건수(미리보기)</label><span class="wf-in">전표 482건 · 보조부 1,204건</span></div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>변환대상</td><td>계정/거래처/품목코드</td><td></td></tr>
<tr><td>변환 전→후</td><td>코드 매핑(F2 조회)</td><td></td></tr>
<tr><td>미리보기/실행</td><td>영향 건수 확인 후 일괄 갱신</td><td>복합키</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>자금항목 계정 변환</td><td>자금 연결 계정 변환 시도</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>마감 기간 변환</td><td>마감(CLOSED) 전표 포함</td><td><span class="badge b-red">차단</span></td></tr>
</table>

<h4 id="sa-bas-14"><span class="sid">SA-BAS-14</span>마감후이월 (회계)</h4>
<table class="meta">
<tr><th>용도</th><td>마감 기수의 재무제표·거래처·부서사원·현장·프로젝트·고정자산·차량 잔액을 이월 기수로 이월한다. <code>opening_balance</code> idempotent 적재.</td></tr>
<tr><th>권한</th><td>회사 관리자 / 결산 담당</td></tr>
<tr><th>API</th><td><code>POST /api/closing/carry-forward</code></td></tr>
<tr><th>엔티티</th><td><code>FiscalPeriod</code> · <code>OpeningBalance</code> · <code>ClosingState</code></td></tr>
</table>
<div class="note"><b>주의</b> · 마감 상태(TEMP_CLOSED/CLOSED/LOCKED)가 전표 수정·코드 변환(SA-BAS-13)의 가드로 작용한다. 이월은 멱등(idempotent) 처리되어 재실행 시 중복 적재되지 않으며, 이월 완료 후 마감 기간은 잠금된다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>기초정보 ▸ 마감후이월<span class="sep">·</span>접근 주체: 회사 관리자 / 결산 담당<span class="sep">·</span>회사 선택: 마감/이월 기수 선택 (배치)</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>마감 확인<span class="sc">CLOSED</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>이월 대상 선택<span class="sc">잔액·마스터</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>이월 실행(멱등)<span class="sc">OpeningBalance</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>기수 잠금<span class="sc">LOCKED</span></div>
</div>
<div class="wf">
  <div class="wf-cap">SA-BAS-14 · 마감 후 이월</div>
  <div class="wf-bar"><span>마감후이월</span><span class="sp"></span><button class="wf-btn pri">이월 실행</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel pnl" style="flex:1">
      <div class="pt">기수</div>
      <div class="wf-row"><label>마감 기수 <span class="req">*</span></label><span class="wf-in">제27기 (2025) · CLOSED</span></div>
      <div class="wf-row"><label>이월 기수 <span class="req">*</span></label><span class="wf-in">제28기 (2026)</span></div>
    </div>
    <div class="wf-panel" style="flex:1">
      <div class="pt">이월 대상</div>
      ☑ 재무제표 잔액 &nbsp; ☑ 거래처<br>☑ 부서·사원 &nbsp; ☑ 현장<br>☑ 프로젝트 &nbsp; ☑ 고정자산 &nbsp; ☑ 차량
    </div>
  </div></div>
  <div class="wf-foot"><span>이월 후 마감 기수 잠금(LOCKED) · 멱등 적재(중복 방지)</span></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>마감/이월 기수</td><td>fiscal_period 선택</td><td></td></tr>
<tr><td>이월 대상 체크</td><td>재무제표·거래처·부서사원·현장·프로젝트·고정자산·차량</td><td></td></tr>
<tr><td>이월 실행</td><td>opening_balance 적재·기간 잠금</td><td>idempotent</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>미마감 기수 이월</td><td>마감 기수 ≠ CLOSED</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>이월 재실행</td><td>이미 이월 완료 기수</td><td><span class="badge b-amber">경고</span></td></tr>
</table>
