// Grader Media: mobile nav toggle, footer year, hero video reduced-motion handling, quote form submit, recent-project video reel. No dependencies.
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

  // Recent-project reel: one privacy-enhanced YouTube embed, created only after Play.
  // Changing slides removes that iframe so playback stops and two videos cannot run together.
  var reel = document.getElementById('work-reel');
  if (reel) {
    var slides = Array.prototype.slice.call(reel.querySelectorAll('.work-reel-slide'));
    var dots = Array.prototype.slice.call(reel.querySelectorAll('.work-reel-dot'));
    var frame = document.getElementById('work-reel-frame');
    var prevBtn = reel.querySelector('.work-reel-prev');
    var nextBtn = reel.querySelector('.work-reel-next');
    var titleEl = document.getElementById('work-reel-title');
    var catEl = document.getElementById('work-reel-category');
    var indexEl = document.getElementById('work-reel-index');
    var statusEl = document.getElementById('work-reel-status');
    var count = slides.length;
    var index = 0;
    var busy = false;
    var suppressClick = false;
    var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

    function slideTitle(i) { return slides[i].getAttribute('data-title') || ''; }
    function slideCategory(i) { return slides[i].getAttribute('data-category') || ''; }
    function reducedMotion() { return !!(reduceQuery && reduceQuery.matches); }

    function stopPlayback() {
      var iframe = reel.querySelector('iframe');
      if (!iframe || !iframe.parentNode) return;
      var slide = iframe.parentNode;
      iframe.parentNode.removeChild(iframe);
      if (slide._playLink && !slide._playLink.parentNode) slide.appendChild(slide._playLink);
    }

    function applyMeta(i, announce) {
      if (titleEl) titleEl.textContent = slideTitle(i);
      if (catEl) catEl.textContent = slideCategory(i);
      if (indexEl) indexEl.textContent = String(i + 1);
      if (prevBtn) prevBtn.setAttribute('aria-label', 'Previous video: ' + slideTitle((i - 1 + count) % count));
      if (nextBtn) nextBtn.setAttribute('aria-label', 'Next video: ' + slideTitle((i + 1) % count));
      for (var d = 0; d < dots.length; d++) {
        if (d === i) dots[d].setAttribute('aria-current', 'true');
        else dots[d].removeAttribute('aria-current');
      }
      for (var s = 0; s < count; s++) slides[s].setAttribute('aria-label', (s + 1) + ' of ' + count);
      if (announce && statusEl) {
        statusEl.textContent = 'Showing ' + slideTitle(i) + ', ' + slideCategory(i) + '. Video ' + (i + 1) + ' of ' + count + '.';
      }
    }

    function applySlides(i) {
      for (var s = 0; s < count; s++) {
        var on = s === i;
        slides[s].classList.toggle('is-active', on);
        slides[s].setAttribute('aria-hidden', on ? 'false' : 'true');
        if ('inert' in slides[s]) slides[s].inert = !on;
      }
      index = i;
    }

    function focusedSlot() {
      var active = document.activeElement;
      if (!active || !reel.contains(active)) return '';
      if (active.classList.contains('work-reel-prev')) return 'prev';
      if (active.classList.contains('work-reel-next')) return 'next';
      if (active.classList.contains('work-reel-dot')) return 'dot';
      if (active.closest && active.closest('.work-reel-slide')) return 'slide';
      return '';
    }

    function restoreFocus(slot, i) {
      if (slot === 'slide') {
        var link = slides[i]._playLink;
        if (link) link.focus();
      } else if (slot === 'dot' && dots[i]) {
        dots[i].focus();
      }
    }

    function finishMove(fromEl, toEl, target) {
      fromEl.classList.remove('is-leaving', 'is-animating');
      toEl.classList.remove('is-incoming', 'is-animating');
      fromEl.style.transform = '';
      toEl.style.transform = '';
      applySlides(target);
      busy = false;
    }

    function goTo(next, dir, slot) {
      if (busy || !count) return;
      next = (next % count + count) % count;
      if (next === index) return;
      if (!slot) slot = focusedSlot();
      stopPlayback();
      if (dir !== 1 && dir !== -1) dir = next > index ? 1 : -1;
      var from = index;
      var fromEl = slides[from];
      var toEl = slides[next];
      applyMeta(next, slot !== 'slide');
      if (reducedMotion()) {
        applySlides(next);
        restoreFocus(slot, next);
        return;
      }
      busy = true;
      if ('inert' in toEl) toEl.inert = false;
      toEl.setAttribute('aria-hidden', 'false');
      toEl.classList.add('is-incoming');
      fromEl.classList.add('is-leaving');
      if ('inert' in fromEl) fromEl.inert = true;
      toEl.style.transform = 'translateX(' + (dir * 100) + '%)';
      fromEl.style.transform = 'translateX(0)';
      void toEl.offsetWidth;
      toEl.classList.add('is-animating');
      fromEl.classList.add('is-animating');
      void toEl.offsetWidth;
      toEl.style.transform = 'translateX(0)';
      fromEl.style.transform = 'translateX(' + (-dir * 100) + '%)';
      restoreFocus(slot, next);
      var finished = false;
      var finish = function () {
        if (finished) return;
        finished = true;
        fromEl.removeEventListener('transitionend', onEnd);
        finishMove(fromEl, toEl, next);
      };
      var onEnd = function (e) {
        if (e.target !== fromEl || e.propertyName !== 'transform') return;
        finish();
      };
      fromEl.addEventListener('transitionend', onEnd);
      window.setTimeout(finish, 700);
    }

    function play(slide) {
      if (!slide || slide.querySelector('iframe')) return;
      stopPlayback();
      var link = slide._playLink;
      var id = slide.getAttribute('data-yt');
      var title = slide.getAttribute('data-title') || 'Project video';
      if (!link || !id) return;
      var iframe = document.createElement('iframe');
      iframe.className = 'work-reel-iframe';
      // autoplay here is the Play control the user just activated, not carousel autoplay.
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?rel=0&modestbranding=1&playsinline=1&autoplay=1';
      iframe.title = title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.allowFullscreen = true;
      if (link.parentNode) link.parentNode.removeChild(link);
      slide.appendChild(iframe);
      iframe.focus();
    }

    for (var i = 0; i < count; i++) {
      slides[i]._playLink = slides[i].querySelector('.work-reel-play');
      (function (slide) {
        var link = slide._playLink;
        if (!link) return;
        link.addEventListener('click', function (e) {
          if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          if (suppressClick) { suppressClick = false; e.preventDefault(); return; }
          e.preventDefault();
          play(slide);
        });
      })(slides[i]);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1, -1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1, 1); });
    for (var n = 0; n < dots.length; n++) {
      dots[n].addEventListener('click', function () {
        var dotIndex = Number(this.getAttribute('data-index'));
        if (!isNaN(dotIndex)) goTo(dotIndex);
      });
    }

    reel.addEventListener('keydown', function (e) {
      var key = e.key;
      if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (!e.target || !reel.contains(e.target) || e.target.tagName === 'IFRAME') return;
      e.preventDefault();
      if (key === 'Home') goTo(0, index === 0 ? 0 : -1);
      else if (key === 'End') goTo(count - 1, index === count - 1 ? 0 : 1);
      else if (key === 'ArrowRight') goTo(index + 1, 1);
      else goTo(index - 1, -1);
    });

    if (frame && window.PointerEvent) {
      var swipe = null;
      frame.addEventListener('pointerdown', function (e) {
        if (frame.querySelector('iframe')) return;
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        swipe = { id: e.pointerId, x: e.clientX, y: e.clientY, captured: false };
      });
      frame.addEventListener('pointermove', function (e) {
        if (!swipe || e.pointerId !== swipe.id || swipe.captured) return;
        var dx = e.clientX - swipe.x;
        var dy = e.clientY - swipe.y;
        if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
          swipe.captured = true;
          try { if (frame.setPointerCapture) frame.setPointerCapture(e.pointerId); } catch (err) {}
        }
      });
      frame.addEventListener('pointerup', function (e) {
        if (!swipe || e.pointerId !== swipe.id) return;
        var dx = e.clientX - swipe.x;
        var dy = e.clientY - swipe.y;
        swipe = null;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
        suppressClick = true;
        window.setTimeout(function () { suppressClick = false; }, 400);
        goTo(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      });
      frame.addEventListener('pointercancel', function () { swipe = null; });
    }

    applyMeta(0, false);
    applySlides(0);
  }
})();
