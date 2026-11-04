// Grader Media: mobile nav toggle, footer year, hero video reduced-motion handling, quote form submit. No dependencies.
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
  // Quote form: submit to Formspree (emails hello@austingrader.com) with fetch and show the result inline.
  // Without JS the form posts normally and Formspree shows its own thank-you page.
  var form = document.getElementById('quote-form');
  if (form && window.fetch && window.FormData) {
    var errorBox = document.getElementById('quote-form-error');
    var success = document.getElementById('quote-form-success');
    var submitBtn = form.querySelector('[type="submit"]');
    var btnLabel = submitBtn ? submitBtn.textContent : '';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errorBox) errorBox.hidden = true;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending\u2026'; }
      fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' }, body: new FormData(form) })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          form.hidden = true;
          if (success) { success.hidden = false; success.focus(); }
        })
        .catch(function () {
          if (errorBox) { errorBox.hidden = false; errorBox.scrollIntoView({ block: 'nearest' }); }
        })
        .then(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = btnLabel; }
        });
    });
  }
})();
