/* 저장소 — 이 기기의 localStorage 에만 저장. 서버로 보내지 않는다. */
(function (g) {
  var KN = g.KN = g.KN || {};
  var KEY = 'kn.v1';
  var S = null;

  function blank() { return { v: 1, pin: null, profiles: [], settings: { voice: true }, last: null }; }
  KN.newProfile = function (name, grade, ch) {
    return {
      id: 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36),
      name: name, grade: grade, char: ch, created: KN.today(),
      xp: 0, coins: 0, stars: 0,
      streak: { last: null, n: 0 }, badges: [], owned: ['bg-pink'], deco: { bg: 'bg-pink', hat: null },
      pos: {}, nodes: {}, rounds: [], wrong: [], graduated: 0,
      today: { d: KN.today(), sec: 0 }, limitMin: KN.defaultLimit(grade), voice: grade <= 3,
      days: {}, goal: { plays: 3, min: 0 }, songs: [],
      stickers: [], gifts: [], promises: [], rw: { stamps: 0, gifts: 0, grad: 0 }
    };
  };
  /* 연구 권고(초1-2 20분 / 초3-4 30분 / 초5-6 40분 / 중 50분) */
  KN.defaultLimit = function (grade) { return grade <= 2 ? 20 : grade <= 4 ? 30 : grade <= 6 ? 40 : 50; };

  /* 불러온 프로필이 일부 빠져 있거나 이상한 값이어도 앱이 멈추지 않게 기본값으로 채운다 */
  KN.fixProfile = function (p) {
    var g = Math.max(1, Math.min(9, Math.round(Number(p.grade) || 1)));
    var hadRw = !!p.rw && typeof p.rw === 'object' && !Array.isArray(p.rw);
    var hadDays = !!p.days && typeof p.days === 'object' && !Array.isArray(p.days);   /* 옛 기록에는 days 가 없다 */
    var base = KN.newProfile(String(p.name || '친구').slice(0, 8), g, KN.charOf ? KN.charOf(p.char).id : (p.char || 'princess'));
    Object.keys(base).forEach(function (k) {
      var bv = base[k], pv = p[k];
      var okType = Array.isArray(bv) ? Array.isArray(pv) : (bv && typeof bv === 'object') ? (pv && typeof pv === 'object' && !Array.isArray(pv)) : typeof pv === typeof bv;
      if (pv == null || !okType) p[k] = bv;
    });
    p.grade = g; p.name = String(p.name || '친구').slice(0, 8); p.limitMin = Math.max(10, Math.min(120, Math.round(p.limitMin) || base.limitMin));
    if (!p.deco.bg) p.deco.bg = 'bg-pink';
    if (p.owned.indexOf('bg-pink') < 0) p.owned.push('bg-pink');
    p.goal.plays = Math.max(1, Math.min(10, Math.round(Number(p.goal.plays)) || 3));
    p.goal.min = Math.max(0, Math.min(120, Math.round(Number(p.goal.min)) || 0));
    p.songs = KN.works ? KN.works.cleanSongs(p.songs) : [];
    if (KN.days) p.days = hadDays ? KN.days.clean(p.days) : KN.days.migrate(p);   /* 없으면 rounds·today 로 채운다 */
    if (KN.prizes) KN.prizes.clean(p, hadRw);            /* 스티커·선물·약속·도장 수 */
    if (p.deco.pet && p.owned.indexOf(p.deco.pet) < 0) p.deco.pet = null;
    return p;
  };

  KN.store = {
    load: function () {
      var raw = KN.ls.get(KEY);
      try { S = raw ? JSON.parse(raw) : blank(); } catch (e) { S = blank(); }
      if (!S || !Array.isArray(S.profiles)) S = blank();
      if (!S.settings) S.settings = { voice: true };
      S.profiles = S.profiles.filter(function (p) { return p && p.id && p.name; }).map(KN.fixProfile);
      return S;
    },
    get: function () { return S || KN.store.load(); },
    saveFailed: false, artLost: false,
    save: function () { KN.store.saveFailed = !KN.ls.set(KEY, JSON.stringify(S)); },
    profile: function (id) { var s = KN.store.get(); for (var i = 0; i < s.profiles.length; i++) if (s.profiles[i].id === id) return s.profiles[i]; return null; },
    add: function (p) { KN.store.get().profiles.push(p); KN.store.save(); },
    remove: function (id) { var s = KN.store.get(); s.profiles = s.profiles.filter(function (p) { return p.id !== id; }); if (s.last === id) s.last = null; if (KN.works) KN.works.artDropAll(id); KN.store.save(); },
    /* 백업: 기록(days 포함) + 그림 작품. 그림이 많으면 파일이 커진다 */
    exportJSON: function () {
      var s = KN.store.get(), o = JSON.parse(JSON.stringify(s));
      var art = KN.works ? KN.works.artDump(s.profiles.map(function (p) { return p.id; })) : {};
      if (Object.keys(art).length) o.art = art;
      return JSON.stringify(o, null, 1);
    },
    importJSON: function (text) {
      var d = JSON.parse(text);
      if (!d || d.v !== 1 || !Array.isArray(d.profiles)) throw new Error('이 앱에서 내보낸 파일이 아니에요.');
      d.profiles.forEach(function (p) { if (!p || !p.id || !p.name || typeof p.grade !== 'number') throw new Error('프로필 정보가 올바르지 않아요.'); });
      d.profiles = d.profiles.map(KN.fixProfile); d.pin = typeof d.pin === 'string' ? d.pin : null; d.settings = d.settings || { voice: true };
      var art = d.art && typeof d.art === 'object' ? d.art : {}; delete d.art;
      var old = S ? S.profiles.map(function (p) { return p.id; }) : [];
      S = d; KN.store.save();
      if (KN.works) {
        old.forEach(function (id) { KN.works.artDropAll(id); });
        d.profiles.forEach(function (p) {
          var list = KN.works.cleanArt(art[p.id]);
          if (list.length && !KN.ls.set('kn.art.' + p.id, JSON.stringify(list))) KN.store.artLost = true;
        });
      }
      return d.profiles.length;
    },
    reset: function () { S = blank(); KN.store.save(); }
  };

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
