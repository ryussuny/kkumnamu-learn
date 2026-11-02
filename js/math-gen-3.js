/* 수학 생성기 ③ — 중1·중2.  정답은 모두 계산으로 구한다. */
(function (g) {
  var KN = g.KN, M = KN.m, mk = KN.mk, mkNum = KN.mkNum;
  function U(id, grade, name, tiers, desc, gen) { KN.mathUnits.push({ id: id, subj: 'math', grade: grade, name: name, tiers: tiers, desc: desc, gen: gen }); }
  var E = function (e) { return { t: 'e', e: String(e) }; };
  var P = M.poly, S = M.sign, PA = M.paren;
  function nz(r, lo, hi) { var x; do { x = r.int(lo, hi); } while (x === 0); return x; }

  /* ================= 중1 ================= */
  U('m1-prime', 7, '소인수분해', 2, '소인수분해, 약수의 개수, 최대공약수', function (r, t) {
    if (t === 1) {
      var n = r.pick([12, 18, 20, 24, 28, 30, 36, 40, 45, 48, 50, 54, 56, 60, 63, 72, 75, 80, 84, 90, 96, 100]);
      var ans = M.factorStr(n), w = [];
      r.shuffle([2, -2, 4, -4, 6, -6, 3, -3, 8, -8, 10, -10]).forEach(function (d) { if (w.length < 4 && n + d > 3) { var f = M.factorStr(n + d); if (f !== ans && w.indexOf(f) < 0) w.push(f); } });
      return mk(r, n + ' 을 소인수분해 하면?', ans, '소수로 나누어 가며 ' + ans + ' (곱하면 ' + n + ')', { wrong: w, v: { t: 'factor', n: n, ans: ans } });
    }
    if (r.chance(.5)) {
      var a = r.int(1, 4), b = r.int(1, 3), c = r.chance(.5) ? r.int(1, 2) : 0;
      var num = Math.pow(2, a) * Math.pow(3, b) * (c ? Math.pow(5, c) : 1);
      var txt = '2' + (a > 1 ? '^{' + a + '}' : '') + ' × 3' + (b > 1 ? '^{' + b + '}' : '') + (c ? ' × 5' + (c > 1 ? '^{' + c + '}' : '') : '');
      return mkNum(r, 7, 2, txt + ' 의 약수는 모두 몇 개일까요?', (a + 1) * (b + 1) * (c ? c + 1 : 1), '지수에 1을 더해 곱해요: ' + (a + 1) + ' × ' + (b + 1) + (c ? ' × ' + (c + 1) : ''), { v: { t: 'nd', n: num } });
    }
    var gg = r.pick([2, 3, 4, 6, 12]), p = r.pick([2, 3, 5]), q = r.pick([3, 5, 7].filter(function (x) { return x !== p; }));
    var A = gg * p, B = gg * q;
    return r.chance(.5) ? mkNum(r, 7, 2, A + ' 과 ' + B + ' 의 최대공약수는?', M.gcd(A, B), '소인수분해해서 공통인 소인수를 모아 곱해요.', { v: { t: 'gcd', a: A, b: B } })
      : mkNum(r, 7, 2, A + ' 과 ' + B + ' 의 최소공배수는?', M.lcm(A, B), '소인수분해해서 모든 소인수를 큰 지수로 모아 곱해요.', { v: { t: 'lcm', a: A, b: B } });
  });

  U('m1-int', 7, '정수와 유리수', 2, '정수의 덧셈·뺄셈·곱셈·나눗셈', function (r, t) {
    if (t === 1) {
      var a, b;
      do { a = nz(r, -15, 15); b = nz(r, -15, 15); } while (a > 0 && b > 0 && r.chance(.85));
      if (r.chance(.5)) return mkNum(r, 7, 1, PA(a) + ' + ' + PA(b) + ' = □', a + b, a * b < 0 ? '부호가 다르면 큰 절댓값에서 작은 절댓값을 빼고, 절댓값이 큰 쪽의 부호를 붙여요.' : (a < 0 ? '부호가 같으면 절댓값을 더하고 공통 부호(−)를 붙여요.' : '두 수를 그대로 더해요.'), { v: E('(' + a + ')+(' + b + ')') });
      return mkNum(r, 7, 1, PA(a) + ' − ' + PA(b) + ' = □', a - b, '빼는 수의 부호를 바꾸어 더해요: ' + PA(a) + ' + ' + PA(-b), { v: E('(' + a + ')-(' + b + ')') });
    }
    var k = r.int(1, 4);
    if (k === 1) { var x, y; do { x = nz(r, -9, 9); y = nz(r, -9, 9); } while (x > 0 && y > 0 && r.chance(.85)); return mkNum(r, 7, 2, PA(x) + ' × ' + PA(y) + ' = □', x * y, x * y < 0 ? '부호가 다르면 −, 절댓값은 곱해요.' : (x < 0 ? '부호가 같으면 +, 절댓값은 곱해요.' : '두 수를 그대로 곱해요.'), { v: E('(' + x + ')*(' + y + ')') }); }
    if (k === 2) { var d, q; do { d = nz(r, -9, 9); q = nz(r, -9, 9); } while (d > 0 && q > 0 && r.chance(.85)); return mkNum(r, 7, 2, PA(d * q) + ' ÷ ' + PA(d) + ' = □', q, q < 0 ? '부호가 다르면 몫은 −예요. 절댓값끼리 나눠요.' : (d < 0 ? '부호가 같으면 몫은 +예요. 절댓값끼리 나눠요.' : '두 수를 그대로 나눠요.'), { v: E('(' + d * q + ')/(' + d + ')') }); }
    if (k === 3) { var u, w, c = nz(r, -20, 20); do { u = nz(r, -9, 9); w = nz(r, -9, 9); } while (u > 0 && w > 0 && r.chance(.85)); return mkNum(r, 7, 2, PA(u) + ' × ' + PA(w) + ' + ' + PA(c) + ' = □', u * w + c, '곱셈을 먼저 하고 덧셈을 해요.', { v: E('(' + u + ')*(' + w + ')+(' + c + ')') }); }
    var base = r.int(2, 4), ex = r.int(2, 4);
    return r.chance(.5) ? mkNum(r, 7, 2, '(−' + base + ')^{' + ex + '} = □', Math.pow(-base, ex), '−' + base + ' 를 ' + ex + '번 곱해요.', { v: E('Math.pow(-' + base + ',' + ex + ')') })
      : mkNum(r, 7, 2, '−' + base + '^{' + ex + '} = □', -Math.pow(base, ex), base + '^{' + ex + '} 을 먼저 계산하고 − 를 붙여요.', { v: E('-Math.pow(' + base + ',' + ex + ')') });
  });

  U('m1-letter', 7, '문자와 식', 2, '식의 값, 일차식의 계산', function (r, t) {
    if (t === 1) {
      var a = nz(r, -6, 8), b = nz(r, -9, 9), x = r.int(-4, 6);
      return mkNum(r, 7, 1, 'x = ' + S(x) + ' 일 때, ' + P([[a, 'x'], [b, '']]) + ' 의 값은?', a * x + b, 'x 자리에 ' + PA(x) + ' 를 넣어 계산해요.', { v: E('(' + a + ')*(' + x + ')+(' + b + ')') });
    }
    if (r.chance(.4)) {   /* 분배법칙: a(bx + c) */
      var da = nz(r, -5, 6), db = nz(r, -4, 5), dc = nz(r, -6, 6);
      var ansD = P([[da * db, 'x'], [da * dc, '']]);
      return mk(r, da + '(' + P([[db, 'x'], [dc, '']]) + ') = □', ansD, '괄호 안의 모든 항에 ' + da + ' 를 곱해요.', { wrong: [P([[da * db, 'x'], [dc, '']]), P([[da + db, 'x'], [da * dc, '']]), P([[da * db, 'x'], [-da * dc, '']]), P([[da * db + 1, 'x'], [da * dc, '']])], v: { t: 'dist', a: da, b: db, c: dc } });
    }
    var a1 = nz(r, -5, 6), b1 = nz(r, -8, 8), a2 = nz(r, -5, 6), b2 = nz(r, -8, 8), minus = r.chance(.5);
    var ca = minus ? a1 - a2 : a1 + a2, cb = minus ? b1 - b2 : b1 + b2;
    var ans = P([[ca, 'x'], [cb, '']]);
    var wr = [P([[ca, 'x'], [minus ? b1 + b2 : b1 - b2, '']]), P([[minus ? a1 + a2 : a1 - a2, 'x'], [cb, '']]), P([[ca + 1, 'x'], [cb, '']]), P([[ca, 'x'], [cb + 1, '']]), P([[ca, 'x'], [-cb, '']])];
    return mk(r, '(' + P([[a1, 'x'], [b1, '']]) + ') ' + (minus ? '−' : '+') + ' (' + P([[a2, 'x'], [b2, '']]) + ') = □', ans, (minus ? '빼는 괄호 안의 부호를 모두 바꾸어 풀어요. ' : '괄호를 풀고 ') + '같은 문자끼리, 상수끼리 계산해요.', { wrong: wr, v: { t: 'lin', a1: a1, b1: b1, a2: a2, b2: b2, minus: minus } });
  });

  U('m1-eq', 7, '일차방정식', 2, '일차방정식의 해', function (r, t) {
    var x0 = nz(r, -9, 9);
    if (t === 1) {
      var a = nz(r, -8, 9); if (Math.abs(a) < 2) a = r.pick([2, 3, -2, -3]);
      var b = nz(r, -12, 12), c = a * x0 + b;
      return mkNum(r, 7, 1, P([[a, 'x'], [b, '']]) + ' = ' + S(c) + ' 일 때, x 의 값은?', x0, '상수항을 이항해서 양변을 ' + a + ' 로 나눠요.', { v: { t: 'eq', l: a + '*x+' + (b < 0 ? '(' + b + ')' : b), r: String(c), x: x0 } });
    }
    var a2 = nz(r, -8, 9), c2; do { c2 = nz(r, -8, 9); } while (c2 === a2);
    var b2 = nz(r, -12, 12), d2 = (a2 - c2) * x0 + b2;
    return mkNum(r, 7, 2, P([[a2, 'x'], [b2, '']]) + ' = ' + P([[c2, 'x'], [d2, '']]) + ' 일 때, x 의 값은?', x0, 'x 항은 한쪽으로, 상수항은 다른 쪽으로 옮겨요.', { v: { t: 'eq', l: a2 + '*x+(' + b2 + ')', r: c2 + '*x+(' + d2 + ')', x: x0 } });
  });

  U('m1-coord', 7, '좌표평면과 그래프', 2, '사분면, 축 위의 점, 두 점 사이의 거리', function (r, t) {
    if (t === 1) {
      var a, b;
      do { a = nz(r, -7, 7); b = nz(r, -7, 7); } while (a > 0 && b > 0 && r.chance(.8));
      var q = a > 0 && b > 0 ? '제1사분면' : a < 0 && b > 0 ? '제2사분면' : a < 0 && b < 0 ? '제3사분면' : '제4사분면';
      return mk(r, '점 (' + S(a) + ', ' + S(b) + ') 은 어느 사분면 위의 점일까요?', q, 'x 좌표가 ' + (a > 0 ? '양수' : '음수') + ', y 좌표가 ' + (b > 0 ? '양수' : '음수') + ' 예요.', { wrong: ['제1사분면', '제2사분면', '제3사분면', '제4사분면'], v: { t: 'quad', a: a, b: b } });
    }
    var k = r.int(1, 3);
    if (k === 1) {
      var ax = nz(r, -7, 7), onx = r.chance(.5), ans = onx ? 'x축' : 'y축';
      return mk(r, '점 (' + (onx ? S(ax) + ', 0' : '0, ' + S(ax)) + ') 은 어디 위에 있을까요?', ans, onx ? 'y 좌표가 0 이면 x축 위의 점이에요.' : 'x 좌표가 0 이면 y축 위의 점이에요.', { wrong: ['x축', 'y축', '원점', '제1사분면'], v: { t: 'onaxis', onx: onx } });
    }
    if (k === 2) {
      var y0 = nz(r, -6, 6), x1 = r.int(-7, 2), d = r.int(2, 9), x2 = x1 + d;
      return mkNum(r, 7, 2, '두 점 (' + S(x1) + ', ' + S(y0) + '), (' + S(x2) + ', ' + S(y0) + ') 사이의 거리는 얼마일까요?', d, 'y 좌표가 같으니 x 좌표의 차를 구해요: |' + S(x2) + ' − ' + PA(x1) + '| = ' + d, { v: { t: 'dist1', p: [x1, y0], q: [x2, y0], ans: d } });
    }
    var x0 = nz(r, -6, 6), y1 = r.int(-7, 2), d2 = r.int(2, 9), y2 = y1 + d2;
    return mkNum(r, 7, 2, '두 점 (' + S(x0) + ', ' + S(y1) + '), (' + S(x0) + ', ' + S(y2) + ') 사이의 거리는 얼마일까요?', d2, 'x 좌표가 같으니 y 좌표의 차를 구해요: |' + S(y2) + ' − ' + PA(y1) + '| = ' + d2, { v: { t: 'dist1', p: [x0, y1], q: [x0, y2], ans: d2 } });
  });

  U('m1-prop', 7, '정비례와 반비례', 2, 'y = ax, y = a/x', function (r, t) {
    if (t === 1) {
      var a = r.int(2, 9), k = r.int(1, 6), m = a * k, n = r.int(7, 15);
      return mkNum(r, 7, 1, 'y 가 x 에 정비례하고 x = ' + k + ' 일 때 y = ' + m + ' 입니다. x = ' + n + ' 일 때 y 의 값은?', a * n, 'y = ' + a + 'x 예요. (' + m + ' ÷ ' + k + ' = ' + a + ')', { v: E(m + '/' + k + '*' + n) });
    }
    var c = r.pick([12, 18, 20, 24, 30, 36, 48, 60]), ds = M.divisors(c).filter(function (d) { return d > 1; });
    var k2 = r.pick(ds), n2; do { n2 = r.pick(ds); } while (n2 === k2);
    return mkNum(r, 7, 2, 'y 가 x 에 반비례하고 x = ' + k2 + ' 일 때 y = ' + c / k2 + ' 입니다. x = ' + n2 + ' 일 때 y 의 값은?', c / n2, 'xy = ' + c + ' 로 일정해요. y = ' + c + ' ÷ x', { v: E(k2 + '*' + c / k2 + '/' + n2) });
  });

  U('m1-stat', 7, '대푯값', 2, '평균·중앙값·최빈값', function (r, t) {
    var n = t === 1 ? 5 : r.pick([5, 6, 7]);
    var kind = t === 1 ? r.pick(['평균', '중앙값']) : r.pick(['중앙값', '최빈값', '평균']);
    var arr;
    if (kind === '평균') {
      var avg = r.int(10, 30); arr = []; var sum = 0;
      for (var i = 0; i < n - 1; i++) { var x = avg + r.int(-5, 5); arr.push(x); sum += x; }
      arr.push(avg * n - sum);
      return mkNum(r, 7, t, '자료 ' + r.shuffle(arr).join(', ') + ' 의 평균은?', avg, '(자료의 합) ÷ (자료의 개수)', { v: { t: 'stat', k: 'mean', a: arr } });
    }
    if (kind === '최빈값') {
      var mode = r.int(2, 20), others = []; while (others.length < n - 2) { var o = r.int(1, 25); if (o !== mode && others.indexOf(o) < 0) others.push(o); }
      arr = r.shuffle([mode, mode].concat(others));
      return mkNum(r, 7, t, '자료 ' + arr.join(', ') + ' 의 최빈값은?', mode, '가장 많이 나온 값이에요.', { v: { t: 'stat', k: 'mode', a: arr } });
    }
    arr = []; while (arr.length < n) { var z = r.int(1, 40); if (arr.indexOf(z) < 0) arr.push(z); }
    var sorted = arr.slice().sort(function (p, q) { return p - q; });
    var med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    return mkNum(r, 7, t, '자료 ' + arr.join(', ') + ' 의 중앙값은?', med, '작은 수부터 늘어놓고 가운데 값을 찾아요.' + (n % 2 ? '' : ' 개수가 짝수이면 가운데 두 값의 평균이에요.'), { num: { digits: 1, step: .5 }, v: { t: 'stat', k: 'median', a: arr } });
  });

  U('m1-angle', 7, '기본 도형', 2, '각, 다각형, 부채꼴', function (r, t) {
    if (t === 1) {
      var a = r.int(20, 160), k = r.int(1, 3);
      if (k === 1) return mkNum(r, 7, 1, '한 직선 위에서 두 각의 합은 180° 입니다. 한 각이 ' + a + '° 이면 다른 각은 몇 도일까요?', 180 - a, '평각은 180° 예요.', { v: E('180-' + a) });
      if (k === 2) return mkNum(r, 7, 1, '두 직선이 만날 때 한 각이 ' + a + '° 이면, 그 맞꼭지각의 크기는 몇 도일까요?', a, '맞꼭지각은 크기가 같아요.', { v: E(a) });
      var b = r.int(10, 80); return mkNum(r, 7, 1, '두 각의 합이 90° 일 때, 한 각이 ' + b + '° 이면 다른 각의 크기는?', 90 - b, '합이 90°인 두 각을 서로의 여각이라고 해요.', { v: E('90-' + b) });
    }
    var kk = r.int(1, 3);
    if (kk === 1) { var n = r.int(5, 12); return mkNum(r, 7, 2, n + '각형의 내각의 크기의 합은 몇 도일까요?', (n - 2) * 180, '(n − 2) × 180° 에서 n = ' + n, { v: E('(' + n + '-2)*180') }); }
    if (kk === 2) { var nn = r.pick([5, 6, 8, 10, 12]); return mkNum(r, 7, 2, '정' + nn + '각형의 한 내각의 크기는 몇 도일까요?', (nn - 2) * 180 / nn, '내각의 합 ' + (nn - 2) * 180 + '° 를 ' + nn + '으로 나눠요.', { v: E('(' + nn + '-2)*180/' + nn) }); }
    var rad, deg, cArc, cArea, tries = 0;
    do { rad = r.pick([3, 4, 6, 9, 12]); deg = r.pick([30, 45, 60, 90, 120, 150, 180, 240, 270]); cArc = rad * deg / 180; cArea = rad * rad * deg / 360; tries++; } while ((!Number.isInteger(cArc) || !Number.isInteger(cArea)) && tries < 200);
    var area = r.chance(.5);
    var ans = (area ? cArea : cArc) + 'π';
    return mk(r, '반지름이 ' + rad + 'cm, 중심각이 ' + deg + '° 인 부채꼴의 ' + (area ? '넓이' : '호의 길이') + '는? (π 는 원주율)', ans, area ? '넓이 = π × (반지름)² × (중심각 ÷ 360)' : '호의 길이 = 2π × (반지름) × (중심각 ÷ 360)',
      { wrong: [(area ? cArc : cArea) + 'π', (area ? cArea * 2 : cArc * 2) + 'π', (area ? cArea + 1 : cArc + 1) + 'π', (area ? cArea / 2 : cArc / 2) + 'π'], v: { t: 'sector', r: rad, deg: deg, area: area, ans: ans } });
  });

  /* ================= 중2 ================= */
  U('m2-rep', 8, '유리수와 순환소수', 2, '유한소수와 순환소수', function (r, t) {
    if (t === 1) {
      var d = r.int(3, 40), n = r.int(1, d - 1);
      var red = M.red(n, d), fac = M.primeFactors(red[1]);
      var fin = Object.keys(fac).every(function (p) { return p === '2' || p === '5'; });
      return mk(r, '{' + n + '/' + d + '} 을 소수로 나타내면 어떤 소수일까요?', fin ? '유한소수' : '순환소수', '기약분수 {' + red[0] + '/' + red[1] + '} 의 분모를 소인수분해하면 ' + (red[1] === 1 ? '1' : M.factorStr(red[1])) + ' 이에요. 소인수가 2나 5뿐이면 유한소수예요.', { wrong: ['유한소수', '순환소수', '정수', '알 수 없다'], v: { t: 'fin', n: n, d: d } });
    }
    if (r.chance(.5)) {   /* 순환소수: 소수점 아래 k번째 자리 숫자 */
      var fr = r.pick([[1, 3], [2, 3], [1, 6], [5, 6], [1, 7], [2, 7], [3, 7], [1, 9], [4, 9], [1, 11], [5, 11], [7, 12], [1, 13]]), pos = r.int(5, 20);
      var rem = fr[0] % fr[1], dgt = 0;
      for (var z = 0; z < pos; z++) { rem *= 10; dgt = Math.floor(rem / fr[1]); rem = rem % fr[1]; }
      return mkNum(r, 8, 2, '{' + fr[0] + '/' + fr[1] + '} 을 소수로 나타낼 때, 소수점 아래 ' + pos + '번째 자리의 숫자는 얼마일까요?', dgt, '나눗셈을 계속하면 같은 숫자들이 되풀이돼요(순환마디). 되풀이되는 규칙으로 ' + pos + '번째 자리를 찾아요.', { v: { t: 'repdigit', n: fr[0], d: fr[1], pos: pos, ans: dgt } });
    }
    var den = r.pick([4, 8, 16, 20, 25, 40, 50, 5, 2]), nn;
    do { nn = r.int(1, den * 2); } while (nn % den === 0 || M.gcd(nn, den) !== 1);
    var digits = 0, x = den; var p = M.primeFactors(den); digits = Math.max(p[2] || 0, p[5] || 0);
    var scaled = nn * Math.pow(10, digits) / den;
    return mkNum(r, 8, 2, '{' + nn + '/' + den + '} 을 소수로 나타내면?', M.dec(scaled, digits), '분모를 10의 거듭제곱으로 만들거나 ' + nn + ' ÷ ' + den + ' 를 계산해요.', { num: { digits: digits, step: Math.pow(10, -digits) }, v: E(nn + '/' + den) });
  });

  function mono(c, ex) { /* ex: {x:2, y:1} → 3x^{2}y */
    var s = '';
    ['x', 'y'].forEach(function (v) { if (ex[v]) s += v + (ex[v] > 1 ? '^{' + ex[v] + '}' : ''); });
    var a = Math.abs(c);
    return (c < 0 ? '−' : '') + (a === 1 && s ? '' : a) + s;
  }
  U('m2-expr', 8, '식의 계산', 2, '지수법칙, 단항식, 다항식', function (r, t) {
    if (t === 1) {
      var k = r.int(1, 4), m = r.int(2, 6), n = r.int(2, 5);
      if (k === 1) return mk(r, 'a^{' + m + '} × a^{' + n + '} = □', 'a^{' + (m + n) + '}', '밑이 같으면 지수를 더해요.', { wrong: ['a^{' + m * n + '}', 'a^{' + Math.abs(m - n || 1) + '}', '2a^{' + (m + n) + '}', 'a^{' + (m + n + 1) + '}'], v: { t: 'pow', k: 'mul', m: m, n: n, ans: m + n } });
      if (k === 2) return mk(r, '(a^{' + m + '})^{' + n + '} = □', 'a^{' + m * n + '}', '지수끼리 곱해요.', { wrong: ['a^{' + (m + n) + '}', 'a^{' + (m * n + 1) + '}', 'a^{' + Math.abs(m - n || 1) + '}', '2a^{' + m * n + '}'], v: { t: 'pow', k: 'pow', m: m, n: n, ans: m * n } });
      if (k === 3) { var mm = m + n; return mk(r, 'a^{' + mm + '} ÷ a^{' + n + '} = □', 'a^{' + m + '}', '밑이 같으면 지수를 빼요.', { wrong: ['a^{' + (mm + n) + '}', 'a^{' + (mm * n) + '}', 'a^{' + (m + 1) + '}', 'a^{' + Math.max(1, m - 1) + '}'], v: { t: 'pow', k: 'div', m: mm, n: n, ans: m } }); }
      var c1 = r.int(2, 6), c2 = r.int(2, 6), e1 = r.int(1, 3), e2 = r.int(1, 3);
      return mk(r, mono(c1, { x: e1 }) + ' × ' + mono(c2, { x: e2 }) + ' = □', mono(c1 * c2, { x: e1 + e2 }), '계수끼리 곱하고 같은 문자는 지수를 더해요.', { wrong: [mono(c1 + c2, { x: e1 + e2 }), mono(c1 * c2, { x: e1 * e2 }), mono(c1 * c2, { x: e1 + e2 + 1 }), mono(c1 * c2 + 1, { x: e1 + e2 })], v: { t: 'mono', c: c1 * c2, e: e1 + e2, e0: [c1, e1, c2, e2] } });
    }
    var kk2 = r.int(1, 3);
    if (kk2 === 1) {   /* 단항식 ÷ 단항식 */
      var dq = r.int(2, 6), dd0 = r.int(2, 5), de1 = r.int(1, 3), de2 = r.int(2, 5);
      var top = mono(dq * dd0, { x: de1 + de2 });
      return mk(r, top + ' ÷ ' + mono(dd0, { x: de1 }) + ' = □', mono(dq, { x: de2 }), '계수끼리 나누고 지수는 빼요.', { wrong: [mono(dq, { x: de1 + de2 }), mono(dq * dd0, { x: de2 }), mono(dq + dd0, { x: de2 }), mono(dq, { x: de2 + 1 })], v: { t: 'monodiv', c: dq * dd0, e: de1 + de2, c2: dd0, e2: de1, ans: [dq, de2] } });
    }
    if (kk2 === 2) {   /* 단항식 × 다항식 */
      var mc = nz(r, -4, 5), me = r.int(1, 2), pa = nz(r, -4, 5), pb = nz(r, -5, 5);
      var res1 = [mc * pa, me + 1], res2 = [mc * pb, me];
      var ansM = P([[res1[0], 'x' + (res1[1] > 1 ? '^{' + res1[1] + '}' : '')], [res2[0], 'x' + (res2[1] > 1 ? '^{' + res2[1] + '}' : '')]]);
      var inner = P([[pa, 'x'], [pb, '']]);
      return mk(r, mono(mc, { x: me }) + '(' + inner + ') = □', ansM.replace(/x\^\{1\}/g, 'x'), '단항식을 괄호 안의 각 항에 곱해요.', { wrong: [P([[mc * pa, 'x' + (res1[1] > 1 ? '^{' + res1[1] + '}' : '')], [pb, 'x' + (res2[1] > 1 ? '^{' + res2[1] + '}' : '')]]), P([[mc + pa, 'x' + (res1[1] > 1 ? '^{' + res1[1] + '}' : '')], [mc + pb, 'x' + (res2[1] > 1 ? '^{' + res2[1] + '}' : '')]]), P([[mc * pa, 'x' + (res1[1] > 1 ? '^{' + res1[1] + '}' : '')], [-mc * pb, 'x' + (res2[1] > 1 ? '^{' + res2[1] + '}' : '')]])].map(function (x) { return x.replace(/x\^\{1\}/g, 'x'); }), v: { t: 'distx', mc: mc, me: me, pa: pa, pb: pb } });
    }
    var a1 = nz(r, -5, 6), b1 = nz(r, -5, 6), a2 = nz(r, -5, 6), b2 = nz(r, -5, 6), minus = r.chance(.5);
    var cx = minus ? a1 - a2 : a1 + a2, cy = minus ? b1 - b2 : b1 + b2;
    var f = function (p, q) { return P([[p, 'x'], [q, 'y']]); };
    return mk(r, '(' + f(a1, b1) + ') ' + (minus ? '−' : '+') + ' (' + f(a2, b2) + ') = □', f(cx, cy), '괄호를 풀고 x 끼리, y 끼리 계산해요.' + (minus ? ' (빼는 괄호는 부호가 모두 바뀌어요)' : ''),
      { wrong: [f(cx, minus ? b1 + b2 : b1 - b2), f(minus ? a1 + a2 : a1 - a2, cy), f(cx + 1, cy), f(cx, cy + 1), f(-cx, cy)], v: { t: 'xy', a1: a1, b1: b1, a2: a2, b2: b2, minus: minus } });
  });

  U('m2-ineq', 8, '일차부등식', 2, '일차부등식의 해', function (r, t) {
    var a = nz(r, -6, 7); if (Math.abs(a) < 2) a = r.pick([2, 3, -2, -3]);
    if (t === 1 && a < 0) a = -a;
    var x0 = r.int(-6, 8), b = nz(r, -9, 9), c = a * x0 + b;
    var sym = r.pick(['<', '>', '≤', '≥']);
    var flip = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
    var ans = 'x ' + (a > 0 ? sym : flip[sym]) + ' ' + S(x0);
    var wr = ['x ' + (a > 0 ? flip[sym] : sym) + ' ' + S(x0), 'x ' + (a > 0 ? sym : flip[sym]) + ' ' + S(-x0 || 1), 'x ' + (a > 0 ? sym : flip[sym]) + ' ' + S(x0 + 1), 'x ' + (a > 0 ? flip[sym] : sym) + ' ' + S(x0 - 1)];
    return mk(r, P([[a, 'x'], [b, '']]) + ' ' + sym + ' ' + S(c) + ' 의 해는?', ans, a < 0 ? '음수로 양변을 나누면 부등호의 방향이 바뀌어요.' : '양변을 ' + a + ' 로 나누어도 부등호의 방향은 그대로예요.', { wrong: wr, v: { t: 'ineq', a: a, b: b, c: c, sym: sym, x0: x0, ans: ans } });
  });

  U('m2-sys', 8, '연립방정식', 2, '두 일차방정식 풀기', function (r, t) {
    var x, y, a1, b1, a2, b2, tries = 0;
    do {
      x = r.int(-5, 6); y = r.int(-5, 6);
      var lim = t === 1 ? 3 : 6;
      a1 = nz(r, -lim, lim); b1 = nz(r, -lim, lim); a2 = nz(r, -lim, lim); b2 = nz(r, -lim, lim); tries++;
    } while ((a1 * b2 - a2 * b1 === 0 || Math.abs(a1) === Math.abs(b1) && t === 2 && false) && tries < 500);
    var c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y;
    var ask = r.pick(['x', 'y', 'x+y']);
    var val = ask === 'x' ? x : ask === 'y' ? y : x + y;
    return mkNum(r, 8, t, '연립방정식  ' + P([[a1, 'x'], [b1, 'y']]) + ' = ' + S(c1) + ' ,  ' + P([[a2, 'x'], [b2, 'y']]) + ' = ' + S(c2) + '  의 해를 (x, y) 라 할 때, ' + (ask === 'x+y' ? 'x + y' : ask) + ' 의 값은?', val, '가감법이나 대입법으로 풀어요. (x, y) = (' + S(x) + ', ' + S(y) + ')', { v: { t: 'sys', rows: [[a1, b1, c1], [a2, b2, c2]], ask: ask, val: val } });
  });

  U('m2-linear', 8, '일차함수', 2, '기울기, 절편, 그래프', function (r, t) {
    if (t === 1) {
      var a = nz(r, -6, 7), b = nz(r, -9, 9), k = r.int(1, 3);
      var f = 'y = ' + P([[a, 'x'], [b, '']]);
      if (k === 1) return mkNum(r, 8, 1, '일차함수 ' + f + ' 의 그래프의 기울기는?', a, 'x 의 계수가 기울기예요.', { v: E(a) });
      if (k === 2) return mkNum(r, 8, 1, '일차함수 ' + f + ' 의 그래프의 y 절편은?', b, '상수항이 y 절편이에요. (x = 0 일 때의 y 값)', { v: E(b) });
      var x = r.int(-4, 5); return mkNum(r, 8, 1, '일차함수 ' + f + ' 에서 x = ' + S(x) + ' 일 때 y 의 값은?', a * x + b, 'x 에 ' + S(x) + ' 를 대입해요.', { v: E('(' + a + ')*(' + x + ')+(' + b + ')') });
    }
    var kk = r.int(1, 3);
    if (kk === 1) { var x1 = r.int(-4, 3), dx = r.int(1, 4), s = nz(r, -4, 5), y1 = r.int(-6, 6); return mkNum(r, 8, 2, '두 점 (' + S(x1) + ', ' + S(y1) + '), (' + S(x1 + dx) + ', ' + S(y1 + s * dx) + ') 을 지나는 직선의 기울기는?', s, '(y 의 증가량) ÷ (x 의 증가량)', { v: { t: 'slope', p: [x1, y1], q: [x1 + dx, y1 + s * dx], ans: s } }); }
    if (kk === 2) { var a2 = nz(r, -4, 5), x0 = nz(r, -6, 6), b2 = -a2 * x0; return mkNum(r, 8, 2, '일차함수 y = ' + P([[a2, 'x'], [b2, '']]) + ' 의 그래프의 x 절편은?', x0, 'y = 0 을 대입해서 x 를 구해요.', { v: { t: 'xint', a: a2, b: b2, ans: x0 } }); }
    var a3 = nz(r, -4, 5), b3 = nz(r, -6, 6), xs = r.shuffle([-2, -1, 1, 2, 3]).slice(0, 4);
    var good = xs[0], pts = xs.map(function (xx, i) { return '(' + S(xx) + ', ' + S(a3 * xx + b3 + (i === 0 ? 0 : r.pick([1, -1, 2, -2]))) + ')'; });
    return mk(r, '일차함수 y = ' + P([[a3, 'x'], [b3, '']]) + ' 의 그래프 위에 있는 점은?', pts[0], '각 점의 x 를 식에 넣어 y 가 같은지 확인해요.', { wrong: pts.slice(1), v: { t: 'online', a: a3, b: b3, pt: pts[0] } });
  });

  U('m2-tri', 8, '삼각형과 사각형의 성질', 2, '이등변삼각형, 외각, 평행사변형', function (r, t) {
    if (t === 1) {
      if (r.chance(.5)) { var base = r.int(25, 80); return mkNum(r, 8, 1, '이등변삼각형에서 한 밑각이 ' + base + '° 이면 꼭지각의 크기는?', 180 - 2 * base, '두 밑각이 같고 세 각의 합은 180° 예요.', { v: E('180-2*' + base) }); }
      var top = r.int(2, 17) * 10 + (r.chance(.5) ? 0 : 0); top = Math.max(20, Math.min(150, top)); if (top % 2) top++;
      return mkNum(r, 8, 1, '이등변삼각형의 꼭지각이 ' + top + '° 일 때, 한 밑각의 크기는?', (180 - top) / 2, '(180° − 꼭지각) ÷ 2', { v: E('(180-' + top + ')/2') });
    }
    var k = r.int(1, 2);
    if (k === 1) { var p = r.int(30, 80), q = r.int(30, 80); return mkNum(r, 8, 2, '삼각형 ABC 에서 ∠A = ' + p + '°, ∠B = ' + q + '° 일 때, ∠C 의 외각의 크기는?', p + q, '한 외각은 이웃하지 않는 두 내각의 합과 같아요.', { v: E(p + '+' + q) }); }
    var ang = r.int(50, 130);
    return mkNum(r, 8, 2, '평행사변형 ABCD 에서 ∠A = ' + ang + '° 일 때, ∠B 의 크기는?', 180 - ang, '이웃한 두 각의 합은 180° 예요.', { v: E('180-' + ang) });
  });

  var TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [12, 16, 20], [10, 24, 26], [15, 20, 25]];
  U('m2-pyth', 8, '피타고라스 정리', 2, '직각삼각형의 변의 길이', function (r, t) {
    var T = r.pick(TRIPLES).slice(), a = T[0], b = T[1], c = T[2];
    if (r.chance(.5)) { var tmp = a; a = b; b = tmp; }
    if (t === 1) return mkNum(r, 8, 1, '직각을 낀 두 변의 길이가 ' + a + ', ' + b + ' 인 직각삼각형의 빗변의 길이는?', c, a + '² + ' + b + '² = ' + (a * a + b * b) + ' = ' + c + '²', { v: E('Math.sqrt(' + a + '*' + a + '+' + b + '*' + b + ')') });
    if (r.chance(.5)) return mkNum(r, 8, 2, '빗변의 길이가 ' + c + ' 이고 다른 한 변이 ' + a + ' 인 직각삼각형에서, 나머지 한 변의 길이는?', b, c + '² − ' + a + '² = ' + (c * c - a * a) + ' = ' + b + '²', { v: E('Math.sqrt(' + c + '*' + c + '-' + a + '*' + a + ')') });
    var fake = r.chance(.5), x = fake ? c + r.pick([1, 2]) : c;
    return mk(r, '세 변의 길이가 ' + a + ', ' + b + ', ' + x + ' 인 삼각형은 직각삼각형일까요?', fake ? '아니다' : '맞다', '가장 긴 변의 제곱이 나머지 두 변의 제곱의 합과 같은지 확인해요: ' + (a * a + b * b) + ' 과 ' + x * x, { wrong: ['맞다', '아니다'], v: { t: 'right', s: [a, b, x], ans: fake ? 'no' : 'yes' } });
  });

  U('m2-prob', 8, '경우의 수와 확률', 2, '경우의 수, 확률', function (r, t) {
    if (t === 1) {
      var k = r.int(1, 3);
      if (k === 1) { var n = r.int(2, 5); return mkNum(r, 8, 1, '동전 ' + n + '개를 동시에 던질 때 나오는 모든 경우의 수는?', Math.pow(2, n), '동전 한 개마다 2가지씩, ' + n + '번 곱해요.', { v: E('Math.pow(2,' + n + ')') }); }
      if (k === 2) { var s = r.int(3, 11), cnt = 0; for (var i = 1; i <= 6; i++) for (var j = 1; j <= 6; j++) if (i + j === s) cnt++; return mkNum(r, 8, 1, '주사위 2개를 동시에 던질 때, 눈의 합이 ' + s + ' 이 되는 경우의 수는?', cnt, '순서를 구분해 (' + Math.max(1, s - 6) + ', ' + (s - Math.max(1, s - 6)) + ') 처럼 하나씩 찾아봐요.', { v: { t: 'dice', s: s, ans: cnt } }); }
      var a = r.int(2, 5), b = r.int(2, 5); return mkNum(r, 8, 1, '티셔츠 ' + a + '종류와 바지 ' + b + '종류가 있습니다. 티셔츠와 바지를 하나씩 골라 입는 경우의 수는?', a * b, '곱의 법칙: ' + a + ' × ' + b, { v: E(a + '*' + b) });
    }
    var kk = r.int(1, 3), num, den, label;
    if (kk === 1) { var sets = [['짝수', [2, 4, 6]], ['3의 배수', [3, 6]], ['소수', [2, 3, 5]], ['4 이하의 수', [1, 2, 3, 4]], ['5 이상의 수', [5, 6]]]; var st = r.pick(sets); num = st[1].length; den = 6; label = '주사위 한 개를 던질 때, ' + st[0] + '가 나올 확률은?'; }
    else if (kk === 2) { var N = r.pick([10, 12, 15, 20]), m = r.int(2, 5); num = Math.floor(N / m); den = N; label = '1부터 ' + N + '까지의 번호가 하나씩 적힌 카드 중 한 장을 뽑을 때, ' + m + '의 배수가 나올 확률은?'; }
    else { var red = r.int(2, 7), blue = r.int(2, 7); num = red; den = red + blue; label = '빨간 공 ' + red + '개와 파란 공 ' + blue + '개가 든 주머니에서 공 한 개를 꺼낼 때, 빨간 공일 확률은?'; }
    var ans = M.fr(num, den);
    var wr = [M.fr(den - num, den), M.fr(num, den + 1), M.fr(num + 1, den), M.fr(num, den - 1 || 2), M.fr(den, num)];
    return mk(r, label, ans, '(일어나는 경우의 수) ÷ (모든 경우의 수) = ' + num + ' ÷ ' + den, { wrong: wr.filter(function (x) { return x !== ans; }), v: E(num + '/' + den) });
  });
})(typeof window !== 'undefined' ? window : globalThis);
