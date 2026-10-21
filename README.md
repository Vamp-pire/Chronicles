# 체스 빙의록 (Chronicles)

체스의 역사를 따라가며, 사건마다 사람·말·기계에 '빙의'해 체험하는 웹 게임입니다.
`index.html`을 브라우저로 열면 바로 실행됩니다 (설치·빌드 없음).

## 구조: 뼈대(플레이어) + 장(카세트)

```
index.html              무대·대사창 틀, 장 목록(<script> 줄)
css/engine.css          공통 모양 (색, 무대, 체스판, 대사창, 빙의 연출)
js/engine.js            뼈대: 장면 전환, 대사, 빙의/시간 연출, 체스 규칙, 판 그리기, 관전, 장 갈아 끼우기
assets/pieces/          말 그림 (Cburnett, Alfaerie)
chapters/
  ch1/  chapter.js  style.css  img/        제1장 · 여덟 칸의 전쟁터 (인도, 차투랑가)
  ch2/  chapter.js  data.js  style.css  img/  제2장 · 비단길 위의 말 (페르시아·아랍, 샤트란지)
```

- **장(카세트)** 하나는 `chapters/chN/` 폴더 하나입니다. 이야기 흐름(`chapter.js`), 기보·해설 같은 데이터(`data.js`), 그 시대 꾸밈(`style.css`), 그림(`img/`)을 갖습니다.
- **꾸밈(테마)** 은 `body[data-ch="chN"]` 아래에만 적용되게 씁니다. 그래서 장마다 다른 그림체·테두리·색을 써도 서로 섞이지 않습니다.
- 주소 끝에 `#ch2`를 붙이면 그 장부터 시작합니다 (만들 때 확인용). 머리말의 장 선택 상자로도 이동할 수 있습니다.

## 새 장 추가하기

1. `chapters/ch3/` 폴더를 만들고 `chapter.js`, `style.css`, `img/`를 둡니다.
2. `chapter.js`에서 `G.register({...})`로 장을 등록합니다. 최소한 이렇게:

```js
G.register({
  id:'ch3', no:3, title:'코끼리가 주교가 되는 곳', card:['제목','제3장 · 부제'],
  arts:`<svg class="art" id="art-장면이름">…</svg>`,   // 이 장의 장면 그림들
  firstArt:'장면이름',
  pieceNames:{K:'왕',…}, legendTitle:'…', legend:[['K','왕','설명'],…], rulesNote:'…', credits:'…',
  init(){ /* 그림 꾸밈 등 준비 */ },
  start(){ G.scene({who:'…', place:'…', html:'<p>…</p>', choices:[{label:'…', primary:true, go:다음함수}]}); }
});
```

3. `index.html` 아래쪽 장 목록에 `<script src="chapters/ch3/chapter.js"></script>`를, 위쪽에 `style.css` 링크를 한 줄씩 추가합니다.

## 뼈대가 주는 도구 (`G.…`)

| 도구 | 하는 일 |
|---|---|
| `G.scene({who, place, art, html, choices, after})` | 장면 하나 보여 주기 (누구, 어디, 배경, 대사, 선택지) |
| `G.say(html)` / `G.setChoices([...])` | 대사만 / 선택지만 바꾸기 |
| `G.art(name)` | 배경 그림 바꾸기 (`#art-name`) |
| `G.possessFx(그림, 다음, {small})` | 빙의 연출 |
| `G.slipFx('1977', 다음)` | 시간 미끄러짐 연출 |
| `G.match(true/false)` | 체스판 보이기/숨기기 |
| `G.board.draw(판, id들, 수, 움직임?, 내말id)` | 판 그리기 |
| `G.board.onCell = s=>{…}` | 판 칸 누름 처리 (퍼즐용) |
| `G.watch({frames, notes, autoNote, meId, stops, plainMs, noteMs, onEnd, …})` | 기보 관전 (재생·멈춤·속도) |
| `G.rules.buildFrames(기보)` / `legal` / `make` / `attacked` | 차투랑가·샤트란지 규칙 |
| `G.gain(key, 이름, 그림)` | 여러 장에 걸쳐 모으는 물건 |
| `G.later(fn, ms)` | 장이 바뀌면 자동 취소되는 타이머 |
| `G.next()` / `G.load('ch1')` | 다음 장 / 특정 장으로 |

## 출처

- 말 그림: Cburnett 세트(Colin M.L. Burnett, lichess chessground 배포본), 코끼리·대신은 The Chess Variant Pages 그래픽(Alfaerie 세트로 추정, David Howe, 비상업 이용·출처 표기 조건).
- 장면 그림: Canva AI로 생성.
- 기보와 퍼즐은 실제 기록이 아니라 각 시대 규칙으로 컴퓨터가 만들고 검증한 것입니다. 역사 설명은 확인 중인 초안입니다.
