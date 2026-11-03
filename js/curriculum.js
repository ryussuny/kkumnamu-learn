/* 과목·단원 목록과 단계(사다리).
   ※ 단원은 "교과서 단원명"이 아니라 영역(수와 연산 등)·학년군 흐름을 기준으로 묶은 학습 주제다.
     공식 성취기준 원문을 직접 확인하지 못했으므로(docs/research-notes.md) 학년 표시는 안내용이다.
   단원 구성을 고칠 때는 이 파일과 각 *-gen.js 의 단원 정의만 손보면 된다. */
(function (g) {
  var KN = g.KN = g.KN || {};

  /* name = 원래 과목 이름(부모 화면용), fun = 아이에게 보이는 놀이 이름. 내부 id 는 기록 호환을 위해 바꾸지 않는다. */
  KN.subjects = [
    { id: 'math', name: '수학', fun: '숫자 탐험대', glyph: '수', color: '#ff8fa3', dark: '#d9486a' },
    { id: 'eng', name: '영어', fun: '영어 모험', glyph: 'A', color: '#7cc4ff', dark: '#2e83cc' },
    { id: 'kor', name: '국어', fun: '말글 놀이터', glyph: '가', color: '#ffc95e', dark: '#c98a00' },
    { id: 'bible', name: '성경', fun: '말씀 보물찾기', glyph: '말씀', color: '#b79cff', dark: '#6b4fd6' },
    { id: 'brain', name: '두뇌 게임', fun: '반짝 두뇌 게임', glyph: '게임', color: '#6fd6a3', dark: '#1f9a66' }
  ];
  /* 공부 과목이 아닌 놀이 활동 (단계·사다리 없음) */
  KN.activities = [
    { id: 'music', name: '음악 활동', fun: '딩동 음악실', glyph: '♪', color: '#ffb36b', dark: '#c4691a' },
    { id: 'draw', name: '그림 활동', fun: '알록달록 그림방', glyph: '그림', color: '#ff9ad5', dark: '#c4308f' }
  ];
  /* 아이에게 보이는 이름 / 부모에게 보이는 이름("숫자 탐험대(수학)") */
  KN.funName = function (id) { var a = KN.subjects.concat(KN.activities); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i].fun; return id === 'review' ? '다시 보기' : String(id); };
  KN.parentName = function (id) { var a = KN.subjects.concat(KN.activities); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i].fun + '(' + a[i].name + ')'; return id === 'review' ? '다시 보기' : String(id); };
  KN.subject = function (id) { for (var i = 0; i < KN.subjects.length; i++) if (KN.subjects[i].id === id) return KN.subjects[i]; return null; };

  /* 수학 단원 → 영역 (2022 개정 수학과의 4개 영역 이름) */
  var D1 = '수와 연산', D2 = '변화와 관계', D3 = '도형과 측정', D4 = '자료와 가능성';
  KN.mathDomain = {
    'g1-count': D1, 'g1-split': D1, 'g1-add': D1, 'g1-sub': D1, 'g1-make10': D1, 'g1-clock': D3, 'g1-pattern': D2,
    'g2-place': D1, 'g2-add': D1, 'g2-sub': D1, 'g2-group': D1, 'g2-table': D1, 'g2-measure': D3, 'g2-chart': D4,
    'g3-addsub': D1, 'g3-mul': D1, 'g3-div': D1, 'g3-frac': D1, 'g3-dec': D1, 'g3-unit': D3, 'g3-circle': D3,
    'g4-big': D1, 'g4-muldiv': D1, 'g4-angle': D3, 'g4-frac': D1, 'g4-dec': D1, 'g4-blank': D2, 'g4-chart': D4,
    'g5-mixed': D1, 'g5-div': D1, 'g5-gcdlcm': D1, 'g5-reduce': D1, 'g5-fracaddsub': D1, 'g5-mul': D1, 'g5-area': D3, 'g5-mean': D4,
    'g6-fracdiv': D1, 'g6-decdiv': D1, 'g6-ratio': D2, 'g6-prop': D2, 'g6-volume': D3, 'g6-circle': D3, 'g6-solid': D3,
    'm1-prime': D1, 'm1-int': D1, 'm1-letter': D2, 'm1-eq': D2, 'm1-coord': D2, 'm1-prop': D2, 'm1-stat': D4, 'm1-angle': D3,
    'm2-rep': D1, 'm2-expr': D2, 'm2-ineq': D2, 'm2-sys': D2, 'm2-linear': D2, 'm2-tri': D3, 'm2-pyth': D3, 'm2-prob': D4,
    'm3-sqrt': D1, 'm3-radical': D1, 'm3-factor': D2, 'm3-quad': D2, 'm3-quadfn': D2, 'm3-trig': D3, 'm3-circle': D3, 'm3-stats': D4
  };

  var built = null;
  /* 모든 단원을 한 목록으로 (각 *-gen.js 가 KN.xxxUnits 에 등록) */
  KN.allUnits = function () {
    if (built) return built;
    var lists = [KN.mathUnits, KN.engUnits, KN.korUnits, KN.bibleUnits, KN.brainUnits], out = [];
    lists.forEach(function (l) {
      (l || []).forEach(function (u) {
        if (u.gradeTo == null) u.gradeTo = u.grade;
        if (u.subj === 'math') u.domain = KN.mathDomain[u.id] || '';
        out.push(u);
      });
    });
    built = out;
    return out;
  };
  KN.unit = function (id) { var a = KN.allUnits(); for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; };

  /* 과목 사다리: [{i, subj, unit, tier}]  — 학년 → 등록 순서 → 단계 */
  var ladders = {};
  KN.ladder = function (subj) {
    if (ladders[subj]) return ladders[subj];
    var us = KN.allUnits().filter(function (u) { return u.subj === subj; });
    us = us.map(function (u, k) { return { u: u, k: k }; }).sort(function (a, b) { return a.u.grade - b.u.grade || a.k - b.k; }).map(function (x) { return x.u; });
    var out = [];
    us.forEach(function (u) { for (var t = 1; t <= u.tiers; t++) out.push({ i: out.length, subj: subj, unit: u.id, tier: t }); });
    ladders[subj] = out;
    return out;
  };
  /* 학년에 맞는 처음 위치 */
  KN.startIndex = function (subj, grade) {
    var L = KN.ladder(subj);
    for (var i = 0; i < L.length; i++) { var u = KN.unit(L[i].unit); if (u.gradeTo >= grade && L[i].tier === 1) return i; }
    return Math.max(0, L.length - 2);
  };
  KN.nodeKey = function (n) { return n.subj + ':' + n.unit + ':' + n.tier; };
  KN.gradeName = function (gr) { return gr <= 6 ? '초' + gr : '중' + (gr - 6); };
  KN.gradeRange = function (u) { return u.grade === u.gradeTo ? KN.gradeName(u.grade) : KN.gradeName(u.grade) + '~' + KN.gradeName(u.gradeTo); };

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
