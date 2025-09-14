// loadPartial(url, selector)
async function loadPartial(url, selector) {
  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const html = await res.text();
    document.querySelector(selector).innerHTML = html;
    // set year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (e) {
    console.error('Failed to load partial', url, e);
  }
}

// aktifkan nav link berdasar pathname
function highlightActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
}

// call to load partials (every page)
document.addEventListener('DOMContentLoaded', () => {
  const navHolder = document.getElementById('navbar-holder');
  const footerHolder = document.getElementById('footer-holder');
  if (navHolder) loadPartial('/partials/navbar.html', '#navbar-holder').then(highlightActiveNav);
  if (footerHolder) loadPartial('/partials/footer.html', '#footer-holder');
});
