/* 보상 규칙 — 스티커(정해진 순서), 하루 목표 도장 10개 → 선물 상자(정해진 순서), 부모가 정하는 약속 보상.
   확률 뽑기 없음: 무엇이 나올지는 깜짝이지만 순서는 항상 같다. 노력·꾸준함을 칭찬하고 틀려도 벌점은 없다.
   기록: p.stickers[{id,d,why}] · p.gifts[{d,kind,id,name,n}] · p.promises[…] · p.rw{stamps,gifts,grad} (프로필 안에 저장 → 백업에 함께 담김) */
(function (g) {
  var KN = g.KN = g.KN || {};
  var DATE = /^\d{4}-\d{2}-\d{2}$/;
  var GIFT_EVERY = 10, GRAD_EVERY = 3, MAX_PROMISES = 8;
  /* 선물 상자에서 나오는 순서 (다 나오면 코인 묶음) */
  var GIFT_SEQ = [
    { kind: 'decor', id: 'pet-bunny' }, { kind: 'coins', n: 50 }, { kind: 'decor', id: 'hat-wizard' }, { kind: 'sticker', id: 'sp-trophy' },
    { kind: 'decor', id: 'bg-ocean' }, { kind: 'coins', n: 80 }, { kind: 'decor', id: 'pet-dragon' }, { kind: 'sticker', id: 'sp-medal' },
    { kind: 'decor', id: 'hat-halo' }, { kind: 'decor', id: 'bg-galaxy' }, { kind: 'sticker', id: 'sp-diamond' }, { kind: 'coins', n: 100 }, { kind: 'sticker', id: 'sp-heart' }
  ];
  var KINDS = ['stamps', 'plays', 'stars'];
  function today() { return KN.today(); }
  function int(v, lo, hi, d) { v = Math.round(Number(v)); return isFinite(v) ? Math.max(lo, Math.min(hi, v)) : d; }

  var Z = KN.prizes = {
    GIFT_EVERY: GIFT_EVERY, GRAD_EVERY: GRAD_EVERY, GIFT_SEQ: GIFT_SEQ, KINDS: KINDS, MAX_PROMISES: MAX_PROMISES,

    /* ---- 스티커 ---- */
    has: function (p, id) { return p.stickers.some(function (s) { return s.id === id; }); },
    nextSticker: function (p) { var o = KN.stickerOrder; for (var i = 0; i < o.length; i++) if (!Z.has(p, o[i])) return o[i]; return null; },
    give: function (p, id, why) {
      if (Z.has(p, id)) return null;
      p.stickers.push({ id: id, d: today(), why: why || '' });
      KN.days.touch(p).stk++;
      return KN.sticker(id);
    },
    /* 다음 스티커 하나(순서대로). 다 모았으면 코인 10개 */
    award: function (p, why) {
      var id = Z.nextSticker(p);
      if (!id) { p.coins += 10; return null; }
      return Z.give(p, id, why);
    },
    /* ---- 도장 · 선물 상자 ---- */
    stamp: function (p) { p.rw.stamps++; return Z.award(p, 'stamp'); },
    /* 오늘 목표를 막 채웠으면 도장+스티커를 주고 {sticker}, 아니면 null */
    checkStamp: function (p, d) { if (!KN.days.check(p, d)) return null; return { sticker: Z.stamp(p) }; },
    giftsReady: function (p) { return Math.max(0, Math.floor(p.rw.stamps / GIFT_EVERY) - p.rw.gifts); },
    /* 다음 선물 상자까지 남은 도장 수 (이미 열 상자가 있으면 0) */
    toGift: function (p) { return Z.giftsReady(p) ? 0 : GIFT_EVERY - (p.rw.stamps % GIFT_EVERY); },
    nextGift: function (p) { return GIFT_SEQ[p.rw.gifts] || { kind: 'coins', n: 100 }; },
    /* 선물 상자 열기 → 받은 것 {d,kind,id,name,n} 또는 null(열 상자 없음) */
    openGift: function (p) {
      if (!Z.giftsReady(p)) return null;
      var pz = Z.nextGift(p), rec = { d: today(), kind: pz.kind, id: pz.id || '', name: '', n: 0 };
      if (pz.kind === 'decor') {
        var d = KN.rewards.findDecor(pz.id);
        if (!d || p.owned.indexOf(pz.id) >= 0) { rec.kind = 'coins'; rec.id = ''; rec.n = 30; }      /* 이미 있으면 코인으로 */
        else { p.owned.push(pz.id); rec.name = d.name; }
      } else if (pz.kind === 'sticker') {
        if (Z.has(p, pz.id)) { rec.kind = 'coins'; rec.id = ''; rec.n = 30; }
        else { Z.give(p, pz.id, 'gift'); rec.name = KN.sticker(pz.id).name; }
      } else { rec.n = pz.n; }
      if (rec.kind === 'coins') { p.coins += rec.n; rec.name = '코인 ' + rec.n + '개'; }
      p.gifts.push(rec); p.rw.gifts++; KN.days.touch(p).gift++;
      return rec;
    },
    /* ---- 약속 보상 ---- */
    progress: function (p, pr) {
      var have = 0;
      Object.keys(p.days).forEach(function (d) {
        if (d < pr.start) return;
        var r = p.days[d];
        if (pr.kind === 'stamps') have += r.goal ? 1 : 0;
        else if (pr.kind === 'plays') have += pr.subj ? (r.subj[pr.subj] || 0) : r.plays;
        else if (pr.kind === 'stars') have += pr.subj ? ((r.ss || {})[pr.subj] || 0) : (r.star || 0);
      });
      return { have: have, need: pr.target, left: Math.max(0, pr.target - have), pct: Math.min(100, Math.round(100 * have / pr.target)), done: have >= pr.target };
    },
    /* 조건 문구. parent=true 면 과목명에 원래 이름 병기 */
    condText: function (pr, parent) {
      var nm = pr.subj ? (parent ? KN.parentName(pr.subj) : KN.funName(pr.subj)) : '';
      if (pr.kind === 'stamps') return '하루 목표 도장 ' + pr.target + '개';
      if (pr.kind === 'plays') return (nm ? nm + ' ' : '') + pr.target + '판';
      return (nm ? nm + ' ' : '') + '별 ' + pr.target + '개';
    },
    promiseText: function (pr, parent) { return Z.condText(pr, parent) + ' 모으면 → ' + pr.text; },
    addPromise: function (p, o) {
      if (p.promises.filter(function (x) { return !x.given; }).length >= MAX_PROMISES) return null;
      var pr = Z.cleanPromise({ id: 'q' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36), kind: o.kind, subj: o.subj, target: o.target, text: o.text, start: today(), reached: null, given: null });
      if (!pr || !pr.text) return null;
      p.promises.push(pr); return pr;
    },
    /* 새로 다 채운 약속들(처음 채운 날 기록) */
    checkPromises: function (p) {
      var out = [];
      p.promises.forEach(function (pr) { if (!pr.reached && !pr.given && Z.progress(p, pr).done) { pr.reached = today(); out.push(pr); } });
      return out;
    },
    givePromise: function (p, id) { var pr = p.promises.filter(function (x) { return x.id === id; })[0]; if (!pr || !pr.reached || pr.given) return false; pr.given = today(); return true; },

    /* ---- 한 판이 끝났을 때 (engine.finish) ---- */
    afterRound: function (p, ctx) {
      var stickers = [], s;
      if (ctx.stars >= 3 && (s = Z.award(p, 'star3'))) stickers.push(s);
      if (ctx.stamp && (s = Z.stamp(p))) stickers.push(s);     /* 스티커를 다 모은 뒤에도 도장은 센다(Z.stamp) */
      var due = Math.floor((p.graduated || 0) / GRAD_EVERY) - p.rw.grad;
      for (var i = 0; i < due; i++) if ((s = Z.award(p, 'grad'))) stickers.push(s);
      if (due > 0) p.rw.grad += due;
      return { stickers: stickers, giftReady: Z.giftsReady(p), reached: Z.checkPromises(p) };
    },
    /* 이번 주(최근 7일) 받은 스티커 수 */
    weekStickers: function (p) { var from = KN.addDays(-6); return p.stickers.filter(function (s) { return s.d >= from; }).length; },

    /* ---- 불러온 값 정리 ---- */
    cleanPromise: function (x) {
      if (!x || typeof x !== 'object' || !KINDS.indexOf || KINDS.indexOf(x.kind) < 0) return null;
      var subjIds = KN.subjects.map(function (s) { return s.id; });
      return {
        id: String(x.id || 'q' + Date.now().toString(36)).slice(0, 24), kind: x.kind, subj: x.kind !== 'stamps' && subjIds.indexOf(x.subj) >= 0 ? x.subj : '',
        target: int(x.target, 1, 200, 5), text: String(x.text == null ? '' : x.text).replace(/[<>]/g, '').trim().slice(0, 20), start: DATE.test(String(x.start)) ? x.start : today(),
        reached: DATE.test(String(x.reached)) ? x.reached : null, given: DATE.test(String(x.given)) ? x.given : null
      };
    },
    clean: function (p, hadRw) {
      var seen = {};
      p.stickers = (Array.isArray(p.stickers) ? p.stickers : []).filter(function (s) { if (!s || !KN.sticker(s.id) || seen[s.id]) return false; seen[s.id] = 1; return true; })
        .map(function (s) { return { id: s.id, d: DATE.test(String(s.d)) ? s.d : today(), why: String(s.why || '').slice(0, 8) }; });
      p.gifts = (Array.isArray(p.gifts) ? p.gifts : []).filter(function (x) { return x && ['decor', 'coins', 'sticker'].indexOf(x.kind) >= 0; })
        .map(function (x) { return { d: DATE.test(String(x.d)) ? x.d : today(), kind: x.kind, id: String(x.id || '').slice(0, 24), name: String(x.name || '').replace(/[<>]/g, '').slice(0, 20), n: int(x.n, 0, 9999, 0) }; }).slice(-200);
      p.promises = (Array.isArray(p.promises) ? p.promises : []).map(Z.cleanPromise).filter(Boolean).slice(0, 30);
      if (!hadRw) {      /* 옛 기록: 이미 모은 도장 수는 days 에서 세고, 이미 이겨낸 문제로는 스티커를 새로 주지 않는다 */
        var n = 0; Object.keys(p.days || {}).forEach(function (d) { if (p.days[d].goal) n++; });
        p.rw = { stamps: n, gifts: 0, grad: Math.floor((p.graduated || 0) / GRAD_EVERY) };
      } else {
        p.rw = { stamps: int(p.rw.stamps, 0, 99999, 0), gifts: int(p.rw.gifts, 0, 9999, 0), grad: int(p.rw.grad, 0, 99999, 0) };
      }
      return p;
    }
  };
  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
