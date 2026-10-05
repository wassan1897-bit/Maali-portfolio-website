/* ================================================================
   PORTFOLIO AMBIENT BACKGROUND (styles: portfolio-ambient.css)
   Watches the stage for its active card and shows that card's image,
   soft-focused, behind the section. Each image's brightness is measured
   once (a 24px sample on a canvas) to choose the light or dark wash.
   ================================================================ */
(function () {
  "use strict";

  var section = document.getElementById("projects");
  var track = section && section.querySelector("[data-portfolio-track]");
  if (!section || !track) return;

  var wrap = document.createElement("div");
  wrap.className = "pf-ambient";
  wrap.setAttribute("aria-hidden", "true");
  var layers = [document.createElement("div"), document.createElement("div")];
  layers.forEach(function (l) {
    l.className = "pf-ambient__layer";
    wrap.appendChild(l);
  });
  section.insertBefore(wrap, section.firstChild);
  section.classList.add("has-ambient");

  var front = 0;
  var current = "";
  var darkness = {};          // url -> true/false, measured once

  function urlOf(card) {
    if (!card) return "";
    var bg = card.style.backgroundImage;
    var m = bg && bg.match(/url\(["']?(.*?)["']?\)/);
    if (m) return m[1];
    var img = card.querySelector(".portfolio-video-poster, .portfolio-card-right img, img");
    return img ? img.currentSrc || img.src || "" : "";
  }

  // luminance (0-255) of the image's top band; < 128 counts as dark
  function measure(url, done) {
    if (url in darkness) return done(darkness[url]);
    var img = new Image();
    img.onload = function () {
      var dark = false;
      try {
        var c = document.createElement("canvas");
        c.width = c.height = 24;
        var ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, 24, 24);
        // only the top band matters: that is where the heading sits (the
        // card covers the middle, and the pills carry their own backing)
        var d = ctx.getImageData(0, 0, 24, 7).data, sum = 0;
        for (var i = 0; i < d.length; i += 4) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
        dark = sum / (d.length / 4) < 128;
      } catch (e) { /* unreadable: treat as light */ }
      darkness[url] = dark;
      done(dark);
    };
    img.onerror = function () { darkness[url] = false; done(false); };
    img.src = url;
  }

  function update() {
    var url = urlOf(track.querySelector(".portfolio-card.is-active"));
    if (!url || url === current) return;
    current = url;
    measure(url, function (dark) {
      if (url !== current) return;                 // a newer card took over
      var back = 1 - front;
      layers[back].style.backgroundImage = 'url("' + url + '")';
      layers[back].classList.add("is-on");
      layers[front].classList.remove("is-on");
      front = back;
      section.classList.toggle("is-ambient-dark", dark);
    });
  }

  new MutationObserver(update).observe(track, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"]
  });
  update();
})();
