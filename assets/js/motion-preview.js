/* ================================================================
   MOTION PREVIEW OVERRIDE - ?motion=1
   ================================================================
   This machine (and any machine with "Show animations in Windows"
   switched off) reports prefers-reduced-motion: reduce, so every
   motion behaviour on the site correctly disables itself and there is
   nothing to look at. Adding ?motion=1 to the URL turns the motion
   back on for that page view only, so the work can be previewed
   without changing an OS accessibility setting.

   It works by retargeting the reduced-motion media rules in our own
   stylesheets rather than by duplicating any animation declarations,
   so there is exactly one definition of every animation on the site
   and this file can be deleted without leaving anything behind.

   Real visitors are never affected: without the parameter, the
   reduced-motion preference is honoured exactly as before.
   ================================================================ */

(function () {
  "use strict";

  var wanted = false;
  try {
    var params = new URLSearchParams(window.location.search);
    var value = params.get("motion");
    wanted = value === "1" || value === "on" || value === "true";
  } catch (e) {
    wanted = /[?&]motion=(1|on|true)\b/.test(window.location.search);
  }

  // Read by hero.js and architect-motion.js in place of their own
  // matchMedia check, so the JS-driven behaviours (counters, cursor
  // parallax, magnetic icons, scroll reveals) come back too.
  window.__motionPreview = wanted;

  if (!wanted) return;

  document.documentElement.classList.add("motion-preview");

  // Only our own stylesheets. Bootstrap also ships reduced-motion
  // blocks, including a (prefers-reduced-motion: no-preference) one it
  // uses to ENABLE its transitions - retargeting that would switch
  // vendor behaviour off, which has nothing to do with previewing this
  // work. An explicit allowlist keeps the blast radius at zero.
  var OURS = [
    "hero-transition.css",
    "about-architect.css",
    "reveal.css",
    "portfolio-stage.css",
    "demo-showcase.css",
    "project-detail.css"
  ];

  var isOurs = function (href) {
    if (!href) return false;
    var name = href.split("/").pop().split("?")[0];
    return OURS.indexOf(name) !== -1;
  };

  // Cross-origin sheets throw on cssRules access, so each is tried
  // separately.
  var disabled = 0;
  Array.prototype.forEach.call(document.styleSheets, function (sheet) {
    if (!isOurs(sheet.href)) return;
    var rules;
    try {
      rules = sheet.cssRules;
    } catch (e) {
      return;
    }
    if (!rules) return;
    Array.prototype.forEach.call(rules, function (rule) {
      if (!rule.media) return;
      var text = rule.conditionText || rule.media.mediaText || "";
      // Only the `reduce` blocks. Never `no-preference`.
      if (text.indexOf("prefers-reduced-motion") === -1) return;
      if (text.indexOf("reduce") === -1) return;
      try {
        rule.media.mediaText = "not all";
        disabled++;
      } catch (e) {
        /* some engines refuse to rewrite mediaText; nothing to do */
      }
    });
  });

  if (window.console && console.info) {
    console.info(
      "[motion-preview] ?motion=1 active - " +
        disabled +
        " reduced-motion block(s) bypassed for this page view."
    );
  }
})();
