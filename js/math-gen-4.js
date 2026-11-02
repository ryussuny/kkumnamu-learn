/* 수학 생성기 ④ — 중3 */
(function (g) {
  var KN = g.KN, M = KN.m, mk = KN.mk, mkNum = KN.mkNum;
  function U(id, grade, name, tiers, desc, gen) { KN.mathUnits.push({ id: id, subj: 'math', grade: grade, name: name, tiers: tiers, desc: desc, gen: gen }); }
  var E = function (e) { return { t: 'e', e: String(e) }; };
  var P = M.poly, S = M.sign, PA = M.paren;
  function nz(r, lo, hi) { var x; do { x = r.int(lo, hi); } while (x === 0); return x; }
  function isSq(n) { var s = Math.round(Math.sqrt(n)); return s * s === n; }
  /* n = k² · m (m 은 제곱수로 나누어지지 않는 수) */
  function simp(n) { var k = 1, m = n; for (var p = 2; p * p <= m; p++) while (m % (p * p) === 0) { m /= p * p; k *= p; } return [k, m]; }
  function rad(k, m) { return (k === 1 ? '' : k) + '√{' + m + '}'; }
  var SQUAREFREE = [2, 3, 5, 6, 7, 10, 11];

  U('m3-sqrt', 9, '제곱근과 실수', 2, '제곱근, 근호 간단히, 대소', function (r, t) {
    if (t === 1) {
      var k = r.int(1, 3);
      if (k === 1) { var s = r.int(2, 15); return mkNum(r, 9, 1, '√{' + s * s + '} 의 값은?', s, s + '² = ' + s * s + ' 이므로 √{' + s * s + '} = ' + s, { v: E('Math.sqrt(' + s * s + ')') }); }
      if (k === 2) { var q = r.int(2, 13); return mk(r, q * q + ' 의 제곱근을 모두 구하면?', '±' + q, '제곱해서 ' + q * q + ' 이 되는 수는 ' + q + ' 와 −' + q + ' 예요.', { wrong: ['' + q, '±' + q * q, '−' + q, '±' + (q + 1)], v: { t: 'sqrtroots', n: q * q, ans: '±' + q } }); }
      var n; do { n = r.int(5, 60); } while (isSq(n));
      var m = Math.floor(Math.sqrt(n)) + r.pick([0, 1]);
      var big = Math.sqrt(n) > m ? '√{' + n + '}' : '' + m;
      return mk(r, '√{' + n + '} 과 ' + m + ' 중에서 더 큰 수는?', big, '두 수를 제곱해서 비교해요: ' + n + ' 과 ' + m * m, { wrong: [Math.sqrt(n) > m ? '' + m : '√{' + n + '}'], choices: ['√{' + n + '}', '' + m], kind: 'choice', v: { t: 'cmpsqrt', n: n, m: m, ans: big } });
    }
    if (r.chance(.6)) {
      var kk = r.int(2, 6), mm = r.pick(SQUAREFREE), n2 = kk * kk * mm;
      var ans = rad(kk, mm);
      return mk(r, '√{' + n2 + '} 을 간단히 하면?', ans, n2 + ' = ' + kk * kk + ' × ' + mm + ' 이므로 √{' + n2 + '} = ' + ans, { wrong: [rad(mm, kk), rad(kk * kk, mm), rad(kk + 1, mm), rad(kk, mm + 1)], v: { t: 'simp', n: n2, ans: ans } });
    }
    var sq = r.shuffle([4, 9, 16, 25, 36, 49]).slice(0, 3), ns; do { ns = r.int(2, 30); } while (isSq(ns));
    var opts = sq.map(function (x) { return '√{' + x + '}'; }).concat(['√{' + ns + '}']);
    return mk(r, '다음 중 무리수인 것은?', '√{' + ns + '}', '√{' + sq.join('}, √{') + '} 은 정수예요. ' + ns + ' 은 제곱수가 아니라서 √{' + ns + '} 은 무리수예요.', { choices: opts, v: { t: 'irr', ans: ns, others: sq } });
  });

  U('m3-radical', 9, '근호를 포함한 식의 계산', 2, '곱셈·나눗셈, 덧셈·뺄셈, 유리화', function (r, t) {
    if (t === 1) {
      if (r.chance(.5)) { var pairs = [[2, 8], [3, 12], [5, 20], [2, 18], [6, 24], [3, 27], [8, 18], [12, 27], [2, 50], [7, 28]]; var pr = r.pick(pairs); return mkNum(r, 9, 1, '√{' + pr[0] + '} × √{' + pr[1] + '} = □', Math.sqrt(pr[0] * pr[1]), '√{a} × √{b} = √{ab} 이므로 √{' + pr[0] * pr[1] + '}', { v: E('Math.sqrt(' + pr[0] + '*' + pr[1] + ')') }); }
      var d = r.int(2, 6), q = r.int(2, 4), a = d * d * q; return mkNum(r, 9, 1, '√{' + a + '} ÷ √{' + q + '} = □', d, '√{a} ÷ √{b} = √{a ÷ b}', { v: E('Math.sqrt(' + a + ')/Math.sqrt(' + q + ')') });
    }
    var m = r.pick([2, 3, 5, 6, 7]);
    if (r.chance(.5)) {
      var c1 = r.int(1, 7), c2 = r.int(1, 7), minus = r.chance(.5) && c1 !== c2;
      var res = minus ? Math.abs(c1 - c2) : c1 + c2; if (minus && c1 < c2) { var tmp = c1; c1 = c2; c2 = tmp; res = c1 - c2; }
      var ans = rad(res, m);
      return mk(r, rad(c1, m) + (minus ? ' − ' : ' + ') + rad(c2, m) + ' = □', ans, '근호 안이 같으면 계수끼리 ' + (minus ? '빼요' : '더해요') + '.', { wrong: [rad(minus ? c1 + c2 : Math.abs(c1 - c2) || 1, m), rad(res, m * m), rad(res + 1, m), rad(res, m + 1)], v: { t: 'radadd', c1: c1, c2: c2, m: m, minus: minus, ans: ans } });
    }
    var kk = r.int(2, 6), a = kk * m, ans2 = rad(kk, m);
    return mk(r, a + ' ÷ √{' + m + '} = □  (분모를 유리화하세요)', ans2, a + ' = ' + kk + ' × ' + m + ' 이고 ' + m + ' ÷ √{' + m + '} = √{' + m + '} 이에요.', { wrong: [rad(a, m), rad(kk + 1, m), rad(kk, m * 2) , '' + kk], v: { t: 'rationalize', a: a, m: m, ans: ans2 } });
  });

  function fac(a) { return '(x ' + (a < 0 ? '− ' + (-a) : '+ ' + a) + ')'; }
  U('m3-factor', 9, '곱셈 공식과 인수분해', 2, '식의 전개, 인수분해', function (r, t) {
    if (t === 1) {
      var k = r.int(1, 3), a = nz(r, -7, 7), b;
      if (k === 1) { return mk(r, '(x ' + (a < 0 ? '− ' + (-a) : '+ ' + a) + ')^{2} 을 전개하면?', P([[1, 'x^{2}'], [2 * a, 'x'], [a * a, '']]), '(a + b)² = a² + 2ab + b² 에서 a = x, b = ' + S(a), { wrong: [P([[1, 'x^{2}'], [a * a, '']]), P([[1, 'x^{2}'], [a, 'x'], [a * a, '']]), P([[1, 'x^{2}'], [-2 * a, 'x'], [a * a, '']]), P([[1, 'x^{2}'], [2 * a, 'x'], [-a * a, '']])], v: { t: 'expand', f: [[1, a], [1, a]], ans: [1, 2 * a, a * a] } }); }
      if (k === 2) { a = r.int(2, 9); return mk(r, '(x + ' + a + ')(x − ' + a + ') 을 전개하면?', P([[1, 'x^{2}'], [-a * a, '']]), '(a + b)(a − b) = a² − b²', { wrong: [P([[1, 'x^{2}'], [a * a, '']]), P([[1, 'x^{2}'], [-2 * a, 'x'], [-a * a, '']]), P([[1, 'x^{2}'], [-a, '']]), P([[1, 'x^{2}'], [2 * a, 'x'], [-a * a, '']])], v: { t: 'expand', f: [[1, a], [1, -a]], ans: [1, 0, -a * a] } }); }
      do { b = nz(r, -7, 7); } while (b === a);
      return mk(r, '(x ' + (a < 0 ? '− ' + (-a) : '+ ' + a) + ')(x ' + (b < 0 ? '− ' + (-b) : '+ ' + b) + ') 을 전개하면?', P([[1, 'x^{2}'], [a + b, 'x'], [a * b, '']]), '(x + a)(x + b) = x² + (a + b)x + ab', { wrong: [P([[1, 'x^{2}'], [a * b, 'x'], [a + b, '']]), P([[1, 'x^{2}'], [a + b, 'x'], [-a * b, '']]), P([[1, 'x^{2}'], [-(a + b), 'x'], [a * b, '']]), P([[1, 'x^{2}'], [a * b, '']])], v: { t: 'expand', f: [[1, a], [1, b]], ans: [1, a + b, a * b] } });
    }
    var p, q, tries = 0;
    do { p = nz(r, -8, 8); q = nz(r, -8, 8); tries++; } while ((p === -q || p === q) && tries < 100);
    var lo = Math.min(p, q), hi = Math.max(p, q), ans = fac(lo) + fac(hi);
    var wr = [fac(-lo) + fac(-hi), fac(-lo) + fac(hi), fac(lo) + fac(-hi), fac(lo + 1) + fac(hi - 1 === lo + 1 ? hi : hi - 1)].filter(function (x) { return x !== ans; });
    return mk(r, P([[1, 'x^{2}'], [p + q, 'x'], [p * q, '']]) + ' 을 인수분해하면?', ans, '합이 ' + (p + q) + ', 곱이 ' + p * q + ' 인 두 수는 ' + lo + ' 과 ' + hi + ' 예요.', { wrong: wr, v: { t: 'factorquad', sum: p + q, prod: p * q, ans: ans } });
  });

  function roots2(p, q) { var lo = Math.min(p, q), hi = Math.max(p, q); return 'x = ' + S(lo) + ' 또는 x = ' + S(hi); }
  U('m3-quad', 9, '이차방정식', 2, '인수분해와 근의 공식', function (r, t) {
    if (t === 1) {
      var p, q, tries = 0;
      do { p = nz(r, -8, 8); q = nz(r, -8, 8); tries++; } while (p === q && tries < 50);
      var lo = Math.min(p, q), hi = Math.max(p, q);
      var ans = roots2(p, q);
      return mk(r, P([[1, 'x^{2}'], [-(p + q), 'x'], [p * q, '']]) + ' = 0 의 해는?', ans, '(x ' + (p < 0 ? '+ ' + (-p) : '− ' + p) + ')(x ' + (q < 0 ? '+ ' + (-q) : '− ' + q) + ') = 0 으로 인수분해돼요.', { wrong: [roots2(-p, -q), roots2(p, -q), roots2(-p, q), roots2(p + 1, q)], v: { t: 'quadroots', a: 1, b: -(p + q), c: p * q, roots: [[p, 1], [q, 1]], ans: ans } });
    }
    var k = r.int(1, 2);
    if (k === 1) {   /* 근의 공식: x² + bx + c = 0, b 가 짝수 → x = p ± √m */
      var p, m, c, tries = 0;
      do { p = nz(r, -6, 6); m = r.pick([2, 3, 5, 6, 7, 10, 11, 13]); tries++; } while (tries > 50);
      c = p * p - m;
      var bb = -2 * p, ans = 'x = ' + S(p) + ' ± √{' + m + '}';
      var wr = ['x = ' + S(-p) + ' ± √{' + m + '}', 'x = ' + S(p) + ' ± √{' + (m + 1) + '}', 'x = ' + S(p) + ' ± ' + m, 'x = ' + S(p) + ' ± √{' + (p * p + m) + '}'];
      return mk(r, P([[1, 'x^{2}'], [bb, 'x'], [c, '']]) + ' = 0 의 해를 근의 공식으로 구하면?', ans, '(x − ' + PA(p) + ')² = ' + m + ' 꼴로 바꾸면 x = ' + S(p) + ' ± √{' + m + '} 예요.', { wrong: wr, v: { t: 'quadsqrt', b: bb, c: c, p: p, m: m } });
    }
    var m = r.pick([2, 3]), s = nz(r, -4, 4), n = r.pick([1, 2, 3]), u = nz(r, -4, 4);
    /* (m x + s)(n x + u) = 0 → 근 −s/m, −u/n */
    var A = m * n, B = m * u + n * s, C = s * u;
    var rt = [[-s, m], [-u, n]].map(function (z) { return M.red(z[0], z[1]); });
    rt.sort(function (x, y) { return x[0] / x[1] - y[0] / y[1]; });
    var fm = function (z) { return M.fr(z[0], z[1]); };
    var ans3 = 'x = ' + fm(rt[0]) + ' 또는 x = ' + fm(rt[1]);
    if (rt[0][0] * rt[1][1] === rt[1][0] * rt[0][1]) return KN.mathUnits.filter(function (x) { return x.id === 'm3-quad'; })[0].gen(r, t);
    var inv = rt.map(function (z) { return [z[1] * (z[0] < 0 ? -1 : 1), Math.abs(z[0]) || 1]; });
    var neg = rt.map(function (z) { return [-z[0], z[1]]; }).sort(function (x, y) { return x[0] / x[1] - y[0] / y[1]; });
    return mk(r, P([[A, 'x^{2}'], [B, 'x'], [C, '']]) + ' = 0 의 해는?', ans3, '(' + P([[m, 'x'], [s, '']]) + ')(' + P([[n, 'x'], [u, '']]) + ') = 0 으로 인수분해돼요.',
      { wrong: ['x = ' + fm(neg[0]) + ' 또는 x = ' + fm(neg[1]), 'x = ' + fm(inv[0]) + ' 또는 x = ' + fm(inv[1]), 'x = ' + fm(rt[0]) + ' 또는 x = ' + fm([-rt[1][0], rt[1][1]]), 'x = ' + fm([rt[0][0] + 1, rt[0][1]]) + ' 또는 x = ' + fm(rt[1])], v: { t: 'quadroots', a: A, b: B, c: C, roots: rt, ans: ans3 } });
  });

  U('m3-quadfn', 9, '이차함수', 2, '꼭짓점, 축, 그래프의 모양', function (r, t) {
    if (t === 1) {
      var a = nz(r, -3, 3), p = nz(r, -5, 5), q = nz(r, -6, 6), k = r.int(1, 3);
      var f = 'y = ' + (a === 1 ? '' : a === -1 ? '−' : a) + '(x ' + (p < 0 ? '+ ' + (-p) : '− ' + p) + ')^{2} ' + (q < 0 ? '− ' + (-q) : '+ ' + q);
      if (k === 1) return mk(r, f + ' 의 그래프의 꼭짓점의 좌표는?', '(' + S(p) + ', ' + S(q) + ')', 'y = a(x − p)² + q 의 꼭짓점은 (p, q) 예요.', { wrong: ['(' + S(-p) + ', ' + S(q) + ')', '(' + S(p) + ', ' + S(-q) + ')', '(' + S(q) + ', ' + S(p) + ')', '(' + S(-p) + ', ' + S(-q) + ')'], v: { t: 'vertex', a: a, b: -2 * a * p, c: a * p * p + q, ans: [p, q] } });
      if (k === 2) return mk(r, f + ' 의 그래프의 축의 방정식은?', 'x = ' + S(p), '축은 꼭짓점을 지나는 세로선 x = p 예요.', { wrong: ['x = ' + S(-p), 'y = ' + S(q), 'x = ' + S(q), 'y = ' + S(p)], v: { t: 'axis', a: a, b: -2 * a * p, c: a * p * p + q, ans: p } });
      return mk(r, f + ' 의 그래프는 어떤 모양일까요?', a > 0 ? '아래로 볼록' : '위로 볼록', 'x² 의 계수 ' + a + ' 가 ' + (a > 0 ? '양수이면 아래로 볼록' : '음수이면 위로 볼록') + '이에요.', { wrong: ['아래로 볼록', '위로 볼록'], v: { t: 'shape', a: a, ans: a > 0 ? 'down' : 'up' } });
    }
    var kk = r.int(1, 3);
    if (kk === 3) {
      if (r.chance(.5)) { var a3 = nz(r, -2, 3), b3 = nz(r, -4, 4), c3 = nz(r, -6, 6), xv = r.int(-3, 4); return mkNum(r, 9, 2, 'y = ' + P([[a3, 'x^{2}'], [b3, 'x'], [c3, '']]) + ' 에서 x = ' + S(xv) + ' 일 때 y 의 값은?', a3 * xv * xv + b3 * xv + c3, 'x 자리에 ' + PA(xv) + ' 를 넣어 계산해요.', { v: E('(' + a3 + ')*(' + xv + ')*(' + xv + ')+(' + b3 + ')*(' + xv + ')+(' + c3 + ')') }); }
      var xa = nz(r, -6, 6), xb; do { xb = nz(r, -6, 6); } while (xb === xa);
      var lo2 = Math.min(xa, xb), hi2 = Math.max(xa, xb);
      return mk(r, 'y = (x ' + (xa < 0 ? '+ ' + (-xa) : '− ' + xa) + ')(x ' + (xb < 0 ? '+ ' + (-xb) : '− ' + xb) + ') 의 그래프가 x 축과 만나는 두 점의 x 좌표는?', S(lo2) + ', ' + S(hi2), 'y = 0 이 되는 x 를 구해요: (x − ' + PA(xa) + ')(x − ' + PA(xb) + ') = 0', { wrong: [S(-lo2) + ', ' + S(-hi2), S(lo2) + ', ' + S(-hi2), S(-lo2) + ', ' + S(hi2)], v: { t: 'xints', a: xa, b: xb, ans: [lo2, hi2] } });
    }
    if (kk === 1) { var a2 = nz(r, -3, 3), b2 = nz(r, -8, 8), c2 = nz(r, -9, 9); return mkNum(r, 9, 2, 'y = ' + P([[a2, 'x^{2}'], [b2, 'x'], [c2, '']]) + ' 의 그래프가 y 축과 만나는 점의 y 좌표는?', c2, 'x = 0 을 대입하면 y = c 예요.', { v: E(c2) }); }
    var bb = r.pick([-8, -6, -4, -2, 2, 4, 6, 8]), cc = nz(r, -5, 9), vx = -bb / 2, vy = cc - bb * bb / 4;
    return mk(r, 'y = ' + P([[1, 'x^{2}'], [bb, 'x'], [cc, '']]) + ' 의 그래프의 꼭짓점의 좌표는?', '(' + S(vx) + ', ' + S(vy) + ')', '완전제곱꼴 y = (x ' + (vx < 0 ? '+ ' + (-vx) : '− ' + vx) + ')² ' + (vy < 0 ? '− ' + (-vy) : '+ ' + vy) + ' 로 바꿔요.',
      { wrong: ['(' + S(-vx) + ', ' + S(vy) + ')', '(' + S(vx) + ', ' + S(cc) + ')', '(' + S(vx) + ', ' + S(-vy) + ')', '(' + S(bb) + ', ' + S(cc) + ')'], v: { t: 'vertex', a: 1, b: bb, c: cc, ans: [vx, vy] } });
  });

  var TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10]];
  var SPECIAL = { 'sin30': '1/2', 'cos30': '√{3}/2', 'tan30': '√{3}/3', 'sin45': '√{2}/2', 'cos45': '√{2}/2', 'tan45': '1', 'sin60': '√{3}/2', 'cos60': '1/2', 'tan60': '√{3}' };
  U('m3-trig', 9, '삼각비', 2, 'sin·cos·tan, 특수각', function (r, t) {
    if (t === 1) {
      var T = r.pick(TRI), a = T[0], b = T[1], c = T[2], which = r.pick(['sin', 'cos', 'tan']);
      var ans = which === 'sin' ? M.fr(a, c) : which === 'cos' ? M.fr(b, c) : M.fr(a, b);
      var wr = [M.fr(b, c), M.fr(a, c), M.fr(a, b), M.fr(c, a), M.fr(c, b), M.fr(b, a)].filter(function (x) { return x !== ans; });
      return mk(r, '∠C = 90° 인 직각삼각형 ABC 에서 BC = ' + a + ', CA = ' + b + ', AB = ' + c + ' 일 때, ' + which + ' A 의 값은?', ans,
        which === 'sin' ? 'sin A = (높이 BC) ÷ (빗변 AB)' : which === 'cos' ? 'cos A = (밑변 CA) ÷ (빗변 AB)' : 'tan A = (높이 BC) ÷ (밑변 CA)', { wrong: wr, v: { t: 'trig', a: a, b: b, c: c, f: which, ans: ans } });
    }
    var key = r.pick(Object.keys(SPECIAL)), fn = key.slice(0, 3), deg = key.slice(3);
    var ans2 = SPECIAL[key], all = ['1/2', '√{3}/2', '√{3}/3', '√{2}/2', '1', '√{3}'];
    return mk(r, fn + ' ' + deg + '° 의 값은?', ans2, '30°, 45°, 60° 의 삼각비 표를 떠올려 보세요.', { wrong: all.filter(function (x) { return x !== ans2; }), v: { t: 'special', f: fn, deg: Number(deg), ans: ans2 } });
  });

  U('m3-circle', 9, '원의 성질', 2, '원주각, 접선, 내접사각형', function (r, t) {
    if (t === 1) {
      var k = r.int(1, 3), a = r.int(20, 80) * 2;
      if (k === 1) return mkNum(r, 9, 1, '한 원에서 호 AB 에 대한 중심각 ∠AOB = ' + a + '° 일 때, 같은 호에 대한 원주각 ∠APB 의 크기는?', a / 2, '원주각의 크기는 중심각의 반이에요.', { v: E(a + '/2') });
      if (k === 2) return mkNum(r, 9, 1, '한 원에서 호 AB 에 대한 원주각이 ' + a / 2 + '° 일 때, 같은 호에 대한 중심각의 크기는?', a, '중심각은 원주각의 2배예요.', { v: E(a / 2 + '*2') });
      return mkNum(r, 9, 1, 'AB 가 원의 지름일 때, A 와 B 가 아닌 원 위의 점 P 에 대하여 ∠APB 의 크기는?', 90, '반원에 대한 원주각은 90° 예요.', { v: E(90) });
    }
    var kk = r.int(1, 2);
    if (kk === 1) { var ang = r.int(60, 120); return mkNum(r, 9, 2, '원에 내접하는 사각형 ABCD 에서 ∠A = ' + ang + '° 일 때, ∠C 의 크기는?', 180 - ang, '내접사각형의 마주 보는 두 각의 합은 180° 예요.', { v: E('180-' + ang) }); }
    var x = r.int(4, 14) * 10;
    return mkNum(r, 9, 2, '원 O 밖의 점 P 에서 원에 그은 두 접선의 접점을 A, B 라 하자. ∠APB = ' + x + '° 일 때, ∠AOB 의 크기는?', 180 - x, '사각형 OAPB 에서 ∠OAP = ∠OBP = 90° 이므로 ∠AOB = 360° − 90° − 90° − ' + x + '°', { v: E('360-90-90-' + x) });
  });

  U('m3-stats', 9, '통계', 2, '분산, 표준편차, 사분위수', function (r, t) {
    if (t === 1) {
      var n, devs, tries = 0, sq;
      do {
        n = r.pick([4, 5]); devs = [];
        for (var i = 0; i < n - 1; i++) devs.push(r.int(-5, 5));
        devs.push(-devs.reduce(function (a, c) { return a + c; }, 0));
        sq = devs.reduce(function (a, c) { return a + c * c; }, 0); tries++;
      } while ((Math.abs(devs[n - 1]) > 6 || sq % n !== 0 || sq === 0) && tries < 3000);
      var mean = r.int(10, 30), data = devs.map(function (d) { return mean + d; });
      var variance = sq / n;
      if (isSq(variance) && r.chance(.5)) return mkNum(r, 9, 1, '자료 ' + r.shuffle(data).join(', ') + ' 의 표준편차는? (분산이 자연수의 제곱이에요)', Math.sqrt(variance), '표준편차 = √(분산). 평균 ' + mean + ', 분산 ' + variance, { v: { t: 'stat', k: 'sd', a: data } });
      return mkNum(r, 9, 1, '자료 ' + r.shuffle(data).join(', ') + ' 의 분산은?', variance, '평균은 ' + mean + ' 이고, (편차)² 의 평균이 분산이에요.', { v: { t: 'stat', k: 'var', a: data } });
    }
    var len = r.pick([7, 11]), set = {}; var arr = [];
    while (arr.length < len) { var x = r.int(1, 60); if (!set[x]) { set[x] = 1; arr.push(x); } }
    var sorted = arr.slice().sort(function (p, q) { return p - q; });
    var med = function (a) { return a[(a.length - 1) / 2]; };
    var half = (len - 1) / 2, q1 = med(sorted.slice(0, half)), q3 = med(sorted.slice(half + 1)), q2 = med(sorted);
    var pick = r.pick(['iqr', 'q2', 'range']);
    var label = { iqr: '사분위수 범위 (Q3 − Q1)', q2: '중앙값 (제2사분위수)', range: '범위 (최댓값 − 최솟값)' }[pick];
    var val = pick === 'iqr' ? q3 - q1 : pick === 'q2' ? q2 : sorted[len - 1] - sorted[0];
    return mkNum(r, 9, 2, '자료 ' + arr.join(', ') + ' 의 ' + label + ' 는?', val, '작은 수부터 정리: ' + sorted.join(', ') + (pick === 'iqr' ? ' → Q1 = ' + q1 + ', Q3 = ' + q3 : ''), { v: { t: 'stat', k: pick, a: arr } });
  });
})(typeof window !== 'undefined' ? window : globalThis);
