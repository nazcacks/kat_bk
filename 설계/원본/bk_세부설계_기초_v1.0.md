# BK 회계/세무 서비스 — 기초 항목 세부설계서 v1.0

> 기준 문서: `bk_서비스_상세설계서_v_4.0.md` (이하 "상세설계서")
> 적용 범위: 시스템의 **모든 기초(마스터·기준정보) 항목** — 관리회사, 이용회사, 사용자, 관리자, 권한, 공통코드/공통표준, 차원, 인증, 접근 거버넌스, 기장 관계 설정, 구독, 알림
> 작성 원칙: 각 기초 항목의 **엔티티 → 필드(세부항목) → 값집합(세부항목의 세부항목) → 제약·규칙**을 빠짐없이 전개한다. 상태값·코드값은 부록(15장)에 통합 정의한다.

---

## 0. 문서 개요

### 0.1 목적
본 문서는 BK 서비스의 데이터 모델 중 **기초(Foundation)·기준정보(Master) 계층**을 필드 단위로 확정한다. 전표·마감·신고 등 업무 트랜잭션 설계(상세설계서 11장 계열)는 별도 세부설계서에서 다루며, 본 문서는 그 트랜잭션이 의존하는 **선행 마스터**를 정의한다.

### 0.2 기초 항목 도메인 지도

| # | 도메인 | 대표 엔티티 | 채널 | 본문 |
|---|---|---|---|---|
| 1 | 관리회사(운영조직) | `OperatorOrg`, `OperatorOrgUnit` | OP | 2장 |
| 2 | 이용회사(테넌트) | `Tenant`, `TenantInfra`, `TenantSnapshot`, `QuotaProfile` | OP/TN | 3장 |
| 3 | 기장 관계 설정 | `BookkeepingConfig`, `BookkeepingConfigHistory`, `BookkeepingModeChangeRequest` | OP/TN | 4장 |
| 4 | 사용자 | `User`, `UserCredential`, `PasswordHistory`, `MfaDevice`, `WebauthnCredential`, `SsoIdentity`, `UserSession`, `TrustedDevice`, `LoginHistory`, `AccountStatus` | CO | 5장 |
| 5 | 인증 정책 | `AuthPolicy` | OP/TN | 6장 |
| 6 | 관리자·접근 거버넌스 | `AdminAccessLog`, `AdminAccessSession`, `BreakGlassConsent`, `BreakGlassRequest`, `SessionRecording`, `PersonalDataAccessLog` | OP | 7장 |
| 7 | 권한·권한위임 | `Role`, `Permission`, `RoleAssignment`, `PolicyGuardrail`, `PolicyException`, `ApprovalRule`, `ExternalPartnerProfile`, `BookkeepingAssignment` | CO | 8장 |
| 8 | 공통코드·공통표준 | `GlobalStandard`, `StandardVersion`, `StandardItem`, `TenantStandardAdoption`, `TenantStandardExtension`, `StandardRollbackLog` | OP/TN | 9장 |
| 9 | 차원(관리항목) | `Dimension`, `BusinessPlace`, `CostCenter`, `Project`, `DimensionConfig` | TN | 10장 |
| 10 | 구독·요금 | `ServiceSubscription`, `BillingPlan`, `UsageMeter`, `Invoice`, `Payment` | OP/TN | 11장 |
| 11 | 알림 기초 | `NotificationPolicy`, `NotificationTemplate`, `NotificationSchedule`, `WebhookEndpoint` | CO | 12장 |

> 채널: OP = 운영 콘솔(관리회사), TN = 업무 화면(이용회사), CO = 공통.

### 0.3 공통 규약
- 모든 테넌트 귀속 엔티티는 `tenant_id`(NOT NULL) + RLS로 격리한다(상세설계서 2.1, 16.1). 운영 전역 엔티티(`OperatorOrg`, `GlobalStandard` 등)는 테넌트 비귀속.
- 모든 엔티티는 13장(공통 테이블 제약)의 **공통 컬럼 세트**(감사·버전·출처·멱등)를 상속한다.
- 본문 필드표의 "필수" 열: `Y` 필수, `N` 선택, `C` 조건부(조건 명시).

---

## 1. 표기 규약 · 데이터 타입

| 표기 | 의미 |
|---|---|
| `uuid` | 시스템 표면키(surrogate key), v7 권장 |
| `string(n)` | 가변 문자열, 최대 길이 n |
| `enum{...}` | 코드 값 집합(부록 15장) |
| `ts` | timestamptz (UTC 저장, 표시 KST) |
| `date` | 날짜(회계 전기일·효력일 등) |
| `jsonb` | 반정형 설정(스키마는 비고에 명시) |
| `enc` | 컬럼 암호화 대상(테넌트 DEK, 20.1) |
| `mask` | 표시 시 마스킹 대상(개인정보) |
| `FK→X` | 외래키, 대상 엔티티 X |

---

## 2. 관리회사 (운영조직) 세부설계

> 근거: 상세설계서 1장(운영/업무 채널 구분), 4장(운영자 권한), 5장(운영자 접근 거버넌스), 21장(관리회사 주도 기장).
> 관리회사는 SaaS를 운영하며 다수 이용회사를 관리·(옵션)대행 기장하는 **운영 조직**이다. 테넌트에 귀속되지 않는 전역 엔티티다.

### 2.1 `OperatorOrg` (관리회사 본체)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `name` | string(200) | Y | 관리회사명(법인명) |
| `bizRegNo` | string(20) mask | Y | 사업자등록번호 |
| `repName` | string(100) | N | 대표자명 |
| `taxAgentRegNo` | string(40) | N | 세무대리 등록번호(세무법인/회계법인) |
| `homeTaxAgentId` | string(40) enc | N | 홈택스 세무대리인 식별자(수임 등록 연계, 21.3) |
| `address` | jsonb | N | 우편번호/주소/상세 |
| `contact` | jsonb | N | 대표연락처·이메일·팩스 |
| `defaultLocale` | enum{ko,en} | Y | 기본 언어(기본 ko) |
| `defaultTimezone` | string(40) | Y | 기본 시간대(기본 Asia/Seoul) |
| `status` | enum{ACTIVE,SUSPENDED,CLOSED} | Y | 운영조직 상태 |
| `ipAllowlist` | jsonb | N | 운영 콘솔 IP 허용목록(20.3) |
| `createdAt/By` 등 | — | Y | 공통 감사 컬럼(13장) |

### 2.2 `OperatorOrgUnit` (운영 조직 부서·팀)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `operatorOrgId` | FK→OperatorOrg | Y | 소속 관리회사 |
| `parentUnitId` | FK→OperatorOrgUnit | N | 상위 조직(계층) |
| `code` | string(40) | Y | 조직 코드(관리회사 내 유일) |
| `name` | string(120) | Y | 조직명(예: 1본부, 세무1팀) |
| `type` | enum{HQ,DIVISION,TEAM} | Y | 조직 유형 |
| `managerUserId` | FK→User | N | 조직 책임자 |
| `level` | int | Y | 계층 레벨(0=최상위) |
| `sortOrder` | int | N | 표시 순서 |
| `active` | bool | Y | 사용 여부 |

- **유니크**: (`operatorOrgId`, `code`).
- **계층 무결성**: `parentUnitId`는 동일 `operatorOrgId` 내에서만, 순환 금지.

### 2.3 `OperatorTenantLink` (관리회사 ↔ 이용회사 담당 배정)

> 관리회사 운영자가 어떤 이용회사를 담당·대행하는지의 운영 관계. 기장 책임 모델(`BookkeepingConfig`, 4장)과 분리된 **운영 담당** 관계다.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `operatorOrgId` | FK→OperatorOrg | Y | 관리회사 |
| `tenantId` | FK→Tenant | Y | 담당 이용회사 |
| `ownerUnitId` | FK→OperatorOrgUnit | N | 담당 조직 |
| `accountManagerUserId` | FK→User | N | 담당 매니저(영업/운영) |
| `relationType` | enum{OPERATE_ONLY,BOOKKEEPING,TAX_AGENT} | Y | 관계 유형 |
| `startDate` | date | Y | 담당 시작 |
| `endDate` | date | N | 담당 종료 |
| `active` | bool | Y | 사용 여부 |

- **유니크**: (`operatorOrgId`, `tenantId`) 활성 1건.

---

## 3. 이용회사 (테넌트) 세부설계

> 근거: 상세설계서 2장(멀티테넌시), 12.1(테넌트 엔티티). 이용회사는 격리 단위(테넌트)이자 회계 주체다.

### 3.1 `Tenant` (이용회사 본체)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK = `tenant_id`(전역 식별자) |
| `companyName` | string(200) | Y | 회사명(법인/개인사업자) |
| `bizRegNo` | string(20) mask | Y | 사업자등록번호(대표 사업장) |
| `corpRegNo` | string(20) enc | N | 법인등록번호 |
| `bizType` | enum{CORP,INDIVIDUAL,NONPROFIT,ETC} | Y | 사업자 형태 |
| `industryCode` | string(20) | N | 업종코드(표준계정 템플릿 매핑, 9장) |
| `fiscalYearStartMonth` | int(1-12) | Y | 회계연도 시작월(기본 1) |
| `baseCurrency` | enum{KRW,USD,...} | Y | 기능통화(기본 KRW) |
| `accountingStandard` | enum{K_IFRS,K_GAAP,SME} | Y | 적용 회계기준 |
| `defaultLocale` | enum{ko,en} | Y | 기본 언어 |
| `timezone` | string(40) | Y | 시간대(기본 Asia/Seoul) |
| `onboardingStatus` | enum{INVITED,SETUP,READY,LIVE} | Y | 온보딩 단계 |
| `status` | enum{ACTIVE,SUSPENDED,GRACE,TERMINATED} | Y | 테넌트 상태(구독 연동, 11장) |
| `createdAt/By` 등 | — | Y | 공통 감사 컬럼 |

- **유니크**: `bizRegNo`(활성 테넌트 기준). 동일 사업자 재가입은 신규 `id`.

### 3.2 `TenantInfra` (테넌트 인프라·격리 설정)

> 근거: 상세설계서 2.5. 테넌트별 격리 티어·DB 라우팅·암호화 키·쿼터의 단일 진실원.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 1:1 |
| `tier` | enum{SHARED,SCHEMA,DEDICATED} | Y | 격리 티어(기본 SHARED) |
| `dbRef` | string(120) | Y | DB 인스턴스/클러스터 라우팅 참조 |
| `schemaName` | string(63) | C | SCHEMA 티어 시 스키마명 |
| `encryptionKeyId` | string(120) | Y | 테넌트 DEK 식별자(KMS, 20.1) |
| `quotaProfileId` | FK→QuotaProfile | Y | 적용 쿼터 프로파일 |
| `rlsEnforced` | bool | Y | RLS 강제 여부(SHARED 항상 Y) |
| `region` | string(40) | Y | 데이터 리전(국외이전 정책, 20.5) |
| `migrationState` | enum{STABLE,MIGRATING,VERIFYING} | Y | 티어 전환 상태(2.6) |

- **티어 의미**:
  - `SHARED`: 공유 스키마 + `tenant_id` + RLS(`tenant_id = current_setting('app.current_tenant')::uuid`). 기본값.
  - `SCHEMA`: 테넌트 전용 스키마(`schemaName`), 공유 인스턴스.
  - `DEDICATED`: 전용 DB/인스턴스(계약별 SLA·DR).
- **이중 강제**: DB RLS + ORM 글로벌 필터(16.1). 애플리케이션 `WHERE tenant_id` 단독 의존 금지.

### 3.3 `QuotaProfile` (쿼터·사용량 한도 프로파일)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `name` | string(80) | Y | 프로파일명(요금제 연동) |
| `maxUsers` | int | Y | 최대 사용자 수 |
| `maxStorageGb` | int | Y | 스토리지 한도(GB) |
| `apiRateLimit` | int | Y | 분당 API 호출 한도(13.3) |
| `maxConcurrentJobs` | int | Y | 동시 비동기 잡 한도(2.3) |
| `maxJournalRowsPerMonth` | int | N | 월 전표 라인 한도(노이지 네이버 방지) |
| `reportRetentionDays` | int | Y | 비동기 리포트 보관일 |

### 3.4 `TenantSnapshot` (테넌트 스냅샷)

> 근거: 2.4, 16. 마감/결산/신고 전, 티어 전환 전, 복구 목적의 테넌트 단위 시점 스냅샷.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 테넌트 |
| `reason` | enum{PRE_CLOSING,PRE_FILING,PRE_TIER_CHANGE,MANUAL,SCHEDULED} | Y | 생성 사유 |
| `scope` | enum{FULL,ACCOUNTING_ONLY} | Y | 범위 |
| `storageRef` | string(200) | Y | 스냅샷 저장 위치(WORM/객체스토리지) |
| `sizeBytes` | bigint | N | 크기 |
| `status` | enum{CREATING,AVAILABLE,RESTORING,EXPIRED} | Y | 상태 |
| `expiresAt` | ts | N | 만료 시각 |

### 3.5 `AsyncReportJob` (비동기 리포트 잡 — 테넌트 기초 운영)

> 대량 조회·다운로드의 비동기화(2.3, 16.2). 본 문서에서는 테넌트 운영 기초로만 정의.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 요청 테넌트 |
| `requestedBy` | FK→User | Y | 요청자 |
| `jobType` | enum{LEDGER_EXPORT,REPORT_PACKAGE,...} | Y | 잡 유형 |
| `params` | jsonb | Y | 파라미터(기간·필터) |
| `status` | enum{QUEUED,RUNNING,DONE,FAILED} | Y | 진행 상태 |
| `resultRef` | string(200) | N | 결과 파일 참조(서명·만료 링크) |
| `idempotencyKey` | string(80) | Y | 멱등키(13장) |

---

## 4. 기장 관계 설정 (관리회사 ↔ 이용회사)

> 근거: 상세설계서 21장. 테넌트별 기장 수행 주체를 계약 기반으로 선택한다. 이 설정이 권한·결재선·메뉴 구성·과금을 결정한다.

### 4.1 `BookkeepingConfig` (회사 기장 설정)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 1:1 |
| `mode` | enum{OPERATOR_LED,TENANT_LED,HYBRID} | Y | 기장 모드(기본 TENANT_LED) |
| `primaryBookkeeper` | enum{OPERATOR,TENANT} | Y | 주기장 측(모드로 유도, HYBRID만 선택) |
| `effectiveDate` | date | Y | 효력 시작일 — 마감 완료 기간 경계만 허용(21.3) |
| `contractRef` | string(120) | N | 기장 대행/세무대리 수임 계약 참조(전자계약·동의 이력) |
| `tenantInputPolicy` | enum{NONE,REQUEST_ONLY} | Y | OPERATOR_LED 시 이용회사 입력 허용 범위(기본 NONE) |
| `ackPolicyClosing` | enum{REQUIRED,NOTIFY_ONLY} | Y | 마감 확인 의무 |
| `ackPolicySettlement` | enum{REQUIRED,NOTIFY_ONLY} | Y | 결산 확인 의무 |
| `ackPolicyFiling` | enum{REQUIRED,NOTIFY_ONLY} | Y | 신고 확인 의무 |
| `filingApprovalRequired` | bool | Y | 신고 전송 전 이용회사 승인 필수(기본 Y) |
| `noticeDigest` | enum{EACH,DAILY,WEEKLY} | Y | 기장 접근 통지 방식(기본 DAILY, 5.2.1) |

- **모드별 의미**(21.1):
  - `OPERATOR_LED`: 관리회사 기장 담당자가 전표 입력·마감·결산·신고. 이용회사 입력 기본 차단.
  - `TENANT_LED`(기본): 이용회사 자체 수행, 관리회사는 운영·지원만(실무 개입은 Break-glass 예외).
  - `HYBRID`: 분담 규칙(21.6)으로 입력 주체 분리, 주기장 측이 마감·결산·신고.
- **주기장 전속 권한**: 가마감/본마감/마감해제, 결산정리분개·재무제표 확정, 세무 신고서 생성·전자신고 전송, 공시 생성·제출, 개시잔액 반영 승인. 비주기장 시도는 `NOT_PRIMARY_BOOKKEEPER`로 차단.

### 4.2 `BookkeepingConfigHistory` (설정 이력, append-only)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `effectiveFrom` | date | Y | 적용 시작 |
| `effectiveTo` | date | N | 적용 종료(null=현재) |
| `snapshot` | jsonb | Y | 당시 `BookkeepingConfig` 전체 스냅샷 |
| `changeRequestId` | FK→BookkeepingModeChangeRequest | N | 변경 근거 |

- **불변성**: 과거 기간의 책임 경계는 당시 모드 기준(append-only).

### 4.3 `BookkeepingModeChangeRequest` (모드 전환 요청·동의)

> 상태머신: `REQUESTED → COUNTERPARTY_CONSENTED → SCHEDULED → SWITCHED` (또는 `REJECTED`/`CANCELLED`).

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `requestedBy` | FK→User | Y | 요청자(영업/운영자 또는 총괄관리자) |
| `requestedByGroup` | enum{OPERATOR,TENANT} | Y | 요청 측 |
| `proposedMode` | enum{OPERATOR_LED,TENANT_LED,HYBRID} | Y | 제안 모드 |
| `proposedPrimary` | enum{OPERATOR,TENANT} | Y | 제안 주기장 |
| `proposedEffectiveDate` | date | Y | 제안 효력일(마감 완료 익월 1일만) |
| `contractRef` | string(120) | N | 계약 조건 참조 |
| `consentedBy` | FK→User | N | 상대측 동의자(Step-up 인증) |
| `consentedAt` | ts | N | 동의 시각 |
| `status` | enum{REQUESTED,COUNTERPARTY_CONSENTED,SCHEDULED,SWITCHED,REJECTED,CANCELLED} | Y | 상태 |
| `checklistResult` | jsonb | N | 전환 전 체크리스트 결과(21.3) |

- **전환 전 체크리스트**: 직전 기간 본마감 완료, 미결·미승인 전표 정리, 결재선 재구성, 기장 담당 배정(`BookkeepingAssignment` 1인+검토자 분리), HYBRID 분담 규칙 정의, 신고 수임 등록 확인.
- **소급 금지**: 효력일은 마감 완료된 회계기간의 익월 1일만 허용.

---

## 5. 사용자 세부설계

> 근거: 상세설계서 3장(인증), 3.5(인증 엔티티). 사용자는 관리회사 운영자·이용회사 사용자·외부 세무대리인을 포괄하는 공통 주체다.

### 5.1 `User` (사용자 본체)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `loginId` | string(120) | Y | 로그인 식별자(이메일 권장) |
| `email` | string(200) mask | Y | 이메일 |
| `emailVerified` | bool | Y | 이메일 검증 여부 |
| `phone` | string(40) enc mask | N | 휴대전화(SMS OTP) |
| `name` | string(100) mask | Y | 성명 |
| `userGroup` | enum{OPERATOR,TENANT,EXTERNAL_PARTNER} | Y | 행위자 그룹(권한·로그 태깅) |
| `homeTenantId` | FK→Tenant | C | TENANT 그룹 사용자의 소속 테넌트 |
| `operatorOrgId` | FK→OperatorOrg | C | OPERATOR 그룹 사용자의 소속 관리회사 |
| `locale` | enum{ko,en} | Y | 표시 언어 |
| `timezone` | string(40) | Y | 시간대 |
| `lastLoginAt` | ts | N | 마지막 로그인 |
| `createdAt/By` 등 | — | Y | 공통 감사 컬럼 |

- **유니크**: `loginId` 전역 유일.
- **그룹 제약**: `userGroup=TENANT`→`homeTenantId` 필수, `OPERATOR`→`operatorOrgId` 필수, `EXTERNAL_PARTNER`→`ExternalPartnerProfile`(8.7) 연계.

### 5.2 `AccountStatus` (계정 상태)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `userId` | FK→User | Y | 1:1 |
| `status` | enum{ACTIVE,LOCKED,SUSPENDED,DORMANT,DISABLED} | Y | 계정 상태 |
| `lockReason` | enum{FAILED_ATTEMPTS,ADMIN_LOCK,RISK,NONE} | Y | 잠금 사유 |
| `failedAttempts` | int | Y | 연속 실패 횟수 |
| `lockedUntil` | ts | N | 잠금 해제 예정 시각 |
| `dormantSince` | ts | N | 휴면 전환 시각(장기 미접속) |
| `disabledAt` | ts | N | 비활성(퇴직 등) 시각 |

- **상태 의미**: `LOCKED`(임계 실패·관리자 잠금, 자동·수동 해제), `DORMANT`(장기 미접속), `SUSPENDED`(보안 위험 보류), `DISABLED`(영구 비활성).

### 5.3 `UserCredential` (비밀번호 자격증명)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `userId` | FK→User | Y | 소유자 |
| `algo` | enum{ARGON2ID,BCRYPT} | Y | 해시 알고리즘(Argon2id 권장) |
| `hash` | string enc | Y | 비밀번호 해시(평문 미저장) |
| `salt` | string | Y | 솔트 |
| `paramsRef` | jsonb | Y | 작업계수(memory/iterations/parallelism) |
| `mustChange` | bool | Y | 다음 로그인 시 변경 강제 |
| `passwordChangedAt` | ts | Y | 최근 변경 시각 |
| `expiresAt` | ts | N | 만료 시각(정책 연동) |

- **금지**: 평문/가역 암호 저장 금지. 본 시스템은 비밀번호를 절대 화면 입력 대행하지 않는다(보안 규칙).

### 5.4 `PasswordHistory` (비밀번호 이력)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `userId` | FK→User | Y | 소유자 |
| `hash` | string enc | Y | 과거 해시 |
| `changedAt` | ts | Y | 변경 시각 |

- **재사용 금지**: 직전 N개(정책 `passwordHistoryCount`) 재사용 차단.

### 5.5 `MfaDevice` (다중인증 장치 — TOTP/SMS/EMAIL)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `userId` | FK→User | Y | 소유자 |
| `type` | enum{TOTP,SMS_OTP,EMAIL_OTP,BACKUP_CODE} | Y | 수단 유형 |
| `secret` | string enc | C | TOTP 시드(암호화) |
| `target` | string enc mask | C | SMS/EMAIL 발송 대상 |
| `label` | string(80) | N | 사용자 지정 라벨 |
| `verified` | bool | Y | 등록 검증 여부 |
| `isPrimary` | bool | Y | 기본 MFA 수단 |
| `createdAt` | ts | Y | 등록 시각 |
| `lastUsedAt` | ts | N | 최근 사용 |

- **백업코드**: `BACKUP_CODE`는 1회용 해시 집합으로 별도 보관, 사용 시 소진 표시.

### 5.6 `WebauthnCredential` (WebAuthn/패스키)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `userId` | FK→User | Y | 소유자 |
| `credentialId` | string | Y | 자격증명 ID(유니크) |
| `publicKey` | string | Y | 공개키 |
| `signCount` | bigint | Y | 서명 카운터(복제 탐지) |
| `aaguid` | string | N | 인증기 모델 식별자 |
| `transports` | jsonb | N | 전송 방식(usb/nfc/ble/internal) |
| `attestationFmt` | string(40) | N | attestation 형식 |
| `label` | string(80) | N | 라벨 |
| `createdAt` | ts | Y | 등록 시각 |

### 5.7 `SsoIdentity` (SAML/OIDC 연동 신원)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `userId` | FK→User | Y | 소유자 |
| `provider` | enum{SAML,OIDC} | Y | 프로토콜 |
| `idpId` | string(120) | Y | IdP 식별자 |
| `subject` | string(200) | Y | IdP subject(NameID/sub) |
| `tenantId` | FK→Tenant | C | 테넌트 전용 IdP 연동 시 |
| `attributesRef` | jsonb | N | 매핑 속성(부서·역할 클레임) |
| `linkedAt` | ts | Y | 연동 시각 |

- **유니크**: (`provider`, `idpId`, `subject`).

### 5.8 `UserSession` (세션)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK(세션 ID) |
| `userId` | FK→User | Y | 소유자 |
| `tenantContext` | FK→Tenant | N | 현재 테넌트 컨텍스트(`app.current_tenant`) |
| `authLevel` | enum{L1_PASSWORD,L2_MFA,L3_STEPUP} | Y | 인증 강도 |
| `deviceId` | FK→TrustedDevice | N | 연결 장치 |
| `ip` | string(45) | Y | 접속 IP |
| `userAgent` | string(300) | N | UA |
| `createdAt` | ts | Y | 시작 |
| `lastSeenAt` | ts | Y | 마지막 활동 |
| `expiresAt` | ts | Y | 만료 |
| `revokedAt` | ts | N | 강제 종료 시각 |

### 5.9 `TrustedDevice` (신뢰 장치)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `userId` | FK→User | Y | 소유자 |
| `fingerprint` | string | Y | 장치 지문 |
| `name` | string(80) | N | 장치 표시명 |
| `trustedUntil` | ts | Y | 신뢰 만료(MFA 생략 허용 기간) |
| `lastIp` | string(45) | N | 최근 IP |
| `createdAt` | ts | Y | 등록 시각 |

### 5.10 `LoginHistory` (로그인 이력, append-only)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `userId` | FK→User | C | 성공/식별 시 |
| `loginIdTried` | string(120) | Y | 시도한 로그인 ID |
| `result` | enum{SUCCESS,FAIL_PASSWORD,FAIL_MFA,LOCKED,RISK_BLOCKED} | Y | 결과 |
| `method` | enum{PASSWORD,TOTP,SMS_OTP,EMAIL_OTP,WEBAUTHN,SAML,OIDC,BACKUP_CODE} | Y | 사용 수단 |
| `ip` | string(45) | Y | IP |
| `geo` | jsonb | N | 지리정보(이상탐지) |
| `riskScore` | int | N | 적응형 인증 위험점수 |
| `at` | ts | Y | 시각 |

---

## 6. 인증 정책 (`AuthPolicy`)

> 근거: 상세설계서 3장. 전역(GLOBAL)·테넌트(TENANT) 2계층 정책. 테넌트 정책은 전역 정책의 **하한(floor)을 약화할 수 없다**.

### 6.1 `AuthPolicy`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `scope` | enum{GLOBAL,TENANT} | Y | 정책 범위 |
| `tenantId` | FK→Tenant | C | TENANT 범위 시 |
| `passwordMinLength` | int | Y | 최소 길이 |
| `passwordComplexity` | jsonb | Y | 복잡도 규칙(대/소/숫자/특수) |
| `passwordHistoryCount` | int | Y | 재사용 금지 개수 |
| `passwordMaxAgeDays` | int | N | 만료 주기 |
| `mfaRequirement` | enum{OPTIONAL,REQUIRED,RISK_BASED} | Y | MFA 요구 수준 |
| `allowedMfaTypes` | jsonb | Y | 허용 MFA 수단 목록 |
| `lockoutThreshold` | int | Y | 잠금 임계 실패 횟수 |
| `lockoutDuration` | int | Y | 잠금 시간(분) |
| `sessionIdleTimeout` | int | Y | 유휴 만료(분) |
| `sessionAbsoluteTimeout` | int | Y | 절대 만료(분) |
| `stepUpActions` | jsonb | Y | Step-up 인증 요구 행위 목록 |
| `adaptiveRules` | jsonb | N | 적응형(위치·시간·장치) 규칙 |
| `ipPolicy` | jsonb | N | IP 허용/차단 정책 |
| `ssoEnforced` | bool | N | SSO 강제(비밀번호 로그인 차단) |

- **하한 강제**: 테넌트 정책 적용 시 각 항목은 `max(전역, 테넌트)` 방향(보안 강한 값)으로 병합한다.
- **Step-up 대상 예시**: 권한 변경, 신고 전송, 대량 다운로드, 긴급대행 개시, 결제수단 변경.

---

## 7. 관리자(운영자) · 접근 거버넌스

> 근거: 상세설계서 5장(접근 거버넌스), 5.4(엔티티), 17장(개인정보 접근). 운영자가 테넌트 데이터·개인정보에 접근할 때의 **모드·동의·기록·통지** 체계.

### 7.1 접근 모드(4종)

| 모드 | 코드 | 의미 | 동의·기록 |
|---|---|---|---|
| 조회 | `VIEW` | 메타·통계·마스킹된 조회 | 로그(`AdminAccessLog`) |
| 지원 세션 | `SUPPORT_SESSION` | 사용자 동반 화면 지원 | 세션 기록 + 통지 |
| 기장 | `BOOKKEEPING` | OPERATOR_LED 계약 기반 정상 대행 입력(v3.0) | 행위자 표식 + 통지 요약 |
| 긴급 대행 | `BREAK_GLASS` | 사전 동의·사후 검토 전제 긴급 개입 | 사전 동의 + 세션 녹화 + 사후 검토 |

### 7.2 `AdminAccessSession` (운영자 접근 세션)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `operatorUserId` | FK→User | Y | 접근 운영자 |
| `tenantId` | FK→Tenant | Y | 대상 테넌트 |
| `mode` | enum{VIEW,SUPPORT_SESSION,BOOKKEEPING,BREAK_GLASS} | Y | 접근 모드 |
| `reason` | string(300) | Y | 접근 사유 |
| `assignmentId` | FK→BookkeepingAssignment | C | BOOKKEEPING 모드 시 |
| `breakGlassRequestId` | FK→BreakGlassRequest | C | BREAK_GLASS 모드 시 |
| `startedAt` | ts | Y | 시작 |
| `endedAt` | ts | N | 종료 |
| `stepUpVerified` | bool | Y | Step-up 인증 여부 |
| `recordingId` | FK→SessionRecording | N | 세션 녹화 참조 |
| `noticeState` | enum{PENDING,SENT,DIGESTED} | Y | 통지 상태 |

### 7.3 `AdminAccessLog` (운영자 접근 로그, append-only)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `sessionId` | FK→AdminAccessSession | Y | 소속 세션 |
| `tenantId` | FK→Tenant | Y | 대상 |
| `operatorUserId` | FK→User | Y | 운영자 |
| `action` | string(120) | Y | 수행 행위(엔드포인트·기능) |
| `targetRef` | string(200) | N | 대상 자원 |
| `ip` | string(45) | Y | IP |
| `at` | ts | Y | 시각 |
| `hashChainPrev` | string | Y | 해시체인 이전값(변조 방지) |

### 7.4 `PersonalDataAccessLog` (개인정보 접근 로그)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `accessorUserId` | FK→User | Y | 접근자 |
| `dataCategory` | enum{RRN,BANK,SALARY,CONTACT,OTHER} | Y | 개인정보 유형 |
| `purpose` | string(200) | Y | 처리 목적 |
| `targetSubjectRef` | string(120) | N | 정보주체 참조 |
| `at` | ts | Y | 시각 |

- **이중 기록·통지**: 운영자의 개인정보 접근은 `AdminAccessLog` + `PersonalDataAccessLog` 동시 기록 + Step-up(17장).

### 7.5 `BreakGlassConsent` (긴급대행 사전 동의)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 동의한 테넌트 |
| `consentedBy` | FK→User | Y | 동의자(총괄관리자) |
| `scope` | jsonb | Y | 허용 범위(기능·기간) |
| `validFrom/validTo` | ts | Y | 유효 기간 |
| `revokedAt` | ts | N | 철회 시각 |

### 7.6 `BreakGlassRequest` (긴급대행 요청·승인)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `requestedBy` | FK→User | Y | 요청 운영자 |
| `consentId` | FK→BreakGlassConsent | C | 사전 동의 참조 |
| `reason` | string(300) | Y | 긴급 사유 |
| `status` | enum{REQUESTED,APPROVED,ACTIVE,CLOSED,REVIEWED} | Y | 상태 |
| `approvedBy` | FK→User | N | 승인자 |
| `reviewReportRef` | string(200) | N | 사후 검토 보고 참조 |

### 7.7 `SessionRecording` (세션 녹화, WORM)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `sessionId` | FK→AdminAccessSession | Y | 대상 세션 |
| `tenantId` | FK→Tenant | Y | 대상 |
| `engine` | enum{RRWEB} | Y | 녹화 엔진 |
| `storageRef` | string(200) | Y | WORM 저장 위치 |
| `hash` | string | Y | 무결성 해시 |
| `durationSec` | int | N | 길이 |
| `retentionUntil` | ts | Y | 보관 만료 |

---

## 8. 권한 · 권한위임

> 근거: 상세설계서 4장. Role = 메뉴권한 + 행위권한 + 데이터범위 + 민감정보권한. 가드레일·예외·결재선·외부 파트너·기장 배정 포함.

### 8.1 `Permission` (행위/메뉴 권한 원자)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `code` | string(80) | Y | 권한 코드(유니크, 예: `journal.post`) |
| `category` | enum{MENU,ACTION,DATA_SCOPE,SENSITIVE} | Y | 권한 분류 |
| `module` | string(40) | Y | 소속 모듈 |
| `description` | string(200) | N | 설명 |
| `riskLevel` | enum{LOW,MEDIUM,HIGH} | Y | 위험도(Step-up 연계) |

### 8.2 `Role` (역할)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | C | 테넌트 전용 역할(null=전역/표준) |
| `code` | string(80) | Y | 역할 코드 |
| `name` | string(120) | Y | 역할명 |
| `scopeType` | enum{OPERATOR,TENANT,EXTERNAL} | Y | 적용 대상 그룹 |
| `menuPermissions` | jsonb | Y | 메뉴 권한 집합 |
| `actionPermissions` | jsonb | Y | 행위 권한 집합 |
| `dataScope` | jsonb | Y | 데이터 범위(차원·사업장·조직 한정) |
| `sensitivePermissions` | jsonb | Y | 민감정보 열람 권한 |
| `standardRef` | FK→StandardItem | N | 표준 Role 템플릿(STD_ROLE) 출처 |
| `isSystem` | bool | Y | 시스템 기본 역할 여부 |

- **표준 BK 역할**(4.5): `BK_PREPARER`(작성), `BK_REVIEWER`(검토·승인), `BK_MANAGER`(기장 관리·배정). SOD: 작성자≠검토자 강제.

### 8.3 `RoleAssignment` (역할 부여)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `userId` | FK→User | Y | 대상 사용자 |
| `roleId` | FK→Role | Y | 부여 역할 |
| `tenantId` | FK→Tenant | C | 테넌트 컨텍스트 |
| `scopeConstraint` | jsonb | N | 부여 시 추가 데이터범위 제약(사업장·조직) |
| `validFrom/validTo` | ts | N | 유효 기간 |
| `grantedBy` | FK→User | Y | 부여자 |
| `status` | enum{ACTIVE,SUSPENDED,EXPIRED} | Y | 상태 |

- **유니크**: (`userId`, `roleId`, `tenantId`) 활성 1건.

### 8.4 `PolicyGuardrail` (정책 가드레일)

> 어떤 권한 조합·행위가 절대 허용/금지되는지의 상위 제약. 역할·예외보다 우선한다.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `scope` | enum{GLOBAL,TENANT} | Y | 범위 |
| `tenantId` | FK→Tenant | C | TENANT 시 |
| `ruleType` | enum{FORBID,REQUIRE_SOD,REQUIRE_STEPUP,REQUIRE_APPROVAL} | Y | 규칙 유형 |
| `target` | jsonb | Y | 적용 대상(권한·행위·역할 조합) |
| `enforcement` | enum{BLOCK,WARN} | Y | 강제 수준 |
| `description` | string(200) | N | 설명 |

### 8.5 `PolicyException` (정책 예외)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `guardrailId` | FK→PolicyGuardrail | Y | 예외 대상 규칙 |
| `userId` | FK→User | N | 예외 적용 사용자 |
| `reason` | string(300) | Y | 예외 사유 |
| `approvedBy` | FK→User | Y | 승인자 |
| `validFrom/validTo` | ts | Y | 유효 기간 |
| `status` | enum{ACTIVE,EXPIRED,REVOKED} | Y | 상태 |

### 8.6 `ApprovalRule` (결재선 규칙)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `docType` | enum{JOURNAL,CLOSING,FILING,DISCLOSURE,...} | Y | 결재 대상 문서 유형 |
| `conditions` | jsonb | Y | 적용 조건(금액·계정·차원) |
| `steps` | jsonb | Y | 결재 단계(순서·결재자 역할·병렬/순차) |
| `sodEnforced` | bool | Y | 작성자≠결재자 강제 |
| `standardRef` | FK→StandardItem | N | 표준 결재선 템플릿(STD_APPROVAL) |
| `active` | bool | Y | 사용 여부 |

### 8.7 `ExternalPartnerProfile` (외부 세무대리인 프로파일)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `userId` | FK→User | Y | 파트너 사용자(EXTERNAL_PARTNER) |
| `tenantId` | FK→Tenant | Y | 수임 대상 테넌트 |
| `partnerOrgName` | string(200) | Y | 세무법인/회계법인명 |
| `taxAgentRegNo` | string(40) | N | 세무대리 등록번호 |
| `engagementScope` | jsonb | Y | 수임 범위(신고·기장 등) |
| `ipAllowlist` | jsonb | N | 파트너 IP 대역(20.3) |
| `otpApprovalRequired` | bool | Y | 민감 행위 OTP 승인 필요 |
| `validFrom/validTo` | date | Y | 수임 기간 |
| `status` | enum{ACTIVE,SUSPENDED,ENDED} | Y | 상태 |

### 8.8 `BookkeepingAssignment` (기장 담당 배정)

> OPERATOR_LED/HYBRID에서 관리회사 기장 담당자를 테넌트에 배정. 행위자 표식의 근거.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 테넌트 |
| `operatorUserId` | FK→User | Y | 기장 담당 운영자 |
| `role` | enum{BK_PREPARER,BK_REVIEWER,BK_MANAGER} | Y | 기장 역할 |
| `scope` | jsonb | N | 담당 범위(모듈·사업장) |
| `validFrom/validTo` | date | Y | 배정 기간 |
| `status` | enum{ACTIVE,SUSPENDED,ENDED} | Y | 상태 |

- **SOD 강제**: 동일 테넌트에서 동일인이 `BK_PREPARER`와 `BK_REVIEWER`를 동시 보유 금지. 전환 시 검토자 분리 배정 필수(21.3).

### 8.9 행위자 표식 (Actor Stamp) — 거래 귀속 메타
모든 전표·마감 등 행위 데이터에 다음을 스탬프한다(권한위임 추적):

| 필드 | 값 | 설명 |
|---|---|---|
| `createdByGroup` | `OPERATOR`/`TENANT` | 작성 주체 그룹 |
| `bookkeepingMode` | `OPERATOR_LED`/`TENANT_LED`/`HYBRID` | 당시 기장 모드 |
| `assignmentId` | FK→BookkeepingAssignment | 대행 배정 근거(OPERATOR 시) |
| `breakGlassSessionId` | FK→AdminAccessSession | 긴급대행 근거(해당 시) |

---

## 9. 공통코드 · 공통표준 카탈로그

> 근거: 상세설계서 6장. 세율·서식·계정·코드 등을 관리회사가 **버전 관리되는 공통 표준**으로 배포하고, 이용회사가 채택·확장한다. 소스 상수 금지(16.1).

### 9.1 표준 유형 카탈로그 (`STD_*`)

| 표준 | 코드 | 설명 |
|---|---|---|
| 표준계정 템플릿 | `STD_ACCOUNT` | 업종별 표준 계정체계 |
| 부가세 세율/과세유형 | `STD_VAT` | 세율표, 과세유형 매핑 |
| 세법 룰 마스터 | `STD_TAX_RULE` | 과세표준 구간·비과세 한도 + 적용 시작/종료일 |
| 원천세 기준 | `STD_WITHHOLDING` | 간이세액표, 소득구분별 원천세율·지방소득세율 |
| 신고서식 | `STD_FORM` | 부가세/법인세/원천세 전자신고 서식 버전 |
| 공통코드 | `STD_CODE` | 결제수단/거래유형 등 코드셋 |
| Role 템플릿 | `STD_ROLE` | 표준 권한 묶음 |
| 결재선 템플릿 | `STD_APPROVAL` | 표준 결재 규칙 |
| 현금흐름 매핑 | `STD_CASHFLOW` | 계정/거래유형→활동 표준 매핑 |
| XBRL 분류체계 | `STD_TAXONOMY` | 공시 taxonomy 버전 |
| 기준 변환규칙 | `STD_CONVERSION` | 회계기준쌍별 변환·조정 규칙 |
| 이상탐지 규칙 | `STD_ANOMALY_RULE` | 탐지 규칙·임계치 표준 |
| 알림 템플릿 | `STD_NOTIFICATION` | 알림 유형·채널별 표준 템플릿 |
| 보고패키지 템플릿 | `STD_REPORT_PACKAGE` | 월별 결산 보고패키지 목차·구성요소·언어 |
| 명세서 템플릿 | `STD_SCHEDULE` | 계정별 명세서 유형·movement 컬럼 표준 |
| 그룹 보고 매핑 | `STD_GROUP_MAPPING` | 로컬 계정↔그룹(HFM/Weblink) 매핑 |
| 다국어 계정명 | `STD_ACCOUNT_L10N` | 계정/보조계정 언어별 명칭 |
| 제조원가 템플릿 | `STD_COSTING` | 원가요소·배부기준·재고평가 정책 |
| 매입원장 세무상태 | `STD_PURCHASE_TAX_STATUS` | 매입 세무구분·사유·전송상태·증빙상태 코드 |

### 9.2 `GlobalStandard` (전역 표준 정의)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `type` | enum{STD_ACCOUNT,STD_VAT,...} | Y | 표준 유형 |
| `code` | string(80) | Y | 표준 식별 코드 |
| `name` | string(160) | Y | 표준명 |
| `description` | string(300) | N | 설명 |
| `owner` | string(80) | N | 소관(세무팀 등) |
| `deployMode` | enum{MANDATORY,RECOMMENDED,OPTIONAL} | Y | 배포 모드 |
| `industryScope` | jsonb | N | 적용 업종 범위 |

- **배포 모드**: `MANDATORY`(전 테넌트 강제 반영), `RECOMMENDED`(권고·알림), `OPTIONAL`(선택 채택).

### 9.3 `StandardVersion` (표준 버전 — 생명주기)

> 상태머신: `DRAFT → PUBLISHED → DEPRECATED → RETIRED`.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `standardId` | FK→GlobalStandard | Y | 소속 표준 |
| `versionNo` | string(40) | Y | 버전(예: 2026.1) |
| `status` | enum{DRAFT,PUBLISHED,DEPRECATED,RETIRED} | Y | 생명주기 상태 |
| `effectiveFrom` | date | Y | 적용 시작일(세법 시점 바인딩) |
| `effectiveTo` | date | N | 적용 종료일 |
| `publishedAt` | ts | N | 배포 시각 |
| `publishedBy` | FK→User | N | 배포자 |
| `changeNote` | string(500) | N | 변경 요약 |
| `rollbackOfVersionId` | FK→StandardVersion | N | 롤백 대상 버전 |

### 9.4 `StandardItem` (표준 항목 — 실제 값)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `versionId` | FK→StandardVersion | Y | 소속 버전 |
| `itemKey` | string(120) | Y | 항목 키(계정코드·세율코드 등) |
| `payload` | jsonb | Y | 항목 값(유형별 스키마) |
| `parentItemKey` | string(120) | N | 계층 항목(계정 트리 등) |
| `sortOrder` | int | N | 표시 순서 |
| `active` | bool | Y | 사용 여부 |

- **유니크**: (`versionId`, `itemKey`).

### 9.5 `TenantStandardAdoption` (테넌트 채택)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 채택 테넌트 |
| `standardId` | FK→GlobalStandard | Y | 표준 |
| `adoptedVersionId` | FK→StandardVersion | Y | 채택 버전 |
| `adoptionState` | enum{PENDING,ADOPTED,OVERRIDDEN,ROLLED_BACK} | Y | 채택 상태 |
| `adoptedAt` | ts | N | 채택 시각 |
| `autoUpgrade` | bool | Y | 신버전 자동 반영 여부 |

### 9.6 `TenantStandardExtension` (테넌트 확장)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `standardId` | FK→GlobalStandard | Y | 확장 대상 표준 |
| `itemKey` | string(120) | Y | 확장/재정의 항목 키 |
| `payload` | jsonb | Y | 테넌트 고유 값(계정 추가·명칭 변경 등) |
| `overrideType` | enum{ADD,OVERRIDE,DISABLE} | Y | 확장 유형 |
| `active` | bool | Y | 사용 여부 |

- **제약**: `MANDATORY` 표준 항목은 `DISABLE` 불가, `OVERRIDE`는 가드레일 범위 내에서만.

### 9.7 `StandardRollbackLog` (롤백 이력, append-only)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `standardId` | FK→GlobalStandard | Y | 대상 |
| `fromVersionId` | FK→StandardVersion | Y | 이전 버전 |
| `toVersionId` | FK→StandardVersion | Y | 롤백 적용 버전 |
| `scope` | enum{GLOBAL,TENANT} | Y | 범위 |
| `tenantId` | FK→Tenant | C | TENANT 범위 시 |
| `reason` | string(300) | Y | 사유 |
| `executedBy` | FK→User | Y | 실행자 |
| `at` | ts | Y | 시각 |

---

## 10. 차원 (관리항목) 세부설계

> 근거: 상세설계서 9장(차원 엔진). 사업장(법적·부가세 단위)·코스트센터(관리)·프로젝트·현장 등. 차원은 전표 라인에 부여되는 분석 축이다.

### 10.1 차원 유형

| 유형 | 코드 | 성격 | 비고 |
|---|---|---|---|
| 사업장 | `BUSINESS_PLACE` | 법적·부가세 신고 단위 | 사업자등록번호 단위 |
| 코스트센터 | `COST_CENTER` | 관리·예산 단위 | 부서 매핑 |
| 프로젝트 | `PROJECT` | 수익·원가 집계 단위 | 기간성 |
| 현장 | `SITE` | 물리적 현장 | 건설·제조 |

### 10.2 `Dimension` (차원 정의)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `type` | enum{BUSINESS_PLACE,COST_CENTER,PROJECT,SITE} | Y | 차원 유형 |
| `code` | string(40) | Y | 차원 코드 |
| `name` | string(120) | Y | 명칭 |
| `parentId` | FK→Dimension | N | 상위(계층) |
| `level` | int | Y | 계층 레벨 |
| `active` | bool | Y | 사용 여부 |

- **유니크**: (`tenantId`, `type`, `code`).

### 10.3 `BusinessPlace` (사업장)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `dimensionId` | FK→Dimension | Y | 차원 연계(type=BUSINESS_PLACE) |
| `bizRegNo` | string(20) mask | Y | 사업장 사업자등록번호 |
| `name` | string(160) | Y | 사업장명 |
| `taxOfficeCode` | string(20) | N | 관할 세무서 |
| `vatUnit` | bool | Y | 부가세 신고 단위 여부 |
| `address` | jsonb | N | 주소 |
| `isHeadOffice` | bool | Y | 본점 여부 |
| `active` | bool | Y | 사용 여부 |

### 10.4 `CostCenter` (코스트센터)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `dimensionId` | FK→Dimension | Y | 차원 연계(type=COST_CENTER) |
| `code` | string(40) | Y | 코스트센터 코드 |
| `name` | string(120) | Y | 명칭 |
| `deptMapping` | jsonb | N | 부서 매핑 |
| `defaultBusinessPlaceId` | FK→BusinessPlace | N | 유도 규칙: 사업장 자동기입 근거(16.2) |
| `budgetEnabled` | bool | Y | 예산 관리 여부 |
| `active` | bool | Y | 사용 여부 |

### 10.5 `Project` (프로젝트)

> 수익·원가를 기간성 단위로 집계하는 차원(type=PROJECT). 수주·공사·연구개발·캠페인 등 한시적 활동의 손익을 추적한다.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `dimensionId` | FK→Dimension | Y | 차원 연계(type=PROJECT) |
| `code` | string(40) | Y | 프로젝트 코드 |
| `name` | string(160) | Y | 프로젝트명 |
| `parentProjectId` | FK→Project | N | 상위 프로젝트(WBS 계층) |
| `projectType` | enum{CONTRACT,RND,INTERNAL,CAMPAIGN,ETC} | Y | 프로젝트 유형 |
| `customerRef` | string(120) | N | 발주처·고객 거래처 참조 |
| `managerUserId` | FK→User | N | 프로젝트 책임자(PM) |
| `defaultCostCenterId` | FK→CostCenter | N | 유도 규칙: 코스트센터 기본값 근거(16.2) |
| `startDate` | date | Y | 착수일 |
| `endDate` | date | N | 종료일(완료 시 설정) |
| `budgetAmount` | numeric | N | 프로젝트 예산(예산 관리 시) |
| `budgetEnabled` | bool | Y | 예산·소진 관리 여부 |
| `status` | enum{PLANNED,ACTIVE,ON_HOLD,CLOSED} | Y | 진행 상태 |
| `active` | bool | Y | 사용 여부 |

- **유니크**: (`tenantId`, `code`).
- **기간 무결성**: `endDate ≥ startDate`. `status=CLOSED`이거나 `endDate` 경과 시 신규 전표 라인 차원 선택 차단(경고).
- **유도 규칙(16.2)**: `DimensionConfig.defaultBy`가 `PROJECT` 연계일 때 프로젝트 선택 시 `defaultCostCenterId`로 코스트센터 자동기입.

### 10.6 `Site` (현장)

> 물리적 작업·관리 현장 차원(type=SITE). 건설·제조·물류 등 장소 단위로 비용·자산을 집계한다. 회계상 신고 단위인 사업장(`BusinessPlace`)과 구분되는 **관리 목적 위치**다.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `dimensionId` | FK→Dimension | Y | 차원 연계(type=SITE) |
| `code` | string(40) | Y | 현장 코드 |
| `name` | string(160) | Y | 현장명 |
| `parentSiteId` | FK→Site | N | 상위 현장(구역 계층) |
| `siteType` | enum{CONSTRUCTION,PLANT,WAREHOUSE,STORE,OFFICE,ETC} | Y | 현장 유형 |
| `businessPlaceId` | FK→BusinessPlace | N | 귀속 사업장(신고 단위 매핑) |
| `relatedProjectId` | FK→Project | N | 연관 프로젝트(공사 현장 등) |
| `address` | jsonb | N | 현장 주소·좌표 |
| `managerUserId` | FK→User | N | 현장 책임자 |
| `operationStartDate` | date | N | 가동·개설일 |
| `operationEndDate` | date | N | 종료·철수일 |
| `status` | enum{PLANNED,OPERATING,SUSPENDED,CLOSED} | Y | 운영 상태 |
| `active` | bool | Y | 사용 여부 |

- **유니크**: (`tenantId`, `code`).
- **사업장 매핑**: `businessPlaceId`가 설정되면 부가세·신고 집계 시 해당 사업장으로 귀속. 현장은 사업장의 하위 관리 축이며 신고 단위가 아니다.
- **계층 무결성**: `parentSiteId`는 동일 테넌트 내, 순환 금지.

### 10.7 `DimensionConfig` (차원 사용 정책)

> 차원별 사용 여부·필수·범위·기본값·유효 조합을 테넌트별로 제어. 화면 필터·컬럼 노출과 `DIMENSION_REQUIRED` 차단 규칙의 근거.

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `dimensionType` | enum{BUSINESS_PLACE,COST_CENTER,PROJECT,SITE} | Y | 대상 차원 |
| `enabled` | bool | Y | 사용 여부 |
| `required` | bool | Y | 입력 필수 여부 |
| `scope` | jsonb | Y | 적용 범위(계정·전표유형별) |
| `defaultBy` | enum{NONE,COST_CENTER,USER_DEFAULT,ACCOUNT} | Y | 기본값 유도 규칙 |
| `validCombinations` | jsonb | N | 유효 조합 제약(사업장×코스트센터 등) |
| `hierarchyLevel` | int | N | 적용 계층 깊이 |
| `deptMapping` | jsonb | N | 부서-차원 매핑 |
| `budgetEnabled` | bool | N | 예산 연동 |

- **유도 규칙(16.2)**: `defaultBy=COST_CENTER`이면 코스트센터 선택 시 `CostCenter.defaultBusinessPlaceId`로 사업장 셀 실시간 자동기입.
- **필수 차단**: `required=true` 위반 시 전표 저장에서 `DIMENSION_REQUIRED` 예외.

---

## 11. 구독 · 요금 기초

> 근거: 상세설계서 7장. 구독 상태머신 `TRIAL → ACTIVE → PAST_DUE → SUSPENDED → GRACE → TERMINATED (+REACTIVATED)`.

### 11.1 `ServiceSubscription` (구독)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `planId` | FK→BillingPlan | Y | 요금제 |
| `status` | enum{TRIAL,ACTIVE,PAST_DUE,SUSPENDED,GRACE,TERMINATED,REACTIVATED} | Y | 구독 상태 |
| `trialEndsAt` | ts | N | 체험 종료 |
| `startedAt` | ts | Y | 시작 |
| `renewalDate` | date | N | 갱신일 |
| `terminatedAt` | ts | N | 해지 시각 |
| `graceUntil` | ts | N | 유예 만료(데이터 보존·인계) |
| `dataRetentionUntil` | ts | N | 데이터 보유 만료(파기 예정, 7.3) |

### 11.2 `BillingPlan` (요금제)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `code` | string(40) | Y | 요금제 코드 |
| `name` | string(120) | Y | 요금제명 |
| `tier` | enum{SHARED,SCHEMA,DEDICATED} | Y | 연계 인프라 티어 |
| `quotaProfileId` | FK→QuotaProfile | Y | 쿼터 프로파일 |
| `billingCycle` | enum{MONTHLY,ANNUAL} | Y | 청구 주기 |
| `basePrice` | numeric | Y | 기본료 |
| `meteredItems` | jsonb | N | 종량 항목(사용자·전표 건수 등) |
| `active` | bool | Y | 판매 여부 |

### 11.3 `UsageMeter` (사용량 계측)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `metricKey` | enum{USERS,STORAGE_GB,JOURNAL_ROWS,API_CALLS,...} | Y | 계측 항목 |
| `period` | string(7) | Y | 정산 기간(YYYY-MM) |
| `quantity` | numeric | Y | 사용량 |
| `recordedAt` | ts | Y | 집계 시각 |

### 11.4 `Invoice` / `Payment` (청구·결제 — 기초)

| 엔티티 | 핵심 필드 | 비고 |
|---|---|---|
| `Invoice` | `id`, `tenantId`, `period`, `amount`, `status{ISSUED,PAID,OVERDUE,VOID}`, `dueDate` | 청구서 |
| `Payment` | `id`, `tenantId`, `invoiceId`, `method`, `amount`, `status{PENDING,SUCCESS,FAILED,REFUNDED}`, `paidAt` | 결제 결과 |
| `DunningCase` | `id`, `tenantId`, `invoiceId`, `stage{REMINDER,WARNING,SUSPEND}`, `status` | 미납 독촉(7장) |

> **보안 규칙**: 본 시스템은 결제수단(카드·계좌번호) 평문 입력을 대행하지 않는다. 결제수단 등록·변경은 사용자가 직접 수행하며, 토큰/PG 참조만 저장한다.

---

## 12. 알림 기초

> 근거: 상세설계서 18장. 단일 알림 엔진의 기초 마스터(정책·템플릿·스케줄·웹훅). 발송 이력(`NotificationLog`)은 트랜잭션 계열로 별도.

### 12.1 채널
포털(인앱, 필수) / 이메일(공식 통지, 필수) / SMS·카카오 알림톡(긴급·기한) / 웹훅(HMAC 서명).

### 12.2 `NotificationPolicy` (수신 설정)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | C | 회사 단위 정책 |
| `userId` | FK→User | C | 사용자 단위 정책 |
| `notificationType` | string(80) | Y | 알림 유형 |
| `channelMatrix` | jsonb | Y | 유형×채널 수신 설정 |
| `mandatoryLocked` | bool | Y | 법적·보안 통지 수신 거부 불가 여부 |

- **수신 거부 불가**: 관리자 접근·긴급대행·파기 예정·구독 종료 통지는 채널 변경만 허용.

### 12.3 `NotificationTemplate` (템플릿)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `type` | string(80) | Y | 알림 유형 |
| `channel` | enum{PORTAL,EMAIL,SMS,KAKAO,WEBHOOK} | Y | 채널 |
| `locale` | enum{ko,en} | Y | 언어 |
| `subject` | string(200) | N | 제목 |
| `body` | text | Y | 본문(변수 바인딩, 민감정보 미포함) |
| `standardRef` | FK→StandardItem | N | 표준 템플릿(STD_NOTIFICATION) 출처 |

### 12.4 `NotificationSchedule` (D-N 기한 규칙)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | C | 대상 |
| `eventType` | enum{VAT_FILING,WHT_FILING,CORP_TAX,CERT_EXPIRY,NOTE_MATURITY,...} | Y | 이벤트 유형 |
| `offsetDays` | int | Y | D-N(음수=사전) |
| `taxRuleVersionRef` | FK→StandardVersion | N | 세법 룰 버전 연동(6장) |
| `active` | bool | Y | 사용 여부 |

### 12.5 `WebhookEndpoint` (웹훅 연동)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `id` | uuid | Y | PK |
| `tenantId` | FK→Tenant | Y | 대상 |
| `url` | string(300) | Y | 수신 URL |
| `secret` | string enc | Y | HMAC 서명 시크릿 |
| `events` | jsonb | Y | 구독 이벤트 목록 |
| `status` | enum{ACTIVE,DISABLED,FAILED} | Y | 상태 |

---

## 13. 공통 테이블 제약 · 감사 · 상태 표준

> 근거: 상세설계서 12.3. 모든 엔티티가 상속하는 공통 규약.

### 13.1 공통 컬럼 세트

| 컬럼 | 타입 | 적용 | 설명 |
|---|---|---|---|
| `id` | uuid | 전체 | 표면키(업무키와 분리) |
| `tenant_id` | uuid | 테넌트 귀속 | NOT NULL + RLS |
| `created_at` | ts | 전체 | 생성 시각 |
| `created_by` | uuid | 전체 | 생성자 |
| `updated_at` | ts | 전체 | 수정 시각 |
| `updated_by` | uuid | 전체 | 수정자 |
| `version` | int | 변경 대상 | 낙관적 잠금 |
| `source` | enum{UI,API,BATCH,MIGRATION,SYNC} | 전체 | 데이터 출처 |
| `created_by_group` | enum{OPERATOR,TENANT} | 행위 데이터 | 행위자 표식(8.9) |

### 13.2 제약 규칙
- **유니크 업무키**: (`tenant_id`, 업무키) 형태로 테넌트 내 유일성 보장.
- **상태 머신**: 상태 컬럼은 정의된 전이만 허용(애플리케이션·트리거 강제).
- **이력/append-only**: `*History`, `*Log` 테이블은 갱신·삭제 금지(해시체인 적용 대상 명시).
- **멱등**: 외부 연계·중요 쓰기 진입점은 `idempotency_key` + `request_hash` 보유.
- **물리 삭제 금지**: 회계 데이터는 상태값·역분개로 처리, 원본 보존(16.1).
- **암호화**: 개인정보·시크릿 컬럼(`enc`)은 테넌트 DEK 적용(20.1), 표시 시 마스킹(`mask`).
- **파티셔닝**: 대량 로그·전표 계열은 기간·테넌트 파티셔닝 대상.

### 13.3 데이터 변경이력 (`DataChangeLog`)
모든 CUD는 인터셉터/트리거에서 누가·언제·IP·전후값·사유·트랜잭션ID·행위자(그룹/긴급대행 세션)를 append-only + 해시체인으로 기록(16.1, 17장).

---

## 14. 기초 데이터 의존 순서 (구축·온보딩)

기초 마스터는 다음 순서로 적재해야 무결성이 보장된다.

```
1. OperatorOrg / OperatorOrgUnit          (관리회사·조직)
2. GlobalStandard / StandardVersion/Item  (공통표준 배포)
3. Tenant / TenantInfra / QuotaProfile    (이용회사 생성·격리)
4. BillingPlan → ServiceSubscription      (구독 활성)
5. BookkeepingConfig                      (기장 관계 확정)
6. User / Credential / MfaDevice          (사용자·인증)
7. Permission → Role → RoleAssignment     (권한)
8. TenantStandardAdoption/Extension       (표준 채택·확장)
9. Dimension / BusinessPlace / CostCenter / Project / Site / DimensionConfig (차원)
10. ApprovalRule / BookkeepingAssignment  (결재선·기장 배정)
11. NotificationPolicy/Template/Schedule  (알림)
→ 이후 전표·마감·신고 트랜잭션 개시
```

---

## 15. 부록 — 코드 값 집합 (Enum Master)

| 도메인 | 코드셋 | 값 |
|---|---|---|
| 행위자 그룹 | userGroup | OPERATOR, TENANT, EXTERNAL_PARTNER |
| 격리 티어 | tier | SHARED(기본), SCHEMA, DEDICATED |
| 기장 모드 | mode | TENANT_LED(기본), OPERATOR_LED, HYBRID |
| 주기장 | primaryBookkeeper | OPERATOR, TENANT |
| 접근 모드 | accessMode | VIEW, SUPPORT_SESSION, BOOKKEEPING, BREAK_GLASS |
| 인증 수단 | authMethod | PASSWORD, TOTP, SMS_OTP, EMAIL_OTP, WEBAUTHN, BACKUP_CODE, SAML, OIDC |
| 인증 강도 | authLevel | L1_PASSWORD, L2_MFA, L3_STEPUP |
| 계정 상태 | accountStatus | ACTIVE, LOCKED, SUSPENDED, DORMANT, DISABLED |
| MFA 요구 | mfaRequirement | OPTIONAL, REQUIRED, RISK_BASED |
| 권한 분류 | permissionCategory | MENU, ACTION, DATA_SCOPE, SENSITIVE |
| BK 역할 | bkRole | BK_PREPARER, BK_REVIEWER, BK_MANAGER |
| 가드레일 유형 | guardrailType | FORBID, REQUIRE_SOD, REQUIRE_STEPUP, REQUIRE_APPROVAL |
| 표준 생명주기 | stdStatus | DRAFT, PUBLISHED, DEPRECATED, RETIRED |
| 배포 모드 | deployMode | MANDATORY, RECOMMENDED, OPTIONAL |
| 채택 상태 | adoptionState | PENDING, ADOPTED, OVERRIDDEN, ROLLED_BACK |
| 표준 유형 | stdType | STD_ACCOUNT, STD_VAT, STD_TAX_RULE, STD_WITHHOLDING, STD_FORM, STD_CODE, STD_ROLE, STD_APPROVAL, STD_CASHFLOW, STD_TAXONOMY, STD_CONVERSION, STD_ANOMALY_RULE, STD_NOTIFICATION, STD_REPORT_PACKAGE, STD_SCHEDULE, STD_GROUP_MAPPING, STD_ACCOUNT_L10N, STD_COSTING, STD_PURCHASE_TAX_STATUS |
| 차원 유형 | dimensionType | BUSINESS_PLACE, COST_CENTER, PROJECT, SITE |
| 구독 상태 | subscriptionStatus | TRIAL, ACTIVE, PAST_DUE, SUSPENDED, GRACE, TERMINATED, REACTIVATED |
| 모드전환 상태 | modeChangeStatus | REQUESTED, COUNTERPARTY_CONSENTED, SCHEDULED, SWITCHED, REJECTED, CANCELLED |
| 알림 채널 | notifyChannel | PORTAL, EMAIL, SMS, KAKAO, WEBHOOK |
| 데이터 출처 | source | UI, API, BATCH, MIGRATION, SYNC |

---

> **연계 문서**: 화면 설계는 `구현_화면설계_v1.0.html`, 구현 일정은 `서비스_구현계획_v1.0.md`, 전체 아키텍처는 `bk_서비스_상세설계서_v_4.0.md`(본 문서의 기준)를 참조한다.
