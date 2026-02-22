/**
 * Stone Path perspective effect.
 * Stones toward the top of the viewport are scaled smaller and more transparent.
 * Stones near the center/bottom are full size and opacity.
 * On mobile (< 768px), only opacity changes (no scale transform).
 * Degrades gracefully without JS: stones render normally.
 */
(function () {
  'use strict';

  var stones = document.querySelectorAll('.stone-path__stone');
  if (!stones.length) return;

  var isMobile = window.matchMedia('(max-width: 767px)').matches;

  // Listen for viewport changes
  window.matchMedia('(max-width: 767px)').addEventListener('change', function (e) {
    isMobile = e.matches;
    // Reset transforms if switching to mobile
    if (isMobile) {
      stones.forEach(function (stone) {
        stone.style.transform = '';
      });
    }
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var stone = entry.target;
      var ratio = entry.intersectionRatio;

      // Map ratio to opacity: 0.5 when barely visible, 1.0 when fully in view
      var opacity = 0.5 + ratio * 0.5;
      stone.style.opacity = opacity;

      // Scale only on desktop
      if (!isMobile) {
        var scale = 0.85 + ratio * 0.15;
        stone.style.transform = 'scale(' + scale + ')';
      }
    });
  }, {
    threshold: buildThresholds(20),
    rootMargin: '0px'
  });

  stones.forEach(function (stone) {
    observer.observe(stone);
  });

  function buildThresholds(count) {
    var thresholds = [];
    for (var i = 0; i <= count; i++) {
      thresholds.push(i / count);
    }
    return thresholds;
  }
})();
