/* ================================================================
   ABOUT THE ARCHITECT - motion only
   Four behaviours, none of which touch layout, type, colour or copy:

     1. scroll-linked word-by-word reveal (headline + body)
     2. infinite tool marquee built from the existing grid
     3. one diagonal shimmer across the 6+ badge every few seconds
     4. magnetic pull on the social controls, pointer devices only

   Everything animates transform and opacity. Scroll and pointer work
   is centralised into a single rAF loop rather than one per element.
   ================================================================ */

(function () {
  "use strict";

  var section = document.querySelector(".about-architect");
  if (!section) return;

  // ?motion=1 (assets/js/motion-preview.js) forces motion back on for a
  // single page view so the work can be previewed on a machine whose OS
  // has animations switched off.
  var reduced =
    !window.__motionPreview &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var finePointer =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* --------------------------------------------------------------
     1. Word-by-word reveal
     --------------------------------------------------------------
     Words are wrapped by walking text nodes, so <strong> and <br>
     survive untouched and bold phrases keep their weight. The
     headline gets an aria-label carrying the original string, because
     its words become inline-block to be transformable and some screen
     readers announce inline-block runs separately. Body words stay
     inline and animate opacity only, so their reading is unaffected.
     -------------------------------------------------------------- */
  function wrapWords(root, opts) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var textNodes = [];
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim()) textNodes.push(node);
    }

    var words = [];
    textNodes.forEach(function (textNode) {
      var frag = document.createDocumentFragment();
      // Split on whitespace but keep it, so spacing and wrapping are
      // exactly what they were before.
      var parts = textNode.nodeValue.split(/(\s+)/);
      parts.forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        var span = document.createElement("span");
        span.className = opts.wordClass;
        span.textContent = part;
        frag.appendChild(span);
        words.push(span);
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
    return words;
  }

  var revealTargets = [];

  function prepareReveal(el, wordClass, label) {
    if (!el) return;
    var original = el.textContent.replace(/\s+/g, " ").trim();
    var words = wrapWords(el, { wordClass: wordClass });
    if (!words.length) return;
    if (label) el.setAttribute("aria-label", original);
    el.setAttribute("data-word-reveal", "");
    revealTargets.push({ el: el, words: words, shown: -1 });
  }

  var heading = section.querySelector(".architect-heading");
  var bioBlock = section.querySelector(".architect-bio-block");

  prepareReveal(heading, "aw-word aw-word--lead", true);
  var headingTarget = revealTargets.length ? revealTargets[0] : null;

  Array.prototype.forEach.call(
    section.querySelectorAll(".architect-bio"),
    function (p) {
      prepareReveal(p, "aw-word aw-word--body", false);
    }
  );
  var bodyTargets = revealTargets.slice(headingTarget ? 1 : 0);

  var staged = false;

  if (revealTargets.length) {
    section.classList.add("has-word-reveal");
    if (reduced) {
      // Everything visible, immediately, permanently.
      revealTargets.forEach(function (t) {
        t.words.forEach(function (w) {
          w.classList.add("is-revealed");
        });
      });
      revealTargets.length = 0;
    }
  }

  // Two-stage pacing. The attribute is what arms the hidden state in
  // CSS, so it is only ever set once JS is confirmed running and never
  // under reduced motion.
  if (!reduced) {
    section.setAttribute("data-staged", "");
    staged = true;
  }

  var stage1In = false;
  var stage2In = false;

  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  // Reveal is one-way throughout: once a word is lit it stays lit, so
  // scrolling back up never dims text that has already been read.
  function lightWords(target, fraction) {
    if (!target) return;
    var count = Math.round(clamp01(fraction) * target.words.length);
    if (count <= target.shown) return;
    for (var i = target.shown < 0 ? 0 : target.shown; i < count; i++) {
      if (target.words[i]) target.words[i].classList.add("is-revealed");
    }
    target.shown = count;
  }

  function updateReveal() {
    if (!staged && !revealTargets.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;

    /* ---- Stage 1: the statement, on its own ----------------------
       Progress is measured from the headline itself rather than the
       whole section, so the reader gets close to a full viewport of
       scroll to finish reading it before anything else appears. */
    var anchor = heading || section;
    var headTop = anchor.getBoundingClientRect().top;
    var travel = vh * 0.88;
    var p1 = clamp01((vh - headTop) / travel);

    if (!stage1In && p1 > 0.02) {
      stage1In = true;
      section.classList.add("is-stage-1");
    }

    // Words finish a little before the stage does, so the headline is
    // fully lit and readable while the reader is still on it.
    lightWords(headingTarget, p1 / 0.85);

    /* ---- Stage 2: everything below ------------------------------
       Only once the headline has been read through. */
    if (!stage2In && p1 >= 0.95) {
      stage2In = true;
      section.classList.add("is-stage-2");
    }

    if (!stage2In || !bodyTargets.length) return;

    /* ---- Body copy, on its own travel --------------------------- */
    var bioTop = (bioBlock || section).getBoundingClientRect().top;
    var p2 = clamp01((vh - bioTop) / (vh * 0.8));
    bodyTargets.forEach(function (t) {
      lightWords(t, p2 / 0.8);
    });
  }

  /* --------------------------------------------------------------
     2. Tool marquee
     --------------------------------------------------------------
     The grid becomes a single track. Card width is pinned to whatever
     the grid was already rendering, so each card keeps the exact size
     it was approved at instead of collapsing to its content width.
     -------------------------------------------------------------- */
  var grid = section.querySelector(".tool-grid");
  if (grid && grid.children.length) {
    var originals = Array.prototype.slice.call(grid.children);

    // Read the approved grid before converting it. The column count is
    // not fixed: the stylesheet drops from 7 to 3 at 767px and to 2 at
    // 420px, so deriving the card width from a hardcoded 7 produced
    // 41px cards on a phone.
    var declaredCols = (getComputedStyle(grid).gridTemplateColumns || "")
      .split(" ")
      .filter(function (v) {
        return v && v !== "none";
      }).length;

    var columnsFor = function () {
      var w = window.innerWidth;
      if (w <= 420) return 2;
      if (w <= 767) return 3;
      return declaredCols || 7;
    };

    var cardWidth = originals[0].getBoundingClientRect().width;

    var marquee = document.createElement("div");
    marquee.className = "tools-marquee";
    grid.parentNode.insertBefore(marquee, grid);
    marquee.appendChild(grid);
    grid.classList.add("tools-marquee-track");

    // Exactly one duplicate set, hidden from assistive tech so the tool
    // list is not announced twice.
    originals.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("tabindex", "-1");
      grid.appendChild(clone);
    });

    var applyCardWidth = function () {
      marquee.style.setProperty("--tool-card-w", cardWidth + "px");
    };

    var measure = function () {
      // Re-derive the width the approved grid would have produced at
      // this breakpoint: N columns and N-1 gaps in the same container.
      var host = marquee.parentNode;
      var available = (host ? host.getBoundingClientRect().width : 0) ||
        marquee.getBoundingClientRect().width;
      var cols = columnsFor();
      var gap = parseFloat(getComputedStyle(grid).columnGap) || 10;
      var next = (available - gap * (cols - 1)) / cols;
      if (next > 0) {
        cardWidth = next;
        applyCardWidth();
      }
    };

    measure();
    var resizeTimer = null;
    window.addEventListener(
      "resize",
      function () {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(measure, 150);
      },
      { passive: true }
    );
  }

  /* --------------------------------------------------------------
     4. Magnetic social controls
     --------------------------------------------------------------
     Pointer devices only, and never driven by focus - keyboard users
     get the untouched focus ring, not a moving target. One shared rAF
     loop drives every item.
     -------------------------------------------------------------- */
  var magnets = [];

  if (!reduced && finePointer) {
    var links = section.querySelectorAll(".connect-link");
    Array.prototype.forEach.call(links, function (link) {
      var icon = link.querySelector(".connect-icon");
      var label = link.querySelector(".connect-label");
      if (!icon) return;
      magnets.push({
        link: link,
        icon: icon,
        label: label,
        tx: 0, ty: 0, cx: 0, cy: 0,
        active: false
      });
    });

    var MAX = 7;      // icon travel, px
    var LABEL_MAX = 2; // label travel, px
    var RANGE = 90;   // hit area padding beyond the link box
    var running = false;

    var loop = function () {
      var moving = false;
      magnets.forEach(function (m) {
        m.cx += (m.tx - m.cx) * 0.14;
        m.cy += (m.ty - m.cy) * 0.14;
        if (Math.abs(m.tx - m.cx) > 0.01 || Math.abs(m.ty - m.cy) > 0.01) {
          moving = true;
        }
        m.icon.style.transform =
          "translate3d(" + m.cx.toFixed(2) + "px," + m.cy.toFixed(2) + "px,0)";
        if (m.label) {
          var lr = LABEL_MAX / MAX;
          m.label.style.transform =
            "translate3d(" + (m.cx * lr).toFixed(2) + "px," +
            (m.cy * lr).toFixed(2) + "px,0)";
        }
      });
      if (moving) {
        requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    var kick = function () {
      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    };

    var onPointerMove = function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      magnets.forEach(function (m) {
        var r = m.link.getBoundingClientRect();
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        // Hit area is larger than the control, without the control
        // itself changing size.
        var within =
          Math.abs(dx) < r.width / 2 + RANGE &&
          Math.abs(dy) < r.height / 2 + RANGE;

        if (within) {
          var reach = Math.max(r.width, r.height) / 2 + RANGE;
          m.tx = Math.max(-MAX, Math.min(MAX, (dx / reach) * MAX * 1.6));
          m.ty = Math.max(-MAX, Math.min(MAX, (dy / reach) * MAX * 1.6));
          if (!m.active) {
            m.active = true;
            m.link.classList.add("is-magnetic");
          }
        } else if (m.active || m.tx || m.ty) {
          m.tx = 0;
          m.ty = 0;
          m.active = false;
          m.link.classList.remove("is-magnetic");
        }
      });
      kick();
    };

    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener(
      "pointerleave",
      function () {
        magnets.forEach(function (m) {
          m.tx = 0;
          m.ty = 0;
          m.active = false;
          m.link.classList.remove("is-magnetic");
        });
        kick();
      },
      { passive: true }
    );
  }

  /* --------------------------------------------------------------
     Scroll loop - one passive listener, one rAF, for the reveal
     -------------------------------------------------------------- */
  if (revealTargets.length || staged) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        updateReveal();
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    updateReveal();
    // ScrollSmoother moves content by transform, so a plain scroll event
    // is not always enough to reflect what is on screen; a low-rate
    // poll keeps the reveal honest without a per-frame loop.
    setInterval(onScroll, 120);
  }
})();
