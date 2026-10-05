/* ================================================================
   FINAL CTA + FOOTER - scroll entrance
   Plays once, when the section scrolls into view:

     0.00s   Maali (fade + rise, settles from a slight scale)
     0.45s   background plate fades in behind him
     1.00s   eyebrow, headline, subtext, buttons, handwritten note
     ~1.6s   footer

   Maali is a real layer (maali-cta-cutout.png) and stays on screen;
   the plate (maali-cta-background.jpg) arrives behind him. Afterwards a
   small scroll parallax moves the plate further than Maali, so the two
   read as separate depths.
   ================================================================ */
(function () {
  "use strict";

  var page = document.querySelector(".final-page");
  if (!page) return;

  var cta = page.querySelector(".final-cta");
  var bg = page.querySelector(".cta-bg");
  var maali = page.querySelector(".maali-cutout");
  var footerInner = page.querySelector(".site-footer-final-inner");
  var content = page.querySelectorAll(
    ".cta-eyebrow, .cta-headline, .cta-subtext, .cta-actions, .handwritten-message"
  );

  if (!cta || !bg || !maali) return;

  // ?motion=1 (assets/js/motion-preview.js) previews motion on a machine
  // with animations switched off.
  var reduced =
    !window.__motionPreview &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // No motion, or no GSAP: nothing is hidden, so nothing needs revealing.
  if (reduced || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  page.classList.add("is-armed");

  var stacked = window.matchMedia("(max-width: 1099px)").matches;

  gsap.set(maali, { opacity: 0, y: 40, scale: 0.97, transformOrigin: "50% 100%" });
  gsap.set(bg, { opacity: 0, scale: 1.04, transformOrigin: "70% 50%" });
  gsap.set(content, { opacity: 0, y: 22 });
  if (footerInner) gsap.set(footerInner, { opacity: 0, y: 18 });

  var entered = false;
  var done = false;

  function playEntrance() {
    if (entered) return;
    entered = true;

    var tl = gsap.timeline({
      onComplete: function () {
        done = true;
        // Hand the transforms back to CSS except where the parallax
        // below owns them.
        gsap.set(content, { clearProps: "transform,opacity" });
        if (footerInner) gsap.set(footerInner, { clearProps: "transform,opacity" });
      }
    });

    tl.to(maali, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }, 0)
      .to(bg, { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" }, 0.45)
      .to(content, { opacity: 1, y: 0, stagger: 0.09, duration: 0.6, ease: "power2.out" }, 1.0);

    if (footerInner) {
      tl.to(footerInner, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" }, 1.45);
    }
  }

  // Scrolling back above the section re-arms it (off-screen, so the
  // reset is never seen) and it plays again on the way back down.
  function rearm() {
    if (!entered) return;
    gsap.killTweensOf([maali, bg, content, footerInner].filter(Boolean));
    entered = false;
    done = false;
    gsap.set(maali, { opacity: 0, y: 40, scale: 0.97 });
    gsap.set(bg, { opacity: 0, scale: 1.04, y: 0 });
    gsap.set(content, { opacity: 0, y: 22 });
    if (footerInner) gsap.set(footerInner, { opacity: 0, y: 18 });
  }

  ScrollTrigger.create({
    trigger: page,
    start: "top 75%",
    onEnter: playEntrance
  });
  ScrollTrigger.create({
    trigger: page,
    start: "top bottom",
    onLeaveBack: rearm
  });

  // Landing straight on #contact (or a restored scroll position already
  // past the trigger) plays the entrance immediately.
  requestAnimationFrame(function () {
    var rect = page.getBoundingClientRect();
    if (location.hash === "#contact" || (rect.top < window.innerHeight * 0.85 && rect.bottom > 0)) {
      playEntrance();
    }
  });

  // Depth on scroll (side-by-side layout only): the plate travels further
  // than Maali while the band crosses the screen.
  if (!stacked) {
    ScrollTrigger.create({
      trigger: cta,
      start: "top bottom",
      end: "bottom top",
      onUpdate: function (self) {
        if (!done) return;
        var p = self.progress - 0.5;
        gsap.set(bg, { y: p * 26 });
        gsap.set(maali, { y: p * 10 });
      }
    });
  }

  // A page that returns from the back/forward cache must not come back
  // mid-animation or hidden.
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    gsap.set([maali, bg], { opacity: 1, scale: 1 });
    gsap.set(content, { opacity: 1, y: 0 });
    if (footerInner) gsap.set(footerInner, { opacity: 1, y: 0 });
    entered = done = true;
  });

  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();
