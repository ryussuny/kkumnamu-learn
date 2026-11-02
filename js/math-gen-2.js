/* 수학 생성기 ② — 초4~초6 */
(function (g) {
  var KN = g.KN, M = KN.m, mk = KN.mk, mkNum = KN.mkNum;
  function U(id, grade, name, tiers, desc, gen) { KN.mathUnits.push({ id: id, subj: 'math', grade: grade, name: name, tiers: tiers, desc: desc, gen: gen }); }
  var E = function (e) { return { t: 'e', e: String(e) }; };
  var FRUIT = ['사과', '배', '귤', '포도', '수박', '바나나'];
  var PN = ['일', '십', '백', '천', '만', '십만', '백만', '천만', '억', '십억'];

  /* ================= 초4 ================= */
  U('g4-big', 4, '큰 수', 2, '만·억 단위, 자릿값', function (r, t) {
    var k = r.int(1, 3);
    if (k === 1) {
      var unit = t === 1 ? r.pick([[10000, '1만'], [100000, '10만'], [1000000, '100만']]) : r.pick([[100000000, '1억'], [10000000, '1000만']]);
      var n = r.int(2, 9);
      return mkNum(r, 4, t, unit[1] + ' 이 ' + n + '개이면 얼마일까요? (숫자로 써 보세요)', unit[0] * n, unit[1] + ' 이 ' + n + '개이면 ' + unit[1] + '의 ' + n + '배예요.', { v: E(unit[0] + '*' + n) });
    }
    if (k === 2) {
      var digits = t === 1 ? 7 : 9, num, dd, pos, s0;
      do {
        num = r.int(Math.pow(10, digits - 1), Math.pow(10, digits) - 1); s0 = String(num);
        pos = r.int(0, digits - 1); dd = Math.floor(num / Math.pow(10, pos)) % 10;
      } while (dd === 0 || s0.split(String(dd)).length !== 2);
      return mkNum(r, 4, t, M.comma(num) + ' 에서 숫자 ' + dd + ' 이 나타내는 값은 얼마일까요?', dd * Math.pow(10, pos), dd + ' 은 ' + PN[pos] + '의 자리 숫자라서 ' + dd * Math.pow(10, pos) + ' 을 나타내요.', { v: E(dd + '*Math.pow(10,' + pos + ')') });
    }
    var x = r.int(2, 9) * Math.pow(10, t === 1 ? 4 : 7) + r.int(1, 9) * Math.pow(10, t === 1 ? 3 : 6);
    return mkNum(r, 4, t, M.comma(x) + ' 을 10배 한 수는 무엇일까요?', x * 10, '10배 하면 수 뒤에 0이 하나 더 붙어요.', { v: E(x + '*10') });
  });

  U('g4-muldiv', 4, '곱셈과 나눗셈', 2, '세 자리 수 × 두 자리 수, 두 자리 수로 나누기', function (r, t) {
    if (t === 1) { var a = r.int(120, 499), b = r.int(12, 49); return mkNum(r, 4, 1, a + ' × ' + b + ' = □', a * b, a + ' × ' + (b % 10) + ' 와 ' + a + ' × ' + (b - b % 10) + ' 을 더해요.', { v: E(a + '*' + b) }); }
    var d = r.int(12, 49), q = r.int(5, 40), rem = r.chance(.3) ? 0 : r.int(1, d - 1), n = d * q + rem;
    var ask = r.chance(.5) ? 'q' : 'r';
    if (rem === 0) ask = 'q';
    return ask === 'q' ? mkNum(r, 4, 2, n + ' ÷ ' + d + ' 의 몫은 얼마일까요?', q, d + ' × ' + q + ' = ' + d * q + (rem ? ', 나머지 ' + rem : ''), { v: E('Math.floor(' + n + '/' + d + ')') })
      : mkNum(r, 4, 2, n + ' ÷ ' + d + ' 의 나머지는 얼마일까요?', rem, '나머지는 나누는 수 ' + d + ' 보다 작아요.', { v: E(n + '%' + d) });
  });

  U('g4-angle', 4, '각도', 2, '각의 크기, 삼각형·사각형의 각', function (r, t) {
    if (t === 1) {
      var k = r.int(1, 3);
      if (k === 1) { var a = r.int(20, 80), b = r.int(20, 160 - a); return mkNum(r, 4, 1, '삼각형의 두 각이 ' + a + '°, ' + b + '° 입니다. 나머지 한 각은 몇 도일까요?', 180 - a - b, '삼각형의 세 각의 합은 180° 예요.', { v: E('180-' + a + '-' + b) }); }
      if (k === 2) { var x = r.int(2, 17) * 5; return mkNum(r, 4, 1, '직각 90° 에서 ' + x + '° 를 빼면 몇 도일까요?', 90 - x, '90° − ' + x + '° = ' + (90 - x) + '°', { v: E('90-' + x) }); }
      var d = r.pick([15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 170, 25, 85, 95]);
      var kind = d < 90 ? '예각' : d === 90 ? '직각' : '둔각';
      return mk(r, d + '° 인 각은 어떤 각일까요?', kind, '90° 보다 작으면 예각, 90° 이면 직각, 90° 보다 크고 180° 보다 작으면 둔각이에요.', { wrong: ['예각', '직각', '둔각'], v: { t: 'angleKind', d: d } });
    }
    var kk = r.int(1, 2);
    if (kk === 1) { var p = r.int(60, 110), q = r.int(60, 110), s = r.int(60, 110); return mkNum(r, 4, 2, '사각형의 세 각이 ' + p + '°, ' + q + '°, ' + s + '° 입니다. 나머지 한 각은 몇 도일까요?', 360 - p - q - s, '사각형의 네 각의 합은 360° 예요.', { v: E('360-' + p + '-' + q + '-' + s) }); }
    var u = r.int(4, 14) * 10, w = r.int(3, 12) * 10;
    return r.chance(.5) ? mkNum(r, 4, 2, u + '° + ' + w + '° = □°', u + w, '각도도 자연수처럼 더해요.', { v: E(u + '+' + w) })
      : mkNum(r, 4, 2, (u + w) + '° − ' + w + '° = □°', u, '각도도 자연수처럼 빼요.', { v: E((u + w) + '-' + w) });
  });

  U('g4-frac', 4, '분수의 덧셈과 뺄셈', 2, '분모가 같은 분수', function (r, t) {
    var op = r.chance(.5) ? '+' : '−', sg = op === '+' ? '+' : '-';
    if (t === 1) {
      var n, a, b, res, tries = 0, ok = false;
      while (!ok && tries++ < 400) {
        n = r.int(5, 12); a = r.int(1, n - 1); b = r.int(1, n - 1);
        if (op === '−' && a <= b) continue;
        res = op === '+' ? a + b : a - b;
        ok = res < n && M.gcd(res, n) === 1;
      }
      if (!ok) { n = 7; a = op === '+' ? 2 : 5; b = op === '+' ? 3 : 2; res = op === '+' ? 5 : 3; }
      var wr = [res + 1, res - 1, res + 2].filter(function (x) { return x > 0 && x !== res; }).map(function (x) { return '{' + x + '/' + n + '}'; });
      wr.push('{' + res + '/' + (n + n) + '}');
      return mk(r, '{' + a + '/' + n + '} ' + op + ' {' + b + '/' + n + '} = □', '{' + res + '/' + n + '}', '분모는 그대로 두고 분자끼리 ' + (op === '+' ? '더해요' : '빼요') + '.', { wrong: wr, v: E('(' + a + sg + b + ')/' + n) });
    }
    var n2, w1, w2, n1, nn2, A, B, total, tr = 0, good = false;
    while (!good && tr++ < 600) {
      n2 = r.int(5, 12); w1 = r.int(1, 4); w2 = r.int(1, 4); n1 = r.int(1, n2 - 1); nn2 = r.int(1, n2 - 1);
      A = w1 * n2 + n1; B = w2 * n2 + nn2;
      if (op === '−' && A <= B) continue;
      total = op === '+' ? A + B : A - B;
      good = total % n2 !== 0 && M.gcd(total % n2, n2) === 1;
    }
    if (!good) { n2 = 7; A = 17; B = 9; total = op === '+' ? 26 : 8; }
    var show = function (x) { return '{' + Math.floor(x / n2) + ' ' + (x % n2) + '/' + n2 + '}'; };
    var disp = function (N) { return M.mixed(N, n2); };
    return mk(r, show(A) + ' ' + op + ' ' + show(B) + ' = □', disp(total),
      '대분수를 가분수로 바꾸어 계산해요. {' + A + '/' + n2 + '} ' + op + ' {' + B + '/' + n2 + '} = {' + total + '/' + n2 + '}',
      { wrong: [disp(total + 1), disp(total - 1), disp(total + n2)], v: E('(' + A + sg + B + ')/' + n2) });
  });

  U('g4-dec', 4, '소수의 덧셈과 뺄셈', 2, '소수 한 자리, 두 자리', function (r, t) {
    var p = t === 1 ? 1 : 2, mx = p === 1 ? 99 : 999;
    var a = r.int(11, mx), b = r.int(11, mx);
    if (r.chance(.5)) return mkNum(r, 4, 2, M.dec(a, p) + ' + ' + M.dec(b, p) + ' = □', M.dec(a + b, p), '소수점끼리 줄을 맞추어 더해요.', { num: { digits: p, step: Math.pow(10, -p) }, v: E('(' + a + '+' + b + ')/' + Math.pow(10, p)) });
    var hi = Math.max(a, b), lo = Math.min(a, b);
    if (hi === lo) hi += 3;
    return mkNum(r, 4, 2, M.dec(hi, p) + ' − ' + M.dec(lo, p) + ' = □', M.dec(hi - lo, p), '소수점끼리 줄을 맞추어 빼요.', { num: { digits: p, step: Math.pow(10, -p) }, v: E('(' + hi + '-' + lo + ')/' + Math.pow(10, p)) });
  });

  U('g4-blank', 4, '□ 구하기', 2, '곱셈과 나눗셈의 관계, 식 세우기', function (r, t) {
    var a = r.int(3, 12), b = r.int(3, 12);
    if (t === 1) {
      var k = r.int(1, 3);
      if (k === 1) return mkNum(r, 4, 1, '□ × ' + a + ' = ' + a * b, b, '곱셈을 나눗셈으로 바꿔요: ' + a * b + ' ÷ ' + a + ' = ' + b, { v: E(a * b + '/' + a) });
      if (k === 2) return mkNum(r, 4, 1, a * b + ' ÷ □ = ' + a, b, a * b + ' ÷ ' + a + ' = ' + b, { v: E(a * b + '/' + a) });
      return mkNum(r, 4, 1, '□ ÷ ' + b + ' = ' + a, a * b, a + ' × ' + b + ' = ' + a * b, { v: E(a + '*' + b) });
    }
    var c = r.int(2, 30);
    return mkNum(r, 4, 2, a + ' × □ + ' + c + ' = ' + (a * b + c), b, '먼저 ' + c + '을 빼요: ' + (a * b + c) + ' − ' + c + ' = ' + a * b + ', 그다음 ' + a + '로 나눠요.', { v: E('(' + (a * b + c) + '-' + c + ')/' + a) });
  });

  U('g4-chart', 4, '표와 막대그래프 읽기', 2, '자료를 보고 합과 차 구하기', function (r, t) {
    var names = r.shuffle(FRUIT).slice(0, 4), counts = [], seen = {};
    names.forEach(function () { var c; do { c = r.int(5, 40); } while (seen[c]); seen[c] = 1; counts.push(c); });
    var tab = names.map(function (n, i) { return n + ' ' + counts[i] + '명'; }).join(', ');
    var head = '좋아하는 과일을 조사한 결과예요.  ' + tab + '.  ';
    if (t === 1) {
      var i = r.int(0, 3), j; do { j = r.int(0, 3); } while (j === i);
      return mkNum(r, 4, 1, head + KN.j(names[i], '과와') + ' ' + KN.j(names[j], '을를') + ' 좋아하는 학생은 모두 몇 명일까요?', counts[i] + counts[j], counts[i] + ' + ' + counts[j] + ' = ' + (counts[i] + counts[j]), { v: E(counts[i] + '+' + counts[j]) });
    }
    var tot = counts.reduce(function (a, c) { return a + c; }, 0);
    return mkNum(r, 4, 2, head + '조사에 참여한 학생은 모두 몇 명일까요?', tot, '네 수를 모두 더해요.', { v: E(counts.join('+')) });
  });

  /* ================= 초5 ================= */
  U('g5-mixed', 5, '혼합 계산', 2, '덧셈·뺄셈·곱셈·나눗셈이 섞인 식', function (r, t) {
    var a, b, c, d, disp, js, ans;
    if (t === 1) {
      var k = r.int(1, 3);
      a = r.int(5, 40); b = r.int(2, 9); c = r.int(2, 9);
      if (k === 1) { disp = a + ' + ' + b + ' × ' + c; js = a + '+' + b + '*' + c; }
      else if (k === 2) { var prod = b * c; disp = a + prod + ' − ' + b + ' × ' + c; js = (a + prod) + '-' + b + '*' + c; }
      else { var dv = r.int(2, 9), qv = r.int(2, 9); disp = a + ' + ' + dv * qv + ' ÷ ' + dv + ' × ' + b; js = a + '+' + dv * qv + '/' + dv + '*' + b; }
    } else {
      var kk = r.int(1, 3);
      if (kk === 1) { a = r.int(3, 20); b = r.int(2, 20); c = r.int(2, 9); disp = '(' + a + ' + ' + b + ') × ' + c; js = '(' + a + '+' + b + ')*' + c; }
      else if (kk === 2) { var dd = r.int(2, 9), q = r.int(2, 9), e = r.int(2, 9); disp = '(' + (dd * q) + ' ÷ ' + dd + ' + ' + e + ') × ' + r.int(2, 6); js = disp.replace(/×/g, '*').replace(/÷/g, '/'); }
      else { a = r.int(20, 60); b = r.int(2, 9); c = r.int(2, 9); d = r.int(2, 9); disp = a + ' − ' + b + ' × ' + c + ' + ' + d; js = a + '-' + b + '*' + c + '+' + d; if (a - b * c < 0) return KN.mathUnits.filter(function (u) { return u.id === 'g5-mixed'; })[0].gen(r, t); }
    }
    ans = Function('return ' + js)();
    var why = disp.indexOf('(') >= 0 ? '괄호 안을 먼저, 그다음 곱셈과 나눗셈, 마지막에 덧셈과 뺄셈을 해요.' : '곱셈과 나눗셈을 먼저, 그다음 덧셈과 뺄셈을 해요.';
    return mkNum(r, 5, t, disp + ' = □', ans, why, { v: E(js) });
  });

  U('g5-div', 5, '약수와 배수', 2, '약수와 배수 찾기', function (r, t) {
    if (t === 1) {
      var n = r.pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 48, 60]);
      if (r.chance(.5)) return mkNum(r, 5, 1, n + ' 의 약수는 모두 몇 개일까요?', M.divisors(n).length, n + ' 의 약수: ' + M.divisors(n).join(', '), { v: { t: 'nd', n: n } });
      var divs = M.divisors(n), good = r.shuffle(divs).slice(0, 3), bad;
      do { bad = r.int(3, n - 1); } while (n % bad === 0);
      return mk(r, '다음 중 ' + n + ' 의 약수가 아닌 수는 무엇일까요?', bad, n + ' 을 ' + bad + ' 로 나누면 나머지가 생겨요.', { wrong: good, v: { t: 'notdiv', n: n, x: bad, others: good } });
    }
    var k = r.int(3, 9), m = r.int(10, 60);
    if (r.chance(.5)) { var first = Math.ceil(m / k) * k; return mkNum(r, 5, 2, k + ' 의 배수 중에서 ' + m + ' 보다 큰 수 가운데 가장 작은 수는?', first % k === 0 && first === m ? first + k : first, k + ' 의 배수를 차례로 써 보세요.', { v: E('(Math.floor(' + m + '/' + k + ')+1)*' + k) }); }
    return mkNum(r, 5, 2, k + ' 의 배수 중에서 ' + m + ' 보다 작은 수는 모두 몇 개일까요? (' + k + ' 자신 포함)', Math.floor((m - 1) / k), m + ' ÷ ' + k + ' 의 몫을 생각해 보세요.', { v: E('Math.floor((' + m + '-1)/' + k + ')') });
  });

  U('g5-gcdlcm', 5, '최대공약수와 최소공배수', 2, '공약수, 공배수 구하기', function (r, t) {
    var gg = r.int(2, 9), p = r.pick([2, 3, 4, 5, 7]), q;
    do { q = r.pick([2, 3, 4, 5, 7, 9]); } while (q === p || M.gcd(p, q) !== 1);
    var a = gg * p, b = gg * q;
    if (t === 1) return mkNum(r, 5, 1, a + ' 과 ' + b + ' 의 최대공약수는 얼마일까요?', gg, '두 수를 모두 나눌 수 있는 가장 큰 수예요.', { v: { t: 'gcd', a: a, b: b } });
    if (r.chance(.5)) return mkNum(r, 5, 2, a + ' 과 ' + b + ' 의 최소공배수는 얼마일까요?', a * b / gg, '두 수의 공통인 배수 중에서 가장 작은 수예요.', { v: { t: 'lcm', a: a, b: b } });
    return mkNum(r, 5, 2, '가로 ' + a + 'cm, 세로 ' + b + 'cm 인 직사각형을 크기가 같은 정사각형으로 남김없이 나누려고 해요. 정사각형의 한 변은 가장 길게 몇 cm 일까요?', gg, '두 길이의 최대공약수를 구해요.', { v: { t: 'gcd', a: a, b: b } });
  });

  U('g5-reduce', 5, '약분과 통분', 2, '기약분수, 분수의 크기 비교', function (r, t) {
    if (t === 1) {
      var d0 = r.int(3, 9), n0, k = r.int(2, 6);
      do { n0 = r.int(1, d0 - 1); } while (M.gcd(n0, d0) !== 1);
      return mk(r, '{' + n0 * k + '/' + d0 * k + '} 을 기약분수로 나타내면 무엇일까요?', '{' + n0 + '/' + d0 + '}', '분모와 분자를 최대공약수 ' + k + ' 로 나누어요.', { wrong: ['{' + (n0 + k) + '/' + (d0 + k) + '}', '{' + (n0 + 1) + '/' + d0 + '}', '{' + n0 + '/' + (d0 + 1) + '}', '{' + d0 + '/' + n0 + '}'], v: { t: 'reduce', n: n0 * k, d: d0 * k, ans: n0 + '/' + d0 } });
    }
    var d1 = r.int(3, 9), d2; do { d2 = r.int(3, 9); } while (d1 === d2);
    var n1 = r.int(1, d1 - 1), n2 = r.int(1, d2 - 1);
    if (n1 * d2 === n2 * d1) n1 = (n1 % (d1 - 1)) + 1;
    if (n1 * d2 === n2 * d1) return KN.mathUnits.filter(function (u) { return u.id === 'g5-reduce'; })[0].gen(r, t);
    var big = n1 * d2 > n2 * d1 ? [n1, d1] : [n2, d2], sm = n1 * d2 > n2 * d1 ? [n2, d2] : [n1, d1];
    return mk(r, '{' + n1 + '/' + d1 + '} 과 {' + n2 + '/' + d2 + '} 중에서 더 큰 분수는 무엇일까요?', '{' + big[0] + '/' + big[1] + '}', '통분해서 비교해요. 분모를 ' + M.lcm(d1, d2) + ' 로 맞추면 {' + n1 * M.lcm(d1, d2) / d1 + '/' + M.lcm(d1, d2) + '} 과 {' + n2 * M.lcm(d1, d2) / d2 + '/' + M.lcm(d1, d2) + '} 이에요.', { wrong: ['{' + sm[0] + '/' + sm[1] + '}'], choices: ['{' + big[0] + '/' + big[1] + '}', '{' + sm[0] + '/' + sm[1] + '}'], kind: 'choice', v: { t: 'fracmax', f: [[n1, d1], [n2, d2]], ans: big[0] + '/' + big[1] } });
  });

  U('g5-fracaddsub', 5, '분수의 덧셈과 뺄셈 (분모가 다를 때)', 2, '통분하여 계산', function (r, t) {
    var d1, d2, n1, n2, op = r.chance(.6) ? '+' : '−';
    do {
      if (t === 1) { d1 = r.pick([2, 3, 4, 5]); d2 = d1 * r.pick([2, 3]); } else { d1 = r.pick([3, 4, 5, 6, 7]); d2 = r.pick([2, 3, 4, 5, 6, 8, 9]); }
      n1 = r.int(1, d1 * 2 - 1); n2 = r.int(1, d2 * 2 - 1);
    } while (d1 === d2 || (op === '−' && n1 * d2 <= n2 * d1) || n1 % d1 === 0 || n2 % d2 === 0);
    var L = M.lcm(d1, d2), A = n1 * L / d1, B = n2 * L / d2, res = op === '+' ? A + B : A - B;
    var ds = function (n, d) { return M.mixed(n, d); };
    var un = function (n, d) { var w = Math.floor(n / d), rm = n % d; return w ? '{' + w + ' ' + rm + '/' + d + '}' : '{' + rm + '/' + d + '}'; };
    var ans = ds(res, L);
    return mk(r, un(n1, d1) + ' ' + op + ' ' + un(n2, d2) + ' = □  (기약분수 또는 대분수로)', ans, '통분하면 {' + A + '/' + L + '} ' + op + ' {' + B + '/' + L + '} = {' + res + '/' + L + '}' + (ans !== '{' + res + '/' + L + '}' ? ' 이고, 약분하면 ' + ans + ' 이에요.' : ' 이에요.'),
      { wrong: [ds(res + 1, L), ds(Math.max(1, op === '+' ? n1 + n2 : n1 - n2), d1 + d2), ds(res - 1 <= 0 ? res + 2 : res - 1, L), ds(res + L, L)], v: E('(' + n1 + '/' + d1 + ')' + (op === '+' ? '+' : '-') + '(' + n2 + '/' + d2 + ')') });
  });

  U('g5-mul', 5, '분수와 소수의 곱셈', 2, '분수 × 자연수, 분수 × 분수, 소수 × 소수', function (r, t) {
    if (t === 1) {
      var d = r.int(3, 9), n = r.int(1, d - 1), m = r.int(2, 9);
      var ans = M.mixed(n * m, d);
      return mk(r, '{' + n + '/' + d + '} × ' + m + ' = □  (기약분수 또는 대분수로)', ans, '분자에 ' + m + ' 를 곱해요: {' + n * m + '/' + d + '}' + (ans !== '{' + n * m + '/' + d + '}' ? ' → 약분하면 ' + ans : ''), { wrong: [M.mixed(n * m + 1, d), M.mixed(n, d * m), M.mixed(n * m - 1 || 2, d), M.mixed(n + m, d)], v: E('(' + n + '/' + d + ')*' + m) });
    }
    if (r.chance(.5)) {
      var a, b, c, e;
      do { b = r.int(2, 8); a = r.int(1, b - 1); e = r.int(2, 8); c = r.int(1, e - 1); } while (M.gcd(a, b) !== 1 || M.gcd(c, e) !== 1);
      var res = M.mixed(a * c, b * e);
      return mk(r, '{' + a + '/' + b + '} × {' + c + '/' + e + '} = □  (기약분수로)', res, '분자끼리, 분모끼리 곱해요: {' + a * c + '/' + b * e + '}' + (M.red(a * c, b * e)[1] !== b * e ? ' → 약분하면 ' + res : ''), { wrong: [M.mixed(a * c + 1, b * e), M.mixed(a + c, b + e), M.mixed(a * c, b + e), M.mixed(a * e, b * c)], v: E('(' + a + '/' + b + ')*(' + c + '/' + e + ')') });
    }
    var x = r.int(2, 9), y = r.int(2, 9);
    return mkNum(r, 5, 2, M.dec(x, 1) + ' × ' + M.dec(y, 1) + ' = □', M.dec(x * y, 2), '자연수처럼 ' + x + ' × ' + y + ' = ' + x * y + ' 로 계산하고 소수점을 둘째 자리에 찍어요.', { num: { digits: 2, step: .01 }, v: E('(' + x + '/10)*(' + y + '/10)') });
  });

  U('g5-area', 5, '다각형의 넓이', 2, '삼각형·평행사변형·사다리꼴·마름모', function (r, t) {
    var k = t === 1 ? r.int(1, 3) : r.int(4, 6);
    if (k === 1) { var w = r.int(3, 15), h = r.int(3, 12); return mkNum(r, 5, 1, '가로 ' + w + 'cm, 세로 ' + h + 'cm 인 직사각형의 넓이는 몇 cm² 일까요?', w * h, '(가로) × (세로)', { v: E(w + '*' + h) }); }
    if (k === 2) { var b = r.int(3, 15), h2 = r.int(3, 12); return mkNum(r, 5, 1, '밑변 ' + b + 'cm, 높이 ' + h2 + 'cm 인 평행사변형의 넓이는 몇 cm² 일까요?', b * h2, '(밑변) × (높이)', { v: E(b + '*' + h2) }); }
    if (k === 3) { var b3 = r.int(2, 12) * 2, h3 = r.int(3, 12); return mkNum(r, 5, 1, '밑변 ' + b3 + 'cm, 높이 ' + h3 + 'cm 인 삼각형의 넓이는 몇 cm² 일까요?', b3 * h3 / 2, '(밑변) × (높이) ÷ 2', { v: E(b3 + '*' + h3 + '/2') }); }
    if (k === 4) { var a4 = r.int(3, 9), b4 = r.int(3, 9), h4 = r.int(2, 8) * 2; return mkNum(r, 5, 2, '윗변 ' + a4 + 'cm, 아랫변 ' + (a4 + b4) + 'cm, 높이 ' + h4 + 'cm 인 사다리꼴의 넓이는 몇 cm² 일까요?', (2 * a4 + b4) * h4 / 2, '{(윗변) + (아랫변)} × (높이) ÷ 2', { v: E('(' + a4 + '+' + (a4 + b4) + ')*' + h4 + '/2') }); }
    if (k === 5) { var d1 = r.int(3, 12) * 2, d2 = r.int(3, 12); return mkNum(r, 5, 2, '두 대각선의 길이가 ' + d1 + 'cm, ' + d2 + 'cm 인 마름모의 넓이는 몇 cm² 일까요?', d1 * d2 / 2, '(한 대각선) × (다른 대각선) ÷ 2', { v: E(d1 + '*' + d2 + '/2') }); }
    var bb = r.int(3, 12), hh = r.int(3, 12);
    return mkNum(r, 5, 2, '넓이가 ' + bb * hh + 'cm² 이고 밑변이 ' + bb + 'cm 인 평행사변형의 높이는 몇 cm 일까요?', hh, '(넓이) ÷ (밑변)', { v: E(bb * hh + '/' + bb) });
  });

  U('g5-mean', 5, '평균과 어림하기', 2, '평균, 올림·버림·반올림', function (r, t) {
    if (t === 1) {
      var n = r.int(3, 6), avg = r.int(30, 60), arr = [], sum = 0;
      for (var i = 0; i < n - 1; i++) { var x = avg + r.int(-6, 6); arr.push(x); sum += x; }
      arr.push(avg * n - sum);
      return mkNum(r, 5, 1, '수학 점수가 ' + arr.join(', ') + ' 일 때, 평균은 얼마일까요?', avg, '(모두 더한 값) ÷ (개수) = ' + avg * n + ' ÷ ' + n, { v: E('(' + arr.join('+') + ')/' + n) });
    }
    var num = r.int(1234, 9876), place = r.pick([10, 100]), mode = r.pick(['올림', '버림', '반올림']);
    var ans = mode === '올림' ? Math.ceil(num / place) * place : mode === '버림' ? Math.floor(num / place) * place : Math.round(num / place) * place;
    if (mode === '반올림' && (num % place) * 2 === place) ans = Math.floor(num / place) * place + place;
    return mkNum(r, 5, 2, num + ' 을 ' + (place === 10 ? '십' : '백') + '의 자리까지 나타내려고 해요. ' + mode + '하면 얼마일까요?', ans, mode === '올림' ? '구하려는 자리 아래에 0이 아닌 수가 있으면 올려요.' : mode === '버림' ? '구하려는 자리 아래를 모두 0으로 바꿔요.' : '구하려는 자리 바로 아래 숫자가 5 이상이면 올리고 4 이하면 버려요.', { v: { t: 'round', n: num, place: place, mode: mode } });
  });

  /* ================= 초6 ================= */
  U('g6-fracdiv', 6, '분수의 나눗셈', 2, '분수 ÷ 자연수, 분수 ÷ 분수', function (r, t) {
    if (t === 1) {
      var d = r.int(3, 9), n = r.int(1, d - 1) + d * r.int(0, 1), m = r.int(2, 6);
      var ans = M.mixed(n, d * m);
      return mk(r, '{' + n + '/' + d + '} ÷ ' + m + ' = □  (기약분수 또는 대분수로)', ans, '나누는 수를 분모에 곱해요: {' + n + '/' + d * m + '}' + (M.red(n, d * m)[1] !== d * m ? ' → 약분하면 ' + ans : ''), { wrong: [M.mixed(n * m, d), M.mixed(n + 1, d * m), M.mixed(n, d + m), M.mixed(n * m, d * m + 1)], v: E('(' + n + '/' + d + ')/' + m) });
    }
    var a, b, c, e;
    do { b = r.int(2, 9); a = r.int(1, b - 1); e = r.int(2, 9); c = r.int(1, e - 1); } while (b === e && a === c || M.gcd(a, b) !== 1 || M.gcd(c, e) !== 1);
    var res = M.mixed(a * e, b * c);
    return mk(r, '{' + a + '/' + b + '} ÷ {' + c + '/' + e + '} = □  (기약분수 또는 대분수로)', res, '나누는 분수의 분모와 분자를 바꾸어 곱해요: {' + a + '/' + b + '} × {' + e + '/' + c + '}', { wrong: [M.mixed(a * c, b * e), M.mixed(a * e + 1, b * c), M.mixed(b * c, a * e), M.mixed(a * e, b * c + 1)], v: E('(' + a + '/' + b + ')/(' + c + '/' + e + ')') });
  });

  U('g6-decdiv', 6, '소수의 나눗셈', 2, '소수 ÷ 자연수, 소수 ÷ 소수', function (r, t) {
    if (t === 1) {
      var dv = r.int(2, 9), q = r.int(11, 99), n = dv * q;
      return mkNum(r, 6, 1, M.dec(n, 1) + ' ÷ ' + dv + ' = □', M.dec(q, 1), '자연수처럼 ' + n + ' ÷ ' + dv + ' = ' + q + ' 로 계산하고 소수점을 위로 올려 찍어요.', { num: { digits: 1, step: .1 }, v: E('(' + n + '/10)/' + dv) });
    }
    var x = r.int(2, 9), q2 = r.int(2, 12), dividend = x * q2;
    return mkNum(r, 6, 2, M.dec(dividend, 1) + ' ÷ ' + M.dec(x, 1) + ' = □', q2, '나누는 수와 나누어지는 수의 소수점을 똑같이 한 자리씩 옮기면 ' + dividend + ' ÷ ' + x + ' 이에요.', { v: E('(' + dividend + '/10)/(' + x + '/10)') });
  });

  U('g6-ratio', 6, '비와 비율', 2, '비, 비율, 백분율', function (r, t) {
    if (t === 1) {
      var a = r.int(1, 9), b = r.int(a + 1, 12);
      if (M.gcd(a, b) !== 1) { a = 1; b = r.int(2, 9); }
      return mk(r, a + ' : ' + b + ' 의 비율을 분수로 나타내면 무엇일까요?', '{' + a + '/' + b + '}', '비교하는 양 ÷ 기준량 = ' + a + ' ÷ ' + b, { wrong: ['{' + b + '/' + a + '}', '{' + a + '/' + (a + b) + '}', '{' + (a + 1) + '/' + b + '}', '{' + a + '/' + (b + 1) + '}'], v: E(a + '/' + b) });
    }
    var base = r.pick([20, 25, 40, 50, 100, 200]), pct, cmp;
    do { pct = r.int(1, 99); cmp = base * pct / 100; } while (!Number.isInteger(cmp));
    return r.chance(.5) ? mkNum(r, 6, 2, '기준량이 ' + base + ' 이고 비교하는 양이 ' + cmp + ' 일 때, 백분율은 몇 % 일까요?', pct, '비율 {' + cmp + '/' + base + '} 에 100을 곱해요.', { v: E(cmp + '/' + base + '*100') })
      : mkNum(r, 6, 2, base + ' 의 ' + pct + '% 는 얼마일까요?', cmp, base + ' × {' + pct + '/100}', { v: E(base + '*' + pct + '/100') });
  });

  U('g6-prop', 6, '비례식과 비례배분', 2, '비례식, 비례배분', function (r, t) {
    if (t === 1) {
      var a = r.int(1, 9), b = r.int(2, 9), k = r.int(2, 9);
      return mkNum(r, 6, 1, a + ' : ' + b + ' = ' + a * k + ' : □', b * k, '비의 전항과 후항에 같은 수 ' + k + ' 를 곱했어요.', { v: { t: 'prop', a: a, b: b, c: a * k } });
    }
    var x = r.int(1, 7), y = r.int(1, 7), unit = r.int(3, 12), total = (x + y) * unit, big = Math.max(x, y) * unit;
    if (x === y) return KN.mathUnits.filter(function (u) { return u.id === 'g6-prop'; })[0].gen(r, t);
    return mkNum(r, 6, 2, '사탕 ' + total + '개를 ' + x + ' : ' + y + ' 로 나누어 가지려고 해요. 더 많이 가지는 쪽은 몇 개를 가질까요?', big, '전체를 ' + (x + y) + ' 로 나눈 ' + unit + ' 개가 비의 1이에요. ' + Math.max(x, y) + ' × ' + unit + ' = ' + big, { v: { t: 'share', total: total, x: x, y: y, ask: 'big' } });
  });

  U('g6-volume', 6, '부피와 겉넓이', 2, '직육면체, 각기둥', function (r, t) {
    var l = r.int(2, 12), w = r.int(2, 10), h = r.int(2, 9);
    if (t === 1) return r.chance(.6) ? mkNum(r, 6, 1, '가로 ' + l + 'cm, 세로 ' + w + 'cm, 높이 ' + h + 'cm 인 직육면체의 부피는 몇 cm³ 일까요?', l * w * h, '(가로) × (세로) × (높이)', { v: E(l + '*' + w + '*' + h) })
      : mkNum(r, 6, 1, '한 모서리가 ' + l + 'cm 인 정육면체의 부피는 몇 cm³ 일까요?', l * l * l, '(한 모서리)를 세 번 곱해요.', { v: E(l + '*' + l + '*' + l) });
    if (r.chance(.6)) return mkNum(r, 6, 2, '가로 ' + l + 'cm, 세로 ' + w + 'cm, 높이 ' + h + 'cm 인 직육면체의 겉넓이는 몇 cm² 일까요?', 2 * (l * w + l * h + w * h), '합동인 면이 3쌍이에요. 2 × (가로×세로 + 가로×높이 + 세로×높이)', { v: E('2*(' + l + '*' + w + '+' + l + '*' + h + '+' + w + '*' + h + ')') });
    var n = r.int(3, 8), ask = r.pick(['면', '모서리', '꼭짓점']);
    var ans = ask === '면' ? n + 2 : ask === '모서리' ? 3 * n : 2 * n;
    return mkNum(r, 6, 2, n + '각기둥의 ' + ask + '의 수는 모두 몇 개일까요?', ans, ask === '면' ? '옆면 ' + n + '개와 밑면 2개예요.' : ask === '모서리' ? '밑면 모서리 ' + n + '개씩 2개와 옆 모서리 ' + n + '개예요.' : '밑면마다 꼭짓점이 ' + n + '개씩이에요.', { v: { t: 'prism', n: n, ask: ask } });
  });

  U('g6-circle', 6, '원주와 원의 넓이', 2, '원주율 3.14', function (r, t) {
    var rad = r.int(2, 15);
    if (t === 1) {
      return r.chance(.5) ? mkNum(r, 6, 1, '원주율을 3.14 로 할 때, 지름이 ' + rad * 2 + 'cm 인 원의 원주는 몇 cm 일까요?', M.dec(rad * 2 * 314, 2), '(원주) = (지름) × (원주율)', { num: { digits: 2, step: .01 }, v: E(rad * 2 + '*3.14') })
        : mkNum(r, 6, 1, '원주가 ' + M.dec(rad * 2 * 314, 2) + 'cm 인 원의 지름은 몇 cm 일까요? (원주율 3.14)', rad * 2, '(지름) = (원주) ÷ (원주율)', { v: E(rad * 2 * 314 + '/100/3.14') });
    }
    return mkNum(r, 6, 2, '원주율을 3.14 로 할 때, 반지름이 ' + rad + 'cm 인 원의 넓이는 몇 cm² 일까요?', M.dec(rad * rad * 314, 2), '(원의 넓이) = (반지름) × (반지름) × (원주율)', { num: { digits: 2, step: .01 }, v: E(rad + '*' + rad + '*3.14') });
  });

  var SOLIDS = [
    ['원기둥의 밑면은 몇 개일까요?', '2개', ['1개', '3개', '0개'], '원기둥은 위와 아래에 똑같은 원 모양의 밑면이 2개 있어요.'],
    ['원기둥의 밑면의 모양은 무엇일까요?', '원', ['삼각형', '사각형', '오각형'], '원기둥의 밑면은 둥근 원 모양이에요.'],
    ['원뿔의 밑면은 몇 개일까요?', '1개', ['2개', '0개', '3개'], '원뿔은 아래쪽에 원 모양의 밑면이 1개 있고 위쪽은 뾰족해요.'],
    ['원뿔의 뾰족한 점을 무엇이라고 부를까요?', '꼭짓점', ['모선', '밑면', '높이'], '원뿔의 맨 위 뾰족한 점을 꼭짓점이라고 해요.'],
    ['구는 어느 방향에서 보아도 어떤 모양일까요?', '원', ['삼각형', '사각형', '타원'], '공처럼 둥근 구는 어느 쪽에서 보아도 원 모양이에요.'],
    ['원기둥을 위에서 바로 내려다보면 어떤 모양일까요?', '원', ['직사각형', '삼각형', '사각형'], '위에서 보면 밑면이 보여서 원 모양이에요.'],
    ['원기둥을 옆에서 바로 보면 어떤 모양일까요?', '직사각형', ['원', '삼각형', '마름모'], '옆에서 보면 옆면이 펴진 직사각형 모양이에요.'],
    ['구의 한가운데에 있는 점을 무엇이라고 할까요?', '구의 중심', ['꼭짓점', '모선', '밑면'], '구의 겉 어느 곳까지의 거리가 모두 같은 한가운데 점을 구의 중심이라고 해요.']
  ];
  U('g6-solid', 6, '원기둥·원뿔·구', 2, '입체도형의 구성 요소', function (r, t) {
    var it = r.pick(SOLIDS);
    return mk(r, it[0], it[1], it[3], { wrong: it[2], v: { t: 'txt', ans: it[1] } });
  });
})(typeof window !== 'undefined' ? window : globalThis);
