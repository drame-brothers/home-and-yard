// ═══════════════════════════════════════════════════════════════
// DRAME BROTHERS HOME & YARD — Shared Components
// components.js
//
// Renders shared UI into placeholder divs on each page.
// Requires config.js to be loaded first (DB must exist).
//
// Usage on inner pages:
//   <div id="site-header"></div>
//   ...page content...
//   <div id="site-footer"></div>
//   <script src="config.js"></script>
//   <script src="components.js"></script>
//   <script>
//     renderTopbar('site-header', { ... });
//     renderFooter('site-footer');
//   </script>
// ═══════════════════════════════════════════════════════════════

// ── Landing page navigation bar ──────────────────────────────
// Used only on index.html.
function renderNav(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML =
    '<nav class="nav" aria-label="Site navigation">' +
      '<ul class="nav-links">' +
        '<li><a href="#about">About</a></li>' +
        '<li><a href="#services">Services</a></li>' +
        '<li><a href="#contact">Contact</a></li>' +
      '</ul>' +
    '</nav>';

  // Smooth scroll for nav links
  el.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

// ── Inner page topbar + optional page hero ────────────────────
// Used on home-cleaning, small-business, yard-garden, feedback.
//
// options = {
//   heroTitle:    'Page Title',       (required for hero)
//   heroSubtitle: 'Subtitle text.',   (optional)
//   showPhone:    true/false,         (default false)
//   phoneNote:    'to get an estimate over the phone.'  (optional suffix)
// }
function renderTopbar(containerId, options) {
  var el = document.getElementById(containerId);
  if (!el) return;
  options = options || {};

  // Topbar bar
  var html =
    '<div class="topbar">' +
      '<a href="index.html" class="topbar-logo">' + DB.business.name + '</a>' +
      '<a href="index.html" class="topbar-back">← Back to Home</a>' +
    '</div>';

  // Optional page hero
  if (options.heroTitle) {
    html += '<div class="page-hero">';
    html += '<h1>' + options.heroTitle + '</h1>';
    if (options.heroSubtitle) {
      html += '<p>' + options.heroSubtitle + '</p>';
    }
    if (options.showPhone) {
      var suffix = options.phoneNote
        ? ' ' + options.phoneNote
        : '.';
      html +=
        '<div class="phone-line">Rather talk to a person? Call ' +
        '<a href="tel:' + DB.business.phoneHref + '">' + DB.business.phone + '</a>' +
        suffix +
        '</div>';
    }
    html += '</div>';
  }

  el.innerHTML = html;
}

// ── Shared footer ────────────────────────────────────────────
// Identical across all pages. Phone and email come from config.
function renderFooter(containerId) {
  var el = document.getElementById(containerId);
  if (!el) return;
  var year = new Date().getFullYear();
  el.innerHTML =
    '<footer class="footer" id="contact" aria-label="Contact">' +
      '<div class="footer-inner">' +
        '<div>' +
          '<h3>' + DB.business.nameLines[0] + '<br>' + DB.business.nameLines[1] + '</h3>' +
          '<p class="footer-tagline">' + DB.business.location + '</p>' +
        '</div>' +
        '<div class="footer-contact">' +
          '<h4>Contact Us</h4>' +
          '<p><a href="mailto:' + DB.business.email + '">' + DB.business.email + '</a></p>' +
          '<p><a href="tel:' + DB.business.phoneHref + '">' + DB.business.phone + '</a></p>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>&copy; ' + year + ' ' + DB.business.name + '</span>' +
        '<span>West Philadelphia, PA</span>' +
      '</div>' +
    '</footer>';
}
