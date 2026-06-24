<style>
:root{
  --ink:#1c2333; --sub:#5b6478; --line:#d8dde8; --bg:#f4f6fa; --card:#ffffff;
  --accent:#2554c7; --accent-bg:#eaf0fd; --warn:#b45309; --warn-bg:#fef3c7;
  --danger:#b91c1c; --danger-bg:#fee2e2; --ok:#15803d; --ok-bg:#dcfce7;
  --muted-bg:#eef1f6; --wf-line:#7c879c; --teal:#0f766e; --teal-bg:#cdf3ee;
}
*{box-sizing:border-box}
body{margin:0;font-family:'Malgun Gothic','Apple SD Gothic Neo','Noto Sans KR',sans-serif;color:var(--ink);background:var(--bg);font-size:14px;line-height:1.65}
nav#toc{position:fixed;top:0;left:0;bottom:0;width:256px;background:#1c2333;color:#cdd5e4;overflow-y:auto;padding:18px 14px;font-size:12.5px}
nav#toc h2{font-size:14px;color:#fff;margin:0 0 4px}
nav#toc .ver{color:#8d99b2;font-size:11px;margin-bottom:14px}
nav#toc a{display:block;color:#cdd5e4;text-decoration:none;padding:3px 8px;border-radius:5px}
nav#toc a:hover{background:#2b3650;color:#fff}
nav#toc .g{margin-top:10px;font-weight:700;color:#8fa6d8;font-size:11.5px;text-transform:uppercase;letter-spacing:.04em}
nav#toc .sub{padding-left:16px;font-size:12px}
main{margin-left:256px;padding:32px 40px 80px;max-width:1200px}
.doc-header{background:linear-gradient(135deg,#1c2333,#2554c7);color:#fff;border-radius:12px;padding:28px 32px;margin-bottom:28px}
.doc-header h1{margin:0 0 6px;font-size:24px}
.doc-header p{margin:2px 0;color:#cdd9f6;font-size:13px}
section{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:26px 30px;margin-bottom:26px}
h2{font-size:19px;margin:0 0 14px;padding-bottom:10px;border-bottom:2px solid var(--accent);color:#16213e}
h3{font-size:16px;margin:26px 0 10px;color:#2554c7}
h4{font-size:14.5px;margin:24px 0 8px;padding:7px 12px;background:var(--accent-bg);border-left:4px solid var(--accent);border-radius:0 6px 6px 0}
h4 .sid{display:inline-block;background:var(--accent);color:#fff;border-radius:4px;padding:1px 8px;font-size:12px;margin-right:8px;font-family:Consolas,monospace}
table{border-collapse:collapse;width:100%;margin:10px 0 16px;font-size:12.8px}
th,td{border:1px solid var(--line);padding:6px 9px;text-align:left;vertical-align:top}
th{background:var(--muted-bg);font-size:12.3px;white-space:nowrap}
td code,p code,li code{background:var(--muted-bg);border-radius:3px;padding:0 4px;font-family:Consolas,'D2Coding',monospace;font-size:12px;color:#33415e}
.meta{font-size:12.3px}
.meta th{width:110px;background:#f0f4fc}
ul{margin:6px 0 12px;padding-left:22px}
li{margin:3px 0}
.badge{display:inline-block;border-radius:10px;padding:1px 9px;font-size:11px;font-weight:700;white-space:nowrap}
.b-blue{background:var(--accent-bg);color:var(--accent)}
.b-green{background:var(--ok-bg);color:var(--ok)}
.b-amber{background:var(--warn-bg);color:var(--warn)}
.b-red{background:var(--danger-bg);color:var(--danger)}
.b-gray{background:var(--muted-bg);color:var(--sub)}
.b-dark{background:#1c2333;color:#fff}
.b-teal{background:var(--teal-bg);color:var(--teal)}
.b-purple{background:#ede9fe;color:#6d28d9}
.note{background:var(--warn-bg);border-left:4px solid var(--warn);border-radius:0 6px 6px 0;padding:9px 14px;font-size:12.8px;margin:10px 0}
.tip{background:var(--accent-bg);border-left:4px solid var(--accent);border-radius:0 6px 6px 0;padding:9px 14px;font-size:12.8px;margin:10px 0}
/* ---------- wireframe ---------- */
.wf{border:2px solid var(--wf-line);border-radius:8px;background:#fbfcfe;margin:12px 0 16px;overflow:hidden;font-size:11.8px;color:#2a3349}
.wf-cap{background:#eef1f6;color:#5b6478;font-size:11px;padding:3px 10px;border-bottom:1px dashed var(--line)}
.wf-bar{background:#27314d;color:#fff;padding:6px 12px;display:flex;gap:10px;align-items:center}
.wf-bar .sp{flex:1}
.wf-tool{display:flex;gap:6px;align-items:center;padding:7px 10px;border-bottom:1px solid var(--line);background:#f2f5fa;flex-wrap:wrap}
.wf-body{padding:10px 12px}
.wf-split{display:flex;gap:10px;align-items:stretch}
.wf-split>div{flex:1}
.wf-panel{border:1.5px solid var(--wf-line);border-radius:6px;background:#fff;padding:8px 10px;margin:6px 0}
.wf-panel .pt{font-weight:700;font-size:11.5px;color:#27314d;border-bottom:1px solid var(--line);padding-bottom:4px;margin-bottom:6px}
.wf-btn{display:inline-block;border:1.5px solid var(--wf-line);background:#fff;border-radius:5px;padding:2px 10px;font-size:11.3px;white-space:nowrap}
.wf-btn.pri{background:#2554c7;border-color:#2554c7;color:#fff}
.wf-btn.dng{background:#b91c1c;border-color:#b91c1c;color:#fff}
.wf-in{display:inline-block;border:1px solid #aab3c5;background:#fff;border-radius:4px;padding:2px 8px;color:#8a94a8;font-size:11.3px;min-width:90px}
.wf-row{display:flex;gap:8px;align-items:center;margin:4px 0;flex-wrap:wrap}
.wf-row label{min-width:84px;color:#5b6478;font-size:11.3px}
.req{color:#b91c1c;font-weight:700}
.wf-panel.pnl{border-color:#2554c7;background:#fbfcff}
.wf-panel.pnl .pt{color:#2554c7}
.wf-grid{width:100%;border-collapse:collapse;margin:6px 0;font-size:11.3px}
.wf-grid th{background:#e6ebf4;border:1px solid #c3cbdb;padding:3px 6px;font-size:10.8px;white-space:nowrap}
.wf-grid td{border:1px solid #d5dbe7;padding:3px 6px;background:#fff;white-space:nowrap}
.wf-grid td.r,.wf-grid th.r{text-align:right}
.wf-foot{border-top:1.5px solid var(--wf-line);background:#f2f5fa;padding:6px 12px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.wf-tab{display:flex;gap:0;border-bottom:2px solid var(--wf-line);margin-bottom:8px;flex-wrap:wrap}
.wf-tab span{padding:4px 14px;border:1.5px solid var(--wf-line);border-bottom:none;border-radius:6px 6px 0 0;background:#e8edf6;margin-right:4px;font-size:11.3px}
.wf-tab span.on{background:#fff;font-weight:700;color:#2554c7}
.wf-modal{border:2px solid #2554c7;border-radius:8px;background:#fff;margin:10px 0;box-shadow:0 6px 18px rgba(28,35,51,.18)}
.wf-modal .mh{background:#2554c7;color:#fff;padding:6px 12px;font-weight:700;font-size:11.6px;border-radius:6px 6px 0 0;display:flex;align-items:center}
.wf-modal .mh .sp{flex:1}
.kbd{border:1px solid #aab3c5;border-bottom-width:2px;border-radius:4px;background:#fff;padding:0 5px;font-family:Consolas,monospace;font-size:11px}
.wf-sel{display:inline-block;border:1px solid #aab3c5;background:#fff;border-radius:4px;padding:2px 18px 2px 8px;color:#33415e;font-size:11.3px;min-width:70px;position:relative;background-image:linear-gradient(45deg,transparent 50%,#7c879c 50%),linear-gradient(135deg,#7c879c 50%,transparent 50%);background-position:calc(100% - 9px) 9px,calc(100% - 5px) 9px;background-size:4px 4px,4px 4px;background-repeat:no-repeat}
.wf-in.wide{min-width:170px}
.wf-in.full{display:block;width:100%;min-width:0}
/* ---------- crumb (entry path) ---------- */
.crumb{display:flex;align-items:center;gap:6px;flex-wrap:wrap;background:#f0f4fc;border:1px solid #d8e0f3;border-radius:6px;padding:6px 12px;margin:8px 0 10px;font-size:12.2px;color:#33415e}
.crumb b{color:#2554c7}
.crumb .sep{color:#9aa6bd}
/* ---------- business flow ---------- */
.flow{display:flex;flex-wrap:nowrap;gap:8px;align-items:stretch;margin:12px 0;overflow-x:auto;padding-bottom:6px}
.flow .step{flex:1 1 0;min-width:128px;border:1.5px solid var(--wf-line);border-radius:8px;background:#fff;padding:8px 10px;font-size:12px}
.flow .step .n{display:inline-block;background:#2554c7;color:#fff;border-radius:50%;width:18px;height:18px;text-align:center;font-size:11px;line-height:18px;margin-right:5px}
.flow .step .sc{display:block;font-family:Consolas,monospace;font-size:10.5px;color:#15803d;margin-top:4px}
.flow .step .ds{display:block;color:#5b6478;font-size:11px;margin-top:2px}
.flow .arr{display:flex;align-items:center;color:#7c879c;font-weight:700;font-size:16px;flex:0 0 auto}
.flow.mini .step{min-width:96px;padding:5px 8px;font-size:11.3px}
.flow.mini .step .n{width:16px;height:16px;line-height:16px;font-size:10px}
/* ---------- menu catalog tree ---------- */
.menu{border:1.5px solid var(--wf-line);border-radius:8px;background:#fff;padding:0;overflow:hidden;margin:10px 0}
.menu .mtop{background:#27314d;color:#fff;padding:6px 12px;font-weight:700;font-size:12px}
.menu ul{list-style:none;margin:0;padding:6px 0}
.menu li{margin:0;padding:3px 14px;font-size:12.4px;border-bottom:1px dashed #eef1f6}
.menu li.grp{font-weight:700;color:#27314d;background:#f5f7fb}
.menu li .lv2{padding-left:18px;color:#33415e;font-weight:400}
.menu .lk{color:#2554c7;font-family:Consolas,monospace;font-size:11px;background:#eaf0fd;border-radius:4px;padding:0 6px;margin-left:6px}
@media print{
  nav#toc{display:none} main{margin-left:0;max-width:none}
  section{break-inside:avoid;border:none;padding:10px 0}
  .doc-header{border-radius:0}
}
</style>
