/* ================================================================
   ABOUT -> FEATURED PROJECTS  ·  the hero transition, again
   ----------------------------------------------------------------
   The About section is held in place (pinned, no spacer) for two
   screens of scroll once its bottom reaches the bottom of the screen.
   Over that hold, as in hero-split.js:
     - About's content leaves (timed, so it plays the same both ways):
       the heading and label sink, the photo wipes down, the column
       falls away;
     - a statement ("Automate -> Build -> Improve.", the portfolio's
       own tagline) focuses in out of a blur, then the camera pushes
       through it;
     - the Projects section, held one screen below, rises into view.
   Scrolling back up plays the same animations in the same order, in
   reverse sequence (entrances replay as entrances).
   ================================================================ */
(function () {
  "use strict";

  var about = document.getElementById("about");
  var next = document.getElementById("projects");
  if (!about || !next || !window.gsap || !window.ScrollTrigger) return;

  var reduced =
    !window.__motionPreview &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  gsap.registerPlugin(ScrollTrigger);

  /* The statement: centred in the screen the visitor sees during the
     hold (the bottom 100svh of the held section). Styles reuse the
     hero's statement (page-white.css). */
  var layer = document.createElement("div");
  layer.className = "about-exit";
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = "position:absolute;left:0;right:0;bottom:0;height:100svh;z-index:6;pointer-events:none";
  layer.innerHTML =
    '<div class="split-hero__statement">' +
    '<span class="split-hero__statement-kick">Selected work &middot; 16 projects</span>' +
    '<p class="split-hero__statement-line">' +
    '<span class="w"><span>Automate</span></span>' +
    '<span class="w arrow"><span>&rarr;</span></span>' +
    '<span class="w"><span>Build</span></span>' +
    '<span class="w arrow"><span>&rarr;</span></span>' +
    '<span class="w"><b>Improve.</b></span>' +
    "</p>" +
    '<span class="split-hero__statement-rule" aria-hidden="true"></span>' +
    "</div>";
  about.appendChild(layer);

  var statement = layer.querySelector(".split-hero__statement");
  var kickEl = layer.querySelector(".split-hero__statement-kick");
  var words = layer.querySelectorAll(".split-hero__statement-line .w > *");
  var rule = layer.querySelector(".split-hero__statement-rule");
  gsap.set(statement, { opacity: 0 });

  // Projects waits one screen below the held About and sits above it
  next.style.position = "relative";
  next.style.zIndex = "3";
  var spaceNext = function () { next.style.marginTop = window.innerHeight + "px"; };
  spaceNext();

  var out = null, stIn = null, stOut = null;
  var gone = false, shown = false;
  var GONE_AT = 0.03;
  var ST_FROM = 0.3, ST_TO = 0.49;

  // Built fresh each time the content leaves: About's own entrance
  // (architect-sequence.js) may still be finishing on these elements
  // and clears their styles when it ends, so its tweens are stopped
  // and the exit starts from wherever they are now.
  function buildOut() {
    if (out) out.kill();
    var q = function (s) { return about.querySelector(s); };
    var heading = [q(".architect-eyebrow"), q(".architect-heading")].filter(Boolean);
    var frame = q(".architect-photo-frame");
    var media = [q(".architect-signature")].filter(Boolean);
    var column = Array.prototype.slice.call(about.querySelectorAll(
      ".architect-bio-block, .architect-block, .architect-details-row"));

    gsap.killTweensOf(heading.concat(media, column, [frame]));
    out = gsap.timeline({ paused: true, defaults: { ease: "power2.in" } })
      .fromTo(heading, { y: 0, opacity: 1 }, { y: 40, opacity: 0, duration: 0.5, stagger: 0.06 }, 0)
      .fromTo(column, { y: 0, opacity: 1 }, { y: 18, opacity: 0, duration: 0.45, stagger: 0.04 }, 0.06)
      .fromTo(media, { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0.06)
      // the badge and the frame's hairline hang outside the frame, so
      // the wipe runs 40px past every edge, all the way past its bottom
      .fromTo(frame, { clipPath: "inset(-40px -40px -40px -40px)" },
        { clipPath: "inset(" + (frame.offsetHeight + 40) + "px -40px -40px -40px)", duration: 0.9, ease: "power2.inOut" }, 0.12);
  }

  function buildSt() {
    stIn = gsap.timeline({ paused: true })
      .set(statement, { scale: 1, opacity: 1, filter: "blur(0px)" })
      .fromTo(kickEl, { opacity: 0, y: 12, letterSpacing: "0.5em" }, { opacity: 1, y: 0, letterSpacing: "0.24em", duration: 0.7, ease: "power2.out" }, 0)
      .fromTo(words, { yPercent: 110, opacity: 0, filter: "blur(12px)" },
        { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.85, stagger: 0.12, ease: "power3.out" }, 0.05)
      .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.out" }, 0.45);
    stOut = gsap.timeline({ paused: true })
      .to(statement, { scale: 1.14, opacity: 0, filter: "blur(10px)", duration: 0.5, ease: "power2.in" });
    if (shown) stIn.progress(1);
    else gsap.set(statement, { opacity: 0 });
  }

  function sync(p) {
    var g = p > GONE_AT;
    if (g !== gone) {
      gone = g;
      if (g) { buildOut(); out.timeScale(1).play(); }
      else if (out) out.timeScale(1.15).reverse();
    }
    var s = p >= ST_FROM && p <= ST_TO;
    if (s !== shown) {
      if (!stIn) buildSt();
      shown = s;
      if (s) { stOut.pause(0); stIn.restart(); }
      else { stIn.pause(); stOut.restart(); }
    }
  }

  ScrollTrigger.create({
    trigger: about,
    start: "bottom bottom",
    end: function () { return "+=" + window.innerHeight * 2; },
    pin: true,
    pinSpacing: false,
    onRefreshInit: spaceNext,
    onUpdate: function (self) { sync(self.progress); }
  });

  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
})();
