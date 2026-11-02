/* 영어 단원 생성기.  동사·형용사·복수형은 변화표(eng-data.js)에서 만들어 틀린 형태가 정답에 끼지 않게 한다.
   손으로 쓴 빈칸 문장은 정답 한 개와 확실히 틀린 보기만 둔다(scripts/check-eng.js 가 구조를 확인). */
(function (g) {
  var KN = g.KN = g.KN || {};
  KN.engUnits = KN.engUnits || [];
  var mk = KN.mk;
  function U(id, grade, gradeTo, name, tiers, desc, gen) { KN.engUnits.push({ id: id, subj: 'eng', grade: grade, gradeTo: gradeTo, name: name, tiers: tiers, desc: desc, gen: gen }); }
  var can = function () { return !!(KN.canSpeak && KN.canSpeak()); };
  var NAMES = ['Tom', 'Mina', 'Jisu', 'Minho', 'Sora', 'Jun'];
  var S3 = ['She', 'He', 'My mother', 'Tom', 'Mina', 'My brother', 'My teacher'];
  var SP = ['I', 'You', 'We', 'They', 'My friends'];
  var OBJ = { go: 'to the park', eat: 'pizza', see: 'a movie', write: 'a letter', take: 'a photo', give: 'a gift to a friend', make: 'a cake', buy: 'a hat', come: 'home', run: 'in the park', read: 'a book', know: 'the answer', sing: 'a song', swim: 'in the sea', drink: 'milk', speak: 'to the teacher', break: 'a cup', tell: 'a story', play: 'soccer', watch: 'TV', study: 'English', walk: 'to school', help: 'the children', visit: 'a friend', cook: 'dinner', wash: 'the dishes', listen: 'to music', work: 'in a shop', live: 'in Seoul', clean: 'the room' };
  function V() { return KN.engVerbs; }
  function pickVerb(r, skip) { var v; do { v = r.pick(V()); } while (skip && skip.indexOf(v[0]) >= 0); return v; }
  /* 오답 3개: 우선순위 목록 뒤에 그 동사의 다른 모양을 채워 항상 서로 다른 3개가 되게 한다 */
  function fw(v, key, prefer, extra) {
    var all = (prefer || []).concat(extra || []).concat([v[0], v[1], v[2], v[3], v[4]]), out = [];
    all.forEach(function (x) { if (x !== key && out.indexOf(x) < 0) out.push(x); });
    return out.slice(0, 3);
  }
  function near(r, pos, n) { /* 알파벳 위치 pos 근처의 다른 글자 n개 */
    var A = KN.engAlphabet, c = [];
    [-3, -2, -1, 1, 2, 3, 4].forEach(function (d) { var k = pos + d; if (k >= 0 && k < 26) c.push(A[k]); });
    return r.shuffle(c).slice(0, n);
  }

  /* 4지선다 만들기: key + 오답(중복·키와 같은 것 제외) */
  function fill(r, sentence, key, wrongs, explain, v) {
    var q = mk(r, '빈칸에 알맞은 말을 골라요.\n' + sentence, key, explain, { wrong: wrongs, v: v || { t: 'fill', key: key } });
    return q;
  }
  function filled(sentence, key) { return sentence.replace('___', key); }

  /* ================= 초1~2 : 알파벳 · 파닉스 ================= */
  var CONF = { b: 'dpq', d: 'bpq', p: 'qbd', q: 'pgd', m: 'nwu', n: 'mhu', u: 'nvw', g: 'qyj', i: 'ljt', l: 'itj', t: 'fli', f: 'ltj' };
  U('e-alpha', 1, 2, '알파벳', 2, '대문자와 소문자, 알파벳 순서', function (r, t) {
    var A = KN.engAlphabet;
    if (t === 1) {
      var i = r.int(0, 25), L = A[i], low = L.toLowerCase(), up = r.chance(.5);
      var pool = (CONF[low] || '').split('').concat(r.shuffle(A.toLowerCase().split('')));
      var wr = pool.filter(function (x, k) { return x !== low && pool.indexOf(x) === k; }).slice(0, 3);
      if (up) return mk(r, '대문자 ' + L + ' 와 짝이 되는 소문자는 무엇일까요?', low, L + ' 의 소문자는 ' + KN.iyo(low) + '.', { wrong: wr, v: { t: 'alpha1', L: L, ans: low } });
      return mk(r, '소문자 ' + low + ' 와 짝이 되는 대문자는 무엇일까요?', L, low + ' 의 대문자는 ' + KN.iyo(L) + '.', { wrong: wr.map(function (x) { return x.toUpperCase(); }), v: { t: 'alpha1', L: L, ans: L, up: true } });
    }
    var k = r.int(1, 3);
    if (k === 1) {
      var s0 = r.int(0, 21), hole = r.int(1, 3), win = [];
      for (var jj = 0; jj < 5; jj++) win.push(jj === hole ? '□' : A[s0 + jj]);
      return mk(r, '알파벳 순서에서 □ 에 들어갈 글자는 무엇일까요?\n' + win.join('  '), A[s0 + hole], '알파벳은 A B C D E F G … 순서예요.', { wrong: near(r, s0 + hole, 3), v: { t: 'alpha2', pos: s0 + hole } });
    }
    if (k === 2) { var n = r.int(0, 24); return mk(r, A[n] + ' 바로 다음 글자는 무엇일까요?', A[n + 1], A[n] + ' 다음은 ' + KN.iyo(A[n + 1]) + '.', { wrong: near(r, n + 1, 3), v: { t: 'alpha2', pos: n + 1 } }); }
    var m = r.int(1, 25); return mk(r, A[m] + ' 바로 앞 글자는 무엇일까요?', A[m - 1], A[m - 1] + ' 다음은 ' + KN.iyo(A[m]) + '.', { wrong: near(r, m - 1, 3), v: { t: 'alpha2', pos: m - 1 } });
  });

  var JOLLY = 'satipncekhrmdgoulfb'.split('');
  U('e-phonics', 1, 2, '파닉스 놀이', 2, '낱말의 첫소리, 글자로 낱말 만들기', function (r, t) {
    if (t === 1) {
      if (r.chance(.25)) {
        var d = r.pick(KN.engDigraph), ops = ['sh', 'ch', 'th', 'wh'];
        var q = mk(r, "'" + d.w + "' (" + d.ko + ') ' + KN.j(d.w, '은는').slice(d.w.length) + ' 어떤 소리 글자로 시작할까요?', d.d, KN.j(d.w, '은는') + ' ' + d.d + ' 로 시작해요. (' + d.d + ' 두 글자가 한 소리를 내요)', { wrong: ops.filter(function (x) { return x !== d.d; }), v: { t: 'digraph', w: d.w, key: d.d } });
        if (can()) q.say = { text: d.w, lang: 'en-US' };
        return q;
      }
      var w = r.pick(KN.engCVC), first = w.w[0];
      var wr = r.shuffle(JOLLY.filter(function (x) { return x !== first && !(first === 'c' && x === 'k') && !(first === 'k' && x === 'c'); })).slice(0, 3);
      var q2 = mk(r, "'" + w.w + "' (" + w.ko + ') ' + KN.j(w.w, '은는').slice(w.w.length) + ' 어떤 글자로 시작할까요?', first, KN.j(w.w, '은는') + ' ' + first + ' 로 시작해요.', { wrong: wr, v: { t: 'first', w: w.w, key: first } });
      if (can()) q2.say = { text: w.w, lang: 'en-US' };
      return q2;
    }
    var wd = r.pick(KN.engCVC);
    var q3 = mk(r, '‘' + wd.ko + '’' + (KN.hasBatchim(wd.ko) ? '을' : '를') + ' 영어로 쓰려고 해요. 글자를 순서대로 눌러 보세요.', wd.w, wd.w + ' = ' + wd.ko, { kind: 'order', v: { t: 'spell', w: wd.w } });
    q3.pieces = r.shuffle(wd.w.split('')); q3.joiner = '';
    if (can()) q3.say = { text: wd.w, lang: 'en-US' };
    return q3;
  });

  /* ================= 초3~6 : 단어 ================= */
  function wordsQ(r, t, band, list) {
    var w = r.pick(list), others = list.filter(function (x) { return x.w !== w.w && x.ko !== w.ko; });
    var kinds = t === 1 ? ['en', 'ko'] : ['listen', 'ko', 'spell', 'listen'];
    var kind = r.pick(kinds);
    var q;
    if (kind === 'listen' && !can()) kind = 'en';
    if (kind === 'en') {
      q = mk(r, '‘' + w.w + '’의 뜻은 무엇일까요?', w.ko, w.w + ' = ' + w.ko, { wrong: r.shuffle(others).slice(0, 3).map(function (x) { return x.ko; }), v: { t: 'ew', band: band, w: w.w, ko: w.ko, ask: 'ko' } });
      if (can()) q.say = { text: w.w, lang: 'en-US' };
    } else if (kind === 'ko') {
      q = mk(r, '다음 우리말을 영어로 하면 무엇일까요?\n‘' + w.ko + '’', w.w, w.ko + ' = ' + w.w, { wrong: r.shuffle(others).slice(0, 3).map(function (x) { return x.w; }), v: { t: 'ew', band: band, w: w.w, ko: w.ko, ask: 'en' } });
    } else if (kind === 'listen') {
      q = mk(r, '들려 주는 영어 낱말의 뜻을 골라요.', w.ko, w.w + ' = ' + w.ko, { wrong: r.shuffle(others).slice(0, 3).map(function (x) { return x.ko; }), v: { t: 'ew', band: band, w: w.w, ko: w.ko, ask: 'ko' } });
      q.say = { text: w.w, lang: 'en-US' }; q.sayLabel = '소리 듣기';
    } else {
      var cand = list.filter(function (x) { return x.w.length >= 4 && x.w.length <= 8 && /^[a-z]+$/.test(x.w); }), s = r.pick(cand);
      q = mk(r, '‘' + s.ko + '’' + (KN.hasBatchim(s.ko) ? '을' : '를') + ' 영어로 쓰려고 해요. 글자를 순서대로 눌러 보세요.', s.w, s.ko + ' = ' + s.w, { kind: 'order', v: { t: 'ew', band: band, w: s.w, ko: s.ko, ask: 'spell' } });
      q.pieces = r.shuffle(s.w.split('')); q.joiner = '';
      if (q.pieces.join('') === s.w) q.pieces = q.pieces.reverse();
    }
    return q;
  }
  U('e3-words', 3, 4, '영어 단어 (초3~4)', 2, '생활 속 기초 단어 뜻 알기, 듣기, 쓰기', function (r, t) { return wordsQ(r, t, 'A', KN.engWordsA); });
  U('e5-words', 5, 6, '영어 단어 (초5~6)', 2, '조금 더 넓은 기초 단어', function (r, t) { return wordsQ(r, t, 'B', KN.engWordsB); });

  /* ================= 문장 순서 맞추기 ================= */
  function orderQ(r, list, band, minT, maxT) {
    var pool = list.filter(function (s) { var n = s.split(' ').length; return n >= minT && n <= maxT; });
    var s = pool[r.int(0, pool.length - 1)], tk = s.split(' ');
    var q = mk(r, '낱말을 순서대로 눌러 문장을 만들어요.', s, s, { kind: 'order', v: { t: 'eorder', s: s } });
    q.pieces = r.shuffle(tk); q.joiner = ' ';
    if (q.pieces.join(' ') === s) q.pieces = q.pieces.slice().reverse();
    q.say = can() ? { text: s, lang: 'en-US' } : undefined; if (!q.say) delete q.say; else q.sayLabel = '문장 듣기';
    return q;
  }

  /* ================= 초3~4 문장 ================= */
  var BE = { 'I': 'am', 'You': 'are', 'He': 'is', 'She': 'is', 'It': 'is', 'We': 'are', 'They': 'are', 'My brother': 'is', 'The students': 'are', 'Mina and Jisu': 'are', 'My dog': 'is' };
  var BEADJ = ['happy', 'tired', 'hungry', 'ready', 'late', 'busy'];
  function beQ(r) {
    var subj = r.pick(Object.keys(BE)), key = BE[subj];
    return fill(r, subj + ' ___ ' + r.pick(subj === 'It' ? ['hot', 'cold', 'sunny', 'rainy', 'late'] : BEADJ) + ' today.', key, ['am', 'is', 'are', 'be'], KN.j(subj, '은는') + ' ' + key + ' 를 써요. (I → am, he/she/it/단수 → is, you/we/they/복수 → are)', { t: 'be', subj: subj, key: key });
  }
  var NOUNS = ['apple', 'egg', 'orange', 'umbrella', 'elephant', 'ice cream', 'book', 'dog', 'cat', 'bird', 'pencil', 'desk', 'bag', 'ruler', 'ant', 'eraser'];
  function articleQ(r) {
    var n = r.pick(NOUNS), key = /^[aeiou]/.test(n) ? 'an' : 'a';
    return fill(r, 'I see ___ ' + n + '.', key, ['a', 'an', 'two', 'many'], n + ' 은 ' + (key === 'an' ? '모음 소리로 시작해서 an' : '모음 소리로 시작하지 않아서 a') + ' 를 써요.', { t: 'article', n: n, key: key });
  }
  function pluralQ(r) {
    var p = r.pick(KN.engPlural), base = p[0], key = p[1];
    var pool = [base, base + 's', base + 'es', base + 'ies', base + 'en', base.slice(0, -1) + 'ies'].filter(function (x, i, a) { return x !== key && a.indexOf(x) === i; });
    return fill(r, 'I see two ___ .', key, pool.slice(0, 3), base + ' 의 복수형은 ' + key + ' 예요.', { t: 'form', kind: 'plural', base: base, key: key });
  }
  function canQ(r) {
    var v = pickVerb(r, ['know', 'live']), key = v[0];
    return fill(r, 'Can you ___ ' + OBJ[v[0]] + '?', key, fw(v, key, [v[1], v[2], v[4]]), 'can 뒤에는 동사 원래 모양(' + key + ')을 써요.', { t: 'form', kind: 'base', base: v[0], key: key });
  }
  function progQ(r) {
    var v = pickVerb(r, ['know']), s = r.pick(['Tom', 'Mina', 'My mother', 'My brother']), key = v[4];
    return fill(r, s + ' is ___ ' + OBJ[v[0]] + ' now.', key, fw(v, key, [v[0], v[1], v[2]]), 'is 뒤에 -ing 를 붙여 "지금 ~하고 있어요" 를 나타내요: ' + key, { t: 'form', kind: 'ing', base: v[0], key: key });
  }
  U('e3-sent', 3, 4, '영어 문장 (초3~4)', 2, 'am·is·are, a와 an, 복수형, 문장 순서', function (r, t) {
    if (t === 1) return r.pick([beQ, articleQ, pluralQ])(r);
    return r.chance(.6) ? orderQ(r, KN.engOrderA, 'A', 3, 6) : r.pick([canQ, progQ])(r);
  });

  /* ================= 초5~6 문장 ================= */
  function sg3Q(r) {
    var v = pickVerb(r, ['live', 'know', 'break']), s = r.pick(S3), key = v[1];
    return fill(r, s + ' ___ ' + OBJ[v[0]] + ' every day.', key, fw(v, key, [v[0], v[2], v[4]]), KN.j(s, '은는') + ' 3인칭 단수라서 동사에 -s/-es 를 붙여요: ' + key, { t: 'form', kind: '3sg', base: v[0], key: key });
  }
  function negQ(r) {
    var three = r.chance(.5), s = three ? r.pick(S3) : r.pick(SP), v = pickVerb(r), key = three ? "doesn't" : "don't";
    return fill(r, s + ' ___ ' + v[0] + ' ' + OBJ[v[0]] + '.', key, ["doesn't", "don't", "isn't", "aren't"], (three ? '3인칭 단수 → doesn\'t' : 'I·you·we·they·복수 → don\'t') + ' + 동사 원래 모양', { t: 'neg', three: three, key: key });
  }
  function pastQ(r) {
    var v = pickVerb(r, ['live']), key = v[2], pp = v[3];
    return fill(r, 'Yesterday, I ___ ' + OBJ[v[0]] + '.', key, fw(v, key, [v[0], v[4], pp]), 'yesterday 는 지난 일이라서 과거형 ' + key + ' 를 써요.', { t: 'form', kind: 'past', base: v[0], key: key });
  }
  var PREP = [['I get up ___ 7 o\'clock.', 'at'], ['We have a party ___ Sunday.', 'on'], ['My birthday is ___ May.', 'in'], ['School starts ___ March.', 'in'], ['I go to bed ___ 10 o\'clock.', 'at'], ['We have a test ___ Monday.', 'on'], ['It is cold ___ winter.', 'in'], ['The class begins ___ 9 o\'clock.', 'at'], ['I was born ___ 2014.', 'in'], ['She visits her uncle ___ Saturday.', 'on'], ['Flowers bloom ___ spring.', 'in'], ['We eat lunch ___ noon.', 'at']];
  function prepQ(r) {
    var it = r.pick(PREP);
    return fill(r, it[0], it[1], ['at', 'on', 'in', 'to'], '시각엔 at, 요일엔 on, 달·계절·해엔 in 을 써요: ' + filled(it[0], it[1]), { t: 'fill', key: it[1], sentence: it[0] });
  }
  var WH = [['___ is your name?', 'What'], ['___ are you from?', 'Where'], ['___ old are you?', 'How'], ['___ is that boy? He is my brother.', 'Who'], ['___ do you go to school? By bus.', 'How'], ['___ is my bag? It is on the chair.', 'Where'], ['___ do you like? I like pizza.', 'What'], ['___ time is it? It is three o\'clock.', 'What'], ['___ are you sad? Because I lost my pen.', 'Why'], ['___ do you get up? At seven.', 'When'], ['___ many books do you have?', 'How']];
  function whQ(r) {
    var it = r.pick(WH), pool = ['What', 'Where', 'Who', 'How', 'When', 'Why'].filter(function (x) { return x !== it[1]; });
    return fill(r, it[0], it[1], r.shuffle(pool).slice(0, 3), filled(it[0], it[1]), { t: 'fill', key: it[1], sentence: it[0] });
  }
  U('e5-sent', 5, 6, '영어 문장 (초5~6)', 2, 'can, -ing, 3인칭 -s, 과거, at·on·in, 의문사', function (r, t) {
    if (t === 1) return r.pick([beQ, canQ, progQ, pluralQ, sg3Q])(r);
    return r.pick([sg3Q, negQ, pastQ, prepQ, whQ])(r);
  });

  /* ================= 중학교 문법 ================= */
  var NM2 = function (r) { var a = r.pick(NAMES), b; do { b = r.pick(NAMES); } while (b === a); return [a, b]; };
  function wrongDeg(adj) { /* 틀린 모양: 짧은 말은 more/most, 긴 말은 -er/-est, y로 끝나는 말은 y 그대로 -er/-est(more happy 도 쓰이므로 피함) */
    var multi = adj[1].indexOf('more ') === 0;
    return multi || /y$/.test(adj[0]) ? [adj[0] + 'er', adj[0] + 'est'] : ['more ' + adj[0], 'most ' + adj[0]];
  }
  function adjOf(list, r) { var w = r.pick(list); return KN.engAdj.filter(function (a) { return a[0] === w; })[0]; }
  function compQ(r) {
    var kind = r.pick(['people', 'people', 'thing', 'weather']), adj = adjOf(kind === 'people' ? KN.engAdjPeople : kind === 'weather' ? KN.engAdjWeather : KN.engAdjThing, r), nm = NM2(r), key = adj[1], w = wrongDeg(adj);
    var sent = kind === 'people' ? nm[0] + ' is ___ than ' + nm[1] + '.' : kind === 'weather' ? 'Today is ___ than yesterday.' : 'This book is ___ than that one.';
    return fill(r, sent, key, [adj[0], adj[2], w[0]], 'than 이 있으면 비교급: ' + key, { t: 'form', kind: 'comp', base: adj[0], key: key });
  }
  function supQ(r) {
    var kind = r.pick(['people', 'people', 'thing', 'weather']), adj = adjOf(kind === 'people' ? KN.engAdjPeople : kind === 'weather' ? KN.engAdjWeather : KN.engAdjThing, r), key = adj[2], w = wrongDeg(adj);
    var sent = kind === 'people' ? r.pick(NAMES) + ' is the ___ student in my class.' : kind === 'weather' ? 'This is the ___ day of the year.' : 'This is the ___ book in the library.';
    return fill(r, sent, key, [adj[0], adj[1], w[1]], 'the 와 in my class 가 있으면 최상급: ' + key, { t: 'form', kind: 'sup', base: adj[0], key: key });
  }
  function pastLQ(r) {
    var v = pickVerb(r, ['live']), key = v[2], pp = v[3];
    var wr = fw(v, key, [v[0], v[4], pp]);
    return fill(r, 'Last night, ' + r.pick(['I', 'she', 'we', 'they', 'Tom']) + ' ___ ' + OBJ[v[0]] + '.', key, wr, 'last night 은 지난 일이라서 과거형 ' + key, { t: 'form', kind: 'past', base: v[0], key: key });
  }
  function willQ(r) {
    var v = pickVerb(r), key = v[0];
    return fill(r, 'Tomorrow, ' + r.pick(['I', 'she', 'we', 'Tom']) + ' will ___ ' + OBJ[v[0]] + '.', key, fw(v, key, [v[1], v[2], v[4]]), 'will 뒤에는 동사 원래 모양: will ' + key, { t: 'form', kind: 'base', base: v[0], key: key });
  }
  function auxQ(r) {
    var three = r.chance(.5), s = three ? r.pick(['she', 'he', 'Tom', 'your mother']) : r.pick(['you', 'they', 'we', 'your friends']), v = pickVerb(r, ['know']);
    var key = three ? 'Does' : 'Do';
    return fill(r, '___ ' + s + ' ' + v[0] + ' ' + OBJ[v[0]] + '?', key, ['Do', 'Does', 'Is', 'Are'], '일반동사 의문문: ' + (three ? '3인칭 단수 → Does' : 'I·you·we·they → Do') + ' + 주어 + 동사 원래 모양', { t: 'aux', three: three, key: key });
  }
  function didntQ(r) {
    var s = r.pick(['I', 'She', 'We', 'They', 'Tom']), v = pickVerb(r, ['know', 'live', 'break']);
    return fill(r, s + ' ___ ' + v[0] + ' ' + OBJ[v[0]] + ' yesterday.', "didn't", ["didn't", "don't", "doesn't", "wasn't"], '과거 부정문은 주어에 상관없이 didn\'t + 동사 원래 모양', { t: 'fill', key: "didn't" });
  }
  var THERE = [['a cat', 'is', ['under the table', 'in the garden', 'on the sofa']], ['three books', 'are', ['on the desk', 'in the bag', 'on the shelf']], ['an apple', 'is', ['on the desk', 'in the box', 'under the table']], ['two dogs', 'are', ['in the garden', 'under the tree', 'in the park']], ['many students', 'are', ['in the room', 'in the classroom', 'in the park']], ['a pencil', 'is', ['on the desk', 'in the bag', 'in the box']], ['five birds', 'are', ['in the tree', 'on the roof', 'in the garden']], ['a bag', 'is', ['on the chair', 'under the desk', 'in the room']]];
  function thereQ(r) {
    var it = r.pick(THERE), place = r.pick(it[2]);
    return fill(r, 'There ___ ' + it[0] + ' ' + place + '.', it[1], ['is', 'are', 'am', 'be'], 'There is + 단수, There are + 복수: ' + it[0], { t: 'fill', key: it[1] });
  }
  U('e7-gram', 7, 7, '영어 문법 (중1)', 2, '비교급·최상급, 과거, 미래 will, do/does, there is/are', function (r, t) {
    return t === 1 ? r.pick([compQ, supQ, pastLQ, willQ])(r) : r.pick([auxQ, didntQ, thereQ, compQ, supQ])(r);
  });
  U('e7-order', 7, 7, '영어 문장 만들기 (중1)', 2, '낱말을 순서대로 놓아 문장 만들기', function (r, t) { return t === 1 ? orderQ(r, KN.engOrder7, '7', 5, 7) : orderQ(r, KN.engOrder7, '7', 7, 9); });

  var ING_V = ['enjoy', 'finish', 'keep'], INF_V = ['want', 'hope', 'decide', 'plan', 'learn'];
  var GER_OK = ['play', 'read', 'swim', 'sing', 'listen', 'watch', 'cook', 'walk', 'study', 'eat', 'drink'];
  var INF_OK = ['go', 'eat', 'see', 'write', 'buy', 'run', 'read', 'swim', 'sing', 'speak', 'play', 'watch', 'study', 'walk', 'help', 'visit', 'cook', 'wash', 'clean', 'work'];
  var INF_ONLY = { hope: ['go', 'see', 'visit', 'swim', 'eat', 'play', 'travel'], learn: ['swim', 'sing', 'speak', 'play', 'cook', 'read', 'write'] };
  function gerQ(r) {
    var ger = r.chance(.5), m = ger ? r.pick(ING_V) : r.pick(INF_V), okList = ger ? GER_OK : (INF_ONLY[m] || INF_OK);
    var cand = KN.engVerbs.filter(function (x) { return okList.indexOf(x[0]) >= 0; }), v = cand[r.int(0, cand.length - 1)];
    var key = ger ? v[4] : 'to ' + v[0];
    var pre = ger ? ['to ' + v[0], v[0], v[2], v[1]] : [v[4], v[0], v[2], v[1]], wr = [];
    pre.forEach(function (x) { if (x !== key && wr.indexOf(x) < 0) wr.push(x); });
    wr = wr.slice(0, 3);
    return fill(r, 'I ' + m + ' ___ ' + OBJ[v[0]] + '.', key, wr, (ger ? m + ' 뒤에는 -ing' : m + ' 뒤에는 to + 동사 원래 모양') + ': ' + m + ' ' + key, { t: 'gerinf', m: m, ger: ger, base: v[0], key: key });
  }
  var PERF = ['already', 'just', 'ever'];
  function perfQ(r) {
    var v = pickVerb(r, ['live', 'know', 'work', 'break']), key = v[3];
    var wr = fw(v, key, [v[2], v[0], v[4]]);
    var adv = r.pick(['already', 'just']), s = r.pick(['I', 'She', 'We', 'Tom']), has = (s === 'She' || s === 'Tom') ? 'has' : 'have';
    return fill(r, s + ' ' + has + ' ' + adv + ' ___ ' + OBJ[v[0]] + '.', key, wr, '현재완료는 have/has + 과거분사: ' + has + ' ' + key, { t: 'form', kind: 'pp', base: v[0], key: key });
  }
  var FS = [['I have lived here ___ five years.', 'for'], ['She has been sick ___ Monday.', 'since'], ['He has played the piano ___ he was six.', 'since'], ['We have known each other ___ ten years.', 'for'], ['They have studied English ___ 2018.', 'since'], ['I have waited ___ two hours.', 'for']];
  function fsQ(r) { var it = r.pick(FS); return fill(r, it[0], it[1], ['for', 'since', 'during', 'ago'], '기간(몇 년, 몇 시간)에는 for, 시작한 때(년도, 요일, 그때부터)에는 since: ' + filled(it[0], it[1]), { t: 'fill', key: it[1] }); }
  var PASS = [['The window was ___ by Tom.', 'break'], ['The letter was ___ by my mother.', 'write'], ['This cake was ___ by my sister.', 'make'], ['English is ___ in many countries.', 'speak'], ['The bag was ___ by my father.', 'buy'], ['The room was ___ by my brother.', 'clean'], ['The song was ___ by a famous singer.', 'sing']];
  function passQ(r) {
    var it = r.pick(PASS), v = KN.engVerbs.filter(function (x) { return x[0] === it[1]; })[0], key = v[3];
    var wr = fw(v, key, [v[2], v[0], v[4]]);
    return fill(r, it[0], key, wr, '수동태는 be + 과거분사: ' + filled(it[0], key), { t: 'form', kind: 'pp', base: v[0], key: key });
  }
  var CONJ = [['I was tired, ___ I went to bed early.', 'so'], ['He is rich, ___ he is not happy.', 'but'], ['I stayed home ___ it was raining.', 'because'], ['Do you want tea ___ coffee?', 'or'], ['She studied hard, ___ she passed the test.', 'so'], ['I like soccer, ___ my brother likes baseball.', 'but'], ['We took an umbrella ___ it was raining.', 'because'], ['Would you like to walk ___ take a bus?', 'or']];
  function conjQ(r) { var it = CONJ[r.int(0, CONJ.length - 1)]; return fill(r, it[0], it[1], ['because', 'but', 'so', 'or'], '앞뒤 문장의 관계를 생각해요: ' + filled(it[0], it[1]), { t: 'fill', key: it[1] }); }
  U('e8-gram', 8, 8, '영어 문법 (중2)', 2, 'to부정사와 동명사, 현재완료, 수동태, 접속사', function (r, t) {
    return t === 1 ? r.pick([gerQ, perfQ, conjQ])(r) : r.pick([passQ, fsQ, perfQ, gerQ])(r);
  });
  U('e8-order', 8, 8, '영어 문장 만들기 (중2)', 2, '현재완료·수동태 문장 만들기', function (r, t) { return t === 1 ? orderQ(r, KN.engOrder8, '8', 5, 7) : orderQ(r, KN.engOrder8, '8', 7, 10); });

  var REL = [['The boy ___ is standing there is my brother.', 'who'], ['This is the book ___ I bought yesterday.', 'which'], ['I know a girl ___ father is a doctor.', 'whose'], ['This is the town ___ I was born.', 'where'], ['The woman ___ lives next door is a nurse.', 'who'], ['I have a bike ___ is very fast.', 'which'], ['Do you remember the day ___ we first met?', 'when'], ['He is the man ___ car was stolen.', 'whose']];
  function relQ(r) { var it = r.pick(REL), pool = ['who', 'which', 'whose', 'where', 'when'].filter(function (x) { return x !== it[1]; }); return fill(r, it[0], it[1], r.shuffle(pool).slice(0, 3), '앞의 말(사람·사물·장소·때·소유)에 맞는 관계사: ' + filled(it[0], it[1]), { t: 'fill', key: it[1] }); }
  var PART = [['The game was very ___ .', 'exciting', 'excited'], ['I was ___ by the long speech.', 'bored', 'boring'], ['She is ___ in science.', 'interested', 'interesting'], ['The news was ___ .', 'surprising', 'surprised'], ['We were ___ after the long walk.', 'tired', 'tiring'], ['The book was so ___ that I read it twice.', 'interesting', 'interested'], ['The movie was ___ , so I fell asleep.', 'boring', 'bored']];
  function partQ(r) { var it = r.pick(PART); return mk(r, '빈칸에 알맞은 말을 골라요.\n' + it[0], it[1], '사물이 느끼게 만드는 말은 -ing, 사람이 느끼는 감정은 -ed: ' + filled(it[0], it[1]), { wrong: [it[2]], choices: [it[1], it[2]], v: { t: 'fill', key: it[1] } }); }
  var IND = [['where', 'he lives', ['does he live', 'he live', 'lives he']], ['what', 'she wants', ['does she want', 'she want', 'wants she']], ['when', 'the bus comes', ['does the bus come', 'the bus come', 'comes the bus']], ['why', 'Tom is late', ['is Tom late', 'Tom late is', 'late Tom is']], ['where', 'she works', ['does she work', 'she work', 'works she']]];
  function indQ(r) { var it = r.pick(IND); return fill(r, 'I do not know ' + it[0] + ' ___ .', it[1], it[2], '간접의문문은 의문사 뒤에 "주어 + 동사" 순서: ' + it[0] + ' ' + it[1], { t: 'fill', key: it[1] }); }
  var COND = [['If it ___ tomorrow, we will stay home.', 'rains', ['will rain', 'rained', 'raining']], ['If you study hard, you ___ pass the test.', 'will', ['are', 'were', 'been']], ['If I have time, I ___ visit you.', 'will', ['am', 'were', 'been']], ['We will go to the park if it ___ sunny.', 'is', ['will be', 'was', 'being']], ['If she comes, I ___ be happy.', 'will', ['am', 'were', 'been']], ['If you ___ cold, you can wear my coat.', 'are', ['will be', 'is', 'being']]];
  function condQ(r) { var it = r.pick(COND); return fill(r, it[0], it[1], it[2], '조건을 나타내는 if 절에서는 미래 일도 현재형을 써요: ' + filled(it[0], it[1]), { t: 'fill', key: it[1] }); }
  U('e9-gram', 9, 9, '영어 문법 (중3)', 2, '관계사, 분사형 형용사, 간접의문문, 조건문', function (r, t) {
    return t === 1 ? r.pick([relQ, partQ])(r) : r.pick([indQ, condQ, relQ, partQ])(r);
  });
  U('e9-order', 9, 9, '영어 문장 만들기 (중3)', 2, '긴 문장 만들기', function (r, t) { return t === 1 ? orderQ(r, KN.engOrder9, '9', 6, 8) : orderQ(r, KN.engOrder9, '9', 8, 12); });

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
