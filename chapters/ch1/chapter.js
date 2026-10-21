/* 제1장 · 여덟 칸의 전쟁터 (인도, 차투랑가)
   이 장(카세트)이 가진 것: 장면 그림, 이야기 흐름, 대국 기보와 해설. */
(function(){
const {$, scene, say, setChoices, possessFx, img, IMG, banner, rules, board} = G;
const D='chapters/ch1/img/';

const ARTS=`
  <svg class="art" id="art-museum" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><radialGradient id="mGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe3a0" stop-opacity=".9"/><stop offset="1" stop-color="#ffe3a0" stop-opacity="0"/></radialGradient></defs>
    <g class="kb"><image href="${D}museum.jpg" width="800" height="450"/></g>
    <polygon class="beam" points="372,0 412,0 512,400 270,400" fill="#ffe3a0"/>
    <circle class="elephant-glow" cx="393" cy="262" r="46" fill="url(#mGlow)"/>
    <g id="motes"></g>
  </svg>
  <svg class="art" id="art-court" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><radialGradient id="cGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd27a" stop-opacity=".75"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs>
    <g class="kb"><image href="${D}court.jpg" width="800" height="450"/></g>
    <circle class="lampglow" cx="107" cy="140" r="30" fill="url(#cGlow)"/>
    <circle class="lampglow" cx="688" cy="140" r="30" fill="url(#cGlow)"/>
    <g fill="none" stroke="#f1e9da" stroke-width="1.6" stroke-linecap="round" opacity=".55">
      <path class="smoke" d="M107 128 q-6 -12 0 -24 t0 -24"/><path class="smoke" d="M107 128 q6 -12 0 -24 t0 -24"/>
      <path class="smoke" d="M688 128 q-6 -12 0 -24 t0 -24"/><path class="smoke" d="M688 128 q6 -12 0 -24 t0 -24"/>
    </g>
  </svg>
  <svg class="art" id="art-caravan" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="dSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d1940"/><stop offset=".55" stop-color="#6a3a5a"/><stop offset="1" stop-color="#e89a52"/></linearGradient></defs>
    <rect width="800" height="450" fill="url(#dSky)"/>
    <circle cx="610" cy="250" r="54" fill="#f5c46b" opacity=".9"/>
    <g class="dune-far"><path d="M0 330 Q150 270 300 320 T600 310 T900 320 T1200 310 T1600 320 V450 H0 Z" fill="#a7593f"/></g>
    <g class="dune-near"><path d="M0 370 Q200 330 400 365 T800 360 T1200 365 T1600 360 V450 H0 Z" fill="#6e3436"/></g>
    <g fill="#24172a" transform="translate(330 0)">
      <g class="camel"><ellipse cx="120" cy="335" rx="34" ry="16"/><ellipse cx="114" cy="318" rx="14" ry="12"/><path d="M148 330 Q166 300 168 292 L180 290 L182 298 L172 300 Q166 318 152 340 Z"/><rect x="94" y="344" width="5" height="30"/><rect x="104" y="344" width="5" height="30"/><rect x="132" y="344" width="5" height="30"/><rect x="142" y="344" width="5" height="30"/><rect x="104" y="296" width="20" height="10" fill="#7a2a2e"/></g>
      <g class="camel" transform="translate(-120 6)"><ellipse cx="120" cy="335" rx="34" ry="16"/><ellipse cx="114" cy="318" rx="14" ry="12"/><path d="M148 330 Q166 300 168 292 L180 290 L182 298 L172 300 Q166 318 152 340 Z"/><rect x="94" y="344" width="5" height="30"/><rect x="104" y="344" width="5" height="30"/><rect x="132" y="344" width="5" height="30"/><rect x="142" y="344" width="5" height="30"/></g>
      <g class="camel" transform="translate(-240 10)"><ellipse cx="120" cy="335" rx="34" ry="16"/><ellipse cx="114" cy="318" rx="14" ry="12"/><path d="M148 330 Q166 300 168 292 L180 290 L182 298 L172 300 Q166 318 152 340 Z"/><rect x="94" y="344" width="5" height="30"/><rect x="104" y="344" width="5" height="30"/><rect x="132" y="344" width="5" height="30"/><rect x="142" y="344" width="5" height="30"/></g>
    </g>
    <g id="sand" fill="#f3d9a8"></g>
  </svg>`;

/* ---- 대국: 미리 검증한 61수 기보 ---- */
const GAME=[[10,18],[61,43],[15,23],[58,44],[14,22],[62,45],[6,21],[45,35],[21,36],[53,45],[18,26],[45,36],[26,35],[44,62],[23,31],[36,28],[1,18],[55,47],[18,28],[43,25],[8,16],[25,11],[4,11],[49,41],[31,39],[41,33],[5,19],[57,40],[19,33],[60,53],[2,20],[59,58],[22,30],[40,57],[16,24],[51,43],[13,21],[58,49],[24,32],[63,55],[32,40],[49,58],[21,29],[50,42],[35,42],[57,42],[0,2],[62,44],[2,42],[58,57],[7,31],[44,30],[31,30],[43,35],[28,34],[53,60],[29,37],[55,63],[30,25],[63,62],[33,19]];
const ME_ID=4; // e1에서 시작하는 흰 만트리
const NAME={K:'라자(왕)',F:'만트리(대신)',E:'가자(코끼리)',N:'아슈바(기병)',R:'라타(전차)',P:'파다티(보병)'};
const NOTES={
 0:['narr','신하가 첫 수를 둡니다. 보병은 처음에도 한 칸만 걷습니다. 두 칸 전진은 천 년 가까이 지나서야 생깁니다.'],
 1:['narr','왕의 코끼리가 대각선 두 칸을 <b>훌쩍 뛰어넘습니다</b>. 앞을 막은 보병쯤은 상관없습니다.'],
 5:['narr','왕의 기병이 나섭니다. 이 말만은 지금의 나이트와 똑같이 움직입니다.'],
 8:['me','우리 기병이 적진 한가운데로 뛰어들었다. 너무 깊다…'],
 11:['narr','왕의 보병이 기병을 <b>잡습니다</b>! 신하들 사이에서 탄식이 새어 나옵니다.'],
 12:['narr','신하도 곧바로 보병으로 왕의 기병을 되갚습니다.'],
 18:['narr','신하의 기병이 e4의 보병을 잡고 중앙에 자리 잡습니다.'],
 21:['me','왕의 코끼리가 d2까지 뛰어들었다. 바로 내 옆이다. 이번엔 내가 움직일 차례다.'],
 22:['me','대각선으로 <b>단 한 칸</b>. 처음으로 몸을 움직여 코끼리를 잡았다. 느리지만, 왕 곁을 지키기엔 충분하다.'],
 28:['narr','신하의 코끼리가 b5의 보병을 잡습니다. 이 코끼리는 마지막에 다시 등장합니다.'],
 31:['narr','왕이 직접 걸어서 몸을 피합니다. 차투랑가에는 캐슬링이 없습니다.'],
 40:['narr','a6까지 올라간 보병이 b7을 찌릅니다. <b>장군!</b>'],
 44:['narr','신하의 보병이 c6을 잡고, 왕의 기병이 다시 잡아 갑니다. 주고받기가 이어집니다.'],
 46:['narr','전차가 열린 c줄로 미끄러지듯 달려갑니다.'],
 48:['narr','전차가 기병을 잡으며 <b>장군!</b> 왕의 얼굴이 굳어집니다.'],
 51:['narr','왕의 코끼리가 g4의 보병을 잡아 반격합니다.'],
 52:['narr','기다렸다는 듯 다른 전차가 코끼리를 잡습니다.'],
 58:['me','전차가 b줄로 옮겼다. 그 앞을 우리 코끼리가 가리고 있다. 코끼리가 비키는 순간…'],
 60:['me','코끼리가 비켜서자 전차의 길이 열렸다. <b>숨은 장군, 외통</b>이다.']
};
function autoNote(m){ const who=m.p[0]==='w'?'신하':'왕'; const nm=NAME[m.p[1]].split('(')[0];
  let t=`${who}의 ${nm}가 ${G.SQ(m.fr)}에서 ${G.SQ(m.to)}로 움직입니다.`;
  if(m.cap) t=`${who}의 ${nm}가 ${G.SQ(m.to)}의 ${NAME[m.cap[1]].split('(')[0]}를 잡습니다.`;
  if(m.check) t+=' <b>장군!</b>';
  return ['narr',t]; }
let FRAMES=null;
const S={reward:null};

/* ---- 이야기 ---- */
function intro(){
  G.stage.classList.remove('match','awake'); G.art('museum');
  scene({who:'현대의 나',place:'현대 · 박물관 체스 특별전',html:`
    <p>전시실 맨 끝, 유리관 안에 상아로 깎은 작은 코끼리가 놓여 있습니다. 설명판에는 "인도, 체스의 조상 '차투랑가'의 말로 추정"이라고만 적혀 있습니다.</p>`,
    choices:[{label:'유리관에 손을 댄다',primary:true,go:touch}]});
}
function touch(){
  G.stage.classList.add('awake');
  scene({html:`<p>손끝이 유리에 닿자 코끼리의 눈이 빛납니다. 바닥이 기울고, 향 냄새와 북소리가 밀려옵니다.</p>`,
    choices:[{label:'빛 속으로 빨려 들어간다',primary:true,go:()=>possessFx(IMG.alf_welephant,court,{small:true})}]});
}
function court(){
  G.stage.classList.remove('awake');
  scene({art:'court',who:'궁정 신하 비슈누다타',place:'인도 · 약 6세기경(추정)의 어느 왕궁',html:`
    <p>눈을 뜨니 당신은 다른 사람의 몸 안에 있습니다. 젊은 신하 비슈누다타. 그의 앞에는 여덟 줄 여덟 칸의 천, <b>아슈타파다</b>가 펼쳐져 있습니다.</p>
    <p>그 위에 보병, 기병, 코끼리, 전차가 섰습니다. 인도 군대의 네 부분, 그래서 이름이 <b>차투랑가</b>입니다.</p>
    <p class="say">"전쟁을 판 위에 올렸단 말이냐?" 왕이 몸을 기울입니다. "마음에 든다. 원하는 상을 말해 보아라."</p>`,
    choices:[
      {label:'금화 천 닢을 청한다',go:()=>reward('gold')},
      {label:'작은 마을 하나를 청한다',go:()=>reward('village')},
      {label:'"판의 첫 칸에 쌀 한 톨, 다음 칸에는 두 배씩 주십시오."',go:()=>reward('rice')}]});
}
function reward(k){
  S.reward=k;
  if(k!=='rice'){
    scene({html:`<p class="say">"${k==='gold'?'금화라니, 소박하구나':'마을 하나라, 욕심이 적구나'}." 왕이 웃습니다. "좋다. 그 전에 네 놀이를 내 눈으로 보고 싶다. 네가 내 장수와 한 판 겨뤄 보아라. 이기면 상을 두 배로 주마."</p>`,
      choices:[{label:'판 앞에 앉는다',primary:true,go:toPiece}]}); return; }
  scene({html:`<p class="say">"고작 쌀 몇 톨이라니!"</p><p>왕이 재상에게 쌀을 세어 오라 명합니다. 칸을 눌러 재상과 함께 세어 보세요.</p>`, after:riceGame});
}
function riceGame(){
  const x=$('extra');
  x.innerHTML='<div class="rice" id="rice"></div><p class="note" style="margin:10px 0 0">지금까지 <span class="big" id="riceSum">0</span> 톨</p>';
  const grid=$('rice'); let n=0; const cells=[]; const fmt=v=>v.toLocaleString('ko-KR');
  for(let i=0;i<64;i++){ const b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label',(i+1)+'번째 칸'); b.addEventListener('click',step); grid.appendChild(b); cells.push(b); }
  function fill(i){ cells[i].classList.add('on'); if(i<10) cells[i].textContent=String(2**i); }
  function step(){ if(n>=10) return; fill(n); n++; $('riceSum').textContent=fmt(2n**BigInt(n)-1n); if(n===10) more(); }
  function more(){
    setChoices([{label:'64칸 끝까지 계산하기',primary:true,go:()=>{ setChoices([]); const t=G.every(()=>{ fill(n); n++; $('riceSum').textContent=fmt(2n**BigInt(n)-1n);
      if(n>=64){ clearInterval(t);
        say('<p><span class="say">재상의 얼굴이 하얗게 질립니다.</span> 1,800경 톨이 넘습니다. 전설에서는 온 세상의 쌀을 다 모아도 모자란 양이라고 합니다.</p><p class="say">"…좋다. 네 놀이로 내 장수를 이긴다면 생각해 보마."</p>');
        setChoices([{label:'판 앞에 앉는다',primary:true,go:toPiece}]); } }, G.reduce?0:45); }}]); }
}
function toPiece(){
  possessFx(IMG.alf_wferz,()=>{
    G.match(true); board.clear(); const F=FRAMES[0]; board.draw(F.b,F.ids,null,false,ME_ID);
    scene({who:'만트리(대신)',place:'아슈타파다 위 · 왕 곁의 칸',html:`
      <p>판 앞에 앉는 순간 시야가 뒤집힙니다. 몸이 작아지고, 단단해지고, 차가워집니다. 당신은 이제 <b>만트리</b>, 왕 곁을 지키는 대신 말입니다.</p>
      <p>몸을 움직여 보려 하지만 <b>대각선으로 단 한 칸</b>밖에 나아가지 못합니다. 먼 훗날 판 끝까지 내달릴 퀸의 조상은, 지금은 이렇게 느립니다.</p>
      <p class="note">당신은 말이라 판을 직접 둘 수 없습니다. 아래쪽 흰 군대(신하 편)와 왕의 장수가 두는 판을 지켜보세요. "나" 표시가 빙의한 만트리입니다.</p>`,
      choices:[{label:'대국 시작',primary:true,go:watch}]});
  },{small:true});
}
function watch(){
  G.watch({frames:FRAMES, notes:NOTES, autoNote, meId:ME_ID,
    startText:'북이 한 번 울립니다. 신하 편이 먼저 둡니다.',
    who:(k,kind)=>kind==='me'?'만트리(대신) · 속마음':'만트리(대신)',
    check:'장 군', mate:'외 통', plainMs:1300, noteMs:3200, endDelay:1600, onEnd:ending});
}
function ending(){
  const r=S.reward==='rice'?'쌀':S.reward==='gold'?'금화 이천 닢':S.reward==='village'?'마을 두 곳':'상';
  scene({who:'만트리(대신)',html:`<p class="say">"숨은 장군이라…" 왕이 한참 판을 내려다보다 크게 웃습니다. "약속대로 ${r}을(를) 주마.${S.reward==='rice'?' 다만 세상의 쌀을 다 모을 때까지 기다려야 할 게다.':''}"</p>`,
    choices:[{label:'다시 보기',go:()=>{ banner(''); watch(); }},{label:'다음으로',primary:true,go:farewell}]});
}
function farewell(){
  banner('');
  possessFx(IMG.alf_welephant,()=>{
    G.match(false);
    scene({art:'caravan',who:'…',place:'시간의 틈 · 비단길 어딘가',html:`
      <p>만트리의 딱딱한 몸이 풀리고, 당신은 다시 어디에도 속하지 않은 의식이 됩니다.</p>
      <p>바람에 모래 냄새가 섞여 있습니다. 낙타 방울 소리. 페르시아로 향하는 상인들의 짐 속에서, 같은 판이 조금 다른 이름으로 불리고 있습니다.</p>`,
      choices:[{label:'제2장 · 비단길 위의 말',primary:true,go:()=>G.next()},{label:'1장 처음부터 다시 보기',go:intro}]});
  },{small:true});
}

/* ---- 꾸밈 ---- */
function decorate(){
  const NS=G.NS, m=$('motes');
  for(let i=0;i<26;i++){ const c=document.createElementNS(NS,'circle'); c.setAttribute('cx',330+Math.random()*130); c.setAttribute('cy',120+Math.random()*260); c.setAttribute('r',(.6+Math.random()*1.6).toFixed(1)); c.setAttribute('fill','#fff1c9'); c.setAttribute('class','mote'); c.style.setProperty('--dx',(Math.random()*40-20)+'px'); c.style.animationDuration=(5+Math.random()*6)+'s'; c.style.animationDelay=(-Math.random()*10)+'s'; m.appendChild(c); }
  const s=$('sand');
  for(let i=0;i<30;i++){ const c=document.createElementNS(NS,'circle'); c.setAttribute('cx',400+Math.random()*420); c.setAttribute('cy',300+Math.random()*140); c.setAttribute('r',(.5+Math.random()*1.2).toFixed(1)); c.setAttribute('class','sand'); c.style.animationDuration=(2+Math.random()*3)+'s'; c.style.animationDelay=(-Math.random()*4)+'s'; s.appendChild(c); }
}

G.register({
  id:'ch1', no:1, title:'여덟 칸의 전쟁터', card:['체스 빙의록','제1장 · 여덟 칸의 전쟁터'],
  arts:ARTS, firstArt:'museum', firstWho:'현대의 나', firstPlace:'현대 · 박물관',
  pieceNames:NAME, sides:{w:'신하 편 ',b:'왕 편 '},
  legendTitle:'차투랑가 말과 규칙',
  legend:[['K',NAME.K,'아무 방향 한 칸'],['F',NAME.F,'대각선 한 칸. 훗날 퀸이 됩니다'],['E',NAME.E,'대각선 두 칸을 뛰어넘음. 훗날 비숍'],['N',NAME.N,'지금의 나이트와 같음'],['R',NAME.R,'지금의 룩과 같음'],['P',NAME.P,'앞으로 한 칸, 대각선으로 잡음']],
  rulesNote:'캐슬링 없음. 보병은 처음에도 한 칸만 가고, 끝 줄에 닿으면 만트리가 됩니다. 외통, 스테일메이트(둘 수 없게 만들기), 상대 왕만 남기기로 이깁니다.',
  credits:'말 그림: 왕·말·전차·보병은 Colin M.L. Burnett의 Cburnett 세트(lichess chessground 배포본), 코끼리·만트리는 <a href="https://chessvariants.org/graphics.dir" target="_blank" rel="noopener">The Chess Variant Pages</a> 그래픽(Alfaerie 세트로 추정, David Howe). 규칙은 Chess.com 차투랑가 안내 기준. 박물관·궁정 그림은 Canva AI로 생성, 비단길 그림은 직접 그린 임시 일러스트이며, 역사 설명은 확인 중인 초안입니다.',
  init(){ decorate(); if(!FRAMES) FRAMES=rules.buildFrames(GAME); S.reward=null; },
  start(){ intro(); }
});
})();
