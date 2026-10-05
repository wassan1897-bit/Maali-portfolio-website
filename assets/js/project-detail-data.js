/* ==========================================================================
   PROJECT DETAIL DATA
   One entry per case-study page, keyed by the slug used in its URL
   (/projects/<slug>/). project-detail.js reads window.PROJECT_DETAILS[slug]
   and renders the whole page from it - this file is the only place new
   project content should be added; the renderer and the page shell are
   generic and never need to change per project.
   ========================================================================== */

(function () {
  "use strict";

  var TOOL_ICON_BASE = "../../assets/images/tools/";
  var IMG_BASE = "../../assets/images/projects/";

  window.PROJECT_DETAILS = {
    "outbound-voice-agent": {
      number: "02",
      category: "Voice Agents",
      breadcrumb: ["02", "Voice Agents", "Sales", "Outbound"],

      title: "Outbound Voice Agent",
      titleLines: ["Outbound", "Voice Agent"],

      description:
        "An outbound calling agent that researches each lead, checks live availability in Cal.com, books the appointment, and schedules retries based on how each call went.",

      actions: [
        { label: "Live Demo", href: "#", style: "solid", external: false }
      ],

      metaTags: [
        { icon: "sparkle", label: "AI Automation" },
        { icon: "store", label: "Sales" },
        { icon: "pin", label: "Global" }
      ],

      annotation: { lines: ["Real conversations,", "real bookings."] },

      visual: {
        // Ultrawide workflow screenshots — frame uses visual.aspect.
        aspect: "wide",
        slides: [
          {
            src: IMG_BASE + "p02-agent-config.webp?v=2",
            alt: "Outbound cold calling agent settings with custom tools for availability, booking and call disposition"
          },
          {
            src: IMG_BASE + "p02-leads-database.webp?v=2",
            alt: "Lead Research Database grid with call status, outcomes and notes"
          },
          {
            src: IMG_BASE + "p02-schedule-call.webp?v=2",
            alt: "Scheduled workflow that searches leads, places an ElevenLabs call, then updates success or failure"
          },
          {
            src: IMG_BASE + "p02-check-availability.webp?v=2",
            alt: "Check Availability tool: webhook to Cal.com availability and response"
          },
          {
            src: IMG_BASE + "p02-book-demo.webp?v=2",
            alt: "Book Demo tool: webhook to Cal.com booking, Airtable update, then success response"
          },
          {
            src: IMG_BASE + "p02-fetch-call-data.webp?v=2",
            alt: "Fetch Call Initiation Data workflow with original and callback personalization branches"
          },
          {
            src: IMG_BASE + "p02-call-disposition.webp?v=2",
            alt: "Call Disposition tool routing callbacks and updating the call log"
          }
        ]
      },

      metrics: [
        { value: "13+", label: "Personalization Variables", note: "Dynamically generated per call" },
        { value: "Live", label: "Cal.com Sync", note: "Real-time availability checking" },
        { value: "2", label: "Agent Types", note: "One for first calls, one for callbacks" }
      ],

      tools: [
        { key: "elevenlabs", name: "ElevenLabs" },
        { key: "n8n", name: "n8n" },
        { key: "calcom", name: "Cal.com" },
        { key: "airtable", name: "Airtable" },
        { key: "javascript", name: "JavaScript" }
      ],

      cards: [
        {
          title: "My Role",
          eyebrow: "Voice Agent Developer",
          body: "I designed and deployed the whole setup, connecting ElevenLabs, n8n and Cal.com so outbound calls go out, get followed up and get booked without anyone dialling."
        },
        {
          title: "Dynamic Personalization",
          body: "Each call uses 13+ variables pulled from Airtable, like the business name, the owner's details and the problems specific to that lead, so the agent isn't reading the same script to everyone."
        },
        {
          title: "The Architecture",
          list: [
            "Separate agents for first calls and callbacks",
            "Call history carried over, so a callback knows what was said last time",
            "Call times converted to each prospect's own timezone",
            "Appointments booked in Cal.com, with confirmations sent",
            "Retry delays that change depending on how the last call ended"
          ]
        },
        {
          title: "Status & Outcome",
          eyebrow: "Published on Aug 20, 2025",
          body: "The agent handles qualification and booking on its own, which cuts the manual outreach time, and every prospect still gets a call built around their own details."
        }
      ],


      cta: {
        label: "Ready to scale your outreach?",
        heading: "Let’s build your agent.",
        supporting: "From cold lead to booked meeting, without anyone picking up the phone.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Outbound", "Voice AI", "Scale"]
      }
    },

    "operations-command-centre": {
      number: "01",
      category: "AI Automation",
      breadcrumb: ["01", "AI Automation", "Wholesale", "Dashboards"],

      title: "Operations Command Centre",
      titleLines: ["Operations", "Command Centre"],

      description:
        "Two live dashboards on one Supabase database for a flooring wholesaler: a dispatch board for deliveries and purchase orders, and a command centre tracking revenue, margin, inventory vs par, and a full sales funnel.",

      actions: [
        { label: "Live Demo", href: "#", style: "solid", external: false }
      ],

      metaTags: [
        { icon: "database", label: "Dashboard" },
        { icon: "store", label: "Wholesale" },
        { icon: "sparkle", label: "AI Automation" },
        { icon: "pin", label: "Canada" }
      ],

      annotation: { lines: ["From a hand-filled spreadsheet", "to live numbers"] },

      visual: {
        // Looping slider (project-detail.js): Command Centre UI + system map.
        // Images are remastered to the hero frame aspect so they fill edge-to-edge.
        slides: [
          {
            src: IMG_BASE + "p01-command-centre.webp?v=5",
            alt: "Operations Command Centre dashboard: monthly sqft pace, revenue, margin, sales funnel and inventory"
          },
          {
            src: IMG_BASE + "p01-architecture.webp?v=5",
            alt: "System map: sources into n8n, Supabase, then Dispatch board and Command Centre screens"
          }
        ]
      },

      metrics: [
        { value: "2", label: "Live Dashboards", note: "Dispatch & Command Centre" },
        { value: "11", label: "SQL Views", note: "Handling complex maths & logic" },
        { value: "3", label: "n8n Workflows", note: "Reading live inventory data" },
        { value: "100%", label: "Real-time", note: "Replaced hand-filled sheets" }
      ],

      tools: [
        { key: "supabase", name: "Supabase (Postgres)" },
        { key: "n8n", name: "n8n" },
        { key: "lovable", name: "Lovable" },
        { key: "inventory_api", name: "Inventory API" },
        { key: "crm_api", name: "CRM API" },
        { key: "claude_code", name: "Claude Code" }
      ],

      cards: [
        {
          title: "The Problem",
          body: "Dispatch had no shared board, and the sales team had no single view of revenue, margin, receivables, stock or outreach. Cost and stock came from a spreadsheet someone filled in by hand, which fell months behind while every sync kept reporting success."
        },
        {
          title: "What I Built",
          body: "Two dashboards on one Supabase database. A dispatch board for deliveries and purchase orders, and a command centre for the sales team: square footage shipped against the monthly target, revenue, booked revenue, margin, a sales funnel from first outreach to closed deal, and stock against par level for each product. 12 tables and 11 SQL views do the maths; the front ends are built in Lovable. In September, three n8n workflows were rebuilt to read cost, price and live stock straight from the inventory system's API, and the hand-filled sheet was retired."
        },
        {
          title: "Working with Claude Code",
          body: "Wrote every SQL view, migration and fix script, wrote the Lovable build prompts, and checked each published version against the live data rather than trusting the tool's own summary."
        },
        {
          title: "Worth Telling (Insights & Edge Cases)",
          list: [
            "A sync reported success on every run for months while quietly skipping over 40% of recent orders, because its page size and its skip step disagreed. Found by counting records at each step instead of trusting the green status.",
            "The source system's own stock was negative on about a fifth of products: stock was sold but never recorded as received. Rather than show negative stock on a screen the client reads, the live sync was held back until a clamp rule and a physical count made the number trustworthy.",
            "One month showed zero revenue next to tens of thousands of square feet shipped. The revenue view was keyed to an admin date that gets backfilled in batches; keying it to the transaction date fixed it."
          ]
        },
        {
          title: "Status & Outcome",
          eyebrow: "Live in Production",
          body: "Both dashboards live and in daily use. The move to the inventory system's own data went live in September 2026."
        }
      ],


      cta: {
        label: "Ready to build your command centre?",
        heading: "Let’s connect your data.",
        supporting: "Live numbers instead of a spreadsheet someone updates by hand.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Visibility", "Live Data", "Growth"]
      }
    },

    "multi-store-ad-automation": {
      number: "03",
      category: "AI Automation",
      breadcrumb: ["03", "AI Automation", "Retail", "Multi-Location"],

      title: "Multi-Store Ad Automation",
      titleLines: ["Multi-Store", "Ad Automation"],

      description:
        "A production system for a multi-location retail brand. It turns new Facebook posts from each store into local ads, tracks how they perform, and uses fixed rules plus AI reasoning to decide which ads keep running. Built to scale across 20+ locations.",

      actions: [
        { label: "Live Demo", href: "#", style: "solid", external: false },
        { label: "View on GitHub", href: "#", style: "outline", icon: "github", external: true }
      ],

      metaTags: [
        { icon: "facebook", label: "Social Media" },
        { icon: "store", label: "Retail" },
        { icon: "sparkle", label: "AI Automation" },
        { icon: "pin", label: "United States" }
      ],

      annotation: { lines: ["Local posts,", "turned into local ads."] },

      visual: {
        // Shown as a looping slider (project-detail.js), in this order.
        slides: [
          { src: IMG_BASE + "p03-architecture.webp", alt: "How the system works: one nightly trigger, four workflows and the guard rails" },
          { src: IMG_BASE + "p03-dashboard.webp", alt: "The live dashboard: ads per store, reach and run history" },
          { src: IMG_BASE + "p03-decisions.webp", alt: "The decision feed: every create and retire, with the AI's reasoning" }
        ]
      },

      metrics: [
        { value: "20", label: "Store Pages Connected", note: "Organic posts from each store" },
        { value: "11,220", label: "Best Reach (One Ad)", note: "Real customers reached" },
        { value: "100%", label: "Automated", note: "Runs every night" },
        { value: "2", label: "Stores Live in Production", note: "With more in rollout" }
      ],

      tools: [
        { key: "n8n", name: "n8n" },
        { key: "supabase", name: "Supabase (Postgres)" },
        { key: "meta", name: "Meta API" },
        { key: "gemini", name: "Gemini" },
        { key: "vercel", name: "Vercel" },
        { key: "python", name: "Python" }
      ],

      cards: [
        {
          title: "The Problem",
          body: "Store staff were manually creating local ads for multiple store pages, which was time consuming and inconsistent. Good organic content would often go unnoticed, performance was hard to track across locations, and there was no system for when to boost, pause, or retire ads."
        },
        {
          title: "The Solution",
          body: "The system watches each store's Facebook page, turns the best posts into local ads, and checks them against business rules with AI reasoning on top. It validates the content, creates the ads through the Meta API, stores everything in Supabase and shows it all on a live dashboard."
        },
        {
          title: "What I Built",
          list: [
            "Automatic post detection and analysis",
            "Ad creation, with AI checking each post first",
            "Real-time performance tracking",
            "Rules for scaling, pausing, or retiring ads",
            "A dashboard with a view for every store",
            "Full history of actions and decisions"
          ]
        },
        {
          title: "Status & Outcome",
          eyebrow: "Live in Production",
          body: "Running on 2 stores, with the rollout approved for more locations. The client now sees every store's ads and results in one place instead of checking each page by hand."
        }
      ],


      cta: {
        label: "Ready to build something similar?",
        heading: "Let’s automate your growth.",
        supporting: "Your stores' best posts, turned into ads automatically.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Posts", "Ads", "Results"]
      }
    },

    "lead-research-system": {
      number: "04",
      category: "AI Automation",
      breadcrumb: ["04", "AI Automation", "Lead Gen", "Research"],

      title: "Lead Research System",
      titleLines: ["Lead Research", "System"],

      description:
        "An automated pipeline that turns raw business leads into sales-ready profiles. Research that took 30+ minutes per lead by hand now takes under 2 minutes, and every profile comes out in the same structure.",

      actions: [
        { label: "Live Demo", href: "#", style: "solid", external: false }
      ],

      metaTags: [
        { icon: "sparkle", label: "AI Automation" },
        { icon: "store", label: "Sales" },
        { icon: "pin", label: "Global" }
      ],

      annotation: { lines: ["Raw leads,", "sales-ready."] },

      // Same n8n workflow screenshot used on the homepage card - one
      // image, so the visual frame falls back to its solo layout (see
      // project-detail.js) rather than reserving space for two panels
      // that were never supplied.
      visual: {
        wide: "../../assets/images/portfolio photos/porfolio final images/bg_card_04_lead_research.webp",
        a: "",
        b: ""
      },

      // Both numbers are the ones actually given (30+ -> under 2
      // minutes); the other two count the named integrations rather
      // than asserting a result that was never measured or supplied.
      metrics: [
        { value: "30+", label: "Minutes, Manually", note: "Research time per lead, before automation" },
        { value: "<2", label: "Minutes, Automated", note: "Research time per lead, after automation" },
        { value: "4", label: "Systems Integrated", note: "Apify, OpenAI, Airtable, Close.com" },
        { value: "1", label: "n8n Pipeline", note: "End-to-end lead intelligence workflow" }
      ],

      tools: [
        { key: "apify", name: "Apify" },
        { key: "openai", name: "OpenAI" },
        { key: "airtable", name: "Airtable" },
        { key: "closecom", name: "Close.com" },
        { key: "n8n", name: "n8n" }
      ],

      cards: [
        {
          title: "The Problem",
          body: "Manually researching a single business lead (checking their site, socials and public records for the details that make a pitch land) took 30+ minutes and produced inconsistent results depending on who did the digging and how much time they had that day."
        },
        {
          title: "The Solution",
          body: "An automated pipeline that takes a raw lead and returns a sales-ready profile in under 2 minutes. Apify pulls public business data, OpenAI reads and structures it into the fields a sales rep actually needs, Airtable holds the enriched record, and Close.com receives it ready to work."
        },
        {
          title: "What I Built",
          list: [
            "Automated data collection from public sources via Apify",
            "AI-driven enrichment and structuring of raw lead data with OpenAI",
            "Centralized, query-ready lead records in Airtable",
            "Direct sync of sales-ready profiles into Close.com CRM",
            "End-to-end n8n workflow requiring no manual handoff between steps"
          ]
        },
        {
          title: "My Role",
          eyebrow: "n8n Automation Developer & AI Integration Specialist",
          body: "Designed and built the full pipeline end to end: the Apify scraping layer, the OpenAI prompts that turn raw data into structured fields, the Airtable schema, and the Close.com sync. I was the only automation developer on the project."
        }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Let’s automate your pipeline.",
        supporting: "From raw lead to sales-ready prospect, without the manual research.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Leads", "Automated", "Sales-Ready"]
      }
    },

    "restaurant-chatbot": {
      number: "05",
      category: "AI Automation",
      breadcrumb: ["05", "AI Automation", "Restaurant Tech", "Chatbot"],

      title: "Restaurant Chatbot",
      titleLines: ["Restaurant", "Chatbot"],

      description:
        "A Voiceflow chatbot for a restaurant that takes table reservations and food orders in the same conversation, with Make.com capturing the customer's details.",

      actions: [
        { label: "Live Demo", href: "#", style: "solid", external: false }
      ],

      metaTags: [
        { icon: "sparkle", label: "AI Automation" },
        { icon: "store", label: "Restaurant Tech" },
        { icon: "pin", label: "Global" }
      ],

      annotation: { lines: ["One bot,", "two jobs done."] },

      // Same 4-panel screenshot used on the homepage card - one image,
      // solo layout (see project-detail.js).
      visual: {
        wide: "../../assets/images/portfolio photos/porfolio final images/bg_card_05_restaurant_chatbot.webp",
        a: "",
        b: ""
      },

      // The two given numbers (dual functionality, one bot) plus a count
      // of the platforms wired together and the deliverable's own name -
      // no performance stat was supplied for this project, so none is
      // asserted here.
      metrics: [
        { value: "2", label: "Jobs, One Bot", note: "Reservations and food ordering together" },
        { value: "1", label: "Voiceflow Canvas", note: "Every conversation branch in one flow" },
        { value: "2", label: "Platforms Wired", note: "Voiceflow + Make.com" },
        { value: "100%", label: "Automated Capture", note: "Customer details, no manual entry" }
      ],

      tools: [
        { key: "voiceflow", name: "Voiceflow" },
        { key: "make", name: "Make.com" }
      ],

      cards: [
        {
          title: "The Problem",
          body: "A restaurant fielding both table reservations and food orders through the same customer-facing channel needed one bot that could handle both without the conversation becoming confusing or the two flows colliding."
        },
        {
          title: "The Solution",
          body: "A single Voiceflow chatbot with dual functionality: reservations and ordering run as separate, clearly branched conversation paths from the same entry point, so the customer never has to know or care which flow they're in. Make.com's API integration captures every customer detail collected along the way."
        },
        {
          title: "What I Built",
          list: [
            "Reservations and ordering handled by one bot",
            "Branching conversation flows, mapped out and organised in the canvas",
            "Customer details captured automatically through Make.com",
            "Built for a real restaurant's day-to-day operations",
            "Structured so new flows are easy to add later"
          ]
        },
        {
          title: "My Role",
          eyebrow: "Voiceflow Chatbot Developer",
          body: "Designed and built the whole conversation setup in Voiceflow: the reservation and ordering flows, their branching logic, and the Make.com integration that captures customer data in the background."
        }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Let’s put a bot to work.",
        supporting: "Reservations, orders, or both. One conversation flow can handle it.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Conversations", "Automated", "On Brand"]
      }
    },

    "ai-blog-posting-automation": {
      number: "04",
      category: "AI Automation",
      breadcrumb: ["04", "AI Automation", "Content", "Distribution"],

      title: "AI Blog Posting Automation",
      titleLines: ["AI Blog Posting", "Automation"],

      description:
        "An n8n system that writes blog posts, generates an image for each one, publishes to WordPress and then shares the post across four social platforms on its own.",

      actions: [
        { label: "Live Demo", href: "#", style: "solid", external: false }
      ],

      metaTags: [
        { icon: "sparkle", label: "AI Automation" },
        { icon: "store", label: "Content Marketing" },
        { icon: "pin", label: "Global" }
      ],

      annotation: { lines: ["From blank page,", "to published post."] },

      visual: {
        aspect: "wide",
        slides: [
          {
            src: IMG_BASE + "p04-content-pipeline.webp?v=1",
            alt: "Content generation workflow: sheet rows, AI writing, image generation, WordPress publish, then handoff"
          },
          {
            src: IMG_BASE + "p04-social-distribute.webp?v=1",
            alt: "Distribution workflow posting to Facebook, Reddit and Threads from a shared edit-fields step"
          }
        ]
      },

      // All four numbers are stated directly in the project's own
      // technical documentation (node counts per workflow, platforms
      // integrated, the scheduling interval) rather than an outcome
      // that was never measured.
      metrics: [
        { value: "100%", label: "Automated", note: "Content creation and distribution, hands-off" },
        { value: "4", label: "Platforms Reached", note: "Facebook, Reddit, Threads, Pinterest" },
        { value: "26", label: "Workflow Nodes", note: "17 in content generation, 9 in distribution" },
        { value: "6h", label: "Publish Cycle", note: "Scheduled content generation interval" }
      ],

      tools: [
        { key: "n8n", name: "n8n" },
        { key: "openai", name: "OpenAI API" },
        { key: "dalle", name: "DALL-E API" },
        { key: "wordpress", name: "WordPress" },
        { key: "facebook", name: "Facebook Graph API" },
        { key: "reddit", name: "Reddit API" },
        { key: "threads", name: "Threads API" },
        { key: "pinterest", name: "Pinterest API" }
      ],

      cards: [
        {
          title: "The Problem",
          body: "Producing a blog post, generating an image to go with it, publishing it, and then manually re-posting a version of it across four different social platforms was slow, repetitive work that competed with everything else on the schedule."
        },
        {
          title: "The Solution",
          body: "Two connected n8n workflows. The first runs on a schedule: it picks a topic, writes the article with GPT-4, generates an accompanying image with DALL-E, and publishes both straight to WordPress. The moment that post is live, it hands off to a second workflow that reformats and distributes it across Facebook, Reddit, Threads and Pinterest. Each one has its own API, its own posting format and its own rate limits to respect."
        },
        {
          title: "Workflow 1: Content Generation",
          list: [
            "Trigger: Schedule Trigger, running every 6 hours",
            "17 nodes total",
            "Key integrations: Google Sheets, OpenAI GPT-4, DALL-E, WordPress, n8n Execute Workflow"
          ]
        },
        {
          title: "Workflow 2: Social Distribution",
          list: [
            "Trigger: Execute Workflow Trigger, called by Workflow 1 the moment a post goes live",
            "9 nodes total",
            "Platforms: Facebook, Reddit, Threads, Pinterest"
          ]
        },
        {
          title: "Content & Image Generation",
          body: "GPT-4o first generates a topic, returned as structured JSON so the rest of the workflow can read it reliably. A second GPT-4o pass writes the full article, with headings, subheadings and formatting, aiming for 1,000+ words. DALL-E then generates a matching 1024×1024 image in the workflow's chosen visual style, which becomes the post's featured image."
        },
        {
          title: "WordPress Publishing",
          list: [
            "Generated image uploaded to WordPress's media library via its REST API",
            "Post created via the REST API with title, formatted content and the uploaded image set as featured media",
            "Published immediately: the status is set to \"publish\", not left as a draft"
          ]
        },
        {
          title: "Multi-Platform Distribution",
          list: [
            "Facebook: posted to the Page feed via Graph API, with the article excerpt and a link back to the full post",
            "Reddit: submitted as a self-post via Reddit's OAuth2 API, with the article title, excerpt and link",
            "Threads: a two-step API call. A text container is created, then published as a separate step",
            "Pinterest: a Pin is created via the Pinterest API, linking the post and using the generated image as the Pin's image"
          ]
        },
        {
          title: "Data Management in Google Sheets",
          body: "One sheet is the system of record for every post, with a dedicated column for each stage: Topic, Date, Slug, Tags, Outline, Category, Image Prompt, Image Web URL, Image ID, Image Slug, Post ID, URL, and the Blog Content itself.",
          list: [
            "Reads existing topics first, so the same subject is never generated twice",
            "Appends the new topic and its metadata as soon as it's generated",
            "Updates the row with image details right after the WordPress upload",
            "Updates the row again with the post ID and URL once WordPress publishing completes"
          ]
        },
        {
          title: "Scheduling, Rate Limits & Processing",
          list: [
            "6-hour schedule for each new content cycle",
            "6-minute delays built in between API calls, so no platform's rate limit gets tripped",
            "Wait nodes placed at each hand-off point across both workflows",
            "Topic deduplication checks the sheet's history before a new topic is generated",
            "Markdown-to-HTML conversion turns the AI's article output into WordPress-ready formatting",
            "HTML entities and stray tags are cleaned from the text before it's reused for social captions"
          ]
        },
        {
          title: "Error Handling & Monitoring",
          list: [
            "Credential management keeps every API key out of the workflow logic itself",
            "Retry logic on the critical nodes, so a single failed call doesn't stall the whole run",
            "Data validated before anything goes out to a social platform",
            "Execution monitoring uses pinned test data, so a run can be checked without posting live",
            "Known issue: the Reddit connection needed temporary disabling after Reddit changed its authentication requirements. Noted here rather than hidden"
          ]
        },
        {
          title: "Setup, Scale & What's Next",
          list: [
            "Runs on any n8n instance, cloud or self-hosted, with OpenAI (GPT-4 + DALL-E), WordPress REST API, Google Sheets API and each social platform's own API credentials configured",
            "Built to extend: adding LinkedIn, X or TikTok means adding another branch to the distribution workflow, not rebuilding it",
            "Planned next: analytics on post performance, A/B testing content variations, AI-driven content moderation, and optimal-time scheduling instead of a fixed interval",
            "Designed with multiple clients in mind: the same two workflows, reconfigured with each client's own credentials and sheet"
          ]
        },
        {
          title: "What I Built",
          list: [
            "End-to-end content pipeline: topic → article → image → published post",
            "AI content generation with GPT-4 and image generation with DALL-E",
            "Automatic WordPress publishing, including featured-image upload",
            "Distribution workflow posting to Facebook, Reddit, Threads and Pinterest",
            "Google Sheets as the system of record: topics, slugs, tags, image and post IDs",
            "Scheduled 6-hour publishing cycle with built-in delays to stay under each platform's rate limits"
          ]
        },
        {
          title: "My Role",
          eyebrow: "Marketing Automation Engineer & n8n Workflow Developer",
          body: "Designed and built both workflows end to end. That covers the content pipeline, the distribution workflow, every API integration, the Google Sheets data layer, and the scheduling and rate-limit logic across all five platforms."
        }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Let’s automate your content.",
        supporting: "From topic to five platforms, without posting anything by hand.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Content", "Automated", "Distributed"]
      }
    },

    "ai-social-media-bot-rem-token": {
      number: "05",
      category: "AI Automation",
      breadcrumb: ["05", "AI Automation", "Social Media", "Twitter Bot"],

      title: "AI Social Media Bot for REM Token",
      titleLines: ["AI Social Media Bot", "for REM Token"],

      description:
        "An n8n workflow that runs every 2 hours, finds Twitter conversations about Real World Assets and the REM token, scores each tweet with a custom JavaScript algorithm and replies to the best ones using Google Gemini. Login goes through a proxy with 2FA, every action is logged to SeaTable, and it ran with 99.8% uptime.",

      actions: [
        { label: "Live Demo", href: "#", style: "solid", external: false }
      ],

      metaTags: [
        { icon: "sparkle", label: "AI Automation" },
        { icon: "store", label: "Social Media Marketing" },
        { icon: "pin", label: "Global" }
      ],

      annotation: { lines: ["Always watching,", "always replying."] },

      visual: {
        aspect: "wide",
        slides: [
          {
            src: IMG_BASE + "p05-twitter-workflow.webp?v=1",
            alt: "n8n workflow: schedule, fetch tweets, score with code and Gemini, then reply and log to SeaTable"
          },
          {
            src: IMG_BASE + "p05-tweets-table.webp?v=1",
            alt: "SeaTable Tweets Data grid with original tweets, links, IDs and generated replies"
          }
        ]
      },

      // Every number here is one the project brief itself states (the
      // 2-hour run cycle, the 99.8% uptime, the client's own 5-star
      // rating) rather than a claim invented for the page.
      metrics: [
        { value: "2h", label: "Autonomous Cycle", note: "Runs completely hands-off, every 2 hours" },
        { value: "99.8%", label: "Uptime", note: "Across its scheduled runs" },
        { value: "5.0", label: "Client Rating", note: "5 out of 5 stars" },
        { value: "2FA", label: "Secured Login", note: "Proxy-secured authentication" }
      ],

      tools: [
        { key: "n8n", name: "n8n" },
        { key: "twitter", name: "Twitter API" },
        { key: "gemini", name: "Gemini" },
        { key: "seatable", name: "SeaTable" },
        { key: "javascript", name: "JavaScript" },
        { key: "webproxy", name: "Web Proxy" }
      ],

      cards: [
        {
          title: "The Problem",
          body: "Keeping up with a token's community on Twitter around the clock isn't something one person can do. Finding the right conversations, judging which are worth a reply and writing something relevant each time is slow, and nobody is doing it at 3am."
        },
        {
          title: "The Solution",
          body: "A fully autonomous n8n workflow that runs every 2 hours: it searches Twitter for Real World Asset and REM-related conversations, scores each tweet with a custom JavaScript algorithm to find the ones actually worth engaging with, drafts a contextual reply with Google Gemini, posts it via the Twitter API, and logs the tweet, the reply and its performance metrics to SeaTable. Nobody has to touch it."
        },
        {
          title: "What I Built",
          list: [
            "Scheduled tweet discovery and filtering for Real World Asset / REM-related conversations",
            "Custom JavaScript scoring algorithm to rank tweets by engagement value",
            "AI-generated, context-aware replies via Google Gemini",
            "Proxy-secured authentication with 2FA for account safety",
            "Automatic reply posting via the Twitter API",
            "Tweets, replies and performance metrics all logged to SeaTable"
          ]
        },
        {
          title: "My Role",
          eyebrow: "Automation Engineer & AI Integration Specialist",
          body: "Designed and built the entire workflow: the tweet discovery and scoring logic, the Gemini prompts, the secured login, and the SeaTable logging that tracks every action the bot takes."
        }
      ],

      // A real client review, included as given. Only the reviewer's own
      // identity (name / company / location) was not supplied, so that
      // line is simply left blank rather than invented.
      review: {
        quote:
          "Muhammad Ali delivered exactly what we needed, and more. He built a tailored n8n workflow that significantly improved our process efficiency, and he did it with professionalism, clear communication, and impressive technical skills. He took the time to understand the requirements, suggested smart improvements, and delivered ahead of schedule. What really stood out was his deep understanding of automation and his ability to troubleshoot and optimize even the most complex workflows. He was always responsive, collaborative, and easy to work with. Highly recommended for any automation projects, especially with n8n. Looking forward to working with him again soon!",
        rating: 5,
        name: "",
        org: "",
        location: "",
        highlights: [
          "Delivered ahead of schedule",
          "Deep automation expertise",
          "Clear, professional communication"
        ]
      },

      cta: {
        label: "Ready to build something similar?",
        heading: "Let’s automate your engagement.",
        supporting: "From scattered mentions to on-brand replies, around the clock.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Engagement", "Automated", "Always On"]
      }
    },

    // First video project. Everything below comes from the brief itself
    // (four approaches, two hosted file-search options, three file types,
    // dedupe) or from the Loom video's own metadata (the 5:00 duration).
    // No role or client review was supplied, so neither card is rendered.
    "enterprise-rag-data-ingestion": {
      number: "06",
      category: "AI Automation",
      breadcrumb: ["06", "AI Automation", "RAG", "Data Ingestion"],

      title: "Enterprise Multi-LLM RAG & Data Ingestion",
      titleLines: ["Enterprise", "Multi-LLM RAG", "& Data Ingestion"],
      titleSize: "compact",

      description:
        "Four RAG approaches compared side by side (vector search, graph RAG and two hosted file-search options) so a client could choose between them on evidence. Includes the ingestion workflow that dedupes files and handles spreadsheets, documents and PDFs differently.",

      actions: [
        { label: "Watch on Loom", href: "https://www.loom.com/share/47a73d7fab5942dba986746b44e6bf4c", style: "solid", external: true }
      ],

      metaTags: [
        { icon: "sparkle", label: "AI Automation" },
        { icon: "store", label: "Chatbots & RAG Assistants" }
      ],

      annotation: { lines: ["Four approaches,", "one clear choice."] },

      visual: {
        video: {
          loomId: "47a73d7fab5942dba986746b44e6bf4c",
          thumb: "../../assets/images/videos/rag-ingestion-pipeline.jpg",
          duration: "5:00"
        }
      },

      metrics: [
        { value: "4", label: "RAG Approaches", note: "Compared side by side" },
        { value: "2", label: "Hosted File Search", note: "Options in the comparison" },
        { value: "3", label: "File Types", note: "Spreadsheets, documents, PDFs" },
        { value: "5:00", label: "Walkthrough", note: "Recorded demo on Loom" }
      ],

      tools: [
        { key: "vector_search", name: "Vector Search" },
        { key: "graph_rag", name: "Graph RAG" },
        { key: "file_search", name: "Hosted File Search" },
        { key: "data_ingestion", name: "Data Ingestion" },
        { key: "dedupe", name: "File Deduplication" },
        { key: "multi_format", name: "PDF \u00b7 Doc \u00b7 Sheet" }
      ],

      cards: [
        {
          title: "The Question",
          body: "Which retrieval approach should a RAG assistant actually use? Rather than pick one on reputation, the client wanted to see the options run and choose between them on evidence."
        },
        {
          title: "Four Approaches, Side by Side",
          list: [
            "Vector search",
            "Graph RAG",
            "Hosted file search, option one",
            "Hosted file search, option two",
            "Run side by side, so the results can be compared directly"
          ]
        },
        {
          title: "The Ingestion Workflow",
          list: [
            "Deduplicates files before they are indexed",
            "Spreadsheets, documents and PDFs each take their own handling path"
          ]
        },
        {
          title: "Where It Fits",
          eyebrow: "Use on: chatbots & RAG assistants",
          body: "Any assistant that has to answer from a company's own files. The walkthrough above covers both halves: the retrieval comparison and the ingestion workflow behind it."
        }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Let\u2019s ground your assistant in your data.",
        supporting: "Pick the retrieval approach on evidence, then feed it clean data.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Retrieval", "Compared", "Grounded"]
      }
    },

    // Video cards 07-16 (Maali's videos 02-12; 05's Loom link is dead).
    "ai-context-engine-crm-sync": {
      number: "07",
      category: "CRM & Integrations",
      breadcrumb: ["07", "CRM & Integrations", "Video Demo"],

      title: "AI Context Engine & CRM Synchronisation Hub",
      titleLines: ["AI Context Engine", "& CRM", "Synchronisation", "Hub"],
      titleSize: "compact",

      description:
        "An engine that pulls from a CRM, SQL servers, a database, email and call transcripts to answer plain-English questions about any company or contact in real time, and drafts email replies the team copy-pastes almost unchanged. The second half shows a dashboard replacing a CRM outright.",

      actions: [
        { label: "Watch on Loom", href: "https://www.loom.com/share/b34c49af2ec74bc1af874ccc04c9964f", style: "solid", external: true }
      ],

      metaTags: [
        { icon: "sparkle", label: "CRM & Integrations" },
        { icon: "store", label: "AI Agents \u00b7 Integrations \u00b7 Dashboards" }
      ],

      annotation: { lines: ["Ask anything,", "answered in context."] },

      visual: {
        video: {
          loomId: "b34c49af2ec74bc1af874ccc04c9964f",
          thumb: "../../assets/images/videos/context-engine.jpg",
          duration: "5:00"
        }
      },

      metrics: [
        { value: "5", label: "Data Sources", note: "CRM, SQL servers, database, email, call transcripts" },
        { value: "Live", label: "Answers", note: "Plain-English questions, in real time" },
        { value: "Drafted", label: "Email Replies", note: "Copy-pasted almost unchanged" },
        { value: "5:00", label: "Walkthrough", note: "Recorded demo on Loom" }
      ],

      tools: [
        { key: "n8n", name: "n8n" },
        { key: "vd_hubspot", name: "HubSpot CRM" },
        { key: "vd_sql_servers", name: "SQL Servers" },
        { key: "vd_call_transcripts", name: "Call Transcripts" },
        { key: "vd_email_drafting", name: "Email Drafting" },
        { key: "vd_crm_dashboard", name: "CRM Dashboard" }
      ],

      cards: [
        { title: "What It Does", body: "Ask a plain-English question about any company or contact and get an answer in real time, pulled together from the CRM, SQL servers, a database, email and call transcripts, plus a drafted email reply the team can send almost as-is." },
        { title: "What the Video Shows", list: ["Questions about a company or contact answered live, from every source at once", "Email replies drafted from that context, ready to copy-paste", "In the second half, a dashboard replacing the CRM outright"] },
        { title: "Where It Fits", eyebrow: "Use on: AI agents \u00b7 integrations \u00b7 dashboards", body: "Any team whose knowledge about a customer is spread across a CRM, databases, inboxes and call recordings." }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Put every source behind one question.",
        supporting: "From scattered records to one plain-English answer, in real time.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Context", "Connected", "Answered"]
      }
    },

    "ai-agent-orchestration": {
      number: "08",
      category: "AI Automation",
      breadcrumb: ["08", "AI Automation", "Video Demo"],

      title: "AI Agent Orchestration: Backend Architecture",
      titleLines: ["AI Agent", "Orchestration:", "Backend", "Architecture"],
      titleSize: "compact",

      description:
        "The engine room behind the AI Context Engine: a master agent with a SQL agent that writes and runs its own queries against the full schema, tool-calls into other workflows, and a vector store holding procedural knowledge. The most technical of these walkthroughs.",

      actions: [
        { label: "Watch on Loom", href: "https://www.loom.com/share/44daf38c03664fae912096ab2408d42e", style: "solid", external: true }
      ],

      metaTags: [
        { icon: "sparkle", label: "AI Automation" },
        { icon: "store", label: "AI Agents" }
      ],

      annotation: { lines: ["One agent,", "many hands."] },

      visual: {
        video: {
          loomId: "44daf38c03664fae912096ab2408d42e",
          thumb: "../../assets/images/videos/agent-orchestration.jpg",
          duration: "3:24"
        }
      },

      metrics: [
        { value: "1", label: "Master Agent", note: "Orchestrates everything below it" },
        { value: "Full", label: "Schema Access", note: "The SQL agent writes its own queries" },
        { value: "3", label: "Capabilities", note: "SQL agent, workflow tool calls, vector store" },
        { value: "3:24", label: "Walkthrough", note: "Recorded demo on Loom" }
      ],

      tools: [
        { key: "n8n", name: "n8n" },
        { key: "vd_master_agent", name: "Master Agent" },
        { key: "vd_sql_agent", name: "SQL Agent" },
        { key: "gemini", name: "Gemini" },
        { key: "vd_qdrant", name: "Vector Store" },
        { key: "vd_tool_calls", name: "Workflow Tool Calls" }
      ],

      cards: [
        { title: "What It Does", body: "The backend behind the AI Context Engine. A master agent decides how to answer each question and hands the work to specialist capabilities underneath it." },
        { title: "What the Video Shows", list: ["A SQL agent that writes and runs its own queries against the full schema", "Tool calls into other workflows", "A vector store holding procedural knowledge"] },
        { title: "Where It Fits", eyebrow: "Use on: AI agents", body: "For technical buyers who want to see how an agent system is actually wired, not just what it answers." }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Let\u2019s architect your agents.",
        supporting: "A master agent, the right specialists, and data it can actually query.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Agents", "Orchestrated", "Grounded"]
      }
    },

    "outbound-voice-agent-live-call": {
      number: "09",
      category: "Voice Agents",
      breadcrumb: ["09", "Voice Agents", "Video Demo"],

      title: "Production Outbound Voice Agent: Live Call",
      titleLines: ["Production", "Outbound Voice", "Agent: Live Call"],
      titleSize: "compact",

      description:
        "A real recorded call. The agent qualifies a lead, handles objections and scheduling back-and-forth, and books a discovery call straight onto the calendar. You hear the whole call.",

      actions: [
        { label: "Watch on Loom", href: "https://www.loom.com/share/0e5a728545af4f2f9669269d9f75bb3b", style: "solid", external: true }
      ],

      metaTags: [
        { icon: "sparkle", label: "Voice Agents" },
        { icon: "store", label: "Voice Agents" }
      ],

      annotation: { lines: ["A real call,", "a real booking."] },

      visual: {
        video: {
          loomId: "0e5a728545af4f2f9669269d9f75bb3b",
          thumb: "../../assets/images/videos/voice-agent-call.jpg",
          duration: "4:24"
        }
      },

      metrics: [
        { value: "1", label: "Real Call", note: "Recorded in production, not staged" },
        { value: "Booked", label: "Outcome", note: "Discovery call on the calendar" },
        { value: "Positive", label: "User Sentiment", note: "Per the call\u2019s own analysis" },
        { value: "4:24", label: "Walkthrough", note: "Recorded demo on Loom" }
      ],

      tools: [
        { key: "retellai", name: "Retell AI" },
        { key: "vd_outbound", name: "Outbound Calling" },
        { key: "vd_qualify", name: "Lead Qualification" },
        { key: "vd_objections", name: "Objection Handling" },
        { key: "vd_booking", name: "Calendar Booking" },
        { key: "vd_call_analysis", name: "Call Analysis" }
      ],

      cards: [
        { title: "What It Does", body: "An outbound voice agent running in production. It calls a lead, qualifies them, works through objections and the back-and-forth of finding a time, and books the discovery call itself." },
        { title: "What the Video Shows", list: ["A real recorded call, played back in full", "Lead qualification and objection handling in conversation", "Scheduling back-and-forth ending in a booked discovery call", "The call\u2019s own analysis: successful, positive sentiment"] },
        { title: "Where It Fits", eyebrow: "Use on: voice agents", body: "Any team that needs leads called, qualified and booked without a person on the phone." }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Let\u2019s put a voice agent on the phones.",
        supporting: "Calls made, leads qualified, meetings booked.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Calls", "Qualified", "Booked"]
      }
    },

    "analytics-database-chatbot": {
      number: "10",
      category: "AI Automation",
      breadcrumb: ["10", "AI Automation", "Video Demo"],

      title: "Chatbot over a Live Analytics Database",
      titleLines: ["Chatbot over a", "Live Analytics", "Database"],
      titleSize: "compact",

      description:
        "A chatbot embedded on each client\u2019s dashboard that answers questions like \u201cwhat was my ad spend in January\u201d by writing and running live SQL against a purpose-built relational schema. Natural language in, real numbers out.",

      actions: [
        { label: "Watch on Loom", href: "https://www.loom.com/share/f7dfec8790d84ab7bd67275dcb72b6e5", style: "solid", external: true }
      ],

      metaTags: [
        { icon: "sparkle", label: "AI Automation" },
        { icon: "store", label: "Chatbots \u00b7 Dashboards" }
      ],

      annotation: { lines: ["Plain questions,", "real numbers."] },

      visual: {
        video: {
          loomId: "f7dfec8790d84ab7bd67275dcb72b6e5",
          thumb: "../../assets/images/videos/analytics-chatbot.jpg",
          duration: "5:00"
        }
      },

      metrics: [
        { value: "Live", label: "SQL", note: "Written and run for every question" },
        { value: "1", label: "Chatbot per Client", note: "Embedded on each dashboard" },
        { value: "Real", label: "Numbers", note: "Straight from the database" },
        { value: "5:00", label: "Walkthrough", note: "Recorded demo on Loom" }
      ],

      tools: [
        { key: "vd_voiceflow", name: "Voiceflow" },
        { key: "n8n", name: "n8n" },
        { key: "openai", name: "OpenAI" },
        { key: "supabase", name: "Supabase" },
        { key: "vd_postgres", name: "PostgreSQL" },
        { key: "vd_text_to_sql", name: "Text-to-SQL" }
      ],

      cards: [
        { title: "What It Does", body: "A chatbot on each client\u2019s dashboard. Ask it something like \u201cwhat was my ad spend in January\u201d and it writes and runs live SQL against a purpose-built relational schema, then answers with the real figure." },
        { title: "What the Video Shows", list: ["The chatbot answering a plain-English question with a real number", "The SQL it writes and runs to get there", "The purpose-built relational schema underneath"] },
        { title: "Where It Fits", eyebrow: "Use on: chatbots \u00b7 dashboards", body: "Any dashboard whose users would rather ask a question than build a filter." }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Let\u2019s let your data answer back.",
        supporting: "Natural language in, real numbers out.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Questions", "Queried", "Answered"]
      }
    },

    "dashboard-replacing-crm": {
      number: "11",
      category: "CRM & Integrations",
      breadcrumb: ["11", "CRM & Integrations", "Video Demo"],

      title: "Full-Stack Dashboard replacing a CRM",
      titleLines: ["Full-Stack", "Dashboard", "replacing a CRM"],
      titleSize: "compact",

      description:
        "Partners, deals, employees, clients and commissions in one system, on a schema designed from scratch. Tasks are created automatically when a deal closes, and orders sync through to the CRM.",

      actions: [
        { label: "Watch on Loom", href: "https://www.loom.com/share/d37b20e74ae0447c843beee72db2f21e", style: "solid", external: true }
      ],

      metaTags: [
        { icon: "sparkle", label: "CRM & Integrations" },
        { icon: "store", label: "Dashboards & Internal Tools" }
      ],

      annotation: { lines: ["One system", "instead of five."] },

      visual: {
        video: {
          loomId: "d37b20e74ae0447c843beee72db2f21e",
          thumb: "../../assets/images/videos/crm-dashboard.jpg",
          duration: "4:59"
        }
      },

      metrics: [
        { value: "5", label: "Record Types", note: "Partners, deals, employees, clients, commissions" },
        { value: "Auto", label: "Task Creation", note: "Fires on deal close" },
        { value: "Synced", label: "Orders", note: "Through to the CRM" },
        { value: "4:59", label: "Walkthrough", note: "Recorded demo on Loom" }
      ],

      tools: [
        { key: "supabase", name: "Supabase" },
        { key: "n8n", name: "n8n" },
        { key: "vd_crm_sync", name: "Pipedrive Sync" },
        { key: "vd_schema", name: "Custom Schema" },
        { key: "vd_auto_tasks", name: "Auto Task Creation" },
        { key: "vd_commissions", name: "Commissions" }
      ],

      cards: [
        { title: "What It Does", body: "One system for partners, deals, employees, clients and commissions, on a schema designed from scratch, so the business runs from a dashboard built around it rather than a CRM it had to fit into." },
        { title: "What the Video Shows", list: ["Every record type in one dashboard", "Tasks created automatically the moment a deal closes", "Orders syncing through to the CRM"] },
        { title: "Where It Fits", eyebrow: "Use on: dashboards & internal tools", body: "Any business that has outgrown its CRM\u2019s shape but still needs the CRM kept in step." }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Let\u2019s build the system you actually run on.",
        supporting: "Your records, your schema, your workflow, all in one place.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Deals", "Automated", "Synced"]
      }
    },

    "research-aggregator-newsletter": {
      number: "12",
      category: "AI Automation",
      breadcrumb: ["12", "AI Automation", "Video Demo"],

      title: "Research Aggregator & Automated Newsletter",
      titleLines: ["Research", "Aggregator &", "Automated", "Newsletter"],
      titleSize: "compact",

      description:
        "A weekly scheduled workflow that reads an inbox, extracts PDF attachments, aggregates the content and produces a formatted roundup email with linked sources. It replaced 20\u201330 newsletters somebody had to read by hand.",

      actions: [
        { label: "Watch on Loom", href: "https://www.loom.com/share/49949651ffa1462094aff95385f44044", style: "solid", external: true }
      ],

      metaTags: [
        { icon: "sparkle", label: "AI Automation" },
        { icon: "store", label: "Workflow Automation" }
      ],

      annotation: { lines: ["Thirty newsletters,", "one briefing."] },

      visual: {
        video: {
          loomId: "49949651ffa1462094aff95385f44044",
          thumb: "../../assets/images/videos/research-newsletter.jpg",
          duration: "4:55"
        }
      },

      metrics: [
        { value: "20\u201330", label: "Newsletters Replaced", note: "Previously read by hand" },
        { value: "Weekly", label: "Schedule", note: "Runs on its own" },
        { value: "PDFs", label: "Extracted", note: "Straight from inbox attachments" },
        { value: "4:55", label: "Walkthrough", note: "Recorded demo on Loom" }
      ],

      tools: [
        { key: "n8n", name: "n8n" },
        { key: "vd_gmail", name: "Gmail" },
        { key: "openai", name: "OpenAI" },
        { key: "vd_pdf_extract", name: "PDF Extraction" },
        { key: "vd_weekly", name: "Weekly Schedule" },
        { key: "vd_roundup", name: "Roundup Email" }
      ],

      cards: [
        { title: "What It Does", body: "Once a week it reads an inbox, pulls the PDF attachments out, aggregates everything and sends one formatted roundup email with linked sources, in place of the 20\u201330 newsletters someone used to read by hand." },
        { title: "What the Video Shows", list: ["The scheduled workflow reading the inbox", "PDF attachments extracted and aggregated", "The finished roundup email, with its linked sources"] },
        { title: "Where It Fits", eyebrow: "Use on: workflow automation", body: "Anyone whose week starts with a pile of newsletters and reports to get through." }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Let\u2019s shrink your reading list.",
        supporting: "Everything that matters this week, in one email.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Read", "Summarised", "Sent"]
      }
    },

    "bulk-data-migration": {
      number: "13",
      category: "CRM & Integrations",
      breadcrumb: ["13", "CRM & Integrations", "Video Demo"],

      title: "Bulk Data Migration: 9,500 Contacts",
      titleLines: ["Bulk Data", "Migration:", "9,500 Contacts"],
      titleSize: "compact",

      description:
        "A one-off migration of roughly 9,500 contacts (cleaned to 8,226 after removing duplicates and incomplete records) and around 5,000 job records into a new CRM via custom Python, mapped to the right pipeline and stage by rule.",

      actions: [
        { label: "Watch on Loom", href: "https://www.loom.com/share/18ba374343b148d3ba9de8749ffbfff1", style: "solid", external: true }
      ],

      metaTags: [
        { icon: "sparkle", label: "CRM & Integrations" },
        { icon: "store", label: "Integrations & Data Pipelines" }
      ],

      annotation: { lines: ["9,500 in,", "8,226 clean."] },

      visual: {
        video: {
          loomId: "18ba374343b148d3ba9de8749ffbfff1",
          thumb: "../../assets/images/videos/data-migration.jpg",
          duration: "4:58"
        }
      },

      metrics: [
        { value: "~9,500", label: "Contacts", note: "Before cleaning" },
        { value: "8,226", label: "Contacts Migrated", note: "Duplicates and incomplete records removed" },
        { value: "~5,000", label: "Job Records", note: "Moved alongside the contacts" },
        { value: "4:58", label: "Walkthrough", note: "Recorded demo on Loom" }
      ],

      tools: [
        { key: "vd_python", name: "Python" },
        { key: "gohighlevel", name: "GoHighLevel" },
        { key: "supabase", name: "Supabase" },
        { key: "vd_servicem8", name: "ServiceM8" },
        { key: "vd_dedupe", name: "Deduplication" },
        { key: "vd_pipeline_map", name: "Pipeline Mapping" }
      ],

      cards: [
        { title: "What It Does", body: "A one-off move of roughly 9,500 contacts and around 5,000 job records into a new CRM with custom Python, so every record lands in the right pipeline and stage by rule." },
        { title: "What the Video Shows", list: ["Contacts cleaned from ~9,500 to 8,226 by removing duplicates and incomplete records", "Around 5,000 job records migrated alongside them", "Rules mapping each record to its pipeline and stage"] },
        { title: "Where It Fits", eyebrow: "Use on: integrations & data pipelines", body: "Any CRM switch where the data is too messy, or too large, to move by hand." }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Let\u2019s move your data properly.",
        supporting: "Cleaned, deduplicated and mapped, not just copied.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Cleaned", "Mapped", "Migrated"]
      }
    },

    "ai-operating-system-part-1": {
      number: "14",
      category: "AI Automation",
      breadcrumb: ["14", "AI Automation", "Video Demo"],

      title: "AI Operating System: Part 1",
      titleLines: ["AI Operating", "System: Part 1"],
      titleSize: "compact",

      description:
        "A walkthrough of a real working AI operating system, not a demo environment: the directory structure, the canonical task file, per-project memory, and a live query showing it already knows the business.",

      actions: [
        { label: "Watch on Loom", href: "https://www.loom.com/share/c12aaa76d03c4f04a5fbc1769692b3d7", style: "solid", external: true }
      ],

      metaTags: [
        { icon: "sparkle", label: "AI Automation" },
        { icon: "store", label: "AI Operating Systems" }
      ],

      annotation: { lines: ["Not a demo,", "a working system."] },

      visual: {
        video: {
          loomId: "c12aaa76d03c4f04a5fbc1769692b3d7",
          thumb: "../../assets/images/videos/aios-part1.jpg",
          duration: "5:00"
        }
      },

      metrics: [
        { value: "1", label: "Canonical Task File", note: "One authoritative list of tasks" },
        { value: "Per-Project", label: "Memory", note: "Context kept for each project" },
        { value: "Live", label: "Query", note: "It already knows the business" },
        { value: "5:00", label: "Walkthrough", note: "Recorded demo on Loom" }
      ],

      tools: [
        { key: "vd_claude", name: "Claude Cowork" },
        { key: "vd_directory", name: "Directory Structure" },
        { key: "vd_task_file", name: "Canonical Task File" },
        { key: "vd_project_memory", name: "Per-Project Memory" },
        { key: "vd_live_query", name: "Live Query" },
        { key: "vd_business_context", name: "Business Context" }
      ],

      cards: [
        { title: "What It Does", body: "A real, working AI operating system, not a demo environment. Part 1 walks through how it is organised and shows it answering from what it already knows about the business." },
        { title: "What the Video Shows", list: ["The directory structure", "The canonical task file", "Per-project memory", "A live query showing it already knows the business"] },
        { title: "Where It Fits", eyebrow: "Use on: AI operating systems", body: "Continues in Part 2: the live dashboard, memory and feedback rules, and scheduled agents running." }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Let\u2019s build your AI operating system.",
        supporting: "Organised, remembered and already up to speed on your business.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Organised", "Remembered", "Running"]
      }
    },

    "ai-operating-system-part-2": {
      number: "15",
      category: "AI Automation",
      breadcrumb: ["15", "AI Automation", "Video Demo"],

      title: "AI Operating System: Part 2",
      titleLines: ["AI Operating", "System: Part 2"],
      titleSize: "compact",

      description:
        "Continues from Part 1 into the live dashboard, the memory and feedback rules, and scheduled agents actually running and producing reports on screen.",

      actions: [
        { label: "Watch on Loom", href: "https://www.loom.com/share/d627be034a08419b8e121691fd054ece", style: "solid", external: true }
      ],

      metaTags: [
        { icon: "sparkle", label: "AI Automation" },
        { icon: "store", label: "AI Operating Systems" }
      ],

      annotation: { lines: ["Agents on a schedule,", "reports on screen."] },

      visual: {
        video: {
          loomId: "d627be034a08419b8e121691fd054ece",
          thumb: "../../assets/images/videos/aios-part2.jpg",
          duration: "4:52"
        }
      },

      metrics: [
        { value: "Live", label: "Dashboard", note: "Shown running on screen" },
        { value: "Scheduled", label: "Agents", note: "Running on their own" },
        { value: "Real", label: "Reports", note: "Produced on screen" },
        { value: "4:52", label: "Walkthrough", note: "Recorded demo on Loom" }
      ],

      tools: [
        { key: "vd_claude", name: "Claude Cowork" },
        { key: "vd_aios_dashboard", name: "Live Dashboard" },
        { key: "vd_memory_rules", name: "Memory Rules" },
        { key: "vd_feedback_rules", name: "Feedback Rules" },
        { key: "vd_scheduled_agents", name: "Scheduled Agents" },
        { key: "vd_reports", name: "Reports" }
      ],

      cards: [
        { title: "What It Does", body: "Part 2 of the AI operating system walkthrough: the parts that keep it running on its own, and the reports it produces." },
        { title: "What the Video Shows", list: ["The live dashboard", "The memory and feedback rules", "Scheduled agents actually running and producing reports on screen"] },
        { title: "Where It Fits", eyebrow: "Use on: AI operating systems", body: "Follows on from Part 1, which covers the directory structure, task file and per-project memory." }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Let\u2019s build your AI operating system.",
        supporting: "Agents that run on schedule and report back.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Scheduled", "Reported", "Running"]
      }
    },

    "inherited-mvp-technical-review": {
      number: "16",
      category: "Others",
      breadcrumb: ["16", "Others", "Video Demo"],

      title: "Inherited MVP: Day-One Technical Review",
      titleLines: ["Inherited MVP:", "Day-One", "Technical Review"],
      titleSize: "compact",

      description:
        "A review of someone else\u2019s codebase: what to check first, and how to confirm it actually works. It covers access policies, exposed secrets, demo data posing as real persistence and auth edge cases, and ends with a realistic effort estimate.",

      actions: [
        { label: "Watch on Loom", href: "https://www.loom.com/share/176db8b8b80148efbbfc1723ee280f6d", style: "solid", external: true }
      ],

      metaTags: [
        { icon: "sparkle", label: "Others" },
        { icon: "store", label: "How I Work" }
      ],

      annotation: { lines: ["Check first,", "then estimate."] },

      visual: {
        video: {
          loomId: "176db8b8b80148efbbfc1723ee280f6d",
          thumb: "../../assets/images/videos/mvp-review.jpg",
          duration: "2:57"
        }
      },

      metrics: [
        { value: "4", label: "Things Verified", note: "Access policies, secrets, persistence, auth" },
        { value: "Day One", label: "Review", note: "What to check first" },
        { value: "Realistic", label: "Effort Estimate", note: "Given at the end of the review" },
        { value: "2:57", label: "Walkthrough", note: "Recorded on Loom" }
      ],

      tools: [
        { key: "vd_code_review", name: "Code Review" },
        { key: "vd_access_policies", name: "Access Policies" },
        { key: "vd_secrets", name: "Exposed Secrets" },
        { key: "vd_persistence", name: "Real Persistence" },
        { key: "vd_auth_edges", name: "Auth Edge Cases" },
        { key: "vd_estimate", name: "Effort Estimate" }
      ],

      cards: [
        { title: "What It Does", body: "A first-day review of a codebase someone else built: what to check first, and how to confirm it actually works the way it appears to." },
        { title: "What the Video Shows", list: ["Access policies", "Exposed secrets", "Demo data masquerading as real persistence", "Auth edge cases", "A realistic effort estimate at the end"] },
        { title: "Where It Fits", eyebrow: "Use on: how I work", body: "Anyone taking over an MVP who needs to know what they have before deciding what to build next." }
      ],

      cta: {
        label: "Ready to build something similar?",
        heading: "Inherited a codebase?",
        supporting: "Know what you have before you build on it.",
        button: { label: "Start a Project", href: "/index.html#contact" },
        decorative: ["Checked", "Verified", "Estimated"]
      }
    }
  };
})();
