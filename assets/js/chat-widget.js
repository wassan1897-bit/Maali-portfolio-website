/* ================================================================
   MAALI'S ASSISTANT (styles: assets/css/chat-widget.css)
   ----------------------------------------------------------------
   Not a language model: it answers from the portfolio itself. Four
   topic tiles cover what most visitors want (projects, demos, tools,
   working together); typed questions are matched to a topic by
   keywords, and anything it cannot answer goes to Maali directly
   (WhatsApp or email). Every fact here is one the site already
   states, so the assistant cannot say anything the page does not.
   ================================================================ */
(function () {
  "use strict";

  var root = document.querySelector("[data-mc]");
  if (!root) return;

  var panel = root.querySelector(".mc-panel");
  var body = root.querySelector("[data-mc-body]");
  var tiles = root.querySelector("[data-mc-tiles]");
  var form = root.querySelector("[data-mc-form]");
  var input = root.querySelector("[data-mc-input]");
  var toggle = root.querySelector("[data-mc-toggle]");
  var label = root.querySelector("[data-mc-label]");
  var homeBtn = root.querySelector("[data-mc-home]");
  var closeBtn = root.querySelector("[data-mc-close]");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var WA = "https://wa.me/923363068574?text=Hi%20Maali%2C%20I%27d%20like%20to%20talk%20about%20automating%20a%20process.";
  var EMAIL = "mailto:maaliwassan@gmail.com";
  var LINKEDIN = "https://www.linkedin.com/in/muhammad-ali-718b37212/";
  var UPWORK = "https://www.upwork.com/freelancers/muhammadaliautomation";

  /* ---------------------------------------------------------------
     The portfolio, as the site itself lists it
     --------------------------------------------------------------- */
  var P = [
    { slug: "operations-command-centre", title: "Operations Command Centre", tag: "Dashboards", k: "dashboard supabase inventory wholesale sales operations reporting" },
    { slug: "outbound-voice-agent", title: "Outbound Voice Agent", tag: "Voice agents", k: "voice call calling phone outbound elevenlabs booking appointment cal" },
    { slug: "multi-store-ad-automation", title: "Multi-Store Ad Automation", tag: "AI automation", k: "ads facebook meta marketing retail store campaign" },
    { slug: "ai-blog-posting-automation", title: "AI Blog Posting Automation", tag: "Content automation", k: "blog content wordpress social posting marketing seo" },
    { slug: "ai-social-media-bot-rem-token", title: "AI Social Media Bot for REM Token", tag: "Social media", k: "twitter social x bot crypto token gemini" },
    { slug: "enterprise-rag-data-ingestion", title: "Enterprise Multi-LLM RAG & Data Ingestion", tag: "Chatbots & RAG", k: "rag chatbot documents knowledge vector search pdf", video: true },
    { slug: "ai-context-engine-crm-sync", title: "AI Context Engine & CRM Sync", tag: "CRM & integrations", k: "crm hubspot email context agent sql integration", video: true },
    { slug: "ai-agent-orchestration", title: "AI Agent Orchestration", tag: "AI agents", k: "agent agents orchestration sql backend", video: true },
    { slug: "outbound-voice-agent-live-call", title: "Outbound Voice Agent: Live Call", tag: "Voice agents", k: "voice call calling phone retell live", video: true },
    { slug: "analytics-database-chatbot", title: "Chatbot over a Live Analytics Database", tag: "Chatbots & dashboards", k: "chatbot analytics sql dashboard database", video: true },
    { slug: "dashboard-replacing-crm", title: "Full-Stack Dashboard replacing a CRM", tag: "Dashboards & internal tools", k: "dashboard crm internal tool pipedrive commissions", video: true },
    { slug: "research-aggregator-newsletter", title: "Research Aggregator & Newsletter", tag: "Workflow automation", k: "newsletter email research pdf summary workflow", video: true },
    { slug: "bulk-data-migration", title: "Bulk Data Migration: 9,500 Contacts", tag: "Data pipelines", k: "migration data crm contacts python gohighlevel import", video: true },
    { slug: "ai-operating-system-part-1", title: "AI Operating System: Part 1", tag: "AI operating systems", k: "operating system claude memory agents", video: true },
    { slug: "ai-operating-system-part-2", title: "AI Operating System: Part 2", tag: "AI operating systems", k: "operating system claude agents reports", video: true },
    { slug: "inherited-mvp-technical-review", title: "Inherited MVP: Technical Review", tag: "How I work", k: "review code audit mvp security", video: true }
  ];

  var TOOLS = ["n8n", "OpenAI", "Claude", "ElevenLabs", "Retell AI", "Make", "Twilio", "GoHighLevel", "Airtable",
    "Supabase", "PostgreSQL", "HubSpot", "NetSuite", "Stripe", "RingCentral", "Python", "LlamaIndex", "Next.js"];

  /* ---------------------------------------------------------------
     Small DOM helpers (text is always set as text, never as HTML)
     --------------------------------------------------------------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';
  var WA_IC = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.78a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.88 9.88 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.24-6.16-3.48-8.41Z"/></svg>';

  function scrollDown() {
    body.scrollTo({ top: body.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }

  function say(text) {
    var m = el("div", "mc-msg mc-bot", text);
    body.appendChild(m);
    return m;
  }

  function projectList(items) {
    var list = el("div", "mc-list");
    items.forEach(function (p) {
      var a = el("a", "mc-item");
      a.href = "projects/" + p.slug + "/";
      var img = el("img");
      img.src = "assets/images/chat/" + p.slug + ".webp";
      img.alt = "";
      img.loading = "lazy";
      var t = el("span");
      t.appendChild(el("b", null, p.title));
      t.appendChild(el("small", null, p.tag + (p.video ? " · video" : "")));
      a.appendChild(img);
      a.appendChild(t);
      a.insertAdjacentHTML("beforeend", ARROW);
      list.appendChild(a);
    });
    body.appendChild(list);
  }

  // chips: [label, action] where action is a topic key, an in-page
  // #anchor or an external URL; opts.dark marks the main action
  function chips(items, opts) {
    var row = el("div", "mc-chips");
    items.forEach(function (c) {
      var lab = c[0], act = c[1], node;
      if (act == null) {
        node = el("span", "mc-chip mc-chip--static", lab);
      } else if (/^(https?:|mailto:|#|projects\/)/.test(act)) {
        node = el("a", "mc-chip", lab);
        node.href = act;
        if (/^https?:/.test(act)) { node.target = "_blank"; node.rel = "noopener"; }
        if (act.charAt(0) === "#") node.setAttribute("data-mc-anchor", "");
      } else {
        node = el("button", "mc-chip", lab);
        node.type = "button";
        node.setAttribute("data-mc-topic", act);
      }
      if (c[2] === "dark") node.classList.add("mc-chip--dark");
      if (c[3]) node.insertAdjacentHTML("afterbegin", c[3]);
      row.appendChild(node);
    });
    body.appendChild(row);
  }

  function follow(items) {
    body.appendChild(el("p", "mc-follow-label", "You could also ask"));
    chips(items);
  }

  /* ---------------------------------------------------------------
     Answers
     --------------------------------------------------------------- */
  var CONTACT_CHIPS = [["WhatsApp", WA, "dark", WA_IC], ["Email", EMAIL], ["LinkedIn", LINKEDIN], ["Upwork", UPWORK]];

  var TOPICS = {
    projects: function () {
      say("Here are a few to start with. Each one opens its full case study, and all 16 are in the Work section.");
      projectList([P[0], P[2], P[1], P[6]]);
      chips([["See all 16 projects", "#projects", "dark"]]);
      follow([["Voice agents", "voice"], ["Dashboards", "dashboards"], ["Chatbots", "chatbots"]]);
    },
    demos: function () {
      say("There are 11 recorded walkthroughs of real systems running end to end. A good place to start:");
      projectList([P[8], P[5], P[9]]);
      chips([["See all 11 demos", "#services", "dark"]]);
      follow([["What does he build?", "build"], ["Work together", "contact"]]);
    },
    tools: function () {
      say("The tools Maali works with most:");
      chips(TOOLS.map(function (t) { return [t, null]; }));
      say("Most systems are built in n8n, with custom code and APIs where a workflow tool is not enough.");
      follow([["See projects", "projects"], ["Work together", "contact"]]);
    },
    contact: function () {
      say("The quickest way to reach Maali is WhatsApp, or email if you prefer. Tell him what currently happens and he’ll show you what could be automated.");
      chips(CONTACT_CHIPS);
    },
    build: function () {
      say("Automations, AI agents and internal tools for businesses that have outgrown doing things by hand. For example: lead research pipelines, outbound voice agents, live dashboards, CRM syncs and chatbots that answer from company data.");
      follow([["See projects", "projects"], ["Tools", "tools"], ["Work together", "contact"]]);
    },
    about: function () {
      say("Maali Wassan is an AI automation expert and the founder of Autoany. Over the last 6+ years he has built automation for teams in media, healthcare, automotive, industrial supply and high-volume operations.");
      chips([["Read more about Maali", "#about", "dark"]]);
      follow([["What does he build?", "build"], ["Client reviews", "reviews"]]);
    },
    reviews: function () {
      say("Every client review on this site comes from Upwork, where Maali has 28 completed jobs. You can read them on the page.");
      chips([["Read client reviews", "#testimonials", "dark"], ["Upwork profile", UPWORK]]);
    },
    price: function () {
      say("Every project is different, so pricing is something to talk through with Maali directly. Tell him what you need and he’ll give you a clear answer.");
      chips(CONTACT_CHIPS);
    },
    voice: function () {
      say("Voice agents that call leads, handle objections and book meetings:");
      projectList([P[1], P[8]]);
    },
    dashboards: function () {
      say("Dashboards and internal tools built on live data:");
      projectList([P[0], P[10], P[9]]);
    },
    chatbots: function () {
      say("Chatbots and assistants that answer from a company’s own data:");
      projectList([P[5], P[9], P[6]]);
    },
    hello: function () {
      say("Hi! Ask me about Maali’s projects, the tools he uses, or how to work with him.");
      follow([["Projects", "projects"], ["Video demos", "demos"], ["Work together", "contact"]]);
    },
    thanks: function () {
      say("You’re welcome! Anything else you’d like to see?");
      follow([["Projects", "projects"], ["Work together", "contact"]]);
    },
    unknown: function (q) {
      var hits = searchProjects(q);
      if (hits.length) {
        say("I found these in Maali’s work:");
        projectList(hits.slice(0, 3));
        follow([["All projects", "projects"], ["Work together", "contact"]]);
        return;
      }
      say("I don’t have an answer to that on the site, but Maali can tell you himself.");
      chips(CONTACT_CHIPS.slice(0, 2));
      follow([["Projects", "projects"], ["Tools", "tools"]]);
    }
  };

  var USER_LABEL = {
    projects: "Show me projects", demos: "Video demos", tools: "Which tools?", contact: "How do we work together?",
    build: "What does Maali build?", about: "Who is Maali?", reviews: "Client reviews", price: "How much does it cost?",
    voice: "Voice agents", dashboards: "Dashboards", chatbots: "Chatbots"
  };

  /* ---------------------------------------------------------------
     Typed questions -> topic
     --------------------------------------------------------------- */
  var RULES = [
    ["price", /\b(price|pricing|cost|costs|rate|rates|budget|charge|fee|fees|quote|how much|expensive|cheap|hourly)\b/],
    ["contact", /\b(contact|hire|hiring|reach|email|whatsapp|call him|talk to|book|meeting|available|availability|work with|work together|start a project|get in touch|number|phone number)\b/],
    ["reviews", /\b(review|reviews|testimonial|testimonials|rating|ratings|feedback|clients say|upwork)\b/],
    ["demos", /\b(demo|demos|video|videos|walkthrough|walkthroughs|watch|loom)\b/],
    ["tools", /\b(tool|tools|stack|tech|technology|technologies|n8n|make\.com|zapier|software|platform|platforms|language|languages)\b/],
    ["voice", /\b(voice|calling|phone agent|calls?)\b/],
    ["dashboards", /\b(dashboard|dashboards|internal tool|internal tools|reporting)\b/],
    ["chatbots", /\b(chatbot|chatbots|rag|assistant|knowledge base)\b/],
    ["projects", /\b(project|projects|portfolio|work|case stud(y|ies)|examples?|built|clients?)\b/],
    ["build", /\b(build|builds|do you do|does he do|services?|offer|automate|automation|what can|help with|ai agents?)\b/],
    ["about", /\b(who|about|maali|experience|years|background|founder|autoany|based|location)\b/],
    ["hello", /^(hi|hello|hey|salam|assalam|good (morning|afternoon|evening))\b/],
    ["thanks", /\b(thanks|thank you|thx|great|perfect|cool)\b/]
  ];

  function searchProjects(q) {
    var words = q.toLowerCase().split(/[^a-z0-9.]+/).filter(function (w) { return w.length > 2; });
    return P.map(function (p) {
      var hay = (p.title + " " + p.tag + " " + p.k).toLowerCase();
      var score = words.reduce(function (s, w) { return s + (hay.indexOf(w) !== -1 ? 1 : 0); }, 0);
      return { p: p, s: score };
    }).filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .map(function (r) { return r.p; });
  }

  function topicFor(q) {
    var t = q.toLowerCase().trim();
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][1].test(t)) return RULES[i][0];
    }
    return "unknown";
  }

  /* ---------------------------------------------------------------
     Conversation flow
     --------------------------------------------------------------- */
  var busy = false;

  function startChatting() {
    if (!root.classList.contains("is-chatting")) {
      root.classList.add("is-chatting");
      homeBtn.hidden = false;
      if (tiles) tiles.remove();
    }
  }

  function respond(topic, userText) {
    if (busy) return;
    busy = true;
    startChatting();
    body.appendChild(el("div", "mc-msg mc-user", userText));
    var typing = el("div", "mc-typing");
    typing.innerHTML = "<i></i><i></i><i></i>";
    body.appendChild(typing);
    scrollDown();
    window.setTimeout(function () {
      typing.remove();
      var start = body.children.length;
      (TOPICS[topic] || TOPICS.unknown)(userText);
      busy = false;
      // keep the start of the answer in view, not just its last line
      var first = body.children[start - 1];
      if (first && first.offsetTop - body.offsetTop > body.scrollTop + body.clientHeight - 60) {
        body.scrollTo({ top: first.offsetTop - 12, behavior: reduce ? "auto" : "smooth" });
      } else {
        scrollDown();
      }
    }, reduce ? 0 : 520);
  }

  function reset() {
    root.classList.remove("is-chatting");
    homeBtn.hidden = true;
    body.innerHTML = "";
    say("Hi! Pick a topic, or ask anything about Maali’s work.");
    if (tiles) body.appendChild(tiles);
    busy = false;
  }

  /* ---------------------------------------------------------------
     Open / close
     --------------------------------------------------------------- */
  function open() {
    root.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    label.textContent = "Close";
    var fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    // on touch screens, focusing would pop the keyboard over the tiles
    if (fine) window.setTimeout(function () { input.focus({ preventScroll: true }); }, 120);
  }

  function close(returnFocus) {
    root.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    label.textContent = "Ask Maali’s assistant";
    if (returnFocus) toggle.focus({ preventScroll: true });
  }

  // compact launcher while the hero fills the screen (see the CSS)
  var setCompact = function () {
    root.classList.toggle("is-compact", window.scrollY < window.innerHeight * 0.6);
  };
  setCompact();
  window.addEventListener("scroll", setCompact, { passive: true });

  toggle.addEventListener("click", function () {
    if (root.classList.contains("is-open")) close(true);
    else open();
  });
  closeBtn.addEventListener("click", function () { close(true); });
  homeBtn.addEventListener("click", reset);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && root.classList.contains("is-open")) close(true);
  });

  // a click anywhere outside the assistant closes it
  document.addEventListener("pointerdown", function (e) {
    if (root.classList.contains("is-open") && !root.contains(e.target)) close(false);
  });

  body.addEventListener("click", function (e) {
    var topicBtn = e.target.closest("[data-mc-topic]");
    if (topicBtn) {
      var t = topicBtn.getAttribute("data-mc-topic");
      var txt = USER_LABEL[t] || topicBtn.textContent.trim();
      respond(t, txt);
      return;
    }
    // in-page links: close first, then the site's own anchor glide
    // (site-motion.js) takes the click
    if (e.target.closest("[data-mc-anchor]")) close(false);
  });
  tiles && tiles.addEventListener("click", function (e) {
    var b = e.target.closest("[data-mc-topic]");
    if (!b) return;
    e.stopPropagation();
    var t = b.getAttribute("data-mc-topic");
    respond(t, USER_LABEL[t]);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q || busy) return;
    input.value = "";
    respond(topicFor(q), q);
  });
})();
