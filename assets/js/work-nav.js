/* ================================================================
   Work + About nav fix
   ================================================================
   Native hash jumps fight GSAP ScrollSmoother. This intercepts only
   the navbar Work (#projects) and About (#about) links, scrolls ONCE
   via ScrollSmoother, then restores section visibility if an entrance
   tween froze. Home / Services / Contact are not handled here.
   ================================================================ */
(function () {
  "use strict";

  var CLEAR = "transform,opacity,visibility";
  var scrolling = false;
  var settleTimer = null;

  var TARGETS = {
    "#projects": "projects",
    "#about": "about"
  };

  function getSmoother() {
    try {
      return window.ScrollSmoother && typeof ScrollSmoother.get === "function"
        ? ScrollSmoother.get()
        : null;
    } catch (err) {
      return null;
    }
  }

  function isNavbarTargetLink(link) {
    if (!link || link.tagName !== "A") return false;
    var href = link.getAttribute("href");
    if (!TARGETS[href]) return false;
    if (link.classList.contains("hero-nav-link")) return true;
    if (link.closest(".hero-mobile-nav")) return true;
    return false;
  }

  function portfolioNodes(section) {
    if (!section) return [];
    var headers = [
      section.querySelector(".portfolio-eyebrow"),
      section.querySelector(".portfolio-heading"),
      section.querySelector(".portfolio-subtitle")
    ].filter(Boolean);

    var center = section.querySelector(".portfolio-card.is-active");
    var sides = Array.prototype.slice
      .call(section.querySelectorAll(".portfolio-card-rear"))
      .filter(function (el) {
        return !el.classList.contains("depth-3");
      });
    var controls = Array.prototype.slice.call(
      section.querySelectorAll(".portfolio-pill, .portfolio-arrow")
    );

    return headers
      .concat(center ? [center] : [])
      .concat(sides)
      .concat(controls);
  }

  function ensureWorkVisible(section) {
    if (!window.gsap || !section) return;
    var nodes = portfolioNodes(section);
    if (!nodes.length) return;
    gsap.killTweensOf(nodes);
    gsap.set(nodes, { clearProps: CLEAR });
  }

  function ensureAboutVisible(section) {
    if (!window.gsap || !section) return;

    var plate = section.querySelector(".architect-photo-bg");
    var cutout = section.querySelector(".architect-photo-pop");
    var badge = section.querySelector(".architect-badge");
    var signature = section.querySelector(".architect-signature");
    var bio = section.querySelector(".architect-bio-block");
    var blocks = Array.prototype.slice.call(
      section.querySelectorAll(".architect-block")
    );

    var nodes = [plate, signature, bio]
      .concat(blocks)
      .filter(Boolean);

    if (nodes.length) {
      gsap.killTweensOf(nodes);
      gsap.set(nodes, { clearProps: CLEAR });
    }

    // CSS defaults to visible when these vars are absent.
    if (cutout) {
      gsap.killTweensOf(cutout);
      cutout.style.removeProperty("--pop-y");
      cutout.style.removeProperty("--pop-o");
    }
    if (badge) {
      gsap.killTweensOf(badge);
      badge.style.removeProperty("--badge-y");
      badge.style.removeProperty("--badge-o");
    }
  }

  function ensureVisible(hash, section) {
    if (hash === "#projects") ensureWorkVisible(section);
    else if (hash === "#about") ensureAboutVisible(section);
  }

  function goToSection(e) {
    var link = e.target.closest && e.target.closest("a");
    if (!isNavbarTargetLink(link)) return;

    var href = link.getAttribute("href");
    var section = document.getElementById(TARGETS[href]);
    if (!section) return;

    e.preventDefault();
    e.stopPropagation();

    if (scrolling) return;
    scrolling = true;

    if (settleTimer) {
      window.clearTimeout(settleTimer);
      settleTimer = null;
    }

    if (window.history && typeof history.replaceState === "function") {
      history.replaceState(null, "", href);
    }

    var smoother = getSmoother();

    if (smoother) {
      // One scroll only. Avoid ScrollTrigger.refresh() afterward - it
      // remeasures and makes the smoother jump down repeatedly.
      var y = smoother.offset(section, "top top");
      smoother.scrollTo(y, true);
    } else {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    settleTimer = window.setTimeout(function () {
      ensureVisible(href, section);
      scrolling = false;
      settleTimer = null;
    }, 1100);
  }

  document.addEventListener("click", goToSection, true);
})();
