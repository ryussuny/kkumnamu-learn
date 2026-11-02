/* 두뇌 게임 화면: 카드 짝 맞추기, 순서 기억, 빠른 찾기(격자), 스도쿠.
   각 함수: (host, q, ctx, done) → done({score: 0~1, given, title, text}) */
(function (g) {
  var KN = g.KN = g.KN || {};
  var Q = KN.qui = KN.qui || {};
  function safeColor(c) { return /^#[0-9a-fA-F]{3,8}$/.test(String(c)) ? c : '#333333'; }   /* 가져온 파일이 이상한 값을 담아도 막는다 */
  function alive(host) { return host.isConnected !== false && document.body.contains(host); }

  /* ---------- 카드 짝 맞추기 ---------- */
  Q.cards = function (host, q, ctx, done) {
    var faces = q.faces, open = [], matched = {}, attempts = 0, lock = false, pairsDone = 0, finished = false;
    host.innerHTML = '<div class="hint">시도 <b id="att">0</b>번 · 맞힌 쌍 <b id="mt">0</b> / ' + q.pairs + '</div><div class="cards" style="grid-template-columns:repeat(' + q.cols + ',1fr)">' +
      faces.map(function (f, i) { return '<button class="mcard" data-i="' + i + '" aria-label="카드 ' + (i + 1) + '"><span style="color:' + safeColor(f.color) + '">' + KN.esc(f.ch) + '</span></button>'; }).join('') + '</div>';
    var btn = function (i) { return host.querySelector('.mcard[data-i="' + i + '"]'); };
    host.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.mcard'); if (!b || lock || finished) return;
      var i = +b.getAttribute('data-i'); if (matched[i] || open.indexOf(i) >= 0) return;
      b.classList.add('open'); open.push(i);
      if (open.length < 2) return;
      attempts++; host.querySelector('#att').textContent = attempts;
      var a = open[0], c = open[1];
      if (faces[a].ch === faces[c].ch && faces[a].color === faces[c].color) {
        matched[a] = matched[c] = 1; btn(a).classList.remove('open'); btn(c).classList.remove('open'); btn(a).classList.add('done'); btn(c).classList.add('done');
        open = []; pairsDone++; host.querySelector('#mt').textContent = pairsDone;
        if (pairsDone === q.pairs) {
          finished = true;
          var score = Math.max(0, Math.min(1, 1 - (attempts - q.pairs) / (2 * q.pairs)));
          done({ score: score, given: attempts, title: score >= 0.85 ? '잘 기억했어요!' : '끝까지 모두 맞혔어요.', text: attempts + '번 만에 ' + q.pairs + '쌍을 모두 찾았어요. 카드의 자리를 떠올리면 시도를 줄일 수 있어요.' });
        }
      } else {
        lock = true;
        setTimeout(function () { if (!alive(host)) return; btn(a).classList.remove('open'); btn(c).classList.remove('open'); open = []; lock = false; }, 650);
      }
    });
  };

  /* ---------- 순서 기억 ---------- */
  Q.seq = function (host, q, ctx, done) {
    var pos = 0, input = false, finished = false;
    host.innerHTML = '<div class="hint" id="st">잘 보세요…</div><div class="pads">' + q.colors.map(function (c, i) { return '<button class="spad" data-p="' + i + '" style="background:' + safeColor(c) + '" aria-label="버튼 ' + (i + 1) + '" disabled></button>'; }).join('') + '</div>';
    var pads = host.querySelectorAll('.spad'), st = host.querySelector('#st');
    function light(i, on) { if (pads[i]) pads[i].classList.toggle('lit', on); }
    function play(k) {
      if (!alive(host)) return;
      if (k >= q.seq.length) { input = true; host.setAttribute('data-ready', '1'); st.textContent = '이제 똑같이 눌러 보세요.'; for (var j = 0; j < pads.length; j++) pads[j].disabled = false; return; }
      light(q.seq[k], true);
      setTimeout(function () { light(q.seq[k], false); setTimeout(function () { play(k + 1); }, 230); }, 520);
    }
    setTimeout(function () { play(0); }, 700);
    host.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.spad'); if (!b || !input || finished) return;
      var p = +b.getAttribute('data-p'); light(p, true); setTimeout(function () { light(p, false); }, 160);
      if (p !== q.seq[pos]) {
        finished = true; input = false; for (var j = 0; j < pads.length; j++) pads[j].disabled = true;
        done({ score: 0, given: 'x', title: '아쉬워요, 순서가 달랐어요.', text: (pos + 1) + '번째에서 달라졌어요. 다음에는 소리 내어 순서를 세어 보세요. (' + q.seq.map(function (x) { return x + 1; }).join(' → ') + ')' });
        return;
      }
      pos++; st.textContent = pos + ' / ' + q.seq.length;
      if (pos === q.seq.length) { finished = true; input = false; done({ score: 1, given: 'ok', title: '순서를 모두 기억했어요!', text: q.seq.length + '개를 정확히 따라 했어요.' }); }
    });
  };

  /* ---------- 빠른 찾기 ---------- */
  Q.grid = function (host, q, ctx, done) {
    var finished = false, ans = +q.answer;
    host.innerHTML = '<div class="timer"><span id="tb"></span></div><div class="gridf" style="grid-template-columns:repeat(' + q.cols + ',1fr)">' +
      q.cells.map(function (c, i) { return '<button class="fcell" data-i="' + i + '" style="font-size:' + (q.cols >= 5 ? 22 : 30) + 'px">' + KN.esc(c) + '</button>'; }).join('') + '</div>';
    var tb = host.querySelector('#tb');
    tb.style.transition = 'transform ' + q.time + 's linear';
    requestAnimationFrame(function () { requestAnimationFrame(function () { tb.style.transform = 'scaleX(0)'; }); });
    var timer = setTimeout(function () { finish(-1); }, q.time * 1000);
    function finish(i) {
      if (finished) return; finished = true; clearTimeout(timer);
      var bs = host.querySelectorAll('.fcell'); for (var j = 0; j < bs.length; j++) bs[j].disabled = true;
      bs[ans].classList.add('right'); if (i >= 0 && i !== ans) bs[i].classList.add('wrong');
      tb.style.transition = 'none';
      var ok = i === ans;
      done({ score: ok ? 1 : 0, given: i, title: ok ? '찾았어요!' : (i < 0 ? '시간이 다 됐어요.' : '아쉬워요, 다른 칸이었어요.'), text: ok ? '' : '표시된 칸이 다른 하나예요. 천천히 한 줄씩 훑어보면 찾기 쉬워요.' });
    }
    host.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.fcell'); if (b && !finished) finish(+b.getAttribute('data-i')); });
  };

  /* ---------- 스도쿠 ---------- */
  Q.sudoku = function (host, q, ctx, done) {
    var n = q.size, cells = q.puzzle.slice(), fixed = q.puzzle.map(function (v) { return v !== 0; }), sel = -1, errors = 0, hints = 0, bad = {}, finished = false;
    function draw() {
      var h = '<div class="hint">실수 <b>' + errors + '</b>번 · 힌트 <b>' + hints + '</b>번</div><div class="sudo" style="grid-template-columns:repeat(' + n + ',1fr)">';
      for (var p = 0; p < n * n; p++) {
        var r0 = Math.floor(p / n), c0 = p % n, cls = 'scell' + (fixed[p] ? ' fixed' : '') + (p === sel ? ' sel' : '') + (bad[p] ? ' bad' : '') + ((c0 + 1) % q.bc === 0 && c0 < n - 1 ? ' bR' : '') + ((r0 + 1) % q.br === 0 && r0 < n - 1 ? ' bB' : '');
        h += '<button class="' + cls + '" data-p="' + p + '" style="font-size:' + (n === 9 ? 20 : 26) + 'px;' + (bad[p] ? 'color:#c0392b;' : '') + '">' + (cells[p] || bad[p] || '') + '</button>';
      }
      h += '</div><div class="snum">';
      for (var d = 1; d <= n; d++) h += '<button data-n="' + d + '">' + d + '</button>';
      h += '<button data-n="0" class="clr">지우기</button><button data-n="h" class="clr">힌트</button></div>';
      host.innerHTML = h;
    }
    function complete() { for (var p = 0; p < n * n; p++) if (cells[p] !== q.solution[p]) return false; return true; }
    function finish() {
      finished = true; var score = Math.max(0, 1 - 0.1 * errors - 0.1 * hints);
      done({ score: score, given: errors, title: score >= 0.85 ? '스도쿠를 완성했어요!' : '끝까지 완성했어요.', text: '실수 ' + errors + '번, 힌트 ' + hints + '번. 한 칸씩 후보를 지워 가며 풀면 실수가 줄어요.' });
    }
    draw();
    host.addEventListener('click', function (e) {
      if (finished) return;
      var c = e.target.closest && e.target.closest('.scell'), b = e.target.closest && e.target.closest('.snum button');
      if (c) { var p = +c.getAttribute('data-p'); if (!fixed[p]) { sel = p; draw(); } return; }
      if (!b) return;
      var d = b.getAttribute('data-n');
      if (d === 'h') {
        var empties = []; for (var p2 = 0; p2 < n * n; p2++) if (!fixed[p2] && cells[p2] !== q.solution[p2]) empties.push(p2);
        if (!empties.length) return;
        var pick = sel >= 0 && empties.indexOf(sel) >= 0 ? sel : empties[0];
        cells[pick] = q.solution[pick]; fixed[pick] = true; delete bad[pick]; hints++; sel = -1; draw(); if (complete()) finish(); return;
      }
      if (sel < 0) return;
      if (d === '0') { cells[sel] = 0; delete bad[sel]; draw(); return; }
      var v = +d;
      if (q.solution[sel] === v) { cells[sel] = v; delete bad[sel]; sel = -1; draw(); if (complete()) finish(); }
      else { errors++; cells[sel] = 0; bad[sel] = v; draw(); }
    });
  };

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
