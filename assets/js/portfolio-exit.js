/* ================================================================
   FEATURED PROJECTS -> CASE STUDY  ·  camera push-in exit
   ================================================================
   Everything around the active card blurs and falls away; the card
   itself scales up and lifts, then the browser navigates. The delay
   is what makes the arrival on the next page feel continuous rather
   than like two unrelated screens.

   clearProps NAMES ITS PROPERTIES HERE, and that is deliberate.
   `clearProps: "all"` empties the entire inline style attribute, not
   just what GSAP wrote - and activeCardHTML() puts the project's
   showcase image on the active card as an inline
   `style="background-image:url(...)"`. Clearing "all" blanked that
   card white the last time it was used on this section. Only the
   properties these tweens set are ever cleared.
   ================================================================ */

(function () {
  "use strict";

  var section = document.querySelector(".portfolio-stage");
  if (!section) return;
  if (!window.gsap) return; // fail open: links behave normally

  /* transform covers scale, and these are the only other things the
     exit writes. background-image is never in this list. */
  // autoAlpha writes visibility as well as opacity: leaving it out
  // kept everything but the card hidden after coming back.
  var CLEAR = "transform,opacity,visibility,filter,boxShadow,willChange";

  // The running push-in, so a restore can stop it: bfcache freezes the
  // page mid-timeline and GSAP resumes it on return, which re-applied
  // the zoom and the fade right after the reset below.
  var exitTl = null;

  var reduced =
    !window.__motionPreview &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function surroundings(activeCard) {
    var sel = [
      ".portfolio-card-rear",
      ".portfolio-header",
      ".portfolio-pills",
      ".portfolio-arrow",
      ".portfolio-brand",
      ".portfolio-topright",
      ".portfolio-foot",
      ".portfolio-arc",
      ".portfolio-sparkle"
    ].join(",");
    return Array.prototype.slice.call(section.querySelectorAll(sel)).filter(
      function (el) {
        return el !== activeCard && !el.contains(activeCard);
      }
    );
  }

  /* A page restored from bfcache comes back with the DOM exactly as it
     was left - mid-push-in, blurred and scaled. Reset on the way back
     in rather than leaving the section wrecked. */
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    if (exitTl) { exitTl.kill(); exitTl = null; }
    var card = section.querySelector(".portfolio-card.is-active");
    var rest = surroundings(card);
    if (card) gsap.set(card, { clearProps: CLEAR });
    if (rest.length) gsap.set(rest, { clearProps: CLEAR });
  });

  section.addEventListener("click", function (e) {
    var btn = e.target.closest && e.target.closest(".portfolio-view-btn, .portfolio-case-link");
    if (!btn) return;

    var href = btn.getAttribute("href");
    // Placeholder links and "open in new tab" intents are left alone.
    if (!href || href === "#" || href.charAt(0) === "#") return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (btn.target === "_blank") return;

    var card = btn.closest(".portfolio-card");
    if (!card) return;

    e.preventDefault();

    if (reduced) {
      window.location.href = href;
      return;
    }

    var rest = surroundings(card);

    gsap.set([card].concat(rest), { willChange: "transform, opacity, filter" });

    // One navigation, whichever path gets there first.
    var gone = false;
    var navigate = function () {
      if (gone) return;
      gone = true;
      window.location.href = href;
    };

    // If the tab is backgrounded the timeline stalls; never strand the
    // click without a navigation.
    var failsafe = window.setTimeout(navigate, 900);

    var tl = exitTl = gsap.timeline({
      onComplete: function () {
        window.clearTimeout(failsafe);
        navigate();
      }
    });

    /* Depth of field: everything that is not the subject drops out. */
    if (rest.length) {
      tl.to(rest, {
        filter: "blur(10px)",
        autoAlpha: 0,
        duration: 0.35,
        ease: "power2.out"
      }, 0);
    }

    /* Focal zoom: the camera flies into the project canvas. */
    tl.to(card, {
      scale: 1.12,
      boxShadow: "0 60px 120px -40px rgba(22, 21, 19, 0.45)",
      duration: 0.5,
      ease: "power3.in"
    }, 0);

    /* Navigate once the push-in has had time to read, rather than at
       the very end of the 0.5s zoom - the arrival picks it up from
       here, so the two halves overlap instead of pausing between. */
    tl.call(navigate, null, 0.35);
  });
})();
