/* Shared scroll motion for the six resume design studies.
 *
 * Convention:
 *   data-parallax="0.3"   -> vertical drift; speed is a fraction (higher = faster)
 *   data-parallax-x="0.4" -> horizontal drift (driven by vertical scroll position)
 *
 * Shifts are applied via the CSS `translate` property (el.style.translate), which
 * composes independently of any authored `transform` (rotation, centering), so
 * decorative art keeps its own composition. Only the individual translate is
 * cleared under prefers-reduced-motion. Vertical measurement subtracts the last
 * applied Y so repeated scroll/resize at the same position gives the same result.
 * All content stays visible in flow without JS; this only adds drift.
 */
(function () {
  'use strict';

  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var root = document.documentElement;
  var reduce = mq.matches;
  var vertical = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var horizontal = Array.prototype.slice.call(document.querySelectorAll('[data-parallax-x]'));
  var ticking = false;
  var lastY = new WeakMap();

  function clearMotion() {
    var i, el;
    for (i = 0; i < vertical.length; i++) {
      el = vertical[i];
      el.style.translate = '';
      lastY.set(el, 0);
    }
    for (i = 0; i < horizontal.length; i++) {
      el = horizontal[i];
      el.style.translate = '';
    }
  }

  function update() {
    ticking = false;
    if (reduce) return;
    var vh = window.innerHeight || 1;
    var i, el, r, p, y, x, prev;

    for (i = 0; i < vertical.length; i++) {
      el = vertical[i];
      r = el.getBoundingClientRect();
      prev = lastY.get(el) || 0;
      // r.top includes the previously applied translate; remove it first.
      p = (vh - (r.top - prev)) / (vh + r.height);
      y = (p - 0.5) * (parseFloat(el.getAttribute('data-parallax')) || 0) * 180;
      el.style.translate = '0px ' + y.toFixed(2) + 'px';
      lastY.set(el, Number(y.toFixed(2)));
    }

    for (i = 0; i < horizontal.length; i++) {
      el = horizontal[i];
      r = el.getBoundingClientRect();
      // Horizontal shift never changes r.top, so no feedback correction needed.
      p = (vh - r.top) / (vh + r.height);
      x = (p - 0.5) * (parseFloat(el.getAttribute('data-parallax-x')) || 0) * 240;
      el.style.translate = x.toFixed(2) + 'px 0px';
    }
  }

  function schedule() {
    if (ticking || reduce) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  function setReduce(value) {
    reduce = value;
    root.classList.toggle('no-motion', value);
    if (value) clearMotion();
    else schedule();
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });

  if (mq.addEventListener) {
    mq.addEventListener('change', function (e) { setReduce(e.matches); });
  } else if (mq.addListener) {
    mq.addListener(function (e) { setReduce(e.matches); });
  }

  setReduce(reduce);
  update();
})();
