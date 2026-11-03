/* 축하 연출 — 색종이 폭죽(CSS 애니메이션 약 2초)과 짧은 팡파레(Web Audio 4음, KN.audio 재사용).
   '효과음 끄기'(부모 화면)를 따르고, 움직임 줄이기(prefers-reduced-motion)면 색종이는 만들지 않는다. */
(function (g) {
  var KN = g.KN = g.KN || {};
  var COLORS = ['#ff5c6c', '#ff9442', '#ffd23f', '#7fd35a', '#4ab8ff', '#a77bff', '#ff7aa2'];

  function reduced() { try { return !!(g.matchMedia && g.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; } }
  function soundOn() { try { var s = KN.store.get().settings; return !s || s.sound !== false; } catch (e) { return true; } }

  KN.fx = {
    bursts: 0, lastPieces: 0, fanfares: 0, lastFanfare: null,
    /* 색종이 폭죽 */
    burst: function () {
      KN.fx.bursts++;
      var n = reduced() ? 0 : 48; KN.fx.lastPieces = n;
      if (!n || !g.document) return;
      var old = g.document.getElementById('confetti'); if (old) old.remove();
      var host = g.document.createElement('div'); host.className = 'confetti'; host.id = 'confetti'; host.setAttribute('aria-hidden', 'true');
      var h = '';
      for (var i = 0; i < n; i++) {
        var left = Math.round(Math.random() * 100), dx = Math.round(Math.random() * 160 - 80), dl = (Math.random() * 0.35).toFixed(2), dur = (1.3 + Math.random() * 0.6).toFixed(2), rot = Math.round(Math.random() * 540 + 180);
        h += '<i style="left:' + left + '%;background:' + COLORS[i % COLORS.length] + ';animation-delay:' + dl + 's;animation-duration:' + dur + 's;--dx:' + dx + 'px;--rot:' + rot + 'deg"></i>';
      }
      host.innerHTML = h; g.document.body.appendChild(host);
      setTimeout(function () { if (host.parentNode) host.remove(); }, 2300);
    },
    /* 팡파레: 도-미-솔-높은 도 */
    fanfare: function () {
      KN.fx.fanfares++; KN.fx.lastFanfare = soundOn() ? 'played' : 'muted';
      if (!soundOn() || !KN.audio) return false;
      KN.audio.playSeq([[0, 0], [2, 140], [4, 140], [7, 260]], 'bell');
      return true;
    },
    celebrate: function () { KN.fx.burst(); KN.fx.fanfare(); }
  };
  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
