# BK 설계 지식그래프 조회·유지

`설계/_graph/`의 지식그래프로 설계-구현 추적성, 영향분석, 갭 탐지를 수행한다. 그래프는 **현재 기준 범위**만 담는다: 최신 `bk_설계서_v*.md`(2026-06-27 기준 `bk_설계서_v3.1.md`) + 최신 화면설계 9종(`bk_화면설계서_v3.0.html`, `구현_화면_기초_v3.0.html`, `구현_화면_전표_v3.4.html`, `구현_매입매출_전표_v1.0.html`, `v3.1\페이즈1~5`).

## 산출물

| 파일 | 용도 |
|---|---|
| `build_graph.ps1` | 빌더. 범위 파일을 스캔해 노드·엣지 추출 (UTF-8 BOM 필수) |
| `nodes.jsonl` / `edges.jsonl` | 1줄=1객체. diff·`rg` 조회 친화 |
| `graph.json` | `{meta,nodes,edges}` 통합본 (스크립트 조회용) |
| `graph-data.js` | `window.GRAPH=…` (뷰어 전용, file:// 직접 열람) |
| `view.html` | 검색·관계·영향분석·Mermaid 시각화 뷰어. 브라우저로 열기 |
| `mermaid.min.js` | 로컬 번들 Mermaid 라이브러리(오프라인 동작용). `view.html`이 같은 폴더에서 로드 |

## 스키마

**노드 타입**: `Chapter`(설계서 장 `CH:25.4.2`) · `Screen`(설계 화면ID `SCR:SA-JNL-02`) · `Impl`(구현 화면ID `IMPL:WPV-01`) · `Doc`(화면설계 파일 `DOC:…html`)

**엣지 타입**:
- `DEFINES` 장→화면 (헤딩에서 화면ID를 정의)
- `REFERENCES` 장·문서→화면/장 (본문에서 언급)
- `IMPLEMENTS` 문서→장 (`§25.4.2`·`(25.4.2)` 인용)
- `CONTAINS` 문서→구현화면
- `MAPS_TO` 구현화면→설계화면 (같은 줄 동시 등장)

## 재빌드

설계서나 화면설계를 수정한 뒤 항상 재생성한다.

```powershell
powershell -ExecutionPolicy Bypass -File 설계\_graph\build_graph.ps1
```

빌더를 편집했다면 한글 주석이 깨지지 않는지 실행으로 확인한다. 빌더는 최신 `bk_설계서_v*.md`를 자동 선택하고, 범위 화면이 바뀌면 `build_graph.ps1` 상단의 `$screenDocs`를 갱신한다.

## 조회 레시피 (PowerShell)

```powershell
$g = Get-Content -Raw -Encoding UTF8 설계\_graph\graph.json | ConvertFrom-Json

# 1) 영향분석 — 이 장을 바꾸면 영향받는 문서/장 (역방향)
$g.edges | ? { $_.to -eq 'CH:25.4.2' } | % { "$($_.from) -[$($_.type)]-> $($_.to)" }

# 2) 추적성 — 한 화면의 근거 장
$g.edges | ? { $_.to -eq 'SCR:SA-JNL-02' -and $_.type -eq 'DEFINES' }

# 2-1) 매입매출전표 구현 화면(WPV-01)과 설계화면(SA-JNL-02) 매핑
$g.edges | ? { $_.from -eq 'IMPL:WPV-01' -or $_.to -eq 'SCR:SA-JNL-02' }

# 3) 갭: 정의(DEFINES) 장이 없는 화면
$def = ($g.edges | ? type -eq DEFINES | % { $_.to }) | Select -Unique
$g.nodes | ? { $_.type -eq 'Screen' -and $_.id -notin $def } | % id

# 4) 갭: 어떤 문서도 구현(IMPLEMENTS)하지 않는 장
$impl = ($g.edges | ? type -eq IMPLEMENTS | % { $_.to }) | Select -Unique
$g.nodes | ? { $_.type -eq 'Chapter' -and $_.id -notin $impl } | % id

# 5) 구현↔설계 매핑 전체
$g.edges | ? type -eq MAPS_TO | % { "$($_.from) -> $($_.to)  ($($_.src))" }
```

`rg`로 빠르게 볼 때는 `nodes.jsonl`/`edges.jsonl`을 직접 grep한다.

## 한계 (현재 v1 추출 규칙)

- `MAPS_TO`는 **같은 줄 동시 등장** 휴리스틱이라 오탐이 있다(예: 한 문장에서 비교용으로 다른 화면ID를 언급하면 매핑으로 잡힘). `src` 필드로 출처 줄을 확인해 판단한다.
- 화면ID 범위 표기(`SA-LDG-01~29`)는 좌측 끝(`SA-LDG-01`)만 노드화한다.
- 인용 표기는 `§N.N…`·`(NN.N…)`만 IMPLEMENTS로 잡는다. 다른 인용 형식은 누락될 수 있다.
- 그래프는 **범위 내 자료의 명시적 언급**만 반영한다. 의미적 연계(설계 의도)는 사람이 보완한다.

## 변경 전파와의 관계

`change-propagation.md`의 산출물 전파 판정을 시작할 때, 먼저 그래프에서 변경 시작 노드의 역방향 도달 집합(영향 문서·장)을 뽑아 후보 산출물을 좁힌다. 그래프는 후보 식별용이고, 최종 전파 판정과 실제 수정은 `change-propagation.md` 절차를 따른다.
