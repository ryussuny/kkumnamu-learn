/* 스티커 모음책 — 코드로 그린 색깔 SVG 36개(외부 이미지 없음). 받는 순서는 이 배열 순서 그대로(special 은 선물 상자 전용).
   각 그림은 48x48 칸 안의 도형 조각이다. */
(function (g) {
  var KN = g.KN = g.KN || {};
  var INK = '#3a3352';
  function C(x, y, r, f, s) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (s ? ' stroke="' + s + '" stroke-width="2"' : '') + '/>'; }
  function E(x, y, rx, ry, f, rot) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (rot ? ' transform="rotate(' + rot + ' ' + x + ' ' + y + ')"' : '') + '/>'; }
  function R(x, y, w, h, f, r) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (r || 0) + '" fill="' + f + '"/>'; }
  function P(d, f, s) { return '<path d="' + d + '" fill="' + (f || 'none') + '"' + (s ? ' stroke="' + s + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"' : '') + '/>'; }
  function eyes(x1, x2, y) { return C(x1, y, 2, INK) + C(x2, y, 2, INK); }
  function star(cx, cy, r, f) {
    var d = ''; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1); }
    return P(d + 'Z', f);
  }
  var smile = P('M20 32 Q24 36 28 32', null, INK);

  var LIST = [
    /* 동물 */
    { id: 'cat', name: '야옹이', cat: '동물', svg: P('M10 20 L12 6 L22 14 Z', '#ffb35c') + P('M38 20 L36 6 L26 14 Z', '#ffb35c') + C(24, 27, 15, '#ffb35c') + eyes(18, 30, 25) + P('M22 29 L26 29 L24 32 Z', '#e8604c') + P('M24 32 Q20 36 17 33 M24 32 Q28 36 31 33', null, INK) },
    { id: 'dog', name: '멍멍이', cat: '동물', svg: E(10, 26, 6, 12, '#a8703a', 12) + E(38, 26, 6, 12, '#a8703a', -12) + C(24, 26, 14, '#e8c08a') + eyes(18, 30, 23) + E(24, 31, 5, 4, INK) + P('M24 34 L24 37 M20 38 Q24 41 28 38', null, INK) },
    { id: 'rabbit', name: '토끼', cat: '동물', svg: E(17, 11, 4, 11, '#fff') + E(31, 11, 4, 11, '#fff') + E(17, 12, 2, 7, '#ffc2d9') + E(31, 12, 2, 7, '#ffc2d9') + C(24, 30, 13, '#fff', '#d9d0e6') + eyes(19, 29, 28) + C(24, 32, 2, '#ff7aa2') },
    { id: 'chick', name: '병아리', cat: '동물', svg: C(24, 26, 16, '#ffd84a') + eyes(18, 30, 22) + P('M21 27 L27 27 L24 32 Z', '#ff8a30') + P('M24 10 Q22 5 26 5', null, '#ffb800') + E(11, 28, 4, 7, '#ffc933', -20) + E(37, 28, 4, 7, '#ffc933', 20) },
    { id: 'fish', name: '물고기', cat: '동물', svg: E(21, 24, 14, 10, '#4ab8ff') + P('M33 24 L44 14 L44 34 Z', '#2f6fdd') + C(15, 22, 2.2, '#fff') + C(15, 22, 1, INK) + P('M20 18 Q24 24 20 30', null, '#2f6fdd') },
    { id: 'turtle', name: '거북이', cat: '동물', svg: E(24, 28, 16, 11, '#58b368') + P('M12 28 Q24 10 36 28 Z', '#8a5a3b') + C(40, 26, 5, '#8fd19a') + C(41, 25, 1.2, INK) + R(14, 36, 6, 6, '#8fd19a', 2) + R(28, 36, 6, 6, '#8fd19a', 2) },
    { id: 'lion', name: '사자', cat: '동물', svg: C(24, 25, 20, '#e08a2e') + C(24, 26, 13, '#ffd27a') + eyes(19, 29, 24) + E(24, 30, 3, 2.4, INK) + P('M24 32 Q21 36 18 34 M24 32 Q27 36 30 34', null, INK) },
    { id: 'panda', name: '판다', cat: '동물', svg: C(11, 11, 6, INK) + C(37, 11, 6, INK) + C(24, 26, 16, '#fff', '#d9d0e6') + E(17, 24, 4, 5, INK, -15) + E(31, 24, 4, 5, INK, 15) + C(17, 24, 1.4, '#fff') + C(31, 24, 1.4, '#fff') + E(24, 31, 3, 2.2, INK) },
    { id: 'pig', name: '아기돼지', cat: '동물', svg: P('M10 16 L14 6 L21 13 Z', '#ff9ec0') + P('M38 16 L34 6 L27 13 Z', '#ff9ec0') + C(24, 26, 16, '#ffb3cc') + eyes(17, 31, 22) + E(24, 30, 7, 5, '#ff8fb5') + C(21.5, 30, 1.2, INK) + C(26.5, 30, 1.2, INK) },
    { id: 'frog', name: '개구리', cat: '동물', svg: C(14, 14, 7, '#6fd05a') + C(34, 14, 7, '#6fd05a') + E(24, 28, 18, 13, '#6fd05a') + C(14, 14, 3, '#fff') + C(34, 14, 3, '#fff') + C(14, 14, 1.4, INK) + C(34, 14, 1.4, INK) + P('M14 32 Q24 40 34 32', null, INK) },
    /* 과일 */
    { id: 'apple', name: '사과', cat: '과일', svg: P('M24 14 Q10 10 8 26 Q8 42 24 40 Q40 42 40 26 Q38 10 24 14 Z', '#e8364f') + P('M24 14 Q25 8 29 6', null, '#8a5a3b') + P('M28 8 Q36 6 36 12 Q30 14 28 8 Z', '#58b368') + E(16, 24, 3, 5, '#ff8a9a', 20) },
    { id: 'strawberry', name: '딸기', cat: '과일', svg: P('M8 16 Q24 8 40 16 Q38 40 24 44 Q10 40 8 16 Z', '#ff4d6d') + P('M14 14 L18 8 L24 13 L30 8 L34 14 Q24 18 14 14 Z', '#4fb25a') + C(16, 24, 1.3, '#ffe27a') + C(24, 28, 1.3, '#ffe27a') + C(32, 24, 1.3, '#ffe27a') + C(20, 34, 1.3, '#ffe27a') + C(28, 35, 1.3, '#ffe27a') },
    { id: 'banana', name: '바나나', cat: '과일', svg: P('M8 14 Q10 38 34 40 Q40 40 42 36 Q22 38 16 12 Z', '#ffd93d', '#c99a00') + P('M8 14 L12 8 L16 12', '#8a5a3b') },
    { id: 'grapes', name: '포도', cat: '과일', svg: C(16, 18, 6, '#8a56d6') + C(28, 18, 6, '#8a56d6') + C(22, 28, 6, '#9b6be3') + C(34, 28, 6, '#8a56d6') + C(10, 28, 6, '#9b6be3') + C(22, 38, 5.5, '#8a56d6') + P('M22 12 Q22 6 28 5', null, '#58b368') + P('M26 8 Q34 4 36 10 Q30 12 26 8 Z', '#58b368') },
    { id: 'watermelon', name: '수박', cat: '과일', svg: P('M4 22 Q24 52 44 22 Z', '#3fa35a') + P('M8 22 Q24 46 40 22 Z', '#ff5d73') + C(18, 28, 1.4, INK) + C(24, 34, 1.4, INK) + C(30, 28, 1.4, INK) },
    { id: 'orange', name: '귤', cat: '과일', svg: C(24, 28, 15, '#ff9f1c') + P('M24 14 Q22 8 26 7', null, '#8a5a3b') + P('M24 13 Q32 6 36 12 Q30 16 24 13 Z', '#58b368') + E(18, 24, 3, 5, '#ffc266', 25) },
    /* 탈것 */
    { id: 'car', name: '자동차', cat: '탈것', svg: P('M6 30 L10 20 Q12 16 16 16 L32 16 Q36 16 38 20 L42 30 Z', '#e8364f') + R(4, 28, 40, 9, '#e8364f', 3) + P('M14 20 L34 20 L37 27 L11 27 Z', '#bfe6ff') + C(14, 38, 5, INK) + C(34, 38, 5, INK) + C(14, 38, 2, '#ddd') + C(34, 38, 2, '#ddd') },
    { id: 'bus', name: '버스', cat: '탈것', svg: R(5, 10, 38, 26, '#ffc933', 5) + R(9, 15, 8, 8, '#bfe6ff', 1) + R(20, 15, 8, 8, '#bfe6ff', 1) + R(31, 15, 8, 8, '#bfe6ff', 1) + R(5, 27, 38, 3, '#e8604c') + C(15, 37, 5, INK) + C(33, 37, 5, INK) + C(15, 37, 2, '#ddd') + C(33, 37, 2, '#ddd') },
    { id: 'train', name: '기차', cat: '탈것', svg: R(6, 14, 30, 22, '#4ab8ff', 4) + R(36, 22, 8, 14, '#2f6fdd', 2) + R(10, 18, 8, 8, '#fff', 1) + R(22, 18, 8, 8, '#fff', 1) + R(10, 8, 8, 6, '#2f6fdd') + C(14, 38, 4, INK) + C(28, 38, 4, INK) + C(40, 38, 3.5, INK) },
    { id: 'plane', name: '비행기', cat: '탈것', svg: P('M4 26 Q24 20 44 22 Q46 26 44 28 Q24 30 4 26 Z', '#e9eef7', '#9aa7bd') + P('M20 24 L12 8 L18 8 L30 23 Z', '#4ab8ff') + P('M20 28 L12 42 L18 42 L30 29 Z', '#4ab8ff') + P('M6 26 L3 16 L9 18 L12 25 Z', '#e8364f') + C(38, 25, 1.6, '#4ab8ff') },
    { id: 'boat', name: '배', cat: '탈것', svg: R(23, 6, 2.5, 22, '#8a5a3b') + P('M26 8 L40 24 L26 24 Z', '#fff', '#c9c0d6') + P('M22 12 L10 24 L22 24 Z', '#ffd93d') + P('M6 28 L42 28 L36 40 L12 40 Z', '#e8604c') + P('M2 42 Q8 38 14 42 T26 42 T38 42 T46 42', null, '#4ab8ff') },
    /* 우주 */
    { id: 'sun', name: '해님', cat: '우주', svg: P('M24 3 L24 9 M24 39 L24 45 M3 24 L9 24 M39 24 L45 24 M9 9 L13 13 M35 35 L39 39 M9 39 L13 35 M35 13 L39 9', null, '#ffb800') + C(24, 24, 12, '#ffd93d') + eyes(20, 28, 22) + P('M20 28 Q24 32 28 28', null, '#c98a00') },
    { id: 'moon', name: '달님', cat: '우주', svg: P('M30 6 Q10 8 10 26 Q10 42 30 42 Q18 36 18 24 Q18 12 30 6 Z', '#ffe27a', '#c98a00') + star(36, 14, 4, '#ffd93d') + star(40, 30, 3, '#ffd93d') },
    { id: 'star', name: '반짝별', cat: '우주', svg: star(24, 25, 20, '#ffd93d') + eyes(19, 29, 24) + P('M20 30 Q24 34 28 30', null, '#c98a00') },
    { id: 'planet', name: '고리 행성', cat: '우주', svg: C(24, 24, 13, '#b79cff') + P('M2 30 Q24 40 46 18 Q24 32 2 30 Z', '#ffd93d') + C(19, 20, 2.5, '#9b6be3') + C(28, 28, 3, '#9b6be3') },
    { id: 'rocket', name: '로켓', cat: '우주', svg: P('M24 4 Q36 14 34 32 L14 32 Q12 14 24 4 Z', '#f2f2f7', '#b3b8c9') + C(24, 19, 5, '#4ab8ff') + P('M14 26 L6 38 L14 34 Z', '#e8364f') + P('M34 26 L42 38 L34 34 Z', '#e8364f') + P('M19 32 Q24 46 29 32 Z', '#ff9f1c') },
    { id: 'comet', name: '별똥별', cat: '우주', svg: P('M40 6 Q18 8 6 30 Q24 22 40 6 Z', '#ffe9a8') + P('M40 6 Q20 14 12 36 Q30 26 40 6 Z', '#ffd93d') + C(38, 10, 6, '#ffc933') },
    /* 성경 이야기 */
    { id: 'rainbow', name: '무지개', cat: '성경', svg: P('M5 38 Q5 10 24 10 Q43 10 43 38', null, '#e8364f').replace('stroke-width="2.5"', 'stroke-width="4"') + P('M10 38 Q10 15 24 15 Q38 15 38 38', null, '#ffc933').replace('stroke-width="2.5"', 'stroke-width="4"') + P('M15 38 Q15 20 24 20 Q33 20 33 38', null, '#4fb25a').replace('stroke-width="2.5"', 'stroke-width="4"') + P('M20 38 Q20 25 24 25 Q28 25 28 38', null, '#2f6fdd').replace('stroke-width="2.5"', 'stroke-width="4"') },
    { id: 'dove', name: '비둘기', cat: '성경', svg: E(22, 28, 14, 9, '#fff', -8) + C(35, 20, 6, '#fff') + P('M40 20 L45 21 L40 23 Z', '#ff9f1c') + C(36, 18.5, 1.2, INK) + P('M14 22 Q10 6 24 10 Q22 20 20 26 Z', '#e9eef7', '#c9c0d6') + P('M30 30 Q26 38 40 36', null, '#58b368') },
    { id: 'lamp', name: '등불', cat: '성경', svg: E(24, 30, 16, 9, '#e0a13a') + P('M8 30 Q4 24 10 22 Q14 24 12 28 Z', '#e0a13a') + P('M38 26 L46 20 Q46 26 40 30 Z', '#e0a13a') + P('M28 22 Q24 12 28 6 Q34 14 28 22 Z', '#ff9f1c') + P('M28 20 Q26 14 28 11 Q31 15 28 20 Z', '#ffe27a') },
    { id: 'crown', name: '왕관', cat: '성경', svg: P('M6 36 L6 14 L16 24 L24 8 L32 24 L42 14 L42 36 Z', '#ffc933', '#c98a00') + C(24, 28, 3, '#e8364f') + C(12, 30, 2, '#4ab8ff') + C(36, 30, 2, '#4ab8ff') },
    { id: 'bread', name: '빵과 물고기', cat: '성경', svg: E(16, 32, 12, 8, '#e0a13a') + P('M10 30 Q16 26 22 30', null, '#b97a1a') + E(33, 22, 10, 6, '#4ab8ff', -20) + P('M42 18 L46 12 L46 26 Z', '#2f6fdd') + C(28, 20, 1.2, INK) },
    /* 특별(선물 상자 전용) */
    { id: 'sp-trophy', name: '금빛 트로피', cat: '특별', special: true, svg: P('M14 6 L34 6 L32 24 Q24 32 16 24 Z', '#ffd93d', '#c98a00') + P('M14 10 Q4 10 8 20 Q10 24 16 22 M34 10 Q44 10 40 20 Q38 24 32 22', null, '#c98a00') + R(21, 29, 6, 7, '#e0a13a') + R(14, 36, 20, 6, '#c98a00', 2) + star(24, 15, 5, '#fff3b0') },
    { id: 'sp-medal', name: '반짝 메달', cat: '특별', special: true, svg: P('M14 4 L22 20 L28 20 L20 4 Z', '#e8364f') + P('M34 4 L26 20 L20 20 L28 4 Z', '#2f6fdd') + C(24, 30, 12, '#ffd93d', '#c98a00') + star(24, 30, 7, '#fff3b0') },
    { id: 'sp-diamond', name: '보석', cat: '특별', special: true, svg: P('M12 8 L36 8 L44 18 L24 44 L4 18 Z', '#6fd6ff', '#2e83cc') + P('M4 18 L44 18 M16 8 L12 18 L24 44 L36 18 L32 8 M12 18 L24 8 L36 18', null, '#fff') },
    { id: 'sp-heart', name: '황금 하트', cat: '특별', special: true, svg: P('M24 42 C4 28 2 14 12 9 C18 6 23 9 24 14 C25 9 30 6 36 9 C46 14 44 28 24 42 Z', '#ffc933', '#c98a00') + E(15, 15, 3, 5, '#fff3b0', 30) }
  ];
  KN.stickers = LIST;
  KN.stickerOrder = LIST.filter(function (s) { return !s.special; }).map(function (s) { return s.id; });
  KN.sticker = function (id) { for (var i = 0; i < LIST.length; i++) if (LIST[i].id === id) return LIST[i]; return null; };
  KN.stickerSvg = function (id, size) {
    var s = KN.sticker(id); if (!s) return '';
    return '<svg class="stk" viewBox="0 0 48 48" width="' + (size || 56) + '" height="' + (size || 56) + '" role="img" aria-label="' + KN.esc(s.name) + '">' + s.svg + '</svg>';
  };
  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
