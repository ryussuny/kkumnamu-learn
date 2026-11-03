/* 날짜별 학습 기록(1일 학습량) — p.days['YYYY-MM-DD'] = { sec, plays, subj:{math:n}, acc:{math:[맞힌 수, 문제 수]}, ok, n, music, draw, nb:[배지 id], goal }
   기기 안(localStorage)의 프로필에만 저장된다. rounds 는 300개까지만 남지만 days 는 최근 400일까지 남긴다. */
(function (g) {
  var KN = g.KN = g.KN || {};
  var KEEP = 400, DATE = /^\d{4}-\d{2}-\d{2}$/, WD = '일월화수목금토';
  var DEFAULT_GOAL = { plays: 3, min: 0 };     /* min 0 = 하루 권장 시간을 채우면 */

  function num(v, max) { v = Number(v); return isFinite(v) && v > 0 ? Math.min(max || 1e7, Math.round(v * 100) / 100) : 0; }
  function blankDay() { return { sec: 0, plays: 0, subj: {}, acc: {}, ok: 0, n: 0, music: 0, draw: 0, nb: [], goal: false }; }

  var D = KN.days = {
    KEEP: KEEP, DEFAULT_GOAL: DEFAULT_GOAL,
    blankDay: blankDay,
    /* 그날 기록(없으면 만든다). 400일을 넘으면 오래된 날부터 지운다 */
    touch: function (p, d) {
      d = d || KN.today();
      if (!p.days || typeof p.days !== 'object') p.days = {};
      var r = p.days[d];
      if (!r) {
        r = p.days[d] = blankDay();
        var keys = Object.keys(p.days);
        if (keys.length > KEEP) keys.sort().slice(0, keys.length - KEEP).forEach(function (k) { delete p.days[k]; });
      }
      return r;
    },
    get: function (p, d) { return p.days && p.days[d] ? p.days[d] : null; },
    /* 한 판이 끝났을 때 (engine.finish 가 부른다). rec = 라운드 기록 {d, subj, rate, n, nb} */
    addRound: function (p, rec) {
      var r = D.touch(p, rec.d);
      r.plays++;
      r.subj[rec.subj] = (r.subj[rec.subj] || 0) + 1;
      var a = r.acc[rec.subj] || (r.acc[rec.subj] = [0, 0]), ok = Math.round(rec.rate * rec.n * 100) / 100;
      a[0] = Math.round((a[0] + ok) * 100) / 100; a[1] += rec.n;
      r.ok = Math.round((r.ok + ok) * 100) / 100; r.n += rec.n;
      (rec.nb || []).forEach(function (id) { if (r.nb.indexOf(id) < 0) r.nb.push(id); });
      return r;
    },
    addSec: function (p, sec) { var r = D.touch(p); r.sec += sec; return r; },
    addAct: function (p, kind) { if (kind !== 'music' && kind !== 'draw') return null; var r = D.touch(p); r[kind]++; return r; },
    /* 하루 목표 */
    goalMin: function (p) { return p.goal && p.goal.min > 0 ? p.goal.min : (p.limitMin || 30); },
    reached: function (p, r) { return !!r && (r.plays >= p.goal.plays || r.sec >= D.goalMin(p) * 60); },
    /* 오늘 목표를 막 채웠으면 true (도장은 한 번 찍으면 지워지지 않는다) */
    check: function (p, d) {
      var r = p.days && p.days[d || KN.today()];
      if (!r || r.goal || !D.reached(p, r)) return false;
      r.goal = true; return true;
    },
    /* 오늘 진행: {plays, goalPlays, min, goalMin, done} */
    progress: function (p) {
      var r = D.get(p, KN.today()) || blankDay();
      return { plays: r.plays, goalPlays: p.goal.plays, min: r.sec > 0 && r.sec < 60 ? 1 : Math.floor(r.sec / 60), goalMin: D.goalMin(p), done: !!r.goal || D.reached(p, r) };
    },
    /* 공부한 날로 칠 만한 기록인지(판·1분 이상·음악·그림 중 하나) */
    active: function (r) { return !!r && (r.plays > 0 || r.sec >= 60 || r.music > 0 || r.draw > 0); },
    minutes: function (r) { return !r ? 0 : (r.sec > 0 && r.sec < 60 ? 1 : Math.floor(r.sec / 60)); },
    pct: function (a) { return a && a[1] ? Math.round(100 * a[0] / a[1]) : 0; },

    /* 월 달력: 일요일 시작. 칸은 날짜 문자열 또는 null (m = 1~12) */
    monthGrid: function (y, m) {
      var first = new Date(y, m - 1, 1).getDay(), n = new Date(y, m, 0).getDate(), cells = [], i;
      for (i = 0; i < first; i++) cells.push(null);
      for (i = 1; i <= n; i++) cells.push(y + '-' + (m < 10 ? '0' : '') + m + '-' + (i < 10 ? '0' : '') + i);
      while (cells.length % 7) cells.push(null);
      var rows = []; for (i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
      return rows;
    },
    /* 최근 n일(오늘 포함), 최신이 앞 */
    recent: function (p, n) { var out = []; for (var i = 0; i < n; i++) { var d = KN.addDays(-i); out.push({ d: d, r: D.get(p, d) }); } return out; },
    dateLabel: function (d) {
      var a = d.split('-');
      return (+a[1]) + '월 ' + (+a[2]) + '일 ' + WD.charAt(new Date(+a[0], +a[1] - 1, +a[2]).getDay()) + '요일';
    },

    /* 불러온 days 를 안전한 모양으로 (이상한 값이 있어도 앱이 멈추지 않게) */
    clean: function (raw) {
      var out = {};
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
      Object.keys(raw).filter(function (k) { return DATE.test(k) && raw[k] && typeof raw[k] === 'object'; }).sort().slice(-KEEP).forEach(function (k) {
        var s = raw[k], r = blankDay();
        r.sec = num(s.sec, 86400); r.plays = Math.round(num(s.plays, 9999)); r.ok = num(s.ok); r.n = Math.round(num(s.n)); r.music = Math.round(num(s.music, 9999)); r.draw = Math.round(num(s.draw, 9999)); r.goal = s.goal === true;
        if (s.subj && typeof s.subj === 'object') Object.keys(s.subj).forEach(function (id) { var v = Math.round(num(s.subj[id], 9999)); if (v && /^[a-z]{2,8}$/.test(id)) r.subj[id] = v; });
        if (s.acc && typeof s.acc === 'object') Object.keys(s.acc).forEach(function (id) { var a = s.acc[id]; if (/^[a-z]{2,8}$/.test(id) && Array.isArray(a) && a.length === 2) r.acc[id] = [num(a[0]), Math.round(num(a[1]))]; });
        if (Array.isArray(s.nb)) s.nb.forEach(function (id) { if (typeof id === 'string' && /^[a-z0-9]{2,12}$/.test(id) && r.nb.indexOf(id) < 0 && r.nb.length < 40) r.nb.push(id); });
        out[k] = r;
      });
      return out;
    },
    /* 옛 기록(rounds·today)에서 날짜별 기록을 채운다. 시간은 오늘 것만 알 수 있다. */
    migrate: function (p) {
      p.days = {};
      (p.rounds || []).forEach(function (r) { if (r && DATE.test(String(r.d)) && r.subj && isFinite(r.rate) && r.n > 0) D.addRound(p, r); });
      if (p.today && DATE.test(String(p.today.d)) && p.today.sec > 0) D.touch(p, p.today.d).sec = Math.round(p.today.sec);
      Object.keys(p.days).forEach(function (d) { if (D.reached(p, p.days[d])) p.days[d].goal = true; });
      return p.days;
    }
  };
  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
