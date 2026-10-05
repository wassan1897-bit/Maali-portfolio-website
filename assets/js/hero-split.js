/* ================================================================
   SPLIT HERO - entrance, scroll sync, list highlight
   (styles: assets/css/hero-split.css)
   ================================================================ */
(function () {
  "use strict";

  var hero = document.querySelector(".split-hero");
  if (!hero) return;

  // ?motion=1 (motion-preview.js) forces motion back on for one page view.
  var reduced =
    !window.__motionPreview &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------
     1. Entrance: the photo wipes up, the headline rises line by line,
     the panels follow. Starts when the loading screen clears; once it
     has finished, the entrance classes are dropped so the scroll-driven
     styles (which the entrance's "visible" rules outrank) take over.
     -------------------------------------------------------------- */
  if (!reduced) hero.classList.add("is-armed");

  var revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    hero.classList.add("is-ready");
    if (!reduced) {
      window.setTimeout(function () {
        hero.classList.remove("is-armed", "is-ready");
      }, 2600);
    }
  }

  var preloader = document.querySelector(".preloader");
  var preloaderVisible = preloader && getComputedStyle(preloader).display !== "none";
  if (!preloaderVisible) {
    requestAnimationFrame(function () {
      requestAnimationFrame(reveal);
    });
    window.setTimeout(reveal, 150);
  } else {
    document.addEventListener("preloader:done", function () {
      requestAnimationFrame(reveal);
    });
    window.setTimeout(reveal, 3200);
  }

  /* --------------------------------------------------------------
     2. Scroll sync with the About section
     One scrubbed value, --split-p (0 at rest, 1 when the hero's bottom
     reaches the top of the viewport); hero-split.css derives the photo
     drift and the copy/panel lift-and-fade from it. ScrollTrigger reads
     ScrollSmoother's smoothed position, which a scroll listener lags.
     -------------------------------------------------------------- */
  if (!reduced && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      onUpdate: function (self) {
        hero.style.setProperty("--split-p", self.progress.toFixed(4));
      }
    });

    /* Hero -> About, all scrubbed to the scroll (scrolling back up
       plays it in reverse). The hero is held in place (pinned) for two
       screens of scroll from the moment its bottom reaches the bottom
       of the screen; on phones, where the stacked hero is taller than
       the screen, that is its last screenful.
         0.00-0.25  the hero leaves the way it arrived, in reverse: the
                    headline sinks into its masks, the labels / list /
                    buttons fall away, the photo wipes down to white;
         0.22-0.44  that white spreads from the photo column to fill
                    the whole screen;
         0.30-0.57  a statement ("Ideas -> Systems -> Freedom.") rises
                    in to fill the empty white, then lifts away;
         0.50-1.00  About (white too, so no edge) slides up into it.
                    About carries a one-screen top margin (set below) so
                    it only arrives now. */
    var about = document.getElementById("about");
    var flood = document.createElement("div");
    flood.className = "split-hero__flood";      // styles: page-white.css
    flood.setAttribute("aria-hidden", "true");
    flood.innerHTML =
      '<div class="split-hero__statement">' +
      '<span class="split-hero__statement-kick">Maali Wassan &middot; Automation Expert</span>' +
      '<p class="split-hero__statement-line">' +
      '<span class="w"><span>Ideas</span></span>' +
      '<span class="w arrow"><span>&rarr;</span></span>' +
      '<span class="w"><span>Systems</span></span>' +
      '<span class="w arrow"><span>&rarr;</span></span>' +
      '<span class="w"><b>Freedom.</b></span>' +
      "</p>" +
      '<span class="split-hero__statement-rule" aria-hidden="true"></span>' +
      "</div>";
    hero.appendChild(flood);
    var words = flood.querySelectorAll(".split-hero__statement-line .w > *");
    var kickEl = flood.querySelector(".split-hero__statement-kick");
    var statement = flood.querySelector(".split-hero__statement");
    var rule = flood.querySelector(".split-hero__statement-rule");
    var leftCol = hero.querySelector(".split-hero__left");
    var rightCol = hero.querySelector(".split-hero__right");

    // About waits one screen below the held hero (the hero covers that
    // gap the whole time it is held, so it is never seen)
    var spaceAbout = function () {
      if (about) about.style.marginTop = window.innerHeight + "px";
    };
    spaceAbout();

    /* Three parts, so the same animation plays in both directions:
         heroOut   timed: the hero's content leaves (headline sinks,
                   labels fall, photo wipes down). Scrolling back up
                   reverses it, which replays the load entrance: photo
                   wipes up first, then the lines rise.
         stIn/out  timed: the statement focuses in whenever its stretch
                   of scroll is entered, from above or below, and is
                   pushed through whenever it is left either way.
         scrub     tied to the scroll: the white spreads from the photo
                   column and pushes the side panels apart. */
    var heroOut = null, stIn = null, stOut = null, scrub = null;
    var heroGone = false, stShown = false;
    var HERO_AT = 0.03;               // progress past which the hero leaves
    var ST_FROM = 0.3, ST_TO = 0.49;  // the statement's stretch

    function buildExit() {
      var at = scrub ? scrub.progress() : 0;
      [heroOut, stIn, stOut, scrub].forEach(function (t) { if (t) t.kill(); });
      var lines = hero.querySelectorAll(".split-hero__line");
      var bits = Array.prototype.slice.call(hero.querySelectorAll("[data-in]")).reverse();
      var vertical = hero.querySelector(".split-hero__vertical");
      var photoCol = hero.querySelector(".split-hero__photo");
      var photoBox = hero.querySelector(".split-hero__photo-inner");
      var photoImg = hero.querySelector(".split-hero__photo img");

      heroOut = gsap.timeline({ paused: true, defaults: { ease: "power2.in" } })
        .fromTo(lines, { yPercent: 0 }, { yPercent: 105, duration: 0.55, stagger: { each: 0.08, from: "end" } }, 0)
        .fromTo(bits, { opacity: 1, y: 0 }, { opacity: 0, y: 14, duration: 0.45, stagger: 0.025 }, 0.08)
        .fromTo(vertical, { opacity: 1 }, { opacity: 0, duration: 0.35 }, 0.08)
        .fromTo(photoBox, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(100% 0% 0% 0%)", duration: 0.9, ease: "power2.inOut" }, 0.15)
        .fromTo(photoImg, { "--exit-zoom": 1 }, { "--exit-zoom": 1.08, duration: 0.9, ease: "power2.inOut" }, 0.15);   // a variable: its transform is the crop
      if (heroGone) heroOut.progress(1);

      // the flood starts as exactly the photo column, wherever the
      // layout puts it, measured against the hero
      var h = hero.getBoundingClientRect(), c = photoCol.getBoundingClientRect();
      var pct = function (v, of) { return Math.max(0, (v / of) * 100).toFixed(3) + "%"; };
      var start = "inset(" + pct(c.top - h.top, h.height) + " " + pct(h.right - c.right, h.width) + " " +
        pct(h.bottom - c.bottom, h.height) + " " + pct(c.left - h.left, h.width) + ")";
      scrub = gsap.timeline({ paused: true })
        .fromTo(flood, { opacity: 0, clipPath: start }, { opacity: 1, duration: 0.001 }, 0.18)
        .to(flood, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.24, ease: "power3.inOut" }, 0.18)
        .fromTo(leftCol, { x: 0 }, { x: -70, duration: 0.24, ease: "power3.inOut" }, 0.18)
        .fromTo(rightCol, { x: 0 }, { x: 70, duration: 0.24, ease: "power3.inOut" }, 0.18)
        .to({}, { duration: 0.58 }, 0.42);
      scrub.progress(at);

      // the statement: words rise out of a blur (a lens pulling focus),
      // the hairline draws out; leaving, the camera pushes through it
      stIn = gsap.timeline({ paused: true })
        .set(statement, { scale: 1, opacity: 1, filter: "blur(0px)" })
        .fromTo(kickEl, { opacity: 0, y: 12, letterSpacing: "0.5em" }, { opacity: 1, y: 0, letterSpacing: "0.24em", duration: 0.7, ease: "power2.out" }, 0)
        .fromTo(words, { yPercent: 110, opacity: 0, filter: "blur(12px)" },
          { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.85, stagger: 0.12, ease: "power3.out" }, 0.05)
        .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power3.out" }, 0.45);
      stOut = gsap.timeline({ paused: true })
        .to(statement, { scale: 1.14, opacity: 0, filter: "blur(10px)", duration: 0.5, ease: "power2.in" });
      if (stShown) stIn.progress(1);
      else gsap.set(statement, { opacity: 0 });
    }

    function sync(p) {
      if (!scrub) return;
      scrub.progress(p);
      var gone = p > HERO_AT;
      if (gone !== heroGone) {
        heroGone = gone;
        if (gone) heroOut.timeScale(1).play();
        else heroOut.timeScale(1.15).reverse();      // the entrance again
      }
      var show = p >= ST_FROM && p <= ST_TO;
      if (show !== stShown) {
        stShown = show;
        if (show) { stOut.pause(0); stIn.restart(); }
        else { stIn.pause(); stOut.restart(); }
      }
    }

    // Built only once the entrance has finished: a GSAP timeline writes
    // its starting values the moment it is created, which would cancel
    // the entrance's hidden states on these same elements.
    var whenSettled = function (fn) {
      if (!hero.classList.contains("is-armed")) return fn();
      var mo = new MutationObserver(function () {
        if (hero.classList.contains("is-armed")) return;
        mo.disconnect();
        fn();
      });
      mo.observe(hero, { attributes: true, attributeFilter: ["class"] });
    };

    var pinST = ScrollTrigger.create({
      trigger: hero,
      start: "bottom bottom",
      end: function () { return "+=" + window.innerHeight * 2; },
      pin: true,
      pinSpacing: false,
      onRefreshInit: spaceAbout,
      onRefresh: function () { if (scrub) { buildExit(); sync(pinST.progress); } },
      onUpdate: function (self) { sync(self.progress); }
    });
    whenSettled(function () {
      buildExit();
      sync(pinST.progress);
    });
  }

  /* --------------------------------------------------------------
     3. The list's highlighted row follows the pointer (as the
     reference's selected row), and returns to the first on leave.
     -------------------------------------------------------------- */
  var list = hero.querySelector(".split-hero__list");
  if (list) {
    var rows = list.querySelectorAll("a");
    var setOn = function (row) {
      Array.prototype.forEach.call(rows, function (r) {
        r.classList.toggle("is-on", r === row);
      });
    };
    Array.prototype.forEach.call(rows, function (row) {
      row.addEventListener("mouseenter", function () { setOn(row); });
      row.addEventListener("focus", function () { setOn(row); });
    });
    list.addEventListener("mouseleave", function () { setOn(rows[0]); });
  }
})();
