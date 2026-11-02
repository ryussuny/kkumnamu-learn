/* 국어 단원 생성기 — 정답이 확실한 손으로 고른 문항(js/kor-data.js)에서 뽑는다 */
(function (g) {
  var KN = g.KN = g.KN || {};
  KN.korUnits = KN.korUnits || [];
  var mk = KN.mk;
  function U(id, grade, gradeTo, name, tiers, desc, gen) { KN.korUnits.push({ id: id, subj: 'kor', grade: grade, gradeTo: gradeTo, name: name, tiers: tiers, desc: desc, gen: gen }); }
  /* 1단계는 쉬운 것(lv1), 2단계는 전체에서 */
  function pool(items, t) { return t === 1 ? items.filter(function (x) { return x[0] === 1; }) : items; }
  function pick(r, arr) { return arr[r.int(0, arr.length - 1)]; }

  /* ---- 초1~2 ---- */
  U('k-hangul', 1, 2, '한글 자모와 소리', 2, '자음·모음 이름과 순서, 소리 나는 대로 읽기', function (r, t) {
    if (t === 1) {
      var k = r.int(1, 4), C = KN.korConsonants;
      if (k === 1) { var c = pick(r, C); return mk(r, '자음 ‘' + c[0] + '’ 의 이름은 무엇일까요?', c[1], c[0] + '의 이름은 ' + KN.iyo(c[1]) + '.', { wrong: r.shuffle(C.filter(function (x) { return x[1] !== c[1]; })).slice(0, 3).map(function (x) { return x[1]; }), v: { t: 'cons', c: c[0], name: c[1] } }); }
      if (k === 2) { var d = pick(r, C); return mk(r, '이름이 ‘' + d[1] + '’ 인 자음은 무엇일까요?', d[0], KN.j(d[1], '은는') + ' ' + KN.iyo(d[0]) + '.', { wrong: r.shuffle(C.filter(function (x) { return x[0] !== d[0]; })).slice(0, 3).map(function (x) { return x[0]; }), v: { t: 'cons', c: d[0], name: d[1] } }); }
      if (k === 3) {
        var s = r.int(0, 9), hole = r.int(1, 3), win = [];
        for (var i = 0; i < 5; i++) win.push(i === hole ? '□' : C[s + i][0]);
        var ans = C[s + hole][0], wr = r.shuffle(C.map(function (x) { return x[0]; }).filter(function (x) { return x !== ans; })).slice(0, 3);
        return mk(r, '자음 순서에서 □ 에 알맞은 글자는 무엇일까요?\n' + win.join('  '), ans, 'ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ 순서예요.', { wrong: wr, v: { t: 'consseq', pos: s + hole, ans: ans } });
      }
      var V = KN.korVowels, s2 = r.int(0, 5), h2 = r.int(1, 3), w2 = [];
      for (var j = 0; j < 5; j++) w2.push(j === h2 ? '□' : V[s2 + j]);
      var a2 = V[s2 + h2];
      return mk(r, '모음 순서에서 □ 에 알맞은 글자는 무엇일까요?\n' + w2.join('  '), a2, 'ㅏ ㅑ ㅓ ㅕ ㅗ ㅛ ㅜ ㅠ ㅡ ㅣ 순서예요.', { wrong: r.shuffle(V.filter(function (x) { return x !== a2; })).slice(0, 3), v: { t: 'vowelseq', pos: s2 + h2, ans: a2 } });
    }
    var it = pick(r, KN.korSound);
    return mk(r, '‘' + it[0] + '’ — 소리 나는 대로 적으면 무엇일까요?', it[1], '‘' + it[0] + '’' + KN.j(it[0], '은는').slice(it[0].length) + ' [' + it[1] + ']' + KN.ro(it[1]).slice(it[1].length) + ' 소리 나요.', { wrong: it[2], v: { t: 'sound', w: it[0], ans: it[1] } });
  });

  U('k-opp', 1, 2, '반대말', 2, '뜻이 반대되는 낱말 찾기', function (r, t) {
    var P = KN.korOpp, n = t === 1 ? 14 : P.length, p = P[r.int(0, n - 1)], flip = r.chance(.5);
    var a = flip ? p[1] : p[0], b = flip ? p[0] : p[1];
    var all = []; P.forEach(function (x) { all.push(x[0], x[1]); });
    var banned = {}; banned[a] = 1; banned[b] = 1;
    var wr = r.shuffle(all.filter(function (x) { return !banned[x]; })).slice(0, 3);
    return mk(r, '‘' + a + '’ 의 반대말은 무엇일까요?', b, a + ' 의 반대말은 ' + KN.iyo(b) + '.', { wrong: wr, v: { t: 'opp', a: a, b: b } });
  });

  /* ---- 일반 항목 ---- */
  function blankQ(r, it, extra) { return mk(r, '빈칸에 알맞은 말을 골라요.\n' + it[1], it[2], it[4], { wrong: it[3], v: { t: 'kitem', a: it[2] } }); }
  function plainQ(r, it) { return mk(r, it[1], it[2], it[4], { wrong: it[3], v: { t: 'kitem', a: it[2] } }); }
  function spaceQ(r, it) {
    var q = mk(r, '띄어쓰기가 바른 문장을 골라요.', it[1], it[3], { wrong: it[2], v: { t: 'kitem', a: it[1] } });
    return q;
  }
  function meaningQ(r, items, t, label) {
    var it = pick(r, pool(items, t)), style = function (d) { return /다$/.test(d) ? 'da' : /것$/.test(d) ? 'geot' : /말$/.test(d) ? 'mal' : 'etc'; };
    var others = items.filter(function (x) { return x[2] !== it[2] && !(it[3] && x[3] === it[3]); });
    var same = others.filter(function (x) { return style(x[2]) === style(it[2]); });
    var wr = r.shuffle(same.length >= 3 ? same : others).slice(0, 3).map(function (x) { return x[2]; });
    return mk(r, '‘' + it[1] + '’ ' + label + ' 알맞은 것은 무엇일까요?', it[2], it[1] + ' = ' + it[2], { wrong: wr, v: { t: 'kmean', w: it[1], ans: it[2] } });
  }

  U('k-sound3', 3, 4, '소리 나는 대로 (초3~4)', 2, '겹받침·된소리·연음 읽기', function (r, t) {
    var it = pick(r, pool(KN.korSound3, t));
    return mk(r, '‘' + it[1] + '’ — 소리 나는 대로 적으면 무엇일까요?', it[2], '‘' + it[1] + '’' + KN.j(it[1], '은는').slice(it[1].length) + ' [' + it[2] + ']' + KN.ro(it[2]).slice(it[2].length) + ' 소리 나요.', { wrong: it[3], v: { t: 'sound', w: it[1], ans: it[2] } });
  });
  U('k-spell3', 3, 4, '맞춤법 (초3~4)', 2, '자주 틀리는 낱말, 사이시옷, 준말', function (r, t) { return blankQ(r, pick(r, pool(KN.korSpell3, t))); });
  U('k-space3', 3, 4, '띄어쓰기 (초3~4)', 2, '조사·의존 명사·단위 명사', function (r, t) { return spaceQ(r, pick(r, pool(KN.korSpace, t))); });
  U('k-mean3', 3, 4, '낱말의 뜻 (초3~4)', 2, '낱말 뜻 고르기', function (r, t) { return meaningQ(r, KN.korMeaning, t, '의 뜻으로'); });
  U('k-spell5', 5, 6, '맞춤법 (초5~6)', 2, '안/않, 되/돼, -로서/-로써, 낫다/낳다, 사이시옷', function (r, t) { return blankQ(r, pick(r, pool(KN.korSpell5, t))); });
  U('k-idiom5', 5, 6, '속담과 관용 표현', 2, '속담과 관용 표현의 뜻', function (r, t) { return meaningQ(r, KN.korIdiom, t, '의 뜻으로'); });
  U('k-honor5', 5, 6, '높임 표현', 2, '높임 낱말과 높임 문장', function (r, t) {
    var it = pick(r, t === 1 ? KN.korHonor1 : KN.korHonor1.concat(KN.korHonor2));
    var isBlank = it[0].indexOf('___') >= 0;
    return mk(r, (isBlank ? '웃어른께 어울리는 높임 낱말을 골라 빈칸을 채워요.\n' : '') + it[0], it[1], it[3], { wrong: it[2], v: { t: 'kitem', a: it[1] } });
  });
  U('k-spell7', 7, 9, '맞춤법과 발음 (중등)', 2, '사이시옷, 준말, 외래어 표기, 표준 발음', function (r, t) { return plainQ(r, pick(r, pool(KN.korSpell7, t))); });
  U('k-vocab7', 7, 9, '어휘와 한자성어 (중등)', 2, '문맥 속 낱말과 한자성어의 뜻', function (r, t) { return meaningQ(r, KN.korVocab, t, '의 뜻으로'); });

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
