/* ================================================================
   VIDEO DEMOS LIST - hover preview, row thumbnails, paging count
   (styles: demos-list.css; paging itself: new-slider.js)
   ================================================================ */
(function () {
  "use strict";

  var section = document.getElementById("services");
  var wrap = section && section.querySelector(".feature-three-wrapper");
  if (!wrap) return;

  var rows = Array.prototype.slice.call(wrap.querySelectorAll(".feature-three-single"));
  var reduced =
    !window.__motionPreview &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------------
     1. Row thumbnails (shown on phones only, by CSS). They go inside
     .feature-three-left: the template's hover-reveal script moves a
     row's second direct child, so nothing is added at that level.
     -------------------------------------------------------------- */
  rows.forEach(function (row) {
    var src = row.getAttribute("data-thumb");
    var left = row.querySelector(".feature-three-left");
    if (!src || !left) return;
    var t = document.createElement("span");
    t.className = "demos-thumb";
    t.innerHTML = '<img src="' + src + '" alt="" loading="lazy" decoding="async" />';
    left.insertBefore(t, left.firstChild);
  });

  /* --------------------------------------------------------------
     2. Count + the last visible row's bottom border
     new-slider.js shows and hides rows (display) on Prev/Next; the
     visible set is read back after each change.
     -------------------------------------------------------------- */
  var count = section.querySelector(".demos-count");
  function sync() {
    var visible = rows.filter(function (r) { return r.style.display !== "none"; });
    rows.forEach(function (r) { r.classList.remove("is-last-visible"); });
    if (visible.length) visible[visible.length - 1].classList.add("is-last-visible");
    if (count && visible.length) {
      var first = rows.indexOf(visible[0]) + 1;
      var last = rows.indexOf(visible[visible.length - 1]) + 1;
      count.innerHTML = "Showing " + first + "&ndash;" + last + " of " + rows.length;
    }
  }
  new MutationObserver(sync).observe(wrap, { attributes: true, subtree: true, attributeFilter: ["style"] });
  sync();

  /* --------------------------------------------------------------
     3. Hover: the row lifts, the others dim, and the demo's frame
     floats beside the cursor. Fine pointers only.
     -------------------------------------------------------------- */
  var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!fine) return;

  var preview = document.createElement("div");
  preview.className = "demos-preview";
  preview.setAttribute("aria-hidden", "true");
  var imgA = new Image(), imgB = new Image();
  imgA.alt = imgB.alt = "";
  preview.appendChild(imgA);
  preview.appendChild(imgB);
  var tag = document.createElement("span");
  tag.className = "demos-preview__tag";
  tag.innerHTML = "<i></i>Watch demo";
  preview.appendChild(tag);
  document.body.appendChild(preview);

  var front = imgA;
  function showFrame(src) {
    if (front.getAttribute("src") === src) return;
    var back = front === imgA ? imgB : imgA;
    back.onload = function () {
      back.classList.add("is-shown");
      front.classList.remove("is-shown");
      front = back;
    };
    back.src = src;
  }

  // the preview trails the cursor with a little weight, and leans with
  // the direction it is moving
  var tx = 0, ty = 0, cx = 0, cy = 0, raf = null, active = false;
  function step() {
    var k = reduced ? 1 : 0.16;
    var dx = tx - cx;
    cx += dx * k;
    cy += (ty - cy) * k;
    var rot = reduced ? -3 : Math.max(-9, Math.min(5, -3 + dx * 0.06));
    preview.style.setProperty("--px", cx.toFixed(1) + "px");
    preview.style.setProperty("--py", cy.toFixed(1) + "px");
    preview.style.setProperty("--rot", rot.toFixed(2) + "deg");
    if (active || Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) raf = requestAnimationFrame(step);
    else raf = null;
  }
  function kick() { if (raf === null) raf = requestAnimationFrame(step); }

  // the preview sits to the right of the cursor, clear of the row's text
  function place(e) {
    tx = Math.min(e.clientX + 180, window.innerWidth - 180);
    ty = e.clientY;
  }

  rows.forEach(function (row) {
    var src = row.getAttribute("data-thumb");
    row.addEventListener("mouseenter", function (e) {
      rows.forEach(function (r) { r.classList.toggle("is-hot", r === row); });
      wrap.classList.add("has-hot");
      if (!src) return;
      place(e);
      if (!active) { cx = tx; cy = ty; }    // appear in place, not fly in
      active = true;
      showFrame(src);
      preview.classList.add("is-on");
      kick();
    });
    row.addEventListener("mousemove", function (e) { place(e); kick(); });
  });

  wrap.addEventListener("mouseleave", function () {
    active = false;
    rows.forEach(function (r) { r.classList.remove("is-hot"); });
    wrap.classList.remove("has-hot");
    preview.classList.remove("is-on");
  });

  // a scroll moves the rows from under a still cursor: drop the preview
  window.addEventListener("scroll", function () {
    if (!active) return;
    var r = wrap.getBoundingClientRect();
    if (ty < r.top || ty > r.bottom) wrap.dispatchEvent(new Event("mouseleave"));
  }, { passive: true });
})();
