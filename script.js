/* ================================================================
   Small, dependency-free enhancements:
   - sticky header state
   - mobile navigation
   - subtle scroll reveal
   - automatic footer year
   ================================================================ */

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const navLinks = nav ? nav.querySelectorAll('a') : [];

function updateHeader() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 18);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
  });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );

  revealItems.forEach((item) => observer.observe(item));
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

/* ---- TOP CSA certificate carousel ---- */
(function () {
  // EDIT: add or remove certificate image paths here. That's the only
  // change needed to manage which certificates appear.
  const certificates = [
    "assets/LTV Cert2.jpg",
    "assets/LTV Cert3.jpg",
    "assets/LTV Cert1.jpg",
    "assets/LTV Cert4.jpg",
    "assets/LTV Cert5.jpg",
    "assets/LTV Cert6.jpg",
    "assets/LTV Cert7.jpg",
    "assets/LTV Cert8.jpg",
  ];

  const mount = document.querySelector('[data-carousel]');
  if (!mount) return;

  const track = mount.querySelector('[data-carousel-track]');
  const prevBtn = mount.querySelector('[data-carousel-prev]');
  const nextBtn = mount.querySelector('[data-carousel-next]');
  const dotsWrap = mount.querySelector('[data-carousel-dots]');

  // No images configured yet: keep the original placeholder, no controls.
  if (!certificates.length) {
    track.innerHTML = `
      <div class="certificate-placeholder" role="img" aria-label="Top CSA certificate placeholder">
        <span class="certificate-seal">CSA</span>
        <strong>Top CSA Recognition</strong>
        <small>SidelineSwap · certificate image placeholder</small>
      </div>`;
    prevBtn.hidden = true;
    nextBtn.hidden = true;
    return;
  }

  certificates.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Top CSA certificate ${i + 1}`;
    img.className = 'certificate-slide' + (i === 0 ? ' is-active' : '');
    track.appendChild(img);
  });

  const hasMultiple = certificates.length > 1;
  prevBtn.hidden = !hasMultiple;
  nextBtn.hidden = !hasMultiple;
  dotsWrap.hidden = !hasMultiple;

  let dots = [];
  if (hasMultiple) {
    dots = certificates.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'certificate-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Show certificate ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      return dot;
    });
  }

  const slides = track.querySelectorAll('.certificate-slide');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer = null;

  function goTo(next) {
    slides[index].classList.remove('is-active');
    if (dots[index]) dots[index].classList.remove('is-active');
    index = (next + certificates.length) % certificates.length;
    slides[index].classList.add('is-active');
    if (dots[index]) dots[index].classList.add('is-active');
  }

  function start() {
    if (!hasMultiple || reduceMotion || timer) return;
    timer = setInterval(() => goTo(index + 1), 2600);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  if (hasMultiple) {
    mount.addEventListener('mouseenter', start);
    mount.addEventListener('mouseleave', stop);
    mount.addEventListener('focusin', start);
    mount.addEventListener('focusout', stop);

    prevBtn.addEventListener('click', () => { stop(); goTo(index - 1); });
    nextBtn.addEventListener('click', () => { stop(); goTo(index + 1); });
  }
})();
