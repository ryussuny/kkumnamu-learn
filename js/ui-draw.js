/* 알록달록 그림방 화면 부품: 그림판(붓·지우개·채우기·도장·되돌리기)과 색칠 놀이.
   손가락·펜(pointer events)으로 그린다. 사진·카메라는 쓰지 않고, 저장은 JPEG(긴 변 800px 이하, 품질 0.7). */
(function (g) {
  var KN = g.KN = g.KN || {};
  var D = KN.draw;

  /* 밑그림 선의 위치를 1(선)/0(빈 곳)로 */
  function barrierOf(pic) {
    var c = document.createElement('canvas'); c.width = D.W; c.height = D.H;
    var x = c.getContext('2d'); D.drawLines(x, pic, 1);
    var a = x.getImageData(0, 0, D.W, D.H).data, b = new Uint8Array(D.W * D.H);
    for (var i = 0; i < b.length; i++) b[i] = a[i * 4 + 3] >= 110 ? 1 : 0;
    return b;
  }
  function rgbOf(hex) { return [parseInt(hex.substr(1, 2), 16), parseInt(hex.substr(3, 2), 16), parseInt(hex.substr(5, 2), 16)]; }

  /* o: {pic: 밑그림 id | null}   hooks: {save(img, name, pic) → '' | 'full' | 'quota', act(), toast(msg), confirm(title, body, okLabel, fn)} */
  function mount(host, o, hooks) {
    var pic = o.pic ? D.pic(o.pic) : null;
    var st = { tool: 'brush', color: D.COLORS[0].c, size: 1, stamp: 'star' };
    var undo = [], drawing = false, lastPt = null, pid = null, busy = false;
    KN.drawUI.cur = st;

    host.innerHTML = '<div class="pwrap" id="pw"><canvas id="pc" width="' + D.W + '" height="' + D.H + '" aria-label="그림 그리는 곳"></canvas>' + (pic ? '<canvas id="po" width="' + D.W + '" height="' + D.H + '"></canvas>' : '') + '</div>' +
      '<div class="ptools" id="pt">' + [['brush', '붓'], ['eraser', '지우개'], ['fill', '채우기'], ['stamp', '도장']].map(function (t) { return '<button class="ptool' + (t[0] === 'brush' ? ' on' : '') + '" data-p="tool" data-v="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div class="pstamps" id="ps" hidden>' + D.STAMPS.map(function (s) { return '<button class="ptool' + (s.id === 'star' ? ' on' : '') + '" data-p="stamp" data-v="' + s.id + '">' + KN.esc(s.name) + '</button>'; }).join('') + '</div>' +
      '<div class="pal" id="pal">' + D.COLORS.map(function (c, i) { return '<button class="sw' + (i === 0 ? ' on' : '') + (c.id === 'white' ? ' wh' : '') + '" data-p="color" data-v="' + c.c + '" style="background:' + c.c + '" aria-label="' + c.name + '"></button>'; }).join('') + '</div>' +
      '<div class="psz" id="psz">' + D.SIZES.map(function (s, i) { return '<button class="ptool' + (i === 1 ? ' on' : '') + '" data-p="size" data-v="' + i + '"><i style="width:' + (8 + i * 8) + 'px;height:' + (8 + i * 8) + 'px"></i>' + s.name + '</button>'; }).join('') + '</div>' +
      '<div class="row gap"><button class="btn soft small grow" data-p="undo">되돌리기</button><button class="btn soft small grow" data-p="clear">전체 지우기</button></div>' +
      '<div class="row gap"><button class="btn green small grow" data-p="save">작품으로 저장</button><button class="btn soft small grow" data-p="dl">이미지로 내려받기</button></div>';
    var cv = host.querySelector('#pc'), ov = host.querySelector('#po'), x = cv.getContext('2d', { willReadFrequently: true });
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, D.W, D.H);
    var barrier = pic ? barrierOf(pic) : new Uint8Array(D.W * D.H);
    if (ov) D.drawLines(ov.getContext('2d'), pic, 1);
    st.cv = cv;

    function snap() { try { undo.push(x.getImageData(0, 0, D.W, D.H)); if (undo.length > 8) undo.shift(); } catch (e) { /* 메모리가 모자라면 되돌리기만 못 한다 */ } }
    function at(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * D.W / r.width, y: (e.clientY - r.top) * D.H / r.height }; }
    function lw() { return D.SIZES[st.size].w; }
    function inkColor() { return st.tool === 'eraser' ? '#ffffff' : st.color; }
    function dot(p) { x.fillStyle = inkColor(); x.beginPath(); x.arc(p.x, p.y, lw() / 2, 0, Math.PI * 2); x.fill(); }
    function seg(a, b) { x.strokeStyle = inkColor(); x.lineWidth = lw(); x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
    function doFill(p) {
      var im = x.getImageData(0, 0, D.W, D.H);
      var n = D.floodFill(im.data, barrier, D.W, D.H, p.x, p.y, rgbOf(st.color), 48);
      if (n) x.putImageData(im, 0, 0); else if (undo.length) undo.pop();
    }
    function doStamp(p) {
      var s = D.STAMPS.filter(function (z) { return z.id === st.stamp; })[0], size = [50, 100, 180][st.size];
      x.fillStyle = st.color; x.strokeStyle = st.color; s.draw(x, p.x, p.y, size);
    }

    cv.addEventListener('pointerdown', function (e) {
      if (busy) return;
      e.preventDefault(); var p = at(e);
      if (st.tool === 'fill') { snap(); doFill(p); return; }
      if (st.tool === 'stamp') { snap(); doStamp(p); return; }
      snap(); drawing = true; pid = e.pointerId; lastPt = p; dot(p);
      try { cv.setPointerCapture(e.pointerId); } catch (er) { /* 일부 기기는 지원하지 않음 */ }
    });
    cv.addEventListener('pointermove', function (e) {
      if (!drawing || e.pointerId !== pid) return;
      e.preventDefault(); var p = at(e); seg(lastPt, p); lastPt = p;
    });
    function up(e) { if (drawing && e.pointerId === pid) { drawing = false; pid = null; } }
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);

    function setOn(sel, el) { host.querySelectorAll(sel).forEach(function (b) { b.classList.toggle('on', b === el); }); }
    function composite() {
      var s = KN.works.fit(D.W, D.H, D.JPEG_MAX), c = document.createElement('canvas'); c.width = s.w; c.height = s.h;
      var cx = c.getContext('2d'); cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, s.w, s.h);
      cx.drawImage(cv, 0, 0, s.w, s.h); if (ov) cx.drawImage(ov, 0, 0, s.w, s.h);
      return c;
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-p]'); if (!b) return;
      var a = b.getAttribute('data-p'), v = b.getAttribute('data-v');
      if (a === 'tool') { st.tool = v; setOn('#pt .ptool', b); host.querySelector('#ps').hidden = v !== 'stamp'; }
      else if (a === 'stamp') { st.stamp = v; setOn('#ps .ptool', b); }
      else if (a === 'color') { st.color = v; setOn('#pal .sw', b); if (st.tool === 'eraser') { st.tool = 'brush'; setOn('#pt .ptool', host.querySelector('#pt [data-v="brush"]')); } }
      else if (a === 'size') { st.size = +v; setOn('#psz .ptool', b); }
      else if (a === 'undo') { var im = undo.pop(); if (im) x.putImageData(im, 0, 0); else hooks.toast('더 되돌릴 게 없어요.'); }
      else if (a === 'clear') hooks.confirm('전체 지울까요?', '그린 그림이 모두 지워져요. 방금 한 것은 되돌리기로 돌아올 수 있어요.', '지우기', function () { snap(); x.fillStyle = '#ffffff'; x.fillRect(0, 0, D.W, D.H); });
      else if (a === 'save') {
        var img = '';
        try { img = composite().toDataURL('image/jpeg', D.JPEG_Q); } catch (er) { hooks.toast('그림을 만들지 못했어요.'); return; }
        var why = hooks.save(img, pic ? pic.name : '내 그림', pic ? pic.id : '');
        if (why === 'full') hooks.toast('작품은 ' + KN.works.MAX_ART + '장까지 저장할 수 있어요. 부모님이 지우면 새로 저장할 수 있어요.');
        else if (why === 'quota') hooks.toast('저장 공간이 부족해서 저장하지 못했어요. 이미지로 내려받아 두세요.');
        else { hooks.act(); hooks.toast('작품으로 저장했어요! 보관함에서 볼 수 있어요.'); }
      } else if (a === 'dl') {
        try {
          composite().toBlob(function (blob) {
            if (!blob) { hooks.toast('이미지를 만들지 못했어요.'); return; }
            var url = URL.createObjectURL(blob), l = document.createElement('a');
            l.href = url; l.download = 'kkumnamu-' + KN.today() + '.jpg'; document.body.appendChild(l); l.click(); l.remove();
            setTimeout(function () { URL.revokeObjectURL(url); }, 2000); hooks.toast('이미지로 내려받았어요. 사진첩에서 찾아보세요.');
          }, 'image/jpeg', D.JPEG_Q);
        } catch (er) { hooks.toast('내려받지 못했어요.'); }
      }
    });
    return { destroy: function () { busy = true; } };
  }

  /* 밑그림 고르는 화면의 작은 그림들 */
  function thumbs(root) {
    root.querySelectorAll('canvas[data-pic]').forEach(function (c) {
      var pic = D.pic(c.getAttribute('data-pic')); if (!pic) return;
      var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); D.drawLines(x, pic, c.width / D.W);
    });
  }

  KN.drawUI = { mount: mount, thumbs: thumbs, cur: null };
  if (typeof module !== 'undefined') module.exports = KN;
})(typeof window !== 'undefined' ? window : globalThis);
