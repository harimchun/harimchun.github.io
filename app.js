// Minimal interactions: particle helix + scroll reveal + active nav highlight.
document.addEventListener('DOMContentLoaded', () => {
  initHelix();
  initReveal();
  initNavActive();
});

// Decorative DNA helix: two particle strands with depth-modulated dot size,
// drawn over one animation period (300px) repeated to y=1200 for a seamless loop.
function initHelix() {
  const g = document.getElementById('helix');
  if (!g) return;
  const NS = 'http://www.w3.org/2000/svg';
  const CX = 200, AMP = 140, PERIOD = 300, YMAX = 1200;
  const circle = (parent, x, y, r, opacity) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x.toFixed(2));
    c.setAttribute('cy', y);
    c.setAttribute('r', r.toFixed(2));
    c.setAttribute('opacity', opacity.toFixed(2));
    parent.appendChild(c);
  };
  const strands = document.createElementNS(NS, 'g');
  strands.setAttribute('class', 'pd');
  for (let y = 0; y <= YMAX; y += 10) {
    const th = (2 * Math.PI * y) / PERIOD;
    const s = Math.sin(th), z = Math.cos(th);
    [[CX + AMP * s, z], [CX - AMP * s, -z]].forEach(([x, depth]) => {
      const t = (depth + 1) / 2;
      circle(strands, x, y, 1.8 + 2.6 * t, 0.28 + 0.55 * t);
    });
  }
  const rungs = document.createElementNS(NS, 'g');
  rungs.setAttribute('class', 'pr');
  for (let y = 25; y < YMAX; y += 50) {
    if (y % 150 === 0) continue;
    const th = (2 * Math.PI * y) / PERIOD;
    const a = CX + AMP * Math.sin(th), b = CX - AMP * Math.sin(th);
    for (let i = 1; i <= 5; i++) {
      circle(rungs, a + ((b - a) * i) / 6, y, 1.7, 0.32);
    }
  }
  g.appendChild(strands);
  g.appendChild(rungs);
}

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
