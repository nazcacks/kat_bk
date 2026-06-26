<#
  build_graph.ps1 — BK 설계 지식그래프 빌더 (현재 기준 범위)
  ---------------------------------------------------------------
  범위(SCOPE): 현재 기준 설계서 + 최신 화면설계만 그래프화한다.
    - 설계서: bk_설계서_v3.0.md
    - 화면설계: bk_화면설계서_v3.0.html, 구현_화면_기초_v3.0.html,
                구현_화면_전표_v3.4.html, 구현_매입매출_전표_v1.0.html,
                v3.1\페이즈1~5_*.html

  산출물(같은 폴더):
    - nodes.jsonl   : 노드 1줄=1개 (diff·grep 친화)
    - edges.jsonl   : 엣지 1줄=1개
    - graph.json    : {nodes, edges, meta} 통합본
    - graph-data.js  : window.GRAPH = {...}  (view.html 전용, file:// 직접 열람용)

  노드 타입:  Chapter(설계서 장) · Screen(설계 화면ID SA-/JV-/AUX-) ·
              Impl(구현 화면ID W..-NN) · Doc(화면설계 파일)
  엣지 타입:  DEFINES(장→화면)  REFERENCES(장·문서→화면/장)
              IMPLEMENTS(문서→장)  CONTAINS(문서→구현화면)  MAPS_TO(구현→설계화면)

  실행:  powershell -ExecutionPolicy Bypass -File 설계\_graph\build_graph.ps1
#>

$ErrorActionPreference = 'Stop'
$root    = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)  # ...\설계
$graphDir = Join-Path $root '_graph'

# ---- 범위 파일 목록 (현재 기준) -------------------------------------------
$designDoc = Join-Path $root 'bk_설계서_v3.0.md'
$screenDocs = @(
  'bk_화면설계서_v3.0.html',
  '구현_화면_기초_v3.0.html',
  '구현_화면_전표_v3.4.html',
  '구현_매입매출_전표_v1.0.html',
  'v3.1\페이즈1_플랫폼운영기초_상세화면구성_v3.1.html',
  'v3.1\페이즈2_개시이월전표증빙_상세화면구성_v3.1.html',
  'v3.1\페이즈3_장부자금예산_상세화면구성_v3.1.html',
  'v3.1\페이즈4_결산공시외화_상세화면구성_v3.1.html',
  'v3.1\페이즈5_세무고정자산AI_상세화면구성_v3.1.html'
) | ForEach-Object { Join-Path (Join-Path $root '화면설계') $_ }

# ---- 정규식 -----------------------------------------------------------------
$reHeading = '^(#{1,6})\s+(\d+(?:\.\d+)*)\.?\s+(.*)$'   # 설계서 장 헤딩
$reScreen  = 'SA-[A-Z]{2,4}-\d{2}|JV-\d{2}|AUX-\d{2}'   # 설계 화면 ID
$reImpl    = 'W[A-Z]{2,3}-\d{2}'                         # 구현 화면 ID (WPV-01 등)
$reCiteSec = '§\s?(\d+(?:\.\d+)+)'                       # §25.4.2
$reCiteParen = '\((\d{2}\.\d+(?:\.\d+)?)\)'              # (25.4.2)

# ---- 누적 컬렉션 ------------------------------------------------------------
$nodes = @{}   # id -> node
$edges = New-Object System.Collections.Generic.List[object]
$edgeSeen = @{}

function Add-Node($id,$type,$label,$attrs){
  if(-not $nodes.ContainsKey($id)){
    $nodes[$id] = [ordered]@{ id=$id; type=$type; label=$label; attrs=$attrs }
  }
}
function Add-Edge($from,$to,$type,$src){
  $k = "$from|$type|$to"
  if($edgeSeen.ContainsKey($k)){ return }
  $edgeSeen[$k] = $true
  $edges.Add([ordered]@{ from=$from; to=$to; type=$type; src=$src }) | Out-Null
}

# ===== 1) 설계서 파싱 ========================================================
if(-not (Test-Path -LiteralPath $designDoc)){ throw "설계서 없음: $designDoc" }
$docName = Split-Path $designDoc -Leaf
$lines = Get-Content -LiteralPath $designDoc -Encoding UTF8
$curCh = $null
foreach($ln in $lines){
  $m = [regex]::Match($ln, $reHeading)
  if($m.Success){
    $num = $m.Groups[2].Value
    $title = ($m.Groups[3].Value -replace '`','').Trim()
    $chId = "CH:$num"
    Add-Node $chId 'Chapter' "§$num $title" ([ordered]@{ num=$num; doc=$docName })
    $curCh = $chId
    # 헤딩 안에 화면ID가 있으면 그 장이 화면을 정의(DEFINES)
    foreach($sm in [regex]::Matches($ln,$reScreen)){
      $sid = "SCR:$($sm.Value)"
      Add-Node $sid 'Screen' $sm.Value ([ordered]@{})
      Add-Edge $chId $sid 'DEFINES' $docName
    }
    continue
  }
  # 본문의 화면ID 멘션 -> 현재 장이 화면을 참조(REFERENCES)
  if($curCh){
    foreach($sm in [regex]::Matches($ln,$reScreen)){
      $sid = "SCR:$($sm.Value)"
      Add-Node $sid 'Screen' $sm.Value ([ordered]@{})
      Add-Edge $curCh $sid 'REFERENCES' $docName
    }
  }
}

# ===== 2) 화면설계(HTML) 파싱 ================================================
foreach($f in $screenDocs){
  if(-not (Test-Path -LiteralPath $f)){ Write-Warning "건너뜀(없음): $f"; continue }
  $name = Split-Path $f -Leaf
  $docId = "DOC:$name"
  Add-Node $docId 'Doc' $name ([ordered]@{ path=($f -replace [regex]::Escape($root+'\'),'') })
  $text = Get-Content -LiteralPath $f -Raw -Encoding UTF8

  # 설계서 장 인용 -> 문서가 장을 구현(IMPLEMENTS).
  #   §25.4.2 · §20 · §19·14 · §20.3·20.4 형식 모두 처리(단일레벨 + ·,~ 구분 복합)
  foreach($cm in [regex]::Matches($text,'§\s?([0-9][0-9.·,~\s]*)')){
    foreach($tok in ($cm.Groups[1].Value -split '[·,~\s]+')){
      if($tok -match '^\d+(\.\d+)*$'){
        $chId="CH:$tok"
        if(-not $nodes.ContainsKey($chId)){ Add-Node $chId 'Chapter' "§$tok (인용)" ([ordered]@{ num=$tok; doc='(미해결)' }) }
        Add-Edge $docId $chId 'IMPLEMENTS' $name
      }
    }
  }
  foreach($cm in [regex]::Matches($text,$reCiteParen)){
    $num=$cm.Groups[1].Value; $chId="CH:$num"
    if(-not $nodes.ContainsKey($chId)){ Add-Node $chId 'Chapter' "§$num (인용)" ([ordered]@{ num=$num; doc='(미해결)' }) }
    Add-Edge $docId $chId 'IMPLEMENTS' $name
  }
  # 설계 화면ID -> 문서가 화면을 참조(REFERENCES)
  foreach($sm in [regex]::Matches($text,$reScreen)){
    $sid="SCR:$($sm.Value)"; Add-Node $sid 'Screen' $sm.Value ([ordered]@{})
    Add-Edge $docId $sid 'REFERENCES' $name
  }
  # 구현 화면ID -> 문서가 구현화면을 포함(CONTAINS)
  foreach($im in [regex]::Matches($text,$reImpl)){
    $iid="IMPL:$($im.Value)"; Add-Node $iid 'Impl' $im.Value ([ordered]@{})
    Add-Edge $docId $iid 'CONTAINS' $name
  }
  # 같은 줄에서 구현ID ↔ 설계ID -> MAPS_TO (오탐 감소: 카테시안 곱이 아니라 줄 안 '최근접' 1쌍만)
  foreach($row in ($text -split "`n")){
    $impHits = @([regex]::Matches($row,$reImpl))
    $scrHits = @([regex]::Matches($row,$reScreen))
    if($impHits.Count -gt 0 -and $scrHits.Count -gt 0){
      foreach($ih in $impHits){
        $best=$null; $bestD=[int]::MaxValue
        foreach($sh in $scrHits){ $d=[math]::Abs($sh.Index-$ih.Index); if($d -lt $bestD){ $bestD=$d; $best=$sh } }
        if($best){ Add-Edge "IMPL:$($ih.Value)" "SCR:$($best.Value)" 'MAPS_TO' $name }
      }
    }
  }
}

# ===== 2.5) 추론: 문서가 화면ID로 장을 간접 구현 ==============================
#   Doc -REFERENCES-> Screen <-DEFINES- Chapter  ⇒  Doc -IMPLEMENTS-> Chapter (추론)
#   (§ 인용이 없어도 화면ID 언급만으로 정의 장을 연결해 갭/영향분석 누락을 줄인다)
$defByScr = @{}    # screen -> 정의 장 목록
foreach($e in $edges){ if($e.type -eq 'DEFINES'){ if(-not $defByScr.ContainsKey($e.to)){ $defByScr[$e.to]=@() }; $defByScr[$e.to]+=$e.from } }
$docRefScr = @{}   # 문서 -> 참조 화면 목록
foreach($e in $edges){ if($e.type -eq 'REFERENCES' -and $e.from -like 'DOC:*'){ if(-not $docRefScr.ContainsKey($e.from)){ $docRefScr[$e.from]=@() }; $docRefScr[$e.from]+=$e.to } }
foreach($doc in @($docRefScr.Keys)){
  foreach($scr in ($docRefScr[$doc] | Select-Object -Unique)){
    if($defByScr.ContainsKey($scr)){
      foreach($ch in ($defByScr[$scr] | Select-Object -Unique)){
        Add-Edge $doc $ch 'IMPLEMENTS' '(추론: 화면ID 경유)'
      }
    }
  }
}

# ===== 3) 산출물 출력 ========================================================
$nodeArr = $nodes.Values | Sort-Object { $_.id }
$edgeArr = $edges | Sort-Object { "$($_.from)|$($_.type)|$($_.to)" }

function Write-Utf8($path,$content){ [System.IO.File]::WriteAllText($path,$content,(New-Object System.Text.UTF8Encoding($false))) }

# nodes.jsonl / edges.jsonl
$nl = ($nodeArr | ForEach-Object { $_ | ConvertTo-Json -Compress -Depth 6 }) -join "`n"
$el = ($edgeArr | ForEach-Object { $_ | ConvertTo-Json -Compress -Depth 6 }) -join "`n"
Write-Utf8 (Join-Path $graphDir 'nodes.jsonl') $nl
Write-Utf8 (Join-Path $graphDir 'edges.jsonl') $el

# graph.json
$meta = [ordered]@{
  generatedAt = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
  scope       = '현재 기준: bk_설계서_v3.0.md + 최신 화면설계(9)'
  designDoc   = (Split-Path $designDoc -Leaf)
  screenDocs  = ($screenDocs | ForEach-Object { Split-Path $_ -Leaf })
  counts      = [ordered]@{
    nodes=$nodeArr.Count; edges=$edgeArr.Count
    chapters=($nodeArr|?{$_.type-eq'Chapter'}).Count
    screens=($nodeArr|?{$_.type-eq'Screen'}).Count
    impl=($nodeArr|?{$_.type-eq'Impl'}).Count
    docs=($nodeArr|?{$_.type-eq'Doc'}).Count
  }
}
$graph = [ordered]@{ meta=$meta; nodes=$nodeArr; edges=$edgeArr }
$json = $graph | ConvertTo-Json -Depth 8
Write-Utf8 (Join-Path $graphDir 'graph.json') $json
Write-Utf8 (Join-Path $graphDir 'graph-data.js') ("window.GRAPH = " + $json + ";")

# 요약 출력
"== BK 설계 지식그래프 빌드 완료 =="
"노드: $($nodeArr.Count)  (장 $($meta.counts.chapters) / 화면 $($meta.counts.screens) / 구현 $($meta.counts.impl) / 문서 $($meta.counts.docs))"
"엣지: $($edgeArr.Count)"
"산출물: nodes.jsonl, edges.jsonl, graph.json, graph-data.js  (→ $graphDir)"
