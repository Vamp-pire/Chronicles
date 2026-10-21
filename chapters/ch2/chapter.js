/* 제2장 · 비단길 위의 말 (페르시아·아랍, 샤트란지)
   기보·해설·퍼즐은 data.js, 꾸밈은 style.css, 그림은 img/ 에 있습니다. */
(function(){
const {$, say, setChoices, img, IMG, banner, rules, board, gain, later} = G;
const {on, DG, legal, make, attacked, kingSq} = rules;
const D='chapters/ch2/img/';
const PICS={camel:D+'possess-camel.png', sage:D+'possess-sage.png', alfil:D+'possess-alfil.png'};
let GAME, ME_ID, NOTES, PUZ;   // data.js 에서 채움

/* ---- 그림 속 누를 곳(핫스팟) ----
   장면마다 hots:[{art, x, y, rx, ry, label, go}] 를 주면 그림 위에 빛나는 타원이 생기고, 누르면 go 가 실행됩니다.
   좌표는 그림(1280×720) 기준. 단추로도 같은 곳에 갈 수 있게 choices 도 함께 둡니다. */
function hots(list){
  document.querySelectorAll('.hot').forEach(h=>h.remove());
  list.forEach(h=>{ const svg=$('art-'+h.art); if(!svg) return; const g=document.createElementNS(G.NS,'g');
    g.setAttribute('class','hot'+(h.label?'':' nolabel')); g.setAttribute('tabindex','0'); g.setAttribute('role','button'); g.setAttribute('aria-label',h.label||h.aria||'');
    const fs=Math.max(22,Math.round(13*1280/((G.stage.clientWidth)||1280))), w=(h.label||'').length*fs+fs*1.3, hh=fs*1.7, ty=Math.max(h.y-h.ry-fs*.8, hh+6);
    g.innerHTML=`<ellipse class="hz" cx="${h.x}" cy="${h.y}" rx="${h.rx}" ry="${h.ry}"/><rect class="tagbg" x="${h.x-w/2}" y="${ty-fs*1.18}" width="${w}" height="${hh}" rx="${hh/2}"/><text class="tagtx" x="${h.x}" y="${ty}" text-anchor="middle" style="font-size:${fs}px">${h.label||''}</text>`;
    const fire=e=>{ e.stopPropagation(); hots([]); h.go(); };
    g.addEventListener('click',fire); g.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); fire(e); } });
    svg.appendChild(g); });
}
function scene(o){ hots(o.hots||[]); G.scene(o); }
function possessFx(pic,then,opt){ hots([]); G.possessFx(pic,then,opt); }
function slipFx(year,then){ hots([]); G.slipFx(year,then); }

const ARTS=`
  <svg class="art" id="art-caravan" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><radialGradient id="glowG"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".85"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient><linearGradient id="beamG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d0" stop-opacity=".9"/><stop offset="1" stop-color="#fff3d0" stop-opacity="0"/></linearGradient></defs>
    <g class="kb pan"><image href="${D}caravan.jpg" width="1280" height="720"/></g>
    <circle class="sun" cx="390" cy="200" r="150" fill="url(#glowG)"/>
    <g id="sand" fill="#fbe7bf"></g>
  </svg>
  <svg class="art" id="art-map" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <image href="${D}map.jpg" width="1280" height="720"/>
    <g id="routes"></g>
    <g id="cities"></g>
    <g id="marker"><circle r="22" fill="#e9a43a" opacity=".35" class="sun"/><circle r="11" fill="#e9a43a" stroke="#2a1730" stroke-width="3"/></g>
  </svg>
  <svg class="art" id="art-samarkand" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g class="kb"><image href="${D}samarkand.jpg" width="1280" height="720"/></g>
    <circle class="lampglow" cx="128" cy="440" r="70" fill="url(#glowG)"/>
    <circle class="sparkle" cx="458" cy="520" r="10" fill="#fff6d8"/><circle class="sparkle" cx="640" cy="500" r="8" fill="#fff6d8" style="animation-delay:-.7s"/><circle class="sparkle" cx="790" cy="560" r="9" fill="#fff6d8" style="animation-delay:-1.4s"/>
  </svg>
  <svg class="art" id="art-changan" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g class="kb"><image href="${D}changan.jpg" width="1280" height="720"/></g>
    <circle class="lampglow" cx="1100" cy="455" r="44" fill="url(#glowG)"/><circle class="lampglow" cx="210" cy="540" r="40" fill="url(#glowG)"/>
  </svg>
  <svg class="art" id="art-ctesiphon" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g class="kb"><image href="${D}ctesiphon.jpg" width="1280" height="720"/></g>
    <polygon class="beam" points="560,200 720,200 860,720 420,720" fill="url(#beamG)"/>
    <circle class="sparkle" cx="650" cy="530" r="9" fill="#fff6d8"/><circle class="sparkle" cx="610" cy="528" r="7" fill="#fff6d8" style="animation-delay:-1s"/>
    <g id="dust1"></g>
  </svg>
  <svg class="art" id="art-baghdad" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g class="kb"><image href="${D}baghdad.jpg" width="1280" height="720"/></g>
    <circle class="lampglow" cx="68" cy="140" r="50" fill="url(#glowG)"/><circle class="lampglow" cx="330" cy="190" r="40" fill="url(#glowG)"/>
    <circle class="lampglow" cx="950" cy="190" r="40" fill="url(#glowG)"/><circle class="lampglow" cx="1212" cy="140" r="50" fill="url(#glowG)"/>
  </svg>
  <svg class="art" id="art-shahmat" viewBox="0 0 1280 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <image href="${D}shahmat.jpg" width="1280" height="720"/>
    <polygon class="beam" points="560,0 720,0 900,560 380,560" fill="url(#beamG)"/>
    <g id="dust2"></g>
  </svg>`;

const NAME={K:'샤(왕)',F:'피르잔(대신)',E:'알필(코끼리)',N:'파라스(기병)',R:'루흐(전차)',P:'바이다크(보병)'};
const josa=G.josa;
function autoNote(m){ const who=m.p[0]==='w'?'알술리':'알마와르디'; const nm=NAME[m.p[1]].split('(')[0];
  let t=`${who}의 ${nm}${josa(nm,'이','가')} ${G.SQ(m.fr)}에서 ${G.SQ(m.to)}로 움직입니다.`;
  if(m.cap){ const cn=NAME[m.cap[1]].split('(')[0]; t=`${who}의 ${nm}${josa(nm,'이','가')} ${G.SQ(m.to)}의 ${cn}${josa(cn,'을','를')} 잡습니다.`; }
  if(m.check) t+=' <b>샤!</b>';
  return ['narr',t]; }
let FRAMES=null, ME_DIES=-1;
const S={visited:{},bet:null,quizMiss:0,q:0,pred:0};

/* ---- 지도 ---- */
const NS=G.NS;
const START=[655,468];
const CITIES={
  ctesiphon:{name:'크테시폰',tag:'본편 · 페르시아 왕도',xy:[430,330],path:'M655 468 C640 420 628 380 604 336 S560 296 512 292 S462 322 430 330'},
  samarkand:{name:'사마르칸트',tag:'곁가지 · 소그드 상인의 도시',xy:[507,268],path:'M655 468 C640 420 628 380 604 336 S540 300 507 268'},
  changan:{name:'장안',tag:'곁가지 · 당나라 수도',xy:[950,308],path:'M655 468 C640 420 628 380 604 336 S660 290 720 274 S820 262 860 282 S920 312 950 308'},
  baghdad:{name:'바그다드',tag:'762년 세워진 새 수도',xy:[420,300],path:''}
};
let routeEls={}, cityEls={};
function buildMap(){
  routeEls={}; cityEls={};
  const R=$('routes'), C=$('cities');
  for(const k in CITIES){ const c=CITIES[k];
    if(c.path){ const p=document.createElementNS(NS,'path'); p.setAttribute('d',c.path); p.setAttribute('class','route'); R.appendChild(p); routeEls[k]=p; }
    const g=document.createElementNS(NS,'g'); g.setAttribute('class','city'); g.setAttribute('transform',`translate(${c.xy[0]} ${c.xy[1]})`);
    const left = k==='ctesiphon'||k==='baghdad';
    g.innerHTML=`<circle class="pulse" r="16" fill="#e9a43a"/><circle r="9" fill="#2a1730" stroke="#e9a43a" stroke-width="3"/>
      <text x="${left?-18:18}" y="${k==='baghdad'?-10:8}" text-anchor="${left?'end':'start'}">${c.name}</text>
      <text class="tag" x="${left?-18:18}" y="${k==='baghdad'?14:32}" text-anchor="${left?'end':'start'}">${c.tag}</text>
      <path class="tick" d="M-7 0 l5 6 l10 -12" stroke="#e9a43a" stroke-width="4" fill="none" transform="translate(0 -30)"/>`;
    C.appendChild(g); cityEls[k]=g; }
  cityEls.baghdad.style.display='none';
}
function placeMarker(x,y){ $('marker').setAttribute('transform',`translate(${x} ${y})`); }
function resetRoutes(){ for(const k in routeEls){ const p=routeEls[k]; const L=p.getTotalLength(); p.style.setProperty('--len',L); p.classList.remove('draw'); p.classList.toggle('done',!!S.visited[k]); } }
function travel(k,then){
  setChoices([]); hots([]);
  const p=routeEls[k], L=p.getTotalLength(); p.classList.remove('done'); p.style.setProperty('--len',L); void p.getBoundingClientRect();
  p.classList.add('draw');
  const t0=performance.now(), dur=G.reduce?10:2400, chap=G.current;
  (function step(t){ if(G.current!==chap) return; const u=Math.min(1,(t-t0)/dur), e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2; const pt=p.getPointAtLength(L*e); placeMarker(pt.x,pt.y); if(u<1) requestAnimationFrame(step); else later(then,G.reduce?0:400); })(t0);
}

/* ---- 이야기 ---- */
function begin(){ G.art('caravan'); possessFx(PICS.camel,caravan); }
function caravan(){
  scene({art:'caravan',who:'낙타',place:'비단길 · 6세기 무렵',html:`
    <p>모래바람이 걷히자 당신은 <b>네 발로</b> 서 있습니다. 등에는 짐이 무겁고, 목에서 방울이 딸랑거립니다. 이번에 깃든 몸은 낙타입니다.</p>
    <p>등에 진 짐 속에 비단으로 싼 판과 말 서른두 개가 있습니다. 인도 궁정에서 보았던 바로 그 놀이, 차투랑가입니다.</p>
    <p class="say">"이 놀이를 어디에 먼저 팔아 볼까?" 소그드 상인 나나반다크가 당신의 목을 두드립니다. "길은 셋이다."</p>
    <p class="note">그림 속 빛나는 곳을 눌러서 이야기를 진행할 수 있어요. 아래 단추를 눌러도 됩니다.</p>`,
    hots:[{art:'caravan',x:700,y:440,rx:100,ry:90,label:'짐 속의 판',go:()=>mapHub(true)}],
    choices:[{label:'상인이 지도를 펼친다',primary:true,go:()=>mapHub(true)}]});
}
function mapHub(first){
  G.art('map'); resetRoutes(); placeMarker(...START);
  for(const k of ['samarkand','changan']) cityEls[k].classList.toggle('visited',!!S.visited[k]);
  const seen=Object.keys(S.visited).length;
  scene({who:'낙타',place:'인도 북부 · 갈림길',html: first?`
    <p>상인이 손가락으로 지도를 짚습니다. <b>서쪽</b>의 페르시아 왕도, <b>북쪽</b>의 사마르칸트, <b>동쪽</b>의 장안.</p>
    <p class="note">크테시폰이 이야기의 본편입니다. 사마르칸트와 장안은 곁가지라서, 들렀다가 이 갈림길로 돌아올 수 있습니다. 지도 위 도시를 눌러도 됩니다.</p>`
    :`<p>다시 갈림길입니다. ${seen>=2?'두 곁가지를 모두 돌아봤습니다. 이제 서쪽으로 갈 때입니다.':'아직 가 보지 않은 길이 남아 있습니다.'}</p>`,
    choices:[
      {label:'서쪽, 페르시아 왕도 크테시폰으로',sub:'본편 · 이 놀이가 처음으로 시험받는 곳',primary:true,go:()=>travel('ctesiphon',ctesiphon)},
      {label:(S.visited.samarkand?'✓ ':'')+'북쪽, 사마르칸트로',sub:'곁가지 · 땅속에 잠든 상아 말',go:()=>travel('samarkand',samarkand)},
      {label:(S.visited.changan?'✓ ':'')+'동쪽, 장안으로',sub:'곁가지 · 강이 흐르는 판',go:()=>travel('changan',changan)}],
    hots:[['ctesiphon',ctesiphon],['samarkand',samarkand],['changan',changan]].map(([k,f])=>({art:'map',x:CITIES[k].xy[0],y:CITIES[k].xy[1],rx:46,ry:46,aria:CITIES[k].name+'로 가기',go:()=>travel(k,f)}))});
}

/* 곁가지: 사마르칸트 */
function samarkand(){
  S.visited.samarkand=true;
  scene({art:'samarkand',who:'낙타',place:'사마르칸트 · 7세기 무렵(추정)',html:`
    <p>소그드 상인들의 도시. 시장에서 나나반다크가 판을 펼치자 상아 조각가가 눈을 반짝입니다. 그는 말을 <b>진짜 코끼리, 진짜 기병</b> 모양으로 깎아 주겠다고 합니다.</p>
    <p>그때 발밑의 모래가 출렁입니다. 시간이 1,300년쯤 앞으로 미끄러집니다.</p>`,
    hots:[{art:'samarkand',x:640,y:545,rx:200,ry:70,label:'출렁이는 모래',go:()=>slipFx('1977',dig)}],
    choices:[{label:'모래 속으로',primary:true,go:()=>slipFx('1977',dig)}]});
}
function dig(){
  scene({who:'낙타의 기억',place:'사마르칸트 아프라시압 언덕 · 1977년',html:`
    <p>고고학자들이 무너진 옛 도시 아프라시압을 파고 있습니다. 모래 칸을 눌러 파 보세요. 어딘가에 <b>상아 말 일곱 개</b>가 묻혀 있습니다.</p>`, after:digGame});
}
function digGame(){
  const x=$('extra'); const N=32, finds=[['w','K'],['w','N'],['w','N'],['w','E'],['w','P'],['w','P'],['w','R']];
  const spots=[]; while(spots.length<7){ const r=Math.floor(Math.random()*N); if(!spots.includes(r)) spots.push(r); }
  x.innerHTML='<div class="dig" id="dig"></div><div class="meter" id="meter"></div>';
  const g=$('dig'), mtr=$('meter'); let got=0, tries=0;
  finds.forEach(([c,t])=>{ const s=document.createElement('span'); s.innerHTML=`<img alt="" src="${img(c,t)}">`; mtr.appendChild(s); });
  for(let i=0;i<N;i++){ const b=document.createElement('button'); b.type='button'; b.className='tile'; b.setAttribute('aria-label','모래 칸 '+(i+1));
    b.addEventListener('click',()=>{ if(b.classList.contains('open')) return; b.classList.add('open'); tries++;
      const k=spots.indexOf(i); if(k>=0){ const [c,t]=finds[k]; b.innerHTML=`<img alt="" src="${img(c,t)}">`; mtr.children[k].classList.add('got'); got++;
        if(got===7) later(digDone,600); }
      else if(tries>=14 && got<7){ // 너무 오래 걸리지 않게 하나를 살짝 알려 줌
        const left=spots.filter((sp,j)=>!mtr.children[j].classList.contains('got')); const sp=left[0]; if(sp!==undefined) g.children[sp].style.boxShadow='0 0 0 3px var(--accent)'; }
    }); g.appendChild(b); }
}
function digDone(){
  gain('ivory','아프라시압의 상아 코끼리',IMG.alf_welephant);
  say(`<p>일곱 개 모두 나왔습니다. 전차를 탄 왕, 기병, 사람이 올라탄 코끼리, 보병. 1977년 실제로 이 언덕에서 이런 상아 말 일곱 개가 발굴되었습니다.</p>
    <p>함께 나온 동전과 지층으로 미루어 <b>7세기 무렵</b> 것으로 보는 견해가 많고(6~8세기로 넓게 잡기도 합니다), 지금까지 알려진 가장 오래된 체스 말 가운데 하나로 꼽힙니다.</p>
    <p class="note">얻은 것: 아프라시압의 상아 코끼리</p>`);
  setChoices([{label:'갈림길로 돌아간다',primary:true,go:()=>mapHub(false)}]);
}

/* 곁가지: 장안 */
function changan(){
  S.visited.changan=true;
  scene({art:'changan',who:'낙타',place:'장안 · 7~8세기 무렵(추정)',html:`
    <p>당나라의 수도 장안. 시장 한쪽에서 두 노인이 판을 두고 있습니다. 그런데 이상합니다. 말이 칸 <b>안</b>이 아니라 선이 만나는 <b>점 위</b>에 놓여 있습니다.</p>
    <p class="say">"서쪽 놀이라고? 우리 것도 비슷하지." 노인이 손짓합니다.</p>`,
    hots:[{art:'changan',x:620,y:524,rx:160,ry:48,label:'노인들의 판',go:changanBoard}],
    choices:[{label:'노인들의 판을 들여다본다',primary:true,go:changanBoard}]});
}
function changanBoard(){
  scene({html:`<p class="say">노인이 판의 세 곳을 가리킵니다. "여기, 여기, 그리고 여기를 보게." 아래 단추를 눌러 살펴보세요.</p>`, after:xqGame});
}
function xqBoard(){ let s='<svg class="xq" viewBox="0 0 360 400" role="img" aria-label="샹치 판"><g stroke="#7a5a34" stroke-width="1.5">';
  for(let r=0;r<10;r++) s+=`<line x1="20" y1="${20+r*40}" x2="340" y2="${20+r*40}"/>`;
  for(let f=0;f<9;f++){ if(f===0||f===8) s+=`<line x1="${20+f*40}" y1="20" x2="${20+f*40}" y2="380"/>`; else { s+=`<line x1="${20+f*40}" y1="20" x2="${20+f*40}" y2="180"/><line x1="${20+f*40}" y1="220" x2="${20+f*40}" y2="380"/>`; } }
  s+='<line x1="140" y1="20" x2="220" y2="100"/><line x1="220" y1="20" x2="140" y2="100"/><line x1="140" y1="300" x2="220" y2="380"/><line x1="220" y1="300" x2="140" y2="380"/></g>';
  s+='<text x="180" y="207" text-anchor="middle" font-size="18" fill="#7a5a34" font-family="serif">楚 河　　　漢 界</text>';
  s+='<rect class="hl" data-k="river" x="16" y="180" width="328" height="40" fill="#4a7fb0" opacity=".0" rx="4"/>';
  s+='<rect class="hl" data-k="palace" x="134" y="294" width="92" height="92" fill="none" stroke="#c4473a" stroke-width="4" rx="4"/><rect class="hl" data-k="palace" x="134" y="14" width="92" height="92" fill="none" stroke="#c4473a" stroke-width="4" rx="4"/>';
  const pc=(x,y,t,red)=>`<g transform="translate(${20+x*40} ${20+y*40})"><circle r="16" fill="#f7ead0" stroke="${red?'#c4473a':'#2a1730'}" stroke-width="2.5"/><text y="6" text-anchor="middle" font-size="17" font-family="serif" fill="${red?'#c4473a':'#2a1730'}">${t}</text></g>`;
  const back=['車','馬','相','仕','帥','仕','相','馬','車'], backB=['車','馬','象','士','將','士','象','馬','車'];
  back.forEach((t,f)=>s+=pc(f,9,t,true)); backB.forEach((t,f)=>s+=pc(f,0,t,false));
  s+=pc(1,7,'炮',true)+pc(7,7,'炮',true)+pc(1,2,'砲',false)+pc(7,2,'砲',false);
  [0,2,4,6,8].forEach(f=>{ s+=pc(f,6,'兵',true)+pc(f,3,'卒',false); });
  s+='<g class="hl" data-k="cannon"><circle cx="60" cy="300" r="21" fill="none" stroke="#e9a43a" stroke-width="4"/><circle cx="300" cy="300" r="21" fill="none" stroke="#e9a43a" stroke-width="4"/><path d="M60 280 V100" stroke="#e9a43a" stroke-width="3" stroke-dasharray="6 6" fill="none"/></g>';
  return s+'</svg>'; }
function xqGame(){
  const x=$('extra'); x.innerHTML=xqBoard()+'<div class="xqbtns"><button class="btn" type="button" data-k="river">가운데의 강</button><button class="btn" type="button" data-k="palace">왕이 갇힌 궁성</button><button class="btn" type="button" data-k="cannon">처음 보는 말, 포</button></div>';
  const T={river:'판 가운데에 <b>강</b>이 흐릅니다. 코끼리(象)는 강을 건너지 못하고, 졸(卒)은 강을 건너야 옆으로도 걸을 수 있습니다.',
    palace:'왕은 X자가 그어진 <b>궁성</b> 아홉 점 밖으로 나갈 수 없습니다. 장기에도 같은 궁성이 있습니다.',
    cannon:'<b>포(炮)</b>는 차투랑가에 없는 말입니다. 다른 말 하나를 뛰어넘어야만 잡을 수 있습니다.'};
  const seen=new Set();
  x.querySelectorAll('.xqbtns .btn').forEach(b=>b.addEventListener('click',()=>{ const k=b.dataset.k; seen.add(k);
    x.querySelectorAll('.xqbtns .btn').forEach(o=>o.classList.toggle('on',o===b));
    x.querySelectorAll('.xq .hl').forEach(h=>{ const onn=h.dataset.k===k; h.classList.toggle('on',onn); if(h.tagName==='rect'&&h.dataset.k==='river') h.setAttribute('opacity',onn?'.3':'0'); });
    say(`<p>${T[k]}</p>`);
    if(seen.size===3&&!x.dataset.done){ x.dataset.done='1'; later(changanDone,900); } }));
}
function changanDone(){
  gain('cannon','장안 시장의 포(炮) 말',null);
  say(`<p>중국의 <b>샹치</b>, 그리고 훗날 한국의 <b>장기</b>와 일본의 <b>쇼기</b>는 체스의 먼 친척입니다. 인도에서 건너온 놀이가 바뀌었다는 설이 많지만, 중국에서 따로 생겼다는 주장도 있어 아직 결론이 나지 않았습니다.</p>
    <p class="note">얻은 것: 장안 시장의 포(炮) 말</p>`);
  setChoices([{label:'갈림길로 돌아간다',primary:true,go:()=>mapHub(false)}]);
}

/* 본편: 크테시폰 */
function ctesiphon(){
  scene({art:'ctesiphon',who:'낙타',place:'크테시폰 · 사산 왕조 페르시아, 6세기',html:`
    <p>거대한 아치 아래, 왕 중의 왕 <b>호스로 1세</b>(재위 531~579)가 앉아 있습니다. 인도에서 온 사신이 무릎을 꿇고 판을 바칩니다. 말 열여섯 개는 에메랄드, 열여섯 개는 루비입니다.</p>
    <p class="say">"이 놀이의 규칙을 알아내 보시오. 알아내지 못하면 페르시아는 인도에 조공을 바쳐야 하오."</p>
    <p>신하들이 웅성거리는 사이, 젊은 재상 하나가 앞으로 나섭니다. 당신의 의식이 그에게로 끌려갑니다.</p>
    <p class="note">사신이 받쳐 든 판을 눌러 보세요.</p>`,
    hots:[{art:'ctesiphon',x:660,y:515,rx:80,ry:38,label:'사신의 판',go:()=>possessFx(PICS.sage,riddle)}],
    choices:[{label:'재상의 몸으로',primary:true,go:()=>possessFx(PICS.sage,riddle)}]});
}
const QUIZ=[
  {t:'E',q:'코끼리 모양의 말. 어떻게 움직일까?',a:1},
  {t:'R',q:'전차 모양의 말. 어떻게 움직일까?',a:0},
  {t:'F',q:'왕 곁의 대신. 어떻게 움직일까?',a:2},
  {t:'N',q:'말 탄 기병. 어떻게 움직일까?',a:3}];
const OPTS=[['줄을 따라 막히지 않는 데까지',[[0,1],[0,2],[0,3],[0,-1],[0,-2],[1,0],[2,0],[-1,0],[-2,0]],[]],
  ['대각선 두 칸, 사이를 뛰어넘음',[],[[2,2],[2,-2],[-2,2],[-2,-2]]],
  ['대각선 한 칸',[],[[1,1],[1,-1],[-1,1],[-1,-1]]],
  ['한 칸 곧게, 한 칸 비스듬히 (ㄱ자)',[],[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]]]];
function moveSvg(o){ const [_,line,jumps]=o; let s='<svg viewBox="0 0 70 70" aria-hidden="true"><rect width="70" height="70" fill="#efdcb4" rx="3"/>';
  for(let i=0;i<=7;i++){ s+=`<line x1="0" y1="${i*10}" x2="70" y2="${i*10}" stroke="#c9ad7a" stroke-width=".6"/><line x1="${i*10}" y1="0" x2="${i*10}" y2="70" stroke="#c9ad7a" stroke-width=".6"/>`; }
  s+='<rect x="30" y="30" width="10" height="10" fill="#6a3352"/>';
  [...line,...jumps].forEach(([dx,dy])=>{ s+=`<circle cx="${35+dx*10}" cy="${35-dy*10}" r="3.2" fill="#e9a43a" stroke="#2a1730" stroke-width=".8"/>`; });
  return s+'</svg>'; }
function riddle(){
  S.q=0; S.quizMiss=0;
  scene({who:'재상 부주르그미흐르',place:'크테시폰 · 호스로 1세의 궁정',html:`
    <p>당신은 이제 재상 <b>부주르그미흐르</b>입니다. 사흘 밤낮을 판 앞에 앉아 말을 들여다봅니다. 인도에서 이미 이 놀이를 본 당신이라면 알 수 있습니다.</p>
    <p class="note">말마다 맞는 움직임을 고르세요.</p>`, after:quizStep});
}
function quizStep(){
  const Q=QUIZ[S.q]; const x=$('extra');
  x.innerHTML=`<div class="qstep">수수께끼 ${S.q+1} / ${QUIZ.length}</div><div class="quiz"><div class="pic"><img alt="" src="${img('w',Q.t)}"></div><div><p style="margin:0 0 8px;font-family:var(--display)">${Q.q}</p><div class="opts" id="opts"></div></div></div>`;
  const box=$('opts'); OPTS.forEach((o,i)=>{ const b=document.createElement('button'); b.type='button'; b.className='opt'; b.innerHTML=moveSvg(o)+`<span>${o[0]}</span>`;
    b.addEventListener('click',()=>{ if(box.dataset.lock) return; if(i===Q.a){ box.dataset.lock='1'; b.classList.add('right'); later(()=>{ S.q++; if(S.q<QUIZ.length) quizStep(); else solved(); },650); }
      else { b.classList.add('wrong'); S.quizMiss++; say('<p class="say">사신의 입꼬리가 올라갑니다. "틀렸소."</p><p class="note">1장의 차투랑가를 떠올려 보세요.</p>'); later(()=>b.classList.remove('wrong'),400); } });
    box.appendChild(b); });
}
function solved(){
  $('extra').innerHTML='';
  say(`<p>당신은 말 하나하나를 판 위에 올려 움직여 보입니다. 사신의 얼굴이 굳고, 이윽고 고개를 숙입니다. ${S.quizMiss?'':'<b>단 한 번도 틀리지 않았습니다.</b>'}</p>
    <p class="say">"이것은 전쟁이오. 지혜가 군대를 움직이는 전쟁." 호스로 1세가 크게 웃습니다.</p>
    <p>그날부터 이 놀이는 페르시아의 것이 됩니다. 이름도 페르시아어로 바뀝니다. 차투랑가는 <b>차트랑</b>이 됩니다.</p>`);
  setChoices([{label:'말들의 새 이름을 본다',primary:true,go:()=>names(false)}]);
}
const NAMES=[['K','라자','샤','샤'],['F','만트리','파르진','피르잔'],['E','가자','필','알필'],['N','아슈바','아스프','파라스'],['R','라타','루흐','루흐'],['P','파다티','피야다','바이다크']];
function names(stage2){
  const x=$('extra');
  let h='<div class="names"><span></span><span class="h">인도 (산스크리트어)</span><span class="h">페르시아</span><span class="h">아랍</span>';
  NAMES.forEach((n,i)=>{ h+=`<img alt="" src="${img('w',n[0])}"><span class="n" style="animation-delay:${i*.08}s">${n[1]}</span><span class="n fa" style="animation-delay:${.6+i*.12}s">${n[2]}</span><span class="n ar" style="animation-delay:${stage2?1.6+i*.12:1.4+i*.08}s">${stage2?n[3]:'?'}</span>`; });
  x.innerHTML=h+'</div>';
  if(!stage2){
    say(`<p>왕이 몰려 꼼짝 못 하게 되면 페르시아 사람들은 이렇게 외쳤습니다. <b>"샤 마트!"</b> 흔히 '왕이 어찌할 바를 모른다, 꼼짝 못 한다'는 뜻으로 풀고, '왕이 죽었다'로 읽기도 합니다. 이 말이 훗날 <b>체크메이트</b>가 됩니다.</p>
      <p>전설에 따르면 부주르그미흐르는 답례로 직접 만든 놀이 <b>나르드</b>(백개먼의 조상)를 인도로 보냈고, 이번엔 인도 학자들이 그 규칙을 풀지 못했다고 합니다.</p>`);
    setChoices([{label:'시간이 흐른다',primary:true,go:slip651}]);
  }
}
function slip651(){
  possessFx(PICS.sage,()=>{
    slipFx('651 → 762',()=>{
      G.art('map'); resetRoutes(); placeMarker(430,330); cityEls.baghdad.style.display=''; cityEls.ctesiphon.classList.add('dim');
      for(const k of ['samarkand','changan']) cityEls[k].classList.add('dim');
      scene({who:'…',place:'시간의 틈',html:`
        <p>재상의 몸에서 빠져나온 당신은 다시 시간 위를 떠다닙니다. 651년, 사산 왕조가 무너지고 페르시아는 이슬람 세계에 들어갑니다.</p>
        <p>762년, 크테시폰 폐허에서 멀지 않은 티그리스 강가에 둥근 도시 <b>바그다드</b>가 세워집니다. 차트랑은 아랍어로 <b>샤트란지</b>가 되고, 말 이름도 다시 바뀝니다.</p>`,
        after:()=>names(true), choices:[{label:'바그다드로',primary:true,go:baghdad}]});
    });
  });
}

/* 본편: 바그다드 */
function baghdad(){
  cityEls.ctesiphon.classList.remove('dim'); for(const k of ['samarkand','changan']) cityEls[k].classList.remove('dim');
  scene({art:'baghdad',who:'…',place:'바그다드 · 칼리프 알묵타피의 궁정, 902~908년 사이',html:`
    <p>칼리프 <b>알묵타피</b> 앞에 판이 놓였습니다. 한쪽은 궁정의 자랑, 오랫동안 총애를 받아 온 챔피언 <b>알마와르디</b>. 다른 쪽은 이름이 막 알려지기 시작한 젊은 학자 <b>알술리</b>입니다.</p>
    <p class="say">"내 앞에서 누가 더 나은지 가려 보아라." 칼리프가 손짓합니다. 궁정 사람들이 저마다 한쪽에 돈을 겁니다.</p>
    <p class="note">돈을 걸 사람을 그림에서 눌러 보세요. 왼쪽이 알술리, 오른쪽이 알마와르디입니다.</p>`,
    hots:[{art:'baghdad',x:340,y:440,rx:120,ry:190,label:'알술리',go:()=>bet('suli')},
          {art:'baghdad',x:950,y:440,rx:120,ry:190,label:'알마와르디',go:()=>bet('mawardi')}],
    choices:[
      {label:'총애받는 챔피언 알마와르디에게 건다',go:()=>bet('mawardi')},
      {label:'젊은 도전자 알술리에게 건다',go:()=>bet('suli')}]});
}
function bet(k){
  S.bet=k;
  scene({html:`<p>${k==='suli'?'옆의 신하가 코웃음을 칩니다. "알술리? 젊은 혈기로는 안 되네."':'옆의 신하가 고개를 끄덕입니다. "현명하군. 알마와르디는 진 적이 거의 없지."'}</p>
    <p>판 위로 시선이 빨려 들어갑니다. 이번에 깃들 몸은 알술리의 오른쪽 <b>알필</b>, 코끼리입니다.</p>`,
    hots:[{art:'baghdad',x:630,y:560,rx:170,ry:50,label:'판 위의 알필',go:toPiece}],
    choices:[{label:'알필에 빙의한다',primary:true,go:toPiece}]});
}
function toPiece(){
  possessFx(PICS.alfil,()=>{
    G.match(true); $('board').classList.remove('play'); board.clear(); const F=FRAMES[0]; board.draw(F.b,F.ids,null,false,ME_ID);
    scene({who:'알필(코끼리)',place:'샤트란지 판 위 · f1',html:`
      <p>몸이 상아처럼 단단해집니다. 당신은 <b>알필</b>. 1장의 가자(코끼리)가 이름만 바뀐 말입니다. 여전히 <b>대각선 두 칸을 뛰어넘는 것</b>밖에 하지 못합니다.</p>
      <p>그래서 판 전체에서 갈 수 있는 칸이 <b>여덟 곳뿐</b>입니다. 아랍의 고수들은 알필을 가장 약한 말 가운데 하나로 쳤습니다.</p>
      <p class="note">아래쪽 흰 군대가 알술리, 위쪽 검은 군대가 알마와르디입니다. "나" 표시가 빙의한 알필이에요.</p>`,
      choices:[{label:'대국 시작',primary:true,go:watch},{label:'내가 갈 수 있는 여덟 칸 보기',go:showReach}]});
  });
}
function showReach(){
  const s0=5, seen=new Set([s0]), q=[s0];
  while(q.length){ const s=q.shift(); const r=s>>3,f=s&7; DG.forEach(d=>{ const rr=r+2*d[0], ff=f+2*d[1]; if(on(rr,ff)){ const t=rr*8+ff; if(!seen.has(t)){ seen.add(t); q.push(t); } } }); }
  board.cells().forEach(c=>c.classList.toggle('reach',seen.has(+c.dataset.s)));
  say(`<p>빛나는 <b>${seen.size}칸</b>이 당신이 평생 밟을 수 있는 땅의 전부입니다. 판의 나머지 56칸은 영영 갈 수 없습니다.</p>`);
  setChoices([{label:'대국 시작',primary:true,go:watch}]);
}
function watch(){
  board.cells().forEach(c=>c.classList.remove('reach'));
  board.soulPic=IMG.alf_welephant;
  // 알필 속마음(me) 해설 수와 사냥의 두 고비(20·42수)에서 멈춤
  S.pred=0;
  const stops=new Set([...Object.keys(NOTES).filter(k=>NOTES[k][0]==='me').map(Number),20,42]);
  G.watch({frames:FRAMES, notes:NOTES, autoNote, meId:ME_ID,
    startText:'칼리프가 고개를 끄덕입니다. 알술리가 먼저 둡니다.',
    who:(k,kind)=> (ME_DIES>0&&k>=ME_DIES) ? '알필의 혼' : (kind==='me'?'알필(코끼리) · 속마음':'알필(코끼리)'),
    check:'샤 !', mate:'샤 마트', plainMs:650, noteMs:1900, stops, endDelay:1700, onEnd:ending,
    ask:predict, onGo:clearPred});
}

/* ---- 다음 수 맞히기: 고비가 되는 네 수 직전에 멈추고 후보 셋 중 실제 수를 고르게 함 ---- */
const PRED=[20,30,42,44];
let PQ=null;
const pos=s=>`translate(${(s&7)*100}%,${(7-(s>>3))*100}%)`;
function frameBefore(i){ return FRAMES.find(F=>F.move&&F.move.i===i-1)||FRAMES[0]; }
function candidates(b,i){
  const real=GAME[i], c=b[real[0]][0], o=c==='w'?'b':'w';
  const val={P:1,F:2,E:2,N:3,R:5,K:0};
  const sc=m=>{ const nb=make(b,m); let s=0; if(attacked(nb,kingSq(nb,o),c)) s+=4; if(b[m[1]]) s+=2+val[b[m[1]][1]]; return s+((m[0]*7+m[1]*3)%5)/10; };
  const alts=legal(b,c).filter(m=>m[1]!==real[1]).sort((x,y)=>sc(y)-sc(x));
  const pick=[]; for(const m of alts){ if(pick.length>=2) break; if(pick.some(p=>p[1]===m[1])) continue; pick.push(m); }
  return [real,...pick].sort((x,y)=>x[1]-y[1]);
}
function mvLabel(b,m){ const p=b[m[0]], nm=NAME[p[1]].split('(')[0]; return `${nm} ${G.SQ(m[0])}→${G.SQ(m[1])}${b[m[1]]?' (잡기)':''}`; }
function predict(i,cont){
  if(!PRED.includes(i)) return false;
  banner('');
  const b=frameBefore(i).b, real=GAME[i], c=b[real[0]][0], list=candidates(b,i), who=c==='w'?'알술리':'알마와르디';
  PQ={list,real,cont,b};
  list.forEach((m,n)=>{ board.cell(m[0]).classList.add('pfrom'); const tc=board.cell(m[1]); tc.classList.add('pto'); tc.dataset.n=n;
    const d=document.createElement('div'); d.className='pbadge'; d.dataset.n=n; d.style.transform=pos(m[1]); d.innerHTML=`<span>${n+1}</span>`; $('pieces').appendChild(d); });
  board.onCell=s=>{ const tc=board.cell(s); if(PQ&&tc.classList.contains('pto')) answer(+tc.dataset.n); };
  const q = i===30 ? '알필인 당신의 몸이 근질거립니다. 알술리는 다음에 무엇을 둘까요?' : `${who}의 다음 수는 무엇일까요?`;
  $('who').textContent = i===30 ? '알필(코끼리) · 속마음' : '다음 수 맞히기';
  say(`<p><b>${q}</b></p><p class="note">판 위 번호 칸을 누르거나 아래에서 고르세요. 지금까지 ${S.pred}번 맞혔어요.</p>`);
  setChoices(list.map((m,n)=>({label:`${n+1}. ${mvLabel(b,m)}`,go:()=>answer(n)})));
  return true;
}
function clearPred(){ board.cells().forEach(c=>{ c.classList.remove('pfrom','pto'); delete c.dataset.n; }); $('pieces').querySelectorAll('.pbadge').forEach(d=>d.remove()); if(PQ){ PQ=null; board.onCell=null; } }
function answer(n){
  if(!PQ) return; const q=PQ; PQ=null; board.onCell=null;
  const pick=q.list[n], ok=pick===q.real;
  if(ok) S.pred++;
  $('pieces').querySelectorAll('.pbadge').forEach(d=>d.classList.add(q.list[+d.dataset.n]===q.real?'ok':'no'));
  setChoices([]);
  later(()=>{ q.cont(ok?'<p class="say">맞혔습니다! ✓</p>':`<p class="say">아쉬워요. 실제로는 <b>${mvLabel(q.b,q.real)}</b>였습니다.</p>`); }, G.reduce?0:700);
}
function ending(){
  const right=S.bet==='suli';
  scene({who:'알필의 혼',place:'바그다드 · 칼리프의 궁정',html:`
    <p>궁정이 술렁입니다. 알마와르디가 판에서 눈을 떼지 못합니다.</p>
    <p class="say">칼리프 알묵타피가 알마와르디를 돌아보며 말합니다. "그대의 장미수가 그만 구정물이 되어 버렸구나."</p>
    <p>그날 이후 총애는 알술리에게 옮겨 갑니다. ${right?'당신이 건 판돈은 두 배가 되어 돌아왔습니다.':'당신이 건 판돈은 옆 신하의 주머니로 들어갔습니다.'}</p>
    <p>다음 수 맞히기: <b>${PRED.length}번 중 ${S.pred}번</b> 맞혔어요. ${S.pred>=3?'알술리의 제자가 될 만한 눈이네요.':S.pred>=1?'칼리프 곁의 구경꾼 정도는 되겠어요.':'아직은 판을 보는 눈을 기르는 중이에요.'}</p>
    <p class="note">칼리프의 말은 후대 기록에 전하는 일화로, 원문은 이보다 더 거친 표현이라고 합니다.</p>`,
    choices:[{label:'다시 보기',go:()=>{ banner(''); watch(); }},{label:'다음으로',primary:true,go:shahmat}]});
}
function shahmat(){
  banner(''); G.match(false); G.art('shahmat');
  later(()=>G.stage.classList.add('awake'),300);
  scene({who:'알필의 혼',place:'바그다드',html:`
    <p><b>샤 마트.</b> 페르시아어 '샤'(왕)와 '마트'(꼼짝 못 하는)가 합쳐진 말입니다. 아랍을 거쳐 유럽으로 건너가며 '체크메이트'가 되었습니다.</p>
    <p>알술리는 이후 수많은 제자를 길렀고, '알술리처럼 둔다'는 말이 최고의 실력을 뜻하게 되었다고 합니다. 그가 남긴 문제 하나는 <b>천 년 넘게 아무도 풀지 못하다가 1986년에야 풀렸습니다</b>.</p>
    <p class="say">대국이 끝난 뒤, 알술리가 판을 정리하며 웃습니다. "이야기 하나 해 주지. 딜라람이라는 여인의 이야기야."</p>`,
    hots:[{art:'shahmat',x:620,y:420,rx:110,ry:130,label:'쓰러진 왕',go:dilaram}],
    choices:[{label:'이야기를 듣는다',primary:true,go:dilaram}]});
}

/* ---- 딜라람 문제 ---- */
let PB=null, PSTEP=0, PSEL=null, PIDS=null, PHINT=0, PLOCK=false, PT=null;
function dilaram(){
  G.stage.classList.remove('awake');
  scene({who:'알필의 혼',place:'바그다드 · 대국이 끝난 밤',html:`
    <p class="say">"한 귀족이 내기에 빠져 아내 딜라람까지 걸었다네. 판은 지기 직전이었지. 그때 딜라람이 소리쳤어. <b>'두 루흐를 버리세요, 저를 버리지 말고!'</b>"</p>
    <p>전설 속 딜라람의 외통을 본뜬 문제입니다. 흰 편으로 <b>세 수 만에 샤 마트</b>를 만들어 보세요. 말을 누르고, 갈 칸을 누르면 됩니다.</p>
    <p class="note">실제 전설의 배치가 아니라 같은 아이디어로 새로 만든 문제입니다. 검은 편은 컴퓨터가 둡니다.</p>`,
    choices:[{label:'문제 풀기',primary:true,go:startPuzzle}]});
}
function clearPT(){ clearTimeout(PT); clearInterval(PT); }
function startPuzzle(){
  PB=PUZ.board.slice(); PIDS=PB.map((p,i)=>p?1000+i:null); PSTEP=0; PSEL=null; PHINT=0; PLOCK=false; clearPT();
  banner('');
  G.match(true); $('board').classList.add('play'); board.clear();
  board.draw(PB,PIDS,null,false,-1);
  board.onCell=onCell;
  $('who').textContent='딜라람의 문제';
  say('<p>흰 편 차례입니다. 첫 수를 두세요.</p>');
  $('extra').innerHTML=''; setChoices([{label:'힌트',go:hint},{label:'처음부터',go:startPuzzle},{label:'건너뛰기',go:()=>puzzleDone(true)}]);
}
function hint(){ if(PLOCK||PSTEP*2>=PUZ.line.length) return; const m=PUZ.line[PSTEP*2]; PHINT++;
  board.cell(m[0]).classList.add('sel');
  say(`<p>${PHINT>1&&PUZ.hints[PSTEP]?PUZ.hints[PSTEP]:'빛나는 말을 움직여 보세요.'}</p>`); }
function onCell(s){
  if(!$('board').classList.contains('play')||!PB||PLOCK) return;
  const mine=PB[s]&&PB[s][0]==='w';
  if(PSEL===null||mine){ if(!mine) return; PSEL=s; markSel(); return; }
  const ms=legal(PB,'w'); const ok=ms.find(m=>m[0]===PSEL&&m[1]===s);
  if(!ok){ PSEL=null; markSel(); return; }
  const want=PUZ.line[PSTEP*2];
  if(ok[0]!==want[0]||ok[1]!==want[1]){
    const nb=make(PB,ok); const mate=!legal(nb,'b').length&&attacked(nb,kingSq(nb,'b'),'w');
    PSEL=null; markSel();
    say(mate?'<p>…그것도 샤 마트네요! 다른 길이 있었군요.</p>':'<p class="say">알술리가 고개를 젓습니다. "그렇게 두면 상대가 빠져나간다네. 딜라람의 말을 떠올려 보게."</p>');
    if(mate){ PLOCK=true; applyP(ok); PT=setTimeout(()=>puzzleDone(false),1200); }
    return; }
  applyP(ok); PSEL=null; markSel(); PSTEP++; PLOCK=true;
  if(PSTEP*2>=PUZ.line.length){ PT=setTimeout(()=>puzzleDone(false),900); return; }
  say(`<p>${PUZ.says[PSTEP-1]}</p>`);
  PT=setTimeout(()=>{ const r=PUZ.line[PSTEP*2-1]; applyP(r); PLOCK=false; say(`<p>${PUZ.replies[PSTEP-1]}</p>`); },1100);
}
function applyP(m){ const id=PIDS[m[0]], capId=PB[m[1]]?PIDS[m[1]]:null; const p=PB[m[0]];
  PB=make(PB,m); PIDS=PIDS.slice(); PIDS[m[1]]=id; PIDS[m[0]]=null;
  const side=p[0]==='w'?'b':'w'; const check=attacked(PB,kingSq(PB,side),p[0]);
  board.draw(PB,PIDS,{fr:m[0],to:m[1],p,capId,check},!G.reduce,-1);
  if(check&&!(side==='b'&&!legal(PB,'b').length)) later(()=>banner('샤 !'),350); }
function markSel(){ board.cells().forEach(c=>c.classList.remove('sel','dot','cap'));
  if(PSEL===null) return; board.cell(PSEL).classList.add('sel');
  legal(PB,'w').filter(m=>m[0]===PSEL).forEach(m=>board.cell(m[1]).classList.add(PB[m[1]]?'cap':'dot')); }
function puzzleDone(skipped){
  PLOCK=true; $('board').classList.remove('play'); clearPT();
  if(!skipped){ banner('샤 마트','win',true); gain('dilaram','딜라람의 외통',IMG.wrook); }
  later(()=>{
    scene({who:'알필의 혼',html: skipped?`<p class="say">"정답은 루흐 둘을 차례로 바치는 것이었네." 알술리가 판 위에 수를 하나씩 놓아 보입니다.</p>`:`<p class="say">"바로 그거야!" 알술리가 무릎을 칩니다. "귀족은 루흐 둘을 버리고 이겼고, 딜라람도 지켰다네."</p><p class="note">얻은 것: 딜라람의 외통</p>`,
      choices:[{label:'다시 풀기',go:startPuzzle},{label:'다음으로',primary:true,go:farewell}]});
    if(skipped){ PB=PUZ.board.slice(); PIDS=PB.map((p,i)=>p?1000+i:null); board.clear(); board.draw(PB,PIDS,null,false,-1); let i=0; PT=setInterval(()=>{ if(i>=PUZ.line.length){ clearInterval(PT); banner('샤 마트','win',true); return; } applyP(PUZ.line[i++]); },1100); }
  }, skipped?0:1500);
}

/* ---- 작별 ---- */
const MY_ITEMS=['ivory','cannon','dilaram'];
function farewell(){
  clearPT(); banner(''); $('board').classList.remove('play');
  possessFx(PICS.alfil,()=>{
    G.match(false); G.art('caravan');
    const list=G.state.items.map(i=>`<span class="item got">${i.pic?`<img alt="" src="${i.pic}">`:'<span style="font-family:serif;color:var(--lac)">炮</span>'}${i.label}</span>`).join('');
    scene({who:'…',place:'시간의 틈 · 지중해로 가는 길',html:`
      <p>상아의 몸이 풀리고, 당신은 다시 시간 위로 떠오릅니다. 아래로 서쪽을 향하는 상단이 보입니다. 샤트란지는 이제 지중해를 건너 <b>안달루스</b>(이슬람 시대의 스페인)로, 그리고 유럽으로 갑니다.</p>
      <p>먼 훗날 스페인 사람들은 비숍을 아직도 <b>알필(alfil)</b>이라고 부릅니다. 당신이 깃들었던 그 코끼리의 이름입니다.</p>
      <p class="note">제3장 예고 · 코끼리가 주교가 되는 곳 (준비 중)</p>`,
      after:()=>{ if(G.state.items.length) $('extra').innerHTML='<p class="note" style="margin:0 0 6px">지금까지 모은 것</p><div class="items">'+list+'</div>'; },
      choices:[
        ...(G.hasNext()?[{label:'다음 장으로',primary:true,go:()=>G.next()}]:[]),
        {label:'2장 처음부터 다시',go:()=>{ G.resetItems(i=>!MY_ITEMS.includes(i.key)); G.load('ch2'); }},
        {label:'1장부터 다시',go:()=>{ G.resetItems(); G.load('ch1'); }}]});
  });
}

/* ---- 꾸밈 ---- */
function decorate(){
  const s=$('sand');
  for(let i=0;i<40;i++){ const c=document.createElementNS(NS,'circle'); c.setAttribute('cx',600+Math.random()*700); c.setAttribute('cy',420+Math.random()*280); c.setAttribute('r',(.8+Math.random()*1.8).toFixed(1)); c.setAttribute('class','sand'); c.style.animationDuration=(2+Math.random()*3)+'s'; c.style.animationDelay=(-Math.random()*4)+'s'; s.appendChild(c); }
  ['dust1','dust2'].forEach((id,j)=>{ const g=$(id); for(let i=0;i<24;i++){ const c=document.createElementNS(NS,'circle'); c.setAttribute('cx',(j?520:500)+Math.random()*260); c.setAttribute('cy',260+Math.random()*360); c.setAttribute('r',(.8+Math.random()*2).toFixed(1)); c.setAttribute('fill','#fff1c9'); c.setAttribute('class','dust'); c.style.setProperty('--dx',(Math.random()*40-20)+'px'); c.style.animationDuration=(5+Math.random()*6)+'s'; c.style.animationDelay=(-Math.random()*10)+'s'; g.appendChild(c); } });
}

G.register({
  id:'ch2', no:2, title:'비단길 위의 말', card:['비단길 위의 말','제2장 · 샤트란지'],
  arts:ARTS, firstArt:'caravan', firstWho:'…', firstPlace:'시간의 틈',
  pieceNames:NAME, sides:{w:'흰 편 ',b:'검은 편 '},
  legendTitle:'샤트란지 말과 규칙',
  legend:[['K',NAME.K,'아무 방향 한 칸'],['F',NAME.F,'대각선 한 칸. 훗날 퀸'],['E',NAME.E,'대각선 두 칸을 뛰어넘음. 갈 수 있는 칸이 판 전체에서 8곳뿐. 훗날 비숍'],['N',NAME.N,'지금의 나이트와 같음'],['R',NAME.R,'지금의 룩과 같음'],['P',NAME.P,'앞으로 한 칸, 대각선으로 잡음. 끝 줄에서 피르잔']],
  rulesNote:"움직임은 1장의 차투랑가와 거의 같습니다. 캐슬링 없음, 보병은 한 칸씩만 가고 끝 줄에서 피르잔이 됩니다. 이기는 방법은 샤 마트(외통), 그리고 상대 왕만 남기기입니다. 스테일메이트는 자료마다 '건 쪽 승리'와 '당한 쪽 승리'로 갈려서, 이 장의 대국은 외통으로만 끝나게 골랐습니다. 첫 배치(왕과 피르잔의 자리)도 연구자마다 다르게 복원하며, 여기서는 1장과 같은 배치를 썼습니다.",
  credits:'그림: 장면 일러스트는 Canva AI로 생성. 말 그림: 왕·기병·전차·보병은 Colin M.L. Burnett의 Cburnett 세트(lichess chessground 배포본), 코끼리·대신은 <a href="https://chessvariants.org/graphics.dir" target="_blank" rel="noopener">The Chess Variant Pages</a> 그래픽(Alfaerie 세트로 추정, David Howe). 대국 기보와 딜라람 문제는 실제 기록이 아니라 샤트란지 규칙으로 컴퓨터가 만들고 검증한 것입니다. 역사 설명은 위키백과(Shatranj, al-Suli), ChessBase(아프라시압 말), Encyclopaedia Iranica(체스 항목)를 참고한 초안이며, 장미수 일화와 나르드 전설은 전해 내려오는 이야기입니다.',
  init(){
    ({GAME,ME_ID,NOTES,PUZ}=G.data.ch2);
    if(!FRAMES){ FRAMES=rules.buildFrames(GAME); ME_DIES=FRAMES.findIndex(F=>F.move&&F.move.capId===ME_ID); }
    S.visited={}; S.bet=null; buildMap(); decorate();
  },
  unload(){ clearPT(); },
  start(){ begin(); }
});
})();
