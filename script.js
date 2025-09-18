// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior:'smooth', block:'start' });
    }
  });
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle with persistence
const themeBtn = document.getElementById('themeToggle');
const root = document.documentElement;
const setThemeIcon = () => {
  themeBtn.innerHTML = root.classList.contains('light')
    ? '<svg><use href="#i-moon"/></svg>'
    : '<svg><use href="#i-sun"/></svg>';
};
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') root.classList.add('light');
setThemeIcon();
themeBtn.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
  setThemeIcon();
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('.gallery-grid .shot').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});
document.querySelector('.lightbox-close').addEventListener('click', () => {
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden', 'true');
});
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
  }
});

// Back to top
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) toTop.classList.add('show');
  else toTop.classList.remove('show');
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Subtle tilt motion on cards (respects reduced motion)
(function addCardTilt() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;
  if (reduced || !canHover) return;

  const cards = document.querySelectorAll('.card.hover');
  cards.forEach(card => {
    let rafId = null;
    let currentX = 0, currentY = 0;
    const maxTilt = 8; // degrees

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0..1
      const y = (e.clientY - rect.top) / rect.height;   // 0..1
      currentX = (x - 0.5) * 2; // -1..1
      currentY = (y - 0.5) * 2; // -1..1
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rY = currentX * maxTilt;     // rotateY left/right
        const rX = -currentY * maxTilt;    // rotateX up/down
        card.style.transform = `perspective(900px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-6px) scale(1.01)`;
      });
    };

    const onLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      // Allow CSS hover transform to take back over
      card.style.transform = '';
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
  });
})();

// Make project cards open live links when clicked (and accessible)
(function clickThroughCards(){
  const cards = document.querySelectorAll('.card.hover[data-live]');
  cards.forEach(card => {
    const url = card.getAttribute('data-live');
    if (!url) return;
    card.addEventListener('click', (e) => {
      // Don’t hijack clicks on inner anchors/buttons
      if (e.target.closest('a, button')) return;
      window.open(url, '_blank', 'noopener');
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.open(url, '_blank', 'noopener');
      }
    });
  });
})();
