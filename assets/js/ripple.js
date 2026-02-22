/**
 * Threshold ripple effect.
 * Continuous water ripple: rings spawn every few seconds, expand outward,
 * fade, and are recycled. The canvas stays in the DOM permanently.
 * Pure canvas, no dependencies. Degrades gracefully if canvas is unsupported.
 */
(function () {
  'use strict';

  var container = document.querySelector('.threshold__water');
  if (!container) return;

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;';
  container.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var dpr = window.devicePixelRatio || 1;
  var width = 0;
  var height = 0;
  var cx = 0;
  var cy = 0;

  function resize() {
    width = container.offsetWidth;
    height = container.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = width / 2;
    cy = height / 2;
  }

  resize();
  window.addEventListener('resize', resize);

  /** @type {Array<{radius: number, opacity: number, maxRadius: number, lineWidth: number, active: boolean}>} */
  var pool = [];
  var poolSize = 4;
  var spawnInterval = 2500;
  var lastSpawn = 0;

  for (var i = 0; i < poolSize; i++) {
    pool.push({
      radius: 0,
      opacity: 0,
      maxRadius: 0,
      lineWidth: 1.2,
      active: false
    });
  }

  /**
   * @param {number} t
   * @returns {number}
   */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function spawnRing() {
    var maxR = Math.max(width, height) * 0.45;
    for (var i = 0; i < pool.length; i++) {
      if (!pool[i].active) {
        pool[i].radius = 0;
        pool[i].opacity = 0.3;
        pool[i].maxRadius = maxR;
        pool[i].lineWidth = 1.2;
        pool[i].active = true;
        return;
      }
    }
  }

  var expansionSpeed = 0.00013;

  /**
   * @param {number} timestamp
   */
  function draw(timestamp) {
    if (timestamp - lastSpawn > spawnInterval || lastSpawn === 0) {
      spawnRing();
      lastSpawn = timestamp;
    }

    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < pool.length; i++) {
      var ring = pool[i];
      if (!ring.active) continue;

      var progress = ring.radius / ring.maxRadius;
      if (progress >= 1) {
        ring.active = false;
        continue;
      }

      ring.radius += ring.maxRadius * expansionSpeed * 16.67;
      ring.opacity = 0.3 * (1 - easeOutCubic(progress));

      if (ring.opacity < 0.003) {
        ring.active = false;
        continue;
      }

      ctx.beginPath();
      ctx.arc(cx, cy, ring.radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(143, 164, 162, ' + ring.opacity.toFixed(3) + ')';
      ctx.lineWidth = ring.lineWidth * (1 - progress * 0.5);
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  setTimeout(function () {
    requestAnimationFrame(draw);
  }, 200);
})();
