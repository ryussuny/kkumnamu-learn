/* 꿈나무 배움터 — 공통 도구: 난수, 수 계산 보조, 문제 만들기.
   브라우저(window.KN)와 node 검사(globalThis.KN) 양쪽에서 쓴다. */
(function (g) {
  var KN = g.KN = g.KN || {};

  /* ---------- 난수 (씨앗을 주면 같은 문제가 다시 나온다) ---------- */
  KN.rng = function (seed) {
    var a = (seed >>> 0) || 1;
    var f = function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    f.int = function (lo, hi) { return lo + Math.floor(f() * (hi - lo + 1)); };
    f.pick = function (arr) { return arr[Math.floor(f() * arr.length)]; };
    f.shuffle = function (arr) {
      arr = arr.slice();
      for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(f() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
      return arr;
    };
    f.chance = function (p) { return f() < p; };
    return f;
  };

  /* ---------- 수 보조 ---------- */
  var M = KN.m = {};
  M.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; };
  M.lcm = function (a, b) { return a / M.gcd(a, b) * b; };
  M.divisors = function (n) { var d = []; for (var i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; };
  M.primeFactors = function (n) { var out = {}; for (var p = 2; p * p <= n; p++) while (n % p === 0) { out[p] = (out[p] || 0) + 1; n /= p; } if (n > 1) out[n] = (out[n] || 0) + 1; return out; };
  M.factorStr = function (n) {
    var f = M.primeFactors(n);
    return Object.keys(f).map(Number).sort(function (a, b) { return a - b; }).map(function (p) { return f[p] > 1 ? p + '^{' + f[p] + '}' : '' + p; }).join(' × ');
  };
  M.red = function (n, d) { var k = M.gcd(n, d); return [n / k, d / k]; };
  /* 분수 글자: 약분된 n/d 를 "{n/d}" 로. d==1 이면 정수 */
  M.fr = function (n, d) { var r = M.red(n, d); if (d < 0) { r = [-r[0], -r[1]]; } return r[1] === 1 ? '' + r[0] : '{' + r[0] + '/' + r[1] + '}'; };
  /* 분수 값이 같은 평문 (정답 비교·보기 중복 검사에 씀) */
  M.frPlain = function (n, d) { var r = M.red(n, d); return r[1] === 1 ? '' + r[0] : r[0] + '/' + r[1]; };
  /* 대분수 글자 */
  M.mixed = function (n, d) {
    var r = M.red(n, d); n = r[0]; d = r[1];
    if (d === 1) return '' + n;
    var w = Math.floor(n / d), rem = n - w * d;
    return w === 0 ? '{' + n + '/' + d + '}' : (rem === 0 ? '' + w : '{' + w + ' ' + rem + '/' + d + '}');
  };
  /* 소수: 정수 n 을 10^p 로 나눈 값을 꼬리 0 없이 */
  M.dec = function (n, p) {
    var neg = n < 0; n = Math.abs(n);
    var s = String(n); while (s.length <= p) s = '0' + s;
    var out = p ? s.slice(0, s.length - p) + '.' + s.slice(s.length - p) : s;
    if (p) out = out.replace(/0+$/, '').replace(/\.$/, '');
    return (neg ? '-' : '') + out;
  };
  M.comma = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  /* 일차식 글자: terms [[계수,'x'],[상수,'']...] */
  M.poly = function (terms) {
    var out = '';
    terms.forEach(function (t) {
      var c = t[0], v = t[1];
      if (c === 0) return;
      var a = Math.abs(c), body = (a === 1 && v) ? v : a + v;
      if (!out) out = (c < 0 ? '−' : '') + body;
      else out += (c < 0 ? ' − ' : ' + ') + body;
    });
    return out || '0';
  };
  M.sign = function (n) { return n < 0 ? '−' + (-n) : '' + n; };       /* 보이는 글자 */
  M.paren = function (n) { return n < 0 ? '(−' + (-n) + ')' : '' + n; };

  /* 조사 붙이기: KN.j(5,'과와') → '5와', KN.j('사과','을를') → '사과를' */
  KN.hasBatchim = function (x) {
    var str = String(x), last = str.charAt(str.length - 1), has;
    if (/[0-9]/.test(last)) has = '0136780'.indexOf(last) >= 0;
    else if (/[가-힣]/.test(last)) has = (last.charCodeAt(0) - 0xAC00) % 28 !== 0;
    else if (/[ㄱ-ㅎ]/.test(last)) has = true;                                            /* 자음 이름(기역·니은…)은 모두 받침으로 끝남 */
    else if (/[ㅏ-ㅣ]/.test(last)) has = false;                                           /* 모음 이름(아·야·어…) */
    else if (/^[A-Za-z]$/.test(str)) has = 'lmnr'.indexOf(last.toLowerCase()) >= 0;      /* 알파벳 글자 이름: 엘·엠·엔·알 */
    else if (/[A-Za-z]/.test(last)) has = 'bdgklmnpt'.indexOf(last.toLowerCase()) >= 0;    /* 영어 낱말: 읽을 때 받침 소리로 끝나는 글자(대략) */
    else has = false;
    return has;
  };
  KN.j = function (x, pair) { return String(x) + (KN.hasBatchim(x) ? pair.charAt(0) : pair.charAt(1)); };
  KN.iyo = function (x) { return String(x) + (KN.hasBatchim(x) ? '이에요' : '예요'); };
  /* '으로/로': ㄹ 받침(1·7·8, 알파벳 l·r)이나 받침이 없으면 '로' */
  KN.ro = function (x) {
    var str = String(x), last = str.charAt(str.length - 1), has = KN.hasBatchim(x), rieul = false;
    if (/[0-9]/.test(last)) rieul = '178'.indexOf(last) >= 0;
    else if (/[가-힣]/.test(last)) rieul = (last.charCodeAt(0) - 0xAC00) % 28 === 8;
    else if (/[A-Za-z]/.test(last)) rieul = 'lr'.indexOf(last.toLowerCase()) >= 0 && /^[A-Za-z]$/.test(str);
    return str + (has && !rieul ? '으로' : '로');
  };
  /* 숫자·단위·수학 기호 바로 뒤에 띄어 쓴 조사를 붙여 쓰고, 받침에 맞는 조사로 바꾼다.
     ('12 과 30 의' → '12와 30의', '9 이 되는' → '9가 되는', '4cm 일까요' → '4cm일까요') */
  var TOK = '(?:[0-9][0-9,.]*(?:cm²|cm³|cm|mm|km|mL|kg|g|m|L|%|°|분|초|시간|개|명|원|번|배|쪽|장|칸|권|그루|마리|자루|점)?|[xyzabcdefghlmnpqrstuvw]|[A-Z]|□)';
  var JOSA = '(과|와|은|는|이에요|예요|이|가|을|를|으로|로|의|에서|에|도|만|부터|까지|보다|일까요|인|일 때|입니다)';
  var RX = new RegExp('(^|[^A-Za-z0-9가-힣²³°%])(' + TOK + ') ' + JOSA + '(?=[\\s.,?!)\\n:]|$)', 'g');
  var ALT = { '과': '과와', '와': '과와', '은': '은는', '는': '은는', '이': '이가', '가': '이가', '을': '을를', '를': '을를' };
  KN.fixJosa = function (text) {
    if (text == null) return text;
    return String(text).replace(RX, function (m, pre, tok, j) {
      if (ALT[j]) return pre + KN.j(tok, ALT[j]);
      if (j === '으로' || j === '로') return pre + KN.ro(tok);
      if (j === '이에요' || j === '예요') return pre + KN.iyo(tok);
      return pre + tok + j;
    });
  };

  /* ---------- 문제 만들기 ----------
     공통 모양: {prompt, answer, kind:'choice'|'num', choices, explain, visual, v}
     v = 검사 스크립트가 따로 다시 계산해 볼 정보(손으로 쓴 정답표가 아니라 식) */
  function numOpts(ans, r, o) {
    o = o || {};
    var a = Number(ans), set = [String(ans)], tries = 0;
    var cands = [];
    var step = o.step || 1;
    var mag = Math.abs(a / step);
    var deltas = [1, -1, 2, -2, 3, -3];
    if (mag >= 12) deltas.push(10, -10);
    if (mag >= 120) deltas.push(100, -100);
    if (mag >= 40) deltas.push(5, -5);
    deltas.forEach(function (d) { cands.push(a + d * step); });
    if (mag >= 10 && Number.isInteger(a)) {      /* 자리 바꿈 같은 흔한 실수 */
      var s = String(Math.abs(a)); var sw = Number(s.split('').reverse().join('')); if (sw !== Math.abs(a) && s.slice(-1) !== '0') cands.push(a < 0 ? -sw : sw);
    }
    cands = r.shuffle(cands);
    for (var i = 0; i < cands.length && set.length < 4; i++) {
      var c = cands[i]; if (o.digits) c = Math.round(c * Math.pow(10, o.digits)) / Math.pow(10, o.digits);
      var cs = String(c);
      if (c === a || set.indexOf(cs) >= 0) continue;
      if (o.min != null && c < o.min) continue;
      if (o.nonneg !== false && a >= 0 && c < 0) continue;
      set.push(cs);
    }
    while (set.length < 4 && tries++ < 50) { var k = String(a + r.int(1, 30) * step * (r.chance(.5) ? 1 : -1)); if (set.indexOf(k) < 0 && !(a >= 0 && Number(k) < 0 && o.nonneg !== false)) set.push(k); }
    return set;
  }
  KN.numOpts = numOpts;

  /* 보기 섞기: 정답 한 개 + 오답. 위치는 난수로 */
  KN.choose = function (r, ans, wrongs) {
    var seen = {}; seen[ans] = 1; var list = [ans];
    wrongs.forEach(function (w) { w = String(w); if (!seen[w]) { seen[w] = 1; list.push(w); } });
    return r.shuffle(list.slice(0, 4));
  };

  /* 문제 한 개 만들기.  opts: kind, choices, wrong(오답 목록), visual, v, speak */
  KN.mk = function (r, prompt, answer, explain, opts) {
    opts = opts || {};
    var q = { prompt: KN.fixJosa(prompt), answer: String(answer), explain: KN.fixJosa(explain || ''), kind: opts.kind || 'choice' };
    if (opts.visual) q.visual = opts.visual;
    if (opts.speak) q.speak = opts.speak;
    if (opts.v) q.v = opts.v;
    if (q.kind === 'choice') {
      if (opts.wrong) {
        q.choices = KN.choose(r, q.answer, opts.wrong);
        if (q.choices.length < 4 && !isNaN(Number(q.answer))) {   /* 오답이 모자라면 가까운 수로 채움 */
          numOpts(q.answer, r, opts.num).forEach(function (c) { if (q.choices.length < 4 && q.choices.indexOf(c) < 0) q.choices.push(c); });
          q.choices = r.shuffle(q.choices);
        }
      }
      else if (opts.choices) q.choices = r.shuffle(opts.choices.map(String));
      else q.choices = r.shuffle(numOpts(answer, r, opts.num));
    }
    return q;
  };
  /* 정수 답: 3학년 이상은 두 번째 단계에서 직접 입력 */
  KN.mkNum = function (r, grade, tier, prompt, answer, explain, opts) {
    opts = opts || {};
    var typed = grade >= 3 && (tier >= 2 || r() < 0.3);
    if (opts.forceChoice) typed = false;
    opts.kind = typed ? 'num' : 'choice';
    return KN.mk(r, prompt, answer, explain, opts);
  };

  /* 문제 답 맞는지 (입력도 보기도 같은 규칙) */
  KN.norm = function (s) { return String(s).replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/,/g, ''); };
  KN.isRight = function (q, input) {
    var a = KN.norm(input), b = KN.norm(q.answer);
    if (a === b) return true;
    if (q.kind === 'num' && a !== '' && !isNaN(a) && !isNaN(b) && Number(a) === Number(b)) return true;
    return false;
  };

  /* 화면 글자 꾸밈 기호를 평문 읽기용으로 */
  KN.plain = function (t) {
    return String(t)
      .replace(/\{(\d+) (\d+)\/(\d+)\}/g, '$1과 $3분의 $2')
      .replace(/\{(-?\d+)\/(\d+)\}/g, '$2분의 $1')
      .replace(/\^\{([^}]*)\}/g, '의 $1제곱')
      .replace(/√\{([^}]*)\}/g, '루트 $1')
      .replace(/×/g, ' 곱하기 ').replace(/÷/g, ' 나누기 ').replace(/−/g, ' 마이너스 ')
      .replace(/\+/g, ' 더하기 ').replace(/=/g, ' 는 ').replace(/[□]/g, ' 빈칸 ')
      .replace(/[●○]+/g, function (m) { return m.length + '개'; });
  };

  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
