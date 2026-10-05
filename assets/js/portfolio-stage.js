/* ==========================================================================
   PORTFOLIO STAGE
   Data-driven layered project carousel for the #projects section.

   - PROJECTS: reusable data (id, number, title, category, description,
     tools, image | images, metric, projectLink). `images` renders the
     three-panel grid (architecture on top, two panels beneath); `image`
     renders a single full-bleed visual.
   - One render path builds every card (active + rear peeks) from that
     data; nothing is hard-coded per card.
   - Navigation: prev/next arrows, clicking a visible rear card, and
     category pills, all converging on a single setActive() call so the
     transform/opacity update is always consistent.
   ========================================================================== */

(function () {
  "use strict";

  var TOOL_ICON_BASE = "assets/images/tools/";
  var IMG_BASE = "assets/images/projects/";

  /* Brand icons for the tool tags. */
  var TOOLS = {
    n8n: { name: "n8n", icon: TOOL_ICON_BASE + "n8n.svg" },
    openai: { name: "OpenAI", icon: TOOL_ICON_BASE + "openai.svg" },
    anthropic: { name: "Claude", icon: TOOL_ICON_BASE + "anthropic.svg" },
    make: { name: "Make", icon: TOOL_ICON_BASE + "make.svg" },
    twilio: { name: "Twilio", icon: TOOL_ICON_BASE + "twilio.svg" },
    airtable: { name: "Airtable", icon: TOOL_ICON_BASE + "airtable.svg" },
    google: { name: "Google", icon: TOOL_ICON_BASE + "google.svg" },
    supabase: { name: "Supabase", icon: TOOL_ICON_BASE + "supabase.svg" },
    hubspot: { name: "HubSpot", icon: TOOL_ICON_BASE + "hubspot.svg" },
    stripe: { name: "Stripe", icon: TOOL_ICON_BASE + "stripe.svg" },
    retellai: { name: "Retell AI", icon: TOOL_ICON_BASE + "retellai.png" },
    gohighlevel: { name: "GoHighLevel", icon: TOOL_ICON_BASE + "gohighlevel.png" },
    netsuite: { name: "NetSuite", icon: TOOL_ICON_BASE + "netsuite.png" },
    ringcentral: { name: "RingCentral", icon: TOOL_ICON_BASE + "ringcentral.png" },
    meta: { name: "Meta API", icon: TOOL_ICON_BASE + "meta.svg" },
    // The mockups this site's references come from label the Google G
    // logo "Gemini" rather than using Gemini's own sparkle mark, so
    // this points at the full-colour Google G (google-g.svg) instead
    // of the plain-blue Simple Icons "gemini" glyph, matching what
    // every card that names Gemini is actually supposed to show.
    gemini: { name: "Gemini", icon: TOOL_ICON_BASE + "google-g.svg" },
    vercel: { name: "Vercel", icon: TOOL_ICON_BASE + "vercel.svg" },
    inventory_api: { name: "Inventory API", icon: "" },
    // Neither brand is in the Simple Icons set used for every other
    // logo on this site (both confirmed 404 there) - text-only pill,
    // same fallback already used above for Inventory API / Lovable.
    apify: { name: "Apify", icon: "" },
    closecom: { name: "Close.com", icon: "" },
    // Voiceflow: also not in Simple Icons (same situation as Apify /
    // Close.com above). The other two are capability labels from the
    // project brief, not products - same pattern as "Outbound Call" on
    // card 04, which has never carried an icon either.
    voiceflow: { name: "Voiceflow", icon: "" },
    chatbotdev: { name: "Chatbot Development", icon: "" },
    customerservicechatbot: { name: "Customer Service Chatbot", icon: "" },
    // AI Blog Posting Automation (card 04) - OpenAI/DALL-E get their
    // own labelled entries here rather than reusing the plain "openai"
    // key, since the reference names them "OpenAI API" / "DALL-E API"
    // specifically. DALL-E has no separate Simple Icons entry (it is
    // catalogued under OpenAI there) - text-only, same fallback as
    // Apify/Close.com/Voiceflow above.
    openai_api: { name: "OpenAI API", icon: TOOL_ICON_BASE + "openai.svg" },
    dalle: { name: "DALL-E API", icon: "" },
    wordpress: { name: "WordPress", icon: TOOL_ICON_BASE + "wordpress.svg" },
    facebook_graph: { name: "Facebook Graph API", icon: TOOL_ICON_BASE + "facebook.svg" },
    reddit_api: { name: "Reddit API", icon: TOOL_ICON_BASE + "reddit.svg" },
    threads_api: { name: "Threads API", icon: TOOL_ICON_BASE + "threads.svg" },
    pinterest_api: { name: "Pinterest API", icon: TOOL_ICON_BASE + "pinterest.svg" },
    // AI Social Media Bot for REM Token (card 05)
    twitter_api: { name: "Twitter API", icon: TOOL_ICON_BASE + "x-twitter.svg" },
    seatable: { name: "SeaTable", icon: TOOL_ICON_BASE + "seatable.svg" },
    webproxy: { name: "Web Proxy", icon: TOOL_ICON_BASE + "webproxy.svg" },
    // Enterprise Multi-LLM RAG (card 06). The brief names techniques, not
    // products. Where the video shows which product does the job, the tag
    // carries that product's logo (vector search runs on Qdrant, ingestion
    // starts from a Google Drive trigger); the rest get drawn glyphs, as
    // with SeaTable / Web Proxy. Hosted File Search stays generic on
    // purpose: it covers two products (OpenAI and Gemini).
    vector_search: { name: "Vector Search", icon: TOOL_ICON_BASE + "qdrant.svg" },
    graph_rag: { name: "Graph RAG", icon: TOOL_ICON_BASE + "graph-rag.svg" },
    file_search: { name: "Hosted File Search", icon: TOOL_ICON_BASE + "file-search.svg" },
    data_ingestion: { name: "Data Ingestion", icon: TOOL_ICON_BASE + "googledrive.svg" },
    dedupe: { name: "File Deduplication", icon: TOOL_ICON_BASE + "dedupe.svg" },
    multi_format: { name: "PDF \u00b7 Doc \u00b7 Sheet", icon: TOOL_ICON_BASE + "file-types.svg" },
    // Video cards 07-16. Product tags use the product's logo; the rest are
    // capability labels with drawn glyphs (assets/images/tools/g-*.svg).
    vd_hubspot: { name: "HubSpot CRM", icon: TOOL_ICON_BASE + "hubspot.svg" },
    vd_sql_servers: { name: "SQL Servers", icon: TOOL_ICON_BASE + "g-database.svg" },
    vd_call_transcripts: { name: "Call Transcripts", icon: TOOL_ICON_BASE + "g-transcript.svg" },
    vd_email_drafting: { name: "Email Drafting", icon: TOOL_ICON_BASE + "g-email.svg" },
    vd_crm_dashboard: { name: "CRM Dashboard", icon: TOOL_ICON_BASE + "g-dashboard.svg" },
    vd_master_agent: { name: "Master Agent", icon: TOOL_ICON_BASE + "g-agent.svg" },
    vd_sql_agent: { name: "SQL Agent", icon: TOOL_ICON_BASE + "g-sqlagent.svg" },
    vd_qdrant: { name: "Vector Store", icon: TOOL_ICON_BASE + "qdrant.svg" },
    vd_tool_calls: { name: "Workflow Tool Calls", icon: TOOL_ICON_BASE + "g-toolcall.svg" },
    vd_outbound: { name: "Outbound Calling", icon: TOOL_ICON_BASE + "g-phone.svg" },
    vd_qualify: { name: "Lead Qualification", icon: TOOL_ICON_BASE + "g-qualify.svg" },
    vd_objections: { name: "Objection Handling", icon: TOOL_ICON_BASE + "g-objection.svg" },
    vd_booking: { name: "Calendar Booking", icon: TOOL_ICON_BASE + "g-calendar.svg" },
    vd_call_analysis: { name: "Call Analysis", icon: TOOL_ICON_BASE + "g-analytics.svg" },
    vd_voiceflow: { name: "Voiceflow", icon: TOOL_ICON_BASE + "g-flowchat.svg" },
    vd_postgres: { name: "PostgreSQL", icon: TOOL_ICON_BASE + "postgresql.svg" },
    vd_text_to_sql: { name: "Text-to-SQL", icon: TOOL_ICON_BASE + "g-texttosql.svg" },
    vd_crm_sync: { name: "Pipedrive Sync", icon: TOOL_ICON_BASE + "g-sync.svg" },
    vd_schema: { name: "Custom Schema", icon: TOOL_ICON_BASE + "g-schema.svg" },
    vd_auto_tasks: { name: "Auto Task Creation", icon: TOOL_ICON_BASE + "g-tasks.svg" },
    vd_commissions: { name: "Commissions", icon: TOOL_ICON_BASE + "g-commission.svg" },
    vd_gmail: { name: "Gmail", icon: TOOL_ICON_BASE + "gmail.svg" },
    vd_pdf_extract: { name: "PDF Extraction", icon: TOOL_ICON_BASE + "g-pdf.svg" },
    vd_weekly: { name: "Weekly Schedule", icon: TOOL_ICON_BASE + "g-schedule.svg" },
    vd_roundup: { name: "Roundup Email", icon: TOOL_ICON_BASE + "g-newsletter.svg" },
    vd_python: { name: "Python", icon: TOOL_ICON_BASE + "python.svg" },
    vd_servicem8: { name: "ServiceM8", icon: TOOL_ICON_BASE + "g-fieldservice.svg" },
    vd_dedupe: { name: "Deduplication", icon: TOOL_ICON_BASE + "dedupe.svg" },
    vd_pipeline_map: { name: "Pipeline Mapping", icon: TOOL_ICON_BASE + "g-pipeline.svg" },
    vd_claude: { name: "Claude Cowork", icon: TOOL_ICON_BASE + "claude.svg" },
    vd_directory: { name: "Directory Structure", icon: TOOL_ICON_BASE + "g-folders.svg" },
    vd_task_file: { name: "Canonical Task File", icon: TOOL_ICON_BASE + "g-tasklist.svg" },
    vd_project_memory: { name: "Per-Project Memory", icon: TOOL_ICON_BASE + "g-memory.svg" },
    vd_live_query: { name: "Live Query", icon: TOOL_ICON_BASE + "g-livequery.svg" },
    vd_business_context: { name: "Business Context", icon: TOOL_ICON_BASE + "g-report.svg" },
    vd_aios_dashboard: { name: "Live Dashboard", icon: TOOL_ICON_BASE + "g-dashboard.svg" },
    vd_memory_rules: { name: "Memory Rules", icon: TOOL_ICON_BASE + "g-memory.svg" },
    vd_feedback_rules: { name: "Feedback Rules", icon: TOOL_ICON_BASE + "g-rules.svg" },
    vd_scheduled_agents: { name: "Scheduled Agents", icon: TOOL_ICON_BASE + "g-schedule.svg" },
    vd_reports: { name: "Reports", icon: TOOL_ICON_BASE + "g-report.svg" },
    vd_code_review: { name: "Code Review", icon: TOOL_ICON_BASE + "g-review.svg" },
    vd_access_policies: { name: "Access Policies", icon: TOOL_ICON_BASE + "g-shield.svg" },
    vd_secrets: { name: "Exposed Secrets", icon: TOOL_ICON_BASE + "g-key.svg" },
    vd_persistence: { name: "Real Persistence", icon: TOOL_ICON_BASE + "g-persistence.svg" },
    vd_auth_edges: { name: "Auth Edge Cases", icon: TOOL_ICON_BASE + "g-lock.svg" },
    vd_estimate: { name: "Effort Estimate", icon: TOOL_ICON_BASE + "g-estimate.svg" },
    crm_api: { name: "CRM API", icon: TOOL_ICON_BASE + "hubspot.svg" },
    lovable: { name: "Lovable", icon: "" },
    claude_code: { name: "Claude Code", icon: TOOL_ICON_BASE + "anthropic.svg" },
    elevenlabs: { name: "ElevenLabs", icon: "" },
    calcom: { name: "Cal.com", icon: "" },
    javascript: { name: "JavaScript", icon: TOOL_ICON_BASE + "javascript.svg" },
    webhook: { name: "Webhook/API", icon: "" },
    outbound_call: { name: "Outbound Call", icon: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PScwIDAgMjQgMjQnIGZpbGw9J25vbmUnIHN0cm9rZT0nYmxhY2snIHN0cm9rZS13aWR0aD0nMicgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxwYXRoIGQ9J00yMiAxNi45MnYzYTIgMiAwIDAgMS0yLjE4IDIgMTkuNzkgMTkuNzkgMCAwIDEtOC42My0zLjA3IDE5LjUgMTkuNSAwIDAgMS02LTYgMTkuNzkgMTkuNzkgMCAwIDEtMy4wNy04LjY3QTIgMiAwIDAgMSA0LjExIDJoM2EyIDIgMCAwIDEgMiAxLjcyIDEyLjg0IDEyLjg0IDAgMCAwIC43IDIuODEgMiAyIDAgMCAxLS40NSAyLjExTDguMDkgOS45MWExNiAxNiAwIDAgMCA2IDZsMS4I3LTEuMjdhMiAyIDAgMCAxIDIuMTEtLjQ1IDEyLjg0IDEyLjg0IDAgMCAwIDIuODEuN0EyIDIgMCAwIDEgMjIgMTYuOTJ6Jy8+PC9zdmc+" }
  };

  var CATEGORIES = [
    { key: "all", label: "All Projects", icon: "grid" },
    // Matches on the card having a video, not on its category, so every
    // walkthrough shows here as well as under its own subject pill.
    { key: "videos", label: "Video Demos", icon: "video" },
    { key: "AI Automation", label: "AI Automation", icon: "zap" },
    { key: "Voice Agents", label: "Voice Agents", icon: "waveform" },
    { key: "Web Scraping", label: "Web Scraping", icon: "search" },
    { key: "CRM & Integrations", label: "CRM & Integrations", icon: "link" },
    { key: "Others", label: "Others", icon: "dots" }
  ];

  /* Shown in ascending card number (01, 02, 03 ...); the list is sorted
     below, so the order entries are written in here does not matter. */
  var PROJECTS = [
    {
      id: "proj-02", number: "02", title: "Outbound Voice Agent",
      titleLines: ["Outbound", "Voice Agent"],
      category: "Voice Agents",
      description: "An outbound calling agent that researches each lead, personalises the call, checks live availability, books demos through Cal.com, updates Airtable and retries based on how each call went.",
      tools: ["elevenlabs", "n8n", "calcom", "airtable", "javascript", "webhook"],
      image: null, images: null,
      backgroundImage: "assets/images/portfolio photos/porfolio final images/project 3.png",
      metric: null, projectLink: "/projects/outbound-voice-agent"
    },
    {
      id: "proj-01", number: "01", title: "Operations Command Centre",
      titleLines: ["Operations", "Command Centre"],
      category: "AI Automation",
      description: "Two live dashboards on one Supabase database for a flooring wholesaler: a dispatch board for deliveries and purchase orders, and a command centre tracking revenue, margin, inventory vs par, and a full sales funnel.",
      tools: ["supabase", "inventory_api", "n8n", "crm_api", "lovable", "claude_code"],
      image: null, images: null,
      backgroundImage: "assets/images/portfolio photos/porfolio final images/project 2.png",
      metric: null, projectLink: "/projects/operations-command-centre"
    },
    {
      id: "proj-03", number: "03", title: "Multi-Store Ad Automation",
      titleLines: ["Multi-Store", "Ad Automation"],
      category: "AI Automation",
      description: "Automation system that turns store Facebook posts into local ads, monitors performance nightly, and uses rules plus AI reasoning to create or retire campaigns automatically.",
      tools: ["n8n", "supabase", "meta", "gemini", "vercel"],
      image: null,
      images: null,
      /* Full-bleed showcase background - the new composite image is
         baked into the card via CSS background-image. The left text
         panel sits over the soft-blurred left region; the dashboards
         on the right need no separate container. */
      backgroundImage: "assets/images/portfolio photos/porfolio final images/project 1.png",
      metric: null, projectLink: "/projects/multi-store-ad-automation"
    },
    {
      id: "proj-04", number: "04", title: "AI Blog Posting Automation",
      titleLines: ["AI Blog Posting", "Automation"],
      category: "AI Automation",
      subtitle: "n8n + WordPress + Social Media",
      description: "An n8n system that writes blog articles, generates an image for each one, publishes to WordPress and shares every post across four social platforms on its own.",
      tools: ["n8n", "openai_api", "dalle", "wordpress", "facebook_graph", "reddit_api", "threads_api", "pinterest_api"],
      image: null, images: null,
      backgroundImage: "assets/images/portfolio photos/porfolio final images/bg_card_04_blog_posting.webp",
      metric: null, projectLink: "/projects/ai-blog-posting-automation"
    },
    {
      id: "proj-05", number: "05", title: "AI Social Media Bot for REM Token",
      titleLines: ["AI Social Media Bot", "for REM Token"],
      category: "AI Automation",
      subtitle: "TWITTER (X) · n8n · GEMINI · SEATABLE",
      description: "A Twitter bot for the REM token. It finds Real World Asset conversations, scores each tweet with a custom JavaScript algorithm, replies to the best ones with Gemini and logs everything in SeaTable.",
      tools: ["n8n", "twitter_api", "gemini", "seatable", "javascript", "webproxy"],
      image: null, images: null,
      backgroundImage: "assets/images/portfolio photos/porfolio final images/bg_card_05_social_bot_v2.webp",
      metric: null, projectLink: "/projects/ai-social-media-bot-rem-token"
    },
    /* Video cards: same card, same text panel, but the card is the video.
       video.thumb is a still captured from inside the video itself (here
       ~1:55, the ingestion pipeline), cropped to the card's shape and
       clear of the browser chrome and webcam bubble. It fills the card,
       and the frosted panel behind the text blurs it live. The Loom
       player is not loaded until Watch Demo / Play is pressed. */
    {
      id: "proj-06", number: "06", title: "Enterprise Multi-LLM RAG & Data Ingestion",
      titleLines: ["Enterprise Multi-LLM", "RAG & Data Ingestion"],
      category: "AI Automation",
      subtitle: "Use on \u00b7 Chatbots & RAG Assistants",
      description: "Four RAG approaches compared side by side (vector search, graph RAG and two hosted file-search options) so a client could choose between them on evidence. Includes the ingestion workflow that dedupes files and handles spreadsheets, documents and PDFs differently.",
      tools: ["vector_search", "graph_rag", "file_search", "data_ingestion", "dedupe", "multi_format"],
      image: null, images: null,
      video: {
        loomId: "47a73d7fab5942dba986746b44e6bf4c",
        thumb: "assets/images/videos/rag-ingestion-pipeline.jpg",
        duration: "5:00"
      },
      metric: null, projectLink: "/projects/enterprise-rag-data-ingestion"
    },
    {
      id: "proj-07", titleSize: "compact", number: "07", title: "AI Context Engine & CRM Synchronisation Hub",
      titleLines: ["AI Context Engine &", "CRM Synchronisation Hub"],
      category: "CRM & Integrations",
      subtitle: "Use on \u00b7 AI Agents \u00b7 Integrations \u00b7 Dashboards",
      description: "An engine that pulls from a CRM, SQL servers, a database, email and call transcripts to answer plain-English questions about any company or contact in real time, and drafts email replies the team copy-pastes almost unchanged.",
      tools: ["n8n", "vd_hubspot", "vd_sql_servers", "vd_call_transcripts", "vd_email_drafting", "vd_crm_dashboard"],
      image: null, images: null,
      video: {
        loomId: "b34c49af2ec74bc1af874ccc04c9964f",
        thumb: "assets/images/videos/context-engine.jpg",
        duration: "5:00"
      },
      metric: null, projectLink: "/projects/ai-context-engine-crm-sync"
    },
    {
      id: "proj-08", number: "08", title: "AI Agent Orchestration: Backend Architecture",
      titleLines: ["AI Agent Orchestration", "Backend Architecture"],
      category: "AI Automation",
      subtitle: "Use on \u00b7 AI Agents",
      description: "The engine room behind the AI Context Engine: a master agent with a SQL agent that writes and runs its own queries against the full schema, tool-calls into other workflows, and a vector store holding procedural knowledge.",
      tools: ["n8n", "vd_master_agent", "vd_sql_agent", "gemini", "vd_qdrant", "vd_tool_calls"],
      image: null, images: null,
      video: {
        loomId: "44daf38c03664fae912096ab2408d42e",
        thumb: "assets/images/videos/agent-orchestration.jpg",
        duration: "3:24"
      },
      metric: null, projectLink: "/projects/ai-agent-orchestration"
    },
    {
      id: "proj-09", titleSize: "compact", number: "09", title: "Production Outbound Voice Agent: Live Call",
      titleLines: ["Production Outbound", "Voice Agent: Live Call"],
      category: "Voice Agents",
      subtitle: "Use on \u00b7 Voice Agents",
      description: "A real recorded call. The agent qualifies a lead, handles objections and scheduling back-and-forth, and books a discovery call straight onto the calendar. You hear the whole call.",
      tools: ["retellai", "vd_outbound", "vd_qualify", "vd_objections", "vd_booking", "vd_call_analysis"],
      image: null, images: null,
      video: {
        loomId: "0e5a728545af4f2f9669269d9f75bb3b",
        thumb: "assets/images/videos/voice-agent-call.jpg",
        duration: "4:24"
      },
      metric: null, projectLink: "/projects/outbound-voice-agent-live-call"
    },
    {
      id: "proj-10", number: "10", title: "Chatbot over a Live Analytics Database",
      titleLines: ["Chatbot over a Live", "Analytics Database"],
      category: "AI Automation",
      subtitle: "Use on \u00b7 Chatbots \u00b7 Dashboards",
      description: "A chatbot embedded on each client\u2019s dashboard that answers questions like \u201cwhat was my ad spend in January\u201d by writing and running live SQL against a purpose-built relational schema. Natural language in, real numbers out.",
      tools: ["vd_voiceflow", "n8n", "openai", "supabase", "vd_postgres", "vd_text_to_sql"],
      image: null, images: null,
      video: {
        loomId: "f7dfec8790d84ab7bd67275dcb72b6e5",
        thumb: "assets/images/videos/analytics-chatbot.jpg",
        duration: "5:00"
      },
      metric: null, projectLink: "/projects/analytics-database-chatbot"
    },
    {
      id: "proj-11", number: "11", title: "Full-Stack Dashboard replacing a CRM",
      titleLines: ["Full-Stack Dashboard", "replacing a CRM"],
      category: "CRM & Integrations",
      subtitle: "Use on \u00b7 Dashboards & Internal Tools",
      description: "Partners, deals, employees, clients and commissions in one system, on a schema designed from scratch. Tasks are created automatically when a deal closes, and orders sync through to the CRM.",
      tools: ["supabase", "n8n", "vd_crm_sync", "vd_schema", "vd_auto_tasks", "vd_commissions"],
      image: null, images: null,
      video: {
        loomId: "d37b20e74ae0447c843beee72db2f21e",
        thumb: "assets/images/videos/crm-dashboard.jpg",
        duration: "4:59"
      },
      metric: null, projectLink: "/projects/dashboard-replacing-crm"
    },
    {
      id: "proj-12", number: "12", title: "Research Aggregator & Automated Newsletter",
      titleLines: ["Research Aggregator &", "Automated Newsletter"],
      category: "AI Automation",
      subtitle: "Use on \u00b7 Workflow Automation",
      description: "A weekly scheduled workflow that reads an inbox, extracts PDF attachments, aggregates the content and produces a formatted roundup email with linked sources. It replaced 20\u201330 newsletters somebody had to read by hand.",
      tools: ["n8n", "vd_gmail", "openai", "vd_pdf_extract", "vd_weekly", "vd_roundup"],
      image: null, images: null,
      video: {
        loomId: "49949651ffa1462094aff95385f44044",
        thumb: "assets/images/videos/research-newsletter.jpg",
        duration: "4:55"
      },
      metric: null, projectLink: "/projects/research-aggregator-newsletter"
    },
    {
      id: "proj-13", number: "13", title: "Bulk Data Migration: 9,500 Contacts",
      titleLines: ["Bulk Data Migration:", "9,500 Contacts"],
      category: "CRM & Integrations",
      subtitle: "Use on \u00b7 Integrations & Data Pipelines",
      description: "A one-off migration of roughly 9,500 contacts (cleaned to 8,226 after removing duplicates and incomplete records) and around 5,000 job records into a new CRM via custom Python, mapped to the right pipeline and stage by rule.",
      tools: ["vd_python", "gohighlevel", "supabase", "vd_servicem8", "vd_dedupe", "vd_pipeline_map"],
      image: null, images: null,
      video: {
        loomId: "18ba374343b148d3ba9de8749ffbfff1",
        thumb: "assets/images/videos/data-migration.jpg",
        duration: "4:58"
      },
      metric: null, projectLink: "/projects/bulk-data-migration"
    },
    {
      id: "proj-14", number: "14", title: "AI Operating System: Part 1",
      titleLines: ["AI Operating System:", "Part 1"],
      category: "AI Automation",
      subtitle: "Use on \u00b7 AI Operating Systems",
      description: "A walkthrough of a real working AI operating system, not a demo environment: the directory structure, the canonical task file, per-project memory, and a live query showing it already knows the business.",
      tools: ["vd_claude", "vd_directory", "vd_task_file", "vd_project_memory", "vd_live_query", "vd_business_context"],
      image: null, images: null,
      video: {
        loomId: "c12aaa76d03c4f04a5fbc1769692b3d7",
        thumb: "assets/images/videos/aios-part1.jpg",
        duration: "5:00"
      },
      metric: null, projectLink: "/projects/ai-operating-system-part-1"
    },
    {
      id: "proj-15", number: "15", title: "AI Operating System: Part 2",
      titleLines: ["AI Operating System:", "Part 2"],
      category: "AI Automation",
      subtitle: "Use on \u00b7 AI Operating Systems",
      description: "Continues from Part 1 into the live dashboard, the memory and feedback rules, and scheduled agents actually running and producing reports on screen.",
      tools: ["vd_claude", "vd_aios_dashboard", "vd_memory_rules", "vd_feedback_rules", "vd_scheduled_agents", "vd_reports"],
      image: null, images: null,
      video: {
        loomId: "d627be034a08419b8e121691fd054ece",
        thumb: "assets/images/videos/aios-part2.jpg",
        duration: "4:52"
      },
      metric: null, projectLink: "/projects/ai-operating-system-part-2"
    },
    {
      id: "proj-16", titleSize: "compact", number: "16", title: "Inherited MVP: Day-One Technical Review",
      titleLines: ["Inherited MVP:", "Day-One Technical Review"],
      category: "Others",
      subtitle: "Use on \u00b7 How I Work",
      description: "A review of someone else\u2019s codebase: what to check first, and how to confirm it actually works. It covers access policies, exposed secrets, demo data posing as real persistence and auth edge cases, and ends with a realistic effort estimate.",
      tools: ["vd_code_review", "vd_access_policies", "vd_secrets", "vd_persistence", "vd_auth_edges", "vd_estimate"],
      image: null, images: null,
      video: {
        loomId: "176db8b8b80148efbbfc1723ee280f6d",
        thumb: "assets/images/videos/mvp-review.jpg",
        duration: "2:57"
      },
      metric: null, projectLink: "/projects/inherited-mvp-technical-review"
    }
  ];

  PROJECTS.sort(function (a, b) {
    return parseInt(a.number, 10) - parseInt(b.number, 10);
  });

  var ICONS = {
    grid: '<svg viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.3" fill="currentColor"/><rect x="10" y="2" width="6" height="6" rx="1.3" fill="currentColor"/><rect x="2" y="10" width="6" height="6" rx="1.3" fill="currentColor"/><rect x="10" y="10" width="6" height="6" rx="1.3" fill="currentColor"/></svg>',
    sparkle: '<svg viewBox="0 0 18 18" fill="none"><path d="M9 1.5c.35 2.55 1.1 4.3 2.25 5.25S14.05 8.65 16.5 9c-2.45.35-4.2 1.1-5.25 2.25S9.35 14.05 9 16.5c-.35-2.45-1.1-4.2-2.25-5.25S3.95 9.35 1.5 9c2.45-.35 4.2-1.1 5.25-2.25S8.65 3.95 9 1.5Z" fill="currentColor"/></svg>',
    waveform: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><line x1="2" y1="7" x2="2" y2="11"/><line x1="5.5" y1="4" x2="5.5" y2="14"/><line x1="9" y1="1.5" x2="9" y2="16.5"/><line x1="12.5" y1="4" x2="12.5" y2="14"/><line x1="16" y1="7" x2="16" y2="11"/></svg>',
    database: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="9" cy="4" rx="6.5" ry="2.5"/><path d="M2.5 4v4c0 1.38 2.91 2.5 6.5 2.5s6.5-1.12 6.5-2.5V4"/><path d="M2.5 8v4c0 1.38 2.91 2.5 6.5 2.5s6.5-1.12 6.5-2.5V8"/></svg>',
    link: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M7.5 10.5 10.5 7.5"/><path d="M8.25 4.5 9.5 3.25a3 3 0 0 1 4.25 4.25L12.5 8.75"/><path d="M9.75 13.5 8.5 14.75a3 3 0 0 1-4.25-4.25L5.5 9.25"/></svg>',
    zap: '<svg viewBox="0 0 18 18" fill="none"><path d="M10.2 1.5 3.4 10.1h4.1l-.7 6.4 6.8-8.6H9.5l.7-6.4Z" fill="currentColor"/></svg>',
    search: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="7.8" cy="7.8" r="5.3"/><line x1="11.7" y1="11.7" x2="15.8" y2="15.8"/></svg>',
    dots: '<svg viewBox="0 0 18 18" fill="none"><circle cx="3.2" cy="9" r="1.6" fill="currentColor"/><circle cx="9" cy="9" r="1.6" fill="currentColor"/><circle cx="14.8" cy="9" r="1.6" fill="currentColor"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="20" y1="12" x2="4" y2="12"/><polyline points="10.5 5.5 4 12 10.5 18.5"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="13.5 5.5 20 12 13.5 18.5"/></svg>',
    video: '<svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="1.5" y="3" width="15" height="12" rx="2.5"/><path d="M7.4 6.6v4.8L11.4 9z" fill="currentColor"/></svg>',
    category: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1.5" y="1.5" width="13" height="13" rx="3"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.9-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z"/></svg>'
  };

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function toolTag(key) {
    var t = TOOLS[key];
    if (!t) return "";
    var iconHTML = t.icon ? '<img src="' + t.icon + '" alt="" class="portfolio-tag-icon" loading="lazy" />' : '';
    return (
      '<span class="portfolio-tag">' +
      iconHTML +
      "<span>" + esc(t.name) + "</span>" +
      "</span>"
    );
  }

  /* Two visual shapes share one entry point so a project only has to
     supply `images` (three-panel set) or `image` (single full-bleed),
     and the card template never branches. */
  function cardVisualHTML(project) {
    if (project.images) {
      return (
        '<div class="portfolio-visual">' +
        '<img class="portfolio-visual-img portfolio-visual-img--wide" src="' + esc(project.images.wide) + '" alt="" loading="lazy" />' +
        '<img class="portfolio-visual-img portfolio-visual-img--a" src="' + esc(project.images.a) + '" alt="" loading="lazy" />' +
        '<img class="portfolio-visual-img portfolio-visual-img--b" src="' + esc(project.images.b) + '" alt="" loading="lazy" />' +
        "</div>"
      );
    }
    if (project.image) {
      return (
        '<div class="portfolio-visual portfolio-visual--single">' +
        '<img class="portfolio-visual-img" src="' + esc(project.image) + '" alt="" loading="lazy" />' +
        "</div>"
      );
    }
    return (
      '<div class="portfolio-visual portfolio-visual--single">' +
      '<div class="portfolio-visual-placeholder">' +
      '<span class="portfolio-visual-placeholder-icon" aria-hidden="true">' + ICONS.category + "</span>" +
      '<span class="portfolio-visual-placeholder-label">Project Preview</span>' +
      "</div></div>"
    );
  }

  /* A display title can pin its own line breaks via `titleLines`. The
     reference's "Multi-Store / Ad Automation" is not a width wrap - its
     second line is wider than the first-plus-next-word, so no column width
     reproduces it. Falls back to natural wrapping when absent. */
  function titleHTML(project) {
    if (project.titleLines && project.titleLines.length) {
      /* Space before the break so the element's text content still reads
         "Multi-Store Ad Automation" rather than "Multi-StoreAd Automation"
         for assistive tech; trailing space collapses at the line end. */
      return project.titleLines.map(esc).join(" <br />");
    }
    return esc(project.title);
  }

  function activeCardHTML(project) {
    var tools = (project.tools || []).map(toolTag).join("");

    /* Full-background card: the showcase image IS the card background.
       No separate right-hand panel - text floats over the left 40%. */
    var extraClass = "";
    if (project.id === "proj-01") extraClass = " portfolio-card--operations";
    if (project.id === "proj-02") extraClass = " portfolio-card--outbound";
    if (project.id === "proj-04") extraClass = " portfolio-card--blogpost";
    if (project.id === "proj-05") extraClass = " portfolio-card--socialbot";

    /* Image cards link to their case study. Video cards play their demo
       instead, and keep the case study one quieter step away. */
    var ctaHTML = project.video
      ? '<div class="portfolio-video-ctas">' +
        '<button type="button" class="portfolio-view-btn portfolio-watch-btn" data-video-play>' +
        '<span class="portfolio-watch-btn-icon" aria-hidden="true">' + ICONS.play + "</span>" +
        "<span>Watch Demo</span>" +
        "</button>" +
        (project.projectLink
          ? '<a class="portfolio-case-link" href="' + esc(project.projectLink) + '">' +
            "<span>View case study</span>" +
            '<span class="portfolio-case-link-icon" aria-hidden="true">' + ICONS.arrowRight + "</span>" +
            "</a>"
          : "") +
        "</div>"
      : '<a class="portfolio-view-btn" href="' + esc(project.projectLink || "#") + '">' +
        "<span>View Project</span>" +
        '<span class="portfolio-view-btn-icon" aria-hidden="true">' + ICONS.arrowRight + "</span>" +
        "</a>";

    /* The text panel is identical for image and video cards, so a video
       card cannot drift from the others' typography. */
    var leftHTML =
      '<div class="portfolio-card-left">' +
      '<div class="portfolio-card-meta">' +
      '<span class="portfolio-card-number">' + esc(project.number) + "</span>" +
      '<span class="portfolio-card-meta-divider" aria-hidden="true"></span>' +
      "<span>" + esc(project.category.toUpperCase()) + "</span>" +
      "</div>" +
      '<h3 class="portfolio-card-title">' + titleHTML(project) + "</h3>" +
      (project.subtitle ? '<span class="portfolio-card-subtitle">' + esc(project.subtitle) + "</span>" : "") +
      '<p class="portfolio-card-desc">' + esc(project.description) + "</p>" +
      (tools ? '<div class="portfolio-tags">' + tools + "</div>" : "") +
      ctaHTML +
      "</div>";

    /* Video card: the first frame fills the whole card; a frosted-glass
       panel blurs that same frame behind the text. On play, the text
       leaves first, the Loom player loads underneath while it does, and
       the player only fades in once it has loaded (see playVideo). */
    if (project.video) {
      var v = project.video;
      return (
        '<article class="portfolio-card is-active portfolio-card--bg-cover portfolio-card--video' +
        (project.titleSize === "compact" ? " portfolio-card--title-compact" : "") + '"' +
        ' data-id="' + esc(project.id) + '">' +
        '<div class="portfolio-video-media">' +
        '<img class="portfolio-video-poster" src="' + esc(v.thumb) + '" alt="" />' +
        '<button type="button" class="portfolio-video-play" data-video-play aria-label="Play video: ' + esc(project.title) + '">' +
        '<span class="portfolio-video-play-icon" aria-hidden="true">' + ICONS.play + "</span>" +
        "</button>" +
        (v.duration ? '<span class="portfolio-video-duration" aria-hidden="true">' + esc(v.duration) + "</span>" : "") +
        '<span class="portfolio-video-spinner" aria-hidden="true"></span>' +
        '<div class="portfolio-video-stage" data-loom-id="' + esc(v.loomId) + '" data-video-title="' + esc(project.title) + '"></div>' +
        '<button type="button" class="portfolio-video-close" aria-label="Close video and show project details">' +
        '<span aria-hidden="true">' + ICONS.close + "</span>" +
        "</button>" +
        "</div>" +
        '<div class="portfolio-video-glass" aria-hidden="true"></div>' +
        leftHTML +
        "</article>"
      );
    }

    if (project.backgroundImage) {
      return (
        '<article class="portfolio-card is-active portfolio-card--bg-cover' + extraClass + '"' +
        ' data-id="' + esc(project.id) + '"' +
        ' style=\"background-image:url(\'' + esc(project.backgroundImage) + '\')\">' +
        leftHTML +
        "</article>"
      );
    }

    return (
      '<article class="portfolio-card is-active" data-id="' + esc(project.id) + '">' +
      '<div class="portfolio-card-left">' +
      '<div class="portfolio-card-meta">' +
      '<span class="portfolio-card-number">' + esc(project.number) + "</span>" +
      '<span class="portfolio-card-meta-divider" aria-hidden="true"></span>' +
      "<span>" + esc(project.category.toUpperCase()) + "</span>" +
      "</div>" +
      '<h3 class="portfolio-card-title">' + titleHTML(project) + "</h3>" +
      '<p class="portfolio-card-desc">' + esc(project.description) + "</p>" +
      (tools ? '<div class="portfolio-tags">' + tools + "</div>" : "") +
      '<a class="portfolio-view-btn" href="' + esc(project.projectLink || "#") + '">' +
      "<span>View Project</span>" +
      '<span class="portfolio-view-btn-icon" aria-hidden="true">' + ICONS.arrowRight + "</span>" +
      "</a>" +
      "</div>" +
      '<div class="portfolio-card-right">' + cardVisualHTML(project) + "</div>" +
      "</article>"
    );
  }

  /* Rear cards are portrait project sheets: a text block over a
     full-bleed visual. Only the flank nearest the active card is ever
     fully in view, so the visual is anchored toward that edge in CSS. */
  // The rear card shows the project's own art: its image, else its
  // full card background, else the frame from its video.
  function rearImage(project) {
    return project.image || project.backgroundImage || (project.video && project.video.thumb) || "";
  }

  function rearCardHTML(project, depthClass, side) {
    return (
      '<button type="button" class="portfolio-card portfolio-card-rear ' + depthClass +
      " portfolio-card-rear--" + side + '" data-id="' + esc(project.id) +
      '" aria-label="View ' + esc(project.title) + '">' +
      '<span class="portfolio-card-rear-body">' +
      '<span class="portfolio-card-rear-top">' +
      '<span class="portfolio-card-rear-num">' + esc(project.number) + "</span>" +
      '<span class="portfolio-card-rear-divider" aria-hidden="true"></span>' +
      "<span>" + esc(project.category.toUpperCase()) + "</span>" +
      "</span>" +
      '<span class="portfolio-card-rear-title">' + esc(project.title) + "</span>" +
      '<span class="portfolio-card-rear-desc">' + esc(project.description) + "</span>" +
      "</span>" +
      '<span class="portfolio-card-rear-visual">' +
      (rearImage(project) ? '<img src="' + esc(rearImage(project)) + '" alt="" loading="lazy" />' : "") +
      "</span>" +
      "</button>"
    );
  }

  function PortfolioStage(root) {
    this.root = root;
    this.track = root.querySelector("[data-portfolio-track]");
    this.pillsHost = root.querySelector("[data-portfolio-pills]");
    this.prevBtn = root.querySelector("[data-portfolio-prev]");
    this.nextBtn = root.querySelector("[data-portfolio-next]");
    this.category = "all";
    // Opens on the first card, so the stage reads 01, 02, 03 ... from the start.
    this.activeId = PROJECTS[0].id;
    this.reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.renderPills();
    this.render();
    this.bindEvents();

    // Re-fit when the window or the web fonts change the text's size.
    var self = this, fitTimer = 0;
    window.addEventListener("resize", function () {
      window.clearTimeout(fitTimer);
      fitTimer = window.setTimeout(function () { self.fitActive(); }, 120);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { self.fitActive(); });
  }

  function inCategory(p, key) {
    if (key === "all") return true;
    if (key === "videos") return !!p.video;
    return p.category === key;
  }

  PortfolioStage.prototype.visibleProjects = function () {
    var key = this.category;
    return PROJECTS.filter(function (p) { return inCategory(p, key); });
  };

  PortfolioStage.prototype.renderPills = function () {
    var self = this;
    /* A pill with nothing behind it is not rendered: an empty category used
       to leave the previous filter's cards on the stage, which read as that
       category's work. It reappears on its own once a project uses it. */
    this.pillsHost.innerHTML = CATEGORIES.filter(function (cat) {
      return PROJECTS.some(function (p) { return inCategory(p, cat.key); });
    }).map(function (cat) {
      var active = cat.key === self.category;
      return (
        '<button type="button" class="portfolio-pill' + (active ? " is-active" : "") + '" ' +
        'data-category="' + esc(cat.key) + '" role="tab" aria-selected="' + active + '">' +
        '<span class="portfolio-pill-icon" aria-hidden="true">' + ICONS[cat.icon] + "</span>" +
        "<span>" + esc(cat.label) + "</span>" +
        "</button>"
      );
    }).join("");
  };

  PortfolioStage.prototype.render = function () {
    var list = this.visibleProjects();
    if (!list.length) return;

    var activeIndex = list.findIndex(function (p) { return p.id === this.activeId; }, this);
    if (activeIndex === -1) {
      activeIndex = 0;
      this.activeId = list[0].id;
    }

    var frag = document.createDocumentFragment();
    var wrap = document.createElement("div");

    var depths = ["depth-1", "depth-2"];
    var html = "";
    var count = list.length;

    /* The fan wraps around the filtered list instead of clamping at its ends.
       Clamping meant the first project showed no left-hand cards at all (and
       the last none on the right), leaving the stack visibly lopsided; the
       approved reference shows non-sequential numbers on both flanks
       (06, 02 | 01 | 03, 04), i.e. a continuous ring.

       There are only count-1 other projects to show, so the fan is capped at
       that and filled right-first. Without the cap a short list would repeat
       the same card on both flanks; without the right-first split, the
       2-project categories (most of them) would round down to zero rear
       cards per side and render a bare, unlayered stack under every filter. */
    var rightCount = Math.min(depths.length, Math.ceil((count - 1) / 2));
    var leftCount = Math.min(depths.length, Math.floor((count - 1) / 2));

    for (var d = leftCount - 1; d >= 0; d--) {
      var leftIndex = (activeIndex - (d + 1) + count * 2) % count;
      html += rearCardHTML(list[leftIndex], depths[d], "left");
    }

    html += activeCardHTML(list[activeIndex]);

    for (var d2 = 0; d2 < rightCount; d2++) {
      var rightIndex = (activeIndex + d2 + 1) % count;
      html += rearCardHTML(list[rightIndex], depths[d2], "right");
    }

    wrap.innerHTML = html;
    frag.appendChild(wrap);

    this.track.innerHTML = "";
    while (wrap.firstChild) this.track.appendChild(wrap.firstChild);

    this.settleIn();
    this.fitActive();
    this.updateArrowState(list, activeIndex);
  };

  /* The active card's height follows the viewport, its text does not: on
     a short window (a 1366x768 or 1280x720 laptop) the description and
     tags pushed View Project / View case study past the card's clipped
     bottom edge. When the text column overflows, the description gives
     up a line at a time (ending on an ellipsis, full text kept in its
     title), then the tags drop to a single row, then go, until the
     buttons fit. Layout metrics only, so the entrance transform does
     not skew them; on phones the card has no fixed height and this
     never triggers. */
  PortfolioStage.prototype.fitActive = function () {
    var left = this.track.querySelector(".portfolio-card.is-active .portfolio-card-left");
    if (!left) return;
    var desc = left.querySelector(".portfolio-card-desc");
    var tags = left.querySelector(".portfolio-tags");
    if (desc) {
      desc.style.removeProperty("display");
      desc.style.removeProperty("-webkit-box-orient");
      desc.style.removeProperty("-webkit-line-clamp");
      desc.style.removeProperty("overflow");
      desc.style.removeProperty("flex-shrink");
    }
    if (tags) {
      tags.style.removeProperty("max-height");
      tags.style.removeProperty("overflow");
      tags.style.removeProperty("display");
      tags.style.removeProperty("flex-shrink");
    }
    // the last row (the buttons) must end above the panel's bottom
    // padding, not just inside its box
    var over = function () {
      var last = left.lastElementChild;
      if (!last || last.offsetParent !== left) return left.scrollHeight > left.clientHeight + 1;
      var pb = parseFloat(getComputedStyle(left).paddingBottom) || 0;
      return last.offsetTop + last.offsetHeight > left.clientHeight - pb + 1;
    };
    if (!over()) return;

    if (desc) {
      var lh = parseFloat(getComputedStyle(desc).lineHeight) || 20;
      var lines = Math.round(desc.offsetHeight / lh);
      desc.title = desc.textContent;
      desc.style.display = "-webkit-box";
      desc.style.webkitBoxOrient = "vertical";
      desc.style.overflow = "hidden";
      desc.style.flexShrink = "0";
      while (over() && lines > 2) {
        lines -= 1;
        desc.style.webkitLineClamp = String(lines);
      }
    }
    if (over() && tags && tags.firstElementChild) {
      tags.style.maxHeight = tags.firstElementChild.offsetHeight + "px";
      tags.style.overflow = "hidden";
      tags.style.flexShrink = "0";
    }
    if (over() && tags) tags.style.display = "none";
  };

  /* Every render() call replaces all card nodes (simple and easy to keep
     correct, versus reconciling a persistent node per project across
     both index changes AND category changes). To still satisfy "smooth
     transform/opacity, no layout jump" rather than a hard cut, every
     fresh batch is inserted pre-offset (nudged toward the side it
     conceptually came from) and opacity:0, then released one frame
     later so CSS transitions them into their real computed position -
     the whole stack settles together instead of popping in place. The
     stage's own box never changes size, so nothing else on the page
     jumps regardless. */
  PortfolioStage.prototype.settleIn = function () {
    if (this.reduceMotion) return;
    var cards = this.track.querySelectorAll(".portfolio-card");
    cards.forEach(function (card) {
      card.classList.add("is-entering");
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        cards.forEach(function (card) {
          card.classList.remove("is-entering");
        });
      });
    });
  };

  PortfolioStage.prototype.updateArrowState = function (list, activeIndex) {
    var loopable = list.length > 1;
    this.prevBtn.disabled = !loopable;
    this.nextBtn.disabled = !loopable;
  };

  /* Play sequence. The Loom iframe is created on the click (an idle
     player per card would load Loom's whole bundle up front, and would
     swallow clicks meant for the carousel) but stays invisible until two
     things are both true: the text panel has finished leaving, and the
     player has loaded. Until then the card's own first frame stays on
     screen, so there is no black or white flash between the two.

     Below 900px the text sits above the video rather than over it, so it
     never leaves; the player simply takes the video's place. Switching
     cards re-renders the track, which removes the player and stops it. */
  var LEAVE_MS = 440;
  var PLAYER_TIMEOUT_MS = 4000;

  PortfolioStage.prototype.playVideo = function (card) {
    if (!card || card.classList.contains("is-leaving")) return;
    var stage = card.querySelector(".portfolio-video-stage");
    var id = stage && stage.getAttribute("data-loom-id");
    if (!id) return;

    var iframe = document.createElement("iframe");
    iframe.src = "https://www.loom.com/embed/" + encodeURIComponent(id) +
      "?autoplay=1&hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true";
    iframe.title = stage.getAttribute("data-video-title") || "Project video";
    iframe.setAttribute("allow", "autoplay; fullscreen; picture-in-picture");
    iframe.setAttribute("allowfullscreen", "");

    // Each Play gets its own token, so a timer left over from an earlier
    // Play (closed and replayed within the timeout) cannot reveal this
    // newer player before it has loaded.
    var token = {};
    card._videoToken = token;

    var loaded = false;
    var left = false;
    var shown = false;
    var reveal = function () {
      if (shown || !loaded || !left) return;
      if (card._videoToken !== token) return;
      if (!card.isConnected || !card.classList.contains("is-leaving")) return;
      shown = true;
      card.classList.add("is-playing");
      iframe.focus();
    };

    iframe.addEventListener("load", function () { loaded = true; reveal(); });
    // Some networks never fire load for a third-party frame; reveal anyway
    // rather than leave the card stuck on a still frame.
    window.setTimeout(function () { loaded = true; reveal(); }, PLAYER_TIMEOUT_MS);

    stage.innerHTML = "";
    stage.appendChild(iframe);
    card.classList.add("is-leaving");

    var stacked = window.matchMedia && window.matchMedia("(max-width: 900px)").matches;
    // ?motion=1 (motion-preview.js) previews the sequence on machines with
    // animations switched off, like the rest of the site's motion.
    var reduce = this.reduceMotion && !window.__motionPreview;
    var wait = reduce || stacked ? 0 : LEAVE_MS;
    window.setTimeout(function () { left = true; reveal(); }, wait);
  };

  PortfolioStage.prototype.closeVideo = function (card) {
    if (!card || !card.classList.contains("is-leaving")) return;
    var stage = card.querySelector(".portfolio-video-stage");
    card._videoToken = null;
    card.classList.remove("is-playing");
    var finish = function () {
      if (stage) stage.innerHTML = "";
      card.classList.remove("is-leaving");
      var btn = card.querySelector(".portfolio-watch-btn");
      if (btn) btn.focus({ preventScroll: true });
    };
    // Let the player fade out before the text comes back over it.
    if (this.reduceMotion && !window.__motionPreview) finish();
    else window.setTimeout(finish, 280);
  };

  PortfolioStage.prototype.setActive = function (id) {
    if (id === this.activeId) return;
    this.activeId = id;
    this.render();
  };

  PortfolioStage.prototype.step = function (dir) {
    var list = this.visibleProjects();
    if (list.length < 2) return;
    var idx = list.findIndex(function (p) { return p.id === this.activeId; }, this);
    var next = (idx + dir + list.length) % list.length;
    this.setActive(list[next].id);
  };

  PortfolioStage.prototype.setCategory = function (key) {
    // Re-clicking the selected pill jumps back to that category's first
    // card; there is nothing to re-render if it is already showing.
    if (key === this.category) {
      var current = this.visibleProjects();
      if (current.length) this.setActive(current[0].id);
      return;
    }
    this.category = key;
    this.renderPills();
    // Each filter opens on its lowest-numbered card, so every category
    // reads in order from its start rather than from wherever the
    // previous filter happened to be.
    var list = this.visibleProjects();
    if (list.length) this.activeId = list[0].id;
    this.render();
  };

  PortfolioStage.prototype.bindEvents = function () {
    var self = this;

    this.prevBtn.addEventListener("click", function () { self.step(-1); });
    this.nextBtn.addEventListener("click", function () { self.step(1); });

    this.pillsHost.addEventListener("click", function (e) {
      var btn = e.target.closest(".portfolio-pill");
      if (btn) self.setCategory(btn.getAttribute("data-category"));
    });

    this.track.addEventListener("click", function (e) {
      var play = e.target.closest("[data-video-play]");
      if (play) {
        self.playVideo(play.closest(".portfolio-card--video"));
        return;
      }
      var close = e.target.closest(".portfolio-video-close");
      if (close) {
        self.closeVideo(close.closest(".portfolio-card--video"));
        return;
      }
      var card = e.target.closest(".portfolio-card-rear");
      if (card) self.setActive(card.getAttribute("data-id"));
    });

    this.root.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        var playing = self.track.querySelector(".portfolio-card--video.is-leaving");
        if (playing) self.closeVideo(playing);
        return;
      }
      if (e.key === "ArrowLeft") self.step(-1);
      if (e.key === "ArrowRight") self.step(1);
    });
  };

  function init() {
    var root = document.querySelector("[data-portfolio-stage]");
    if (!root) return;
    new PortfolioStage(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
