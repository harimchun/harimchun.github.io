// app.js
document.addEventListener('DOMContentLoaded', () => {
  initTyping();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initSkills();
  initFormValidation();
  initThemeToggle();
  initNavActive();
});

/* Typing Animation */
function initTyping() {
  const elements = document.querySelectorAll('.typing-text');
  elements.forEach((el, idx) => {
    const text = el.getAttribute('data-text');
    const delay = parseInt(el.getAttribute('data-delay')) || 0;
    setTimeout(() => {
      let i = 0;
      const cursor = setInterval(() => {
        if (i < text.length) {
          el.textContent += text.charAt(i++);
        } else {
          clearInterval(cursor);
          setTimeout(() => { el.style.borderRight = 'none'; }, 500);
        }
      }, 100);
    }, delay);
  });
}

/* Smooth Scroll */
function initSmoothScroll() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 60,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* Scroll Reveal */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        if (entry.target.classList.contains('stat-item')) {
          animateCounter(entry.target.querySelector('.stat-number'));
        }
        if (entry.target.classList.contains('skill-progress')) {
          // handled in initSkills
        }
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stat-item, .about-text p, .timeline-item, .research-card, .experience-item, .publication-item, .award-item, .teaching-item').forEach(el => {
    observer.observe(el);
  });
}

/* Counter Animation */
function initCounters() {
  // triggered by scroll reveal
}
function animateCounter(el) {
  if (el.classList.contains('counted')) return;
  el.classList.add('counted');
  const target = parseInt(el.getAttribute('data-target'));
  let count = 0;
  const step = target / (1500 / 16);
  const timer = setInterval(() => {
    count += step;
    if (count >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(count);
    }
  }, 16);
}

/* Skill Bars */
function initSkills() {
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-progress').forEach((bar, idx) => {
          setTimeout(() => {
            bar.style.width = bar.getAttribute('data-width') + '%';
          }, idx * 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));
}

/* Form Validation */
function initFormValidation() {
  const form = document.getElementById('contact-form');
  const inputs = form.querySelectorAll('.form-control');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFeedback(input));
  });
  form.addEventListener('submit', handleFormSubmit);
}
function validateField(field) {
  const value = field.value.trim();
  const feedback = field.parentElement.querySelector('.form-feedback');
  let valid = true, msg = '';
  if (!value) {
    valid = false; msg = 'This field is required.';
  }
  if (field.type === 'email' && value) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) { valid = false; msg = 'Enter a valid email.'; }
  }
  if (field.name === 'name' && value && value.length < 2) {
    valid = false; msg = 'Name must be at least 2 characters.';
  }
  if (field.name === 'message' && value && value.length < 10) {
    valid = false; msg = 'Message must be at least 10 characters.';
  }
  if (!valid) {
    feedback.textContent = msg;
    feedback.classList.add('show');
  }
  return valid;
}
function clearFeedback(field) {
  const feedback = field.parentElement.querySelector('.form-feedback');
  feedback.textContent = '';
  feedback.classList.remove('show');
}
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  let validForm = true;
  form.querySelectorAll('.form-control').forEach(input => {
    if (!validateField(input)) validForm = false;
  });
  if (validForm) {
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Sent!';
      setTimeout(() => {
        form.reset();
        btn.textContent = original;
        btn.disabled = false;
        form.querySelectorAll('.form-control').forEach(input => clearFeedback(input));
      }, 1500);
    }, 1000);
  }
}

/* Theme Toggle */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  let dark = document.documentElement.getAttribute('data-theme') === 'dark';
  toggle.textContent = dark ? '☀️' : '🌙';

  toggle.addEventListener('click', () => {
    dark = !dark;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    toggle.textContent = dark ? '☀️' : '🌙';
  });
}

/* Active Nav Link on Scroll */
function initNavActive() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY + 80;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
    // Navbar background darken on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.style.background = darkTheme() ? 'rgba(16,20,35,0.95)' : 'rgba(255,255,255,0.95)';
      navbar.style.borderBottom = darkTheme() ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--color-border)';
    } else {
      navbar.style.background = darkTheme() ? 'var(--color-surface)' : 'var(--color-surface)';
      navbar.style.borderBottom = darkTheme() ? '1px solid var(--color-glass-border)' : '1px solid var(--color-border)';
    }
  });
}
function darkTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

