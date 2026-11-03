// Grader Media: mobile nav toggle, footer year, hero video reduced-motion handling. No dependencies.
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); toggle.focus(); }
    });
  }
  // Hero loop: with prefers-reduced-motion, stop and unload the video so only the poster shows.
  var video = document.querySelector('.hero-video');
  if (video && window.matchMedia) {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    var apply = function () {
      if (mq.matches) {
        video.pause();
        video.removeAttribute('autoplay');
        video.preload = 'none';
      } else if (video.paused) {
        video.play().catch(function () {});
      }
    };
    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply); else if (mq.addListener) mq.addListener(apply);
  }
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
