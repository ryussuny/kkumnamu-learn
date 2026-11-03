/* 보상: 캐릭터 레벨, 배지, 꾸미기.
   원칙: 노력·전략을 칭찬한다("똑똑하다" 금지). 연속 학습일을 놓쳐도 벌점·순위표는 없다. */
(function (g) {
  var KN = g.KN = g.KN || {};
  var R = KN.rewards = {};

  /* 경험치 → 레벨 (40, 120, 240, … 삼각수 간격) */
  R.level = function (xp) { return Math.floor((1 + Math.sqrt(1 + 8 * xp / 40)) / 2); };
  R.xpAt = function (lv) { return 40 * lv * (lv - 1) / 2; };
  R.progress = function (xp) { var lv = R.level(xp), a = R.xpAt(lv), b = R.xpAt(lv + 1); return { lv: lv, cur: xp - a, need: b - a }; };

  /* ---------- 칭찬 문구 ---------- */
  R.praiseRight = ['좋아요!', '차근차근 잘 풀었어요.', '끝까지 생각해서 맞혔어요.', '풀이 방법이 좋았어요.', '집중해서 풀었네요.', '한 번에 맞혔어요!'];
  R.praiseStreak = ['연속으로 맞히고 있어요. 집중하는 모습이 보기 좋아요.', '계속 잘 풀고 있어요. 이 속도를 유지해 봐요.'];
  R.praiseWrong = ['괜찮아요. 틀린 문제는 다시 볼 기회예요.', '아쉬워요. 이유를 보면 다음에 더 잘 풀 수 있어요.', '한 번 더 생각해 본 것만으로도 배우는 중이에요.'];
  R.praiseEnd = function (rate) {
    if (rate >= 0.85) return '끝까지 집중해서 풀었어요. 다음 단계에 도전해 볼까요?';
    if (rate >= 0.6) return '한 판을 끝까지 해냈어요. 틀린 문제는 다시 보기에 담아 두었어요.';
    if (rate > 0.4) return '어려운 문제에도 끝까지 도전했어요. 틀린 문제를 다시 보면 더 쉬워져요.';
    return '조금 어려웠죠? 한 단계 쉬운 곳에서 다시 다져 봐요. 도전한 것이 중요해요.';
  };

  /* ---------- 꾸미기 ---------- */
  R.decor = {
    bg: [
      { id: 'bg-pink', name: '핑크', lv: 1, price: 0, css: 'linear-gradient(160deg,#ffd6e0,#ffb3c6)' },
      { id: 'bg-sky', name: '하늘', lv: 1, price: 0, css: 'linear-gradient(160deg,#d6ecff,#9fd3ff)' },
      { id: 'bg-mint', name: '민트', lv: 2, price: 10, css: 'linear-gradient(160deg,#d9fbe9,#9ae6c0)' },
      { id: 'bg-lemon', name: '레몬', lv: 2, price: 10, css: 'linear-gradient(160deg,#fff7c7,#ffe27a)' },
      { id: 'bg-lilac', name: '라일락', lv: 3, price: 20, css: 'linear-gradient(160deg,#ece3ff,#c9b3ff)' },
      { id: 'bg-peach', name: '복숭아', lv: 3, price: 20, css: 'linear-gradient(160deg,#ffe5d0,#ffbb8f)' },
      { id: 'bg-night', name: '밤하늘', lv: 5, price: 40, css: 'radial-gradient(circle at 30% 25%,#5b6bd6 0,#2c3a8c 45%,#161f55 100%)' },
      { id: 'bg-rainbow', name: '무지개', lv: 7, price: 80, css: 'linear-gradient(160deg,#ffb3c6,#ffe27a,#9ae6c0,#9fd3ff,#c9b3ff)' },
      { id: 'bg-sunset', name: '노을', lv: 4, price: 30, css: 'linear-gradient(160deg,#ffd29e,#ff8fa3 60%,#b58cf0)' },
      { id: 'bg-forest', name: '숲속', lv: 5, price: 40, css: 'linear-gradient(160deg,#d6f5c4,#6fcf8f 60%,#2f9a63)' },
      { id: 'bg-ocean', name: '바닷속', gift: true, css: 'linear-gradient(170deg,#bfefff,#4ab8ff 55%,#2457b8)' },
      { id: 'bg-galaxy', name: '은하수', gift: true, css: 'radial-gradient(circle at 70% 30%,#c58bff 0,#5b3fb0 35%,#1b1448 80%)' }
    ],
    hat: [
      { id: 'hat-ribbon', name: '리본', lv: 2, price: 30 },
      { id: 'hat-party', name: '고깔모자', lv: 3, price: 40 },
      { id: 'hat-crown', name: '왕관', lv: 4, price: 60 },
      { id: 'hat-star', name: '별 핀', lv: 5, price: 50 },
      { id: 'hat-band', name: '머리띠', lv: 6, price: 40 },
      { id: 'hat-cap', name: '야구 모자', lv: 7, price: 60 },
      { id: 'hat-flower', name: '꽃 핀', lv: 2, price: 30 },
      { id: 'hat-chef', name: '요리사 모자', lv: 4, price: 50 },
      { id: 'hat-wizard', name: '마법사 모자', gift: true },
      { id: 'hat-halo', name: '반짝 고리', gift: true }
    ],
    /* 펫 친구: 캐릭터 옆에 따라다니는 작은 동물 */
    pet: [
      { id: 'pet-puppy', name: '강아지', lv: 2, price: 50 },
      { id: 'pet-kitten', name: '아기 고양이', lv: 3, price: 50 },
      { id: 'pet-bunny', name: '토끼', gift: true },
      { id: 'pet-dragon', name: '아기 용', gift: true }
    ]
  };
  R.findDecor = function (id) {
    var all = R.decor.bg.concat(R.decor.hat, R.decor.pet);
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  };
  R.canBuy = function (p, id) {
    var d = R.findDecor(id);
    if (!d) return '없는 꾸미기예요.';
    if (p.owned.indexOf(id) >= 0) return '이미 가지고 있어요.';
    if (d.gift) return '선물 상자에서만 얻을 수 있어요. 도장을 모아 보세요.';
    if (R.level(p.xp) < d.lv) return '레벨 ' + d.lv + ' 이 되면 살 수 있어요.';
    if (p.coins < d.price) return '코인이 ' + (d.price - p.coins) + '개 더 필요해요.';
    return '';
  };
  R.buy = function (p, id) { var why = R.canBuy(p, id); if (why) return why; var d = R.findDecor(id); p.coins -= d.price; p.owned.push(id); return ''; };

  /* ---------- 배지 ---------- */
  var SUBJ = { math: '수학', eng: '영어', kor: '국어', bible: '성경', brain: '두뇌 게임' };
  function played(p, s) { return p.rounds.some(function (r) { return r.subj === s; }); }
  R.badges = [
    { id: 'first', name: '첫걸음', desc: '첫 판을 끝냈어요', test: function (p) { return p.rounds.length >= 1; } },
    { id: 'r5', name: '다섯 판', desc: '5판을 끝냈어요', test: function (p) { return p.rounds.length >= 5; } },
    { id: 'r20', name: '스무 판', desc: '20판을 끝냈어요', test: function (p) { return p.rounds.length >= 20; } },
    { id: 'r50', name: '쉰 판', desc: '50판을 끝냈어요', test: function (p) { return p.rounds.length >= 50; } },
    { id: 'math1', name: '수학 첫 판', desc: '수학을 해 봤어요', test: function (p) { return played(p, 'math'); } },
    { id: 'eng1', name: '영어 첫 판', desc: '영어를 해 봤어요', test: function (p) { return played(p, 'eng'); } },
    { id: 'kor1', name: '국어 첫 판', desc: '국어를 해 봤어요', test: function (p) { return played(p, 'kor'); } },
    { id: 'bible1', name: '성경 첫 판', desc: '성경을 해 봤어요', test: function (p) { return played(p, 'bible'); } },
    { id: 'brain1', name: '게임 첫 판', desc: '두뇌 게임을 해 봤어요', test: function (p) { return played(p, 'brain'); } },
    { id: 'all5', name: '골고루', desc: '다섯 과목을 모두 해 봤어요', test: function (p) { return ['math', 'eng', 'kor', 'bible', 'brain'].every(function (s) { return played(p, s); }); } },
    { id: 'perfect', name: '꼼꼼한 한 판', desc: '10문제를 모두 맞혔어요', test: function (p) { return (p.stats && p.stats.perfect) >= 1; } },
    { id: 'up3', name: '계단 오르기', desc: '다음 단계로 3번 올라갔어요', test: function (p) { return (p.stats && p.stats.ups) >= 3; } },
    { id: 'streak3', name: '3일 이어서', desc: '3일 연속으로 공부했어요', test: function (p) { return p.streak && p.streak.n >= 3; } },
    { id: 'streak7', name: '일주일 이어서', desc: '7일 연속으로 공부했어요', test: function (p) { return p.streak && p.streak.n >= 7; } },
    { id: 'review5', name: '다시 보기 5개', desc: '틀렸던 문제 5개를 다시 맞혔어요', test: function (p) { return (p.graduated || 0) >= 5; } },
    { id: 'verse3', name: '말씀 지킴이', desc: '말씀 3구절을 외웠어요', test: function (p) { return (p.verses || []).length >= 3; } },
    { id: 'above', name: '한 학년 위 도전', desc: '내 학년보다 높은 단원을 풀었어요', test: function (p, c) { return c && c.unit && c.unit.grade > p.grade; } },
    { id: 'below', name: '복습으로 다지기', desc: '이전 학년 단원을 다시 풀었어요', test: function (p, c) { return c && c.unit && c.unit.gradeTo < p.grade; } }
  ];
  R.award = function (p, ctx) {
    var got = [];
    R.badges.forEach(function (b) {
      if (p.badges.indexOf(b.id) < 0 && b.test(p, ctx)) { p.badges.push(b.id); got.push(b); }
    });
    return got;
  };

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
