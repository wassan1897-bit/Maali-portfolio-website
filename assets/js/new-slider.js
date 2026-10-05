/* The old #projects 3D-perspective slider (CustomEase registration,
   card stacking, prev/next/goto navigation, project-details overlay)
   lived here and has been removed - the section now runs on
   assets/js/portfolio-stage.js. Everything below this point predates
   and is unrelated to that slider: the video-demos overlay and its
   pagination.
   ================================================================ */

// =========================================================================
// Video Demos Overlay Logic (Page Swap)
//
// The overlay is one generic showcase reused by all twelve demo rows.
// Everything on it is read off the clicked .demos-trigger: the number and
// the category come from the spans already present in the row, so adding a
// demo needs no duplicated data. data-tools is the only field a row has to
// declare, and a row without it renders the strip with no tools column
// rather than inventing a stack for it.
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('.demos-trigger');
  const overlay = document.getElementById('demos-details');
  const closeBtn = document.getElementById('demos-close-btn');
  const titleEl = document.getElementById('demos-title');
  const descEl = document.getElementById('demos-desc');
  const numberEl = document.getElementById('demos-number');
  const categoryEl = document.getElementById('demos-category');
  const videoContainer = document.getElementById('demos-video-container');
  const toolsEl = document.getElementById('demos-tools');
  const toolsCol = document.getElementById('demos-tools-col');
  const stripDivider = document.getElementById('demos-strip-divider');
  const linkEl = document.getElementById('demos-link');
  const linkUrlEl = document.getElementById('demos-link-url');

  if (!overlay) return;

  // slug -> display name + icon file in assets/images/tools/
  const TOOLS = {
    loom: { name: 'Loom', icon: 'loom.svg' },
    n8n: { name: 'n8n', icon: 'n8n.svg' },
    googledrive: { name: 'Google Drive', icon: 'googledrive.svg' },
    googlesheets: { name: 'Google Sheets', icon: 'googlesheets.svg' },
    googledocs: { name: 'Google Docs', icon: 'googledocs.svg' },
    openai: { name: 'OpenAI', icon: 'openai.svg' },
    gemini: { name: 'Gemini', icon: 'gemini.svg' },
    supabase: { name: 'Supabase', icon: 'supabase.svg' },
    airtable: { name: 'Airtable', icon: 'airtable.svg' },
    hubspot: { name: 'HubSpot', icon: 'hubspot.svg' },
    make: { name: 'Make', icon: 'make.svg' },
    stripe: { name: 'Stripe', icon: 'stripe.svg' },
    twilio: { name: 'Twilio', icon: 'twilio.svg' },
    python: { name: 'Python', icon: 'python.svg' },
    github: { name: 'GitHub', icon: 'github.svg' },
    vercel: { name: 'Vercel', icon: 'vercel.svg' },
    anthropic: { name: 'Anthropic', icon: 'anthropic.svg' },
    meta: { name: 'Meta', icon: 'meta.svg' },
    google: { name: 'Google', icon: 'google.svg' }
  };

  const ESCAPES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);

  // The listing stores categories in caps; the showcase pill reads better
  // in title case, with the initialisms kept upper.
  const titleCase = (value) =>
    String(value)
      .toLowerCase()
      .replace(/\b([a-z])/g, (m) => m.toUpperCase())
      .replace(/\b(Rag|Crm|Ai|Api|Mvp)\b/g, (m) => m.toUpperCase());

  function rowSpans(trigger) {
    return Array.from(
      trigger.querySelectorAll('.feature-three-left .feature-three-text')
    ).map((el) => el.textContent.trim());
  }

  function renderTools(list) {
    if (!toolsEl || !toolsCol) return;

    const slugs = (list || '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s && TOOLS[s]);

    if (!slugs.length) {
      toolsCol.style.display = 'none';
      if (stripDivider) stripDivider.style.display = 'none';
      toolsEl.innerHTML = '';
      return;
    }

    toolsCol.style.display = '';
    if (stripDivider) stripDivider.style.display = '';
    toolsEl.innerHTML = slugs
      .map((slug) => {
        const tool = TOOLS[slug];
        return (
          '<span class="ds-tool">' +
          '<img src="assets/images/tools/' + tool.icon + '" alt="" aria-hidden="true" loading="lazy" />' +
          '<span>' + escapeHtml(tool.name) + '</span>' +
          '</span>'
        );
      })
      .join('');
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const title = trigger.getAttribute('data-title');
      const desc = trigger.getAttribute('data-desc');
      const loomId = trigger.getAttribute('data-loom-id');
      const spans = rowSpans(trigger);
      const number = trigger.getAttribute('data-number') || spans[0] || '';
      const category = trigger.getAttribute('data-category') || spans[2] || '';
      const shareUrl = 'https://www.loom.com/share/' + loomId;

      // data-title-lines pins the wrap the design calls for; without it the
      // title just wraps naturally.
      const titleLines = trigger.getAttribute('data-title-lines');
      if (titleLines) {
        titleEl.innerHTML = titleLines
          .split('|')
          .map((line) => escapeHtml(line.trim()))
          .join(' <br />');
      } else {
        titleEl.textContent = title;
      }
      descEl.textContent = desc;
      if (numberEl) numberEl.textContent = number;
      if (categoryEl) categoryEl.textContent = titleCase(category);

      renderTools(trigger.getAttribute('data-tools'));

      if (linkEl && linkUrlEl) {
        linkEl.setAttribute('href', shareUrl);
        linkUrlEl.textContent = shareUrl;
      }

      videoContainer.innerHTML =
        '<iframe src="https://www.loom.com/embed/' + loomId +
        '?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true" ' +
        'title="' + escapeHtml(title || 'Loom demo') + '" ' +
        'frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen ' +
        'allow="fullscreen; picture-in-picture"></iframe>';

      overlay.style.display = 'block';
      // force reflow
      void overlay.offsetWidth;
      overlay.style.opacity = '1';
      overlay.style.transform = 'translateY(0)';
      overlay.scrollTop = 0;

      // Disable body scroll
      document.body.style.overflow = 'hidden';
      document.body.classList.add('ds-open');
    });
  });

  function closeOverlay() {
    overlay.style.opacity = '0';
    overlay.style.transform = 'translateY(20px)';

    // Enable body scroll
    document.body.style.overflow = '';
    document.body.classList.remove('ds-open');

    setTimeout(() => {
      overlay.style.display = 'none';
      // Destroy iframe to stop video
      videoContainer.innerHTML = '';
    }, 400); // match transition time
  }

  closeBtn.addEventListener('click', closeOverlay);

  // Header links leave the showcase before jumping to their section.
  overlay.querySelectorAll('[data-ds-dismiss]').forEach((el) => {
    el.addEventListener('click', closeOverlay);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.style.display === 'block') closeOverlay();
  });

  // Set initial state for animation
  overlay.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  overlay.style.transform = 'translateY(20px)';
});



// =========================================================================
// Video Demos Pagination Logic
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const allItems = document.querySelectorAll('.demos-trigger');
  const prevBtn = document.getElementById('demos-prev');
  const nextBtn = document.getElementById('demos-next');
  if(!allItems.length || !prevBtn || !nextBtn) return;

  const itemsPerPage = 6;
  let currentPage = 1;
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  function renderPage(page) {
    // Scroll slightly up if needed, but smooth fade is better
    allItems.forEach((item, index) => {
      if (item.style.display !== 'none') {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
      }
    });

    setTimeout(() => {
      allItems.forEach((item, index) => {
        item.style.display = 'none';

        if(index >= (page - 1) * itemsPerPage && index < page * itemsPerPage) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'translateY(-10px)';
          // Force reflow
          void item.offsetWidth;

          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }
      });
    }, 300);

    // Update button states
    if(page === 1) {
      prevBtn.style.opacity = '0.5';
      prevBtn.style.pointerEvents = 'none';
      prevBtn.style.background = 'rgba(0,0,0,0.05)';
      prevBtn.style.color = '#111';
    } else {
      prevBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = 'auto';
      prevBtn.style.background = '#111';
      prevBtn.style.color = '#fff';
    }

    if(page === totalPages) {
      nextBtn.style.opacity = '0.5';
      nextBtn.style.pointerEvents = 'none';
      nextBtn.style.background = 'rgba(0,0,0,0.05)';
      nextBtn.style.color = '#111';
    } else {
      nextBtn.style.opacity = '1';
      nextBtn.style.pointerEvents = 'auto';
      nextBtn.style.background = '#111';
      nextBtn.style.color = '#fff';
    }
  }

  // Initial render (no animation needed for first load)
  allItems.forEach((item, index) => {
    if(index >= itemsPerPage) {
      item.style.display = 'none';
      item.style.opacity = '0';
    }
  });

  nextBtn.addEventListener('click', () => {
    if(currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
    }
  });

  prevBtn.addEventListener('click', () => {
    if(currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
    }
  });
});
