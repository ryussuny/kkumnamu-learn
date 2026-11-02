/* 화면 부품: 캐릭터, 그림(시계·분수 막대·별), 문제 입력 방식(보기·숫자판·순서 맞추기) */
(function (g) {
  var KN = g.KN = g.KN || {};
  var ui = KN.ui = {};

  /* ---------- 캐릭터 ---------- */
  KN.chars = [
    { id: 'princess', name: '공주', emoji: '👸', color: '#ffc2d9' },
    { id: 'prince', name: '왕자', emoji: '🤴', color: '#cfe3ff' },
    { id: 'robot', name: '로봇', emoji: '🤖', color: '#d7e2ee' },
    { id: 'idol-girl', name: '별빛 아이돌', emoji: '🎤', color: '#ffd0f0' },
    { id: 'idol-girl2', name: '리본 아이돌', emoji: '🎤', color: '#e6dcff' },
    { id: 'idol-boy', name: '은빛 아이돌', emoji: '🎸', color: '#fff0c2' },
    { id: 'idol-boy2', name: '스타 아이돌', emoji: '🎸', color: '#c8f0ff' },
    { id: 'astronaut', name: '우주비행사', emoji: '🧑‍🚀', color: '#d9d4ff' },
    { id: 'knight', name: '기사', emoji: '🛡️', color: '#e2e6ee' },
    { id: 'wizard', name: '마법사', emoji: '🧙', color: '#e1d1ff' },
    { id: 'fairy', name: '요정', emoji: '🧚', color: '#d4f7e4' },
    { id: 'ninja', name: '닌자', emoji: '🥷', color: '#d6d6dd' },
    { id: 'detective', name: '탐정', emoji: '🕵️', color: '#f6e2c4' },
    { id: 'dino', name: '공룡친구', emoji: '🦖', color: '#d3f2c4' }
  ];
  /* 캐릭터마다 말투가 다른 한마디. 능력 칭찬이 아니라 노력·시작·다시 해 보기를 격려한다. {n} = 아이 별명 */
  var SAY = {
    princess: { hi: ['{n}, 오늘도 반가워요. 천천히 함께 해 봐요.', '{n}, 오늘은 어떤 공부를 해 볼까요?'], great: ['끝까지 차분히 풀었어요. 정말 멋져요!', '차근차근 해낸 모습이 빛나요.'], retry: ['괜찮아요. 틀린 문제는 다시 볼 수 있어요.', '천천히 다시 해 보면 돼요.'] },
    prince: { hi: ['{n}, 오늘도 용기 있게 시작해 볼까요?', '{n}, 모험을 떠날 시간이에요!'], great: ['끝까지 해낸 용기가 대단해요!', '멋진 도전이었어요.'], retry: ['쓰러져도 다시 일어나면 돼요.', '한 걸음 물러나서 다시 도전해 봐요.'] },
    robot: { hi: ['삐빅! {n}, 학습 준비 완료!', '{n}, 오늘의 연습을 시작합니다.'], great: ['정답 신호 많이 감지! 집중한 결과예요.', '삐빅, 끝까지 해냈어요!'], retry: ['오류 발견! 다시 한 번 계산해 봐요.', '괜찮아요, 다시 입력하면 돼요.'] },
    'idol-girl': { hi: ['{n}, 오늘 연습도 파이팅!', '{n}, 같이 연습해요!'], great: ['오늘 무대 최고였어요!', '꾸준한 연습이 빛났어요.'], retry: ['연습하면 더 좋아져요.', '다시 한 번 무대에 서 봐요.'] },
    'idol-girl2': { hi: ['{n}, 오늘도 반짝반짝 시작해요!', '{n}, 리허설 준비됐나요?'], great: ['완벽한 무대였어요!', '끝까지 연습한 모습이 반짝여요.'], retry: ['한 번 더 맞춰 보면 돼요.', '괜찮아요, 다시 리허설해요.'] },
    'idol-boy2': { hi: ['{n}, 무대 위로 출발!', '{n}, 오늘도 멋지게 해 봐요!'], great: ['앙코르 나올 만한 무대였어요!', '끝까지 집중해서 멋졌어요.'], retry: ['다음 무대는 더 좋아질 거예요.', '괜찮아요, 한 번 더 가 봐요!'] },
    'idol-boy': { hi: ['{n}, 컨디션 좋아요? 같이 연습해요!', '{n}, 오늘도 한 곡 해 볼까요?'], great: ['멋진 무대였어요!', '끝까지 집중한 게 보여요.'], retry: ['연습은 거짓말하지 않아요. 다시 해 봐요.', '괜찮아요, 한 번 더!'] },
    astronaut: { hi: ['{n}, 공부 우주선 출발 준비!', '{n}, 오늘은 어느 별로 가 볼까요?'], great: ['목표 지점 도착! 끝까지 날아갔어요.', '멋진 비행이었어요.'], retry: ['궤도를 조금 고쳐서 다시 도전해요.', '괜찮아요, 다시 발사해 봐요.'] },
    knight: { hi: ['{n}, 오늘의 모험을 시작해요.', '{n}, 준비됐나요? 함께 가요.'], great: ['끝까지 지켜 낸 모습이 든든해요.', '훌륭한 한 판이었어요.'], retry: ['방패를 다시 들고 한 번 더 해 봐요.', '괜찮아요, 연습하는 기사가 강해져요.'] },
    wizard: { hi: ['{n}, 마법 같은 공부 시간이에요.', '{n}, 주문을 하나씩 익혀 볼까요?'], great: ['주문을 끝까지 외웠어요!', '차분히 집중한 마법이 통했어요.'], retry: ['주문은 연습할수록 잘 돼요.', '괜찮아요, 다시 한 번 외워 봐요.'] },
    fairy: { hi: ['{n}, 반짝반짝 함께 해 봐요.', '{n}, 오늘도 반가워요.'], great: ['반짝이는 한 판이었어요!', '끝까지 해낸 마음이 예뻐요.'], retry: ['괜찮아요, 천천히 다시 날아 봐요.', '조금씩 반짝여지고 있어요.'] },
    ninja: { hi: ['{n}, 조용히 집중, 시작!', '{n}, 오늘의 수련을 시작해요.'], great: ['집중력 수련 완료!', '끝까지 해낸 수련이었어요.'], retry: ['수련은 반복이 중요해요. 다시 해 봐요.', '괜찮아요, 한 번 더 집중!'] },
    detective: { hi: ['{n}, 오늘의 단서를 찾아볼까요?', '{n}, 수사 시작해요.'], great: ['사건 해결! 끝까지 파고들었어요.', '꼼꼼한 수사였어요.'], retry: ['단서를 다시 살펴보면 보일 거예요.', '괜찮아요, 다시 수사해 봐요.'] },
    dino: { hi: ['어흥! {n}, 오늘도 쑥쑥 자라요!', '{n}, 같이 공부하자 어흥!'], great: ['어흥! 끝까지 해냈어요!', '쑥쑥 자라고 있어요.'], retry: ['괜찮아요, 천천히 다시 해 봐요 어흥.', '넘어져도 다시 일어나면 돼요.'] }
  };
  KN.say = function (charId, kind, name, seed) {
    var o = SAY[charId] || SAY.princess, arr = o[kind] || o.hi;
    return arr[(seed || 0) % arr.length].replace('{n}', name);
  };

  KN.charOf = function (id) { for (var i = 0; i < KN.chars.length; i++) if (KN.chars[i].id === id) return KN.chars[i]; return KN.chars[0]; };

  var HATS = {
    'hat-ribbon': '<svg class="hat" viewBox="0 0 100 50"><path d="M50 30 L18 10 L18 46 Z" fill="#ff5c8a"/><path d="M50 30 L82 10 L82 46 Z" fill="#ff5c8a"/><circle cx="50" cy="30" r="9" fill="#e0245e"/></svg>',
    'hat-party': '<svg class="hat" viewBox="0 0 100 56"><path d="M50 4 L74 54 L26 54 Z" fill="#7cc4ff"/><path d="M40 30 L60 30 L67 44 L33 44 Z" fill="#fff" opacity=".6"/><circle cx="50" cy="6" r="6" fill="#ffd25e"/></svg>',
    'hat-crown': '<svg class="hat" viewBox="0 0 100 54"><path d="M16 48 L16 14 L36 30 L50 6 L64 30 L84 14 L84 48 Z" fill="#ffc933" stroke="#e09a00" stroke-width="3" stroke-linejoin="round"/><circle cx="50" cy="36" r="5" fill="#ff5c8a"/><circle cx="30" cy="40" r="3.5" fill="#4aa3ff"/><circle cx="70" cy="40" r="3.5" fill="#4aa3ff"/></svg>',
    'hat-star': '<svg class="hat" viewBox="0 0 100 70"><polygon points="50,4 60,28 86,28 65,44 73,68 50,54 27,68 35,44 14,28 40,28" fill="#ffd25e" stroke="#e09a00" stroke-width="3" stroke-linejoin="round"/></svg>',
    'hat-band': '<svg class="hat" viewBox="0 0 100 50"><path d="M10 44 Q50 -8 90 44" fill="none" stroke="#b79cff" stroke-width="10" stroke-linecap="round"/><circle cx="50" cy="12" r="6" fill="#ff7aa2"/></svg>',
    'hat-cap': '<svg class="hat" viewBox="0 0 110 50"><path d="M16 42 Q16 6 50 6 Q84 6 84 42 Z" fill="#4aa3ff"/><path d="M62 40 Q106 36 106 46 L60 46 Z" fill="#2a78c8"/><circle cx="50" cy="6" r="4" fill="#2a78c8"/></svg>'
  };
  ui.hatSvg = function (id) { return HATS[id] || ''; };

  /* o: 프로필 또는 {char, deco}.  cls: 'sm' | 'lg' */
  ui.avatar = function (o, cls) {
    var c = KN.charOf(o.char), deco = o.deco || {};
    var bg = KN.rewards.findDecor(deco.bg || 'bg-pink');
    var css = bg && bg.css ? bg.css : c.color;
    return '<div class="avatar ' + (cls || '') + '"><div class="disc" style="background:' + css + '">' +
      '<img src="assets/chars/' + c.id + '.png" alt="' + KN.esc(c.name) + '" data-char="' + c.id + '" onerror="KN.ui.imgFail(this)">' +
      '</div>' + (deco.hat ? HATS[deco.hat] || '' : '') + '</div>';
  };
  ui.imgFail = function (img) {
    var c = KN.charOf(img.getAttribute('data-char'));
    var d = document.createElement('div');
    d.className = 'afb'; d.style.background = c.color; d.textContent = c.emoji; d.setAttribute('role', 'img'); d.setAttribute('aria-label', c.name);
    if (img.parentNode) img.parentNode.replaceChild(d, img);
  };

  /* ---------- 그림 ---------- */
  ui.clock = function (h, m) {
    var cx = 80, cy = 80, s = '<svg viewBox="0 0 160 160" width="170" height="170" role="img" aria-label="시계"><circle cx="80" cy="80" r="74" fill="#fff" stroke="#3a3352" stroke-width="5"/>';
    for (var i = 1; i <= 12; i++) {
      var a = i * 30 * Math.PI / 180, x = cx + 58 * Math.sin(a), y = cy - 58 * Math.cos(a);
      s += '<text x="' + x.toFixed(1) + '" y="' + (y + 6).toFixed(1) + '" text-anchor="middle" font-size="17" font-weight="800" fill="#3a3352">' + i + '</text>';
    }
    for (var k = 0; k < 60; k++) {
      var b = k * 6 * Math.PI / 180, r1 = k % 5 === 0 ? 68 : 71;
      s += '<line x1="' + (cx + r1 * Math.sin(b)).toFixed(1) + '" y1="' + (cy - r1 * Math.cos(b)).toFixed(1) + '" x2="' + (cx + 74 * Math.sin(b)).toFixed(1) + '" y2="' + (cy - 74 * Math.cos(b)).toFixed(1) + '" stroke="#3a3352" stroke-width="' + (k % 5 === 0 ? 2.5 : 1) + '"/>';
    }
    var ha = ((h % 12) + m / 60) * 30 * Math.PI / 180, ma = m * 6 * Math.PI / 180;
    s += '<line x1="80" y1="80" x2="' + (cx + 34 * Math.sin(ha)).toFixed(1) + '" y2="' + (cy - 34 * Math.cos(ha)).toFixed(1) + '" stroke="#ff5c8a" stroke-width="8" stroke-linecap="round"/>';
    s += '<line x1="80" y1="80" x2="' + (cx + 52 * Math.sin(ma)).toFixed(1) + '" y2="' + (cy - 52 * Math.cos(ma)).toFixed(1) + '" stroke="#2a78c8" stroke-width="5" stroke-linecap="round"/>';
    return s + '<circle cx="80" cy="80" r="6" fill="#3a3352"/></svg>';
  };
  ui.bar = function (k, n) {
    var w = 260, h = 44, s = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="' + n + '칸 중 ' + k + '칸 색칠"><g>';
    for (var i = 0; i < n; i++) s += '<rect x="' + (2 + i * (w - 4) / n).toFixed(1) + '" y="2" width="' + ((w - 4) / n).toFixed(1) + '" height="' + (h - 4) + '" fill="' + (i < k ? '#ff9ec0' : '#fff') + '" stroke="#3a3352" stroke-width="2.5"/>';
    return s + '</g></svg>';
  };
  ui.star = function (on, size) {
    return '<svg viewBox="0 0 24 24" width="' + (size || 54) + '" height="' + (size || 54) + '"><polygon points="12,1.5 15,8.5 22.5,9 16.8,14 18.7,21.5 12,17.5 5.3,21.5 7.2,14 1.5,9 9,8.5" fill="' + (on ? '#ffd25e' : '#e8dfcf') + '" stroke="' + (on ? '#e09a00' : '#d3c8b2') + '" stroke-width="1.2" stroke-linejoin="round"/></svg>';
  };
  ui.smallStars = function (n, max) { var s = ''; for (var i = 0; i < (max || 3); i++) s += i < n ? '★' : '<span class="off">★</span>'; return '<span class="stars">' + s + '</span>'; };
  ui.visual = function (v) {
    if (!v) return '';
    if (v.clock) return '<div class="visual">' + ui.clock(v.clock[0], v.clock[1]) + '</div>';
    if (v.bar) return '<div class="visual">' + ui.bar(v.bar[0], v.bar[1]) + '</div>';
    return '';
  };

  /* ---------- 문제 입력 방식 ----------
     각 함수: (host, q, ctx, done)  →  done({score, given})  */
  KN.qui = {};
  var HAS_LONG = function (arr) { return arr.some(function (c) { return String(c).length > 12; }); };

  KN.qui.choice = function (host, q, ctx, done) {
    host.innerHTML = '<div class="choices' + (HAS_LONG(q.choices) ? ' one' : '') + '">' + q.choices.map(function (c, i) { return '<button class="choice" data-i="' + i + '">' + KN.showAns(c) + '</button>'; }).join('') + '</div>';
    var locked = false;
    host.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.choice'); if (!b || locked) return;
      locked = true;
      var given = q.choices[+b.getAttribute('data-i')], ok = KN.isRight(q, given);
      var all = host.querySelectorAll('.choice');
      for (var i = 0; i < all.length; i++) { all[i].disabled = true; if (KN.isRight(q, q.choices[i])) all[i].classList.add('right'); }
      if (!ok) b.classList.add('wrong');
      done({ score: ok ? 1 : 0, given: given });
    });
  };

  KN.qui.num = function (host, q, ctx, done) {
    var val = '', locked = false;
    var ug = (q.unit && KN.unit(q.unit)) ? KN.unit(q.unit).grade : ctx.grade;   /* 프로필이 아니라 문제가 속한 학년 기준 */
    var neg = ug >= 7 || String(q.answer).charAt(0) === '-', dot = true;
    host.innerHTML = '<div class="numshow" id="numshow" aria-live="polite">&nbsp;</div><div class="pad">' +
      ['7', '8', '9', '⌫', '4', '5', '6', neg ? '−' : '', '1', '2', '3', dot ? '.' : '', '0', 'go'].map(function (k) {
        if (k === '') return '<span></span>';
        if (k === 'go') return '<button class="go wide2" data-k="go">확인</button>';
        return '<button data-k="' + k + '">' + k + '</button>';
      }).join('') + '</div>';
    var show = host.querySelector('#numshow');
    function draw() { show.textContent = val === '' ? ' ' : val.replace(/^-/, '−'); }
    host.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('button'); if (!b || locked) return;
      var k = b.getAttribute('data-k');
      if (k === '⌫') val = val.slice(0, -1);
      else if (k === 'go') {
        if (val === '' || val === '-' || val === '.') return;
        locked = true;
        var ok = KN.isRight(q, val);
        show.classList.add(ok ? 'right' : 'wrong');
        var bs = host.querySelectorAll('.pad button'); for (var i = 0; i < bs.length; i++) bs[i].disabled = true;
        done({ score: ok ? 1 : 0, given: val });
        return;
      } else if (k === '−') { if (val === '') val = '-'; }
      else if (k === '.') { if (val.indexOf('.') < 0 && val !== '' && val !== '-') val += '.'; }
      else if (val.length < 9) val += k;
      draw();
    });
    draw();
  };

  /* 순서 맞추기: q.pieces(섞인 조각), q.joiner(조각을 이을 글자, 기본 ' ') */
  KN.qui.order = function (host, q, ctx, done) {
    var pieces = q.pieces, chosen = [], locked = false, joiner = q.joiner == null ? ' ' : q.joiner;
    function draw() {
      host.innerHTML = '<div class="ordbox" id="ob">' + (chosen.length ? chosen.map(function (ix) { return '<button class="tile" data-r="' + ix + '">' + KN.esc(pieces[ix]) + '</button>'; }).join('') : '<span class="sm">아래 조각을 순서대로 눌러요</span>') + '</div>' +
        '<div class="tiles">' + pieces.map(function (t, i) { return '<button class="tile' + (chosen.indexOf(i) >= 0 ? ' used' : '') + '" data-a="' + i + '"' + (chosen.indexOf(i) >= 0 ? ' disabled' : '') + '>' + KN.esc(t) + '</button>'; }).join('') + '</div>' +
        '<div class="gap"><button class="btn big green" id="okb"' + (chosen.length === pieces.length ? '' : ' disabled') + '>확인</button></div>';
    }
    draw();
    host.addEventListener('click', function (e) {
      if (locked) return;
      var t = e.target.closest && e.target.closest('button'); if (!t) return;
      if (t.id === 'okb') {
        locked = true;
        var given = chosen.map(function (ix) { return pieces[ix]; }).join(joiner), ok = KN.isRight(q, given);
        draw();
        var ob = host.querySelector('#ob'); ob.classList.add(ok ? 'right' : 'wrong');
        var bs = host.querySelectorAll('button'); for (var i = 0; i < bs.length; i++) bs[i].disabled = true;
        done({ score: ok ? 1 : 0, given: given });
        return;
      }
      if (t.hasAttribute('data-a')) { chosen.push(+t.getAttribute('data-a')); draw(); }
      else if (t.hasAttribute('data-r')) { var ix = +t.getAttribute('data-r'); chosen = chosen.filter(function (x) { return x !== ix; }); draw(); }
    });
  };

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
