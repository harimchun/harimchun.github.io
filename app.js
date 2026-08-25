document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initDoiCopy();
  initReveal();
  initNavActive();
});

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const sync = () => {
    const isDark = document.documentElement.dataset.theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  toggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    sync();
  });

  sync();
}

function initMobileNav() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };

  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
  });
  matchMedia('(min-width: 781px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

function initDoiCopy() {
  document.querySelectorAll('.copy-doi').forEach((button) => {
    button.addEventListener('click', async () => {
      const doi = button.dataset.doi;
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(doi);
        button.textContent = 'Copied';
      } catch {
        const input = document.createElement('textarea');
        input.value = doi;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
        button.textContent = 'Copied';
      }
      window.setTimeout(() => { button.textContent = original; }, 1600);
    });
  });
}

function initReveal() {
  const elements = [...document.querySelectorAll('.reveal')];
  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

  elements.forEach((element) => observer.observe(element));
}

function initNavActive() {
  const links = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  let scheduled = false;
  const setActive = () => {
    const headerHeight = document.getElementById('site-header')?.offsetHeight || 68;
    const y = window.scrollY + headerHeight + 32;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.offsetTop <= y) current = section;
    });
    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${current.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  };

  window.addEventListener('scroll', () => {
    if (!scheduled) {
      requestAnimationFrame(setActive);
      scheduled = true;
    }
  }, { passive: true });
  window.addEventListener('resize', setActive, { passive: true });
  setActive();
}
