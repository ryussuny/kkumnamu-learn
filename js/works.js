/* 내 작품 — 그림(JPEG 데이터)은 아이마다 따로 localStorage 'kn.art.<id>' 에 두고(프로필 저장이 무거워지지 않게),
   내가 만든 노래(음 이름·박자만)는 프로필의 p.songs 에 둔다. 서버로 보내지 않는다. 마이크·카메라·사진은 쓰지 않는다. */
(function (g) {
  var KN = g.KN = g.KN || {};
  var MAX_ART = 30, MAX_SONG = 20, JPEG = 'data:image/jpeg;base64,';
  var key = function (pid) { return 'kn.art.' + pid; };

  var W = KN.works = {
    MAX_ART: MAX_ART, MAX_SONG: MAX_SONG,
    /* 긴 변이 max 이하가 되게 줄인 크기 */
    fit: function (w, h, max) { var k = Math.min(1, max / Math.max(w, h)); return { w: Math.max(1, Math.round(w * k)), h: Math.max(1, Math.round(h * k)) }; },

    artList: function (pid) {
      var raw = KN.ls.get(key(pid)), a;
      try { a = raw ? JSON.parse(raw) : []; } catch (e) { a = []; }
      return W.cleanArt(a);
    },
    cleanArt: function (a) {
      if (!Array.isArray(a)) return [];
      return a.filter(function (x) { return x && typeof x.id === 'string' && typeof x.img === 'string' && x.img.indexOf(JPEG) === 0 && /^[A-Za-z0-9+/=]+$/.test(x.img.slice(JPEG.length)); })
        .map(function (x) { return { id: x.id.slice(0, 24), d: /^\d{4}-\d{2}-\d{2}$/.test(String(x.d)) ? x.d : KN.today(), name: String(x.name || '그림').slice(0, 12), pic: x.pic ? String(x.pic).slice(0, 12) : '', img: x.img }; })
        .slice(-MAX_ART);
    },
    /* 저장: '' 성공 / 'full' 30장 가득 / 'quota' 저장 공간 부족 */
    artAdd: function (pid, item) {
      var list = W.artList(pid);
      if (list.length >= MAX_ART) return 'full';
      list.push({ id: 'a' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36), d: KN.today(), name: String(item.name || '그림').slice(0, 12), pic: item.pic || '', img: item.img });
      return KN.ls.set(key(pid), JSON.stringify(list)) ? '' : 'quota';
    },
    artRemove: function (pid, id) {
      var list = W.artList(pid).filter(function (x) { return x.id !== id; });
      return KN.ls.set(key(pid), JSON.stringify(list));
    },
    artDropAll: function (pid) { try { window.localStorage.removeItem(key(pid)); } catch (e) { /* 저장소를 못 쓰면 지울 것도 없다 */ } },
    /* 백업용: {프로필id: [작품…]} */
    artDump: function (pids) { var o = {}; pids.forEach(function (id) { var l = W.artList(id); if (l.length) o[id] = l; }); return o; },
    artSize: function (pids) { var n = 0, c = 0; pids.forEach(function (id) { var l = W.artList(id); c += l.length; n += JSON.stringify(l).length; }); return { count: c, bytes: n }; },

    /* ---- 노래 ---- */
    cleanSongs: function (a) {
      if (!Array.isArray(a)) return [];
      return a.filter(function (s) { return s && typeof s.id === 'string' && Array.isArray(s.seq) && s.seq.length; }).map(function (s) {
        var seq = s.seq.filter(function (e) { return Array.isArray(e) && e[0] >= 0 && e[0] <= 7 && e[0] % 1 === 0 && isFinite(e[1]); }).slice(0, 80).map(function (e) { return [e[0], Math.max(0, Math.min(3000, Math.round(e[1])))]; });
        return { id: s.id.slice(0, 24), name: String(s.name || '내 노래').slice(0, 12), d: /^\d{4}-\d{2}-\d{2}$/.test(String(s.d)) ? s.d : KN.today(), ins: ['piano', 'xylo', 'bell'].indexOf(s.ins) >= 0 ? s.ins : 'piano', seq: seq };
      }).filter(function (s) { return s.seq.length; }).slice(0, MAX_SONG);
    },
    /* '' 성공 / 'full' 20곡 가득 */
    songAdd: function (p, name, ins, seq) {
      if (p.songs.length >= MAX_SONG) return 'full';
      p.songs.push({ id: 's' + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36), name: String(name || '내 노래').slice(0, 12), d: KN.today(), ins: ins, seq: seq });
      return '';
    },
    songRemove: function (p, id) { p.songs = p.songs.filter(function (s) { return s.id !== id; }); }
  };
  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
