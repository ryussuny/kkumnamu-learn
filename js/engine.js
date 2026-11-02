/* 한 판(10문제) 엔진: 문제 만들기, 복습(1·3·7일 간격), 단계 이동(85%↑ 올림 / 40%↓ 내림), 기록 */
(function (g) {
  var KN = g.KN = g.KN || {};
  var UP = 0.85, DOWN = 0.40;
  var GAP = { 1: 1, 2: 3, 3: 7 };      /* 상자 번호 → 다음 복습까지 일수 */

  var E = KN.engine = {
    UP: UP, DOWN: DOWN,

    pos: function (p, subj) {
      var L = KN.ladder(subj);
      if (p.pos[subj] == null || p.pos[subj] >= L.length) p.pos[subj] = KN.startIndex(subj, p.grade);
      return p.pos[subj];
    },
    node: function (p, subj) { return KN.ladder(subj)[E.pos(p, subj)]; },

    /* 틀린 문제 중 오늘 다시 볼 차례인 것 */
    dueWrong: function (p, subj) {
      var t = KN.today();
      return p.wrong.filter(function (w) { return (!subj || w.subj === subj) && w.due <= t; });
    },

    makeQ: function (nodeOrUnit, tier, seed) {
      var u = typeof nodeOrUnit === 'string' ? KN.unit(nodeOrUnit) : nodeOrUnit;
      var q = u.gen(KN.rng(seed), tier);
      q.unit = u.id; q.subj = u.subj; q.tier = tier;
      return q;
    },

    /* 한 판 만들기 → { unit, items:[{q, wrong:<복습이면 틀린 문제 기록>}] } */
    build: function (p, node, seed) {
      var u = KN.unit(node.unit), total = u.count || 10, items = [], used = {};
      var nRev = (u.count && u.count < 10) ? 0 : 2;
      var rev = [];
      if (nRev) {
        rev = KN.rng(seed ^ 0x51).shuffle(E.dueWrong(p, node.subj)).slice(0, nRev);
        /* 모자라면 앞 단계 문제로 채움(섞어 풀기) */
        var L = KN.ladder(node.subj), back = node.i - 1, k = 0;
        while (rev.length < nRev && back >= 0 && k < 6) {
          var bn = L[back], bu = KN.unit(bn.unit);
          if (!bu.count || bu.count >= 10) {
            var bq = E.makeQ(bu, bn.tier, seed + 7000 + k * 31);
            rev.push({ fresh: bq });
          }
          back--; k++;
        }
      }
      rev.forEach(function (w) {
        var q = w.fresh ? w.fresh : JSON.parse(JSON.stringify(w.q));
        var key = q.prompt + '|' + q.answer;
        if (used[key]) return;
        used[key] = 1; items.push({ q: q, review: w.fresh ? 'mix' : w });
      });
      var need = total - items.length, guard = 0, i = 0;
      while (need > 0 && guard++ < 400) {
        var q2 = E.makeQ(u, node.tier, seed + i * 977 + guard * 13); i++;
        var key2 = q2.prompt + '|' + q2.answer;
        if (used[key2] && guard < 380) continue;
        used[key2] = 1; items.push({ q: q2, review: null }); need--;
      }
      /* 복습 문제가 맨 앞에 몰리지 않게 섞는다 */
      items = KN.rng(seed ^ 0x77).shuffle(items);
      return { unit: u, node: node, items: items };
    },

    /* 다시 보기: 틀린 문제를 모아 한 판 (오늘 차례인 것 먼저) */
    buildReview: function (p, seed) {
      var t = KN.today(), r = KN.rng(seed);
      var due = r.shuffle(p.wrong.filter(function (w) { return w.due <= t; }));
      var rest = r.shuffle(p.wrong.filter(function (w) { return w.due > t; }));
      var pick = due.concat(rest).slice(0, 10);
      var items = pick.map(function (w) { return { q: JSON.parse(JSON.stringify(w.q)), review: w }; });
      return { unit: { id: 'review', subj: 'review', name: '다시 보기', grade: p.grade, gradeTo: p.grade }, node: null, items: items };
    },

    /* 판이 끝났을 때. results[i] = {score: 0~1, hint?}  */
    finish: function (p, round, results) {
      var today = KN.today(), items = round.items, node = round.node || { subj: 'review', unit: 'review', tier: 1, i: -1 };
      var isReview = !round.node;
      var score = 0, total = items.length;
      results.forEach(function (r) { score += r.score; });
      var rate = total ? score / total : 0;
      var graduatedNow = 0;

      items.forEach(function (it, idx) {
        var r = results[idx], ok = r.score >= 0.999;
        var key = it.q.prompt + '|' + it.q.answer;
        if (it.review && it.review !== 'mix') {
          var w = it.review;
          if (ok) {
            if (w.box >= 3) { p.wrong = p.wrong.filter(function (x) { return x !== w && !(x.q.prompt + '|' + x.q.answer === key); }); p.graduated = (p.graduated || 0) + 1; graduatedNow++; }
            else { w.box++; w.due = KN.addDays(GAP[w.box]); }
          } else { w.box = 1; w.due = KN.addDays(1); }
        } else if (!ok && !it.q.noReview) {
          var exists = p.wrong.some(function (x) { return x.q.prompt + '|' + x.q.answer === key; });
          if (!exists) p.wrong.push({ q: it.q, subj: it.q.subj, unit: it.q.unit, box: 1, due: KN.addDays(1) });
        }
        if (ok && it.q.verse) { p.verses = p.verses || []; if (p.verses.indexOf(it.q.verse) < 0) p.verses.push(it.q.verse); }
      });
      if (p.wrong.length > 300) p.wrong = p.wrong.slice(-300);

      var stars = rate >= 0.9 ? 3 : rate >= 0.7 ? 2 : rate >= 0.4 ? 1 : 0;
      var moved = 0, newPos = node.i;
      p.stats = p.stats || { ups: 0, perfect: 0 };
      if (!isReview) {
        var key = KN.nodeKey(node), st = p.nodes[key] || { plays: 0, best: 0, stars: 0 };
        st.plays++; st.best = Math.max(st.best, rate); st.stars = Math.max(st.stars, stars); st.last = today;
        p.nodes[key] = st;
        var L = KN.ladder(node.subj);
        if (rate >= UP && node.i < L.length - 1) { newPos = node.i + 1; moved = 1; }
        else if (rate <= DOWN && node.i > 0) { newPos = node.i - 1; moved = -1; }
        p.pos[node.subj] = newPos;
        if (moved > 0) p.stats.ups++;
      }
      if (rate >= 0.999) p.stats.perfect++;

      var correctCount = Math.round(score);
      var coins = correctCount + stars * 2;
      var xpGain = stars * 10 + correctCount;
      var lvBefore = KN.rewards.level(p.xp);
      p.xp += xpGain; p.coins += coins; p.stars += stars;

      /* 연속 학습일 — 하루를 건너뛰어도 벌점은 없고, 다시 1일째부터 센다 */
      var stk = p.streak || (p.streak = { last: null, n: 0 });
      if (stk.last !== today) { stk.n = (stk.last && KN.dayDiff(stk.last, today) === 1) ? stk.n + 1 : 1; stk.last = today; }

      var rec = { t: Date.now(), d: today, subj: node.subj, unit: node.unit, tier: node.tier, rate: Math.round(rate * 100) / 100, n: total };
      p.rounds.push(rec);
      if (p.rounds.length > 300) p.rounds = p.rounds.slice(-300);

      var ctx = { node: node, unit: round.unit, rate: rate };
      var newBadges = KN.rewards.award(p, ctx);
      if (newBadges.length) rec.nb = newBadges.map(function (b) { return b.id; });   /* 그날 받은 배지(부모 요약·공유 글용) */
      var lvAfter = KN.rewards.level(p.xp);
      return { rate: rate, score: score, total: total, stars: stars, coins: coins, xp: xpGain, moved: moved, newPos: newPos, newBadges: newBadges, levelUp: lvAfter > lvBefore ? lvAfter : 0, graduated: graduatedNow, streak: stk.n };
    },

    /* 공부 시간(초) 누적 */
    tick: function (p, sec) {
      var d = KN.today();
      if (!p.today || p.today.d !== d) p.today = { d: d, sec: 0 };
      p.today.sec += sec;
      return p.today.sec;
    }
  };

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
