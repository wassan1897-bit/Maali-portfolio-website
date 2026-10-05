/* ================================================================
   FEATURED PROJECTS - scroll entrance
   ================================================================
   GSAP ScrollTrigger, one timeline, `once: true`, `clearProps` on
   everything so the coverflow's own CSS keeps ownership of the card
   transforms the moment the entrance finishes.

   Three things about this section forced the brief's snippet to be
   adapted rather than pasted:

   1. THE TRACK IS EMPTY IN THE HTML. `.portfolio-track` and
      `.portfolio-pills` are filled by portfolio-stage.js, and its
      render() does `track.innerHTML = ""` and rebuilds every node on
      every arrow press and every category change. So the cards are
      queried inside onEnter - at build time they do not exist, and a
      reference captured then would be to nodes that get thrown away.

   2. `x` IS ABSOLUTE IN GSAP, NOT AN OFFSET. A rear card rests on
      `translateX(calc(-50% - var(--card-w) * var(--d1))) scale(...)`,
      so its parsed x is a large negative pixel value. `x: 60` would
      not nudge it 60px - it would set x to 60 and fling the card
      several hundred pixels across the stage. The tweens below use
      relative strings (`"+=60"` / `"-=60"`) so the offset composes
      with whatever the CSS resolved to.

   3. THE SIDE CLASS IS `portfolio-card-rear--left/right`, not
      `.is-left`.

   Depth-3 cards are skipped: they rest at `opacity: 0` with
   pointer-events off - they exist to hold the fan's shape, and
   animating them in would reveal cards the design hides.

   4. clearProps MUST NAME ITS PROPERTIES. `clearProps: "all"` empties
      the whole inline style attribute, not just what GSAP wrote - and
      activeCardHTML() puts the showcase image on the active card as an
      inline `style="background-image:url(...)"`. Clearing "all" took
      that with it and the card went blank white after the entrance.
      Only the properties these tweens actually set are cleared.
   ================================================================ */

/* transform covers x / y / scale; opacity and visibility cover
   autoAlpha. Nothing else is touched, so the carousel's inline
   background-image survives. */
var CLEAR = "transform,opacity,visibility";

(function () {
  "use strict";

  var section = document.querySelector(".portfolio-stage");
  if (!section) return;

  // Fail open: without GSAP the section renders exactly as it does now.
  if (!window.gsap || !window.ScrollTrigger) return;

  // ?motion=1 (assets/js/motion-preview.js) forces motion back on for a
  // single page view on a machine whose OS has animations switched off.
  var reduced =
    !window.__motionPreview &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Nothing is armed hidden anywhere in this file - every tween is a
  // `.from()`, so bailing here simply leaves the section as authored.
  if (reduced) return;

  gsap.registerPlugin(ScrollTrigger);

  var headers = [
    section.querySelector(".portfolio-eyebrow"),
    section.querySelector(".portfolio-heading"),
    section.querySelector(".portfolio-subtitle")
  ].filter(Boolean);

  var EASE = "power3.out";

  // Replays whenever the section comes back into view, from either
  // direction (not while a play is still running).
  var running = null;
  ScrollTrigger.create({
    trigger: section,
    start: "top 80%",
    end: "bottom 20%",
    onEnterBack: function () { play(); },
    onEnter: function () { play(); }
  });

  function play() {
      if (running && running.isActive()) return;
      /* Queried here, not above: see note 1. */
      var centerCard = section.querySelector(".portfolio-card.is-active");
      var sideCards = Array.prototype.slice
        .call(section.querySelectorAll(".portfolio-card-rear"))
        .filter(function (el) {
          // Depth-3 rests invisible by design - leave it alone.
          return !el.classList.contains("depth-3");
        });
      var controls = Array.prototype.slice.call(
        section.querySelectorAll(".portfolio-pill, .portfolio-arrow")
      );

      var tl = running = gsap.timeline();

      /* --- Step 1: headings drop in ---------------------------- */
      if (headers.length) {
        tl.from(headers, {
          y: -20,
          autoAlpha: 0,
          duration: 0.6,
          ease: EASE,
          stagger: 0.08,
          clearProps: CLEAR
        });
      }

      /* --- Step 2: the active card rises ------------------------ */
      /* y and scale are safe as absolutes here: the active card rests
         on `translateX(-50%)` with no y and no scale, so 0 and 1 are
         its real end values. Only x would have been dangerous. */
      if (centerCard) {
        tl.from(
          centerCard,
          {
            y: 40,
            scale: 0.92,
            autoAlpha: 0,
            duration: 0.8,
            ease: "back.out(1.2)",
            clearProps: CLEAR
          },
          "-=0.3"
        );
      }

      /* --- Step 3: the flanks fan out --------------------------- */
      /* Relative offsets (see note 2). Left cards start nearer the
         centre (less negative) and travel out; right cards mirror it.
         `autoAlpha: 0` animates to each card's own resting opacity -
         0.9 at depth-1, 0.72 at depth-2 - because a `.from()` reads
         the current value as the destination, so the fan keeps its
         depth falloff instead of flattening to full opacity. */
      if (sideCards.length) {
        tl.from(
          sideCards,
          {
            x: function (i, el) {
              return el.classList.contains("portfolio-card-rear--left")
                ? "+=60"
                : "-=60";
            },
            autoAlpha: 0,
            duration: 0.8,
            ease: EASE,
            stagger: 0.1,
            clearProps: CLEAR
          },
          "-=0.5"
        );
      }

      /* --- Step 4: pills and arrows ----------------------------- */
      if (controls.length) {
        tl.from(
          controls,
          {
            y: 20,
            autoAlpha: 0,
            duration: 0.6,
            ease: EASE,
            stagger: 0.04,
            clearProps: CLEAR
          },
          "-=0.4"
        );
      }
  }

  // ScrollSmoother settles its height after this runs, so the trigger
  // position is re-measured once the page has finished loading.
  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();
