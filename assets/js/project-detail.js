/* ==========================================================================
   PROJECT DETAIL - renderer
   Generic across every case-study page: reads the slug from the root
   element's data-project-slug, looks the entry up in
   window.PROJECT_DETAILS (project-detail-data.js), and renders every
   section from it. Adding a new project means adding a new entry to that
   data file and a thin HTML shell that points at it - this file does not
   change.
   ========================================================================== */

(function () {
  "use strict";

  var ICONS = {
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.9h2.65l.4-3.08H13.5V8.05c0-.89.25-1.5 1.52-1.5h1.63V3.8A21.8 21.8 0 0 0 14.3 3.7c-2.16 0-3.64 1.32-3.64 3.75v2.37H8v3.08h2.66V21h2.84Z"/></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9"/><path d="M3 5h18l1.2 4.2a2 2 0 0 1-2 2.3 2.2 2.2 0 0 1-2.2-2M14 9.5a2.2 2.2 0 0 1-4.4 0M6 9.5a2.2 2.2 0 0 1-4.4 0 2 2 0 0 1-2-2.3L3 5"/></svg>',
    sparkle: '<svg viewBox="0 0 18 18" fill="none"><path d="M9 1.5c.35 2.55 1.1 4.3 2.25 5.25S14.05 8.65 16.5 9c-2.45.35-4.2 1.1-5.25 2.25S9.35 14.05 9 16.5c-.35-2.45-1.1-4.2-2.25-5.25S3.95 9.35 1.5 9c2.45-.35 4.2-1.1 5.25-2.25S8.65 3.95 9 1.5Z" fill="currentColor"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10.5c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10.5" r="2.6"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="13.5 5.5 20 12 13.5 18.5"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="20" y1="12" x2="4" y2="12"/><polyline points="10.5 5.5 4 12 10.5 18.5"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.5c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>',
    quote: '<svg viewBox="0 0 32 24" fill="currentColor"><path d="M9.2 0C4.1 2.6 0 7.9 0 14.1 0 19.4 3.3 23 7.7 23c3.7 0 6.3-2.9 6.3-6.3 0-3.3-2.3-5.7-5.3-5.7-.6 0-1.1.1-1.4.2C7.9 7.4 10.9 4 15 1.9L9.2 0Zm17 0c-5.1 2.6-9.2 7.9-9.2 14.1 0 5.3 3.3 8.9 7.7 8.9 3.7 0 6.3-2.9 6.3-6.3 0-3.3-2.3-5.7-5.3-5.7-.6 0-1.1.1-1.4.2C24.9 7.4 27.9 4 32 1.9L26.2 0Z"/></svg>',
    star: '<svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1.5 12.6 7l6 .87-4.35 4.24L15.3 18 10 15.1 4.7 18l1.05-5.9L1.4 7.87 7.4 7 10 1.5Z"/></svg>',
    check: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.5 8 14.5 16 5.5"/></svg>'
  };

  var TOOL_ICONS = {
    n8n: "n8n.svg", supabase: "supabase.svg", meta: "meta.svg",
    gemini: "google-g.svg", vercel: "vercel.svg", python: "python.svg",
    openai: "openai.svg", anthropic: "anthropic.svg", twilio: "twilio.svg",
    airtable: "airtable.svg", hubspot: "hubspot.svg", stripe: "stripe.svg",
    make: "make.svg", wordpress: "wordpress.svg", facebook: "facebook.svg",
    reddit: "reddit.svg", threads: "threads.svg", pinterest: "pinterest.svg",
    twitter: "x-twitter.svg", javascript: "javascript.svg",
    seatable: "seatable.svg", webproxy: "webproxy.svg",
    vector_search: "qdrant.svg", graph_rag: "graph-rag.svg",
    file_search: "file-search.svg", data_ingestion: "googledrive.svg",
    dedupe: "dedupe.svg", multi_format: "file-types.svg",
    vd_hubspot: "hubspot.svg", vd_sql_servers: "g-database.svg", vd_call_transcripts: "g-transcript.svg",
    vd_email_drafting: "g-email.svg", vd_crm_dashboard: "g-dashboard.svg", vd_master_agent: "g-agent.svg",
    vd_sql_agent: "g-sqlagent.svg", vd_qdrant: "qdrant.svg", vd_tool_calls: "g-toolcall.svg",
    retellai: "retellai.png", vd_outbound: "g-phone.svg", vd_qualify: "g-qualify.svg",
    vd_objections: "g-objection.svg", vd_booking: "g-calendar.svg", vd_call_analysis: "g-analytics.svg",
    vd_voiceflow: "g-flowchat.svg", vd_postgres: "postgresql.svg", vd_text_to_sql: "g-texttosql.svg",
    vd_crm_sync: "g-sync.svg", vd_schema: "g-schema.svg", vd_auto_tasks: "g-tasks.svg",
    vd_commissions: "g-commission.svg", vd_gmail: "gmail.svg", vd_pdf_extract: "g-pdf.svg",
    vd_weekly: "g-schedule.svg", vd_roundup: "g-newsletter.svg", vd_python: "python.svg",
    gohighlevel: "gohighlevel.png", vd_servicem8: "g-fieldservice.svg", vd_dedupe: "dedupe.svg",
    vd_pipeline_map: "g-pipeline.svg", vd_claude: "claude.svg", vd_directory: "g-folders.svg",
    vd_task_file: "g-tasklist.svg", vd_project_memory: "g-memory.svg", vd_live_query: "g-livequery.svg",
    vd_business_context: "g-report.svg", vd_aios_dashboard: "g-dashboard.svg", vd_memory_rules: "g-memory.svg",
    vd_feedback_rules: "g-rules.svg", vd_scheduled_agents: "g-schedule.svg", vd_reports: "g-report.svg",
    vd_code_review: "g-review.svg", vd_access_policies: "g-shield.svg", vd_secrets: "g-key.svg",
    vd_persistence: "g-persistence.svg", vd_auth_edges: "g-lock.svg", vd_estimate: "g-estimate.svg"
    // apify, closecom, voiceflow, dalle: not in this asset folder (dalle
    // has no separate Simple Icons entry, the rest confirmed 404 there,
    // the same source every other fetched icon here comes from) - those
    // tool pills render text-only, same fallback as the
    // "Outbound Call" pill on the Voice Agent page.
  };

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  ICONS.play = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.9-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z"/></svg>';

  function icon(key) { return ICONS[key] || ""; }

  function starsHTML(rating) {
    var out = "";
    for (var i = 0; i < 5; i++) {
      out += '<span class="pd-star' + (i < rating ? " is-filled" : "") + '">' + icon("star") + "</span>";
    }
    return out;
  }

  function actionHTML(a) {
    var cls = "pd-btn " + (a.style === "outline" ? "pd-btn--outline" : "pd-btn--solid");
    return (
      '<a class="' + cls + '" href="' + esc(a.href) + '"' +
      (a.external ? ' target="_blank" rel="noopener"' : "") + ">" +
      (a.icon ? '<span class="pd-btn-icon" aria-hidden="true">' + icon(a.icon) + "</span>" : "") +
      "<span>" + esc(a.label) + "</span>" +
      (a.style !== "outline" ? '<span class="pd-btn-icon pd-btn-icon--arrow" aria-hidden="true">' + icon("arrowRight") + "</span>" : "") +
      "</a>"
    );
  }

  function metaTagHTML(t) {
    return (
      '<span class="pd-meta-tag">' +
      '<span class="pd-meta-tag-icon" aria-hidden="true">' + icon(t.icon) + "</span>" +
      "<span>" + esc(t.label) + "</span>" +
      "</span>"
    );
  }

  function metricHTML(m) {
    return (
      '<div class="pd-metric">' +
      '<span class="pd-metric-value">' + esc(m.value) + "</span>" +
      '<span class="pd-metric-label">' + esc(m.label) + "</span>" +
      (m.note ? '<span class="pd-metric-note">' + esc(m.note) + "</span>" : "") +
      "</div>"
    );
  }

  function toolPillHTML(t) {
    var src = TOOL_ICONS[t.key];
    return (
      '<span class="pd-tool-pill">' +
      (src ? '<img class="pd-tool-icon" src="../../assets/images/tools/' + src + '" alt="" loading="lazy" />' : "") +
      "<span>" + esc(t.name) + "</span>" +
      "</span>"
    );
  }

  function cardHTML(c, i) {
    var body = c.list
      ? '<ul class="pd-card-list">' + c.list.map(function (li) { return "<li>" + esc(li) + "</li>"; }).join("") + "</ul>"
      : '<p class="pd-card-body">' + (c.eyebrow ? '<strong class="pd-card-eyebrow">' + esc(c.eyebrow) + "</strong><br />" : "") + esc(c.body) + "</p>";
    return (
      '<div class="pd-card" data-aos="fade-up" data-aos-delay="' + (i * 60) + '">' +
      '<div class="pd-card-head">' +
      '<span class="pd-card-dot" aria-hidden="true"></span>' +
      '<h3 class="pd-card-title">' + esc(c.title) + "</h3>" +
      "</div>" +
      body +
      "</div>"
    );
  }

  /* Looping screenshot slider: glides one slide left every few seconds,
     forever. After the last real slide it glides onto the copy of the
     first, then jumps back to the real first with no transition, so the
     loop always moves the same way. Pauses while hovered, focused, off
     screen or in a background tab; the dots jump straight to a slide.
     With reduced motion it still advances, just without the glide. */
  var SLIDE_EVERY_MS = 4200;
  var SLIDE_MS = 1100;

  function initSlider(root, count) {
    var track = root.querySelector(".pd-slider-track");
    var dots = Array.prototype.slice.call(root.querySelectorAll(".pd-slider-dot"));
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var index = 0, timer = 0, hovered = false, visible = true;

    root.style.setProperty("--pd-slide-ms", (reduce ? 0 : SLIDE_MS) + "ms");
    root.style.setProperty("--pd-slide-every", SLIDE_EVERY_MS + "ms");

    function paint(animate) {
      track.classList.toggle("is-instant", !animate);
      track.style.transform = "translate3d(" + (-index * 100) + "%,0,0)";
      dots.forEach(function (d, i) { d.classList.toggle("is-on", i === index % count); });
      root.classList.remove("is-ticking");
      void root.offsetWidth;            // restart the dot's progress fill
      root.classList.add("is-ticking");
    }

    function go(i) {
      index = i;
      paint(true);
      if (index === count) {
        // landed on the copy of slide 1: swap to the real one, unseen
        window.setTimeout(function () {
          index = 0;
          paint(false);
          root.classList.add("is-ticking");
        }, reduce ? 0 : SLIDE_MS + 30);
      }
    }

    function schedule() {
      window.clearTimeout(timer);
      if (hovered || !visible || document.hidden) {
        root.classList.add("is-paused");
        return;
      }
      if (root.classList.contains("is-paused")) {
        // resuming starts a full interval, so the progress line restarts too
        root.classList.remove("is-paused", "is-ticking");
        void root.offsetWidth;
        root.classList.add("is-ticking");
      }
      timer = window.setTimeout(function () { go(index + 1); schedule(); }, SLIDE_EVERY_MS);
    }

    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { go(i); schedule(); });
    });
    root.addEventListener("mouseenter", function () { hovered = true; schedule(); });
    root.addEventListener("mouseleave", function () { hovered = false; schedule(); });
    root.addEventListener("focusin", function () { hovered = true; schedule(); });
    root.addEventListener("focusout", function () { hovered = false; schedule(); });
    document.addEventListener("visibilitychange", schedule);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        schedule();
      }, { threshold: 0.25 }).observe(root);
    }

    paint(false);
    schedule();
  }

  function render(data) {
    // Back link / header brand+nav are static markup in the page shell -
    // only the data-driven sections below are templated.

    // Breadcrumb - every array field the renderer maps over gets a
    // fallback here. A missing field used to throw here uncaught and
    // abort the whole render before anything reached the page, so two
    // of the three project pages went completely blank (no title, no
    // image, no cards) from one dropped key in the data file.
    var breadcrumb = data.breadcrumb || [];
    setHTML("[data-pd-breadcrumb]", breadcrumb.map(function (b, i) {
      return '<span class="pd-crumb' + (i === 0 ? " pd-crumb--num" : "") + '">' + esc(b.toUpperCase ? b.toUpperCase() : b) + "</span>";
    }).join('<span class="pd-crumb-sep" aria-hidden="true">/</span>'));

    // Title
    var titleEl = document.querySelector("[data-pd-title]");
    if (titleEl) {
      /* Each line gets its own clipping box so the arrival sequence can
         slide it up from behind a mask. Without JS-driven motion these
         are plain blocks and the heading reads exactly as before. */
      // Long titles opt into a slightly smaller heading so their chosen
      // line breaks hold instead of each line wrapping again.
      titleEl.classList.toggle("pd-title--compact", data.titleSize === "compact");
      titleEl.innerHTML = (data.titleLines || [data.title])
        .map(function (line) {
          return '<span class="pd-title-line"><span class="pd-title-line-inner">' +
            esc(line) + "</span></span>";
        })
        /* Joined with a space, not nothing: the lines are block-level so
           it collapses visually, but without it textContent runs the
           lines together and a screen reader says "Multi-StoreAd". The
           old <br /> join carried a leading space for the same reason. */
        .join(" ");
    }
    document.title = data.title + " · Case Study · Autoany";

    setHTML("[data-pd-description]", esc(data.description));
    // A button only shows once it has a real destination: placeholder
    // "#" links (demo / GitHub not supplied yet) are left out rather
    // than rendered as buttons that go nowhere.
    setHTML("[data-pd-actions]", (data.actions || []).filter(function (a) {
      return a.href && a.href !== "#";
    }).map(actionHTML).join(""));
    setHTML("[data-pd-meta-tags]", (data.metaTags || []).map(metaTagHTML).join(""));

    if (data.annotation) {
      setHTML("[data-pd-annotation]", data.annotation.lines.map(esc).join("<br />"));
    }

    // Visual: architecture full width on top, dashboard + decisions split
    // beneath - but only when the project actually supplies both. An
    // empty `src` used to still emit an <img>, and per the HTML spec an
    // empty src resolves to the CURRENT PAGE's own URL, so the browser
    // requested this document a second time as an "image" and then
    // showed a broken-image icon in its place. Two of the three
    // projects only have one screenshot; the grid falls back to just
    // the wide image, styled to fill the frame, rather than reserving
    // space for panels that were never coming.
    var visual = data.visual || {};
    var visualHTML = "";
    if (visual.wide) {
      visualHTML += '<img class="pd-visual-img pd-visual-img--wide" src="' +
        esc(visual.wide) + '" alt="System architecture diagram" loading="lazy" />';
    }
    if (visual.a) {
      visualHTML += '<img class="pd-visual-img pd-visual-img--a" src="' +
        esc(visual.a) + '" alt="Dashboard activity view" loading="lazy" />';
    }
    if (visual.b) {
      visualHTML += '<img class="pd-visual-img pd-visual-img--b" src="' +
        esc(visual.b) + '" alt="Decision feed" loading="lazy" />';
    }
    // Several screenshots: one looping slider instead of the static grid.
    // The first slide is repeated at the end so the loop never runs
    // backwards; the copy is hidden from assistive tech.
    var slides = visual.slides || [];
    if (slides.length > 1) {
      visualHTML =
        '<div class="pd-slider" data-pd-slider>' +
        '<div class="pd-slider-viewport"><div class="pd-slider-track">' +
        slides.concat([slides[0]]).map(function (s, i) {
          var clone = i === slides.length;
          return '<figure class="pd-slide"' + (clone ? ' aria-hidden="true"' : "") + ">" +
            '<img src="' + esc(s.src) + '" alt="' + (clone ? "" : esc(s.alt || "")) + '"' +
            (i ? ' loading="lazy"' : "") + " decoding=\"async\" /></figure>";
        }).join("") +
        "</div></div>" +
        '<div class="pd-slider-dots" role="tablist" aria-label="Screenshots">' +
        slides.map(function (s, i) {
          return '<button type="button" role="tab" class="pd-slider-dot' + (i ? "" : " is-on") + '" aria-label="Show screenshot ' + (i + 1) + '"><i></i></button>';
        }).join("") +
        "</div></div>";
    }
    // A video project shows its Loom walkthrough in the same frame instead:
    // first frame + play button, with the player only loaded on click
    // (same facade as the homepage video cards).
    if (visual.video && visual.video.loomId) {
      var vid = visual.video;
      visualHTML =
        '<div class="pd-video" data-loom-id="' + esc(vid.loomId) + '" data-video-title="' + esc(data.title) + '">' +
        '<img class="pd-video-thumb" src="' + esc(vid.thumb) + '" alt="" />' +
        '<button type="button" class="pd-video-play" aria-label="Play video: ' + esc(data.title) + '">' +
        '<span class="pd-video-play-icon" aria-hidden="true">' + icon("play") + "</span>" +
        "</button>" +
        (vid.duration ? '<span class="pd-video-duration" aria-hidden="true">' + esc(vid.duration) + "</span>" : "") +
        "</div>";
    }

    var visualEl = document.querySelector("[data-pd-visual]");
    if (visualEl) {
      visualEl.innerHTML = visualHTML;
      visualEl.classList.toggle("pd-visual--solo", !visual.a && !visual.b && !(slides.length > 1) && !!(visual.wide));
      visualEl.classList.toggle("pd-visual--slider", slides.length > 1);
      visualEl.classList.toggle("pd-visual--slider-wide", slides.length > 1 && visual.aspect === "wide");
      var sliderEl = visualEl.querySelector("[data-pd-slider]");
      if (sliderEl) initSlider(sliderEl, slides.length);
      visualEl.classList.toggle("pd-visual--video", !!(visual.video && visual.video.loomId));
      var playBtn = visualEl.querySelector(".pd-video-play");
      if (playBtn) {
        playBtn.addEventListener("click", function () {
          var box = playBtn.closest(".pd-video");
          if (!box || box.classList.contains("is-playing")) return;
          var iframe = document.createElement("iframe");
          iframe.src = "https://www.loom.com/embed/" + encodeURIComponent(box.getAttribute("data-loom-id")) +
            "?autoplay=1&hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true";
          iframe.title = box.getAttribute("data-video-title") || "Project video";
          iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
          iframe.setAttribute("allowfullscreen", "");
          box.classList.add("is-playing");
          box.innerHTML = "";
          box.appendChild(iframe);
          iframe.focus();
        });
      }
    }

    // Metrics + tech stack strip
    setHTML("[data-pd-metrics]", (data.metrics || []).map(metricHTML).join(""));
    setHTML("[data-pd-tools]", (data.tools || []).map(toolPillHTML).join(""));

    // Content cards
    setHTML("[data-pd-cards]", (data.cards || []).map(cardHTML).join(""));

    // Testimonial - omitted entirely, not rendered empty, when a project
    // has no client quote on file. A quote is someone else's words: this
    // renderer will not print a testimonial nobody said, and an empty
    // shell (no stars filled, "· ·" for a blank identity) looks broken
    // rather than absent.
    var reviewSection = document.querySelector(".pd-review-section");
    if (data.review) {
      var r = data.review;
      setHTML("[data-pd-review-quote]", esc(r.quote || ""));
      setHTML("[data-pd-review-stars]", starsHTML(r.rating || 0));
      setHTML("[data-pd-review-identity]", [r.name, r.org, r.location].filter(Boolean).map(esc).join(" · "));
      setHTML("[data-pd-review-highlights]", (r.highlights || []).map(function (h) {
        return '<li><span class="pd-highlight-icon" aria-hidden="true">' + icon("check") + "</span>" + esc(h) + "</li>";
      }).join(""));
      if (reviewSection) reviewSection.style.display = "";
    } else if (reviewSection) {
      reviewSection.style.display = "none";
    }

    // CTA
    var cta = data.cta || {};
    setHTML("[data-pd-cta-label]", esc(cta.label || ""));
    setHTML("[data-pd-cta-heading]", esc(cta.heading || ""));
    setHTML("[data-pd-cta-supporting]", esc(cta.supporting || ""));
    setHTML("[data-pd-cta-decorative]", (cta.decorative || []).map(esc).join("<br />"));
    var ctaBtn = document.querySelector("[data-pd-cta-button]");
    if (ctaBtn && cta.button) {
      ctaBtn.setAttribute("href", cta.button.href || "#");
      ctaBtn.innerHTML = "<span>" + esc(cta.button.label || "") + "</span><span class=\"pd-btn-icon pd-btn-icon--arrow\" aria-hidden=\"true\">" + icon("arrowRight") + "</span>";
    }

    document.documentElement.classList.add("pd-ready");
  }

  function setHTML(selector, html) {
    var el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  }

  function init() {
    var root = document.querySelector("[data-project-slug]");
    if (!root) return;
    var slug = root.getAttribute("data-project-slug");
    var data = window.PROJECT_DETAILS && window.PROJECT_DETAILS[slug];
    if (!data) {
      console.error("[project-detail] No data found for slug:", slug);
      return;
    }
    render(data);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ----------------------------------------------------------------
   Back to the portfolio
   When this page was opened from the home page, "Back to Portfolio"
   (and the nav's Portfolio link) step back in history instead of
   loading the home page again: the browser restores it from its
   back/forward cache, at the carousel, with no loading screen.
   Opened any other way (a shared link, a new tab), the links load
   /index.html#projects as normal.
   ---------------------------------------------------------------- */
(function () {
  "use strict";
  var ref = document.referrer;
  var cameFromHome = false;
  try {
    var r = new URL(ref);
    cameFromHome = r.origin === location.origin && /^\/(index\.html)?$/.test(r.pathname);
  } catch (e) {}
  if (!cameFromHome || history.length < 2) return;

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href$="#projects"]');
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    // If the browser reloads the home page instead of restoring it,
    // this tells it to open at the projects without the loading screen.
    try { sessionStorage.setItem("returnTo", "projects"); } catch (err) {}
    history.back();
  });
})();
