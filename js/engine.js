/* 체스 빙의록 — 뼈대(플레이어).
   장(카세트)은 chapters/chN/ 에 있고, 각 장은 G.register({...}) 로 자기 자신을 등록합니다.
   뼈대는 장면 전환·대사·빙의 연출·체스판·관전·장 갈아 끼우기를 맡습니다. */
(function(){
const G = window.G = {};
const $ = G.$ = id=>document.getElementById(id);
const reduce = G.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = G.NS = 'http://www.w3.org/2000/svg';

/* ---------- 말 그림 ---------- */
const PIECE_DIR='assets/pieces/';
const IMG = G.IMG = {};
['pawn','bishop','knight','rook','queen','king'].forEach(t=>{ IMG['w'+t]=PIECE_DIR+'w'+t+'.svg'; IMG['b'+t]=PIECE_DIR+'b'+t+'.svg'; });
['welephant','belephant','wferz','bferz'].forEach(t=>IMG['alf_'+t]=PIECE_DIR+'alf_'+t+'.gif');
const PIMG={K:'king',F:'ferz',E:'elephant',N:'knight',R:'rook',P:'pawn',Q:'queen',B:'bishop'};
// 차투랑가·샤트란지의 코끼리(E)와 대신(F)은 Alfaerie 그림, 나머지는 Cburnett
G.img=(c,t)=>(t==='F'||t==='E')?IMG['alf_'+c+PIMG[t]]:IMG[c+PIMG[t]];

/* ---------- 규칙 (차투랑가/샤트란지 계열) ---------- */
const R = G.rules = {};
const on=R.on=(r,f)=>r>=0&&r<8&&f>=0&&f<8;
const KD=R.KD=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]], DG=R.DG=[[1,1],[1,-1],[-1,1],[-1,-1]],
      ND=R.ND=[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]], RD=R.RD=[[1,0],[-1,0],[0,1],[0,-1]];
R.attacked=function(b,s,by){ const r=s>>3,f=s&7,is=(rr,ff,ts)=>{ if(!on(rr,ff))return false; const q=b[rr*8+ff]; return q&&q[0]===by&&ts.includes(q[1]); };
  for(const d of KD) if(is(r+d[0],f+d[1],'K')) return true;
  for(const d of DG){ if(is(r+d[0],f+d[1],'F')||is(r+2*d[0],f+2*d[1],'E')) return true; }
  for(const d of ND) if(is(r+d[0],f+d[1],'N')) return true;
  const pd=by==='w'?-1:1; if(is(r+pd,f-1,'P')||is(r+pd,f+1,'P')) return true;
  for(const d of RD){ for(let k=1;k<8;k++){ const rr=r+d[0]*k,ff=f+d[1]*k; if(!on(rr,ff))break; const q=b[rr*8+ff]; if(q){ if(q[0]===by&&q[1]==='R') return true; break; } } }
  return false; };
R.kingSq=(b,c)=>b.indexOf(c+'K');
R.pseudo=function(b,c){ const out=[];
  b.forEach((p,s)=>{ if(!p||p[0]!==c) return; const r=s>>3,f=s&7,t=p[1];
    const add=(rr,ff)=>{ if(on(rr,ff)){ const q=b[rr*8+ff]; if(!q||q[0]!==c) out.push([s,rr*8+ff]); } };
    if(t==='K') KD.forEach(d=>add(r+d[0],f+d[1]));
    else if(t==='F') DG.forEach(d=>add(r+d[0],f+d[1]));
    else if(t==='E') DG.forEach(d=>add(r+2*d[0],f+2*d[1]));
    else if(t==='N') ND.forEach(d=>add(r+d[0],f+d[1]));
    else if(t==='R') RD.forEach(d=>{ for(let k=1;k<8;k++){ const rr=r+d[0]*k,ff=f+d[1]*k; if(!on(rr,ff))break; const q=b[rr*8+ff]; if(!q) out.push([s,rr*8+ff]); else { if(q[0]!==c) out.push([s,rr*8+ff]); break; } } });
    else if(t==='P'){ const dr=c==='w'?1:-1; if(on(r+dr,f)&&!b[(r+dr)*8+f]) out.push([s,(r+dr)*8+f]); [-1,1].forEach(df=>{ if(on(r+dr,f+df)){ const q=b[(r+dr)*8+f+df]; if(q&&q[0]!==c) out.push([s,(r+dr)*8+f+df]); } }); }
  }); return out; };
R.isPromo=(p,to)=>p[1]==='P'&&((p[0]==='w'&&to>>3===7)||(p[0]==='b'&&to>>3===0));
R.make=function(b,[fr,to]){ const nb=b.slice(), p=nb[fr]; nb[to]=R.isPromo(p,to)?p[0]+'F':p; nb[fr]=null; return nb; };
R.legal=function(b,c){ const o=c==='w'?'b':'w'; return R.pseudo(b,c).filter(m=>{ const nb=R.make(b,m); return !R.attacked(nb,R.kingSq(nb,c),o); }); };
R.startBoard=function(){ const b=Array(64).fill(null), back=['R','N','E','K','F','E','N','R'];
  for(let f=0;f<8;f++){ b[f]='w'+back[f]; b[8+f]='wP'; b[48+f]='bP'; b[56+f]='b'+back[f]; } return b; };
// 기보(수 목록)를 판 상태 목록으로 미리 계산. 말마다 id가 있어 칸 사이를 미끄러지듯 움직입니다.
R.buildFrames=function(game,start){
  const FR=[]; let b=(start||R.startBoard()).slice(); let ids=b.map((p,i)=>p?i:null);
  FR.push({b:b.slice(),ids:ids.slice(),move:null});
  game.forEach(([fr,to],i)=>{ const p=b[fr], cap=b[to], promo=R.isPromo(p,to), capId=cap?ids[to]:null;
    b[to]=promo?p[0]+'F':p; b[fr]=null; ids[to]=ids[fr]; ids[fr]=null;
    const side=p[0]==='w'?'b':'w'; const check=R.attacked(b,R.kingSq(b,side),p[0]);
    FR.push({b:b.slice(),ids:ids.slice(),move:{fr,to,p,cap,capId,promo,check,i}}); });
  return FR; };
G.SQ=s=>'abcdefgh'[s&7]+((s>>3)+1);
// 받침에 따라 조사 고르기: josa('루흐','이','가') → '루흐가'
G.josa=(w,a,b)=>{ const c=w.charCodeAt(w.length-1)-0xAC00; return (c>=0&&c<11172&&c%28)?a:b; };

/* ---------- 체스판 보기 ---------- */
const B = G.board = { labels:{NAME:{},side:{w:'흰 편 ',b:'검은 편 '}}, onCell:null, soulPic:null };
let cellsEl, piecesEl, pcEls={};
const pos=s=>`translate(${(s&7)*100}%,${(7-(s>>3))*100}%)`;
B.clear=function(){ piecesEl.innerHTML=''; pcEls={}; };
B.draw=function(b,ids,m,animate,meId){
  const live=new Set();
  ids.forEach((id,s)=>{ if(id===null) return; live.add(id);
    let el=pcEls[id]; const p=b[s];
    if(!el){ el=document.createElement('div'); el.className='pc'; el.innerHTML='<img alt="">'; piecesEl.appendChild(el); pcEls[id]=el; }
    if(!animate) el.style.transition='none';
    el.classList.remove('dead','lift','leap');
    el.style.transform=pos(s); el.querySelector('img').src=G.img(p[0],p[1]);
    el.classList.toggle('me',id===meId);
    el.setAttribute('aria-label',B.labels.side[p[0]]+(B.labels.NAME[p[1]]||p[1])+' '+G.SQ(s));
    if(!animate){ void el.offsetWidth; el.style.transition=''; } });
  for(const id in pcEls){ if(!live.has(+id)){ const el=pcEls[id];
      if(animate&&m&&m.capId===+id){ setTimeout(()=>{ el.classList.add('dead'); burst(m.to); if(+id===meId&&B.soulPic) soul(m.to); },300); }
      else { el.remove(); delete pcEls[id]; } } }
  if(animate&&m){ const el=pcEls[ids[m.to]]; if(el){ void el.offsetWidth; el.classList.add(m.p[1]==='E'||m.p[1]==='N'?'leap':'lift'); } }
  cellsEl.querySelectorAll('.cell').forEach(c=>{ const s=+c.dataset.s; c.classList.toggle('last',!!m&&(s===m.fr||s===m.to)); c.classList.remove('check','sel','dot','cap','reach'); });
  if(m&&m.check){ const ks=R.kingSq(b,m.p[0]==='w'?'b':'w'); const c=B.cell(ks); void c.offsetWidth; c.classList.add('check'); }
};
B.cell=s=>cellsEl.querySelector(`[data-s="${s}"]`);
B.cells=()=>cellsEl.querySelectorAll('.cell');
function burst(s){ if(reduce) return; const b=document.createElement('div'); b.className='burst'; b.style.transform=pos(s);
  for(let i=0;i<10;i++){ const d=document.createElement('i'); const a=Math.random()*Math.PI*2, r=20+Math.random()*30; d.style.setProperty('--x',Math.cos(a)*r+'px'); d.style.setProperty('--y',Math.sin(a)*r+'px'); b.appendChild(d); }
  piecesEl.appendChild(b); setTimeout(()=>b.remove(),700); setTimeout(()=>{ for(const id in pcEls){ if(pcEls[id].classList.contains('dead')){ pcEls[id].remove(); delete pcEls[id]; } } },500); }
function soul(s){ if(reduce) return; const d=document.createElement('div'); d.className='soul'; d.style.transform=pos(s); d.innerHTML=`<img alt="" src="${B.soulPic}">`; piecesEl.appendChild(d); setTimeout(()=>d.remove(),2300); }
G.banner=function(t,cls,stay){ const b=$('banner'); b.className='banner'; if(!t) return; b.textContent=t; void b.offsetWidth; b.classList.add(stay?'stay':'show'); if(cls) b.classList.add(cls); };
G.match=function(onoff){ G.stage.classList.toggle('match',!!onoff); };

/* ---------- 장면 + 대사 ---------- */
G.art=name=>document.querySelectorAll('.art').forEach(a=>a.classList.toggle('show',a.id==='art-'+name));
let typing=null;
G.typeHTML=function(el,html){
  if(typing){ clearInterval(typing.t); typing=null; }
  el.innerHTML=html; if(reduce) return;
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT); const nodes=[]; while(walker.nextNode()) nodes.push([walker.currentNode,walker.currentNode.textContent]);
  nodes.forEach(([n])=>n.textContent='');
  let ni=0,ci=0;
  typing={t:setInterval(()=>{ for(let k=0;k<2;k++){ if(ni>=nodes.length){ clearInterval(typing.t); typing=null; return; } const [n,full]=nodes[ni]; n.textContent=full.slice(0,++ci); if(ci>=full.length){ ni++; ci=0; } } },22),
          finish:()=>{ nodes.forEach(([n,full])=>n.textContent=full); } };
};
G.say=html=>G.typeHTML($('text'),html);   // 대사 칸 글만 바꾸기
G.setChoices=function(list){ const c=$('choices'); c.innerHTML='';
  (list||[]).forEach(ch=>{ const b=document.createElement('button'); b.type='button'; b.className='btn'+(ch.primary?' primary':''); b.innerHTML=ch.label+(ch.sub?`<small>${ch.sub}</small>`:''); b.addEventListener('click',ch.go); c.appendChild(b); }); };
G.scene=function(o){
  if(o.who) $('who').textContent=o.who;
  if(o.place) $('place').textContent=o.place;
  if(o.art) G.art(o.art);
  G.say(o.html);
  $('extra').innerHTML='';
  G.setChoices(o.choices);
  if(o.after) o.after();
};
// 빙의 연출. small:true 면 작은 말 그림(1장의 gif)을 작게 보여 줍니다.
G.possessFx=function(pic,then,opt){
  G.setChoices([]);
  const p=$('possess'); $('possessImg').src=pic; p.classList.toggle('small',!!(opt&&opt.small));
  p.classList.remove('run'); void p.offsetWidth; p.classList.add('run');
  later(then, reduce?50:1300);
};
// 시간 미끄러짐 연출 (연도 숫자가 떠오름)
G.slipFx=function(year,then){
  G.setChoices([]);
  const s=$('slip'), y=$('year'); y.textContent=year;
  [s,y].forEach(e=>{ e.classList.remove('run'); void e.offsetWidth; e.classList.add('run'); });
  later(then, reduce?50:1500);
};
// 장이 바뀌면 남은 예약 동작을 모두 취소하기 위해 타이머를 모아 둡니다.
const timers=new Set();
const later=G.later=function(fn,ms){ const t=setTimeout(()=>{ timers.delete(t); fn(); },ms); timers.add(t); return t; };
G.every=function(fn,ms){ const t=setInterval(fn,ms); timers.add(t); return t; };
function clearTimers(){ timers.forEach(t=>{ clearTimeout(t); clearInterval(t); }); timers.clear(); }

/* ---------- 여러 장에 걸쳐 모으는 것 ---------- */
G.state={items:[]};
G.gain=function(key,label,pic){ if(G.state.items.find(i=>i.key===key)) return; G.state.items.push({key,label,pic}); updateBag(); };
function updateBag(){ $('bag').textContent=G.state.items.length?('모은 것 '+G.state.items.length+'개'):''; }
G.resetItems=function(filter){ G.state.items=filter?G.state.items.filter(filter):[]; updateBag(); };

/* ---------- 관전 (기보 자동 재생 + 해설) ----------
   G.watch({frames, notes, autoNote, meId, startText, who(k,kind), check, mate, plainMs, noteMs, stops, onEnd, ask, onGo})
   ask(i, cont): 수 i를 두기 직전에 불림. true를 돌려주면 재생을 멈추고, 장이 준비되면 cont(앞에 붙일 html)로 그 수를 두고 기다림.
   onGo(): 관전 칸을 옮길 때마다 불림 (ask가 띄운 표시 지우기 등). */
let W=null;
G.watch=function(o){
  stopWatch();
  W=Object.assign({plainMs:1300,noteMs:3200,stops:new Set(),check:'장 군',mate:'외 통',endDelay:1600},o,{FR:0,playing:false,timer:null,endT:null,speed:1,asked:new Set()});
  B.clear(); drawW(0,false);
  $('choices').innerHTML='';
  $('extra').innerHTML=`<div class="controls">
    <button class="ctl" id="cPrev" type="button" aria-label="한 수 뒤로">◀</button>
    <button class="ctl" id="cPlay" type="button" aria-label="재생 또는 일시정지">❚❚</button>
    <button class="ctl" id="cNext" type="button" aria-label="한 수 앞으로">▶</button>
    <div class="progress"><i id="cBar"></i></div><span class="count" id="cCount"></span>
    <button class="ctl" id="cSpeed" type="button">보통</button></div>`;
  $('cPrev').onclick=()=>{ pauseW(); $('choices').innerHTML=''; goW(W.FR-1,false); };
  $('cNext').onclick=()=>{ pauseW(); $('choices').innerHTML=''; goW(W.FR+1,true); };
  $('cPlay').onclick=()=>{ W.playing?pauseW():playW(); };
  const SPEEDS=[[0.6,'느리게'],[1,'보통'],[1.8,'빠르게']];
  $('cSpeed').onclick=()=>{ const i=(SPEEDS.findIndex(s=>s[0]===W.speed)+1)%SPEEDS.length; W.speed=SPEEDS[i][0]; $('cSpeed').textContent=SPEEDS[i][1]; };
  G.say(`<p>${W.startText}</p>`); if(W.who) $('who').textContent=W.who(0,'narr');
  updW(); playW();
};
function drawW(k,animate){ const F=W.frames[k]; B.draw(F.b,F.ids,F.move,animate,W.meId); }
function updW(){ const bar=$('cBar'); if(!bar||!W) return; const N=W.frames.length-1; bar.style.width=(W.FR/N*100)+'%'; $('cCount').textContent=W.FR+' / '+N+'수'; $('cPlay').textContent=W.playing?'❚❚':'▶︎'; $('cPlay').classList.remove('wait'); }
function playW(){ if(W.FR>=W.frames.length-1) return; $('choices').innerHTML=''; W.playing=true; updW(); tickW(); }
function pauseW(){ if(!W) return; W.playing=false; clearTimeout(W.timer); updW(); }
function tickW(){ if(!W.playing) return; if(W.FR>=W.frames.length-1){ pauseW(); return; }
  const nx=W.frames[W.FR+1].move;
  if(W.ask && !W.asked.has(nx.i)){ W.asked.add(nx.i); const w=W;
    if(W.ask(nx.i, pre=>{ if(W!==w) return; goW(W.FR+1,true,pre); if(W.FR<W.frames.length-1) waitW(); })){ pauseW(); return; } }
  goW(W.FR+1,true); const m=W.frames[W.FR].move;
  if(W.stops.has(m.i) && W.FR<W.frames.length-1){ pauseW(); waitW(); return; }
  W.timer=setTimeout(tickW,(W.notes[m.i]?W.noteMs:W.plainMs)/W.speed); }
function waitW(){ const b=$('cPlay'); if(b){ b.textContent='계속 ▶'; b.classList.add('wait'); }
  G.setChoices([{label:'계속 보기',primary:true,go:()=>{ G.setChoices([]); playW(); }}]); }
function goW(k,animate,pre){
  if(k<0||k>=W.frames.length) return; clearTimeout(W.endT); if(W.onGo) W.onGo(); W.FR=k; drawW(k,animate&&!reduce); updW();
  const m=W.frames[k].move;
  if(!m){ G.say(`<p>${W.startText}</p>`); if(W.who) $('who').textContent=W.who(0,'narr'); return; }
  const [kind,html]=W.notes[m.i]||W.autoNote(m);
  if(W.who) $('who').textContent=W.who(k,kind);
  G.say((pre||'')+`<p class="${kind==='me'?'say':''}">${html}</p>`);
  if(animate&&m.check&&k<W.frames.length-1) later(()=>G.banner(W.check),350);
  if(k===W.frames.length-1){ pauseW(); const w=W; W.endT=setTimeout(()=>{ G.banner(w.mate,'win',true); w.endT=setTimeout(w.onEnd,w.endDelay); }, animate?500:0); }
}
function stopWatch(){ if(!W) return; clearTimeout(W.timer); clearTimeout(W.endT); if(W.onGo) W.onGo(); W=null; }
G.stopWatch=stopWatch;

/* ---------- 장(카세트) 등록·갈아 끼우기 ---------- */
const CH=[]; G.chapters=CH;
G.register=function(ch){ CH.push(ch); };
G.current=null;
G.load=function(id,opt){
  const ch=CH.find(c=>c.id===id); if(!ch) return;
  const prev=G.current; if(prev&&prev.unload) prev.unload();
  clearTimers(); stopWatch(); if(typing){ clearInterval(typing.t); typing=null; }
  G.current=ch; document.body.dataset.ch=ch.id;
  // 무대 초기화
  const st=G.stage; st.className='stage';
  st.querySelectorAll('.art').forEach(a=>a.remove());
  st.insertAdjacentHTML('afterbegin',ch.arts||'');
  $('board').className='board'; B.clear(); G.banner('');
  $('possess').classList.remove('run'); $('slip').classList.remove('run'); $('year').classList.remove('run');
  B.labels={NAME:ch.pieceNames||{},side:ch.sides||{w:'흰 편 ',b:'검은 편 '}}; B.onCell=null; B.soulPic=null;
  $('extra').innerHTML=''; G.setChoices([]); $('text').innerHTML='';
  $('who').textContent=ch.firstWho||'…'; $('place').textContent=ch.firstPlace||'';
  // 머리말·규칙·출처
  document.querySelector('header .ch').textContent=`제${ch.no}장 · ${ch.title}`;
  document.title=`체스 빙의록 · 제${ch.no}장`;
  $('legendTitle').textContent=ch.legendTitle||'말과 규칙';
  const L=$('legend'); L.innerHTML='';
  (ch.legend||[]).forEach(([t,name,txt])=>{ const i=document.createElement('img'); i.src=G.img('w',t); i.alt=''; const sp=document.createElement('span'); sp.innerHTML='<b>'+name+'</b> · '+txt; L.appendChild(i); L.appendChild(sp); });
  $('rulesNote').innerHTML=ch.rulesNote||'';
  $('credits').innerHTML=ch.credits||'';
  $('chSelect').value=ch.id;
  try{ localStorage.setItem('chess-possession:last', ch.id); }catch(e){}
  if(ch.init) ch.init();
  if(ch.firstArt) G.art(ch.firstArt);
  // 제목 카드
  const tc=$('titlecard'); tc.querySelector('h2').textContent=ch.card?ch.card[0]:ch.title; tc.querySelector('p').textContent=ch.card?ch.card[1]:`제${ch.no}장`;
  tc.classList.remove('hide'); void tc.offsetWidth;
  later(()=>{ tc.classList.add('hide'); ch.start(opt||{}); }, reduce?0:2200);
};
G.next=function(){ const i=CH.indexOf(G.current); if(i>=0&&i<CH.length-1) G.load(CH[i+1].id); };
G.hasNext=()=>{ const i=CH.indexOf(G.current); return i>=0&&i<CH.length-1; };

/* ---------- 시작 ---------- */
G.boot=function(){
  G.stage=$('stage'); cellsEl=$('cells'); piecesEl=$('pieces');
  for(let r=7;r>=0;r--) for(let f=0;f<8;f++){ const c=document.createElement('div'); c.className='cell'+((r+f)%2?' alt':''); c.dataset.s=r*8+f; cellsEl.appendChild(c); }
  cellsEl.addEventListener('click',e=>{ const c=e.target.closest('.cell'); if(c&&B.onCell) B.onCell(+c.dataset.s); });
  $('text').addEventListener('click',()=>{ if(typing){ clearInterval(typing.t); typing.finish(); typing=null; } });
  const sel=$('chSelect'); CH.forEach(c=>{ const o=document.createElement('option'); o.value=c.id; o.textContent=`${c.no}장 · ${c.title}`; sel.appendChild(o); });
  sel.addEventListener('change',()=>G.load(sel.value));
  // 주소 끝에 #ch2 처럼 붙이면 그 장부터 시작 (만들 때 확인용)
  const want=(location.hash||'').slice(1);
  G.load(CH.find(c=>c.id===want)?want:CH[0].id);
};
})();
