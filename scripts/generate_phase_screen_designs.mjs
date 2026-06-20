import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const designPath = path.join(root, "설계", "bk_설계서_v2.1.md");
const outDir = path.join(root, "설계", "화면설계");
const generatedAt = "2026-06-20";

const prefixName = {
  "SA-BAS": "기초정보",
  "SA-OPN": "전기이월",
  "SA-JNL": "전표관리",
  "SA-ATX": "자동전표",
  "SA-LDG": "장부/보조부",
  "SA-CLS": "결산/재무제표",
  "SA-VAT": "부가세/신고",
  "SA-FA": "고정자산",
  "SA-FND": "자금/예산",
  "SA-DEP": "예적금/차입금",
  "SA-BIL": "어음/당좌",
  "SA-DAT": "데이터관리",
};

const phases = [
  {
    no: 1,
    title: "기초정보",
    subtitle: "기초정보·조직·표준 설정",
    summary: "회사, 권한, 환경, 조직/부서/사원, 거래처, 계정과목, 현장/프로젝트, 차량, 외주처, 마감 후 이월까지 기준정보를 실제 운영 화면으로 구성한다.",
    ids: [...rangeCore("BF", 0, 12), ...range("SA-BAS", 1, 14)],
    file: "페이즈01_기초정보_상세화면구성_v1.0.html",
  },
  {
    no: 2,
    title: "전기이월",
    subtitle: "전기이월·초기 데이터 이관",
    summary: "전기 재무제표, 월별 손익/원가, 거래처/부서/현장/프로젝트 초기이월을 입력·검증·자동반영하는 화면군이다.",
    ids: range("SA-OPN", 1, 19),
    file: "페이즈02_전기이월_상세화면구성_v1.0.html",
  },
  {
    no: 3,
    title: "전표자동전표",
    subtitle: "전표입력·자동전표 처리",
    summary: "일반전표, 매입/매출전표, 전표 도구, 검색, 일괄 입력과 전자자료 수집·검증·전표전송 파이프라인을 구성한다.",
    ids: [...rangeCore("JV", 1, 8), ...range("SA-JNL", 1, 4), ...range("SA-ATX", 1, 10)],
    file: "페이즈03_전표자동전표_상세화면구성_v1.0.html",
  },
  {
    no: 4,
    title: "장부보조부",
    subtitle: "주요장부·보조장부",
    summary: "총계정원장, 거래처/어음/예금/카드/현금/부가세 보조부와 공사·외주·운행·적요별 장부를 조회·대사·드릴다운한다.",
    ids: [...rangeCore("AUX", 1, 9), ...range("SA-LDG", 1, 29)],
    file: "페이즈04_장부보조부_상세화면구성_v1.0.html",
  },
  {
    no: 5,
    title: "결산재무제표",
    subtitle: "결산·재무제표·결산장부",
    summary: "결산자료, 결산대체, 재무제표, 현금흐름표, 주석/XBRL, 결산장부와 마감 검증을 결산 작업대 형태로 구성한다.",
    ids: range("SA-CLS", 1, 21),
    file: "페이즈05_결산재무제표_상세화면구성_v1.0.html",
  },
  {
    no: 6,
    title: "부가세주요신고",
    subtitle: "부가세 주요신고·기초 신고서류",
    summary: "부가가치세 신고서, MRI 검증, 합계표, 전자신고, 납부/환급 및 주요 신고서류를 세무신고 작업 흐름으로 구성한다.",
    ids: range("SA-VAT", 1, 15),
    file: "페이즈06_부가세주요신고_상세화면구성_v1.0.html",
  },
  {
    no: 7,
    title: "부가세첨부업종",
    subtitle: "부가세 첨부·업종별 신고서류",
    summary: "의제매입, 재활용폐자원, 대손세액, 건물관리, 현금매출 등 업종별 부가세 첨부서류를 실제 신고서 양식 중심으로 구성한다.",
    ids: range("SA-VAT", 16, 35),
    file: "페이즈07_부가세첨부업종_상세화면구성_v1.0.html",
  },
  {
    no: 8,
    title: "영세율고정자산",
    subtitle: "부가세 영세율·기타서류·고정자산",
    summary: "영세율/수출/기타 신고서류와 고정자산 등록, 상각계산, 처분, 월별 상각비 계상을 연결한다.",
    ids: [...range("SA-VAT", 36, 50), ...range("SA-FA", 1, 7)],
    file: "페이즈08_영세율고정자산_상세화면구성_v1.0.html",
  },
  {
    no: 9,
    title: "자금예산어음",
    subtitle: "자금·예산·예적금·어음",
    summary: "자금일보, 자금계획, 예산/실적, 예적금/차입금, 받을/지급어음과 당좌수표 현황을 자금 운영 화면으로 구성한다.",
    ids: [...range("SA-FND", 1, 14), ...range("SA-DEP", 1, 3), ...range("SA-BIL", 1, 4)],
    file: "페이즈09_자금예산어음_상세화면구성_v1.0.html",
  },
  {
    no: 10,
    title: "데이터관리운영",
    subtitle: "데이터관리·운영 전환",
    summary: "삭제전표 복구, 백업/복구, SmartA 내보내기/올리기, 월별·분기별 데이터 이관과 기수변경을 운영 콘솔로 구성한다.",
    ids: range("SA-DAT", 1, 7),
    file: "페이즈10_데이터관리운영_상세화면구성_v1.0.html",
  },
];

const doc = fs.readFileSync(designPath, "utf8");
const section25Start = doc.indexOf("## 25. Smart A 기준 화면 설계");
if (section25Start < 0) throw new Error("25장 Smart A 기준 화면 설계를 찾지 못했습니다.");
const section25 = doc.slice(section25Start);

const saScreens = parseSaScreens(section25);
const coreScreens = buildCoreScreens();
const screenMap = new Map([...coreScreens, ...saScreens].map((screen) => [screen.id, enrichScreen(screen)]));

for (const phase of phases) {
  const screens = phase.ids.map((id) => {
    const screen = screenMap.get(id);
    if (!screen) throw new Error(`${phase.file}: ${id} 화면 정의가 없습니다.`);
    return screen;
  });
  const html = renderPhase(phase, screens);
  fs.writeFileSync(path.join(outDir, phase.file), html, "utf8");
}

const assigned = phases.flatMap((phase) => phase.ids);
const assignedUnique = new Set(assigned);
console.log(`Generated ${phases.length} phase files`);
console.log(`Assigned screens: ${assigned.length}, unique: ${assignedUnique.size}`);
console.log(`SA screens: ${assigned.filter((id) => id.startsWith("SA-")).length}`);
console.log(`Core screens: ${assigned.filter((id) => !id.startsWith("SA-")).length}`);

function parseSaScreens(text) {
  const re = /^####\s+([^`\r\n]+?)\s+`(SA-[A-Z]+-\d{2})`\s*$/gm;
  const matches = [...text.matchAll(re)];
  return matches.map((match, index) => {
    const rawHead = match[1].trim();
    const basis = rawHead.match(/^\d+(?:\.\d+)*/)?.[0] ?? "25";
    const title = rawHead.replace(/^\d+(?:\.\d+)*\s*/, "").trim();
    const body = text.slice(match.index, index + 1 < matches.length ? matches[index + 1].index : text.length);
    const prefix = match[2].replace(/-\d{2}$/, "");
    return {
      id: match[2],
      title,
      group: prefixName[prefix] ?? "Smart A",
      basis,
      purposeText: extractBlock(body, ["구성 목적"]),
      fieldsText: extractBlock(body, ["입력 필드·조회조건", "입력 필드", "입력·조회조건", "조회조건"]),
      functionsText: extractBlock(body, ["기능"]),
      outputsText: extractBlock(body, ["산출물"]),
      linksText: extractBlock(body, ["연계"]),
      conflictText: extractBlock(body, ["충돌 조정"]),
      source: "설계/bk_설계서_v2.1.md",
    };
  });
}

function buildCoreScreens() {
  return [
    core("BF-00", "이용회사 선택(테넌트 스위처)", "플랫폼/기초", "0.2, 2.2", "로그인 사용자가 접근 가능한 이용회사를 검색하고 회계기간·기장모드·권한 컨텍스트를 선택한다.", "회사명, 사업자등록번호, 최근 사용, 담당자, 회계기간, 기장모드, 접근권한, 테넌트 티어", "회사 전환, 세션 컨텍스트 갱신, RLS 스코프 적용, 최근 회사 고정", "선택 테넌트 세션, 기장 컨텍스트, 권한 스냅샷", "2장 멀티테넌시, 5장 접근 거버넌스, 21장 기장 설정"),
    core("BF-01", "관리회사·운영조직·담당 테넌트·IP 허용목록", "플랫폼/기초", "0.2, 5장", "관리회사 내부 조직과 담당 테넌트 배정, 접근 허용 IP와 운영 범위를 관리한다.", "운영조직, 담당자, 담당 테넌트, 접근 모드, IP 대역, 유효기간, 승인자", "담당 배정, IP 정책 저장, 접근 모드 제한, 감사로그 기록", "운영조직 마스터, 담당 배정표, IP 허용목록", "5장 접근통제, 17장 감사로그"),
    core("BF-02", "테넌트 목록·인프라·쿼터·스냅샷·비동기 잡", "플랫폼/기초", "0.2, 2장, 7장", "테넌트별 인프라 티어, 저장소 사용량, 스냅샷, 비동기 작업 상태를 운영한다.", "테넌트, DB 티어, 사용량, 쿼터, 스냅샷 시점, 잡 상태, 장애 등급", "티어 전환 요청, 스냅샷 생성, 잡 재시도, 쿼터 조정", "테넌트 운영 목록, 스냅샷 이력, 비동기 잡 로그", "2장 격리 모델, 7장 구독·데이터 수명주기"),
    core("BF-03", "기장 설정·전환 요청 워크플로우", "플랫폼/기초", "0.2, 21장", "이용회사별 기장모드, 회계기간, 전환 요청과 승인 흐름을 관리한다.", "기장모드, 회계기간, 전환 사유, 요청자, 승인자, 적용일, 잠금 기간", "전환 요청, 승인, 반려, 예약 적용, 전표 입력 잠금", "기장 설정 버전, 전환 이력, 기간 잠금 상태", "21장 기장모드, 12장 전표 불변성"),
    core("BF-04", "사용자·계정상태·인증수단·SSO·세션·로그인 이력", "플랫폼/기초", "0.2, 3장", "사용자 계정, 인증수단, SSO 연결, 세션과 로그인 이력을 관리한다.", "사용자, 계정상태, MFA, 패스키, SSO, 세션 만료, 로그인 IP, 실패 횟수", "사용자 초대, 잠금 해제, MFA 초기화, 세션 만료, SSO 매핑", "사용자 목록, 인증 상태, 로그인 이력", "3장 인증, 17장 감사로그"),
    core("BF-05", "인증 정책 편집", "플랫폼/기초", "0.2, 3.2", "테넌트 또는 관리회사 범위의 인증 강도, 비밀번호, MFA, 세션 정책을 편집한다.", "정책 범위, MFA 강제, 패스키 허용, 비밀번호 길이, 만료일, 세션 시간, IP 제한", "정책 저장, 영향 사용자 계산, 예외 승인, 강제 로그아웃", "인증 정책 버전, 영향도 목록", "3.2 인증 정책"),
    core("BF-06", "접근 세션 로그·긴급대행 동의/요청", "플랫폼/기초", "0.2, 5장", "관리자 접근 세션과 긴급대행 요청, 동의, 녹화/감사 이벤트를 추적한다.", "세션 ID, 접근자, 이용회사, 접근모드, 동의자, 사유, 녹화상태, 만료시각", "긴급대행 요청, 동의, 세션 종료, 녹화 확인, 감사 다운로드", "접근 세션 로그, 긴급대행 승인서, 녹화 참조", "5장 긴급대행, 17장 감사로그"),
    core("BF-07", "역할·역할 부여·가드레일·예외·결재선·기장 배정", "플랫폼/기초", "0.2, 4장", "RBAC 역할, 속성 제약, 예외 권한, 결재선과 기장 담당 배정을 관리한다.", "역할, 권한, 사용자, 테넌트 범위, 사업장 범위, 예외 만료일, 결재선, 담당회사", "역할 생성, 권한 매트릭스 편집, 예외 승인, 결재선 배포, 담당 배정", "역할 정의, 역할 부여, 예외 권한, 결재선", "4장 권한, 5장 접근 거버넌스"),
    core("BF-08", "표준 카탈로그·버전·항목·테넌트 채택/확장", "플랫폼/기초", "0.2, 6장", "계정/세무/신고/업종 규칙 표준 카탈로그의 버전과 테넌트 채택 상태를 관리한다.", "카탈로그, 버전, 항목, 변경유형, 채택 테넌트, 확장 여부, 배포일", "버전 생성, 차이 비교, 테넌트 배포, 롤백, 확장 승인", "표준 카탈로그 버전, 채택 이력, 확장 항목", "6장 표준 카탈로그"),
    core("BF-09", "차원·조직관리·사용정책", "플랫폼/기초", "0.2, 9장", "사업장, 코스트센터, 부서, 프로젝트, 현장, 사원 차원과 조직도를 관리하고 DimensionConfig 사용정책을 설정한다.", "조직도, 부서, 사업장, 코스트센터, 프로젝트, 현장, 사원, 필수여부, 유효일자, 배부율", "조직 동기화, 부서 매핑, 차원 사용 설정, 필수 검증, 배부 규칙 저장", "차원 마스터, 조직 버전, 부서-코스트센터 매핑, DimensionConfig", "9장 관리차원 엔진"),
    core("BF-10", "구독 상세·사용량·청구/결제", "플랫폼/기초", "0.2, 7장", "구독 플랜, 사용량, 과금 기준, 청구서와 결제 상태를 조회·관리한다.", "플랜, 사용자 수, 저장소, 전표 건수, API 호출, 청구주기, 결제수단, 미납상태", "플랜 변경, 사용량 재계산, 청구서 발행, 결제 재시도", "구독 상세, 사용량 집계, 청구서, 결제 이력", "7장 구독·요금"),
    core("BF-11", "알림 수신 매트릭스·템플릿·D-N 스케줄·웹훅", "플랫폼/기초", "0.2, 18장", "업무 이벤트별 수신자, 알림 템플릿, D-N 스케줄과 웹훅 전송 상태를 관리한다.", "이벤트, 수신 역할, 채널, 템플릿, 예약일, 웹훅 URL, 재시도 횟수", "템플릿 편집, 수신 매트릭스 저장, 테스트 발송, 웹훅 재처리", "알림 정책, 템플릿 버전, 발송 로그", "18장 알림"),
    core("BF-12", "메뉴 마스터·권한 메뉴·발행/롤백", "플랫폼/기초", "0.2, 4.3", "메뉴 구조, 권한 노출, 메뉴 버전 발행과 롤백을 관리한다.", "메뉴 ID, 상위 메뉴, 화면 ID, 권한, 노출 조건, 버전, 발행자, 롤백 사유", "메뉴 편집, 권한 매핑, 미리보기, 발행, 롤백", "MenuVersion, 메뉴 권한 매핑, 배포 이력", "4.3 권한 모델"),
    core("JV-01", "일반전표입력(입금/출금 통합, 일자별 마스터-디테일)", "전표", "0.2, 11.1", "전표일자별 당일 전표 목록과 분개 라인을 함께 보며 대체·입금·출금·결차·결대 전표를 입력한다.", "전표일자, 전표번호, 구분, 계정과목, 차변, 대변, 거래처, 사업장, 부서, 프로젝트, 현장, 사원, 적요", "전표 추가, 저장 후 계속 입력, 대차 검증, 현금 간편입력 판별, 역분개 이동", "journal_header, journal_line, 보조부 원천 이벤트", "11.1 전표, 12.2 채번, 12.3 불변성"),
    core("JV-02", "현금 간편입력 — 입금 모드", "전표", "0.2, 11.1", "일반전표입력 안에서 현금 차변을 고정하고 입금 상대계정을 빠르게 입력한다.", "입금일자, 상대계정, 거래처, 금액, 적요, 사업장, 부서, 사원, 현금 계정", "현금 차변 자동 생성, 상대계정 검증, 채권/선수 계정 차단, 일반전표 전환", "현금 입금 전표 라인, 현금출납장", "JV-01, AUX-07"),
    core("JV-03", "현금 간편입력 — 출금 모드", "전표", "0.2, 11.1", "일반전표입력 안에서 현금 대변을 고정하고 출금 상대계정을 빠르게 입력한다.", "출금일자, 상대계정, 거래처, 금액, 적요, 사업장, 부서, 사원, 현금 계정", "현금 대변 자동 생성, 부가세 계정 차단, 카드/예금 거래 전환 안내", "현금 출금 전표 라인, 현금출납장", "JV-01, AUX-07"),
    core("JV-04", "매입전표 입력(세금계산서·부가세)", "전표", "0.2, 11.4", "매입 세금계산서와 비용/자산 계정을 입력하고 부가세대급금 자동라인과 매입원장을 생성한다.", "증빙일자, 공급자, 사업자번호, 세무구분, 공급가액, 세액, 부가세계정, 비용계정, 결제수단, NTS 상태", "세금계산서 검증, 부가세 자동라인 생성, 매입원장 반영, 보조부 갱신", "매입전표, PurchaseLedgerLine, VAT 보조부", "11.4 매입매출/부가세, AUX-06"),
    core("JV-05", "매출전표 입력(세금계산서·부가세)", "전표", "0.2, 11.4", "매출 세금계산서와 수익 계정을 입력하고 부가세예수금 자동라인과 매출처 원장을 생성한다.", "증빙일자, 매출처, 사업자번호, 세무구분, 공급가액, 세액, 부가세계정, 수익계정, 결제수단", "세금계산서 발행 상태 검증, 부가세 자동라인 생성, 매출처원장 반영", "매출전표, SalesLedgerLine, 거래처 보조부", "11.4 매입매출/부가세, AUX-01"),
    core("JV-06", "전표 도구(복사/반복/템플릿/역분개)", "전표", "0.2, 11.1", "기존 전표를 복사·반복·템플릿화하거나 기표 전표를 역분개로 정정한다.", "원전표, 반복주기, 템플릿명, 역분개일자, 정정사유, 적용 라인", "전표 복사, 반복 생성, 템플릿 저장, 역분개 생성, 승인 요청", "복사 전표, 반복 예약, 역분개 전표", "JV-01, 12.3 불변성"),
    core("JV-07", "전표 검색 목록", "전표", "0.2, 11.1", "기간·계정·거래처·금액·상태 조건으로 전표를 검색하고 원전표로 드릴다운한다.", "기간, 전표번호, 구분, 계정과목, 거래처, 금액, 작성자, 기표상태, 승인상태", "검색, 필터 저장, 원전표 열기, 수정 가능 여부 판정, 삭제 요청", "전표 검색 결과, 수정/삭제 감사로그", "JV-01, 12.3 불변성"),
    core("JV-08", "다건/일괄 전표 입력(외부자료 매핑·대량 업로드)", "전표", "0.2, 11.1", "외부 기장자료를 업로드해 컬럼 매핑, 검증, 전체 미리보기 후 일괄 전표로 적재한다.", "업로드 파일, 컬럼 매핑, 전표일자, 계정과목, 거래처, 차변, 대변, 세무구분, 오류행", "파일 분석, 매핑 저장, 일괄 검증, 미리보기, 전표 생성", "일괄 전표 배치, 오류 리포트, 매핑 템플릿", "JV-01, 8.4 ETL"),
    core("AUX-01", "거래처별 보조원장(매출처/매입처)", "보조부", "0.2, 11.11", "거래처별 채권·채무·외화·반제·연체 상태를 원전표와 연결해 조회한다.", "거래처, 계정, 기간, 잔액만, 연체만, 미반제만, 외화, 발생환율, 거래성격", "원장 조회, aging 분석, 반제 추적, 원전표 드릴다운", "거래처 보조원장, 연령분석표", "11.11 보조부"),
    core("AUX-02", "어음 보조원장(받을/지급)·추적 타임라인", "보조부", "0.2, 11.11", "어음번호별 발생, 배서, 할인, 만기, 부도, 결제와 후속 전표를 타임라인으로 추적한다.", "어음번호, 구분, 거래처, 발행일, 만기일, 지급은행, 할인율, 상태, 원전표", "어음 조회, 상태 변경, 할인료 계산, 부도/결제 전표 연결", "어음 보조원장, 추적 타임라인", "AUX-02, SA-BIL"),
    core("AUX-03", "예금 보조원장(계좌별 입출·대사)", "보조부", "0.2, 11.11", "은행 계좌별 입출금, 전표 반영, 미대사 건과 자금일정을 조회한다.", "은행, 계좌, 기간, 입금, 출금, 잔액, 대사상태, 전표번호", "계좌별 조회, 은행거래 대사, 미전표 후보 확인, 자금일정 연결", "예금 보조원장, 대사 결과", "11.11, SA-DEP"),
    core("AUX-04", "카드 보조원장(사용·결제·전표 자동생성 후보)", "보조부", "0.2, 11.4", "법인카드 사용내역을 매입세액 공제 가능성, 전표 후보, 결제 예정과 연결해 관리한다.", "카드, 사용일, 가맹점, 업종, 공급가액, 세액, 공제판정, 사원, 프로젝트, 전표상태", "카드 내역 매칭, 공제/불공제 판정, 전표 후보 생성, 결제 대사", "카드 보조원장, 공제세액 집계", "11.4, AUX-06"),
    core("AUX-05", "가지급금·가수금 보조원장(인정이자 연동)", "보조부", "0.2, 11.5", "직원·임원·거래처별 가지급/가수 잔액과 인정이자 계산 근거를 추적한다.", "대상, 계정, 발생일, 정산예정일, 원금, 이자율, 인정이자, 부서, 사원, 상태", "잔액 조회, 정산 추적, 인정이자 계산, 세무조정 연결", "가지급/가수금 보조원장, 인정이자 계산표", "11.5, 11.11"),
    core("AUX-06", "부가세 보조원장(매입/매출 세액 집계)", "보조부", "0.2, 11.4", "세금계산서와 전표에서 생성된 매입/매출 세액을 신고서 항목으로 집계한다.", "기간, 사업장, 세무구분, 매입/매출, 공급가액, 세액, 전자상태, 프로젝트, 부서", "세액 집계, 신고 항목 매핑, 원전표 드릴다운, 전자신고 검증", "부가세 보조원장, 신고 집계표", "11.4, SA-VAT"),
    core("AUX-07", "현금출납장", "보조부", "0.2, 11.11", "현금 계정의 입출금과 일계 잔액, 시재 점검 결과를 관리한다.", "기간, 사업장, 입금, 출금, 잔액, 전표번호, 적요, 시재확인", "현금 입출 조회, 일계 마감, 시재 차이 확인, 원전표 이동", "현금출납장, 시재 점검표", "JV-02, JV-03"),
    core("AUX-08", "재고 수불부(Phase 2 이관)", "보조부", "0.2, 11.21", "품목·창고·현장별 재고 입출고 수량과 금액을 조회하는 2차 개발 대상 보조부이다.", "품목, 창고, 현장, 입고, 출고, 수량, 단가, 금액, 전표", "수불 조회, 원가 계산, 전표 연결", "재고 수불부, 재고 평가표", "11.21 Phase 2"),
    core("AUX-09", "고정자산대장(기초)", "보조부", "0.2, 11.5", "고정자산의 취득, 부서/현장 배치, 상각 누계와 처분 상태를 조회한다.", "자산코드, 자산명, 취득일, 취득가액, 사용부서, 프로젝트, 현장, 상각누계, 장부가액", "자산 조회, 상각 추적, 전표 연결, 배치 이력 확인", "고정자산대장, 상각명세", "SA-FA, 11.5"),
  ];
}

function core(id, title, group, basis, purposeText, fieldsText, functionsText, outputsText, linksText) {
  return { id, title, group, basis, purposeText, fieldsText, functionsText, outputsText, linksText, conflictText: "", source: "설계/bk_설계서_v2.1.md 0.2" };
}

function enrichScreen(screen) {
  const layout = layoutFor(screen);
  const fields = mergeItems(extractItems(screen.fieldsText, 14), fallbackFields(screen), 14);
  const actions = mergeItems(extractItems(screen.functionsText, 8), fallbackActions(screen, layout), 8);
  const outputs = mergeItems(extractItems(screen.outputsText, 6), fallbackOutputs(screen, layout), 6);
  const links = mergeItems(extractItems(screen.linksText, 6), fallbackLinks(screen), 6);
  return {
    ...screen,
    layout,
    fields,
    actions,
    outputs,
    links,
    keywords: keywords(screen, fields),
  };
}

function layoutFor(screen) {
  const id = screen.id;
  const title = screen.title;
  const n = Number(id.slice(-2));

  if (id === "BF-00") return "tenant-switch";
  if (id === "BF-01") return "ops-org";
  if (id === "BF-02") return "tenant-infra";
  if (id === "BF-03") return "bookkeeping-workflow";
  if (id === "BF-04") return "security-user";
  if (id === "BF-05") return "auth-policy";
  if (id === "BF-06") return "access-session";
  if (id === "BF-07") return "role-matrix";
  if (id === "BF-08") return "catalog-version";
  if (id === "BF-09") return "dimension-org";
  if (id === "BF-10") return "billing-usage";
  if (id === "BF-11") return "notification-matrix";
  if (id === "BF-12") return "menu-publisher";

  if (id === "SA-BAS-01") return "company-registration";
  if (id === "SA-BAS-02") return "role-matrix";
  if (id === "SA-BAS-03") return "settings-console";
  if (id === "SA-BAS-04") return "department-org";
  if (id === "SA-BAS-05") return "employee-master";
  if (id === "SA-BAS-06") return "partner-360";
  if (id === "SA-BAS-07") return "coa-builder";
  if (id === "SA-BAS-08") return "site-contract";
  if (id === "SA-BAS-09") return "project-budget";
  if (id === "SA-BAS-10") return "vehicle-tax";
  if (id === "SA-BAS-11") return "contractor-ledger";
  if (id === "SA-BAS-12") return "label-print";
  if (id === "SA-BAS-13") return "code-conversion";
  if (id === "SA-BAS-14") return "carry-forward";

  if (id.startsWith("SA-OPN")) {
    if (n <= 6) return "opening-statement";
    if ([9, 10, 11, 12].includes(n)) return "monthly-spread";
    return "opening-ledger";
  }

  if (id === "JV-01" || id === "SA-JNL-01") return "journal-entry";
  if (["JV-02", "JV-03"].includes(id)) return "cash-quick-entry";
  if (["JV-04", "JV-05"].includes(id) || (id.startsWith("SA-JNL") && /매입|매출/.test(title))) return "tax-voucher";
  if (id === "JV-06") return "voucher-toolbox";
  if (id === "JV-07") return "voucher-search";
  if (id === "JV-08") return "bulk-voucher";
  if (id.startsWith("SA-JNL")) return /장부|조회|검색/.test(title) ? "voucher-search" : "journal-entry";
  if (id.startsWith("SA-ATX")) return "automation-pipeline";

  if (id.startsWith("AUX") || id.startsWith("SA-LDG")) {
    if (/어음|수표/.test(title)) return "bill-timeline";
    if (/카드/.test(title)) return "card-ledger";
    if (/예금|은행|통장/.test(title)) return "bank-reconcile";
    if (/부가세/.test(title)) return "vat-ledger";
    if (/현금/.test(title)) return "cashbook";
    if (/공사|외주|현장/.test(title)) return "construction-ledger";
    return "ledger-report";
  }

  if (id.startsWith("SA-CLS")) {
    if (/현금흐름/.test(title)) return "cash-flow";
    if (/XBRL|공시|주석/.test(title)) return "disclosure-workbench";
    if (/재무상태|손익|원가|이익잉여|자본변동|재무제표/.test(title)) return "financial-statement";
    return "closing-workbench";
  }

  if (id.startsWith("SA-VAT")) {
    if (n === 1) return "vat-return-main";
    if (/MRI|검증/.test(title)) return "vat-validation";
    if (/전자신고|전송|파일/.test(title)) return "efile-pipeline";
    if (/납부서|환급|납부/.test(title)) return "tax-payment";
    if (/합계표|집계표/.test(title)) return "tax-summary";
    if (/신고서/.test(title)) return "tax-declaration";
    return "tax-attachment";
  }

  if (id === "SA-FA-01") return "asset-register";
  if (id === "SA-FA-07") return "asset-posting";
  if (id.startsWith("SA-FA")) return /명세|대장|현장|프로젝트|부서/.test(title) ? "asset-report" : "asset-depreciation";

  if (id.startsWith("SA-FND")) {
    if ([1, 3, 4, 5].includes(n)) return "fund-dashboard";
    if ([2, 6].includes(n)) return "cash-plan";
    if ([7, 10, 13].includes(n)) return "budget-input";
    return "budget-report";
  }

  if (id.startsWith("SA-DEP")) return /차입/.test(title) ? "loan-schedule" : "deposit-status";
  if (id.startsWith("SA-BIL")) return "bill-timeline";
  if (id.startsWith("SA-DAT")) return "data-ops";

  return "workbench";
}

function renderPhase(phase, screens) {
  const navScreens = screens.map((screen) => `<a href="#${anchor(screen.id)}"><code>${screen.id}</code> ${esc(screen.title)}</a>`).join("\n");
  const phaseLinks = phases.map((p) => `<a class="phase-link ${p.no === phase.no ? "on" : ""}" href="${esc(p.file)}">Phase ${pad(p.no)} · ${esc(p.subtitle)}</a>`).join("\n");
  const inventoryRows = screens.map((screen) => `<tr><td><code>${screen.id}</code></td><td>${esc(screen.title)}</td><td>${esc(screen.group)}</td><td>${esc(screen.basis)}</td><td><span class="pill">${esc(layoutLabel(screen.layout))}</span></td><td>${screen.fields.slice(0, 4).map(esc).join(" · ")}</td></tr>`).join("\n");
  const screenArticles = screens.map(renderScreen).join("\n");
  const saCount = screens.filter((s) => s.id.startsWith("SA-")).length;
  const coreCount = screens.length - saCount;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BK Phase ${phase.no} 상세화면구성 v1.0 - ${esc(phase.subtitle)}</title>
  <style>${css()}</style>
</head>
<body>
  <nav>
    <h1>BK 페이즈별 상세화면구성 v1.0</h1>
    <div class="meta">기준: 설계/bk_설계서_v2.1.md<br>재생성일: ${generatedAt}</div>
    <div class="nav-title">10개 페이즈</div>
    ${phaseLinks}
    <div class="nav-title">현재 페이즈 화면</div>
    ${navScreens}
  </nav>
  <main>
    <header class="doc-head">
      <span class="phase-badge">Phase ${pad(phase.no)}</span>
      <h2>${esc(phase.subtitle)}</h2>
      <p>${esc(phase.summary)}</p>
      <p>각 화면의 와이어프레임은 설계서의 입력 필드·기능·산출물·연계 항목을 실제 화면 영역으로 배치했다. 동일 업무군 안에서도 신고서, 합계표, 명세서, 원장, 대사, 배치, 입력 화면은 서로 다른 구조로 설계했다.</p>
    </header>
    <section class="stats">
      <div><strong>${screens.length}</strong><span>이 페이즈 화면</span></div>
      <div><strong>${saCount}</strong><span>SA 기능 화면</span></div>
      <div><strong>${coreCount}</strong><span>BF/JV/AUX 코어</span></div>
      <div><strong>${new Set(screens.map((s) => s.layout)).size}</strong><span>화면 구조 유형</span></div>
    </section>
    <section class="panel">
      <h2>페이즈 화면 인벤토리</h2>
      <table>
        <thead><tr><th>화면 ID</th><th>화면명</th><th>업무군</th><th>설계 기준</th><th>구조</th><th>핵심 필드</th></tr></thead>
        <tbody>${inventoryRows}</tbody>
      </table>
    </section>
    <section class="panel">
      <h2>화면별 상세 구성</h2>
      ${screenArticles}
    </section>
  </main>
</body>
</html>
`;
}

function renderScreen(screen) {
  const purpose = screen.purposeText || `${screen.title} 업무를 수행한다.`;
  const areas = areaRows(screen);
  return `<article class="screen" id="${anchor(screen.id)}" data-screen-id="${esc(screen.id)}" data-layout="${esc(screen.layout)}">
  <div class="screen-head">
    <span class="sid">${esc(screen.id)}</span>
    <div>
      <h3>${esc(screen.title)}</h3>
      <p>${esc(screen.group)} · ${esc(screen.basis)} · ${esc(layoutLabel(screen.layout))}</p>
    </div>
  </div>
  <div class="screen-body">
    <div class="brief-grid">
      <div class="brief"><b>업무 목적</b><p>${esc(short(purpose, 360))}</p></div>
      <div class="brief"><b>화면 설계 판단</b><p>${esc(designDecision(screen))}</p></div>
    </div>
    ${renderMock(screen)}
    <div class="detail-grid">
      <div class="detail-card">
        <h4>주요 화면 영역</h4>
        <table>${areas.map((r) => `<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join("")}</table>
      </div>
      <div class="detail-card">
        <h4>검증·연계·산출물</h4>
        <table>
          <tr><th>처리 기능</th><td>${screen.actions.map(tag).join("")}</td></tr>
          <tr><th>산출물</th><td>${screen.outputs.map(tag).join("")}</td></tr>
          <tr><th>연계</th><td>${screen.links.map(tag).join("")}</td></tr>
          <tr><th>충돌 조정</th><td>${esc(short(screen.conflictText || "BK 코어 원칙을 기준으로 화면 입력값을 변환·수용한다.", 260))}</td></tr>
        </table>
      </div>
    </div>
  </div>
</article>`;
}

function renderMock(screen) {
  const layout = screen.layout;
  const content = (() => {
    if (layout === "tenant-switch") return renderTenantSwitch(screen);
    if (["ops-org", "department-org", "dimension-org"].includes(layout)) return renderOrgManager(screen);
    if (layout === "tenant-infra") return renderTenantInfra(screen);
    if (layout === "bookkeeping-workflow") return renderWorkflow(screen);
    if (["security-user", "auth-policy", "access-session"].includes(layout)) return renderSecurity(screen);
    if (layout === "role-matrix") return renderRoleMatrix(screen);
    if (layout === "catalog-version") return renderCatalog(screen);
    if (layout === "billing-usage") return renderBilling(screen);
    if (layout === "notification-matrix") return renderNotification(screen);
    if (layout === "menu-publisher") return renderMenuPublisher(screen);
    if (layout === "company-registration") return renderCompanyRegistration(screen);
    if (layout === "settings-console") return renderSettings(screen);
    if (layout === "employee-master") return renderEmployee(screen);
    if (layout === "partner-360") return renderPartner(screen);
    if (layout === "coa-builder") return renderCoa(screen);
    if (["site-contract", "project-budget", "contractor-ledger"].includes(layout)) return renderContract(screen);
    if (layout === "vehicle-tax") return renderVehicle(screen);
    if (layout === "label-print") return renderLabelPrint(screen);
    if (layout === "code-conversion") return renderCodeConversion(screen);
    if (layout === "carry-forward") return renderCarryForward(screen);
    if (layout === "opening-statement") return renderOpeningStatement(screen);
    if (layout === "monthly-spread") return renderMonthlySpread(screen);
    if (layout === "opening-ledger") return renderOpeningLedger(screen);
    if (["journal-entry", "cash-quick-entry", "tax-voucher"].includes(layout)) return renderVoucher(screen);
    if (["voucher-toolbox", "voucher-search", "bulk-voucher"].includes(layout)) return renderVoucherOps(screen);
    if (layout === "automation-pipeline") return renderAutomation(screen);
    if (["ledger-report", "bill-timeline", "card-ledger", "bank-reconcile", "vat-ledger", "cashbook", "construction-ledger"].includes(layout)) return renderLedger(screen);
    if (["closing-workbench", "financial-statement", "cash-flow", "disclosure-workbench"].includes(layout)) return renderClosing(screen);
    if (layout.startsWith("vat-") || layout.startsWith("tax-") || layout === "efile-pipeline") return renderTax(screen);
    if (layout.startsWith("asset-")) return renderAsset(screen);
    if (["fund-dashboard", "cash-plan", "budget-input", "budget-report", "deposit-status", "loan-schedule"].includes(layout)) return renderFinance(screen);
    if (layout === "data-ops") return renderDataOps(screen);
    return renderWorkbench(screen);
  })();
  return `<div class="mock ${esc(layout)}" data-blueprint="${esc(screen.id)}-${esc(layout)}">
    <div class="mock-top"><strong>${esc(screen.id)}</strong><span>${esc(screen.title)}</span><em>${esc(screen.group)}</em></div>
    ${content}
  </div>`;
}

function renderTenantSwitch(screen) {
  return `<div class="tenant-search"><span>회사명/사업자번호 검색</span><b>대한건설 123-45-67890</b><button>선택</button></div>
  <div class="tenant-cards">
    ${["운영중", "마감잠금", "전환대기"].map((status, i) => `<div><strong>${["대한건설", "나래상사", "청운제조"][i]}</strong><span>${status}</span><p>${["2026년 1기 · BOOKKEEPING", "2025년 마감 · READONLY", "Dedicated DB 전환 승인대기"][i]}</p></div>`).join("")}
  </div>
  <div class="context-strip">${screen.fields.slice(0, 7).map((f) => `<span>${esc(f)}<b>${esc(sampleValue(f))}</b></span>`).join("")}</div>`;
}

function renderOrgManager(screen) {
  return `<div class="org-layout">
    <aside class="org-tree"><b>조직도</b><ul><li>본사</li><li>└ 회계팀</li><li>└ 공사관리팀</li><li>영업본부</li><li>└ 프로젝트지원</li></ul><button>조직 동기화</button></aside>
    <section class="org-detail">
      <div class="tabs">${tabSet(["부서", "사원배정", "코스트센터", "유효일자", "정책"])}</div>
      ${formGrid(screen.fields.slice(0, 8))}
    </section>
    <aside class="policy-box"><b>DimensionConfig</b>${miniMatrix(["사업장", "코스트센터", "부서", "프로젝트", "현장", "사원"], ["사용", "필수", "기본값"])}</aside>
  </div>`;
}

function renderTenantInfra(screen) {
  return `<div class="infra-layout">
    <div class="kpi-row">${["DB 티어", "사용량", "스냅샷", "비동기 잡"].map((x, i) => `<div><span>${x}</span><strong>${["SHARED", "72%", "03:10", "2건 재시도"][i]}</strong></div>`).join("")}</div>
    ${dataGrid(["테넌트", "티어", "쿼터", "스냅샷", "잡 상태", "장애 등급"], 4, screen)}
    <div class="job-timeline"><b>운영 큐</b><span>스냅샷 생성</span><span>전용 DB 전환</span><span>쿼터 재계산</span><span>콜드 아카이브</span></div>
  </div>`;
}

function renderWorkflow(screen) {
  return `<div class="swimlane">${["요청", "검토", "승인", "예약 적용", "잠금 해제"].map((step, i) => `<div><b>${step}</b><p>${esc(screen.fields[i] ?? sampleValue(step))}</p><span>${["draft", "review", "approved", "scheduled", "done"][i]}</span></div>`).join("")}</div>
  <div class="two-col">${formPanel("전환 요청", screen.fields.slice(0, 7))}<div>${dataGrid(["일자", "요청자", "변경 전", "변경 후", "상태"], 4, screen)}</div></div>`;
}

function renderSecurity(screen) {
  return `<div class="security-layout">
    <aside>${formPanel("정책/세션 조건", screen.fields.slice(0, 8))}</aside>
    <section>${dataGrid(["사용자", "계정상태", "MFA", "SSO", "최근 로그인", "위험"], 5, screen)}</section>
    <aside><b>감사 이벤트</b><ol><li>MFA 초기화 요청</li><li>IP 제한 위반</li><li>긴급대행 동의</li><li>세션 강제 종료</li></ol></aside>
  </div>`;
}

function renderRoleMatrix(screen) {
  return `<div class="matrix-layout">
    <aside><b>역할/사용자</b><p>관리자</p><p>기장담당</p><p>검토자</p><p>외부세무대리인</p></aside>
    <section>${miniMatrix(["기초", "전표", "장부", "결산", "세무", "자금", "운영"], ["조회", "입력", "승인", "마감"])}</section>
    <aside>${formPanel("가드레일/예외", screen.fields.slice(0, 6))}</aside>
  </div>`;
}

function renderCatalog(screen) {
  return `<div class="catalog-layout">
    <aside><b>카탈로그 버전</b><p>COA v2026.1</p><p>부가세 규칙 v2026.2</p><p>업종 공제규칙 v2026.1</p></aside>
    <section>${dataGrid(["항목", "현재값", "변경값", "영향 테넌트", "배포상태"], 5, screen)}</section>
    <aside><b>배포 패널</b><button>차이 비교</button><button>테넌트 배포</button><button>롤백</button></aside>
  </div>`;
}

function renderBilling(screen) {
  return `<div class="billing-layout">
    <div class="kpi-row">${["사용자", "저장소", "전표", "API"].map((x, i) => `<div><span>${x}</span><strong>${["38명", "72GB", "128,004건", "44,200회"][i]}</strong></div>`).join("")}</div>
    ${dataGrid(["청구월", "플랜", "기본료", "초과사용", "결제상태", "영수증"], 4, screen)}
  </div>`;
}

function renderNotification(screen) {
  return `<div class="notification-layout">
    <section>${miniMatrix(["마감임박", "전자신고 오류", "승인요청", "백업실패", "긴급대행"], ["앱", "메일", "SMS", "웹훅"])}</section>
    <aside>${formPanel("템플릿 편집", ["제목", "본문", "D-N 스케줄", "수신 역할", "재시도 정책"])}</aside>
    <aside>${dataGrid(["시간", "이벤트", "채널", "응답", "재처리"], 4, screen)}</aside>
  </div>`;
}

function renderMenuPublisher(screen) {
  return `<div class="menu-layout">
    <aside><b>메뉴 트리</b><p>회계관리</p><p>└ 전표관리</p><p>└ 장부관리</p><p>└ 부가세신고</p></aside>
    <section>${dataGrid(["메뉴ID", "화면ID", "권한", "노출조건", "변경유형"], 5, screen)}</section>
    <aside><b>발행</b><p>MenuVersion 2026.06.20</p><button>미리보기</button><button>발행</button><button>롤백</button></aside>
  </div>`;
}

function renderCompanyRegistration(screen) {
  return `<div class="registration-layout">
    <aside><b>회사 목록</b><p>1000 대한건설</p><p>1001 청운제조</p><p>1002 나래상사</p></aside>
    <section><div class="tabs">${tabSet(["기본사항", "회계기간", "신고인", "본지점", "환급계좌"])}</div>${formGrid(screen.fields.slice(0, 10))}</section>
    <aside><b>세무/신고 미리보기</b><p>사업자번호 검증 완료</p><p>법인/개인 구분 반영</p><p>회계연도 2026-01-01~2026-12-31</p></aside>
  </div>`;
}

function renderSettings(screen) {
  return `<div class="settings-layout">
    ${["코드 자리수", "관리코드 사용", "소수점/반올림", "마감/잠금"].map((x, i) => `<div class="setting-card"><b>${x}</b><p>${esc(screen.fields[i] ?? sampleValue(x))}</p><label><input type="checkbox" checked> 사용</label></div>`).join("")}
    <section>${miniMatrix(["거래처", "부서", "사원", "현장", "프로젝트", "차량"], ["사용", "자리수", "필수", "전표반영"])}</section>
  </div>`;
}

function renderEmployee(screen) {
  return `<div class="employee-layout">
    <aside>${dataGrid(["사번", "성명", "부서", "직위", "재직"], 5, screen)}</aside>
    <section><div class="tabs">${tabSet(["기본", "소속이력", "금융", "차원", "가지급"])}</div>${formGrid(screen.fields.slice(0, 10))}</section>
    <aside><b>연계 상태</b><p>NAHAGO 동기화</p><p>부서/코스트센터 기본값</p><p>전표 사원 차원 사용</p></aside>
  </div>`;
}

function renderPartner(screen) {
  return `<div class="partner-layout">
    <aside>${dataGrid(["코드", "거래처명", "구분", "등록번호", "사용"], 5, screen)}</aside>
    <section><div class="tabs">${tabSet(["일반", "금융", "카드", "여신", "검증"])}</div>${formGrid(screen.fields.slice(0, 10))}</section>
    <aside><b>검증</b><p>사업자등록번호 형식</p><p>휴폐업 조회</p><p>자동이체 계좌 진위</p></aside>
  </div>`;
}

function renderCoa(screen) {
  return `<div class="coa-layout">
    <aside><b>계정체계</b><p>자산</p><p>└ 유동자산</p><p>└ 비유동자산</p><p>부채/자본/수익/비용</p></aside>
    <section>${dataGrid(["Code", "계정과목", "구분", "관계", "표준용코드", "사용"], 6, screen)}</section>
    <aside>${formPanel("계정 상세/관리항목", screen.fields.slice(0, 8))}</aside>
  </div>`;
}

function renderContract(screen) {
  return `<div class="contract-layout">
    <aside><b>${esc(screen.title)} 목록</b><p>진행</p><p>완료</p><p>보류</p></aside>
    <section>${formPanel("기본/계약 정보", screen.fields.slice(0, 9))}${dataGrid(["회차", "일자", "계약금액", "선급금", "담당", "비고"], 4, screen)}</section>
    <aside><b>진행 타임라인</b><ol><li>등록</li><li>계약 변경</li><li>전표 반영</li><li>초기이월</li></ol></aside>
  </div>`;
}

function renderVehicle(screen) {
  return `<div class="vehicle-layout">
    <aside>${dataGrid(["차량코드", "차량번호", "명의구분", "사용", "사원"], 5, screen)}</aside>
    <section><div class="tabs">${tabSet(["기본사항", "보험", "운행정보", "근무지", "고정자산"])}</div>${formGrid(screen.fields.slice(0, 10))}</section>
    <aside><b>세무 계산</b><p>업무전용보험</p><p>운행기록부 업무사용비율</p><p>비용한도 800만원</p></aside>
  </div>`;
}

function renderLabelPrint(screen) {
  return `<div class="label-layout">
    <aside>${formPanel("인쇄 조건", screen.fields.slice(0, 7))}</aside>
    <section class="label-preview">${Array.from({ length: 8 }, (_, i) => `<div><b>대한상사 ${i + 1}</b><span>서울시 중구 세종대로 ${10 + i}</span><em>대표 홍길동</em></div>`).join("")}</section>
    <aside><b>작업</b><button>새로 불러오기</button><button>일괄변경</button><button>라벨 인쇄</button></aside>
  </div>`;
}

function renderCodeConversion(screen) {
  return `<div class="conversion-layout">
    <section>${formPanel("변환 조건", screen.fields.slice(0, 8))}</section>
    <section>${dataGrid(["대상", "변환 전", "변환 후", "영향 전표", "마감충돌", "처리"], 5, screen)}</section>
    <aside><b>실행 전 검증</b><p>마감 상태</p><p>자금항목 제외</p><p>자동전표 출처</p><button>미리보기</button><button>변환 실행</button></aside>
  </div>`;
}

function renderCarryForward(screen) {
  return `<div class="carry-layout">
    <aside>${formPanel("마감/이월 기수", screen.fields.slice(0, 6))}</aside>
    <section>${miniMatrix(["재무제표", "거래처", "부서/사원", "현장", "프로젝트", "고정자산", "차량"], ["마감", "기존삭제", "재이월", "완료"])}</section>
    <aside><b>결과</b><p>opening_balance 생성</p><p>기간 잠금 설정</p><p>차기 기초자료 반영</p></aside>
  </div>`;
}

function renderOpeningStatement(screen) {
  return `<div class="statement-layout">
    <aside><b>재무제표 항목</b><p>자산</p><p>부채</p><p>자본</p><p>수익/비용</p></aside>
    <section>${dataGrid(["계정과목", "전전전년", "전전년", "전년", "차액", "검증"], 7, screen)}</section>
    <aside>${formPanel("정합성", ["준거 금액", "월별 배분", "이월 출처", "차기 자동반영", "대표자 설정"])}</aside>
  </div>`;
}

function renderMonthlySpread(screen) {
  return `<div class="monthly-layout">
    <aside>${formPanel("기준 금액", screen.fields.slice(0, 5))}</aside>
    <section>${dataGrid(["계정과목", "연간", "1월", "2월", "3월", "4월", "차액"], 6, screen)}</section>
    <aside><b>월별 배분</b><p>연간 합계와 월별 합계 대사</p><p>차액 붉은색 표시</p><button>자동 배분</button></aside>
  </div>`;
}

function renderOpeningLedger(screen) {
  return `<div class="opening-ledger-layout">
    <aside>${formPanel("초기이월 조건", screen.fields.slice(0, 7))}</aside>
    <section>${dataGrid(["대상코드", "대상명", "계정", "전기잔액", "차변", "대변", "검증"], 6, screen)}</section>
    <aside><b>준거 대사</b><p>전기 재무상태표 금액</p><p>보조부 합계</p><p>차액 확인</p></aside>
  </div>`;
}

function renderVoucher(screen) {
  const quick = screen.layout === "cash-quick-entry";
  const tax = screen.layout === "tax-voucher";
  return `<div class="voucher-layout">
    <aside>${quick ? formPanel("현금 고정값", ["현금 계정", "입출금 방향", "상대계정", "차단 계정", "전환 안내"]) : formPanel("전표 헤더", ["전표일자", "전표번호", "구분", "사업장", "작성자", "승인상태"])}</aside>
    <section>${dataGrid(tax ? ["라인", "세무구분", "계정", "거래처", "공급가액", "세액", "분개"] : ["라인", "계정과목", "차변", "대변", "거래처", "부서", "프로젝트", "적요"], 5, screen)}</section>
    <aside><b>검증 패널</b><p>대차 일치</p><p>마감 기간</p><p>부가세 계정 조건</p><p>보조부 필수값</p><button>저장 후 계속 입력</button></aside>
  </div>`;
}

function renderVoucherOps(screen) {
  if (screen.layout === "bulk-voucher") {
    return `<div class="bulk-layout"><aside>${formPanel("업로드/매핑", screen.fields.slice(0, 8))}</aside><section>${dataGrid(["원본컬럼", "매핑필드", "샘플값", "검증", "오류"], 6, screen)}</section><aside><b>배치</b><p>전체 미리보기</p><p>오류행 제외</p><button>일괄 생성</button></aside></div>`;
  }
  if (screen.layout === "voucher-toolbox") {
    return `<div class="toolbox-layout">${["복사", "반복", "템플릿", "역분개"].map((x) => `<div><b>${x}</b><p>${esc(screen.title)} 작업</p><button>${x} 실행</button></div>`).join("")}${dataGrid(["원전표", "작업", "적용일", "상태", "감사"], 4, screen)}</div>`;
  }
  return `<div class="search-layout"><aside>${formPanel("검색 조건", screen.fields.slice(0, 8))}</aside><section>${dataGrid(["전표일자", "번호", "구분", "거래처", "금액", "상태", "수정가능"], 7, screen)}</section><aside><b>드릴다운</b><p>원전표 열기</p><p>역분개 유도</p><p>삭제 감사로그</p></aside></div>`;
}

function renderAutomation(screen) {
  const source = automationSource(screen.title);
  return `<div class="automation-layout">
    <div class="pipeline">${["수집", "정규화", "매칭", "검증", "전표전송"].map((x, i) => `<div><b>${x}</b><span>${esc(source[i] ?? screen.keywords[i] ?? "처리")}</span></div>`).join("")}</div>
    <div class="two-col"><section>${dataGrid(["수집일", "원천자료", "거래처", "공급가액", "세액", "상태"], 5, screen)}</section><aside>${formPanel("매핑/오류", screen.fields.slice(0, 7))}</aside></div>
  </div>`;
}

function renderLedger(screen) {
  if (screen.layout === "bill-timeline") {
    return `<div class="bill-layout"><aside>${formPanel("어음 조건", screen.fields.slice(0, 7))}</aside><section class="timeline">${["발행", "배서", "할인", "만기", "결제"].map((x, i) => `<div><b>${x}</b><p>${["원전표", "거래처 변경", "할인료 계산", "은행 제시", "후속전표"][i]}</p></div>`).join("")}</section><aside>${dataGrid(["어음번호", "거래처", "만기", "금액", "상태"], 4, screen)}</aside></div>`;
  }
  return `<div class="ledger-layout">
    <aside>${formPanel("조회 조건", screen.fields.slice(0, 8))}</aside>
    <section>${dataGrid(ledgerColumns(screen), 8, screen)}</section>
    <aside><b>대사/드릴다운</b><p>원전표 연결</p><p>보조부 합계</p><p>차원별 필터</p><p>엑셀/인쇄</p></aside>
  </div>`;
}

function renderClosing(screen) {
  const cols = screen.layout === "financial-statement" ? ["서식항목", "계정", "조정전", "결산분개", "조정후", "검증"] : ["작업", "담당", "상태", "차액", "근거", "승인"];
  return `<div class="closing-layout">
    <aside><b>결산 작업</b><p>자료수집</p><p>조정분개</p><p>재무제표</p><p>검토/마감</p></aside>
    <section>${dataGrid(cols, 7, screen)}</section>
    <aside>${formPanel(screen.layout === "cash-flow" ? "현금흐름 조정" : "검증/주석", screen.fields.slice(0, 7))}</aside>
  </div>`;
}

function renderTax(screen) {
  if (screen.layout === "efile-pipeline") {
    return `<div class="efile-layout"><div class="pipeline">${["신고서 잠금", "MRI 검증", "파일 생성", "전자신고", "접수증"].map((x) => `<div><b>${x}</b><span>대기</span></div>`).join("")}</div>${dataGrid(["서식", "수정차수", "오류", "파일", "접수상태"], 5, screen)}</div>`;
  }
  if (screen.layout === "vat-validation") {
    return `<div class="validation-layout"><aside>${formPanel("검증 범위", screen.fields.slice(0, 7))}</aside><section>${dataGrid(["검증항목", "대상서식", "오류건수", "위험도", "수정화면"], 6, screen)}</section><aside><b>MRI 결과</b><p>신고서 합계</p><p>합계표 누락</p><p>세액 불일치</p></aside></div>`;
  }
  const tabs = screen.layout === "tax-summary" ? ["매출", "매입", "불러오기", "차액", "전자신고"] : ["기본사항", "명세", "집계", "검증", "전자신고"];
  return `<div class="tax-layout">
    <aside>${formPanel("신고 조건", screen.fields.slice(0, 7))}</aside>
    <section><div class="tabs">${tabSet(tabs)}</div>${taxForm(screen)}</section>
    <aside><b>신고 연계</b>${screen.outputs.slice(0, 4).map((x) => `<p>${esc(x)}</p>`).join("")}<button>MRI 검증</button><button>신고서 반영</button></aside>
  </div>`;
}

function renderAsset(screen) {
  const cols = screen.layout === "asset-register" ? ["자산코드", "자산명", "취득일", "취득가액", "사용부서", "상각방법", "상태"] : ["자산", "취득가", "전기상각", "당기상각", "상각누계", "장부가", "전표"];
  return `<div class="asset-layout">
    <aside>${formPanel("자산 조건", screen.fields.slice(0, 7))}</aside>
    <section>${dataGrid(cols, 7, screen)}</section>
    <aside><b>라이프사이클</b><p>취득</p><p>부서 이동</p><p>상각</p><p>양도/폐기</p><button>감가상각 계산</button></aside>
  </div>`;
}

function renderFinance(screen) {
  if (screen.layout === "cash-plan") {
    return `<div class="cashplan-layout"><aside>${formPanel("계획 조건", screen.fields.slice(0, 7))}</aside><section class="calendar">${Array.from({ length: 14 }, (_, i) => `<div><b>${i + 1}</b><span>${i % 3 === 0 ? "입금" : i % 3 === 1 ? "지급" : "예정"}</span><em>${(i + 2) * 100}만</em></div>`).join("")}</section><aside><b>자동 반영</b><p>차입금 상환계획</p><p>거래처 금융탭</p><p>공휴일 이연</p></aside></div>`;
  }
  if (screen.layout.includes("budget")) {
    return `<div class="budget-layout"><aside>${formPanel("예산 조건", screen.fields.slice(0, 7))}</aside><section>${dataGrid(["계정/코드", "1월", "2월", "3월", "예산", "실적", "차액", "비율"], 6, screen)}</section><aside><b>분석</b><p>부서별</p><p>사원별</p><p>프로젝트별</p></aside></div>`;
  }
  return `<div class="finance-layout">
    <div class="kpi-row">${["전일잔액", "입금예정", "지급예정", "가용자금"].map((x, i) => `<div><span>${x}</span><strong>${["82,000,000", "15,400,000", "9,200,000", "88,200,000"][i]}</strong></div>`).join("")}</div>
    <div class="two-col"><section>${dataGrid(financeColumns(screen), 7, screen)}</section><aside>${formPanel("자금 조건", screen.fields.slice(0, 7))}</aside></div>
  </div>`;
}

function renderDataOps(screen) {
  const isBackup = /백업|복구/.test(screen.title);
  return `<div class="dataops-layout">
    <aside>${formPanel(isBackup ? "백업/복구 조건" : "이관 조건", screen.fields.slice(0, 8))}</aside>
    <section><div class="job-console"><b>${esc(screen.title)} 실행 콘솔</b><p>사전 검증 → 잠금 확인 → 작업 실행 → 결과 다운로드</p><div class="progress"><span style="width:68%"></span></div></div>${dataGrid(["작업ID", "대상기간", "단계", "건수", "상태", "로그"], 5, screen)}</section>
    <aside><b>안전장치</b><p>테넌트 스코프</p><p>기수 잠금</p><p>체크섬</p><p>복구 지점</p></aside>
  </div>`;
}

function renderWorkbench(screen) {
  return `<div class="workbench-layout"><aside>${formPanel("조건", screen.fields.slice(0, 7))}</aside><section>${dataGrid(screen.fields.slice(0, 6), 6, screen)}</section><aside><b>처리</b>${screen.actions.map((a) => `<button>${esc(a)}</button>`).join("")}</aside></div>`;
}

function areaRows(screen) {
  return [
    ["상단 컨텍스트", "테넌트, 회계기간, 사업장, 권한, 마감상태를 표시하고 화면별 작업 범위를 고정한다."],
    ["입력/조회 조건", screen.fields.slice(0, 7).join(" · ")],
    ["주 작업 영역", layoutMainArea(screen)],
    ["처리 버튼", screen.actions.join(" · ")],
    ["상태/검증", validationText(screen)],
  ];
}

function layoutMainArea(screen) {
  const m = {
    "journal-entry": "전표 헤더와 분개 라인을 한 화면에서 입력하고 대차·마감·보조부 필수값을 즉시 검증한다.",
    "tax-voucher": "세금계산서 정보, 부가세 계정, 매입/매출 원장 반영 상태를 분개 라인과 함께 배치한다.",
    "automation-pipeline": "수집 원천자료, 매핑, 오류, 전표 후보, 전송 결과를 단계별 파이프라인으로 배치한다.",
    "tax-attachment": "신고 조건, 서식 본문, 집계/검증, 전자신고 반영 패널을 분리한다.",
    "ledger-report": "조회 조건, 원장 그리드, 원전표 드릴다운과 대사 패널을 배치한다.",
    "data-ops": "작업 조건, 실행 콘솔, 진행률, 로그 다운로드와 복구 지점을 배치한다.",
  };
  return m[screen.layout] ?? `${layoutLabel(screen.layout)} 구조로 ${screen.title}의 업무 입력값과 결과물을 같은 화면에서 확인한다.`;
}

function designDecision(screen) {
  if (/신고|부가세|세액|합계표|명세서/.test(screen.title)) return "세무 화면은 원천자료 불러오기, 신고서 본문, MRI 검증, 전자신고 반영 상태가 분리되어야 하므로 신고서 작업대 구조로 설계했다.";
  if (/전표|분개/.test(screen.title)) return "전표 화면은 채번, 대차, 보조부, 마감 검증이 입력 중 바로 보여야 하므로 헤더-라인-검증 패널 구조로 설계했다.";
  if (/원장|장부|현황|대장/.test(screen.title)) return "장부 화면은 조건 조회, 대량 그리드, 원전표 드릴다운, 집계/차액 확인이 핵심이므로 리포트·대사 구조로 설계했다.";
  if (/등록|설정|관리/.test(screen.title)) return "마스터 화면은 목록, 상세 입력, 이력/연계 상태를 동시에 확인해야 하므로 업무 엔티티 중심의 관리 화면으로 설계했다.";
  if (/백업|복구|데이터|기수/.test(screen.title)) return "데이터 운영 화면은 실행 전 검증, 진행률, 로그, 복구 지점이 중요하므로 작업 콘솔 구조로 설계했다.";
  return `${screen.title}의 입력 필드와 산출물을 기준으로 ${layoutLabel(screen.layout)} 구조를 적용했다.`;
}

function validationText(screen) {
  const text = `${screen.functionsText} ${screen.conflictText}`;
  const rules = [];
  if (/마감|잠금/.test(text)) rules.push("마감/잠금 기간 확인");
  if (/검증|오류|차액|정합/.test(text)) rules.push("정합성·차액 검증");
  if (/권한|승인|RLS/.test(text)) rules.push("권한·RLS 스코프 검증");
  if (/전자신고|MRI|세액|부가세/.test(text)) rules.push("세무/MRI 검증");
  if (/중복|코드/.test(text)) rules.push("코드 중복 검증");
  return (rules.length ? rules : ["필수값", "권한", "저장 전 서버 검증"]).join(" · ");
}

function formPanel(title, fields) {
  return `<div class="form-panel"><b>${esc(title)}</b>${formGrid(fields)}</div>`;
}

function formGrid(fields) {
  const picked = fields.length ? fields : ["기간", "사업장", "거래처", "계정과목", "금액", "상태"];
  return `<div class="form-grid">${picked.slice(0, 10).map((f) => `<label>${esc(short(f, 26))}</label><div>${esc(sampleValue(f))}</div>`).join("")}</div>`;
}

function dataGrid(headers, rows, screen) {
  const cols = headers.filter(Boolean).slice(0, 8);
  return `<table class="mock-grid"><thead><tr>${cols.map((h) => `<th>${esc(short(h, 18))}</th>`).join("")}</tr></thead><tbody>${Array.from({ length: rows }, (_, i) => `<tr>${cols.map((h) => `<td>${esc(sampleValue(h, i, screen))}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function miniMatrix(rows, cols) {
  return `<table class="mock-grid matrix"><thead><tr><th>항목</th>${cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r, i) => `<tr><td>${esc(r)}</td>${cols.map((_, j) => `<td>${(i + j) % 3 === 0 ? "필수" : (i + j) % 3 === 1 ? "허용" : "검토"}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function taxForm(screen) {
  const base = screen.fields.slice(0, 8);
  const rows = base.length ? base : ["과세표준", "매출세액", "매입세액", "공제세액", "납부세액", "첨부서류"];
  return `<div class="tax-form">${rows.slice(0, 10).map((r, i) => `<div><span>${pad(i + 1)}</span><b>${esc(short(r, 34))}</b><em>${esc(sampleValue(r, i, screen))}</em></div>`).join("")}</div>`;
}

function tabSet(tabs) {
  return tabs.map((tab, i) => `<span class="${i === 0 ? "active" : ""}">${esc(tab)}</span>`).join("");
}

function tag(text) {
  return `<span class="tag">${esc(short(text, 34))}</span>`;
}

function ledgerColumns(screen) {
  if (/거래처|채권|채무/.test(screen.title)) return ["일자", "거래처", "계정", "발생", "반제", "잔액", "연체", "원전표"];
  if (/카드/.test(screen.title)) return ["사용일", "카드", "가맹점", "업종", "공급가액", "세액", "공제", "전표"];
  if (/예금|통장|은행/.test(screen.title)) return ["일자", "계좌", "입금", "출금", "잔액", "대사", "전표"];
  if (/부가세/.test(screen.title)) return ["세무구분", "매입/매출", "공급가액", "세액", "신고항목", "전자상태"];
  if (/현금/.test(screen.title)) return ["일자", "적요", "입금", "출금", "잔액", "시재", "전표"];
  return ["일자", "계정/대상", "차변", "대변", "잔액", "차원", "전표번호"];
}

function financeColumns(screen) {
  if (/차입/.test(screen.title)) return ["차입처", "원금", "이자율", "상환일", "원금상환", "이자", "잔액"];
  if (/예적금/.test(screen.title)) return ["은행", "계좌", "상품", "만기", "불입액", "잔액", "이자"];
  if (/어음|당좌/.test(screen.title)) return ["번호", "거래처", "발행일", "만기일", "은행", "금액", "상태"];
  return ["일자", "자금항목", "계획", "실적", "차액", "거래처", "전표"];
}

function automationSource(title) {
  if (/세금계산서/.test(title)) return ["국세청", "전자세금계산서", "거래처/세무구분", "중복·누락", "매입매출전표"];
  if (/카드/.test(title)) return ["카드사", "승인내역", "가맹점/공제", "불공제", "매입전표"];
  if (/현금영수증/.test(title)) return ["국세청", "현금영수증", "사업자번호", "공제여부", "전표전송"];
  if (/통장|은행/.test(title)) return ["은행", "입출금", "계좌/적요", "미매칭", "일반전표"];
  return ["외부자료", "정규화", "매핑", "검증", "전표전송"];
}

function extractBlock(body, labels) {
  for (const label of labels) {
    const re = new RegExp(`- \\*\\*${escapeRegExp(label)}[^*]*\\*\\*:?\\s*([\\s\\S]*?)(?=\\n- \\*\\*|\\n####|\\n###|$)`);
    const m = body.match(re);
    if (m) return clean(m[1]);
  }
  return "";
}

function extractItems(text, max = 10) {
  const cleaned = clean(text);
  if (!cleaned) return [];
  const circled = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳";
  let normalized = cleaned
    .replace(new RegExp(`([${circled}])`, "g"), "\n$1 ")
    .replace(/[•]/g, "\n")
    .replace(/\s*;\s*/g, "\n")
    .replace(/\s+\/\s+/g, "/");
  const raw = normalized.split(/\n+/).flatMap((part) => {
    const p = part.trim();
    if (p.length > 95) return p.split(/\s*,\s*/);
    return [p];
  });
  const items = [];
  for (const item of raw) {
    const v = clean(item).replace(new RegExp(`^[${circled}]\\s*`), "").replace(/^\d+[.)]\s*/, "").trim();
    if (v.length < 2) continue;
    if (/^BK 조회조건:?$/.test(v)) continue;
    items.push(short(v, 70));
    if (items.length >= max) break;
  }
  return unique(items);
}

function clean(text) {
  return String(text ?? "")
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&middot;/g, "·")
    .replace(/&amp;/g, "&")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function fallbackFields(screen) {
  const t = screen.title;
  if (/신고|부가세|세액|합계표|명세서/.test(t)) return ["신고기간", "사업장", "수정차수", "서식구분", "공급가액", "세액", "전자신고상태"];
  if (/전표|분개/.test(t)) return ["전표일자", "전표번호", "구분", "계정과목", "차변", "대변", "거래처", "적요"];
  if (/원장|장부|현황|대장/.test(t)) return ["기간", "계정과목", "거래처", "사업장", "차변", "대변", "잔액", "전표번호"];
  if (/예산/.test(t)) return ["기간", "관리코드", "계정과목", "예산액", "실적액", "차액", "비율"];
  if (/자금/.test(t)) return ["일자", "자금항목", "입금", "지급", "예정액", "실적액", "잔액"];
  if (/데이터|백업|복구|기수/.test(t)) return ["작업대상", "기수", "기간", "테넌트", "실행단계", "상태", "로그"];
  return ["코드", "명칭", "구분", "사용여부", "사업장", "부서", "비고"];
}

function fallbackActions(screen, layout) {
  if (/신고|부가세/.test(screen.title)) return ["불러오기", "MRI 검증", "신고서 반영", "전자신고"];
  if (/전표/.test(screen.title)) return ["조회", "저장", "검증", "역분개"];
  if (/데이터|백업|복구/.test(screen.title)) return ["사전검증", "실행", "로그 확인", "복구지점 생성"];
  if (/마감|이월/.test(screen.title)) return ["마감", "재이월", "마감취소", "결과 확인"];
  if (layout.includes("report") || /현황|장부|원장/.test(screen.title)) return ["조회", "드릴다운", "인쇄", "엑셀"];
  return ["조회", "저장", "검증", "이력 확인"];
}

function fallbackOutputs(screen, layout) {
  if (/신고|부가세/.test(screen.title)) return ["신고서", "전자신고 파일", "검증 결과"];
  if (/전표/.test(screen.title)) return ["전표", "분개 라인", "감사로그"];
  if (/장부|원장|현황|대장/.test(screen.title)) return ["조회 결과", "집계표", "원전표 링크"];
  if (/데이터|백업|복구/.test(screen.title)) return ["작업 로그", "백업 파일", "검증 리포트"];
  return ["마스터 데이터", "변경 이력", "연계 결과"];
}

function fallbackLinks(screen) {
  if (/신고|부가세/.test(screen.title)) return ["매입매출전표", "부가세 보조부", "전자신고"];
  if (/전표/.test(screen.title)) return ["일반전표입력", "전표검색", "보조부"];
  if (/계정|거래처|부서|사원|현장|프로젝트/.test(screen.title)) return ["전표 화면", "장부 조회", "초기이월"];
  return ["v2.1 설계서", "권한/감사", "운영 로그"];
}

function keywords(screen, fields) {
  const stop = new Set(["화면", "입력", "조회", "관리", "등록", "현황", "명세서", "신고서", "계산서", "기준", "사용", "전체", "기간"]);
  const words = clean(`${screen.title} ${fields.join(" ")}`).split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 2 && !stop.has(w));
  return unique(words).slice(0, 10);
}

function mergeItems(a, b, max) {
  return unique([...(a ?? []), ...(b ?? [])]).slice(0, max);
}

function unique(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const v = clean(item);
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function sampleValue(label, index = 0, screen = {}) {
  const l = String(label);
  if (/일자|일$|날짜/.test(l)) return `2026-06-${String(20 + (index % 8)).padStart(2, "0")}`;
  if (/기간|회계/.test(l)) return "2026-01-01 ~ 2026-12-31";
  if (/사업장/.test(l)) return "본점";
  if (/부서/.test(l)) return "공사관리팀";
  if (/사원|담당/.test(l)) return "김기장";
  if (/거래처|공급자|매출처|매입처/.test(l)) return ["대한상사", "청운제조", "나래상사"][index % 3];
  if (/계정|과목/.test(l)) return ["401 상품매출", "146 상품", "253 부가세예수금"][index % 3];
  if (/코드|Code|ID/.test(l)) return `${screen.id?.replace(/[^A-Z0-9]/g, "").slice(-4) || "BK"}-${String(index + 1).padStart(3, "0")}`;
  if (/금액|공급가|세액|차변|대변|잔액|예산|실적|원금|이자|입금|출금|지급|수입|매출|매입/.test(l)) return `${(index + 3) * 1250000}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (/율|비율|공제/.test(l)) return `${(index + 1) * 10}%`;
  if (/상태|검증|마감|승인/.test(l)) return ["검증완료", "대기", "오류확인", "승인"][index % 4];
  if (/번호/.test(l)) return `2026-06-20-${String(index + 1).padStart(3, "0")}`;
  if (/은행|계좌/.test(l)) return "국민 123-456-789";
  if (/프로젝트/.test(l)) return "P-2026 본사리뉴얼";
  if (/현장/.test(l)) return "강남 2공구";
  if (/차량/.test(l)) return "12가3456";
  if (/기수/.test(l)) return "제 8기";
  return screen.keywords?.[index % Math.max(screen.keywords.length, 1)] ?? "입력값";
}

function layoutLabel(layout) {
  const labels = {
    "tenant-switch": "회사 선택 카드",
    "ops-org": "운영조직 배정",
    "tenant-infra": "테넌트 운영 콘솔",
    "bookkeeping-workflow": "워크플로우 칸반",
    "security-user": "보안 사용자 관리",
    "auth-policy": "인증 정책 편집",
    "access-session": "접근 세션 감사",
    "role-matrix": "권한 매트릭스",
    "catalog-version": "표준 버전 관리",
    "dimension-org": "조직/차원 관리",
    "billing-usage": "사용량/청구",
    "notification-matrix": "알림 매트릭스",
    "menu-publisher": "메뉴 발행",
    "company-registration": "회사 등록 탭",
    "settings-console": "환경 설정 콘솔",
    "department-org": "부서 조직도",
    "employee-master": "사원 카드",
    "partner-360": "거래처 3탭",
    "coa-builder": "계정과목 빌더",
    "site-contract": "현장 계약",
    "project-budget": "프로젝트 예산",
    "vehicle-tax": "차량 세무",
    "contractor-ledger": "외주 계약",
    "label-print": "DM 라벨 출력",
    "code-conversion": "코드 변환 마법사",
    "carry-forward": "마감 후 이월",
    "opening-statement": "전기 재무제표 입력",
    "monthly-spread": "월별 배분표",
    "opening-ledger": "초기이월 보조부",
    "journal-entry": "전표 헤더/라인",
    "cash-quick-entry": "현금 간편입력",
    "tax-voucher": "매입매출 전표",
    "voucher-toolbox": "전표 도구",
    "voucher-search": "전표 검색",
    "bulk-voucher": "일괄 전표 입력",
    "automation-pipeline": "자동전표 파이프라인",
    "ledger-report": "원장 리포트",
    "bill-timeline": "어음 타임라인",
    "card-ledger": "카드 보조부",
    "bank-reconcile": "예금 대사",
    "vat-ledger": "부가세 보조부",
    "cashbook": "현금출납장",
    "construction-ledger": "공사/외주 장부",
    "closing-workbench": "결산 작업대",
    "financial-statement": "재무제표 편집",
    "cash-flow": "현금흐름 조정",
    "disclosure-workbench": "공시/XBRL",
    "vat-return-main": "부가세 신고서",
    "vat-validation": "MRI 검증",
    "efile-pipeline": "전자신고 파이프라인",
    "tax-payment": "납부/환급",
    "tax-summary": "합계표",
    "tax-declaration": "신고서",
    "tax-attachment": "첨부 명세",
    "asset-register": "자산 등록",
    "asset-posting": "상각비 계상",
    "asset-report": "자산 명세",
    "asset-depreciation": "상각 계산",
    "fund-dashboard": "자금 대시보드",
    "cash-plan": "자금 계획",
    "budget-input": "예산 입력",
    "budget-report": "예산/실적 분석",
    "deposit-status": "예적금 현황",
    "loan-schedule": "차입금 스케줄",
    "data-ops": "데이터 작업 콘솔",
  };
  return labels[layout] ?? layout;
}

function range(prefix, start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => `${prefix}-${String(start + i).padStart(2, "0")}`);
}

function rangeCore(prefix, start, end) {
  return Array.from({ length: end - start + 1 }, (_, i) => `${prefix}-${String(start + i).padStart(2, "0")}`);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function anchor(id) {
  return id.toLowerCase();
}

function short(text, max = 80) {
  const value = clean(text);
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function esc(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function css() {
  return `
:root{--ink:#172033;--sub:#667085;--line:#d6dce8;--bg:#f4f6fa;--nav:#182235;--blue:#2454c6;--blue2:#e8eefc;--green:#08785f;--green2:#def5ee;--amber:#9a5b00;--amber2:#fff4d8;--red:#b42318;--red2:#fee4e2;--panel:#fff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',Arial,sans-serif;font-size:13px;line-height:1.55}
nav{position:fixed;inset:0 auto 0 0;width:292px;background:var(--nav);color:#d8e1f3;overflow:auto;padding:18px 14px}nav h1{margin:0 0 6px;color:#fff;font-size:16px;line-height:1.35}.meta{color:#9aa8bd;font-size:11px;margin-bottom:14px}.nav-title{margin:16px 0 7px;color:#8fe0cf;font-weight:800;font-size:11px;text-transform:uppercase;letter-spacing:.04em}nav a{display:block;text-decoration:none;color:#d8e1f3;border-radius:6px;padding:4px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}nav a:hover,nav a.on{background:#2a3650;color:#fff}.phase-link{font-size:11.5px;color:#b3c7ff}
main{margin-left:292px;padding:28px 36px 80px}.doc-head,.panel,.screen{background:var(--panel);border:1px solid var(--line);border-radius:8px}.doc-head{padding:24px 28px;margin-bottom:16px}.doc-head h2{font-size:25px;margin:5px 0 7px}.doc-head p{margin:4px 0;color:var(--sub)}.phase-badge,.pill,.tag{display:inline-block;border-radius:999px;font-weight:800;font-size:11px}.phase-badge{background:var(--blue2);color:var(--blue);padding:3px 10px}.pill{background:#eef2f8;color:#344054;padding:2px 8px}.tag{background:#eef2f8;color:#334155;margin:2px 4px 2px 0;padding:2px 8px}
.stats{display:grid;grid-template-columns:repeat(4,minmax(140px,1fr));gap:10px;margin:16px 0}.stats div{background:#fff;border:1px solid var(--line);border-radius:8px;padding:12px}.stats strong{display:block;font-size:24px}.stats span{color:var(--sub);font-size:11px}.panel{padding:20px 22px;margin:16px 0}.panel h2{font-size:18px;margin:0 0 12px;border-bottom:2px solid var(--blue);padding-bottom:8px}
table{border-collapse:collapse;width:100%}th,td{border:1px solid var(--line);padding:7px 8px;text-align:left;vertical-align:top}th{background:#eef2f8;color:#344054;font-size:12px}td{font-size:12px}code{font-family:Consolas,'D2Coding',monospace;background:#eef2f8;border-radius:4px;padding:1px 5px}
.screen{margin:22px 0;overflow:hidden}.screen-head{display:flex;align-items:center;gap:12px;background:#fbfcff;border-bottom:1px solid var(--line);padding:13px 15px}.sid{font-family:Consolas,'D2Coding',monospace;background:#172033;color:#fff;border-radius:6px;padding:5px 9px;font-weight:900}.screen-head h3{font-size:16px;margin:0}.screen-head p{margin:2px 0 0;color:var(--sub);font-size:12px}.screen-body{padding:15px}.brief-grid,.detail-grid,.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px}.brief,.detail-card{border:1px solid var(--line);border-radius:8px;background:#fcfdff;padding:11px}.brief p{margin:5px 0 0;color:#344054}.detail-card h4{font-size:13px;color:var(--blue);margin:0 0 8px}
.mock{border:2px solid #8995aa;border-radius:9px;background:#f9fbff;margin:14px 0;overflow:hidden}.mock-top{display:flex;gap:10px;align-items:center;background:#253049;color:white;padding:7px 10px}.mock-top strong{font-family:Consolas,'D2Coding',monospace}.mock-top em{margin-left:auto;color:#c2cee2;font-style:normal;font-size:11px}
.tabs{display:flex;gap:4px;margin-bottom:8px;flex-wrap:wrap}.tabs span{border:1px solid var(--line);background:#fff;border-radius:6px 6px 0 0;padding:4px 10px;font-size:11px}.tabs .active{background:var(--blue2);color:var(--blue);font-weight:800}
.form-grid{display:grid;grid-template-columns:minmax(95px,150px) 1fr;gap:5px}.form-grid label{background:#edf2f8;border:1px solid var(--line);padding:5px;color:#344054}.form-grid div{background:#fff;border:1px solid var(--line);padding:5px;min-height:27px}.form-panel{border:1px solid var(--line);background:#fff;border-radius:7px;padding:9px}.form-panel>b{display:block;color:var(--blue);margin-bottom:7px}
.mock-grid th,.mock-grid td{font-size:11px;padding:6px}.mock-grid tbody tr:nth-child(even){background:#fbfcff}.kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:10px}.kpi-row div{border:1px solid var(--line);background:#fff;border-radius:7px;padding:10px}.kpi-row span{display:block;color:var(--sub);font-size:11px}.kpi-row strong{font-size:17px}
button,.mock button{border:1px solid #8d99ae;background:#fff;border-radius:5px;padding:5px 9px;margin:3px;font-size:11px}.mock button:first-of-type{background:var(--blue);border-color:var(--blue);color:#fff}
.tenant-search{display:grid;grid-template-columns:170px 1fr 80px;gap:8px;padding:10px;background:#eef2f8;border-bottom:1px solid var(--line)}.tenant-search span,.tenant-search b{background:#fff;border:1px solid var(--line);border-radius:6px;padding:7px}.tenant-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:10px}.tenant-cards div{background:#fff;border:1px solid var(--line);border-radius:8px;padding:12px}.tenant-cards span{display:inline-block;background:var(--green2);color:var(--green);border-radius:999px;padding:2px 8px;margin:5px 0}.context-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:0 10px 10px}.context-strip span{background:#fff;border:1px solid var(--line);border-radius:7px;padding:8px;color:var(--sub)}.context-strip b{display:block;color:var(--ink)}
.org-layout,.security-layout,.matrix-layout,.catalog-layout,.notification-layout,.menu-layout,.registration-layout,.employee-layout,.partner-layout,.coa-layout,.contract-layout,.vehicle-layout,.label-layout,.conversion-layout,.carry-layout,.statement-layout,.monthly-layout,.opening-ledger-layout,.voucher-layout,.ledger-layout,.closing-layout,.tax-layout,.asset-layout,.dataops-layout,.search-layout,.bulk-layout,.bill-layout{display:grid;grid-template-columns:210px 1fr 220px;gap:10px;padding:10px}.org-tree,.org-layout aside,.security-layout aside,.matrix-layout aside,.catalog-layout aside,.notification-layout aside,.menu-layout aside,.registration-layout aside,.employee-layout aside,.partner-layout aside,.coa-layout aside,.contract-layout aside,.vehicle-layout aside,.label-layout aside,.conversion-layout aside,.carry-layout aside,.statement-layout aside,.monthly-layout aside,.opening-ledger-layout aside,.voucher-layout aside,.ledger-layout aside,.closing-layout aside,.tax-layout aside,.asset-layout aside,.dataops-layout aside,.search-layout aside,.bulk-layout aside,.bill-layout aside{border:1px solid var(--line);background:#fff;border-radius:7px;padding:9px}.org-tree ul{list-style:none;padding-left:0;line-height:1.9}.org-detail,.label-preview,.timeline{border:1px solid var(--line);background:#fff;border-radius:7px;padding:9px}
.settings-layout{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:10px}.settings-layout section{grid-column:1/-1}.setting-card{border:1px solid var(--line);background:#fff;border-radius:7px;padding:10px}.label-preview{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.label-preview div{border:1px dashed #98a2b3;background:#fff;padding:8px;min-height:58px}.label-preview span,.label-preview em{display:block;color:var(--sub);font-style:normal}
.swimlane,.pipeline{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:10px}.swimlane div,.pipeline div{border:1px solid var(--line);background:#fff;border-radius:8px;padding:10px;text-align:center}.swimlane span,.pipeline span{display:inline-block;margin-top:6px;border-radius:999px;background:var(--blue2);color:var(--blue);padding:2px 8px;font-size:11px}.infra-layout,.automation-layout,.finance-layout{padding-bottom:10px}.job-timeline{display:flex;gap:8px;padding:0 10px 10px}.job-timeline span{border:1px solid var(--line);background:#fff;border-radius:999px;padding:5px 10px}
.toolbox-layout{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:10px}.toolbox-layout>div{border:1px solid var(--line);background:#fff;border-radius:8px;padding:10px}.toolbox-layout table{grid-column:1/-1}.tax-form{display:grid;grid-template-columns:1fr 1fr;gap:6px}.tax-form div{display:grid;grid-template-columns:32px 1fr 120px;align-items:center;border:1px solid var(--line);background:#fff;border-radius:6px;padding:6px}.tax-form span{background:#253049;color:#fff;border-radius:5px;text-align:center;padding:2px}.tax-form em{font-style:normal;text-align:right;color:var(--blue)}
.timeline{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.timeline div{border-left:4px solid var(--blue);background:#f8fafc;border-radius:4px;padding:9px}.calendar{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;border:1px solid var(--line);background:#fff;border-radius:7px;padding:8px}.calendar div{min-height:62px;border:1px solid var(--line);border-radius:6px;padding:6px}.calendar b,.calendar span,.calendar em{display:block}.calendar em{color:var(--blue);font-style:normal}.job-console{border:1px solid var(--line);background:#fff;border-radius:7px;padding:10px;margin-bottom:8px}.progress{height:9px;background:#e5e7eb;border-radius:999px;overflow:hidden}.progress span{display:block;height:100%;background:var(--green)}
@media(max-width:1120px){nav{position:static;width:auto}main{margin-left:0;padding:18px}.stats,.brief-grid,.detail-grid,.two-col,.org-layout,.security-layout,.matrix-layout,.catalog-layout,.notification-layout,.menu-layout,.registration-layout,.employee-layout,.partner-layout,.coa-layout,.contract-layout,.vehicle-layout,.label-layout,.conversion-layout,.carry-layout,.statement-layout,.monthly-layout,.opening-ledger-layout,.voucher-layout,.ledger-layout,.closing-layout,.tax-layout,.asset-layout,.dataops-layout,.search-layout,.bulk-layout,.bill-layout,.settings-layout,.tenant-cards,.context-strip,.kpi-row,.swimlane,.pipeline,.calendar{grid-template-columns:1fr}}
@media print{nav{display:none}main{margin-left:0}.screen{break-inside:avoid}}
`;
}
