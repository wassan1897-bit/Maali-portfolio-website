/* ================================================================
   SCROLL REVEAL - IntersectionObserver trigger for [data-reveal]
   See assets/css/reveal.css for the motion and for why this replaces
   AOS.

   Nothing here measures the page: IntersectionObserver reports each
   element's real rendered position, so the ScrollSmoother transform is
   already accounted for and browser zoom cannot move the trigger.

   Stagger: everything that crosses the trigger line in the same
   observer callback is revealed in DOM order, STAGGER_MS apart, so a
   row of logos or a group of badges ripples in without any per-element
   delay attributes. An explicit data-reveal-delay still wins.
   ================================================================ */

(function () {
  "use strict";

  // Fire once ~8% of the viewport height still separates the element from
  // the bottom edge: late enough to be seen happening, early enough that
  // nothing waits below the fold.
  var ROOT_MARGIN = "0px 0px -8% 0px";
  var STAGGER_MS = 70;
  var MAX_STAGGER_STEPS = 8;       // a big batch never takes over ~0.5s to start
  var SETTLE_MS = 1100;            // longest entrance transition + a margin

  function settleLater(el, delay) {
    window.setTimeout(function () {
      el.classList.add("is-settled");
      el.style.transitionDelay = "";
    }, delay + SETTLE_MS);
  }

  function revealNow(el, delay) {
    var explicit = el.getAttribute("data-reveal-delay");
    var d = explicit ? parseInt(explicit, 10) : delay || 0;
    if (d) el.style.transitionDelay = d + "ms";
    el.classList.add("is-revealed");
    settleLater(el, d);
  }

  function applyDuration(el) {
    var duration = el.getAttribute("data-reveal-duration");
    if (duration) el.style.transitionDuration = duration + "ms";
  }

  function start() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    // ?motion=1 (motion-preview.js) previews motion on a machine with
    // animations switched off.
    var reduced =
      !window.__motionPreview &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Fail open: the CSS starts these at opacity 0.
    if (reduced || typeof window.IntersectionObserver !== "function") {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add("reveal-disabled");
      });
      return;
    }

    Array.prototype.forEach.call(items, applyDuration);

    /* Two-way: an element that has fully left the screen is re-armed
       (hidden again, off-screen, so it is never seen going), and plays
       again when it comes back. If it left through the top it re-arms
       above its place (.reveal-from-above), so scrolling up it arrives
       downward, the way the eye is travelling. */
    var rearm = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var el = e.target;
          if (e.isIntersecting || !el.classList.contains("is-revealed")) return;
          var above = e.boundingClientRect.bottom <= 0;
          el.classList.remove("is-revealed", "is-settled");
          el.classList.toggle("reveal-from-above", above);
          el.style.transitionDelay = "";
          observer.observe(el);
        });
      },
      { root: null, rootMargin: "0px", threshold: 0 }
    );

    var observer = new IntersectionObserver(
      function (entries) {
        var entering = entries
          .filter(function (e) { return e.isIntersecting; })
          .map(function (e) { return e.target; });
        if (!entering.length) return;

        // DOM order, so a grid ripples left-to-right, top-to-bottom.
        entering.sort(function (a, b) {
          return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });

        // scrolling up, the batch ripples from the bottom up
        if (entering[0].classList.contains("reveal-from-above")) entering.reverse();
        entering.forEach(function (el, i) {
          revealNow(el, Math.min(i, MAX_STAGGER_STEPS) * STAGGER_MS);
          observer.unobserve(el);
          rearm.observe(el);
        });
      },
      { root: null, rootMargin: ROOT_MARGIN, threshold: 0 }
    );

    Array.prototype.forEach.call(items, function (el) {
      observer.observe(el);
    });

    // Safety net for elements scrolled past while the tab was hidden or
    // throttled, and for bfcache restores: anything on screen is shown.
    window.addEventListener("pageshow", function () {
      Array.prototype.forEach.call(
        document.querySelectorAll("[data-reveal]:not(.is-revealed)"),
        function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            revealNow(el, 0);
            observer.unobserve(el);
          }
        }
      );
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
