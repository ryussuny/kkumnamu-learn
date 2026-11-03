/* 그림 활동 데이터 — 색 12개, 붓 3단, 도장, 색칠 밑그림(코드로 그린 선), 영역 채우기(flood fill).
   외부 이미지 파일을 쓰지 않는다. 밑그림은 800×600 칸 위의 도형 목록이다. */
(function (g) {
  var KN = g.KN = g.KN || {};
  var W = 800, H = 600;

  var COLORS = [
    { id: 'red', name: '빨강', c: '#e8364f' }, { id: 'orange', name: '주황', c: '#ff8a30' }, { id: 'yellow', name: '노랑', c: '#ffd23f' },
    { id: 'lime', name: '연두', c: '#9bdc3c' }, { id: 'green', name: '초록', c: '#2fb67c' }, { id: 'sky', name: '하늘', c: '#4ab8ff' },
    { id: 'blue', name: '파랑', c: '#2f6fdd' }, { id: 'purple', name: '보라', c: '#8a56d6' }, { id: 'pink', name: '분홍', c: '#ff7aa2' },
    { id: 'brown', name: '갈색', c: '#8a5a3b' }, { id: 'black', name: '검정', c: '#2b2b2b' }, { id: 'white', name: '하양', c: '#ffffff' }
  ];
  var SIZES = [{ id: 's', name: '얇게', w: 6 }, { id: 'm', name: '보통', w: 16 }, { id: 'l', name: '굵게', w: 34 }];

  /* ---------- 도장 (x, y 가운데, s 크기) ---------- */
  function star(ctx, x, y, s) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * 0.22 : s * 0.5; ctx[i ? 'lineTo' : 'moveTo'](x + r * Math.cos(a), y + r * Math.sin(a)); }
    ctx.closePath(); ctx.fill();
  }
  var STAMPS = [
    { id: 'star', name: '별', draw: star },
    { id: 'heart', name: '하트', draw: function (ctx, x, y, s) {
      ctx.save(); ctx.translate(x - s / 2, y - s / 2); ctx.scale(s / 100, s / 100); ctx.fill(new Path2D('M50 92 C8 62 4 30 26 18 C38 11 48 18 50 28 C52 18 62 11 74 18 C96 30 92 62 50 92 Z')); ctx.restore(); } },
    { id: 'flower', name: '꽃', draw: function (ctx, x, y, s) {
      var col = ctx.fillStyle;
      for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3; ctx.beginPath(); ctx.arc(x + s * 0.27 * Math.cos(a), y + s * 0.27 * Math.sin(a), s * 0.22, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x, y, s * 0.18, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = col; } },
    { id: 'smile', name: '웃는 얼굴', draw: function (ctx, x, y, s) {
      var col = ctx.fillStyle;
      ctx.beginPath(); ctx.arc(x, y, s * 0.48, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2b2b2b'; ctx.beginPath(); ctx.arc(x - s * 0.17, y - s * 0.1, s * 0.06, 0, Math.PI * 2); ctx.arc(x + s * 0.17, y - s * 0.1, s * 0.06, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = Math.max(2, s * 0.06); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y + s * 0.03, s * 0.24, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      ctx.fillStyle = col; } },
    { id: 'moon', name: '달', draw: function (ctx, x, y, s) {
      ctx.save(); ctx.translate(x - s / 2, y - s / 2); ctx.scale(s / 100, s / 100); ctx.fill(new Path2D('M62 4 A46 46 0 1 0 96 72 A38 38 0 1 1 62 4 Z')); ctx.restore(); } },
    { id: 'cloud', name: '구름', draw: function (ctx, x, y, s) {
      ctx.beginPath(); ctx.arc(x - s * 0.25, y + s * 0.06, s * 0.2, 0, Math.PI * 2); ctx.arc(x, y - s * 0.08, s * 0.27, 0, Math.PI * 2); ctx.arc(x + s * 0.27, y + s * 0.06, s * 0.2, 0, Math.PI * 2); ctx.rect(x - s * 0.25, y + s * 0.06, s * 0.52, s * 0.2); ctx.fill(); } }
  ];

  /* ---------- 색칠 밑그림 ----------
     ops: ['c',cx,cy,r] 원 · ['e',cx,cy,rx,ry,회전(라디안)] 타원 · ['p','SVG 경로'] 선·도형 (모두 검은 선으로만 그린다) */
  function starPath(cx, cy, r) {
    var d = '';
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1); }
    return d + 'Z';
  }
  function rays(cx, cy, r1, r2, n) {
    var d = '';
    for (var i = 0; i < n; i++) { var a = i * 2 * Math.PI / n; d += 'M' + (cx + r1 * Math.cos(a)).toFixed(1) + ' ' + (cy + r1 * Math.sin(a)).toFixed(1) + 'L' + (cx + r2 * Math.cos(a)).toFixed(1) + ' ' + (cy + r2 * Math.sin(a)).toFixed(1); }
    return d;
  }
  var petals = [];
  for (var k = 0; k < 6; k++) { var pa = k * Math.PI / 3; petals.push(['e', 400 + 100 * Math.sin(pa), 230 - 100 * Math.cos(pa), 36, 52, pa]); }

  var PICS = [
    { id: 'cat', name: '고양이', ops: [
      ['p', 'M300 343 Q250 480 320 565 L480 565 Q550 480 500 343'], ['c', 400, 260, 130],
      ['p', 'M290 170 L270 60 L370 130 Z'], ['p', 'M510 170 L530 60 L430 130 Z'], ['p', 'M292 140 L286 95 L335 125 Z'], ['p', 'M508 140 L514 95 L465 125 Z'],
      ['c', 350, 240, 18], ['c', 450, 240, 18], ['c', 350, 244, 7], ['c', 450, 244, 7],
      ['p', 'M385 282 L415 282 L400 302 Z'], ['p', 'M400 302 L400 320 M400 320 Q380 342 360 325 M400 320 Q420 342 440 325'],
      ['p', 'M250 290 L330 295 M250 322 L330 312 M550 290 L470 295 M550 322 L470 312'],
      ['e', 345, 568, 45, 22, 0], ['e', 455, 568, 45, 22, 0], ['p', 'M498 470 Q630 470 610 380 Q600 350 575 385']] },
    { id: 'flower', name: '꽃', ops: [['c', 400, 230, 45]].concat(petals).concat([
      ['p', 'M392 382 L392 540 L408 540 L408 382 Z'], ['e', 335, 455, 56, 22, -0.5], ['e', 465, 490, 56, 22, 0.5],
      ['p', 'M330 540 L470 540 L450 595 L350 595 Z'], ['c', 90, 90, 42], ['p', rays(90, 90, 52, 74, 8)], ['p', 'M640 120 Q660 90 690 110 Q720 80 750 115 Q775 125 760 150 L650 150 Q625 145 640 120 Z']]) },
    { id: 'house', name: '집', ops: [
      ['p', 'M220 280 L220 540 L580 540 L580 280'], ['p', 'M190 285 L400 120 L610 285 Z'], ['p', 'M505 202 L505 125 L555 125 L555 242'],
      ['p', 'M370 540 L370 400 L450 400 L450 540'], ['c', 434, 475, 6], ['p', 'M260 330 L340 330 L340 410 L260 410 Z M300 330 L300 410 M260 370 L340 370'],
      ['p', 'M460 330 L540 330 L540 410 L460 410 Z M500 330 L500 410 M460 370 L540 370'], ['c', 110, 100, 45], ['p', rays(110, 100, 55, 78, 8)],
      ['p', 'M0 540 L800 540'], ['p', 'M660 540 L660 418 M694 418 L694 540'], ['c', 677, 350, 70]] },
    { id: 'ark', name: '노아의 방주', ops: [
      ['p', 'M100 330 A300 300 0 0 1 700 330'], ['p', 'M130 330 A270 270 0 0 1 670 330'], ['p', 'M160 330 A240 240 0 0 1 640 330'],
      ['p', 'M100 330 L160 330 M640 330 L700 330'], ['p', 'M150 400 L650 400 L580 500 L220 500 Z'],
      ['p', 'M300 320 L300 400 L500 400 L500 320 Z'], ['p', 'M280 320 L400 250 L520 320 Z'], ['c', 355, 360, 20], ['c', 445, 360, 20],
      ['c', 215, 366, 30], ['c', 205, 360, 4], ['c', 225, 360, 4], ['c', 585, 366, 30], ['c', 575, 360, 4], ['c', 595, 360, 4],
      ['p', 'M0 520 Q50 490 100 520 T200 520 T300 520 T400 520 T500 520 T600 520 T700 520 T800 520'], ['c', 720, 70, 42], ['p', rays(720, 70, 52, 72, 8)]] },
    { id: 'fish', name: '물고기', ops: [
      ['e', 400, 300, 200, 120, 0], ['p', 'M600 300 L730 195 L730 405 Z'], ['c', 300, 270, 22], ['c', 300, 270, 9],
      ['p', 'M215 322 Q245 342 272 324'], ['p', 'M330 232 Q300 300 330 368'], ['p', 'M360 182 Q410 90 470 188'], ['p', 'M380 419 Q430 500 480 410'],
      ['c', 150, 170, 14], ['c', 120, 120, 10], ['c', 168, 92, 18], ['p', 'M80 600 Q40 520 80 450 Q120 380 80 320 M150 600 Q110 540 150 490']] },
    { id: 'butterfly', name: '나비', ops: [
      ['e', 270, 230, 110, 80, -0.5], ['e', 530, 230, 110, 80, 0.5], ['e', 305, 395, 80, 60, 0.5], ['e', 495, 395, 80, 60, -0.5],
      ['e', 400, 320, 24, 140, 0], ['c', 400, 155, 24], ['p', 'M392 135 Q370 80 340 70 M408 135 Q430 80 460 70'],
      ['c', 250, 225, 28], ['c', 550, 225, 28], ['c', 305, 395, 20], ['c', 495, 395, 20]] },
    { id: 'rocket', name: '로켓', ops: [
      ['p', 'M400 60 Q500 160 500 330 L500 430 L300 430 L300 330 Q300 160 400 60 Z'], ['c', 400, 230, 45], ['c', 400, 230, 30],
      ['p', 'M300 340 L210 450 L210 520 L300 450 Z'], ['p', 'M500 340 L590 450 L590 520 L500 450 Z'],
      ['p', 'M340 430 L360 480 L440 480 L460 430'], ['p', 'M360 480 Q400 600 440 480 Z'],
      ['p', starPath(100, 120, 34)], ['p', starPath(700, 90, 28)], ['p', starPath(120, 400, 26)], ['p', starPath(680, 430, 32)],
      ['c', 660, 230, 50], ['c', 645, 215, 9], ['c', 678, 248, 12]] }
  ];

  /* 밑그림을 ctx 에 그린다 (scale: 작은 그림용 배율) */
  function drawLines(ctx, pic, scale) {
    ctx.save();
    if (scale && scale !== 1) ctx.scale(scale, scale);
    ctx.strokeStyle = '#2b2b2b'; ctx.lineWidth = scale && scale < 0.5 ? 9 : 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    pic.ops.forEach(function (o) {
      if (o[0] === 'p') ctx.stroke(new Path2D(o[1]));
      else { ctx.beginPath(); if (o[0] === 'c') ctx.arc(o[1], o[2], o[3], 0, Math.PI * 2); else ctx.ellipse(o[1], o[2], o[3], o[4], o[5] || 0, 0, Math.PI * 2); ctx.stroke(); }
    });
    ctx.restore();
  }

  /* ---------- 영역 채우기 ----------
     img: 색 칸의 RGBA(Uint8ClampedArray, w*h*4), barrier: 선이면 1인 칸(Uint8Array, w*h), rgb: [r,g,b].
     누른 곳과 비슷한 색으로 이어진 칸을 칠한다. 선 위를 눌러도 바로 옆 빈 곳을 찾아 칠한다. 칠한 칸 수를 돌려준다. */
  function floodFill(img, barrier, w, h, x, y, rgb, tol) {
    tol = tol == null ? 48 : tol;
    x = Math.max(0, Math.min(w - 1, Math.round(x))); y = Math.max(0, Math.min(h - 1, Math.round(y)));
    if (barrier[y * w + x]) {
      var found = false;
      for (var r = 1; r <= 10 && !found; r++) for (var dy = -r; dy <= r && !found; dy++) for (var dx = -r; dx <= r; dx++) {
        var nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < w && ny < h && !barrier[ny * w + nx]) { x = nx; y = ny; found = true; break; }
      }
      if (!found) return 0;
    }
    var i0 = (y * w + x) * 4, tr = img[i0], tg = img[i0 + 1], tb = img[i0 + 2];
    if (Math.abs(tr - rgb[0]) < 3 && Math.abs(tg - rgb[1]) < 3 && Math.abs(tb - rgb[2]) < 3) return 0;
    function ok(p) {
      if (barrier[p]) return false;
      var i = p * 4;
      return Math.abs(img[i] - tr) <= tol && Math.abs(img[i + 1] - tg) <= tol && Math.abs(img[i + 2] - tb) <= tol;
    }
    var seen = new Uint8Array(w * h), stack = [x, y], count = 0;
    while (stack.length) {
      var cy = stack.pop(), cx = stack.pop(), lx = cx;
      while (lx >= 0 && !seen[cy * w + lx] && ok(cy * w + lx)) lx--;
      lx++;
      var up = false, down = false;
      for (var px = lx; px < w && !seen[cy * w + px] && ok(cy * w + px); px++) {
        var p = cy * w + px, i = p * 4;
        seen[p] = 1; img[i] = rgb[0]; img[i + 1] = rgb[1]; img[i + 2] = rgb[2]; img[i + 3] = 255; count++;
        if (cy > 0) { var u = p - w; if (!seen[u] && ok(u)) { if (!up) { stack.push(px, cy - 1); up = true; } } else up = false; }
        if (cy < h - 1) { var d = p + w; if (!seen[d] && ok(d)) { if (!down) { stack.push(px, cy + 1); down = true; } } else down = false; }
      }
    }
    return count;
  }

  KN.draw = { W: W, H: H, COLORS: COLORS, SIZES: SIZES, STAMPS: STAMPS, PICS: PICS, drawLines: drawLines, floodFill: floodFill, JPEG_MAX: 800, JPEG_Q: 0.7,
    pic: function (id) { for (var i = 0; i < PICS.length; i++) if (PICS[i].id === id) return PICS[i]; return null; } };
  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
