<h4 id="bf-00"><span class="sid">BF-00</span>이용회사 선택 (테넌트 스위처)</h4>
<table class="meta">
<tr><th>용도</th><td>로그인 사용자가 접근 권한이 있는 이용회사(테넌트)를 선택하여 세션 컨텍스트를 확정한다. 선택 결과가 이후 모든 화면의 RLS 스코프를 결정한다.</td></tr>
<tr><th>권한</th><td>전 사용자(역할 무관). 단, 노출되는 회사 카드는 <code>user↔tenant</code> 매핑과 BF-07 권한 매트릭스로 필터링.</td></tr>
<tr><th>API</th><td><code>GET /api/me/tenants</code> · <code>POST /api/session/context</code> (tenant_id, fiscal_period_id)</td></tr>
<tr><th>엔티티</th><td><code>Tenant</code> · <code>UserTenant</code> · <code>FiscalPeriod</code> · <code>SessionContext</code></td></tr>
</table>
<div class="tip"><b>설계 의도</b> · 회사 전환은 단순 화면 이동이 아니라 <b>세션 RLS 스코프 재설정</b>이다. 전환 즉시 모든 쿼리에 <code>tenant_id = :ctx</code> 가 강제 적용되며, 회계기간·기장모드·권한 스트립이 상단에 고정 노출된다. 연계: 2장(테넌시), 5장(보안), 21장(컨텍스트).</div>
<div class="wf">
  <div class="wf-cap">BF-00 · 이용회사 선택 카드</div>
  <div class="wf-bar"><span>이용회사 선택</span><span class="sp"></span><span class="kbd">Ctrl+회사검색</span></div>
  <div class="wf-tool"><span class="wf-in">🔍 회사명·사업자번호 검색</span><span class="wf-btn">즐겨찾기</span><span class="wf-btn">최근 접속</span></div>
  <div class="wf-body">
    <div class="wf-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
      <div class="wf-panel pnl"><div class="pt">(주)가나무역 <span class="badge b-green">운영중</span></div>123-45-67890 · 법인 · 2026기 · 일반기장</div>
      <div class="wf-panel pnl"><div class="pt">다라상사 <span class="badge b-red">마감잠금</span></div>211-88-12345 · 개인 · 2025기 · 간편기장</div>
      <div class="wf-panel pnl"><div class="pt">마바건설(주) <span class="badge b-amber">전환대기</span></div>312-81-00021 · 법인 · 기장모드 전환 검토중</div>
    </div>
  </div>
  <div class="wf-foot"><span>선택 회사 컨텍스트: 회계기간 2026-01-01~2026-12-31 · 일반기장 · 권한 [조회·입력·승인]</span><span class="sp"></span><button class="wf-btn pri">이 회사로 진입</button></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>회사 검색</td><td>회사명/사업자등록번호 부분일치 검색</td><td>권한 있는 테넌트만</td></tr>
<tr><td>회사 카드</td><td>상태 배지(운영중/마감잠금/전환대기) + 회계기간·기장모드 표시</td><td>마감잠금은 조회만</td></tr>
<tr><td>컨텍스트 스트립</td><td>선택 후 상단 고정: 회계기간·기장모드·권한 범위</td><td>RLS 스코프 시각화</td></tr>
<tr><td>진입 버튼</td><td>세션 컨텍스트 갱신 후 메뉴 진입</td><td><code>POST /session/context</code></td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>권한 없는 회사 진입</td><td>UserTenant 매핑 없으면 카드 미노출</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>마감잠금 회사 입력 시도</td><td>LOCKED 상태는 입력 메뉴 비활성</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="bf-01"><span class="sid">BF-01</span>운영조직·IP 허용목록</h4>
<table class="meta">
<tr><th>용도</th><td>기장 운영조직(회계법인/세무사무소 등)을 정의하고 담당자·담당테넌트·접근 모드·IP 대역을 배정한다.</td></tr>
<tr><th>권한</th><td>플랫폼 관리자 / 운영조직 관리자</td></tr>
<tr><th>API</th><td><code>GET/POST /api/org/units</code> · <code>PUT /api/org/ip-allowlist</code></td></tr>
<tr><th>엔티티</th><td><code>OrgUnit</code> · <code>OrgMember</code> · <code>OrgTenantAssign</code> · <code>IpAllowlist</code></td></tr>
</table>
<div class="note"><b>주의</b> · IP 허용목록에 등록되지 않은 대역에서의 접근은 인증 정책(BF-05)과 결합하여 <b>차단</b>되거나 MFA 강제로 전환된다. 유효기간 만료 대역은 자동 비활성.</div>
<div class="wf">
  <div class="wf-cap">BF-01 · 운영조직 배정</div>
  <div class="wf-bar"><span>운영조직·IP 허용목록</span><span class="sp"></span><button class="wf-btn">신규 조직</button><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:0 0 32%">
      <div class="pt">조직 트리</div>
      ├ EY 세무본부<br>&nbsp;&nbsp;├ 법인기장 1팀<br>&nbsp;&nbsp;└ 개인기장 2팀
    </div>
    <div class="wf-panel pnl" style="flex:1">
      <div class="pt">상세 · 법인기장 1팀</div>
      <div class="wf-row"><label>조직코드 <span class="req">*</span></label><span class="wf-in">ORG-1001</span></div>
      <div class="wf-row"><label>담당자 <span class="req">*</span></label><span class="wf-in">김회계 (선임)</span></div>
      <div class="wf-row"><label>담당 테넌트</label><span class="wf-in">(주)가나무역 외 12사</span></div>
      <div class="wf-row"><label>접근 모드</label><span class="wf-in">상시 / 대행 / 조회전용</span></div>
      <div class="wf-row"><label>IP 대역 <span class="req">*</span></label><span class="wf-in">211.45.0.0/16, 10.0.0.0/8</span></div>
      <div class="wf-row"><label>유효기간</label><span class="wf-in">2026-01-01 ~ 2026-12-31</span></div>
      <div class="wf-row"><label>승인자</label><span class="wf-in">박파트너</span></div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>조직 트리</td><td>운영조직 계층 + 드래그 이동</td><td></td></tr>
<tr><td>담당 테넌트 배정</td><td>조직↔테넌트 N:M 매핑</td><td>RLS 접근 범위</td></tr>
<tr><td>IP 대역</td><td>CIDR 표기, 다중 등록</td><td>유효기간 단위</td></tr>
<tr><td>DimensionConfig</td><td>조직 단위 차원 사용/필수 기본값</td><td>BF-09 연계</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>IP 대역 형식</td><td>CIDR 유효성 검사</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>유효기간 역전</td><td>시작일 > 종료일</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>승인자 미지정</td><td>접근 모드=대행 시 승인자 필수</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="bf-02"><span class="sid">BF-02</span>테넌트 운영 콘솔</h4>
<table class="meta">
<tr><th>용도</th><td>전체 테넌트의 DB 티어·사용량·스냅샷·백그라운드 잡 상태를 모니터링하고 운영 액션(티어전환·스냅샷·잡 재시도·쿼터 조정)을 수행한다.</td></tr>
<tr><th>권한</th><td>플랫폼 운영자(SRE) 전용</td></tr>
<tr><th>API</th><td><code>GET /api/ops/tenants</code> · <code>POST /api/ops/snapshot</code> · <code>POST /api/ops/job/retry</code></td></tr>
<tr><th>엔티티</th><td><code>Tenant</code> · <code>DbTier</code> · <code>Snapshot</code> · <code>JobRun</code> · <code>Quota</code></td></tr>
</table>
<div class="tip"><b>설계 의도</b> · 멀티테넌트 SHARED+RLS 구조에서 특정 테넌트의 부하·용량을 개별 격리·조정할 수 있도록 운영 KPI를 한 화면에 집약한다.</div>
<div class="wf">
  <div class="wf-cap">BF-02 · 테넌트 운영 콘솔</div>
  <div class="wf-bar"><span>테넌트 운영 콘솔</span><span class="sp"></span><span class="kbd">자동새로고침 30s</span></div>
  <div class="wf-tool"><span class="wf-btn">DB 티어: 표준 142 · 프리미엄 18</span><span class="wf-btn">스냅샷 잡: 진행 3</span><span class="wf-btn dng">실패 잡: 1</span></div>
  <div class="wf-body">
    <table class="wf-grid">
      <tr><th>테넌트</th><th>DB 티어</th><th class="r">전표/월</th><th class="r">사용량</th><th>스냅샷</th><th>액션</th></tr>
      <tr><td>(주)가나무역</td><td>프리미엄</td><td class="r">12,400</td><td class="r">68%</td><td>02:00 완료</td><td><span class="wf-btn">티어전환</span></td></tr>
      <tr><td>다라상사</td><td>표준</td><td class="r">980</td><td class="r">22%</td><td>02:00 완료</td><td><span class="wf-btn">스냅샷</span></td></tr>
      <tr><td>마바건설(주)</td><td>표준</td><td class="r">3,210</td><td class="r">91%</td><td><span class="badge b-red">실패</span></td><td><span class="wf-btn dng">잡 재시도</span></td></tr>
    </table>
  </div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>KPI 스트립</td><td>DB 티어 분포·스냅샷·실패 잡 수</td><td>실시간</td></tr>
<tr><td>테넌트 그리드</td><td>사용량·전표량·스냅샷 상태</td><td>정렬·필터</td></tr>
<tr><td>운영 큐</td><td>대기/진행/실패 잡 목록</td><td>재시도</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>쿼터 초과 임박</td><td>사용량 ≥ 90%</td><td><span class="badge b-amber">경고</span></td></tr>
<tr><td>스냅샷 실패</td><td>최근 백업 누락</td><td><span class="badge b-red">차단</span></td></tr>
</table>

<h4 id="bf-03"><span class="sid">BF-03</span>기장 설정·전환 워크플로우</h4>
<table class="meta">
<tr><th>용도</th><td>이용회사의 기장모드(일반/간편)·회계기간 전환을 요청→검토→승인→예약적용→잠금해제의 칸반 워크플로우로 처리한다.</td></tr>
<tr><th>권한</th><td>운영조직 관리자(요청) / 플랫폼 관리자(승인)</td></tr>
<tr><th>API</th><td><code>POST /api/ledger/transition</code> · <code>PUT /api/ledger/transition/:id/approve</code></td></tr>
<tr><th>엔티티</th><td><code>LedgerTransition</code> · <code>FiscalPeriod</code> · <code>TransitionLog</code></td></tr>
</table>
<div class="note"><b>주의</b> · 기장모드/회계기간 전환은 전기이월·재무제표 산출 로직에 영향을 주므로 <b>예약적용</b> 시점에 기간 잠금이 동반된다. 적용 후 롤백은 별도 승인 필요.</div>
<div class="wf">
  <div class="wf-cap">BF-03 · 전환 워크플로우 칸반</div>
  <div class="wf-bar"><span>기장 설정·전환</span><span class="sp"></span><button class="wf-btn pri">전환 요청</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:1"><div class="pt">요청</div>다라상사 · 간편→일반</div>
    <div class="wf-panel" style="flex:1"><div class="pt">검토</div>마바건설 · 회계기간 변경</div>
    <div class="wf-panel pnl" style="flex:1"><div class="pt">승인/예약</div>가나무역 · 2026기 적용예약 03-01</div>
    <div class="wf-panel" style="flex:1"><div class="pt">잠금해제</div>—</div>
  </div></div>
  <div class="wf-foot"><span>전환 요청: 기장모드 [일반] · 회계기간 [2026] · 사유 [매출 규모 증가]</span><span class="sp"></span><button class="wf-btn pri">요청 제출</button></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>칸반 보드</td><td>요청/검토/승인·예약/잠금해제 단계</td><td>드래그 진행</td></tr>
<tr><td>전환 요청 폼</td><td>기장모드·회계기간·전환사유</td><td></td></tr>
<tr><td>이력</td><td>append-only 전환 로그</td><td>물리삭제 금지</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>미마감 기간 전환</td><td>직전 기간 미마감</td><td><span class="badge b-amber">경고</span></td></tr>
<tr><td>승인 없는 적용</td><td>승인자 단계 미통과</td><td><span class="badge b-red">차단</span></td></tr>
</table>

<h4 id="bf-04"><span class="sid">BF-04</span>보안 사용자 (사용자·인증수단·SSO·세션·로그인 이력)</h4>
<table class="meta">
<tr><th>용도</th><td>플랫폼 사용자 계정의 상태·MFA/패스키·SSO·세션·위험도를 관리하고, 정책 조건별로 필터링하여 로그인·감사 이벤트를 추적한다.</td></tr>
<tr><th>권한</th><td>보안 관리자</td></tr>
<tr><th>API</th><td><code>GET /api/security/users</code> · <code>PUT /api/security/users/:id</code> · <code>GET /api/security/users/:id/sessions</code> · <code>GET /api/security/users/:id/audit</code></td></tr>
<tr><th>엔티티</th><td><code>User</code>(계정·상태) · <code>MfaEnrollment</code>(OTP/패스키) · <code>SsoBinding</code>(IdP 연결) · <code>UserSession</code>(활성 세션) · <code>AuditEvent</code>(로그인·권한변경 이력)</td></tr>
</table>
<div class="crumb"><b>진입</b><span class="sep">▸</span>운영 콘솔 GNB ▸ 보안 ▸ 사용자<span class="sep">·</span>접근 주체: 보안 관리자<span class="sep">·</span>회사 선택: 좌측 사용자 목록에서 행 선택 → 우측 탭 편집</div>
<div class="tip"><b>설계 의도</b> · 한 사용자가 <b>5개 엔티티</b>(계정·MFA·SSO·세션·감사)에 걸쳐 있으므로, 화면은 <b>상단 전체폭 목록 그리드 + 하단 탭 상세</b>로 구성한다. 위험도(risk score)는 비정상 로그인·IP 이탈·권한 상승 시도를 종합한 지표로 임계 초과 시 Step-up 인증을 강제한다.</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>계정 초대·생성<span class="sc">User.INVITED</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>인증수단 등록<span class="sc">MfaEnrollment</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>SSO 연결<span class="sc">SsoBinding</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>로그인·세션<span class="sc">UserSession</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">5</span>감사·위험도<span class="sc">AuditEvent</span></div>
</div>
<div class="wf">
  <div class="wf-cap">BF-04 · 사용자 목록 + 상세(계정/인증/SSO/세션/이력)</div>
  <div class="wf-bar"><b>보안 ▸ 사용자</b><span class="sp"></span><span class="wf-in">🔍 이메일·이름</span><span class="wf-btn pri">+ 사용자 초대</span></div>
  <div class="wf-tool"><span class="wf-sel">상태=전체</span><span class="wf-sel">MFA=전체</span><span class="wf-sel">SSO=전체</span><span class="wf-in">위험도 ≥ 70</span><span class="wf-btn">필터</span><span class="wf-btn">정책 일괄 적용</span></div>
  <div class="wf-body">
    <table class="wf-grid">
      <tr><th>사용자</th><th>이름/역할</th><th>계정상태</th><th>MFA</th><th>SSO</th><th class="r">위험도</th><th>최근 로그인</th><th></th></tr>
      <tr><td>kim@gana.co.kr</td><td>김회계 / 기장</td><td><span class="badge b-green">활성</span></td><td>OTP</td><td>EY SSO</td><td class="r">12</td><td>06-21 09:12</td><td><span class="wf-btn">편집</span></td></tr>
      <tr><td>lee@dara.co.kr</td><td>이세무 / 검토</td><td><span class="badge b-amber">잠금예정</span></td><td><span class="badge b-red">미등록</span></td><td>—</td><td class="r">81</td><td>06-19 22:40</td><td><span class="wf-btn dng">잠금</span></td></tr>
      <tr><td>park@maba.co.kr</td><td>박파트너 / 승인</td><td><span class="badge b-green">활성</span></td><td>패스키</td><td>EY SSO</td><td class="r">34</td><td>06-21 08:05</td><td><span class="wf-btn">편집</span></td></tr>
    </table>
    <div class="wf-tab"><span class="on">기본·계정(User)</span><span>인증수단(MFA·패스키)</span><span>SSO(SsoBinding)</span><span>세션(UserSession)</span><span>로그인 이력(AuditEvent)</span></div>
    <div class="wf-split">
      <div class="wf-panel"><div class="pt">계정·상태 · 선택: lee@dara.co.kr</div>
        <div class="wf-row"><label>이메일 <span class="req">*</span></label><span class="wf-in wide">lee@dara.co.kr</span></div>
        <div class="wf-row"><label>이름 <span class="req">*</span></label><span class="wf-in">이세무</span></div>
        <div class="wf-row"><label>계정상태</label><span class="wf-sel">잠금예정</span> <span class="badge b-gray">활성/잠금예정/잠금/비활성</span></div>
        <div class="wf-row"><label>위험도</label><span class="wf-in">81</span> <span class="badge b-red">임계 초과 → Step-up 강제</span></div>
        <div class="wf-row"><label>마지막 비밀번호 변경</label><span class="wf-in">2025-09-01 (293일 경과)</span></div>
      </div>
      <div class="wf-panel pnl"><div class="pt">인증·세션 요약 (탭 전환 시 상세)</div>
        <div class="wf-row"><label>MFA</label><span class="badge b-red">미등록</span> <span class="wf-btn">등록 요청 발송</span></div>
        <div class="wf-row"><label>패스키</label><span class="wf-in">—</span></div>
        <div class="wf-row"><label>SSO 연결</label><span class="wf-in">미연결 (로컬 로그인)</span></div>
        <div class="wf-row"><label>활성 세션</label><span class="wf-in">2건</span> <span class="wf-btn dng">전체 강제 종료</span></div>
        <div class="wf-row"><label>최근 감사</label><span class="wf-in">실패 로그인 5회 / 신규 IP</span></div>
      </div>
    </div>
    <div class="note" style="margin-top:6px">계정은 물리 삭제하지 않고 <b>비활성(논리)</b> 처리 · 모든 인증·세션·권한 변경은 <code>AuditEvent</code> append-only 기록.</div>
  </div>
  <div class="wf-foot"><span class="badge b-amber">MFA 미등록 ∧ 정책 필수</span><span class="badge b-red">위험도≥80 Step-up</span><span class="badge b-gray">세션=강제종료 가능</span></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>엔티티 · 비고</th></tr>
<tr><td>필터 바</td><td>상태·MFA·SSO·위험도 조합 + 정책 일괄 적용</td><td><code>User</code></td></tr>
<tr><td>사용자 그리드</td><td>계정상태/MFA/SSO/위험도/최근 로그인</td><td><code>User</code> 목록</td></tr>
<tr><td>기본·계정 탭</td><td>이메일·이름·상태·위험도·비밀번호 경과</td><td><code>User</code></td></tr>
<tr><td>인증수단 탭</td><td>OTP/패스키 등록·해제·재발급</td><td><code>MfaEnrollment</code></td></tr>
<tr><td>SSO 탭</td><td>IdP 연결(EY SSO)·해제·강제 SSO</td><td><code>SsoBinding</code></td></tr>
<tr><td>세션 탭</td><td>활성 세션·디바이스·IP·강제 종료</td><td><code>UserSession</code></td></tr>
<tr><td>로그인 이력 탭</td><td>로그인 성공/실패·권한변경 이력</td><td><code>AuditEvent</code> append-only</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>MFA 미등록</td><td>정책상 MFA 필수 사용자</td><td><span class="badge b-amber">경고</span></td></tr>
<tr><td>위험도 임계 초과</td><td>위험도 ≥ 80 → 저장 시 Step-up 미완료</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>계정 물리 삭제 시도</td><td>삭제 대신 비활성만 허용</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>비밀번호 만료 경과</td><td>정책 만료일(BF-05) 초과</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="bf-05"><span class="sid">BF-05</span>인증 정책 편집</h4>
<table class="meta">
<tr><th>용도</th><td>정책 범위별로 MFA 강제·패스키·비밀번호 길이·만료·세션 시간·IP 제한을 설정한다.</td></tr>
<tr><th>권한</th><td>보안 관리자</td></tr>
<tr><th>API</th><td><code>GET/PUT /api/security/auth-policy</code></td></tr>
<tr><th>엔티티</th><td><code>AuthPolicy</code> · <code>PolicyScope</code></td></tr>
</table>
<div class="note"><b>주의</b> · IP 제한과 BF-01 운영조직 IP 허용목록은 AND 결합된다. 정책 변경은 즉시 전 세션에 적용되며, 진행 중 세션은 다음 검증 시점에 재평가된다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>운영 콘솔 GNB ▸ 보안 ▸ 인증 정책<span class="sep">·</span>접근 주체: 보안 관리자<span class="sep">·</span>회사 선택: 좌측 정책 범위 트리에서 범위 선택</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>정책 범위 선택<span class="sc">전체/조직/역할</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>인증·세션 규칙 설정<span class="sc">AuthPolicy</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>저장·즉시 적용<span class="sc">PUT</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>세션 재평가<span class="sc">BF-04 세션</span></div>
</div>
<div class="wf">
  <div class="wf-cap">BF-05 · 인증 정책 편집 (범위 + 규칙)</div>
  <div class="wf-bar"><b>보안 ▸ 인증 정책</b><span class="sp"></span><span class="badge b-purple">적용 범위: 전체</span><button class="wf-btn pri">정책 저장</button></div>
  <div class="wf-body">
    <div class="wf-split">
      <div class="wf-panel" style="flex:0 0 30%"><div class="pt">정책 범위 (우선순위)</div>
        <div class="wf-row"><span class="badge b-blue">1</span> 역할: 파트너</div>
        <div class="wf-row"><span class="badge b-blue">2</span> 운영조직: 법인기장 1팀</div>
        <div class="wf-row"><span class="badge b-gray">3</span> 전체(기본) <span class="badge b-green">선택</span></div>
        <div class="note" style="margin-top:6px">좁은 범위 우선 적용(역할 &gt; 조직 &gt; 전체).</div>
      </div>
      <div class="wf-panel pnl" style="flex:1"><div class="pt">규칙 · 전체(기본)</div>
        <div class="wf-split">
          <div class="wf-panel" style="margin:0"><div class="pt">인증 · 비밀번호</div>
            <div class="wf-row"><label>MFA 강제</label><span class="wf-sel">예(전 사용자)</span></div>
            <div class="wf-row"><label>패스키 허용</label><span class="wf-sel">예(OTP 대체)</span></div>
            <div class="wf-row"><label>비밀번호 최소 길이</label><span class="wf-in">12자</span></div>
            <div class="wf-row"><label>비밀번호 만료</label><span class="wf-in">90일</span></div>
            <div class="wf-row"><label>재사용 금지</label><span class="wf-in">최근 5개</span></div>
          </div>
          <div class="wf-panel" style="margin:0"><div class="pt">세션 · IP</div>
            <div class="wf-row"><label>세션 시간</label><span class="wf-in">8시간</span></div>
            <div class="wf-row"><label>유휴 만료</label><span class="wf-in">30분</span></div>
            <div class="wf-row"><label>IP 제한</label><span class="wf-sel">허용목록 외 차단</span></div>
            <div class="wf-row"><label>신규 IP</label><span class="wf-sel">Step-up 요구</span></div>
            <div class="wf-row"><label>동시 세션</label><span class="wf-in">최대 3</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="wf-foot"><span class="badge b-blue">BF-01 IP 허용목록과 AND 결합</span><span class="badge b-gray">저장 즉시 전 세션 재평가</span></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>엔티티 · 비고</th></tr>
<tr><td>정책 범위 트리</td><td>전체/운영조직/역할 단위, 좁은 범위 우선</td><td><code>PolicyScope</code></td></tr>
<tr><td>인증·비밀번호 패널</td><td>MFA·패스키·길이·만료·재사용</td><td><code>AuthPolicy</code></td></tr>
<tr><td>세션·IP 패널</td><td>세션 시간·유휴·IP 제한·동시 세션</td><td><code>AuthPolicy</code></td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>비밀번호 길이 미달</td><td>최소 8자 미만 설정</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>MFA 강제 해제</td><td>강제 정책 해제 시</td><td><span class="badge b-amber">경고</span></td></tr>
<tr><td>세션 시간 과대</td><td>세션 시간 &gt; 24시간</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="bf-06"><span class="sid">BF-06</span>접근 세션 감사</h4>
<table class="meta">
<tr><th>용도</th><td>대행·긴급 접근 세션을 감사한다. 세션ID·접근자·이용회사·접근모드·동의자·사유·녹화·만료를 추적한다.</td></tr>
<tr><th>권한</th><td>보안 관리자 / 감사인(조회)</td></tr>
<tr><th>API</th><td><code>GET /api/audit/sessions</code> · <code>POST /api/audit/emergency-access</code></td></tr>
<tr><th>엔티티</th><td><code>AccessSession</code> · <code>EmergencyGrant</code> · <code>SessionRecording</code></td></tr>
</table>
<div class="tip"><b>설계 의도</b> · 긴급 대행 접근은 고객(동의자) 사전 동의·사유 기록·세션 녹화를 전제로 한 시간제한 부여이며, 만료 시 자동 회수된다. 전 이력 append-only.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>운영 콘솔 GNB ▸ 보안 ▸ 접근 감사<span class="sep">·</span>접근 주체: 보안 관리자 / 감사인(조회)<span class="sep">·</span>회사 선택: 세션 행 선택 → 우측 상세·녹화</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>대행 요청<span class="sc">EmergencyGrant</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>고객 동의<span class="sc">동의자 서명</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>세션 시작·녹화<span class="sc">AccessSession</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>만료 자동 회수<span class="sc">expire</span></div>
</div>
<div class="wf">
  <div class="wf-cap">BF-06 · 접근 세션 목록 + 상세(녹화/동의)</div>
  <div class="wf-bar"><b>보안 ▸ 접근 감사</b><span class="sp"></span><span class="wf-sel">기간=오늘</span><span class="wf-sel">모드=전체</span><button class="wf-btn dng">긴급 대행 부여</button></div>
  <div class="wf-body">
    <div class="wf-split">
      <div class="wf-panel" style="flex:1"><div class="pt">접근 세션 (AccessSession)</div>
        <table class="wf-grid">
          <tr><th>세션ID</th><th>접근자</th><th>회사</th><th>모드</th><th>만료</th></tr>
          <tr><td>S-20260621-01</td><td>김회계</td><td>가나무역</td><td>대행</td><td>18:00</td></tr>
          <tr><td>S-20260621-07</td><td>이세무</td><td>마바건설</td><td><span class="badge b-purple">긴급</span></td><td>14:30</td></tr>
        </table>
      </div>
      <div class="wf-panel pnl" style="flex:0 0 40%"><div class="pt">상세 · 선택: S-20260621-07</div>
        <div class="wf-row"><label>접근자 / 모드</label><span class="wf-in">이세무 / <span class="badge b-purple">긴급</span></span></div>
        <div class="wf-row"><label>동의자 <span class="req">*</span></label><span class="wf-in">실무 최OO (서명 06-21 14:01)</span></div>
        <div class="wf-row"><label>사유 <span class="req">*</span></label><span class="wf-in wide">마감 오류 긴급 정정</span></div>
        <div class="wf-row"><label>녹화</label><span class="badge b-green">화면+키입력 ON</span></div>
        <div class="wf-row"><label>만료·회수</label><span class="wf-in">14:30 자동 회수</span> <span class="wf-btn dng">즉시 회수</span></div>
      </div>
    </div>
    <div class="note" style="margin-top:6px">전 세션·부여·회수 이력은 <code>AuditEvent</code> append-only · 만료 시 권한 자동 회수 후 녹화 보관.</div>
  </div>
  <div class="wf-foot"><span class="badge b-red">사유·동의자 필수</span><span class="badge b-green">녹화 강제</span><span class="badge b-gray">만료 자동회수</span></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>엔티티 · 비고</th></tr>
<tr><td>세션 그리드</td><td>접근자·회사·모드·만료</td><td><code>AccessSession</code></td></tr>
<tr><td>상세 패널</td><td>동의자·사유·녹화·회수</td><td><code>EmergencyGrant</code>·<code>SessionRecording</code></td></tr>
<tr><td>긴급 대행 부여</td><td>사유·동의자·기간 입력</td><td>녹화 강제</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>사유 미입력</td><td>긴급 대행 사유 필수</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>동의자 미지정</td><td>대행 모드 동의자 필수</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>녹화 비활성 부여</td><td>긴급 모드 녹화 OFF</td><td><span class="badge b-red">차단</span></td></tr>
</table>

<h4 id="bf-07"><span class="sid">BF-07</span>권한 매트릭스</h4>
<table class="meta">
<tr><th>용도</th><td>역할·사용자별 기능 권한(조회/입력/승인/마감)을 매트릭스로 정의하고 가드레일·예외를 관리한다.</td></tr>
<tr><th>권한</th><td>보안 관리자 / 운영조직 관리자</td></tr>
<tr><th>API</th><td><code>GET/PUT /api/security/permissions</code></td></tr>
<tr><th>엔티티</th><td><code>Role</code> · <code>Permission</code> · <code>PermissionMatrix</code> · <code>Guardrail</code></td></tr>
</table>
<div class="note"><b>주의</b> · 마감(CLOSE) 권한은 가드레일에 의해 입력 권한과 분리 운영을 권고한다(직무분리). SA-BAS-02 회사 권한 스코프와 결합하여 RLS 범위가 결정된다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>운영 콘솔 GNB ▸ 보안 ▸ 권한<span class="sep">·</span>접근 주체: 보안 관리자 / 운영조직 관리자<span class="sep">·</span>회사 선택: 역할 선택 → 매트릭스 편집</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>역할 정의<span class="sc">Role</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>권한 매트릭스<span class="sc">PermissionMatrix</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>가드레일 검사<span class="sc">Guardrail</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>결재선·기장 배정<span class="sc">ApprovalLine</span></div>
</div>
<div class="wf">
  <div class="wf-cap">BF-07 · 권한 매트릭스 + 가드레일/결재선</div>
  <div class="wf-bar"><b>보안 ▸ 권한</b><span class="sp"></span><span class="wf-sel">대상=역할</span><button class="wf-btn pri">저장</button></div>
  <div class="wf-body">
    <div class="wf-split">
      <div class="wf-panel" style="flex:1"><div class="pt">역할 × 기능 매트릭스 (PermissionMatrix)</div>
        <table class="wf-grid">
          <tr><th>역할/사용자</th><th>조회</th><th>입력</th><th>승인</th><th>마감</th></tr>
          <tr><td>기장 담당</td><td>✔</td><td>✔</td><td>—</td><td>—</td></tr>
          <tr><td>검토 선임</td><td>✔</td><td>✔</td><td>✔</td><td>—</td></tr>
          <tr><td>파트너</td><td>✔</td><td>—</td><td>✔</td><td>✔</td></tr>
        </table>
      </div>
      <div class="wf-panel pnl" style="flex:0 0 36%"><div class="pt">가드레일 · 예외 · 결재선</div>
        <div class="wf-row"><label>가드레일</label><span class="badge b-amber">입력∧마감 동시 경고</span></div>
        <div class="wf-row"><label>예외 등록</label><span class="wf-in">박파트너(사유·승인)</span></div>
        <div class="wf-row"><label>결재선</label><span class="wf-in wide">기장→검토선임→파트너</span></div>
        <div class="wf-row"><label>기장 배정</label><span class="wf-in">김회계 → 가나무역 외 12사</span></div>
      </div>
    </div>
    <div class="note" style="margin-top:6px">매트릭스 저장 시 가드레일 자동 검사 · 위반은 예외 승인(사유·승인자) 없이는 <b>경고</b> 잔류.</div>
  </div>
  <div class="wf-foot"><span class="badge b-amber">직무분리 위반 경고</span><span class="badge b-blue">SA-BAS-02 RLS 스코프 결합</span></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>엔티티 · 비고</th></tr>
<tr><td>권한 매트릭스</td><td>역할×기능(조회/입력/승인/마감)</td><td><code>PermissionMatrix</code></td></tr>
<tr><td>가드레일</td><td>직무분리 위반 경고 규칙</td><td><code>Guardrail</code></td></tr>
<tr><td>예외</td><td>가드레일 예외 승인 등록</td><td>사유·승인자</td></tr>
<tr><td>결재선·기장 배정</td><td>전표 결재 라인·기장 담당 배정</td><td><code>ApprovalLine</code></td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>직무분리 위반</td><td>입력∧마감 동시 부여(예외 미승인)</td><td><span class="badge b-amber">경고</span></td></tr>
<tr><td>조회 없는 입력</td><td>입력 권한 ⊃ 조회 위반</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>결재선 순환</td><td>결재 라인 순환 참조</td><td><span class="badge b-red">차단</span></td></tr>
</table>

<h4 id="bf-08"><span class="sid">BF-08</span>표준 카탈로그</h4>
<table class="meta">
<tr><th>용도</th><td>표준 계정과목(COA)·적요·코드 카탈로그의 버전을 관리하고 테넌트 적용 시 차이 비교·배포·롤백한다.</td></tr>
<tr><th>권한</th><td>표준 관리자</td></tr>
<tr><th>API</th><td><code>GET /api/catalog/versions</code> · <code>POST /api/catalog/deploy</code> · <code>POST /api/catalog/rollback</code></td></tr>
<tr><th>엔티티</th><td><code>Catalog</code> · <code>CatalogVersion</code> · <code>CatalogItem</code> · <code>DeployLog</code></td></tr>
</table>
<div class="tip"><b>설계 의도</b> · 표준 COA는 버전(예: COA v2026.1)으로 관리되며 테넌트별 커스터마이즈와 diff 비교 후 선택 배포한다. 롤백은 직전 버전 스냅샷 복원.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>운영 콘솔 GNB ▸ 표준 ▸ 카탈로그<span class="sep">·</span>접근 주체: 표준 관리자<span class="sep">·</span>회사 선택: 배포 시 대상 테넌트 다중 선택</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>버전 작성<span class="sc">CatalogVersion</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>diff 비교<span class="sc">신설/변경/폐지</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>대상 선택·배포<span class="sc">deploy</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>채택·롤백<span class="sc">rollback</span></div>
</div>
<div class="wf">
  <div class="wf-cap">BF-08 · 표준 카탈로그 (버전 diff + 배포)</div>
  <div class="wf-bar"><b>표준 ▸ 카탈로그</b><span class="sp"></span><span class="wf-sel">버전: COA v2026.1</span><span class="wf-sel">기준: v2026.0</span></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:1">
      <div class="pt">항목 diff (v2026.0 → v2026.1)</div>
      <table class="wf-grid">
        <tr><th>구분</th><th>코드</th><th>항목</th><th>내용</th></tr>
        <tr><td><span class="badge b-green">신설</span></td><td>824</td><td>잡급</td><td>신규 비용계정</td></tr>
        <tr><td><span class="badge b-amber">변경</span></td><td>811</td><td>복리후생비</td><td>적요 3건 추가</td></tr>
        <tr><td><span class="badge b-red">폐지</span></td><td>998</td><td>가지급금</td><td>통합(→134)</td></tr>
      </table>
    </div>
    <div class="wf-panel pnl" style="flex:0 0 36%">
      <div class="pt">배포 (DeployLog)</div>
      <div class="wf-row"><label>대상 테넌트</label><span class="wf-in wide">선택 12사</span></div>
      <div class="wf-row"><label>충돌 처리</label><span class="wf-sel">커스텀 보존</span></div>
      <div class="wf-row" style="gap:6px"><button class="wf-btn">차이 비교</button><button class="wf-btn pri">배포</button><button class="wf-btn dng">롤백</button></div>
      <div class="note" style="margin-top:6px">롤백=직전 버전 스냅샷 복원.</div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>비고</th></tr>
<tr><td>카탈로그 버전</td><td>버전 목록·발행일</td><td></td></tr>
<tr><td>항목 diff</td><td>신설/변경/폐지 비교</td><td>배지 구분</td></tr>
<tr><td>배포 패널</td><td>대상 선택·배포·롤백</td><td>이력 기록</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>사용 중 계정 폐지</td><td>전표 참조 계정 폐지 시도</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>미검토 배포</td><td>diff 미확인 배포</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="bf-09"><span class="sid">BF-09</span>차원·조직관리</h4>
<table class="meta">
<tr><th>용도</th><td>6 관리차원(사업장·코스트센터·부서·프로젝트·현장·사원)의 사용/필수/기본값을 <code>DimensionConfig</code>로 정의한다.</td></tr>
<tr><th>권한</th><td>표준 관리자 / 운영조직 관리자</td></tr>
<tr><th>API</th><td><code>GET/PUT /api/dimension/config</code></td></tr>
<tr><th>엔티티</th><td><code>DimensionConfig</code> · <code>OrgUnit</code></td></tr>
</table>
<div class="note"><b>주의</b> · 여기서 <code>required=true</code> 로 설정한 차원은 전표 입력 라인의 필수 입력 차원이 된다. SA-BAS-03 관리코드 사용여부와 SA-BAS-07 계정과목별 관리항목이 함께 작용하여 <b>전표 우측 패널 노출/필수</b>가 최종 결정된다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>운영 콘솔 GNB ▸ 표준 ▸ 차원·조직<span class="sep">·</span>접근 주체: 표준 관리자 / 운영조직 관리자<span class="sep">·</span>회사 선택: 상단 테넌트 선택</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>차원 사용 설정<span class="sc">DimensionConfig</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>필수·기본값<span class="sc">required</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>조직 계층 구성<span class="sc">OrgUnit</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>전표 패널 반영<span class="sc">→ SA-BAS-03·07</span></div>
</div>
<div class="wf">
  <div class="wf-cap">BF-09 · 차원 설정 + 조직 트리</div>
  <div class="wf-bar"><b>표준 ▸ 차원·조직</b><span class="sp"></span><span class="wf-sel">테넌트: 마바건설(주)</span><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel pnl" style="flex:1"><div class="pt">6 관리차원 (DimensionConfig)</div>
      <table class="wf-grid">
        <tr><th>차원</th><th>사용</th><th>필수</th><th>기본값</th></tr>
        <tr><td>사업장</td><td>✔</td><td>✔</td><td>본점</td></tr>
        <tr><td>코스트센터</td><td>✔</td><td>—</td><td>—</td></tr>
        <tr><td>부서</td><td>✔</td><td>—</td><td>관리부</td></tr>
        <tr><td>프로젝트</td><td>✔</td><td>—</td><td>—</td></tr>
        <tr><td>현장</td><td>✔</td><td>✔(건설)</td><td>—</td></tr>
        <tr><td>사원</td><td>✔</td><td>—</td><td>—</td></tr>
      </table>
    </div>
    <div class="wf-panel" style="flex:0 0 36%"><div class="pt">조직 트리 (OrgUnit · BF-01 연계)</div>
      ├ 본점(사업장)<br>&nbsp;&nbsp;├ 경영지원본부<br>&nbsp;&nbsp;│&nbsp;&nbsp;└ 관리부(CC-100)<br>&nbsp;&nbsp;└ 건설본부<br>&nbsp;&nbsp;&nbsp;&nbsp;└ 강남현장(CC-210)
      <div class="note" style="margin-top:6px">코스트센터·부서 계층은 조직 트리와 동기화.</div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>엔티티 · 비고</th></tr>
<tr><td>차원 그리드</td><td>6 차원 사용/필수/기본값</td><td><code>DimensionConfig</code></td></tr>
<tr><td>조직 트리</td><td>코스트센터·부서 계층</td><td><code>OrgUnit</code> · BF-01 연계</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>필수∧미사용 모순</td><td>required=true ∧ enabled=false</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>전표 참조 차원 비활성</td><td>사용 중 차원 미사용 전환</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="bf-10"><span class="sid">BF-10</span>구독·청구</h4>
<table class="meta">
<tr><th>용도</th><td>테넌트의 플랜·사용자수·저장소·전표건수·API 호출량을 기준으로 청구 주기·결제수단·미납을 관리한다.</td></tr>
<tr><th>권한</th><td>플랫폼 관리자 / 청구 담당</td></tr>
<tr><th>API</th><td><code>GET /api/billing/subscriptions</code> · <code>POST /api/billing/invoice</code></td></tr>
<tr><th>엔티티</th><td><code>Subscription</code> · <code>Plan</code> · <code>UsageMeter</code> · <code>Invoice</code></td></tr>
</table>
<div class="tip"><b>설계 의도</b> · 사용량 미터(전표건수·API 호출·저장소)는 BF-02 운영 콘솔과 동일 소스를 사용해 청구 일관성을 보장한다.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>운영 콘솔 GNB ▸ 구독·청구<span class="sep">·</span>접근 주체: 플랫폼 관리자 / 청구 담당<span class="sep">·</span>회사 선택: 구독 행 선택 → 우측 청구 상세</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>플랜 구독<span class="sc">Subscription</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>사용량 측정<span class="sc">UsageMeter</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>청구서 발행<span class="sc">Invoice</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>결제·미납 관리<span class="sc">payment</span></div>
</div>
<div class="wf">
  <div class="wf-cap">BF-10 · 구독 목록 + 청구 상세</div>
  <div class="wf-bar"><b>구독·청구</b><span class="sp"></span><span class="wf-sel">청구주기: 월</span><span class="wf-sel">상태=전체</span></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:1"><div class="pt">구독 (Subscription · UsageMeter)</div>
      <table class="wf-grid">
        <tr><th>테넌트</th><th>플랜</th><th class="r">사용자</th><th class="r">저장소</th><th class="r">전표건수</th><th>상태</th></tr>
        <tr><td>가나무역</td><td>프리미엄</td><td class="r">24</td><td class="r">42GB</td><td class="r">12,400</td><td><span class="badge b-green">정상</span></td></tr>
        <tr><td>다라상사</td><td>표준</td><td class="r">3</td><td class="r">2GB</td><td class="r">980</td><td><span class="badge b-red">미납</span></td></tr>
      </table>
    </div>
    <div class="wf-panel pnl" style="flex:0 0 36%"><div class="pt">청구 상세 · 선택: 다라상사</div>
      <div class="wf-row"><label>플랜 / 청구액</label><span class="wf-in">표준 / 88,000원</span></div>
      <div class="wf-row"><label>결제수단</label><span class="wf-in">카드 ****-1234 <span class="badge b-purple">마스킹</span></span></div>
      <div class="wf-row"><label>미납</label><span class="badge b-red">2회 연체</span></div>
      <div class="wf-row"><label>조치</label><span class="wf-btn">청구서 재발행</span> <span class="wf-btn dng">서비스 정지</span></div>
      <div class="note" style="margin-top:6px">결제 처리는 외부 PG 위임 · 본 화면은 상태 조회·독촉만.</div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>엔티티 · 비고</th></tr>
<tr><td>구독 그리드</td><td>플랜·사용량 미터</td><td><code>Subscription</code>·<code>UsageMeter</code></td></tr>
<tr><td>결제수단</td><td>카드/계좌이체</td><td>마스킹 표시</td></tr>
<tr><td>미납 관리</td><td>연체·정지 처리</td><td><code>Invoice</code></td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>미납 누적</td><td>2회 이상 미납</td><td><span class="badge b-amber">경고</span></td></tr>
<tr><td>결제수단 만료</td><td>카드 유효기간 경과</td><td><span class="badge b-red">차단</span></td></tr>
</table>

<h4 id="bf-11"><span class="sid">BF-11</span>알림 매트릭스</h4>
<table class="meta">
<tr><th>용도</th><td>이벤트별 수신 역할·채널·템플릿·예약일·웹훅 URL·재시도 정책을 매트릭스로 정의한다.</td></tr>
<tr><th>권한</th><td>플랫폼 관리자</td></tr>
<tr><th>API</th><td><code>GET/PUT /api/notify/matrix</code> · <code>POST /api/notify/webhook/test</code></td></tr>
<tr><th>엔티티</th><td><code>NotifyRule</code> · <code>NotifyTemplate</code> · <code>Webhook</code></td></tr>
</table>
<div class="note"><b>주의</b> · 웹훅 URL 등록·수정은 외부 연동 변경에 해당하므로 등록 시 서명 검증·테스트 발송을 거친다. 재시도는 지수 백오프.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>운영 콘솔 GNB ▸ 알림<span class="sep">·</span>접근 주체: 플랫폼 관리자<span class="sep">·</span>회사 선택: 이벤트 행 선택 → 우측 채널·웹훅 설정</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>이벤트 정의<span class="sc">NotifyRule</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>수신 역할·채널<span class="sc">앱/메일/SMS/웹훅</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>템플릿·D-N 스케줄<span class="sc">NotifyTemplate</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>발송·재시도<span class="sc">Webhook</span></div>
</div>
<div class="wf">
  <div class="wf-cap">BF-11 · 알림 매트릭스 + 웹훅 설정</div>
  <div class="wf-bar"><b>알림</b><span class="sp"></span><button class="wf-btn pri">저장</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:1"><div class="pt">이벤트 × 채널 (NotifyRule)</div>
      <table class="wf-grid">
        <tr><th>이벤트</th><th>수신 역할</th><th>채널</th><th>템플릿</th><th>재시도</th></tr>
        <tr><td>마감 완료</td><td>파트너</td><td>이메일·푸시</td><td>TPL-CLOSE</td><td>3회</td></tr>
        <tr><td>전표 반려</td><td>기장 담당</td><td>인앱</td><td>TPL-REJ</td><td>—</td></tr>
        <tr><td>부가세 신고기한</td><td>전 담당</td><td>이메일·웹훅</td><td>TPL-VAT</td><td>5회</td></tr>
      </table>
    </div>
    <div class="wf-panel pnl" style="flex:0 0 36%"><div class="pt">웹훅 · 선택: 부가세 신고기한</div>
      <div class="wf-row"><label>URL <span class="req">*</span></label><span class="wf-in wide">https://hook.ey.com/vat</span></div>
      <div class="wf-row"><label>서명키</label><span class="wf-in">whsec_*** <span class="badge b-purple">마스킹</span></span></div>
      <div class="wf-row"><label>D-N 스케줄</label><span class="wf-in">D-7 · D-1 · 당일</span></div>
      <div class="wf-row"><label>재시도</label><span class="wf-in">지수 백오프 5회</span></div>
      <div class="wf-row"><span class="wf-btn">테스트 발송</span></div>
    </div>
  </div></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>엔티티 · 비고</th></tr>
<tr><td>이벤트 매트릭스</td><td>이벤트×역할×채널</td><td><code>NotifyRule</code></td></tr>
<tr><td>템플릿</td><td>메시지 템플릿·변수 치환·D-N</td><td><code>NotifyTemplate</code></td></tr>
<tr><td>웹훅</td><td>URL·서명·재시도</td><td><code>Webhook</code> · 테스트 발송</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>웹훅 URL 형식</td><td>https 필수·서명키</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>수신자 없음</td><td>이벤트 수신 역할 미지정</td><td><span class="badge b-amber">경고</span></td></tr>
</table>

<h4 id="bf-12"><span class="sid">BF-12</span>메뉴 발행</h4>
<table class="meta">
<tr><th>용도</th><td>메뉴 트리(메뉴ID·상위메뉴·화면ID·권한·노출조건)를 버전 관리하고 발행·롤백한다.</td></tr>
<tr><th>권한</th><td>플랫폼 관리자</td></tr>
<tr><th>API</th><td><code>GET /api/menu/versions</code> · <code>POST /api/menu/publish</code> · <code>POST /api/menu/rollback</code></td></tr>
<tr><th>엔티티</th><td><code>Menu</code> · <code>MenuVersion</code> · <code>MenuItem</code></td></tr>
</table>
<div class="tip"><b>설계 의도</b> · 메뉴 발행 버전과 BF-07 권한·SA-BAS-02 메뉴사용(비트맵)이 결합되어 사용자별 최종 노출 메뉴가 결정된다. 발행 단위 롤백 지원.</div>
<div class="crumb"><b>진입</b><span class="sep">▸</span>운영 콘솔 GNB ▸ 메뉴<span class="sep">·</span>접근 주체: 플랫폼 관리자<span class="sep">·</span>회사 선택: 메뉴 항목 선택 → 우측 권한·노출 편집</div>
<div class="flow mini">
  <div class="step"><span class="n">1</span>메뉴 트리 편집<span class="sc">MenuItem</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">2</span>권한·노출조건<span class="sc">BF-07 결합</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">3</span>버전 발행<span class="sc">MenuVersion</span></div>
  <div class="arr">→</div>
  <div class="step"><span class="n">4</span>롤백<span class="sc">rollback</span></div>
</div>
<div class="wf">
  <div class="wf-cap">BF-12 · 메뉴 발행 (트리 + 권한·노출)</div>
  <div class="wf-bar"><b>메뉴</b><span class="sp"></span><span class="wf-sel">버전: MENU v3.2</span><button class="wf-btn pri">발행</button></div>
  <div class="wf-body"><div class="wf-split">
    <div class="wf-panel" style="flex:1"><div class="pt">메뉴 항목 (MenuItem)</div>
      <table class="wf-grid">
        <tr><th>메뉴ID</th><th>상위메뉴</th><th>화면ID</th><th>권한</th><th>노출조건</th></tr>
        <tr><td>M-2510</td><td>기초정보</td><td>SA-BAS-07</td><td>입력</td><td>일반기장</td></tr>
        <tr><td>M-3010</td><td>전표</td><td>JV-01</td><td>입력</td><td>—</td></tr>
        <tr><td>M-9010</td><td>관리</td><td>BF-02</td><td>운영자</td><td>플랫폼</td></tr>
      </table>
    </div>
    <div class="wf-panel pnl" style="flex:0 0 34%"><div class="pt">상세 · 선택: M-2510</div>
      <div class="wf-row"><label>화면ID <span class="req">*</span></label><span class="wf-in">SA-BAS-07</span></div>
      <div class="wf-row"><label>필요 권한</label><span class="wf-sel">입력</span></div>
      <div class="wf-row"><label>노출조건</label><span class="wf-sel">일반기장</span></div>
      <div class="wf-row"><label>미리보기</label><span class="wf-in">파트너=노출 / 기장=노출</span></div>
      <div class="note" style="margin-top:6px">발행자·직전 버전(MENU v3.1) 기록 → 롤백 가능.</div>
    </div>
  </div></div>
  <div class="wf-foot"><span class="badge b-blue">BF-07 권한·SA-BAS-02 비트맵 결합</span><span class="badge b-gray">버전 단위 롤백</span></div>
</div>
<table>
<tr><th>화면 요소</th><th>설명</th><th>엔티티 · 비고</th></tr>
<tr><td>메뉴 트리</td><td>메뉴ID·상위·화면ID·권한·조건</td><td><code>MenuItem</code></td></tr>
<tr><td>권한·노출 패널</td><td>화면ID·필요권한·노출조건·미리보기</td><td>BF-07 결합</td></tr>
<tr><td>발행/롤백</td><td>버전 단위 발행·복원</td><td><code>MenuVersion</code> 발행자 기록</td></tr>
</table>
<table>
<tr><th>검증 항목</th><th>규칙</th><th>수준</th></tr>
<tr><td>존재하지 않는 화면ID</td><td>화면ID 미등록 참조</td><td><span class="badge b-red">차단</span></td></tr>
<tr><td>순환 상위메뉴</td><td>메뉴 트리 순환 참조</td><td><span class="badge b-red">차단</span></td></tr>
</table>
