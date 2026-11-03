/* 딩동 음악실 화면 부품: Web Audio 합성음(외부 음원 파일 없음, 마이크 없음)과 건반 놀이 4가지.
   - 자유 연주 · 따라 쳐 봐요(듣고 따라 치기) · 내 노래 만들기(음 이름·박자만 저장) · 선율 따라 치기(전래·고전 선율) */
(function (g) {
  var KN = g.KN = g.KN || {};
  var ac = null;

  function ctx() {
    if (ac) { if (ac.state === 'suspended' && ac.resume) ac.resume(); return ac; }
    var C = g.AudioContext || g.webkitAudioContext;
    if (!C) return null;
    try { ac = new C(); } catch (e) { ac = null; }
    return ac;
  }
  /* 폰에서는 손가락 pointerdown 이 '사용자 동작'으로 인정되지 않아 소리가 잠긴 채 남는다.
     손을 뗄 때(pointerup·touchend)·click·keydown 마다 소리를 깨우고, 아이폰은 빈 소리를 한 번 틀어 잠금을 푼다. */
  function unlock() {
    var c = ctx(); if (!c) return;
    if (c.state !== 'running' && c.resume) c.resume();
    try { var s = c.createBufferSource(); s.buffer = c.createBuffer(1, 1, 22050); s.connect(c.destination); s.start(0); } catch (e) { }
  }
  if (g.document) {
    /* 아이폰 무음 스위치가 켜져 있어도 소리가 나게(사파리 16.4+) */
    try { if (g.navigator && g.navigator.audioSession) g.navigator.audioSession.type = 'playback'; } catch (e) { }
    ['pointerup', 'touchend', 'click', 'keydown'].forEach(function (ev) { g.document.addEventListener(ev, unlock, { capture: true, passive: true }); });
  }
  /* 악기: [배음 배수, 파형, 크기] 와 사라지는 시간(초) */
  var VOICE = {
    piano: { parts: [[1, 'triangle', 1], [2, 'sine', 0.25], [3, 'sine', 0.08]], dec: 1.3, att: 0.006 },
    xylo: { parts: [[1, 'sine', 1], [4, 'sine', 0.18]], dec: 0.38, att: 0.002 },
    bell: { parts: [[1, 'sine', 1], [2.76, 'sine', 0.35], [5.4, 'sine', 0.12]], dec: 2.0, att: 0.002 }
  };
  function play(c, note, ins) {
    try {
      var v = VOICE[ins] || VOICE.piano, t0 = c.currentTime, out = c.createGain();
      out.gain.value = 0.22; out.connect(c.destination);
      v.parts.forEach(function (p) {
        var o = c.createOscillator(), gn = c.createGain();
        o.type = p[1]; o.frequency.value = note.f * p[0];
        gn.gain.setValueAtTime(0.0001, t0); gn.gain.exponentialRampToValueAtTime(p[2], t0 + v.att); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + v.dec);
        o.connect(gn); gn.connect(out); o.start(t0); o.stop(t0 + v.dec + 0.05);
      });
      return true;
    } catch (e) { return false; }
  }

  var A = KN.audio = {
    count: 0, last: null,      /* 소리 함수를 부른 횟수와 마지막 음 (검사용) */
    supported: function () { return !!(g.AudioContext || g.webkitAudioContext); },
    tone: function (i, ins) {
      A.count++; A.last = { n: i, ins: ins };
      var note = KN.music.NOTES[i]; if (!note) return false;
      var c = ctx(); if (!c) return false;
      /* 아직 잠겨 있으면 깨어난 뒤에 친다(첫 터치는 손을 뗄 때 소리가 남) */
      if (c.state !== 'running' && c.resume) {
        var pr = null; try { pr = c.resume(); } catch (e) { }
        if (pr && pr.then) { pr.then(function () { play(c, note, ins); }, function () { }); return true; }
      }
      return play(c, note, ins);
    },
    /* seq = [[음, 앞 음과의 간격 ms]] 를 차례로 들려 준다. 돌려주는 stop() 으로 멈춘다 */
    playSeq: function (seq, ins, onStep, onEnd) {
      var t = 0, timers = [];
      seq.forEach(function (e, i) {
        t += e[1];
        timers.push(setTimeout(function () { A.tone(e[0], ins); if (onStep) onStep(i, e[0]); }, t));
      });
      timers.push(setTimeout(function () { if (onEnd) onEnd(); }, t + 450));
      return { stop: function () { timers.forEach(clearTimeout); } };
    }
  };

  function alive(host) { return host.isConnected !== false && document.body.contains(host); }

  /* o: {mode, grade, ins, melody}   hooks: {act(), saveSong(name, ins, seq) → '' | 'full', toast(msg), songsLeft()} */
  function mount(host, o, hooks) {
    var M = KN.music, ins = o.ins || 'piano', mode = o.mode, player = null, timers = [];
    var st = { mode: mode, phase: 'idle', pat: [], lvl: 2, pos: 0, ins: ins };
    KN.musicUI.cur = st;
    var presses = 0, counted = false;

    host.innerHTML = '<div class="insrow" id="insrow"></div><div class="sm center" id="mhead"></div><div class="mmsg" id="mmsg" role="status"></div><div class="mctrl" id="mctrl"></div>' +
      '<div class="keys" id="keys">' + M.NOTES.map(function (n, i) { return '<button class="key" data-n="' + i + '" style="background:' + n.color + '" aria-label="' + KN.esc(n.n) + '"><span>' + KN.esc(n.n) + '</span></button>'; }).join('') + '</div>' +
      (A.supported() ? '' : '<p class="sm gap">이 기기에서는 소리를 낼 수 없어요. 건반 불빛만 보여요.</p>') + '<div id="mextra"></div>';
    var $ = function (id) { return host.querySelector('#' + id); };
    var keys = $('keys'), msg = $('mmsg'), ctrl = $('mctrl');
    function say(t) { msg.textContent = t; }
    function lit(n, on) { var k = keys.querySelector('.key[data-n="' + n + '"]'); if (k) k.classList.toggle('on', on); }
    function flash(n, ms) { lit(n, true); timers.push(setTimeout(function () { lit(n, false); }, ms || 220)); }
    function lock(on) { keys.classList.toggle('lock', on); }
    function stopAll() { if (player) player.stop(); player = null; timers.forEach(clearTimeout); timers = []; for (var i = 0; i < 8; i++) lit(i, false); }
    function count() { if (!counted) { counted = true; hooks.act(); } }
    function insRow() {
      $('insrow').innerHTML = M.INS.map(function (x) { return '<button class="chipb' + (x.id === ins ? ' on' : '') + '" data-ins="' + x.id + '">' + KN.esc(x.name) + '</button>'; }).join('');
    }
    function btn(label, act, cls) { return '<button class="btn ' + (cls || 'soft') + ' small grow" data-m="' + act + '">' + label + '</button>'; }

    /* ----- 따라 쳐 봐요 ----- */
    var max = M.maxLen(o.grade || 3), pool = M.poolSize(o.grade || 3), cleared = 0;
    function echoStart() { stopAll(); st.lvl = 2; cleared = 0; counted = false; echoNext(); }
    function echoNext() {
      st.pat = M.pattern(KN.rng(KN.seed()), st.lvl, pool); st.phase = 'listen'; st.pos = 0;
      $('mhead').textContent = '음 ' + st.lvl + '개 (모두 ' + max + '개까지)';
      say('잘 들어 보세요…'); lock(true); ctrl.innerHTML = '';
      echoPlay(function () { st.phase = 'input'; lock(false); say('이제 똑같이 쳐 보세요. (0/' + st.lvl + ')'); ctrl.innerHTML = btn('다시 듣기', 'echoagain'); });
    }
    function echoPlay(done) {
      player = A.playSeq(st.pat.map(function (n, i) { return [n, i ? 620 : 350]; }), ins, function (i, n) { flash(n, 380); }, function () { if (alive(host)) done(); });
    }
    function echoPress(n) {
      if (st.phase !== 'input') return;
      if (n !== st.pat[st.pos]) {
        st.phase = 'over'; lock(true); say('아쉬워요. 이 순서였어요. 다시 들려줄게요.'); if (cleared) count();
        echoPlay(function () { lock(false); say(cleared ? cleared + '번 따라 쳤어요. 잘했어요! 또 해 볼까요?' : '괜찮아요. 천천히 다시 해 봐요.'); ctrl.innerHTML = btn('다시 하기', 'echostart', 'green'); st.phase = 'ended'; });
        return;
      }
      st.pos++;
      if (st.pos < st.lvl) { say('좋아요! (' + st.pos + '/' + st.lvl + ')'); return; }
      cleared++;
      if (st.lvl >= max) { st.phase = 'ended'; lock(true); count(); say('끝까지 모두 따라 쳤어요! 정말 멋져요.'); ctrl.innerHTML = btn('다시 하기', 'echostart', 'green'); lock(false); return; }
      st.phase = 'next'; say('잘했어요! 이번에는 한 음 더!'); st.lvl++;
      timers.push(setTimeout(function () { if (alive(host)) echoNext(); }, 1000));
    }

    /* ----- 내 노래 만들기 ----- */
    var rec = [], seq = null, recording = false;
    function makeCtrl() {
      if (recording) ctrl.innerHTML = btn('■ 멈추기', 'recstop', 'danger');
      else if (seq) ctrl.innerHTML = btn('▶ 들어 보기', 'recplay') + btn('이름 붙여 저장', 'recname', 'green') + btn('다시 녹음', 'recstart');
      else ctrl.innerHTML = btn('● 녹음 시작', 'recstart', 'green');
    }
    function makePress(n) {
      if (!recording) return;
      rec.push({ n: n, t: Date.now() });
      say(rec.length + '음 녹음했어요.');
      if (rec.length >= 64) recStop();
    }
    function recStop() {
      recording = false;
      if (!rec.length) { seq = null; say('건반을 눌러야 노래가 만들어져요.'); } else { seq = M.record(rec); say(seq.length + '음짜리 노래예요. 들어 보고 저장해 봐요.'); }
      makeCtrl();
    }

    /* ----- 선율 따라 치기 ----- */
    var mel = M.melody(o.melody) || M.MELODIES[0], mpos = 0;
    function melHead() {
      $('mhead').textContent = mel.name + ' · ' + Math.min(mpos, mel.notes.length) + ' / ' + mel.notes.length;
      keys.querySelectorAll('.key').forEach(function (k) { k.classList.remove('next'); });
      if (mpos < mel.notes.length) { var k = keys.querySelector('.key[data-n="' + mel.notes[mpos] + '"]'); if (k) k.classList.add('next'); }
    }
    function melRender() {
      mpos = 0; st.pos = 0; counted = false;
      $('mextra').innerHTML = '<p class="sm gap">' + KN.esc(mel.src) + '</p>';
      ctrl.innerHTML = btn('▶ 들려주기', 'melplay') + btn('처음부터', 'melreset') + M.MELODIES.map(function (m) { return '<button class="chipb' + (m.id === mel.id ? ' on' : '') + '" data-mel="' + m.id + '">' + KN.esc(m.name) + '</button>'; }).join('');
      say('반짝이는 건반을 차례로 눌러요.'); melHead();
    }
    function melPress(n) {
      if (mpos >= mel.notes.length) return;
      if (n !== mel.notes[mpos]) { say('반짝이는 건반을 눌러 보세요.'); var k = keys.querySelector('.key[data-n="' + n + '"]'); if (k) { k.classList.add('bad'); timers.push(setTimeout(function () { k.classList.remove('bad'); }, 300)); } return; }
      mpos++; st.pos = mpos; melHead();
      if (mpos >= mel.notes.length) { say('끝까지 쳤어요! 정말 잘했어요.'); count(); }
      else say('좋아요!');
    }

    /* ----- 건반 ----- */
    function press(n) {
      A.tone(n, ins); flash(n, 200);
      if (mode === 'free') { presses++; say(M.NOTES[n].n); if (presses >= 8) count(); }
      else if (mode === 'echo') echoPress(n);
      else if (mode === 'make') makePress(n);
      else if (mode === 'mel') melPress(n);
    }
    var lastDown = 0;
    keys.addEventListener('pointerdown', function (e) {
      var k = e.target.closest && e.target.closest('.key'); if (!k || keys.classList.contains('lock')) return;
      e.preventDefault(); lastDown = Date.now(); press(+k.getAttribute('data-n'));
    });
    keys.addEventListener('click', function (e) {     /* 키보드(Enter·Space)로 눌렀을 때 */
      var k = e.target.closest && e.target.closest('.key'); if (!k || keys.classList.contains('lock')) return;
      if (e.detail === 0 && Date.now() - lastDown > 300) press(+k.getAttribute('data-n'));
    });

    host.addEventListener('click', function (e) {
      var c = e.target.closest && e.target.closest('[data-ins],[data-mel],[data-m]'); if (!c) return;
      if (c.hasAttribute('data-ins')) { ins = c.getAttribute('data-ins'); st.ins = ins; insRow(); A.tone(0, ins); return; }
      if (c.hasAttribute('data-mel')) { mel = M.melody(c.getAttribute('data-mel')); stopAll(); melRender(); return; }
      var a = c.getAttribute('data-m');
      if (a === 'echostart') echoStart();
      else if (a === 'echoagain') { if (st.phase === 'input') { st.phase = 'listen'; lock(true); say('잘 들어 보세요…'); echoPlay(function () { st.phase = 'input'; st.pos = 0; lock(false); say('이제 똑같이 쳐 보세요. (0/' + st.lvl + ')'); }); } }
      else if (a === 'recstart') { stopAll(); rec = []; seq = null; recording = true; say('건반을 눌러 노래를 만들어요. (64음까지)'); makeCtrl(); }
      else if (a === 'recstop') recStop();
      else if (a === 'recplay') { stopAll(); lock(true); player = A.playSeq(seq, ins, function (i, n) { flash(n, 260); }, function () { if (alive(host)) lock(false); }); }
      else if (a === 'recname') {
        stopAll();
        $('mextra').innerHTML = '<div class="card gap"><label class="f" for="sn">노래 이름 (8글자까지)</label><input class="t" id="sn" maxlength="8" autocomplete="off" value="내 노래 ' + (hooks.songsLeft ? (20 - hooks.songsLeft() + 1) : 1) + '"><div class="row gap2"><button class="btn soft grow small" data-m="recno">취소</button><button class="btn green grow small" data-m="recsave">저장</button></div></div>';
        var inp = $('sn'); if (inp) { inp.focus(); inp.select(); }
      } else if (a === 'recno') $('mextra').innerHTML = '';
      else if (a === 'recsave') {
        var name = ($('sn').value || '').trim() || '내 노래';
        var why = hooks.saveSong(name, ins, seq);
        if (why === 'full') { say('노래는 20곡까지 저장할 수 있어요. 부모님이 지우면 새로 만들 수 있어요.'); return; }
        $('mextra').innerHTML = ''; rec = []; seq = null; hooks.act(); hooks.toast('노래를 저장했어요. 보관함에서 다시 들을 수 있어요.'); say('저장했어요! 또 만들어 볼까요?'); makeCtrl();
      } else if (a === 'melplay') { stopAll(); lock(true); player = A.playSeq(M.melodySeq(mel), ins, function (i, n) { flash(n, 260); }, function () { if (alive(host)) { lock(false); melRender(); } }); }
      else if (a === 'melreset') { stopAll(); melRender(); }
    });

    insRow();
    if (mode === 'free') { $('mhead').textContent = '자유 연주'; say('건반을 눌러 보세요. 마음대로 쳐도 좋아요.'); }
    else if (mode === 'echo') { $('mhead').textContent = '따라 쳐 봐요'; say('"시작"을 누르면 소리가 나와요. 듣고 똑같이 따라 쳐요.'); ctrl.innerHTML = btn('시작', 'echostart', 'green'); }
    else if (mode === 'make') { $('mhead').textContent = '내 노래 만들기'; say('녹음을 시작하고 건반을 눌러요. 누른 음과 박자만 저장돼요.'); makeCtrl(); }
    else if (mode === 'mel') { melRender(); }
    return { destroy: stopAll };
  }

  KN.musicUI = { mount: mount, cur: null };
  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
