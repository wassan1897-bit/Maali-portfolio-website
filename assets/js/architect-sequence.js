/* ================================================================
   ABOUT THE ARCHITECT - three-step scroll sequence
   ================================================================
   Step 1  the cutout of Maali rises into place
   Step 2  the fence/couch plate drops in behind him, into the card
   Step 3  the right column arrives: bio, tools, connect + badge

   Built on GSAP ScrollTrigger because it is already loaded on this
   page AND because ScrollSmoother is running here with smooth: 4 -
   ScrollTrigger is smoother-aware, so it reads the eased position
   rather than the raw scrollY that a hand-rolled scroll listener
   sees. That mismatch is what made the testimonial reveals fire in
   the wrong place earlier in this project.

   Each step is its own trigger at a progressively later scroll
   position and plays once (`once: true`), so scrolling further is
   what advances the sequence, and scrolling back up never replays or
   reverses anything - no jitter, no second entrance.

   Trigger points are 90% / 62% / 40% of the viewport, leaving 28% of
   a screen of scroll between step 1 and step 2 and 22% between step 2
   and step 3. The gaps are deliberately wide: the cutout needs to be
   read on its own before the plate lands behind it, and the card
   wants to look finished before the right column starts arriving.

   Nothing here is left behind once a step finishes: every property
   animated is opacity or a transform offset that settles at 0, so
   the card, its padding, its sizing and all type land on exactly the
   approved layout.
   ================================================================ */

(function () {
  "use strict";

  var section = document.querySelector(".about-architect");
  if (!section) return;

  // Fail open: without GSAP the section simply renders as normal.
  if (!window.gsap || !window.ScrollTrigger) return;

  // ?motion=1 (assets/js/motion-preview.js) forces motion back on for a
  // single page view on a machine whose OS has animations switched off.
  var reduced =
    !window.__motionPreview &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reduced motion: everything stays in its final position, visible.
  // Nothing is armed, so there is nothing to reveal.
  if (reduced) return;

  gsap.registerPlugin(ScrollTrigger);

  var media = section.querySelector(".architect-media");
  var plate = section.querySelector(".architect-photo-bg");
  var cutout = section.querySelector(".architect-photo-pop");
  var badge = section.querySelector(".architect-badge");
  var signature = section.querySelector(".architect-signature");
  var bio = section.querySelector(".architect-bio-block");
  var blocks = Array.prototype.slice.call(
    section.querySelectorAll(".architect-block")
  );

  if (!media || !plate || !cutout) return;

  var EASE = "power3.out";

  /* --------------------------------------------------------------
     Variable-driven offsets
     --------------------------------------------------------------
     The cutout carries a positioning transform (its translateX(-50%)
     centring). Tweening `y` on it or the badge would rewrite the
     whole transform and lose that, so these two animate a plain object
     and write the result into CSS variables that about-architect.css
     composes into the existing transform.
     -------------------------------------------------------------- */
  function varTween(el, yVar, oVar, from, to, duration, delay) {
    var state = { y: from, o: 0 };
    var apply = function () {
      el.style.setProperty(yVar, state.y + "px");
      el.style.setProperty(oVar, state.o);
    };
    apply();
    return {
      apply: apply,
      play: function () {
        gsap.to(state, {
          y: to,
          o: 1,
          duration: duration,
          delay: delay || 0,
          ease: EASE,
          onUpdate: apply,
          onComplete: function () {
            // Hand the element back to the stylesheet cleanly rather
            // than leaving inline values pinned on it.
            el.style.removeProperty(yVar);
            el.style.removeProperty(oVar);
          }
        });
      }
    };
  }

  /* --- Arm the initial states ---------------------------------- */
  var popAnim = varTween(cutout, "--pop-y", "--pop-o", 40, 0, 0.95, 0);
  var badgeAnim = varTween(badge, "--badge-y", "--badge-o", 18, 0, 0.7, 0.28);

  gsap.set(plate, { y: -30, opacity: 0 });

  var column = [bio].concat(blocks).filter(Boolean);
  gsap.set(column, { y: 24, opacity: 0 });
  if (signature) gsap.set(signature, { y: 14, opacity: 0 });

  /* --- Step 1: the cutout rises -------------------------------- */
  ScrollTrigger.create({
    trigger: media,
    start: "top 90%",
    once: true,
    onEnter: function () {
      popAnim.play();
    }
  });

  /* --- Step 2: the plate drops in behind him -------------------- */
  /* It slides down into the frame from 30px above. The frame does not
     clip (the cutout has to break its top edge), so this reads as the
     card settling into place rather than sliding out of a mask. */
  ScrollTrigger.create({
    trigger: media,
    start: "top 62%",
    once: true,
    onEnter: function () {
      gsap.to(plate, {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: EASE,
        clearProps: "transform,opacity"
      });
      if (signature) {
        gsap.to(signature, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.25,
          ease: EASE,
          clearProps: "transform,opacity"
        });
      }
    }
  });

  /* --- Step 3: the right column, staggered ---------------------- */
  ScrollTrigger.create({
    trigger: media,
    start: "top 40%",
    once: true,
    onEnter: function () {
      gsap.to(column, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: EASE,
        stagger: 0.14,
        clearProps: "transform,opacity"
      });
      badgeAnim.play();
    }
  });

  // ScrollSmoother resolves its own height after this script runs, so
  // the trigger positions are measured once everything has settled.
  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();
