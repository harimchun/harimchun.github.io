// Minimal interactions: scroll reveal + active nav highlight.
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initNavActive();
});

function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.body.classList.add('no-observer');
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function initNavActive() {
  const links = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  const setActive = () => {
    const y = window.scrollY + 90;
    let current = sections[0];
    sections.forEach((sec) => {
      if (sec.offsetTop <= y) current = sec;
    });
    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
}
