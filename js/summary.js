/* 학습 요약 — 기록(p.rounds·p.today·p.badges)에서만 계산한다. 새로 수집하는 것 없음.
   부모 화면 요약 카드와 '기록 보내기' 글이 같은 계산을 쓴다. */
(function (g) {
  var KN = g.KN = g.KN || {};
  var URL = 'https://ryussuny.github.io/kkumnamu-learn/';
  var WD = '일월화수목금토';

  function md(d) { var a = d.split('-'); return (+a[1]) + '월 ' + (+a[2]) + '일'; }
  function wday(d) { var a = d.split('-'); return WD.charAt(new Date(+a[0], +a[1] - 1, +a[2]).getDay()); }
  /* 최근 7일(오늘 포함) 날짜, 오래된 것부터 */
  function last7() { var out = []; for (var i = 6; i >= 0; i--) out.push(KN.addDays(-i)); return out; }

  /* days: 날짜 배열 → 그 날짜들의 기록 요약 */
  function over(p, days) {
    var set = {}, subj = {}, review = 0, plays = 0, played = {}, nb = [];
    days.forEach(function (d) { set[d] = 1; });
    p.rounds.forEach(function (r) {
      if (!set[r.d]) return;
      played[r.d] = 1; plays++;
      if (r.subj === 'review') { review++; }
      else {
        var s = subj[r.subj] || (subj[r.subj] = { plays: 0, ok: 0, n: 0 });
        s.plays++; s.ok += r.rate * r.n; s.n += r.n;
      }
      (r.nb || []).forEach(function (id) { if (nb.indexOf(id) < 0) nb.push(id); });
    });
    var list = [];
    KN.subjects.forEach(function (s) {
      var v = subj[s.id]; if (v) list.push({ id: s.id, name: s.name, plays: v.plays, pct: v.n ? Math.round(100 * v.ok / v.n) : 0 });
    });
    return { subjects: list, review: review, plays: plays, days: Object.keys(played).length, played: played, newBadges: nb };
  }
  function badgeName(id) { var b = KN.rewards.badges.filter(function (x) { return x.id === id; })[0]; return b ? b.name : ''; }

  KN.summary = {
    URL: URL, md: md, wday: wday, last7: last7,
    todayMin: function (p) { return p.today && p.today.d === KN.today() ? (p.today.sec > 0 && p.today.sec < 60 ? 1 : Math.floor(p.today.sec / 60)) : 0; },
    day: function (p) { return over(p, [KN.today()]); },
    week: function (p) { return over(p, last7()); },
    lastBadge: function (p) { return p.badges.length ? badgeName(p.badges[p.badges.length - 1]) : ''; },
    badgeName: badgeName,
    /* 공유할 짧은 글. kind: 'today' | 'week'. 칭찬·사실만, 성적 단정 없음 */
    text: function (p, kind) {
      var head = '[꿈나무 배움터] ' + p.name + '(' + KN.gradeName(p.grade) + ') ';
      var parts = [], r;
      if (kind === 'week') {
        r = over(p, last7());
        head += '최근 7일';
        if (!r.plays) return head + ' — 이번 주는 아직 공부 기록이 없어요.\n' + URL;
        parts.push('공부한 날 ' + r.days + '일');
      } else {
        r = over(p, [KN.today()]);
        head += md(KN.today());
        if (!r.plays) return head + ' — 오늘은 아직 공부 기록이 없어요.\n' + URL;
        parts.push('공부 ' + KN.summary.todayMin(p) + '분');
      }
      r.subjects.forEach(function (s) { parts.push(s.name + ' ' + s.plays + '판(정답 ' + s.pct + '%)'); });
      if (r.review) parts.push('다시 보기 ' + r.review + '판');
      parts.push('다시 볼 문제 ' + p.wrong.length + '개');
      var nb = r.newBadges.map(badgeName).filter(Boolean);
      if (nb.length) parts.push('새 배지: ' + nb.slice(0, 3).join(', ') + (nb.length > 3 ? ' 외 ' + (nb.length - 3) + '개' : ''));
      return head + ' — ' + parts.join(' · ') + '\n' + URL;
    }
  };
  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
