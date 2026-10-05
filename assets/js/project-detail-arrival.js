/* ================================================================
   CASE STUDY  ·  cinematic arrival
   ================================================================
   Picks up where the carousel's push-in left off: the page settles
   out of a slight over-scale, the showcase panel drops in with a
   weighted 3D tilt, the headings slide up from behind masks, the
   metrics count, and the case-study cards rise.

   Runs after project-detail.js, which renders every data-driven
   element - querying any of this earlier would find empty containers.

   clearProps NAMES ITS PROPERTIES. `clearProps: "all"` empties the
   whole inline style attribute rather than only what GSAP wrote, and
   this page has elements carrying inline styles of their own. Only
   what these tweens set is ever cleared.
   ================================================================ */

(function () {
  "use strict";

  var root = document.documentElement;
  var main = document.querySelector("main[data-project-slug]");
  if (!main) return;

  // Fail open: no GSAP, no cinematic - the page's own .pd-ready fade
  // stays in charge and everything is visible.
  if (!window.gsap) return;

  var reduced =
    !window.__motionPreview &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  var CLEAR = "transform,opacity,visibility,willChange";
  var EASE = "power3.out";

  function all(sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  }

  /* --------------------------------------------------------------
     Metric count-up
     --------------------------------------------------------------
     The rendered values carry their own formatting - "11,220", "100%",
     "20". The number is parsed out, counted, and re-formatted with the
     original thousands separators and suffix so the settled text is
     character-for-character what the data said.
     -------------------------------------------------------------- */
  function countUp(el, duration) {
    var finalText = el.textContent.trim();
    var match = finalText.match(/^([\d.,]+)(.*)$/);
    if (!match) return;

    var raw = match[1];
    var suffix = match[2] || "";
    var grouped = raw.indexOf(",") !== -1;
    var target = parseFloat(raw.replace(/,/g, ""));
    if (isNaN(target)) return;

    // Hold the settled width so the strip cannot reflow while digits change.
    var w = el.getBoundingClientRect().width;
    if (w) el.style.minWidth = w + "px";

    var state = { v: 0 };
    gsap.to(state, {
      v: target,
      duration: duration || 1.1,
      ease: "power2.out",
      onUpdate: function () {
        var n = Math.round(state.v);
        el.textContent = (grouped ? n.toLocaleString("en-US") : String(n)) + suffix;
      },
      onComplete: function () {
        el.textContent = finalText;
        el.style.removeProperty("min-width");
      }
    });
  }

  function play() {
    root.classList.add("pd-cinematic");

    var titleLines = all(".pd-title-line-inner");
    var visual = document.querySelector(".pd-visual-frame");
    var breadcrumb = document.querySelector(".pd-breadcrumb");
    var description = document.querySelector(".pd-description");
    var actions = all(".pd-actions .pd-btn");
    var metaTags = all(".pd-meta-tag");
    var annotation = document.querySelector(".pd-annotation-row");
    var strip = document.querySelector(".pd-strip-card");
    var metricValues = all(".pd-metric-value");
    var cards = all(".pd-card");

    var tl = gsap.timeline();

    /* --- Hero canvas: the focal settle ------------------------- */
    /* Carries straight on from the carousel's push-in: the page lands
       fractionally over-scaled and eases down to rest. */
    tl.from(main, {
      scale: 1.05,
      autoAlpha: 0,
      duration: 0.8,
      ease: "power4.out",
      clearProps: CLEAR
    }, 0);

    /* --- Showcase panel: weighted 3D drop ---------------------- */
    if (visual) {
      tl.from(visual, {
        rotateX: 5,
        y: 35,
        autoAlpha: 0,
        transformOrigin: "50% 0%",
        duration: 0.9,
        ease: EASE,
        clearProps: CLEAR
      }, 0.15);
    }

    /* --- Masked line reveals ----------------------------------- */
    if (breadcrumb) {
      tl.from(breadcrumb, {
        y: 12,
        autoAlpha: 0,
        duration: 0.5,
        ease: EASE,
        clearProps: CLEAR
      }, 0.2);
    }

    if (titleLines.length) {
      tl.from(titleLines, {
        yPercent: 100,
        duration: 0.85,
        ease: "power4.out",
        stagger: 0.09,
        clearProps: CLEAR
      }, 0.28);
    }

    /* --- Tight stagger behind the title ------------------------ */
    var behind = [description]
      .concat(actions)
      .concat(metaTags)
      .concat(annotation ? [annotation] : [])
      .filter(Boolean);

    if (behind.length) {
      tl.from(behind, {
        y: 18,
        autoAlpha: 0,
        duration: 0.6,
        ease: EASE,
        stagger: 0.06,
        clearProps: CLEAR
      }, 0.55);
    }

    /* --- Metrics strip + ignition ------------------------------ */
    if (strip) {
      tl.from(strip, {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        ease: EASE,
        clearProps: CLEAR
      }, 0.7);
    }

    tl.call(function () {
      metricValues.forEach(function (el) {
        countUp(el, 1.1);
      });
    }, null, 0.85);

    /* --- Case-study cards -------------------------------------- */
    if (cards.length) {
      tl.from(cards, {
        y: 30,
        autoAlpha: 0,
        duration: 0.65,
        ease: EASE,
        stagger: 0.08,
        clearProps: CLEAR
      }, 0.95);
    }
  }

  /* project-detail.js sets .pd-ready at the end of render(). If it has
     already run by the time this file executes, go immediately;
     otherwise wait for the class to appear. */
  function start() {
    if (root.classList.contains("pd-ready")) {
      requestAnimationFrame(play);
      return;
    }
    var mo = new MutationObserver(function () {
      if (!root.classList.contains("pd-ready")) return;
      mo.disconnect();
      requestAnimationFrame(play);
    });
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    // Never strand the page if the render never signals.
    window.setTimeout(function () {
      mo.disconnect();
      if (!root.classList.contains("pd-cinematic")) play();
    }, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
