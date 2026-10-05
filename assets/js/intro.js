/* ================================================================
   OPENING  (styles: intro.css)
   1  a small window of Maali's photo opens in the centre of the cream,
      the counter starts;
   2  it grows tall, "Automation Expert" and the name arrive;
   3  it travels to exactly the hero's photo column (measured), while
      the name and labels leave;
   4  the overlay fades away over the identical photo underneath and
      the hero's text plays its entrance ("preloader:done").
   The counter holds at 99 until the page has loaded (max ~6s).
   main.js hides this element (and announces preloader:done itself)
   when the loader is skipped: back/forward, links to a section.
   ================================================================ */
(function () {
  "use strict";

  var intro = document.querySelector(".preloader[data-intro]");
  var hero = document.querySelector(".split-hero");
  if (!intro) return;
  // the chat launcher waits until the opening has finished
  document.documentElement.classList.add("is-intro");

  // the hero's entrance starts while the overlay is still fading...
  function announce() {
    if (intro.__announced) return;
    intro.__announced = true;
    document.dispatchEvent(new CustomEvent("preloader:done"));
  }
  // ...and the overlay goes once it has
  function done() {
    announce();
    intro.style.display = "none";
    document.documentElement.classList.remove("is-intro");
  }

  var reduced =
    !window.__motionPreview &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    // skipped by main.js (it set display:none and announced done)
    if (getComputedStyle(intro).display === "none") {
      document.documentElement.classList.remove("is-intro");
      return;
    }
    if (reduced || !window.gsap) {
      if (window.gsap) gsap.to(intro, { opacity: 0, duration: 0.4, onComplete: done });
      else done();
      return;
    }

    var ap = intro.querySelector(".intro-ap");
    var top = intro.querySelector(".intro-label--top");
    var nameWrap = intro.querySelector(".intro-name");
    var name = intro.querySelector(".intro-name span");
    var count = intro.querySelector("[data-intro-count]");
    var bar = intro.querySelector("[data-intro-bar]");
    var inner = intro.querySelector(".intro-ap-inner");
    var photo = hero && hero.querySelector(".split-hero__photo");

    var W = window.innerWidth, H = window.innerHeight;
    var small = Math.min(110, W * 0.26);
    var tallW = Math.min(240, W * 0.5), tallH = Math.min(420, H * 0.5);
    var at = function (w, h, dy) {
      return { left: (W - w) / 2, top: (H - h) / 2 + (dy || 0), width: w, height: h };
    };
    gsap.set(ap, at(0, 0));

    var counter = { n: 0 };
    var loaded = document.readyState === "complete";
    window.addEventListener("load", function () { loaded = true; });

    var tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    tl.to(ap, Object.assign(at(small, small * 1.15, -H * 0.04), { duration: 0.7, ease: "power3.out" }), 0.15)
      .to(counter, {
        n: 99, duration: 2.0, ease: "power1.inOut",
        onUpdate: function () {
          count.textContent = String(Math.round(counter.n)).padStart(3, "0");
          if (bar) bar.style.transform = "scaleX(" + (counter.n / 100).toFixed(3) + ")";
        }
      }, 0.1)
      // a slow camera push: the photo settles from a slight zoom as the
      // window grows (on the inner box; the img's transform is the crop)
      .fromTo(inner, { scale: 1.14 }, { scale: 1, duration: 2.6, ease: "power2.out" }, 0.15)
      .to(ap, Object.assign(at(tallW, tallH, -H * 0.05), { duration: 0.75 }), 0.9)
      .to(top, { opacity: 1, duration: 0.5, ease: "power2.out" }, 1.0)
      .to(name, { y: 0, duration: 0.8, ease: "power3.out" }, 1.05)
      .addLabel("land", 1.95)
      .call(function () {
        // hold here until the page has loaded (never more than ~6s in)
        if (loaded || tl.time() > 6) return;
        tl.pause();
        var resume = function () { tl.resume(); };
        window.addEventListener("load", resume, { once: true });
        setTimeout(resume, 4000);
      }, null, "land")
      .add(function () { count.textContent = "100"; if (bar) bar.style.transform = "scaleX(1)"; }, "land")
      .to([top, nameWrap], { opacity: 0, y: -16, duration: 0.45, ease: "power2.in" }, "land")
      .add(function () {
        // the hero's photo column, measured now (layout has settled)
        var r = photo ? photo.getBoundingClientRect() : { left: 0, top: 0, width: W, height: H };
        gsap.to(ap, { left: r.left, top: r.top, width: r.width, height: r.height, duration: 0.95, ease: "power3.inOut" });
        if (hero) hero.classList.add("after-intro");
      }, "land+=0.1")
      .to([intro.querySelector(".intro-count"), intro.querySelector(".intro-bar")], { opacity: 0, duration: 0.3 }, "land+=0.6")
      // hand-off: the cream fades over the identical photo underneath
      .call(announce, null, "land+=1.0")
      .to(intro, { backgroundColor: "rgba(250,249,246,0)", duration: 0.6, ease: "power1.out" }, "land+=1.05")
      .to(ap, { opacity: 0, duration: 0.2 }, "land+=1.6")
      .call(done, null, "land+=1.85");

    // never strand the visitor behind the overlay
    setTimeout(done, 9000);
  });
})();
