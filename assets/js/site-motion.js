/* ================================================================
   SITE MOTION - page-wide scroll behaviour
   (section entrances live in each section's own script, and the
   generic ones in reveal.js)

   1. In-page links glide to their section.
      With ScrollSmoother running, a plain #anchor makes the browser
      jump the real scroll position while the smoothed content drifts
      after it. Here every same-page link goes through the smoother's
      own scrollTo, the same way work-nav.js already moves Work and
      About, so all of them glide identically.

   2. Layout-affecting late loads (web fonts, images) refresh every
      ScrollTrigger once, so no entrance fires against stale positions.
   ================================================================ */
(function () {
  "use strict";

  var reduced = function () {
    return (
      !window.__motionPreview &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  };

  var smoother = function () {
    return window.ScrollSmoother && window.ScrollSmoother.get
      ? window.ScrollSmoother.get()
      : null;
  };

  /* ---------------------------------------------------------------
     1. Anchor links
     --------------------------------------------------------------- */
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    var link = e.target.closest && e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute("href").slice(1);
    if (!id) return;                              // bare "#": leave it alone
    var target = document.getElementById(id);
    if (!target) return;

    var sm = smoother();
    e.preventDefault();

    if (sm) {
      // The smoother's own scrollTo moves the real scroll position and
      // glides the content after it with the page's normal smoothing.
      // (Tweening sm.scrollTop directly moved only the content, which then
      // snapped back to the top and glided down a second time.)
      var to = sm.offset(target, "top top");
      sm.scrollTo(to, !reduced());
    } else {
      target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
    }

    if (history.pushState) history.pushState(null, "", "#" + id);
  });

  /* ---------------------------------------------------------------
     1b. Opened with a section in the address (#projects, #about...):
     start at that section. The browser's own jump does not land
     reliably under ScrollSmoother, so the smoother is sent there once
     the layout has settled.
     --------------------------------------------------------------- */
  // a case study's "Back to Portfolio" leaves "returnTo" behind, for
  // when the browser reloads this page instead of restoring it
  var returnTo = null;
  try { returnTo = sessionStorage.getItem("returnTo"); } catch (e) {}
  // cleared once the page has loaded: main.js reads it at
  // DOMContentLoaded, which is after this script runs
  window.addEventListener("load", function () {
    try { sessionStorage.removeItem("returnTo"); } catch (e) {}
  });
  var navEntry = performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
  var isReload = navEntry && navEntry.type === "reload";
  var startHash = isReload ? "" : location.hash.slice(1) || returnTo;
  // A refresh opens at the top: drop a leftover #section from the
  // address (it would otherwise send the next refresh there too) and
  // keep the browser from restoring the old scroll position.
  if (isReload) {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (location.hash && history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    window.scrollTo(0, 0);
    // the browser (and ScrollSmoother) restore the old position after
    // load, so the top is set again once everything has settled
    var toTop = function () {
      var sm = smoother();
      if (sm) sm.scrollTo(0, false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("load", function () {
      toTop();
      window.setTimeout(toTop, 60);
      window.setTimeout(toTop, 400);
    });
  }
  if (startHash && startHash !== "home") {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    var goStart = function () {
      var target = document.getElementById(startHash);
      var sm = smoother();
      if (!target) return;
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      if (sm) sm.scrollTo(sm.offset(target, "top top"), false);
      else target.scrollIntoView({ block: "start" });
    };
    window.addEventListener("load", function () {
      goStart();
      // once more after fonts/images settle the trigger positions
      window.setTimeout(goStart, 400);
    });
  }

  /* ---------------------------------------------------------------
     2. Refresh trigger positions after late layout changes
     --------------------------------------------------------------- */
  var refresh = function () {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  window.addEventListener("load", function () {
    window.setTimeout(refresh, 150);
  });
})();
