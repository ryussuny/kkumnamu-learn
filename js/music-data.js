/* 음악 활동 데이터 — 건반 8개, 악기 3종, 따라 칠 선율, '따라 쳐 봐요' 무작위 패턴.
   저작권 원칙: 저작권이 살아 있는 동요·가요의 선율·가사는 넣지 않는다.
   선율은 작곡자 사후 70년이 지난 전래·고전 선율만 둔다(아래 src 주석). 가사는 넣지 않고 계이름만 보여 준다. */
(function (g) {
  var KN = g.KN = g.KN || {};
  var BEAT = 450;      /* 선율 한 박(ms) */

  /* 도~높은 도 (C4~C5, 평균율 Hz) */
  var NOTES = [
    { n: '도', f: 261.63, color: '#ff5c6c' }, { n: '레', f: 293.66, color: '#ff9442' }, { n: '미', f: 329.63, color: '#ffd23f' },
    { n: '파', f: 349.23, color: '#7fd35a' }, { n: '솔', f: 392.00, color: '#2fbf9b' }, { n: '라', f: 440.00, color: '#4aa3ff' },
    { n: '시', f: 493.88, color: '#7a6cf0' }, { n: '높은 도', f: 523.25, color: '#d65ad8' }
  ];
  var INS = [{ id: 'piano', name: '피아노풍' }, { id: 'xylo', name: '실로폰풍' }, { id: 'bell', name: '종소리풍' }];

  /* notes: NOTES 의 번호, beats: 각 음의 길이(박) */
  var MELODIES = [
    { id: 'star', name: '작은 별 선율', src: '프랑스 민요 선율 "Ah! vous dirai-je, maman" (1761년 이전부터 전해진 전래 선율, 저작권 소멸). 가사 없이 계이름만.',
      notes: [0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0, 4, 4, 3, 3, 2, 2, 1, 4, 4, 3, 3, 2, 2, 1, 0, 0, 4, 4, 5, 5, 4, 3, 3, 2, 2, 1, 1, 0],
      beats: [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2] },
    { id: 'joy', name: '기쁨의 노래 선율', src: '베토벤 교향곡 9번 4악장 "환희의 송가" 주제 (1824년 작곡, 베토벤 1827년 사망, 저작권 소멸). 가사 없이 계이름만.',
      notes: [2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 2, 1, 1, 2, 2, 3, 4, 4, 3, 2, 1, 0, 0, 1, 2, 1, 0, 0],
      beats: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 0.5, 2] }
  ];

  var M = KN.music = {
    NOTES: NOTES, INS: INS, MELODIES: MELODIES, BEAT: BEAT,
    /* 학년별 '따라 쳐 봐요' 최대 길이(처음은 2음) / 쓰는 건반 수 */
    maxLen: function (grade) { return grade <= 2 ? 5 : grade <= 4 ? 6 : grade <= 6 ? 7 : 8; },
    poolSize: function (grade) { return grade <= 2 ? 5 : 8; },
    /* 무작위 패턴 (같은 음이 3번 연달아 나오지 않게) */
    pattern: function (rng, len, pool) {
      var out = [];
      while (out.length < len) {
        var n = rng.int(0, pool - 1);
        if (out.length >= 2 && out[out.length - 1] === n && out[out.length - 2] === n) continue;
        out.push(n);
      }
      return out;
    },
    /* 선율 → [[음, 앞 음과의 간격(ms)]] */
    melodySeq: function (m) {
      return m.notes.map(function (n, i) { return [n, i === 0 ? 0 : Math.round(m.beats[i - 1] * BEAT)]; });
    },
    melody: function (id) { for (var i = 0; i < MELODIES.length; i++) if (MELODIES[i].id === id) return MELODIES[i]; return null; },
    /* 내 노래 녹음: 누른 음 번호와 시각(ms)만 → [[음, 간격]] (간격은 50ms 단위, 최대 1.5초) */
    record: function (events) {
      var out = [], prev = null;
      events.forEach(function (e) {
        var dt = prev == null ? 0 : Math.max(0, Math.min(1500, Math.round((e.t - prev) / 50) * 50));
        out.push([e.n, dt]); prev = e.t;
      });
      return out;
    }
  };
  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
