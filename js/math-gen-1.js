/* 수학 생성기 ① — 초1~초3.  정답은 모두 계산으로 구한다(손으로 쓴 정답표 없음).
   v = 검사 스크립트(scripts/check-math.js)가 다른 방식으로 다시 확인할 때 쓰는 정보. */
(function (g) {
  var KN = g.KN, M = KN.m, mk = KN.mk, mkNum = KN.mkNum;
  KN.mathUnits = KN.mathUnits || [];
  function U(id, grade, name, tiers, desc, gen) { KN.mathUnits.push({ id: id, subj: 'math', grade: grade, name: name, tiers: tiers, desc: desc, gen: gen }); }
  var DOT = '●';
  function dots(n) { var s = ''; for (var i = 0; i < n; i++) s += DOT + (i % 5 === 4 && i < n - 1 ? ' ' : ''); return s; }
  function timeStr(h, m) { return m === 0 ? h + '시' : h + '시 ' + m + '분'; }
  var E = function (e) { return { t: 'e', e: String(e) }; };

  /* ================= 초1 ================= */
  U('g1-count', 1, '수 세기와 크기', 2, '9까지의 수, 100까지의 수', function (r, t) {
    if (t === 1) {
      var k = r.int(1, 4);
      if (k === 1) { var n = r.int(2, 9); return mk(r, dots(n) + ' 은 모두 몇 개일까요?', n, '하나씩 짚으며 세면 ' + n + '개예요.', { v: E(n) }); }
      if (k === 2) { var a = r.int(1, 8); return mk(r, a + '보다 1 큰 수는 무엇일까요?', a + 1, a + ' 다음 수는 ' + (a + 1) + '이에요.', { v: E(a + '+1') }); }
      if (k === 3) { var b = r.int(2, 9); return mk(r, b + '보다 1 작은 수는 무엇일까요?', b - 1, b + ' 바로 앞의 수는 ' + (b - 1) + '이에요.', { v: E(b + '-1') }); }
      var x = r.int(1, 9), y; do { y = r.int(1, 9); } while (y === x);
      return mk(r, KN.j(x, '과와') + ' ' + y + ' 중에서 더 큰 수는 무엇일까요?', Math.max(x, y), KN.j(Math.max(x, y), '이가') + ' 더 커요.', { choices: [x, y], v: E('Math.max(' + x + ',' + y + ')') });
    }
    var m = r.int(1, 3);
    if (m === 1) { var te = r.int(1, 9), on = r.int(0, 9); return mk(r, '10개씩 묶음 ' + te + '개와 낱개 ' + on + '개는 모두 얼마일까요?', te * 10 + on, te + '0 과 ' + on + '을 합하면 ' + (te * 10 + on) + '이에요.', { v: E(te + '*10+' + on) }); }
    if (m === 2) { var a2 = r.int(10, 98); return mk(r, a2 + ' 바로 다음 수는 무엇일까요?', a2 + 1, '하나 더 큰 수예요.', { v: E(a2 + '+1') }); }
    var p = r.int(11, 99), q; do { q = r.int(11, 99); } while (q === p);
    return mk(r, KN.j(p, '과와') + ' ' + q + ' 중에서 더 작은 수는 무엇일까요?', Math.min(p, q), '십의 자리부터 비교해 보세요.', { choices: [p, q], v: E('Math.min(' + p + ',' + q + ')') });
  });

  U('g1-split', 1, '가르기와 모으기', 2, '수를 둘로 가르고 모으기', function (r, t) {
    var n = t === 1 ? r.int(3, 7) : r.int(8, 10), a = r.int(1, n - 1);
    if (r.chance(.5)) return mk(r, '가르기:  ' + n + ' = ' + a + ' + □  (□ 안에 알맞은 수는?)', n - a, KN.j(a, '과와') + ' ' + (n - a) + ' 을 모으면 ' + n + ' 이에요.', { v: E(n + '-' + a) });
    return mk(r, '모으기:  ' + KN.j(a, '과와') + ' ' + (n - a) + ' 를 모으면 얼마일까요?', n, a + ' + ' + (n - a) + ' = ' + n, { v: E(a + '+' + (n - a)) });
  });

  U('g1-add', 1, '덧셈', 2, '합이 10 이하, 20 이하', function (r, t) {
    var a, b;
    if (t === 1) { a = r.int(1, 8); b = r.int(1, 10 - a); } else { a = r.int(2, 9); b = r.int(Math.max(2, 11 - a), 9); }
    return mk(r, a + ' + ' + b + ' = □', a + b, a + ' + ' + b + ' = ' + (a + b) + (t === 2 ? ' (10을 먼저 만들면 쉬워요)' : ''), { v: E(a + '+' + b) });
  });

  U('g1-sub', 1, '뺄셈', 2, '10 이하, 20 이하', function (r, t) {
    var a, b;
    if (t === 1) { a = r.int(2, 10); b = r.int(1, a - 1); } else { a = r.int(11, 18); b = r.int(a - 9, 9); }
    return mk(r, a + ' − ' + b + ' = □', a - b, a + ' − ' + b + ' = ' + (a - b), { v: E(a + '-' + b) });
  });

  U('g1-make10', 1, '10 만들기와 세 수의 계산', 2, '10이 되는 짝, 세 수 계산', function (r, t) {
    if (t === 1) {
      var a = r.int(1, 9);
      return r.chance(.5) ? mk(r, a + ' + □ = 10', 10 - a, a + '에 ' + (10 - a) + '을 더하면 10이에요.', { v: E('10-' + a) })
        : mk(r, '10 − □ = ' + a, 10 - a, '10에서 ' + (10 - a) + '을 빼면 ' + a + '이에요.', { v: E('10-' + a) });
    }
    var x, y, z;
    do { x = r.int(2, 12); y = r.int(1, 9); z = r.int(1, 9); } while (x + y > 20 || x + y - z < 0);
    return mk(r, x + ' + ' + y + ' − ' + z + ' = □', x + y - z, '앞에서부터 차례로 계산해요: ' + (x + y) + ' − ' + z + ' = ' + (x + y - z), { v: E(x + '+' + y + '-' + z) });
  });

  U('g1-clock', 1, '시계 보기', 2, '몇 시, 몇 시 30분', function (r, t) {
    var h = r.int(1, 12), m = t === 1 ? 0 : 30;
    var ans = timeStr(h, m), w = [];
    var hs = [h % 12 + 1, (h + 10) % 12 + 1, (h + 5) % 12 + 1];
    hs.forEach(function (x) { w.push(timeStr(x, m)); });
    if (t === 2) w.push(timeStr(h, 0));
    return mk(r, '시계가 가리키는 시각은 몇 시일까요?', ans, t === 1 ? '짧은바늘이 ' + h + '을 가리키고 긴바늘이 12에 있으면 ' + h + '시예요.' : '긴바늘이 6에 있으면 30분이에요.', { visual: { clock: [h, m] }, wrong: w, v: { t: 'clock', h: h, m: m } });
  });

  U('g1-pattern', 1, '규칙 찾기', 2, '수가 늘어나는 규칙', function (r, t) {
    var st = t === 1 ? r.pick([1, 2]) : r.pick([3, 5, 10, -1, -2]);
    var len = 5, start = st < 0 ? r.int(12, 30) : r.int(1, 12), seq = [];
    for (var i = 0; i < len; i++) seq.push(start + i * st);
    var hole = r.int(2, 4), ans = seq[hole];
    var shown = seq.map(function (x, i) { return i === hole ? '□' : x; }).join(', ');
    return mk(r, '규칙을 찾아 □ 안에 알맞은 수를 구해요.  ' + shown, ans, (st > 0 ? st + '씩 커지는' : (-st) + '씩 작아지는') + ' 규칙이에요.', { v: E(start + '+' + hole + '*(' + st + ')') });
  });

  /* ================= 초2 ================= */
  U('g2-place', 2, '세 자리·네 자리 수', 2, '자릿값, 수의 크기', function (r, t) {
    var digits = t === 1 ? 3 : 4, k = r.int(1, 3);
    var n = r.int(Math.pow(10, digits - 1), Math.pow(10, digits) - 1);
    if (k === 1) {
      var pos, dd, s0;
      do {
        n = r.int(Math.pow(10, digits - 1), Math.pow(10, digits) - 1); s0 = String(n);
        pos = r.int(0, digits - 1); dd = Math.floor(n / Math.pow(10, pos)) % 10;
      } while (dd === 0 || s0.split(String(dd)).length !== 2);   /* 그 숫자가 한 번만 나오게 */
      return mk(r, M.comma(n) + ' 에서 숫자 ' + dd + ' 이 나타내는 값은 얼마일까요?', dd * Math.pow(10, pos), dd + ' 은 ' + ['일', '십', '백', '천'][pos] + '의 자리 숫자라서 ' + dd * Math.pow(10, pos) + '을 나타내요.', { v: E(dd + '*Math.pow(10,' + pos + ')') });
    }
    if (k === 2) {
      var val = 0, expr = [], names = ['천', '백', '십', '일'], offs = digits === 3 ? 1 : 0, txt = [];
      for (var i = offs; i < 4; i++) { var dv = r.int(1, 9), pw = Math.pow(10, 3 - i); val += dv * pw; expr.push(dv + '*' + pw); txt.push(names[i] + '의 자리 숫자가 ' + dv); }
      return mk(r, txt.join(', ') + '인 수는 무엇일까요?', val, '각 자리의 값을 모두 더하면 ' + val + '이에요.', { v: E(expr.join('+')) });
    }
    var a = r.int(Math.pow(10, digits - 1), Math.pow(10, digits) - 1), b; do { b = r.int(Math.pow(10, digits - 1), Math.pow(10, digits) - 1); } while (a === b);
    return mk(r, KN.j(M.comma(a), '과와') + ' ' + M.comma(b) + ' 중에서 더 큰 수는 무엇일까요?', Math.max(a, b), '높은 자리 숫자부터 비교해요.', { choices: [a, b], v: E('Math.max(' + a + ',' + b + ')') });
  });

  U('g2-add', 2, '덧셈 (받아올림)', 2, '두 자리, 세 자리 수의 덧셈', function (r, t) {
    var a, b;
    do {
      if (t === 1) { a = r.int(15, 89); b = r.int(15, 89); } else { a = r.int(120, 760); b = r.int(120, 760); }
    } while (t === 1 ? (a % 10 + b % 10 < 10) : (a % 10 + b % 10 < 10 && Math.floor(a / 10) % 10 + Math.floor(b / 10) % 10 < 10));
    return mk(r, a + ' + ' + b + ' = □', a + b, '일의 자리부터 더해요. 10이 넘으면 윗자리로 1을 올려요.', { v: E(a + '+' + b) });
  });

  U('g2-sub', 2, '뺄셈 (받아내림)', 2, '두 자리, 세 자리 수의 뺄셈', function (r, t) {
    var a, b;
    do {
      if (t === 1) { a = r.int(32, 98); b = r.int(12, a - 5); } else { a = r.int(321, 985); b = r.int(112, a - 20); }
    } while (a % 10 >= b % 10);
    return mk(r, a + ' − ' + b + ' = □', a - b, '일의 자리가 모자라면 윗자리에서 10을 빌려 와요.', { v: E(a + '-' + b) });
  });

  U('g2-group', 2, '곱셈 (묶어 세기)', 2, '몇씩 몇 묶음, 곱셈식', function (r, t) {
    var a = t === 1 ? r.pick([2, 3, 4, 5]) : r.pick([6, 7, 8, 9]), b = r.int(2, t === 1 ? 6 : 9);
    if (r.chance(.5)) return mk(r, a + '개씩 ' + b + '묶음은 모두 몇 개일까요?', a * b, a + ' × ' + b + ' = ' + a * b, { v: E(a + '*' + b) });
    var sum = []; for (var i = 0; i < b; i++) sum.push(a);
    return mk(r, sum.join(' + ') + ' 를 곱셈식으로 나타내면 ' + a + ' × □ 입니다. □ 안의 수는?', b, a + ' 를 ' + b + '번 더한 것이라서 ' + a + ' × ' + b + ' 이에요.', { v: E(b) });
  });

  U('g2-table', 2, '곱셈구구', 2, '2단~9단, 빈칸 찾기', function (r, t) {
    var a = r.int(2, 9), b = r.int(2, 9);
    if (t === 1) return mk(r, a + ' × ' + b + ' = □', a * b, a + ' × ' + b + ' = ' + a * b, { v: E(a + '*' + b) });
    return r.chance(.5)
      ? mk(r, a + ' × □ = ' + a * b, b, a * b + ' 는 ' + a + '의 ' + b + '배예요.', { v: E(a * b + '/' + a) })
      : mk(r, '□ × ' + b + ' = ' + a * b, a, a * b + ' 는 ' + b + '의 ' + a + '배예요.', { v: E(a * b + '/' + b) });
  });

  U('g2-measure', 2, '길이와 시간', 2, 'cm와 m, 시와 분', function (r, t) {
    var k = r.int(1, t === 1 ? 3 : 4);
    if (k === 1) { var m = r.int(1, 5), c = r.int(1, 9) * 10; return mk(r, m + 'm ' + c + 'cm 는 몇 cm 일까요?', m * 100 + c, '1m = 100cm 이므로 ' + m * 100 + 'cm 에 ' + c + 'cm 를 더해요.', { v: E(m + '*100+' + c) }); }
    if (k === 2) { var h = r.int(1, 3), mi = r.int(1, 5) * 10; return mk(r, h + '시간 ' + mi + '분 은 몇 분 일까요?', h * 60 + mi, '1시간 = 60분 이에요.', { v: E(h + '*60+' + mi) }); }
    if (k === 3) { var hh = r.int(1, 12), mm = r.int(1, 11) * 5; var ans = timeStr(hh, mm), w = [timeStr(hh, (mm + 5) % 60), timeStr(hh % 12 + 1, mm), timeStr(hh, (mm + 55) % 60)];
      return mk(r, '시계가 가리키는 시각을 읽어 보세요.', ans, '긴바늘이 가리키는 숫자에 5를 곱하면 분이에요.', { visual: { clock: [hh, mm] }, wrong: w, v: { t: 'clock', h: hh, m: mm } }); }
    var sh = r.int(1, 8), sm = r.int(1, 5) * 10, add = r.int(1, 3) * 10 + 10;
    var tot = sh * 60 + sm + add, eh = Math.floor(tot / 60), em = tot % 60;
    return mk(r, sh + '시 ' + sm + '분 에서 ' + add + '분 후는 몇 시 몇 분일까요?', timeStr(eh, em), '분끼리 더한 값이 60이 넘으면 1시간으로 바꿔요.', { wrong: [timeStr(eh, (em + 10) % 60), timeStr(eh + 1, em), timeStr(eh, (em + 50) % 60)], v: { t: 'timeadd', sh: sh, sm: sm, add: add, ans: timeStr(eh, em) } });
  });

  var FRUIT = ['사과', '배', '귤', '포도', '수박', '바나나'];
  function tableQ(r, t, grade) {
    var names = r.shuffle(FRUIT).slice(0, 4), counts = [], seen = {};
    names.forEach(function () { var c; do { c = r.int(2, 12); } while (seen[c]); seen[c] = 1; counts.push(c); });
    var tab = names.map(function (n, i) { return n + ' ' + counts[i] + '명'; }).join(', ');
    var mx = counts.indexOf(Math.max.apply(null, counts)), mn = counts.indexOf(Math.min.apply(null, counts));
    var head = '친구들이 좋아하는 과일을 조사했어요.  ' + tab + '.  ';
    var k = r.int(1, grade <= 2 ? 2 : 3);
    if (k === 1) return mk(r, head + '가장 많은 친구가 좋아하는 과일은 무엇일까요?', names[mx], '숫자가 가장 큰 것을 찾아요.', { wrong: names.filter(function (_, i) { return i !== mx; }), v: { t: 'argmax', names: names, counts: counts } });
    if (k === 2) return mk(r, head + '가장 적은 친구가 좋아하는 과일은 무엇일까요?', names[mn], '숫자가 가장 작은 것을 찾아요.', { wrong: names.filter(function (_, i) { return i !== mn; }), v: { t: 'argmin', names: names, counts: counts } });
    var d = counts[mx] - counts[mn];
    return mkNum(r, grade, t, head + '가장 많은 것과 가장 적은 것은 몇 명 차이일까요?', d, counts[mx] + ' − ' + counts[mn] + ' = ' + d, { v: E(Math.max.apply(null, counts) + '-' + Math.min.apply(null, counts)) });
  }
  U('g2-chart', 2, '표 읽기', 2, '표를 보고 많고 적음 찾기', function (r, t) { return tableQ(r, t, 2); });

  /* ================= 초3 ================= */
  U('g3-addsub', 3, '세 자리 덧셈과 뺄셈', 2, '받아올림·받아내림이 있는 계산', function (r, t) {
    if (t === 1) { var a = r.int(250, 780), b = r.int(120, 990 - a); return mkNum(r, 3, t, a + ' + ' + b + ' = □', a + b, '자리를 맞춰 일의 자리부터 더해요.', { v: E(a + '+' + b) }); }
    var x = r.int(402, 987), y = r.int(115, x - 40);
    return mkNum(r, 3, t, x + ' − ' + y + ' = □', x - y, '자리를 맞춰 빼요. 모자라면 윗자리에서 빌려 와요.', { v: E(x + '-' + y) });
  });

  U('g3-mul', 3, '곱셈', 2, '두 자리 수 × 한 자리 수, 두 자리 수 × 두 자리 수', function (r, t) {
    var a, b;
    if (t === 1) { a = r.int(12, 99); b = r.int(2, 9); } else { a = r.int(12, 59); b = r.int(11, 29); }
    return mkNum(r, 3, t, a + ' × ' + b + ' = □', a * b, t === 1 ? '일의 자리와 십의 자리를 나누어 곱해서 더해요.' : a + ' × ' + (b % 10) + ' 와 ' + a + ' × ' + (b - b % 10) + ' 을 더해요.', { v: E(a + '*' + b) });
  });

  U('g3-div', 3, '나눗셈', 2, '똑같이 나누기, 몫과 나머지', function (r, t) {
    if (t === 1) {
      var b = r.int(2, 9), q = r.int(2, 9), a = b * q;
      return r.chance(.5) ? mkNum(r, 3, t, a + ' ÷ ' + b + ' = □', q, b + ' × ' + q + ' = ' + a + ' 이라서 몫은 ' + q + ' 이에요.', { v: E(a + '/' + b) })
        : mkNum(r, 3, t, '사탕 ' + a + '개를 ' + b + '명에게 똑같이 나누어 주면 한 명이 몇 개씩 받을까요?', q, a + ' ÷ ' + b + ' = ' + q, { v: E(a + '/' + b) });
    }
    var d = r.int(3, 9), qq = r.int(3, 12), rem = r.int(1, d - 1), n = d * qq + rem;
    return r.chance(.5) ? mkNum(r, 3, t, n + ' ÷ ' + d + ' 의 몫은 얼마일까요?', qq, d + ' × ' + qq + ' = ' + d * qq + ', ' + n + ' − ' + d * qq + ' = ' + rem, { v: E('Math.floor(' + n + '/' + d + ')') })
      : mkNum(r, 3, t, n + ' ÷ ' + d + ' 의 나머지는 얼마일까요?', rem, '나머지는 나누는 수 ' + d + '보다 항상 작아요.', { v: E(n + '%' + d) });
  });

  U('g3-frac', 3, '분수', 2, '전체와 부분, 분수의 크기', function (r, t) {
    if (t === 1) {
      var n = r.int(3, 10), k = r.int(1, n - 1);
      return mk(r, '똑같이 ' + n + '칸으로 나눈 것 중에서 ' + k + '칸을 색칠했어요. 색칠한 부분은 전체의 얼마일까요?', '{' + k + '/' + n + '}', '전체 ' + n + '칸 중 ' + k + '칸이니까 ' + n + '분의 ' + k + ' 이에요.',
        { visual: { bar: [k, n] }, wrong: ['{' + n + '/' + k + '}', '{' + (k + 1) + '/' + n + '}', '{' + k + '/' + (n + 1) + '}'], v: { t: 'fracpart', k: k, n: n } });
    }
    var d = r.int(5, 12);
    if (r.chance(.5)) {
      var a = r.int(1, d - 1), b; do { b = r.int(1, d - 1); } while (a === b);
      return mk(r, '{' + a + '/' + d + '} 과 {' + b + '/' + d + '} 중에서 더 큰 분수는 무엇일까요?', '{' + Math.max(a, b) + '/' + d + '}', '분모가 같으면 분자가 큰 쪽이 커요.', { choices: ['{' + a + '/' + d + '}', '{' + b + '/' + d + '}'], v: E('Math.max(' + a + ',' + b + ')/' + d) });
    }
    var d1 = r.int(2, 9), d2; do { d2 = r.int(2, 9); } while (d1 === d2);
    return mk(r, '{1/' + d1 + '} 과 {1/' + d2 + '} 중에서 더 큰 분수는 무엇일까요?', '{1/' + Math.min(d1, d2) + '}', '단위분수는 분모가 작을수록 커요. (똑같이 나눈 조각 수가 적으면 한 조각이 커요)', { choices: ['{1/' + d1 + '}', '{1/' + d2 + '}'], v: E('1/' + Math.min(d1, d2)) });
  });

  U('g3-dec', 3, '소수', 2, '0.1의 개념, 소수의 크기와 덧뺄셈', function (r, t) {
    if (t === 1) {
      var k = r.int(1, 3);
      if (k === 1) { var n = r.int(1, 9); return mk(r, '{' + n + '/10} 을 소수로 나타내면 얼마일까요?', M.dec(n, 1), '10분의 ' + n + ' 은 0.' + n + ' 이에요.', { wrong: ['0.0' + n, n + '.0', M.dec(n * 10 + 1, 2)], v: E(n + '/10') }); }
      if (k === 2) { var m = r.int(11, 59); return mkNum(r, 3, 1, M.dec(m, 1) + ' 은 0.1이 몇 개일까요?', m, '0.1이 10개면 1이에요.', { v: E(m) }); }
      var a = r.int(1, 99), b; do { b = r.int(1, 99); } while (a === b);
      return mk(r, KN.j(M.dec(a, 1), '과와') + ' ' + M.dec(b, 1) + ' 중에서 더 큰 수는 무엇일까요?', M.dec(Math.max(a, b), 1), '자연수 부분부터, 같으면 소수 첫째 자리를 비교해요.', { choices: [M.dec(a, 1), M.dec(b, 1)], v: E('Math.max(' + a + ',' + b + ')/10') });
    }
    var k2 = r.int(1, 3);
    if (k2 === 1) {
      var x = r.int(2, 80), y; do { y = r.int(2, 80); } while (y === x);
      var big = r.chance(.5), ans2 = big ? Math.max(x, y) : Math.min(x, y);
      return mk(r, M.dec(x, 1) + ' 과 ' + M.dec(y, 1) + ' 중에서 더 ' + (big ? '큰' : '작은') + ' 수는 무엇일까요?', M.dec(ans2, 1), '자연수 부분부터, 같으면 소수 첫째 자리를 비교해요.', { choices: [M.dec(x, 1), M.dec(y, 1)], v: E((big ? 'Math.max(' : 'Math.min(') + x + ',' + y + ')/10') });
    }
    if (k2 === 2) {
      var n2 = r.int(11, 59); while (n2 % 10 === 0) n2 = r.int(11, 59);
      var w2 = Math.floor(n2 / 10), rem = n2 % 10, ansF = w2 ? '{' + w2 + ' ' + rem + '/10}' : '{' + rem + '/10}';
      return mk(r, M.dec(n2, 1) + ' 을 분수로 나타내면 무엇일까요?', ansF, '소수 첫째 자리는 10분의 몇이에요: ' + M.dec(n2, 1) + ' = ' + ansF, { wrong: [w2 ? '{' + w2 + ' ' + rem + '/100}' : '{' + rem + '/100}', '{' + n2 + '/100}', w2 ? '{' + w2 + ' ' + (rem + 1) + '/10}' : '{' + (rem + 1) + '/10}'], v: { t: 'dec2frac', n: n2, w: w2, rem: rem } });
    }
    var n3 = r.int(1, 98);
    return mk(r, M.dec(n3, 1) + ' 보다 0.1 큰 수는 무엇일까요?', M.dec(n3 + 1, 1), '0.1이 하나 더 많은 수예요.', { num: { digits: 1, step: .1 }, v: E('(' + n3 + '+1)/10') });
  });

  U('g3-unit', 3, '길이·들이·무게 단위', 2, 'km와 m, L와 mL, kg과 g', function (r, t) {
    var types = [['km', 'm', 1000], ['L', 'mL', 1000], ['kg', 'g', 1000]];
    var T = r.pick(types), a = r.int(1, 9), b = r.int(1, 9) * 100;
    if (t === 1) {
      return mkNum(r, 3, 1, a + T[0] + ' ' + b + T[1] + ' 는 몇 ' + T[1] + ' 일까요?', a * 1000 + b, '1' + T[0] + ' = 1000' + T[1] + ' 이에요.', { v: E(a + '*1000+' + b) });
    }
    var tot = a * 1000 + b;
    var ans = a + T[0] + ' ' + b + T[1];
    return mk(r, tot + T[1] + ' 는 몇 ' + T[0] + ' 몇 ' + T[1] + ' 일까요?', ans, '1000' + T[1] + ' 마다 1' + T[0] + ' 로 바꿔요.', { wrong: [(a + 1) + T[0] + ' ' + b + T[1], a + T[0] + ' ' + (b + 100) + T[1], a + T[0] + ' ' + (b / 100) + T[1]], v: { t: 'unit', tot: tot, big: T[0], small: T[1], ans: ans } });
  });

  U('g3-circle', 3, '원', 2, '반지름과 지름', function (r, t) {
    if (t === 1) {
      var rad = r.int(2, 15);
      return r.chance(.5) ? mkNum(r, 3, 1, '반지름이 ' + rad + 'cm 인 원의 지름은 몇 cm 일까요?', rad * 2, '지름은 반지름의 2배예요.', { v: E(rad + '*2') })
        : mkNum(r, 3, 1, '지름이 ' + rad * 2 + 'cm 인 원의 반지름은 몇 cm 일까요?', rad, '반지름은 지름의 반이에요.', { v: E(rad * 2 + '/2') });
    }
    var rd = r.int(2, 9), c = r.int(2, 5);
    return mkNum(r, 3, 2, '반지름이 ' + rd + 'cm 인 원 ' + c + '개를 서로 맞닿게 한 줄로 놓았어요. 줄 전체의 길이는 몇 cm 일까요?', rd * 2 * c, '원 하나의 지름 ' + rd * 2 + 'cm 가 ' + c + '개예요.', { v: E(rd + '*2*' + c) });
  });
})(typeof window !== 'undefined' ? window : globalThis);
