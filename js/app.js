/* 꿈나무 배움터 — 화면 흐름 */
(function () {
  var KN = window.KN, app = document.getElementById('app'), store = KN.store;
  var cur = { pid: null, view: '', round: null, idx: 0, results: [], restAt: 0, pin: '' };
  var acts = {};
  var clock = null;

  /* ---------- 도구 ---------- */
  function P() { return cur.pid ? store.profile(cur.pid) : null; }
  function save() { store.save(); }
  function esc(s) { return KN.esc(s); }
  function render(html) { app.innerHTML = html; window.scrollTo(0, 0); }
  function toast(msg) {
    var old = document.getElementById('toast'); if (old) old.remove();
    var t = document.createElement('div'); t.className = 'toast'; t.id = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { if (t.parentNode) t.remove(); }, 2000);
  }
  function sheet(html, bind) {
    closeSheet();
    var s = document.createElement('div'); s.className = 'shade'; s.id = 'shade';
    s.innerHTML = '<div class="sheet" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(s);
    s.addEventListener('click', function (e) {
      if (e.target === s && s.getAttribute('data-lock') !== '1') return closeSheet();
      var t = e.target.closest && e.target.closest('[data-sa]'); if (t && sheetActs[t.getAttribute('data-sa')]) sheetActs[t.getAttribute('data-sa')](t, e);
    });
    if (bind) bind(s);
    return s;
  }
  function closeSheet() { var s = document.getElementById('shade'); if (s) s.remove(); }
  var sheetActs = {};
  function confirmSheet(title, body, okLabel, onOk, danger) {
    sheet('<h2>' + esc(title) + '</h2><p class="gap">' + body + '</p><div class="row gap2"><button class="btn soft grow" data-sa="no">취소</button><button class="btn ' + (danger ? 'danger' : 'green') + ' grow" data-sa="yes">' + esc(okLabel) + '</button></div>');
    sheetActs.no = closeSheet;
    sheetActs.yes = function () { closeSheet(); onOk(); };
  }
  function go(view, arg) {
    stopClock();
    closeSheet();
    var tt = document.getElementById('toast'); if (tt) tt.remove();   /* 화면이 바뀌면 안내 글도 지움 */
    cur.view = view;
    (views[view] || views.profiles)(arg);
  }
  function nodeLabel(n) { var u = KN.unit(n.unit); return u.name + (u.tiers > 1 ? ' ' + n.tier + '단계' : ''); }
  function top(title, back, extra) {
    return '<div class="top">' + (back ? '<button class="back" data-act="' + back + '" aria-label="뒤로">‹</button>' : '') + '<h2>' + esc(title) + '</h2>' + (extra || '') + '</div>';
  }
  function pills(p) {
    return '<span class="pill"><i class="star"></i>' + p.stars + '</span><span class="pill"><i class="coin"></i>' + p.coins + '</span>';
  }
  function pgrade(g) { return KN.gradeName(g); }
  function ageNote(p) { return KN.gradeName(p.grade); }

  /* ---------- 시간 (하루 권장 시간) ---------- */
  function startClock() {
    if (clock) return;
    clock = setInterval(function () {
      var p = P(); if (!p || document.hidden || document.getElementById('shade')) return;
      var sec = KN.engine.tick(p, 1);
      if (sec % 15 === 0) save();
      var lim = (p.limitMin || 30) * 60 + (cur.restExtra || 0);   /* '10분만 더' 를 고르면 그만큼 뒤로 미룸 */
      if (sec >= lim) restSheet(p, sec);
    }, 1000);
  }
  function stopClock() { if (clock) { clearInterval(clock); clock = null; } var p = P(); if (p) save(); }
  function restSheet(p, sec) {
    var min = Math.round(sec / 60);
    sheet('<h2>오늘 ' + min + '분 공부했어요</h2><p class="gap">눈과 몸을 잠깐 쉬게 해 주세요. 물도 한 잔 마시고, 창밖도 바라보고, 몸도 쭉 펴 봐요. 쉬고 나서 다시 만나요.</p>' +
      '<div class="row gap2"><button class="btn soft grow" data-sa="more">10분만 더</button><button class="btn green grow" data-sa="rest">쉬러 갈게요</button></div>');
    sheetActs.more = function () { cur.restExtra = sec + 600 - (p.limitMin || 30) * 60; closeSheet(); };
    sheetActs.rest = function () { cur.restExtra = 0; go('profiles'); };
  }

  /* ---------- 화면들 ---------- */
  var views = {};

  views.start = function () {
    var s = store.get();
    if (!s.pin && !s.profiles.length) return go('welcome');
    go('profiles');
  };

  views.welcome = function () {
    render('<div class="center gap2"><h1>꿈나무 배움터</h1><p class="gap">초등 1학년부터 중학교 3학년까지,<br>수학·영어·국어·성경·두뇌 게임을<br>단계별로 풀어 보는 앱이에요.</p>' +
      '<div class="card gap2" style="text-align:left"><h3>처음 한 번, 부모님이 설정해 주세요</h3><p class="sm gap">· 부모 화면에서 아이 프로필을 만들고 기록을 봐요.<br>· 이름은 별명만 써요. 사진·녹음·실명은 받지 않아요.<br>· 기록은 이 기기 안에만 저장돼요. 서버로 보내지 않아요.</p></div>' +
      '<div class="gap2"><button class="btn big" data-act="setpin">부모 비밀번호 정하기</button></div></div>');
  };
  acts.setpin = function () { pinScreen({ title: '부모 비밀번호 4자리를 정해 주세요', confirm: true, back: null, ok: function (pin) { var s = store.get(); s.pin = KN.hash(pin); save(); go('newprofile', { first: true }); } }); };

  /* PIN 입력 화면 (confirm:true 이면 두 번 입력해 맞는지 확인) */
  function pinScreen(o) {
    var val = '', first = null;
    function draw(msg, shake) {
      render((o.back ? top('', o.back) : '') + '<div class="center gap2"><h2>' + esc(first ? '한 번 더 눌러 주세요' : o.title) + '</h2>' +
        '<div class="pins' + (shake ? ' shake' : '') + '" aria-label="입력한 자릿수">' + [0, 1, 2, 3].map(function (i) { return '<i class="' + (i < val.length ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
        '<p class="sm" style="min-height:24px">' + esc(msg || '') + '</p>' +
        '<div class="keypad gap">' + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(function (k) { return k === '' ? '<span></span>' : '<button data-act="pk" data-k="' + k + '">' + k + '</button>'; }).join('') + '</div>' +
        (o.check ? '<p class="sm gap2">비밀번호를 잊으셨다면: 이 기기의 앱 데이터를 지우면 처음부터 다시 시작할 수 있어요. 기록도 함께 지워지니 평소에 부모 화면에서 백업을 해 두세요.</p>' : '') + '</div>');
    }
    acts.pk = function (t) {
      var k = t.getAttribute('data-k');
      if (k === '⌫') val = val.slice(0, -1); else if (val.length < 4) val += k;
      if (val.length < 4) return draw();
      if (o.confirm) {
        if (!first) { first = val; val = ''; return draw('같은 번호를 한 번 더 눌러요.'); }
        if (first !== val) { first = null; val = ''; return draw('두 번호가 달라요. 처음부터 다시 해 봐요.', true); }
        return o.ok(val);
      }
      if (o.check(val)) return o.ok(val);
      val = ''; draw('번호가 달라요.', true);
    };
    draw();
  }

  views.profiles = function () {
    cur.pid = null; cur.restAt = 0; cur.restExtra = 0;
    var s = store.get();
    var html = '<div class="center gap"><h1>누가 공부할까요?</h1></div>';
    if (!s.profiles.length) html += '<div class="card gap2 center"><p>아직 아이 프로필이 없어요.<br>부모 화면에서 만들어 주세요.</p></div>';
    else html += '<div class="pgrid gap2">' + s.profiles.map(function (p) {
      return '<button class="pbtn" data-act="pick" data-id="' + p.id + '">' + KN.ui.avatar(p, 'lg') + '<span>' + esc(p.name) + '</span><small>' + pgrade(p.grade) + ' · 레벨 ' + KN.rewards.level(p.xp) + '</small></button>';
    }).join('') + '</div>';
    html += '<div class="gap2 center"><button class="btn soft" data-act="parent">부모 메뉴</button></div>';
    render(html);
  };
  acts.pick = function (t) { cur.pid = t.getAttribute('data-id'); store.get().last = cur.pid; go('home'); };
  acts.parent = function () { pinScreen({ title: '부모 비밀번호를 눌러 주세요', back: 'toprofiles', check: function (v) { return KN.hash(v) === store.get().pin; }, ok: function () { go('parent'); } }); };
  acts.toprofiles = function () { go('profiles'); };

  views.home = function () {
    var p = P(); if (!p) return go('profiles');
    var pr = KN.rewards.progress(p.xp), due = KN.engine.dueWrong(p).length;
    var h = '<div class="top"><button class="back" data-act="toprofiles" aria-label="프로필 바꾸기">‹</button><div class="grow"></div>' + pills(p) + '</div>';
    h += '<div class="row" style="gap:14px">' + KN.ui.avatar(p, 'lg') + '<div class="grow"><h1>' + esc(p.name) + '</h1><div class="sm">' + pgrade(p.grade) + ' · 레벨 ' + pr.lv + '</div><div class="lvbar gap"><span style="width:' + Math.round(100 * pr.cur / pr.need) + '%"></span></div><div class="sm">다음 레벨까지 ' + (pr.need - pr.cur) + '</div></div></div>';
    h += '<div class="bubble">' + esc(KN.say(p.char, 'hi', p.name, new Date().getDate() + p.rounds.length)) + '</div>';
    var streak = p.streak && p.streak.last === KN.today() ? p.streak.n : (p.streak && p.streak.last && KN.dayDiff(p.streak.last, KN.today()) === 1 ? p.streak.n : 0);
    if (store.saveFailed) h += '<div class="banner same gap">이 브라우저에서는 기록을 저장할 수 없어요. (사생활 보호 모드이거나 저장 공간이 가득 찼을 수 있어요) 부모 화면에서 백업 파일을 자주 저장해 주세요.</div>';
    h += '<div class="row gap wrap"><span class="chip warm">' + (streak ? streak + '일째 공부 중' : '오늘 첫 공부를 시작해 봐요') + '</span><span class="chip">오늘 ' + Math.floor(((p.today && p.today.d === KN.today()) ? p.today.sec : 0) / 60) + '분 / 권장 ' + (p.limitMin || 30) + '분</span></div>';
    h += '<div class="sgrid gap2">' + KN.subjects.map(function (s, i) {
      var L = KN.ladder(s.id); if (!L.length) return '';
      var n = KN.engine.node(p, s.id), u = KN.unit(n.unit);
      return '<button class="sbtn' + (i === 4 ? ' wide' : '') + '" style="background:' + s.color + ';--c:' + s.dark + '" data-act="subj" data-s="' + s.id + '"><span class="g">' + s.glyph + '</span><div><b>' + s.name + '</b><br><span>' + esc(u.name) + (u.tiers > 1 ? ' ' + n.tier + '단계' : '') + '</span></div></button>';
    }).join('') + '</div>';
    h += '<div class="row gap2 wrap"><button class="btn soft grow" data-act="review">다시 보기 (' + p.wrong.length + (due ? ', 오늘 ' + due : '') + ')</button><button class="btn soft grow" data-act="closet">꾸미기</button><button class="btn soft grow" data-act="badges">배지 ' + p.badges.length + '</button></div>';
    render(h);
  };
  acts.subj = function (t) { go('subject', t.getAttribute('data-s')); };

  views.subject = function (sid) {
    var p = P(), s = KN.subject(sid), L = KN.ladder(sid), pos = KN.engine.pos(p, sid), here = L[pos];
    cur.subj = sid;
    var h = top(s.name, 'tohome', pills(p));
    h += '<div class="card" style="--c:' + s.dark + '"><div class="sm">지금 단계</div><h2>' + esc(nodeLabel(here)) + '</h2><div class="sm">' + KN.gradeRange(KN.unit(here.unit)) + '</div><div class="gap"><button class="btn big" style="background:' + s.dark + '" data-act="play" data-i="' + pos + '">이어서 하기</button></div></div>';
    h += sid === 'brain' ? '<p class="sm gap">게임을 연습하면 그 게임이 점점 쉬워질 수 있어요. 85% 이상이면 다음 단계, 40% 이하면 한 단계 쉬운 곳으로 가요. 아무 게임이나 골라서 해도 좋아요.</p>' : '<p class="sm gap">한 판은 10문제예요. 85% 이상 맞히면 다음 단계, 40% 이하면 한 단계 쉬운 곳으로 가요. 아래에서 아무 단원이나 골라 앞 학년 복습이나 다음 학년 도전을 해도 좋아요.</p>';
    var lastG = null;
    var seen = {};
    L.forEach(function (n) {
      var u = KN.unit(n.unit);
      if (!seen[u.id]) {
        seen[u.id] = 1;
        var g = KN.gradeRange(u);
        if (g !== lastG) { h += '<div class="gh">' + g + '</div>'; lastG = g; }
        h += '<div class="unit' + (here.unit === u.id ? ' here' : '') + '" style="--c:' + s.dark + '"><div class="row between"><div class="t">' + esc(u.name) + '</div>' + (u.domain ? '<span class="chip">' + esc(u.domain) + '</span>' : '') + '</div><div class="d">' + esc(u.desc || '') + '</div><div class="tiers">';
        for (var t = 1; t <= u.tiers; t++) {
          var node = L.filter(function (x) { return x.unit === u.id && x.tier === t; })[0], st = p.nodes[KN.nodeKey(node)];
          h += '<button class="tier' + (here.i === node.i ? ' cur' : '') + '" data-act="play" data-i="' + node.i + '">' + (u.tiers > 1 ? t + '단계 ' : '시작 ') + KN.ui.smallStars(st ? st.stars : 0) + '</button>';
        }
        h += '</div></div>';
      }
    });
    render(h);
  };
  acts.tohome = function () { go('home'); };
  acts.play = function (t) {
    var p = P(), L = KN.ladder(cur.subj), node = L[+t.getAttribute('data-i')];
    var round = KN.engine.build(p, node, KN.seed());
    startRound(round);
  };
  acts.review = function () { go('review'); };
  views.review = function () {
    var p = P(), t = KN.today(), due = KN.engine.dueWrong(p).length;
    var h = top('다시 보기', 'tohome', pills(p));
    if (!p.wrong.length) { render(h + '<div class="card center gap"><p>다시 볼 문제가 아직 없어요.<br>틀린 문제가 생기면 여기에 모여요. 1일, 3일, 7일 뒤에 다시 나오고, 세 번 맞히면 목록에서 졸업해요.</p></div>'); return; }
    h += '<div class="card"><b>틀렸던 문제 ' + p.wrong.length + '개</b><div class="sm">오늘 다시 볼 차례: ' + due + '개 · 틀린 문제는 1일, 3일, 7일 간격으로 다시 나와요.</div><div class="gap"><button class="btn big green" data-act="startreview">지금 복습하기 (최대 10문제)</button></div></div>';
    var list = p.wrong.slice().sort(function (a, b) { return a.due < b.due ? -1 : a.due > b.due ? 1 : 0; });
    h += list.slice(0, 40).map(function (w) {
      var sub = KN.subject(w.subj), u = KN.unit(w.unit), q = w.q;
      var when = w.due <= t ? '오늘 복습' : (KN.dayDiff(t, w.due) + '일 뒤');
      return '<details class="wl"><summary>' + KN.rich(String(q.prompt).split('\n').slice(-1)[0].slice(0, 70)) + '<div class="meta">' + esc(sub ? sub.name : '') + ' · ' + esc(u ? u.name : '') + ' · ' + when + ' · 상자 ' + w.box + '/3</div></summary><div class="ans"><b>정답: ' + KN.showAns(q.answer) + '</b>' + (q.explain ? '<div class="sm">' + KN.rich(q.explain) + '</div>' : '') + '</div></details>';
    }).join('');
    render(h);
  };
  acts.startreview = function () { var p = P(); startRound(KN.engine.buildReview(p, KN.seed())); };

  /* ---------- 한 판 ---------- */
  function startRound(round) {
    cur.round = round; cur.idx = 0; cur.results = []; cur.view = 'round'; closeSheet();
    var tt = document.getElementById('toast'); if (tt) tt.remove();
    startClock();
    showQ();
  }
  function dotsHtml() {
    var r = cur.round, h = '<div class="dots" aria-label="진행">';
    for (var i = 0; i < r.items.length; i++) h += '<i class="' + (i < cur.results.length ? (cur.results[i].score >= 0.85 ? 'ok' : 'no') : (i === cur.idx ? 'now' : '')) + '"></i>';
    return h + '</div>';
  }
  /* 성경 본문 출처 표기(판에 따라 자동으로 바뀜 — bible-verses.js 의 KN.bibleCredit) */
  function creditHtml(sid) {
    return sid === 'bible' && KN.bibleCredit && KN.hasBibleText() ? '<div class="credit">' + esc(KN.bibleCredit) + '</div>' : '';
  }
  function showQ() {
    var p = P(), r = cur.round, it = r.items[cur.idx], q = it.q;
    var sid = q.subj || r.unit.subj, sub = KN.subject(sid) || KN.subject('math');
    var tag = r.node ? nodeLabel(r.node) : '다시 보기';
    if (it.review === 'mix') tag += ' · 앞 단계 복습';
    else if (it.review) tag += ' · 틀렸던 문제';
    var hearBtn = '';
    if (q.say && KN.canSpeak()) hearBtn = '<button class="btn small blue hear" data-act="hear">' + (q.sayLabel || '소리 듣기') + '</button>';
    else if (p.voice && KN.canSpeak() && !q.say && ['choice', 'num', 'order'].indexOf(q.kind) >= 0) hearBtn = '<button class="btn small soft hear" data-act="hear">문제 읽어 주기</button>';
    render('<div class="qtop"><button class="back" data-act="quit" aria-label="그만하기">×</button>' + dotsHtml() + '<span class="sm">' + (cur.idx + 1) + '/' + r.items.length + '</span></div>' +
      '<div class="qcard" style="--c:' + sub.dark + '"><div class="tag">' + esc(tag) + '</div><div class="prompt" id="prompt">' + KN.rich(q.prompt) + '</div>' + KN.ui.visual(q.visual) + hearBtn + '</div>' + creditHtml(sid) +
      '<div id="ansWrap"></div><div id="fb"></div>');
    var host = document.createElement('div'); host.id = 'ans';
    document.getElementById('ansWrap').appendChild(host);
    var fn = KN.qui[q.kind];
    if (!fn) { host.textContent = '이 문제 형식을 아직 지원하지 않아요: ' + q.kind; return; }
    fn(host, q, { grade: p.grade, color: sub.dark, subj: sid, profile: p }, function (res) { answered(q, res); });
  }
  acts.hear = function () {
    var q = cur.round.items[cur.idx].q;
    if (q.say) KN.speak(q.say.text, q.say.lang || 'en-US'); else KN.speak(KN.speakable(q), 'ko-KR');
  };
  acts.quit = function () {
    confirmSheet('그만할까요?', '지금까지 푼 내용은 기록되지 않아요.', '그만하기', function () { go(cur.round && cur.round.node ? 'subject' : 'home', cur.round && cur.round.node ? cur.round.node.subj : undefined); }, true);
  };
  function answered(q, res) {
    cur.results.push(res);
    var ok = res.score >= 0.999;
    var fb = document.getElementById('fb'), last = cur.idx === cur.round.items.length - 1;
    var run = 0; for (var i = cur.results.length - 1; i >= 0 && cur.results[i].score >= 0.999; i--) run++;
    var praise;
    if (ok) praise = (run >= 3 && run % 3 === 0) ? pick(KN.rewards.praiseStreak, cur.idx) : pick(KN.rewards.praiseRight, cur.idx);
    else praise = pick(KN.rewards.praiseWrong, cur.idx);
    var body = ok ? '<b>맞았어요!</b>' + esc(praise) + (q.explain ? '<div class="qexplain">' + KN.rich(q.explain) + '</div>' : '')
      : '<b>아쉬워요. 정답은 ' + (q.kind === 'num' || q.kind === 'choice' || q.kind === 'order' ? KN.showAns(q.answer) : esc(q.answerText || '')) + '</b>' + esc(praise) + (q.explain ? '<div class="qexplain">' + KN.rich(q.explain) + '</div>' : '');
    var good = ok;
    if (res.title) { good = res.score >= 0.6; body = '<b>' + esc(res.title) + '</b>' + (res.text ? esc(res.text) : ''); }
    fb.innerHTML = '<div class="fb ' + (good ? 'ok' : 'no') + '" role="status">' + body + '</div><div class="gap"><button class="btn big" data-act="next">' + (last ? '결과 보기' : '다음 문제') + '</button></div>';
    var dots = document.querySelector('.dots'); if (dots) dots.outerHTML = dotsHtml();
    if (fb.scrollIntoView) fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function pick(arr, i) { return arr[(i * 7 + cur.results.length) % arr.length]; }
  acts.next = function () {
    if (cur.idx < cur.round.items.length - 1) { cur.idx++; showQ(); return; }
    var p = P(), sum = KN.engine.finish(p, cur.round, cur.results);
    save(); go('result', sum);
  };

  views.result = function (sum) {
    var p = P(), r = cur.round, node = r.node, h = '';
    var pct = Math.round(sum.rate * 100);
    h += '<div class="center gap"><h1>' + (r.node ? '한 판 끝!' : '다시 보기 끝!') + '</h1><div class="bigstars">' + [1, 2, 3].map(function (i) { return KN.ui.star(i <= sum.stars); }).join('') + '</div>' +
      '<h2>' + Math.round(sum.score) + ' / ' + sum.total + ' 맞혔어요 (' + pct + '%)</h2><p class="gap">' + esc(KN.rewards.praiseEnd(sum.rate)) + '</p><div class="row gap" style="justify-content:center">' + KN.ui.avatar(p, 'sm') + '<div class="bubble" style="margin:0;text-align:left">' + esc(KN.say(p.char, sum.rate >= 0.6 ? 'great' : 'retry', p.name, p.rounds.length)) + '</div></div></div>';
    h += '<div class="stat3"><div><b>+' + sum.coins + '</b><span>코인</span></div><div><b>+' + sum.xp + '</b><span>경험치</span></div><div><b>' + sum.streak + '일</b><span>연속 공부</span></div></div>';
    if (node) {
      var L = KN.ladder(node.subj);
      if (sum.moved > 0) h += '<div class="banner up">다음 단계로 올라갔어요! → ' + esc(nodeLabel(L[sum.newPos])) + '</div>';
      else if (sum.moved < 0) h += '<div class="banner down">한 단계 쉬운 곳에서 다져 봐요 → ' + esc(nodeLabel(L[sum.newPos])) + '</div>';
      else h += '<div class="banner same">이 단계에서 한 번 더 연습하면 다음 단계가 열려요. (85% 이상 맞히면 올라가요)</div>';
    }
    if (sum.graduated) h += '<div class="banner up">다시 맞힌 문제가 ' + sum.graduated + '개 있어요. 틀렸던 문제를 이겨냈어요!</div>';
    if (sum.levelUp) h += '<div class="banner lv">캐릭터가 레벨 ' + sum.levelUp + ' 이 되었어요! 꾸미기 상점을 확인해 보세요.</div>';
    sum.newBadges.forEach(function (b) { h += '<div class="badge"><div class="bm">★</div><div><b>새 배지: ' + esc(b.name) + '</b><div class="sm">' + esc(b.desc) + '</div></div></div>'; });
    var wrongN = cur.results.filter(function (x, i) { return x.score < 0.999 && !r.items[i].q.noReview; }).length;
    if (wrongN) h += '<p class="sm gap">틀린 문제 ' + wrongN + '개는 내일부터 1일, 3일, 7일 간격으로 다시 나와요.</p>';
    h += '<div class="gap2"><button class="btn big" data-act="again">' + (node ? '한 판 더' : '홈으로') + '</button></div><div class="row gap"><button class="btn soft grow" data-act="' + (node ? 'tosubj' : 'tohome') + '">' + (node ? '단원 보기' : '홈') + '</button>' + (node ? '<button class="btn soft grow" data-act="tohome">홈으로</button>' : '') + '</div>';
    render(h);
  };
  acts.again = function () {
    var p = P(), r = cur.round;
    if (!r.node) return go('home');
    var node = KN.engine.node(p, r.node.subj);
    startRound(KN.engine.build(p, node, KN.seed()));
  };
  acts.tosubj = function () { go('subject', cur.round.node.subj); };

  /* ---------- 꾸미기 · 배지 ---------- */
  views.closet = function () {
    var p = P(), R = KN.rewards, lv = R.level(p.xp);
    var h = top('꾸미기', 'tohome', pills(p)) + '<div class="center gap2">' + KN.ui.avatar(p, 'lg') + '<p class="sm gap">레벨 ' + lv + ' · 코인으로 꾸미기를 살 수 있어요.</p></div>';
    function items(list, kind) {
      return '<div class="shop">' + (kind === 'hat' ? '<button class="item' + (!p.deco.hat ? ' on' : '') + '" data-act="equip" data-k="hat" data-id=""><span class="sm">없음</span></button>' : '') + list.map(function (d) {
        var own = p.owned.indexOf(d.id) >= 0, on = (kind === 'bg' ? p.deco.bg : p.deco.hat) === d.id, locked = !own && lv < d.lv;
        var vis = kind === 'bg' ? '<span class="sw" style="background:' + d.css + '"></span>' : '<span class="hs">' + KN.ui.hatSvg(d.id).replace('class="hat"', 'width="46" height="30"') + '</span>';
        return '<button class="item' + (on ? ' on' : '') + (locked ? ' lock' : '') + '" data-act="equip" data-k="' + kind + '" data-id="' + d.id + '">' + vis + '<span>' + esc(d.name) + '</span><span class="sm">' + (own ? (on ? '쓰는 중' : '가짐') : (locked ? 'Lv ' + d.lv : d.price + ' 코인')) + '</span></button>';
      }).join('') + '</div>';
    }
    h += '<h3 class="gap2">배경</h3><div class="gap">' + items(R.decor.bg, 'bg') + '</div><h3 class="gap2">모자·장식</h3><div class="gap">' + items(R.decor.hat, 'hat') + '</div>';
    render(h);
  };
  acts.closet = function () { go('closet'); };
  acts.equip = function (t) {
    var p = P(), k = t.getAttribute('data-k'), id = t.getAttribute('data-id');
    if (k === 'hat' && id === '') { p.deco.hat = null; save(); return go('closet'); }
    if (p.owned.indexOf(id) < 0) {
      var why = KN.rewards.canBuy(p, id); if (why) return toast(why);
      var d = KN.rewards.findDecor(id);
      if (d.price === 0) { p.owned.push(id); p.deco[k] = id; save(); return go('closet'); }   /* 값이 없는 꾸미기는 바로 쓴다 */
      return confirmSheet(d.name + ' 살까요?', '코인 ' + d.price + '개를 써요.', '살래요', function () { KN.rewards.buy(p, id); p.deco[k] = id; save(); go('closet'); });
    }
    p.deco[k] = (k === 'hat' && p.deco.hat === id) ? null : id; save(); go('closet');
  };
  views.badges = function () {
    var p = P();
    render(top('배지', 'tohome', '<span class="pill">' + p.badges.length + ' / ' + KN.rewards.badges.length + '</span>') + KN.rewards.badges.map(function (b) {
      var on = p.badges.indexOf(b.id) >= 0;
      return '<div class="badge' + (on ? '' : ' off') + '"><div class="bm">' + (on ? '★' : '?') + '</div><div><b>' + esc(b.name) + '</b><div class="sm">' + esc(b.desc) + '</div></div></div>';
    }).join(''));
  };
  acts.badges = function () { go('badges'); };

  /* ---------- 부모 화면 ---------- */
  views.parent = function () {
    var s = store.get();
    var h = top('부모 화면', 'toprofiles');
    h += s.profiles.map(function (p) {
      return '<div class="card"><div class="row">' + KN.ui.avatar(p, 'sm') + '<div class="grow"><b>' + esc(p.name) + '</b><div class="sm">' + pgrade(p.grade) + ' · 레벨 ' + KN.rewards.level(p.xp) + ' · 하루 ' + (p.limitMin || 30) + '분</div></div></div>' +
        '<div class="row gap wrap"><button class="btn small soft grow" data-act="record" data-id="' + p.id + '">기록 보기</button><button class="btn small soft grow" data-act="pset" data-id="' + p.id + '">설정</button></div></div>';
    }).join('') || '<div class="card center">프로필이 없어요.</div>';
    h += '<div class="gap"><button class="btn big green" data-act="addprofile">프로필 추가</button></div>';
    h += '<h3 class="gap2">백업과 복원</h3><p class="sm">기록은 이 기기에만 있어요. 기기를 바꾸거나 앱 데이터를 지우기 전에 내보내기로 파일을 저장해 두세요.</p>' +
      '<div class="row gap"><button class="btn soft grow" data-act="export">내보내기</button><button class="btn soft grow" data-act="import">가져오기</button></div>';
    h += '<h3 class="gap2">비밀번호</h3><div class="gap"><button class="btn soft" data-act="changepin">비밀번호 바꾸기</button></div>';
    h += '<h3 class="gap2">안내</h3><div class="card sm">· 아이 실명·사진·음성은 받지 않아요. 별명만 써요.<br>' + (KN.bibleCredit && KN.hasBibleText() ? '· ' + esc(KN.bibleCredit) + '. 본문은 바꾸거나 자르지 않고 그대로 실었어요.<br>' : '') + '· 서버·광고·결제·로그인이 없고, 기록은 이 기기 안에만 저장돼요.<br>· 문제는 학습 연습용이에요. 성적이나 능력의 변화를 약속하지 않아요.<br>· 두뇌 게임은 연습하면 그 게임이 쉬워질 수 있어요.</div>';
    render(h);
  };
  acts.addprofile = function () { go('newprofile', {}); };
  acts.changepin = function () { pinScreen({ title: '새 비밀번호 4자리', confirm: true, back: 'toparent', ok: function (pin) { store.get().pin = KN.hash(pin); save(); go('parent'); toast('비밀번호를 바꿨어요.'); } }); };
  acts.toparent = function () { go('parent'); };

  views.newprofile = function (o) {
    o = o || {};
    var st = { name: '', grade: 0, ch: '' };
    function draw() {
      var h = (o.first ? '<div class="center gap"><h1>아이 프로필 만들기</h1></div>' : top('프로필 추가', 'toparent'));
      h += '<label class="f" for="nm">별명 (실명 대신, 8글자까지)</label><input class="t" id="nm" maxlength="8" autocomplete="off" value="' + esc(st.name) + '" placeholder="예: 하늘이">';
      h += '<label class="f">학년</label><div class="chips">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (g) { return '<button class="gchip' + (st.grade === g ? ' on' : '') + '" data-act="ng" data-g="' + g + '">' + pgrade(g) + '</button>'; }).join('') + '</div>';
      h += '<label class="f">캐릭터 고르기</label><div class="cgrid">' + KN.chars.map(function (c) { return '<button class="cpick' + (st.ch === c.id ? ' on' : '') + '" data-act="nc" data-c="' + c.id + '">' + KN.ui.avatar({ char: c.id, deco: { bg: 'bg-pink' } }) + '<span>' + esc(c.name) + '</span></button>'; }).join('') + '</div>';
      h += '<div class="gap2"><button class="btn big green" data-act="mk">만들기</button></div>';
      render(h);
      var inp = document.getElementById('nm'); inp.addEventListener('input', function () { st.name = inp.value; });
    }
    acts.ng = function (t) { st.grade = +t.getAttribute('data-g'); st.name = document.getElementById('nm').value; draw(); };
    acts.nc = function (t) { st.ch = t.getAttribute('data-c'); st.name = document.getElementById('nm').value; draw(); };
    acts.mk = function () {
      st.name = document.getElementById('nm').value.trim();
      if (!st.name) return toast('별명을 써 주세요.');
      if (!st.grade) return toast('학년을 골라 주세요.');
      if (!st.ch) return toast('캐릭터를 골라 주세요.');
      var p = KN.newProfile(st.name, st.grade, st.ch); store.add(p);
      if (o.first) { cur.pid = p.id; store.get().last = p.id; go('home'); } else go('parent');
      toast(st.name + ' 프로필을 만들었어요.');
    };
    draw();
  };

  acts.pset = function (t) {
    var p = store.profile(t.getAttribute('data-id'));
    function draw() {
      sheet('<h2>' + esc(p.name) + ' 설정</h2>' +
        '<label class="f">하루 권장 시간</label><div class="row"><button class="btn soft small" data-sa="lm">−5</button><b class="grow center" id="lim">' + p.limitMin + '분</b><button class="btn soft small" data-sa="lp">+5</button></div><p class="sm">기준: 초1-2 20분 · 초3-4 30분 · 초5-6 40분 · 중학생 50분. 시간이 지나면 쉬자는 안내가 떠요.</p>' +
        '<label class="f">문제 읽어 주기</label><button class="btn soft" data-sa="vo">' + (p.voice ? '켜짐 (누르면 끄기)' : '꺼짐 (누르면 켜기)') + '</button>' +
        '<label class="f">학년</label><div class="chips">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (g) { return '<button class="gchip' + (p.grade === g ? ' on' : '') + '" data-sa="gr" data-g="' + g + '">' + pgrade(g) + '</button>'; }).join('') + '</div>' +
        '<div class="row gap2"><button class="btn danger grow" data-sa="del">프로필 지우기</button><button class="btn soft grow" data-sa="x">닫기</button></div>');
    }
    sheetActs.lm = function () { p.limitMin = Math.max(10, p.limitMin - 5); save(); draw(); };
    sheetActs.lp = function () { p.limitMin = Math.min(120, p.limitMin + 5); save(); draw(); };
    sheetActs.vo = function () { p.voice = !p.voice; save(); draw(); };
    sheetActs.gr = function (b) { p.grade = +b.getAttribute('data-g'); p.pos = {}; save(); draw(); };
    sheetActs.x = function () { closeSheet(); go('parent'); };
    sheetActs.del = function () {
      confirmSheet(p.name + ' 프로필을 지울까요?', '공부 기록, 별, 코인, 꾸미기가 모두 사라지고 되돌릴 수 없어요. 먼저 백업을 해 두면 좋아요.', '지우기', function () { store.remove(p.id); go('parent'); toast('지웠어요.'); }, true);
    };
    draw();
  };

  acts.record = function (t) { go('record', t.getAttribute('data-id')); };
  views.record = function (id) {
    var p = store.profile(id);
    var h = top(p.name + ' 기록', 'toparent');
    h += '<div class="card"><table class="rec"><tr><th>과목</th><th>지금 단계</th><th>판</th><th>최근 5판</th></tr>' + KN.subjects.map(function (s) {
      var L = KN.ladder(s.id); if (!L.length) return '';
      var pos = p.pos[s.id] == null ? KN.startIndex(s.id, p.grade) : p.pos[s.id], n = L[Math.min(pos, L.length - 1)];
      var rs = p.rounds.filter(function (r) { return r.subj === s.id; }), l5 = rs.slice(-5);
      var avg = l5.length ? Math.round(100 * l5.reduce(function (a, r) { return a + r.rate; }, 0) / l5.length) + '%' : '-';
      return '<tr><td>' + s.name + '</td><td>' + esc(nodeLabel(n)) + '</td><td>' + rs.length + '</td><td>' + avg + '</td></tr>';
    }).join('') + '</table></div>';
    h += '<div class="card"><b>요약</b><div class="sm">레벨 ' + KN.rewards.level(p.xp) + ' · 별 ' + p.stars + ' · 코인 ' + p.coins + ' · 배지 ' + p.badges.length + '개<br>다시 보기 목록 ' + p.wrong.length + '개 (이겨낸 문제 ' + (p.graduated || 0) + '개)<br>오늘 공부 ' + Math.floor(((p.today && p.today.d === KN.today()) ? p.today.sec : 0) / 60) + '분</div></div>';
    h += '<h3 class="gap2">최근 기록</h3><div class="card"><table class="rec">' + p.rounds.slice(-10).reverse().map(function (r) {
      var u = KN.unit(r.unit);
      return '<tr><td>' + esc(r.d.slice(5)) + '</td><td>' + esc(u ? u.name : '다시 보기') + (u && u.tiers > 1 ? ' ' + r.tier + '단계' : '') + '</td><td>' + Math.round(r.rate * 100) + '%</td></tr>';
    }).join('') + (p.rounds.length ? '' : '<tr><td>아직 기록이 없어요.</td></tr>') + '</table></div>';
    render(h);
  };

  acts.export = function () {
    var text = store.exportJSON(), name = 'kkumnamu-backup-' + KN.today() + '.json';
    sheet('<h2>내보내기</h2><p class="sm gap">아래 버튼으로 파일을 저장하세요. 저장이 안 되면 글자를 복사해 두어도 돼요.</p><textarea class="t gap" id="bk" readonly>' + esc(text) + '</textarea><div class="row gap2"><button class="btn green grow" data-sa="dl">파일로 저장</button><button class="btn soft grow" data-sa="x">닫기</button></div>');
    sheetActs.x = closeSheet;
    sheetActs.dl = function () {
      try {
        var blob = new Blob([text], { type: 'application/json' }), url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
        toast('저장했어요: ' + name);
      } catch (e) { toast('저장하지 못했어요. 글자를 복사해 두세요.'); }
    };
  };
  acts.import = function () {
    sheet('<h2>가져오기</h2><p class="sm gap">저장해 둔 파일을 고르거나 글자를 붙여 넣어요. 지금 있는 기록은 가져온 내용으로 바뀌어요.</p><input type="file" id="bf" accept=".json,application/json" class="gap"><textarea class="t gap" id="bt" placeholder="여기에 붙여 넣기"></textarea><div class="row gap2"><button class="btn danger grow" data-sa="go">가져오기</button><button class="btn soft grow" data-sa="x">닫기</button></div>');
    sheetActs.x = closeSheet;
    var fileText = '';
    document.getElementById('bf').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var rd = new FileReader(); rd.onload = function () { fileText = String(rd.result); document.getElementById('bt').value = fileText; }; rd.readAsText(f);
    });
    sheetActs.go = function () {
      var text = document.getElementById('bt').value || fileText;
      try { var n = store.importJSON(text); closeSheet(); go('parent'); toast('프로필 ' + n + '개를 가져왔어요.'); }
      catch (e) { toast('가져오지 못했어요: ' + (e.message || '파일 형식이 달라요')); }
    };
  };

  /* ---------- 시작 ---------- */
  app.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-act]'); if (!t || !app.contains(t)) return;
    var a = t.getAttribute('data-act'); if (acts[a]) acts[a](t, e);
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) { var p = P(); if (p) save(); } });
  window.addEventListener('pagehide', function () { var p = P(); if (p) save(); });
  KN.app = { go: go, cur: cur, acts: acts, views: views, startRound: startRound };

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(function () { /* 오프라인 캐시가 없어도 앱은 동작해요 */ });
  }
  store.load();
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {}); } catch (e) { /* 지원하지 않는 브라우저 */ }
  go('start');
})();
