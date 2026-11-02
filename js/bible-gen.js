/* 성경 단원 생성기.  본문은 KN.bibleText(bible-verses.js)에서만 가져온다.
   본문이 없는 참조 전용 모드에서는 암송 단원이 빠지고, 이야기 퀴즈에는 장절 참조만 보여 준다. */
(function (g) {
  var KN = g.KN = g.KN || {};
  KN.bibleUnits = KN.bibleUnits || [];
  var mk = KN.mk;
  function U(id, grade, gradeTo, name, tiers, desc, gen) { KN.bibleUnits.push({ id: id, subj: 'bible', grade: grade, gradeTo: gradeTo, name: name, tiers: tiers, desc: desc, gen: gen }); }

  /* ---------- 구절 가져오기 ---------- */
  function keysOf(ref) {
    var m = ref.match(/^(\S+) (\d+):(\d+)(?:-(\d+))?$/), out = [];
    for (var v = +m[3]; v <= (m[4] ? +m[4] : +m[3]); v++) out.push(m[1] + ' ' + m[2] + ':' + v);
    return out;
  }
  KN.verseText = function (ref) {
    var T = KN.bibleText || {}, ks = keysOf(ref), out = [];
    for (var i = 0; i < ks.length; i++) { if (T[ks[i]] == null) return ''; out.push(T[ks[i]]); }
    return out.join(' ');
  };
  KN.hasBibleText = function () { return !!(KN.bibleText && Object.keys(KN.bibleText).length); };
  var strip = function (t) { return t.replace(/[,.?!;:]+$/, ''); };
  var BLANK = '＿＿＿＿';

  /* ---------- 이야기 퀴즈 ---------- */
  /* 판마다 낱말이 다른 문제는 f.alt[판] 의 q·a·w·kw 로 덮어쓴 것을 쓴다 */
  KN.factFor = function (f) {
    var o = f.alt && f.alt[KN.bibleVersion], k, out = {};
    for (k in f) out[k] = f[k];
    if (o) for (k in o) out[k] = o[k];
    return out;
  };
  function factQ(r, pool) {
    var f = KN.factFor(pool[r.int(0, pool.length - 1)]);
    var txt = KN.verseText(f.ref);
    var explain = txt ? '『' + txt + '』 — ' + f.ref : '근거: ' + f.ref + ' (성경에서 찾아 읽어 보세요)';
    var q = mk(r, f.q, f.a, explain, { wrong: f.w, v: { t: 'fact', ref: f.ref, kw: f.kw } });
    q.ref = f.ref;
    return q;
  }
  function poolOf(L, from, to) { return KN.bibleFacts.filter(function (f) { return f.L === L; }).slice(from, to); }

  U('b-story1', 1, 2, '성경 이야기 (저학년)', 2, '창조, 노아, 모세, 다윗, 예수님 이야기', function (r, t) {
    return factQ(r, t === 1 ? poolOf(1, 0, 13) : poolOf(1, 0, 40));
  });
  U('b-story3', 3, 6, '성경 이야기 (고학년)', 2, '조상들과 예언자들, 예수님과 초대 교회', function (r, t) {
    return factQ(r, t === 1 ? poolOf(2, 0, 14) : poolOf(2, 0, 60).concat(poolOf(1, 13, 40)));
  });
  U('b-story7', 7, 9, '말씀의 뜻 이해 (중등)', 2, '말씀을 읽고 뜻을 생각해 보기', function (r, t) {
    return factQ(r, t === 1 ? poolOf(3, 0, 14) : poolOf(3, 0, 60));
  });

  /* ---------- 성경 목록 ---------- */
  var BK = function () { return KN.bibleBooks; };
  var GRPS = ['모세오경', '구약 역사서', '시가서', '대선지서', '소선지서', '복음서', '바울서신', '일반서신'];
  function nameJ(b, pair) { return KN.j(b.name, pair); }
  function booksQ(r, grade, tier) {
    var B = BK(), n = B.length;
    if (tier === 1 && grade <= 2) {
      var k = r.int(1, 5);
      if (k === 1) return mk(r, '성경의 첫 번째 책은 무엇일까요?', '창세기', '성경은 창세기로 시작해요.', { wrong: ['출애굽기', '마태복음', '시편', '요한복음'], v: { t: 'bk', i: 0 } });
      if (k === 2) return mk(r, '성경의 마지막 책은 무엇일까요?', '요한계시록', '성경은 요한계시록으로 끝나요.', { wrong: ['유다서', '사도행전', '말라기', '로마서'], v: { t: 'bk', i: 65 } });
      if (k === 3) return mk(r, '신약성경의 첫 번째 책은 무엇일까요?', '마태복음', '신약은 마태복음으로 시작해요.', { wrong: ['요한복음', '창세기', '사도행전', '말라기'], v: { t: 'bk', i: 39 } });
      if (k === 4) { var i4 = r.int(0, 3); return mk(r, B[i4].name + ' 다음에 오는 책은 무엇일까요?', B[i4 + 1].name, '성경에서 ' + B[i4].name + ' 다음 책은 ' + KN.iyo(B[i4 + 1].name) + '.', { wrong: B.slice(0, 8).filter(function (b) { return b.i !== i4 + 1 && b.i !== i4; }).map(function (b) { return b.name; }), v: { t: 'bk', i: i4 + 1 } }); }
      var i5 = r.int(39, 42); return mk(r, B[i5].name + ' 다음에 오는 책은 무엇일까요?', B[i5 + 1].name, '성경에서 ' + B[i5].name + ' 다음 책은 ' + KN.iyo(B[i5 + 1].name) + '.', { wrong: B.slice(39, 46).filter(function (b) { return b.i !== i5 + 1 && b.i !== i5; }).map(function (b) { return b.name; }), v: { t: 'bk', i: i5 + 1 } });
    }
    if (tier === 2 && grade <= 2) {
      var kk = r.int(1, 3);
      if (kk === 1) { var b = B[r.int(0, 65)]; return mk(r, KN.j(b.name, '은는') + ' 구약일까요, 신약일까요?', b.t, KN.j(b.name, '은는') + ' ' + b.t + '성경에 있어요.', { wrong: ['구약', '신약'], v: { t: 'bktest', i: b.i } }); }
      if (kk === 2) return mk(r, '구약성경은 모두 몇 권일까요?', '39권', '창세기부터 말라기까지 39권이에요.', { wrong: ['27권', '66권', '12권'], v: { t: 'bkcount', ans: 39 } });
      return mk(r, '신약성경은 모두 몇 권일까요?', '27권', '마태복음부터 요한계시록까지 27권이에요.', { wrong: ['39권', '66권', '12권'], v: { t: 'bkcount', ans: 27 } });
    }
    if (tier === 1) {
      var m = r.int(1, 3);
      if (m === 1) { var a = r.int(0, 64); return mk(r, B[a].name + ' 바로 다음 책은 무엇일까요?', B[a + 1].name, '성경에서 ' + B[a].name + ' 다음 책은 ' + KN.iyo(B[a + 1].name) + '.', { wrong: [B[Math.max(0, a - 1)].name, B[Math.min(65, a + 2)].name, B[(a + 7) % 66].name, B[(a + 13) % 66].name, B[(a + 21) % 66].name].filter(function (nm) { return nm !== B[a].name && nm !== B[a + 1].name; }), v: { t: 'bk', i: a + 1 } }); }
      if (m === 2) { var c = r.int(1, 65); return mk(r, B[c].name + ' 바로 앞에 있는 책은 무엇일까요?', B[c - 1].name, B[c - 1].name + ' 다음에 ' + KN.j(B[c].name, '이가') + ' 나와요.', { wrong: [B[Math.min(65, c + 1)].name, B[(c + 5) % 66].name, B[(c + 20) % 66].name, B[(c + 33) % 66].name, B[(c + 11) % 66].name].filter(function (nm) { return nm !== B[c].name && nm !== B[c - 1].name; }), v: { t: 'bk', i: c - 1 } }); }
      var d = r.int(0, 65); return mk(r, KN.j(B[d].name, '은는') + ' 구약일까요, 신약일까요?', B[d].t, B[d].t + '성경이에요.', { wrong: ['구약', '신약'], v: { t: 'bktest', i: d } });
    }
    var q2 = r.int(1, grade >= 7 ? 4 : 3);
    if (q2 === 1) {
      var cand = B.filter(function (b) { return GRPS.indexOf(b.grp) >= 0; }), bb = cand[r.int(0, cand.length - 1)];
      return mk(r, KN.j(bb.name, '은는') + ' 어떤 묶음에 속할까요?', bb.grp, KN.j(bb.name, '은는') + ' ' + bb.grp + '에 들어가요.', { wrong: r.shuffle(GRPS.filter(function (x) { return x !== bb.grp; })).slice(0, 3), v: { t: 'bkgrp', i: bb.i } });
    }
    if (q2 === 2) {
      var start = r.int(0, 61), items = B.slice(start, start + 5).map(function (x) { return x.name; });
      var q = mk(r, '성경의 순서대로 책 이름을 차례로 눌러 보세요.', items.join(' '), '순서: ' + items.join(' → '), { kind: 'order', v: { t: 'bkorder', start: start, n: 5 } });
      q.pieces = r.shuffle(items); q.joiner = ' ';
      return q;
    }
    if (q2 === 3) { var e = r.int(0, 65); return KN.mkNum(r, 9, 2, KN.j(B[e].name, '은는') + ' 성경에서 몇 번째 책일까요?', e + 1, '구약 39권, 신약 27권을 합쳐 66권이에요. 순서를 세어 보면 ' + (e + 1) + '번째예요.', { v: { t: 'bkpos', i: e } }); }
    var pk = B[r.int(0, 65)];
    return mk(r, KN.j(pk.name, '은는') + ' 모두 몇 장일까요?', pk.ch + '장', KN.j(pk.name, '은는') + ' ' + pk.ch + '장까지 있어요.', { wrong: [Math.max(1, pk.ch - 1) + '장', pk.ch + 1 + '장', pk.ch + 3 + '장', Math.max(1, pk.ch - 5) + '장'], v: { t: 'bkch', i: pk.i } });
  }
  U('b-books1', 1, 2, '성경 책 차례 (저학년)', 2, '성경의 첫 책과 끝 책, 구약과 신약', function (r, t) { return booksQ(r, 1, t); });
  U('b-books3', 3, 6, '성경 책 차례 (고학년)', 2, '책의 순서와 묶음', function (r, t) { return booksQ(r, 3, t); });
  U('b-books7', 7, 9, '성경 책 차례 (중등)', 2, '책의 묶음, 장 수, 순서와 위치', function (r, t) {
    var want = t === 1 ? ['bkgrp', 'bkch'] : ['bkorder', 'bkpos'], q, tries = 0;
    do { q = booksQ(r, 7, 2); tries++; } while (want.indexOf(q.v.t) < 0 && tries < 40);
    return q;
  });

  /* ---------- 암송 ---------- */
  function tokens(ref) { var t = KN.verseText(ref); return t ? t.split(' ') : []; }
  function verseRefs(minT, maxT) {
    return KN.bibleVerses.filter(function (rf) { var n = tokens(rf).length; return n >= minT && n <= maxT; });
  }
  var wordPool = null;
  function words() {
    if (wordPool) return wordPool;
    var o = {};
    KN.bibleVerses.forEach(function (rf) { tokens(rf).forEach(function (w) { w = strip(w); if (w.length >= 3) o[w] = 1; }); });
    return (wordPool = Object.keys(o));
  }
  function blankQ(r, refs) {
    var ref = refs[r.int(0, refs.length - 1)], tk = tokens(ref);
    var cand = []; tk.forEach(function (w, i) { if (strip(w).length >= 3) cand.push(i); });
    var bi = cand[r.int(0, cand.length - 1)], ans = strip(tk[bi]);
    var shown = tk.map(function (w, i) { return i === bi ? BLANK + w.slice(strip(w).length) : w; }).join(' ');
    var inVerse = {}; tk.forEach(function (w) { inVerse[strip(w)] = 1; });
    var pool = r.shuffle(words().filter(function (w) { return !inVerse[w] && Math.abs(w.length - ans.length) <= 2; })), wr = pool.slice(0, 3);
    var q = mk(r, '말씀의 빈칸에 알맞은 말을 골라요.\n「' + shown + '」 (' + ref + ')', ans, '『' + tk.join(' ') + '』 — ' + ref, { wrong: wr, v: { t: 'blank', ref: ref, bi: bi, ans: ans } });
    q.verse = ref;
    return q;
  }
  function orderQ(r, refs, chunks) {
    var ref = refs[r.int(0, refs.length - 1)], tk = tokens(ref), k = Math.min(chunks, tk.length), size = Math.ceil(tk.length / k), parts = [];
    for (var i = 0; i < tk.length; i += size) parts.push(tk.slice(i, i + size).join(' '));
    var q = mk(r, '말씀을 순서대로 맞춰요. (' + ref + ')', tk.join(' '), '『' + tk.join(' ') + '』 — ' + ref, { kind: 'order', v: { t: 'vorder', ref: ref } });
    q.pieces = r.shuffle(parts); q.joiner = ' '; q.verse = ref;
    return q;
  }
  function whereQ(r, refs) {
    var ref = refs[r.int(0, refs.length - 1)], txt = KN.verseText(ref);
    var others = r.shuffle(KN.bibleVerses.filter(function (x) { return x !== ref && KN.verseText(x) !== txt; })).slice(0, 3);
    var q = mk(r, '이 말씀은 성경의 어디에 나올까요?\n「' + txt + '」', ref, '『' + txt + '』 — ' + ref, { wrong: others, v: { t: 'where', ref: ref } });
    q.verse = ref;
    return q;
  }
  KN.bibleVerseUnitsReady = function () {
    if (!KN.hasBibleText()) return;
    if (KN.bibleUnits.some(function (u) { return u.id === 'b-verse1'; })) return;
    U('b-verse1', 1, 2, '말씀 암송 (저학년)', 2, '짧은 말씀 빈칸 채우기, 순서 맞추기', function (r, t) { var refs = verseRefs(3, 9); return t === 1 ? blankQ(r, refs) : orderQ(r, refs, 3); });
    U('b-verse3', 3, 6, '말씀 암송 (고학년)', 2, '말씀 빈칸 채우기, 순서 맞추기', function (r, t) { var refs = verseRefs(5, 16); return t === 1 ? blankQ(r, refs) : orderQ(r, refs, 4); });
    U('b-verse7', 7, 9, '말씀 암송 (중등)', 2, '말씀의 위치 찾기, 긴 말씀 순서 맞추기', function (r, t) { return t === 1 ? whereQ(r, verseRefs(8, 30)) : orderQ(r, verseRefs(10, 30), 6); });
  };
  KN.bibleVerseUnitsReady();

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
