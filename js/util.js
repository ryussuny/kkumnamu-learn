/* 꿈나무 배움터 — 작은 도구들 */
(function (g) {
  var KN = g.KN = g.KN || {};

  KN.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* 오늘 날짜(기기 시간대) YYYY-MM-DD */
  KN.today = function (d) {
    d = d || new Date();
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  };
  KN.dayDiff = function (a, b) { /* b - a 일수 */
    var pa = a.split('-'), pb = b.split('-');
    return Math.round((Date.UTC(+pb[0], +pb[1] - 1, +pb[2]) - Date.UTC(+pa[0], +pa[1] - 1, +pa[2])) / 86400000);
  };
  KN.addDays = function (n) { var d = new Date(); d.setDate(d.getDate() + n); return KN.today(d); };

  /* 글자 꾸밈 기호 → HTML:  {a/b} 분수, {w a/b} 대분수, ^{n} 위첨자, √{n} 근호, 음수 앞 '-' → '−' */
  KN.rich = function (text) {
    var s = KN.esc(text);
    s = s.replace(/\{(-?\d+) (\d+)\/(\d+)\}/g, function (_, w, n, d) { return '<span class="mixed"><span class="w">' + w + '</span><span class="fr"><i>' + n + '</i><b>' + d + '</b></span></span>'; });
    s = s.replace(/\{(-?\d+)\/(\d+)\}/g, function (_, n, d) { return '<span class="fr"><i>' + n.replace('-', '−') + '</i><b>' + d + '</b></span>'; });
    s = s.replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>');
    s = s.replace(/√\{([^}]*)\}/g, '√<span class="rad">$1</span>');
    s = s.replace(/(^|[\s(=,])-(?=\d)/g, '$1−');
    s = s.replace(/\n/g, '<br>');
    return s;
  };
  /* 화면에 보이는 정답 글자(큰 수는 쉼표) */
  KN.showAns = function (a) {
    a = String(a);
    if (/^-?\d{4,}$/.test(a)) a = a.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return KN.rich(a);
  };

  /* 읽어 주기 (브라우저 음성이 없으면 조용히 건너뜀) */
  KN.canSpeak = function () { return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'; };
  KN.speak = function (text, lang) {
    if (!KN.canSpeak()) return false;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = lang || 'ko-KR'; u.rate = lang === 'en-US' ? 0.85 : 0.95;
      var vs = window.speechSynthesis.getVoices(), want = (lang || 'ko-KR').toLowerCase();
      for (var i = 0; i < vs.length; i++) if (vs[i].lang && vs[i].lang.toLowerCase().replace('_', '-') === want) { u.voice = vs[i]; break; }
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  };

  /* 좋은 글자 기호: 문제 읽기용 평문 */
  KN.speakable = function (q) { return q.speak || KN.plain(q.prompt); };

  /* 난수 씨앗(시간 기반) */
  KN.seed = function () { return (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0; };

  /* 간단한 해시(부모 PIN 용 — 보안 장치가 아니라 화면 가림 수준) */
  KN.hash = function (s) { var h = 5381; s = 'kn:' + s; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return String(h >>> 0); };

  /* 안전한 localStorage */
  KN.ls = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  };

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
