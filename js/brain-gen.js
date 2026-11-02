/* 두뇌 게임 생성기: 패턴·수열 / 카드 짝 맞추기 / 순서 기억 / 스도쿠 / 빠른 찾기.
   문구 원칙: 연습하면 '그 게임'이 쉬워질 수 있다까지만 말한다(집중력·지능이 오른다는 식의 단정 금지). */
(function (g) {
  var KN = g.KN = g.KN || {};
  KN.brainUnits = KN.brainUnits || [];
  var mk = KN.mk, mkNum = KN.mkNum;
  function U(id, grade, gradeTo, name, tiers, desc, gen, count) {
    KN.brainUnits.push({ id: id, subj: 'brain', grade: grade, gradeTo: gradeTo, name: name, tiers: tiers, desc: desc, gen: gen, count: count });
  }
  var SHAPES = ['●', '■', '▲', '◆', '★'];
  var COLORS = ['#e8604c', '#2e83cc', '#2fb67c', '#c98a00', '#6b4fd6', '#d9486a', '#1f9a66', '#e0245e'];

  /* ================= 패턴 · 수열 ================= */
  function figQ(r, t) {
    var forms = t === 1 ? [[0, 1], [0, 0, 1], [0, 1, 2]] : [[0, 1, 1], [0, 0, 1, 1], [0, 1, 2, 2], [0, 1, 0, 2]];
    var form = r.pick(forms), sh = r.shuffle(SHAPES).slice(0, 3), cyc = form.map(function (k) { return sh[k]; });
    var len = cyc.length * 2 + (r.chance(.5) ? 1 : 0), seq = [];
    for (var i = 0; i < len; i++) seq.push(cyc[i % cyc.length]);
    var ans = cyc[len % cyc.length], shown = seq.join('  ') + '  □';
    var wr = SHAPES.filter(function (x) { return x !== ans; });
    var q = mk(r, '규칙을 찾아 □ 에 알맞은 모양을 골라요.\n' + shown, ans, '모양이 ' + cyc.join('') + ' 순서로 되풀이돼요.', { wrong: r.shuffle(wr).slice(0, 3), v: { t: 'fig', cyc: cyc, len: len, ans: ans } });
    return q;
  }
  U('br-pat1', 1, 2, '규칙 찾기 (모양)', 2, '되풀이되는 모양의 규칙 찾기', figQ);

  /* 수열: 규칙은 항 번호 n 에 대한 식이거나(e) 앞의 항에서 이어지는 규칙(rec)이다 */
  function seqQ(r, grade, t, kinds) {
    var k = r.pick(kinds), terms = [], expr, rule, hint;
    var a, d, ratio, x, y, m, c;
    if (k === 'arith') { a = r.int(1, 30); d = r.int(2, t === 1 ? 9 : 15) * (r.chance(.25) && t === 2 ? -1 : 1); if (d < 0) a += 80; expr = a + '+(' + d + ')*n'; hint = d > 0 ? '앞의 수에 ' + d + ' 씩 더해요.' : '앞의 수에서 ' + (-d) + ' 씩 빼요.'; }
    else if (k === 'geo') { a = r.int(1, 5); ratio = r.pick([2, 3]); expr = a + '*Math.pow(' + ratio + ',n)'; hint = '앞의 수에 ' + ratio + ' 를 곱해요.'; }
    else if (k === 'square') { c = r.int(0, 5); expr = '(n+1)*(n+1)+' + c; hint = '1, 4, 9, 16 … 처럼 같은 수를 두 번 곱한 수' + (c ? '에 ' + c + ' 를 더한 수' : '') + '예요.'; }
    else if (k === 'tri') { expr = '(n+1)*(n+2)/2'; hint = '1, 3, 6, 10 … 더하는 수가 1씩 커져요.'; }
    else if (k === 'incr') { a = r.int(1, 10); d = r.int(1, 3); expr = a + '+n*(n+1)/2*' + d; hint = '더하는 수가 ' + d + ' 씩 커져요.'; }
    else if (k === 'cube') { expr = '(n+1)*(n+1)*(n+1)'; hint = '같은 수를 세 번 곱한 수예요: 1, 8, 27 …'; }
    else if (k === 'pow3') { a = r.int(1, 2); expr = a + '*Math.pow(3,n)'; hint = '앞의 수에 3 을 곱해요.'; }
    else if (k === 'lin2') { m = r.int(2, 3); c = r.int(1, 3); a = r.int(1, 4); rule = { start: a, mul: m, add: c }; hint = '앞의 수에 ' + m + ' 를 곱하고 ' + c + ' 를 더해요.'; }
    else if (k === 'alt') { a = r.int(1, 12); x = r.int(2, 8); y = r.int(1, 5); rule = { start: a, op: [x, y] }; hint = '+' + x + ', +' + y + ' 를 번갈아 해요.'; }
    else { x = r.int(1, 4); y = r.int(2, 6); rule = { fib: [x, y] }; hint = '앞의 두 수를 더하면 다음 수예요.'; }
    var N = 6, f;
    if (expr) { f = Function('n', 'return ' + expr); for (var i = 0; i <= N; i++) terms.push(f(i)); }
    else if (rule && rule.fib) { terms = [rule.fib[0], rule.fib[1]]; while (terms.length <= N) terms.push(terms[terms.length - 1] + terms[terms.length - 2]); }
    else if (rule && rule.mul) { terms = [rule.start]; while (terms.length <= N) terms.push(terms[terms.length - 1] * rule.mul + rule.add); }
    else { terms = [rule.start]; while (terms.length <= N) { terms.push(terms[terms.length - 1] + rule.op[(terms.length - 1) % 2]); } }
    var shownN = t === 1 ? 5 : 5, ans = terms[shownN], hole = shownN;
    var shown = terms.slice(0, shownN).join(', ') + ', □';
    return KN.mkNum(r, grade, t, '규칙을 찾아 □ 에 알맞은 수를 구해요.\n' + shown, ans, hint, { v: { t: 'seq', k: k, expr: expr || null, rule: rule || null, terms: terms.slice(0, shownN), ans: ans } });
  }
  U('br-pat3', 3, 6, '수의 규칙 찾기', 2, '수가 늘어나는 규칙 찾기', function (r, t) { return seqQ(r, 3, t, t === 1 ? ['arith', 'arith', 'geo', 'square'] : ['arith', 'geo', 'square', 'tri', 'incr', 'alt', 'fib']); });
  U('br-pat7', 7, 9, '수열과 규칙 (중등)', 2, '조금 더 복잡한 수의 규칙', function (r, t) { return seqQ(r, 7, 2, t === 1 ? ['incr', 'square', 'cube', 'pow3', 'alt', 'fib'] : ['lin2', 'cube', 'pow3', 'fib', 'incr', 'alt']); });

  /* ================= 카드 짝 맞추기 ================= */
  function cardsQ(r, pairs, cols) {
    var combos = [];
    SHAPES.forEach(function (s) { COLORS.forEach(function (c) { combos.push({ ch: s, color: c }); }); });
    var pick = r.shuffle(combos).slice(0, pairs), faces = [];
    pick.forEach(function (f) { faces.push(f, f); });
    faces = r.shuffle(faces);
    var q = { kind: 'cards', prompt: '같은 모양과 색의 카드 두 장을 찾아 모두 맞혀요. (' + pairs + '쌍)', answer: '', explain: '카드 위치를 기억해 두면 적은 시도로 끝낼 수 있어요.', faces: faces, cols: cols, pairs: pairs, noReview: true, v: { t: 'cards', pairs: pairs } };
    return q;
  }
  U('br-card1', 1, 2, '카드 짝 맞추기 (저학년)', 2, '같은 카드 두 장 찾기', function (r, t) { return cardsQ(r, t === 1 ? 3 : 4, t === 1 ? 3 : 4); }, 3);
  U('br-card3', 3, 6, '카드 짝 맞추기 (고학년)', 2, '기억해서 짝 찾기', function (r, t) { return cardsQ(r, t === 1 ? 6 : 8, 4); }, 3);
  U('br-card7', 7, 9, '카드 짝 맞추기 (중등)', 2, '더 많은 카드의 짝 찾기', function (r, t) { return cardsQ(r, t === 1 ? 10 : 12, 4); }, 3);

  /* ================= 순서 기억 ================= */
  var PADC = ['#ff8fa3', '#7cc4ff', '#ffc95e', '#6fd6a3', '#b79cff', '#ff9f43'];
  function seqMemQ(r, base, t, pads) {
    var len = base + (t === 2 ? 1 : 0) + r.int(0, 1), seq = [];
    for (var i = 0; i < len; i++) { var p; do { p = r.int(0, pads - 1); } while (i > 0 && p === seq[i - 1] && pads > 1 && t === 1); seq.push(p); }
    return { kind: 'seq', prompt: '불이 켜지는 순서를 잘 보고, 똑같이 눌러요. (' + len + '개)', answer: seq.join(','), explain: '', seq: seq, pads: pads, colors: PADC.slice(0, pads), noReview: true, v: { t: 'seqmem', len: len, pads: pads } };
  }
  U('br-seq1', 1, 2, '순서 기억 (저학년)', 2, '불이 켜진 순서 따라 하기', function (r, t) { return seqMemQ(r, 3, t, 4); }, 6);
  U('br-seq3', 3, 6, '순서 기억 (고학년)', 2, '조금 더 긴 순서 따라 하기', function (r, t) { return seqMemQ(r, 4, t, 4); }, 6);
  U('br-seq7', 7, 9, '순서 기억 (중등)', 2, '긴 순서 따라 하기', function (r, t) { return seqMemQ(r, 5, t, 6); }, 6);

  /* ================= 스도쿠 ================= */
  /* size x size 격자, 상자 br x bc. 풀이 수 세기(최대 limit)까지 같은 함수로 처리 */
  KN.sudoku = {
    solveCount: function (grid, size, br, bc, limit) {
      var g2 = grid.slice(), count = 0, full = (1 << size) - 1;
      var rows = [], cols = [], boxes = [];
      for (var i = 0; i < size; i++) { rows.push(0); cols.push(0); boxes.push(0); }
      function boxOf(p) { var r0 = Math.floor(p / size), c0 = p % size; return Math.floor(r0 / br) * (size / bc) + Math.floor(c0 / bc); }
      for (var p = 0; p < size * size; p++) if (g2[p]) { var b = 1 << (g2[p] - 1), r0 = Math.floor(p / size), c0 = p % size, bi = boxOf(p); if ((rows[r0] & b) || (cols[c0] & b) || (boxes[bi] & b)) return 0; rows[r0] |= b; cols[c0] |= b; boxes[bi] |= b; }
      function go() {
        var best = -1, bestMask = 0, bestN = 99;
        for (var q = 0; q < size * size; q++) if (!g2[q]) {
          var m = full & ~(rows[Math.floor(q / size)] | cols[q % size] | boxes[boxOf(q)]), n = 0, mm = m; while (mm) { n++; mm &= mm - 1; }
          if (n < bestN) { bestN = n; best = q; bestMask = m; if (n <= 1) break; }
        }
        if (best < 0) { count++; return; }
        if (bestN === 0) return;
        var r1 = Math.floor(best / size), c1 = best % size, b1 = boxOf(best);
        for (var d = 0; d < size && count < limit; d++) if (bestMask & (1 << d)) {
          var bit = 1 << d; g2[best] = d + 1; rows[r1] |= bit; cols[c1] |= bit; boxes[b1] |= bit;
          go();
          g2[best] = 0; rows[r1] &= ~bit; cols[c1] &= ~bit; boxes[b1] &= ~bit;
        }
      }
      go();
      return count;
    },
    /* 완성된 격자 만들기: 칸마다 후보를 섞어 되짚기 */
    full: function (r, size, br, bc) {
      var grid = new Array(size * size).fill(0);
      function ok(p, v) {
        var r0 = Math.floor(p / size), c0 = p % size;
        for (var i = 0; i < size; i++) { if (grid[r0 * size + i] === v || grid[i * size + c0] === v) return false; }
        var br0 = Math.floor(r0 / br) * br, bc0 = Math.floor(c0 / bc) * bc;
        for (var a = 0; a < br; a++) for (var b = 0; b < bc; b++) if (grid[(br0 + a) * size + bc0 + b] === v) return false;
        return true;
      }
      function fill(p) {
        if (p === size * size) return true;
        var order = r.shuffle(Array.apply(null, { length: size }).map(function (_, i) { return i + 1; }));
        for (var k = 0; k < order.length; k++) { if (ok(p, order[k])) { grid[p] = order[k]; if (fill(p + 1)) return true; grid[p] = 0; } }
        return false;
      }
      fill(0);
      return grid;
    },
    /* 풀이가 하나뿐이도록 칸을 지운다. givens 는 남길 칸 수의 목표 */
    puzzle: function (r, size, br, bc, givens) {
      var sol = KN.sudoku.full(r, size, br, bc), pz = sol.slice(), order = r.shuffle(Array.apply(null, { length: size * size }).map(function (_, i) { return i; })), left = size * size;
      for (var k = 0; k < order.length && left > givens; k++) {
        var p = order[k], keep = pz[p]; pz[p] = 0;
        if (KN.sudoku.solveCount(pz, size, br, bc, 2) !== 1) pz[p] = keep; else left--;
      }
      return { solution: sol, puzzle: pz, givens: left };
    }
  };
  function sudokuQ(r, size, br, bc, givens, label) {
    var s = KN.sudoku.puzzle(r, size, br, bc, givens);
    return { kind: 'sudoku', prompt: label + ' 스도쿠: 가로줄·세로줄·굵은 네모 안에 1부터 ' + size + '까지 숫자가 한 번씩만 들어가게 채워요.', answer: '', explain: '', size: size, br: br, bc: bc, puzzle: s.puzzle, solution: s.solution, noReview: true, v: { t: 'sudoku', size: size, br: br, bc: bc } };
  }
  U('br-sud1', 1, 3, '스도쿠 4×4', 2, '숫자를 겹치지 않게 채우기', function (r, t) { return sudokuQ(r, 4, 2, 2, t === 1 ? 10 : 7, '4×4'); }, 1);
  U('br-sud4', 4, 6, '스도쿠 6×6', 2, '숫자를 겹치지 않게 채우기', function (r, t) { return sudokuQ(r, 6, 2, 3, t === 1 ? 22 : 17, '6×6'); }, 1);
  U('br-sud7', 7, 9, '스도쿠 9×9', 2, '숫자를 겹치지 않게 채우기', function (r, t) { return sudokuQ(r, 9, 3, 3, t === 1 ? 40 : 33, '9×9'); }, 1);

  /* ================= 빠른 찾기 (집중) ================= */
  var LOOK = [['b', 'd'], ['p', 'q'], ['m', 'n'], ['O', 'Q'], ['E', 'F'], ['6', '9'], ['ㅂ', 'ㅁ'], ['ㅏ', 'ㅓ'], ['u', 'n'], ['C', 'G'], ['ㅗ', 'ㅜ'], ['ㄱ', 'ㄴ']];
  function focusQ(r, n, secs, easy) {
    var cells = [], ans = r.int(0, n * n - 1), odd, base, label, kind = r.int(1, 2);
    if (easy || kind === 1) { var sh = r.shuffle(SHAPES).slice(0, 2); base = sh[0]; odd = sh[1]; label = '다른 모양 하나를 찾아 눌러요.'; }
    else { var lk = r.pick(LOOK); if (r.chance(.5)) lk = [lk[1], lk[0]]; base = lk[0]; odd = lk[1]; label = '다른 글자 하나를 찾아 눌러요.'; }
    for (var i = 0; i < n * n; i++) cells.push(i === ans ? odd : base);
    return { kind: 'grid', prompt: label + ' (' + secs + '초 안에)', answer: String(ans), explain: '', cells: cells, cols: n, time: secs, noReview: true, v: { t: 'grid', n: n, ans: ans, odd: odd, base: base } };
  }
  U('br-foc1', 1, 2, '빠른 찾기 (저학년)', 2, '다른 하나 찾기', function (r, t) { return focusQ(r, t === 1 ? 3 : 4, t === 1 ? 12 : 10, true); });
  U('br-foc3', 3, 6, '빠른 찾기 (고학년)', 2, '다른 하나 찾기', function (r, t) { return focusQ(r, t === 1 ? 4 : 5, t === 1 ? 10 : 9, false); });
  U('br-foc7', 7, 9, '빠른 찾기 (중등)', 2, '비슷한 글자 속에서 다른 하나 찾기', function (r, t) { return focusQ(r, t === 1 ? 5 : 6, t === 1 ? 9 : 8, false); });

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
